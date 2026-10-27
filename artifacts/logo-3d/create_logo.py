import bpy
import math
import sys
from pathlib import Path
from mathutils import Vector


output = Path(__file__).resolve().parent
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.samples = 96
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 24
scene.cycles.transmission_bounces = 16
scene.render.resolution_x = 1600
scene.render.resolution_y = 1200
scene.render.resolution_percentage = 100
scene.world.color = (0.08, 0.08, 0.08)
scene.world.use_nodes = True
scene.world.node_tree.nodes.get("Background").inputs["Color"].default_value = (0.22, 0.24, 0.3, 1)
scene.world.node_tree.nodes.get("Background").inputs["Strength"].default_value = 0.7
scene.view_settings.view_transform = "AgX"


def linear_color(hex_color):
    values = [int(hex_color[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(v / 12.92 if v < 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in values) + (1,)


def material(name, color, glass=False):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = linear_color(color)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = linear_color(color)
    shader.inputs["Roughness"].default_value = 0.12 if glass else 0.3
    if glass:
        shader.inputs["Transmission Weight"].default_value = 1
        shader.inputs["IOR"].default_value = 1.46
        shader.inputs["Coat Weight"].default_value = 0.35
    return mat


def gradient_material(name):
    mat = material(name, "FFFFFF", glass=True)
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    shader = nodes.get("Principled BSDF")
    coordinates = nodes.new("ShaderNodeTexCoord")
    separate = nodes.new("ShaderNodeSeparateXYZ")
    ramp = nodes.new("ShaderNodeValToRGB")
    links.new(coordinates.outputs["Generated"], separate.inputs["Vector"])
    links.new(separate.outputs["X"], ramp.inputs["Fac"])
    stops = [(0, "F45B71"), (0.38, "B55C93"), (0.64, "8C60CD"), (0.82, "2F97CF"), (1, "2F97CF")]
    ramp.color_ramp.elements.remove(ramp.color_ramp.elements[1])
    for index, (position, color) in enumerate(stops):
        stop = ramp.color_ramp.elements[0] if index == 0 else ramp.color_ramp.elements.new(position)
        stop.position = position
        rgb = linear_color(color)
        stop.color = rgb
    tint = nodes.new("ShaderNodeMixRGB")
    tint.blend_type = "MIX"
    tint.inputs[0].default_value = 0.45
    tint.inputs[1].default_value = (1, 1, 1, 1)
    links.new(ramp.outputs["Color"], tint.inputs[2])
    links.new(tint.outputs["Color"], shader.inputs["Base Color"])
    shader.inputs["Roughness"].default_value = 0.14
    shader.inputs["IOR"].default_value = 1.38
    shader.inputs["Coat Weight"].default_value = 0.18
    fresnel = nodes.new("ShaderNodeFresnel")
    fresnel.inputs["IOR"].default_value = 1.38
    strength = nodes.new("ShaderNodeMath")
    strength.operation = "MULTIPLY"
    strength.inputs[1].default_value = 0.65
    links.new(fresnel.outputs["Fac"], strength.inputs[0])
    ambient = nodes.new("ShaderNodeMath")
    ambient.operation = "ADD"
    ambient.inputs[1].default_value = 0.12
    links.new(strength.outputs["Value"], ambient.inputs[0])
    links.new(ambient.outputs["Value"], shader.inputs["Emission Strength"])
    links.new(ramp.outputs["Color"], shader.inputs["Emission Color"])
    return mat


def fuse(objects, name, mat):
    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        bpy.context.view_layer.objects.active = obj
        for modifier in list(obj.modifiers):
            bpy.ops.object.modifier_apply(modifier=modifier.name)
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.join()
    obj = bpy.context.object
    obj.name = name
    remesh = obj.modifiers.new("Continuous pill surface", "REMESH")
    remesh.mode = "VOXEL"
    remesh.voxel_size = 0.035
    remesh.use_smooth_shade = True
    bpy.ops.object.modifier_apply(modifier=remesh.name)
    smooth = obj.modifiers.new("Polished surface", "SMOOTH")
    smooth.factor = 0.8 if "--app-icon" in sys.argv else 1.2
    smooth.iterations = 80 if "--app-icon" in sys.argv else 5
    bpy.ops.object.modifier_apply(modifier=smooth.name)
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    for polygon in obj.data.polygons:
        polygon.material_index = 0
        polygon.use_smooth = True
    return obj


def capsule_outline(width, height, inset=0):
    radius = min(width, height) / 2 - inset
    left, right = inset + radius, width - inset - radius
    top, bottom = inset + radius, height - inset - radius
    points = []
    for cx, cy, start in [(right, bottom, 0), (left, bottom, 90), (left, top, 180), (right, top, 270)]:
        for step in range(17):
            angle = math.radians(start + step * 90 / 16)
            point = (cx + radius * math.cos(angle), cy + radius * math.sin(angle))
            if not points or (Vector(point) - Vector(points[-1])).length > 0.0001:
                points.append(point)
    if (Vector(points[0]) - Vector(points[-1])).length < 0.0001:
        points.pop()
    return points


def solid(name, width, height, transform, depth, center, mat, inset=0, bevel=0.74):
    outline = capsule_outline(width, height, inset)
    a, b, c, d, tx, ty = transform
    front_back = (center - depth / 2, center + depth / 2)
    vertices = [((a * x + c * y + tx - 470) / 100, layer, (360 - b * x - d * y - ty) / 100) for layer in front_back for x, y in outline]
    count = len(outline)
    faces = [tuple(range(count - 1, -1, -1)), tuple(range(count, 2 * count))]
    faces += [(i, (i + 1) % count, (i + 1) % count + count, i + count) for i in range(count)]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    for polygon in mesh.polygons:
        polygon.use_smooth = True
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.object.mode_set(mode="OBJECT")
    obj.select_set(False)
    modifier = obj.modifiers.new("Soft glass edges", "BEVEL")
    modifier.width = bevel
    modifier.segments = 12
    modifier.limit_method = "ANGLE"
    modifier.angle_limit = 0.4
    modifier.use_clamp_overlap = False
    modifier.harden_normals = True
    obj.modifiers.new("Weighted normals", "WEIGHTED_NORMAL")
    return obj


strokes = [
    ("M left", 220, 743.147, (0.866025, 0.5, -0.530526, 0.847668, 395.259, 1)),
    ("M right", 220, 667.582, (0.866025, 0.5, -0.530526, 0.847668, 654.315, 0)),
    ("E top", 440, 220, (1, 0, 0, 1, 584, 40)),
    ("E bottom", 440, 220, (1, 0, 0, 1, 584, 480)),
    ("E middle", 220, 220, (1, 0, 0, 1, 803.76, 260)),
    ("Shared spine", 220, 660, (1, 0, 0, 1, 583.76, 40)),
]

if "--app-icon" in sys.argv:
    strokes[0] = ("M left", 220, 743.147, (0.866025, 0.5, -0.530526, 0.847668, 440.259, 1))
    strokes[4] = ("E middle", 200, 200, (1, 0, 0, 1, 813.76, 270))

shells = []
glass = gradient_material("Tinted glass with luminous edges")
for name, width, height, transform in strokes:
    shells.append(solid(name + " | Glass", width, height, transform, 1.5, 0, glass))
fuse(shells, "ME | Continuous glass", glass)

floor = material("Slate satin", "344052")
profile = [(-100, -3.95)]
profile += [(3 + 4 * math.sin(step * math.pi / 64), 0.05 - 4 * math.cos(step * math.pi / 64)) for step in range(33)]
profile.append((7, 100))
vertices = [(x, y, z) for x in (-100, 100) for y, z in profile]
count = len(profile)
faces = [(i, i + 1, i + 1 + count, i + count) for i in range(count - 1)]
mesh = bpy.data.meshes.new("Seamless backdrop")
mesh.from_pydata(vertices, [], faces)
mesh.update()
for polygon in mesh.polygons:
    polygon.use_smooth = True
backdrop = bpy.data.objects.new("Seamless studio", mesh)
bpy.context.collection.objects.link(backdrop)
backdrop.data.materials.append(floor)


def aim(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


def area(name, location, power, size, color):
    data = bpy.data.lights.new(name, "AREA")
    data.energy = power
    data.shape = "RECTANGLE"
    data.size = size
    data.size_y = size * 0.22
    data.color = color
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    aim(obj, (0, 0, 0))


area("Large softbox", (-5, -8, 10), 900, 7, (0.8, 0.88, 1))
area("Coral edge light", (-8, 2, 3), 650, 5, (1, 0.3, 0.4))
area("Blue edge light", (8, 3, 7), 1100, 5, (0.3, 0.55, 1))
bpy.ops.object.camera_add(location=(3, -28, 5))
camera = bpy.context.object
camera.name = "Logo presentation"
aim(camera, (0.15, 0, -0.15))
camera.data.type = "ORTHO"
camera.data.ortho_scale = 14
scene.camera = camera

compositor = bpy.data.node_groups.new("Neon bloom", "CompositorNodeTree")
compositor.interface.new_socket(name="Image", in_out="OUTPUT", socket_type="NodeSocketColor")
scene.compositing_node_group = compositor
nodes = compositor.nodes
render = nodes.new("CompositorNodeRLayers")
glare = nodes.new("CompositorNodeGlare")
glare.inputs["Type"].default_value = "Fog Glow"
glare.inputs["Quality"].default_value = "High"
glare.inputs["Threshold"].default_value = 0.3
glare.inputs["Strength"].default_value = 0.3
glare.inputs["Size"].default_value = 0.35
composite = nodes.new("NodeGroupOutput")
compositor.links.new(render.outputs["Image"], glare.inputs["Image"])
compositor.links.new(glare.outputs["Image"], composite.inputs["Image"])

for screen in bpy.data.screens:
    for space in screen.areas:
        if space.type == "VIEW_3D":
            space.spaces.active.region_3d.view_perspective = "CAMERA"
            space.spaces.active.shading.type = "MATERIAL"

scene.render.image_settings.file_format = "PNG"
scene.render.filepath = str(output / "me-glass-neon.png")
if __name__ == "__main__":
    bpy.ops.wm.save_as_mainfile(filepath=str(output / "me-glass-neon.blend"))
    bpy.ops.render.render(write_still=True)
