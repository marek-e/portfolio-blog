import bpy
import sys
from pathlib import Path
from mathutils import Vector
from zipfile import ZipFile, ZIP_DEFLATED


root = Path(__file__).resolve().parent
preview = "--preview" in sys.argv
output = root / "app-icon-v2" / "preview" if preview else root / "app-icon-v2"
output.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(root / "app-icon" / "me-app-icon.blend"))
scene = bpy.context.scene
scene.view_settings.exposure = 0.5
scene.world.node_tree.nodes.get("Background").inputs["Strength"].default_value = 0.15
scene.render.resolution_x = 512 if preview else 1024
scene.render.resolution_y = scene.render.resolution_x
scene.cycles.samples = 64 if preview else 256
scene.render.film_transparent = True
scene.render.image_settings.color_mode = "RGBA"
scene.render.image_settings.file_format = "PNG"
glass = bpy.data.materials["Tinted glass with luminous edges"]
ramp = next(node for node in glass.node_tree.nodes if node.bl_idname == "ShaderNodeValToRGB")
for stop, color in zip(ramp.color_ramp.elements, ("FF5169", "FA5BB5", "865BFF", "00BFFF", "00BFFF")):
    channels = [int(color[index:index + 2], 16) / 255 for index in (0, 2, 4)]
    stop.color = tuple(value / 12.92 if value < 0.04045 else ((value + 0.055) / 1.055) ** 2.4 for value in channels) + (1,)
for node in glass.node_tree.nodes:
    if node.bl_idname == "ShaderNodeMath":
        node.inputs[1].default_value = 0.03 if node.operation == "ADD" else 0.35
    if node.bl_idname == "ShaderNodeMixRGB":
        node.inputs[0].default_value = 1.0
shader = glass.node_tree.nodes.get("Principled BSDF")
shader.inputs["Transmission Weight"].default_value = 0.9
shader.inputs["Roughness"].default_value = 0.025
shader.inputs["Coat Weight"].default_value = 0.6
shader.inputs["Coat Roughness"].default_value = 0.025
body = bpy.data.objects["ME | Continuous glass"]
shell = body.copy()
shell.data = body.data.copy()
shell.name = "ME | Clear V2 shell"
shell.visible_shadow = False
bpy.context.collection.objects.link(shell)
clear = bpy.data.materials.new("V2 clear glass border")
clear.use_nodes = True
clear_shader = clear.node_tree.nodes.get("Principled BSDF")
clear_shader.inputs["Base Color"].default_value = (1, 1, 1, 1)
clear_shader.inputs["Transmission Weight"].default_value = 1
clear_shader.inputs["Roughness"].default_value = 0.025
clear_shader.inputs["IOR"].default_value = 1.38
edge = clear.node_tree.nodes.new("ShaderNodeFresnel")
edge.inputs["IOR"].default_value = 1.46
brightness = clear.node_tree.nodes.new("ShaderNodeMath")
brightness.operation = "MULTIPLY"
brightness.inputs[1].default_value = 0.6
threshold = clear.node_tree.nodes.new("ShaderNodeMath")
threshold.operation = "SUBTRACT"
threshold.inputs[1].default_value = 0.08
threshold.use_clamp = True
clear.node_tree.links.new(edge.outputs["Fac"], threshold.inputs[0])
clear.node_tree.links.new(threshold.outputs[0], brightness.inputs[0])
clear.node_tree.links.new(brightness.outputs[0], clear_shader.inputs["Emission Strength"])
coordinates = clear.node_tree.nodes.new("ShaderNodeTexCoord")
separate = clear.node_tree.nodes.new("ShaderNodeSeparateXYZ")
edge_palette = clear.node_tree.nodes.new("ShaderNodeValToRGB")
edge_palette.color_ramp.elements.remove(edge_palette.color_ramp.elements[1])
for index, source in enumerate(ramp.color_ramp.elements):
    stop = edge_palette.color_ramp.elements[0] if index == 0 else edge_palette.color_ramp.elements.new(source.position)
    stop.position = source.position
    stop.color = source.color
pearl = clear.node_tree.nodes.new("ShaderNodeMixRGB")
pearl.inputs[0].default_value = 0.4
pearl.inputs[2].default_value = (1, 1, 1, 1)
clear.node_tree.links.new(coordinates.outputs["Generated"], separate.inputs["Vector"])
clear.node_tree.links.new(separate.outputs["X"], edge_palette.inputs["Fac"])
clear.node_tree.links.new(edge_palette.outputs["Color"], pearl.inputs[1])
clear.node_tree.links.new(pearl.outputs["Color"], clear_shader.inputs["Emission Color"])
shell.data.materials.clear()
shell.data.materials.append(clear)
for face in shell.data.polygons:
    face.material_index = 0
tree = bpy.data.node_groups.new("V2 glass surfaces", "GeometryNodeTree")
tree.interface.new_socket(name="Geometry", in_out="INPUT", socket_type="NodeSocketGeometry")
tree.interface.new_socket(name="Geometry", in_out="OUTPUT", socket_type="NodeSocketGeometry")
source = tree.nodes.new("NodeGroupInput")
grid = tree.nodes.new("GeometryNodeMeshToSDFGrid")
grid.inputs["Voxel Size"].default_value = 0.02
grid.inputs["Band Width"].default_value = 8
inset = tree.nodes.new("GeometryNodeSDFGridOffset")
inset.inputs["Distance"].default_value = -0.035
surface = tree.nodes.new("GeometryNodeGridToMesh")
surface.inputs["Threshold"].default_value = 0
result = tree.nodes.new("NodeGroupOutput")
tree.links.new(source.outputs["Geometry"], grid.inputs["Mesh"])
tree.links.new(grid.outputs["SDF Grid"], inset.inputs["Grid"])
tree.links.new(inset.outputs["Grid"], surface.inputs["Grid"])
tree.links.new(surface.outputs["Mesh"], result.inputs["Geometry"])
bpy.context.view_layer.objects.active = body
modifier = body.modifiers.new("Inset tinted glass", "NODES")
modifier.node_group = tree
bpy.ops.object.modifier_apply(modifier=modifier.name)
inner = tree.nodes.new("GeometryNodeSDFGridOffset")
inner.inputs["Distance"].default_value = -0.025
outer = tree.nodes.new("GeometryNodeSDFGridOffset")
outer.inputs["Distance"].default_value = 0.025
wall = tree.nodes.new("GeometryNodeSDFGridBoolean")
wall.operation = "DIFFERENCE"
for offset in (inner, outer):
    tree.links.new(grid.outputs["SDF Grid"], offset.inputs["Grid"])
tree.links.new(outer.outputs["Grid"], wall.inputs["Grid 1"])
tree.links.new(inner.outputs["Grid"], wall.inputs["Grid 2"])
tree.links.new(wall.outputs["Grid"], surface.inputs["Grid"])
bpy.context.view_layer.objects.active = shell
modifier = shell.modifiers.new("Clear volume shell", "NODES")
modifier.node_group = tree
bpy.ops.object.modifier_apply(modifier=modifier.name)
for obj, material in ((body, glass), (shell, clear)):
    obj.data.materials.clear()
    obj.data.materials.append(material)
    for face in obj.data.polygons:
        face.material_index = 0
        face.use_smooth = True
for obj in list(bpy.data.objects):
    if obj.type == "LIGHT":
        bpy.data.objects.remove(obj, do_unlink=True)


def softbox(name, location, energy, size, color):
    data = bpy.data.lights.new(name, "AREA")
    data.shape = "DISK"
    data.size = size
    data.energy = energy
    data.color = color
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    obj.visible_transmission = False
    obj.rotation_euler = (Vector((0, 0, 0)) - obj.location).to_track_quat("-Z", "Y").to_euler()


softbox("Pearl key", (-5, -6, 6), 1400, 8, (1, 0.9, 0.88))
softbox("Cyan rim", (6, 1, 5), 2000, 5, (0.5, 0.85, 1))
softbox("Coral rim", (-6, 1, 1), 1300, 5, (1, 0.45, 0.58))
compositor = scene.compositing_node_group
nodes = compositor.nodes
composite = next(node for node in nodes if node.bl_idname == "NodeGroupOutput")
alpha = next(node for node in nodes if node.bl_idname == "CompositorNodeSetAlpha")
alpha.inputs["Type"].default_value = "Replace Alpha"
glare = next(node for node in nodes if node.bl_idname == "CompositorNodeGlare")
glare.inputs["Strength"].default_value = 0.05
over = next(node for node in nodes if node.bl_idname == "CompositorNodeAlphaOver")
sizes = [512] if preview else [1024, 512, 256, 128, 64, 32]
transparent = nodes.new("CompositorNodeOutputFile")
transparent.directory = str(output)
transparent.file_name = "me-icon-v2-transparent-"
transparent.format.media_type = "IMAGE"
transparent.format.file_format = "PNG"
transparent.format.color_mode = "RGBA"
transparent.format.color_depth = "8"
transparent.format.compression = 80
transparent.save_as_render = True
transparent.file_output_items.new("RGBA", str(sizes[0]))
compositor.links.new(alpha.outputs["Image"], transparent.inputs[str(sizes[0])])
compositor.links.new(over.outputs["Image"], composite.inputs["Image"])
scene.render.filepath = str(output / f"me-icon-v2-background-{sizes[0]}.png")
bpy.ops.render.render(write_still=True)
for variant in ("transparent", "background"):
    master = output / f"me-icon-v2-{variant}-{sizes[0]}.png"
    for size in sizes[1:]:
        image = bpy.data.images.load(str(master), check_existing=False)
        image.scale(size, size)
        image.filepath_raw = str(output / f"me-icon-v2-{variant}-{size}.png")
        image.file_format = "PNG"
        image.save()
        bpy.data.images.remove(image)
if not preview:
    bpy.ops.wm.save_as_mainfile(filepath=str(output / "me-app-icon-v2.blend"), compress=True)
    with ZipFile(output / "me-app-icon-v2-pngs.zip", "w", ZIP_DEFLATED) as archive:
        for path in sorted(output.glob("me-icon-v2-*.png")):
            archive.write(path, path.name)
