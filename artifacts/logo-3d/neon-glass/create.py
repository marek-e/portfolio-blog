import argparse
import json
import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector


root = Path(__file__).resolve().parent
sys.path.insert(0, str(root))
from construction import build_strokes

parser = argparse.ArgumentParser()
parser.add_argument("--preview", action="store_true")
parser.add_argument("--animate", action="store_true")
parser.add_argument("--front", action="store_true")
args = parser.parse_args(sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else [])
design = json.loads((root / "design.json").read_text())
output = root / ("preview" if args.preview else "output")
output.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.samples = (12 if args.animate else 24) if args.preview else 96
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 24
scene.cycles.transmission_bounces = 16
scene.render.resolution_x = (384 if args.animate else 512) if args.preview else 1024
scene.render.resolution_y = scene.render.resolution_x
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.view_settings.view_transform = "AgX"
scene.world.use_nodes = True
scene.world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.08, 0.08, 0.08, 1)
scene.world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.05


def color(source):
    values = [int(source[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(v / 12.92 if v < 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in values) + (1,)


glass = bpy.data.materials.new("Clear lavender glass | Fresnel neon edges")
glass.use_nodes = True
nodes = glass.node_tree.nodes
links = glass.node_tree.links
shader = nodes.get("Principled BSDF")
shader.inputs["Transmission Weight"].default_value = design["transmission"]
shader.inputs["Roughness"].default_value = design["roughness"]
shader.inputs["IOR"].default_value = design["ior"]
shader.inputs["Coat Weight"].default_value = 0.25
shader.inputs["Coat Roughness"].default_value = 0.025
fresnel = nodes.new("ShaderNodeFresnel")
fresnel.inputs["IOR"].default_value = design["ior"]
strength = nodes.new("ShaderNodeMath")
strength.operation = "MULTIPLY"
strength.inputs[1].default_value = design["edge_strength"]
threshold = nodes.new("ShaderNodeMath")
threshold.operation = "SUBTRACT"
threshold.inputs[1].default_value = 0.04
threshold.use_clamp = True
links.new(fresnel.outputs[0], threshold.inputs[0])
links.new(threshold.outputs[0], strength.inputs[0])
body_light = nodes.new("ShaderNodeMath")
body_light.operation = "ADD"
body_light.inputs[1].default_value = 0.075
links.new(strength.outputs[0], body_light.inputs[0])
links.new(body_light.outputs[0], shader.inputs["Emission Strength"])


def capsule(stroke):
    start, end = Vector(stroke["start"]), Vector(stroke["end"])
    delta = end - start
    angle = math.atan2(delta.y, delta.x) if delta.length else 0
    radius = stroke["width"] / 2
    def contour(inset):
        points = []
        r = max(radius - inset, 0.01)
        if delta.length == 0:
            return [(start.x + r * math.cos(i * math.tau / 96), start.y + r * math.sin(i * math.tau / 96)) for i in range(96)]
        for center, offset in ((end, -math.pi / 2), (start, math.pi / 2)):
            for step in range(49):
                theta = angle + offset + math.pi * step / 48
                points.append((center.x + r * math.cos(theta), center.y + r * math.sin(theta)))
        return points

    half = design["thickness"] / 2
    bevel = design["bevel"]
    profile = [(radius * 0.8, -half - 0.065), (radius * 0.5, -half - 0.05), (bevel, -half)]
    for step in range(1, 13):
        theta = math.pi / 2 * step / 12
        profile.append((bevel * (1 - math.sin(theta)), -half + bevel * (1 - math.cos(theta))))
    profile += [(inset, -depth) for inset, depth in reversed(profile)]
    count = len(contour(0))
    depth = stroke["depth"]
    vertices = [(x, depth + offset, z) for inset, offset in profile for x, z in contour(inset)]
    faces = [tuple(range(count - 1, -1, -1))]
    for ring in range(len(profile) - 1):
        for i in range(count):
            j = (i + 1) % count
            faces.append((ring * count + i, ring * count + j, (ring + 1) * count + j, (ring + 1) * count + i))
    faces.append(tuple(range((len(profile) - 1) * count, len(profile) * count)))
    mesh = bpy.data.meshes.new(stroke["name"])
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(stroke["name"], mesh)
    bpy.context.collection.objects.link(obj)
    material = glass.copy()
    material.name = stroke["name"] + " | Glass"
    material.node_tree.nodes.get("Principled BSDF").inputs["Base Color"].default_value = color(stroke["tint"])
    material.node_tree.nodes.get("Principled BSDF").inputs["Emission Color"].default_value = color(stroke["edge"])
    obj.data.materials.append(material)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.object.mode_set(mode="OBJECT")
    obj.select_set(False)
    for face in mesh.polygons:
        face.use_smooth = len(face.vertices) == 4
    obj.parent = assembly
    obj.visible_transmission = stroke.get("show_through_glass", True)
    return obj


assembly = bpy.data.objects.new("ME | Editable stroke assembly", None)
bpy.context.collection.objects.link(assembly)
assembly.rotation_euler.y = math.radians(0 if args.front else design["roll_degrees"])
assembly.scale = (design["logo_scale"],) * 3
for stroke in build_strokes(design):
    capsule(stroke)
bpy.context.view_layer.update()
points = [obj.matrix_world @ vertex.co for obj in assembly.children for vertex in obj.data.vertices]
assembly.location.x = -(min(p.x for p in points) + max(p.x for p in points)) / 2
assembly.location.z = -(min(p.z for p in points) + max(p.z for p in points)) / 2

bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 2.7, 0))
tile = bpy.context.object
tile.name = "Charcoal app tile"
tile.dimensions = (10.2, 3, 10.2)
bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
bevel = tile.modifiers.new("Rounded tile", "BEVEL")
bevel.width = 1.5
bevel.segments = 32
bpy.ops.object.modifier_apply(modifier=bevel.name)
tile.scale.y = 0.15
tile.modifiers.new("Tile normals", "WEIGHTED_NORMAL")
backing = bpy.data.materials.new("Charcoal satin")
backing.use_nodes = True
backing.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = color("050507")
backing.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.8
backing.node_tree.nodes["Principled BSDF"].inputs["Specular IOR Level"].default_value = 0.02
tile.data.materials.append(backing)


def aim(obj):
    obj.rotation_euler = (Vector((0, 0, 0)) - obj.location).to_track_quat("-Z", "Y").to_euler()


def light(name, position, power, size, tint, height):
    data = bpy.data.lights.new(name, "AREA")
    data.energy = power
    data.shape = "RECTANGLE"
    data.size = size
    data.size_y = height
    data.color = color(tint)[:3]
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = position
    obj.visible_transmission = False
    aim(obj)
    return obj


light("Lavender rim", (6, -1, 5), 650, 5, "AA85FF", 0.7)
light("Warm edge", (-6, 0, -1), 450, 5, "EBA5CE", 0.6)
light("Soft top reflection", (-2, -6, 7), 180, 7, "E2DCFF", 1.5)
sweep = light("Animated reflection strip", (-5, -5, 1), 50, 4, "E6DAFF", 7)
scene.render.fps = 24
scene.frame_start = 1
scene.frame_end = 72
for frame, x in ((1, -7), (36, 0), (72, 7)):
    sweep.location = (x, -5, 4)
    aim(sweep)
    sweep.keyframe_insert(data_path="location", frame=frame)
    sweep.keyframe_insert(data_path="rotation_euler", frame=frame)
scene.frame_set(36)
bpy.ops.object.camera_add(location=design["camera"])
camera = bpy.context.object
camera.name = "Near-frontal orthographic camera"
aim(camera)
camera.data.type = "ORTHO"
camera.data.ortho_scale = design["camera_scale"]
scene.camera = camera
compositor = bpy.data.node_groups.new("Restrained neon bloom", "CompositorNodeTree")
compositor.interface.new_socket(name="Image", in_out="OUTPUT", socket_type="NodeSocketColor")
scene.compositing_node_group = compositor
render = compositor.nodes.new("CompositorNodeRLayers")
glare = compositor.nodes.new("CompositorNodeGlare")
glare.inputs["Type"].default_value = "Fog Glow"
glare.inputs["Quality"].default_value = "High"
glare.inputs["Threshold"].default_value = 0.25
glare.inputs["Strength"].default_value = 0.5
glare.inputs["Size"].default_value = 0.5
result = compositor.nodes.new("NodeGroupOutput")
compositor.links.new(render.outputs["Image"], glare.inputs["Image"])
compositor.links.new(glare.outputs["Image"], result.inputs["Image"])
suffix = "front" if args.front else "angled"
scene.render.filepath = str(output / f"me-aligned-{suffix}.png")
scene.render.film_transparent = True
scene.render.image_settings.color_depth = "8"
scene.render.use_file_extension = True
bpy.ops.wm.save_as_mainfile(filepath=str(output / f"me-aligned-{suffix}.blend"))
if args.animate:
    frames = output / f"frames-{suffix}"
    frames.mkdir(exist_ok=True)
    scene.render.filepath = str(frames / "frame-")
    bpy.ops.render.render(animation=True)
else:
    bpy.ops.render.render(write_still=True)
