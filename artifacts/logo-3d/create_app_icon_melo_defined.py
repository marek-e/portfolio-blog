import bpy
import math
import sys
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED


root = Path(__file__).resolve().parent
preview = "--preview" in sys.argv
output = root / "app-icon-melo-defined" / "preview" if preview else root / "app-icon-melo-defined"
output.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(root / "app-icon-melo" / "me-melo.blend"))
scene = bpy.context.scene
scene.render.resolution_x = 512 if preview else 1024
scene.render.resolution_y = scene.render.resolution_x
scene.cycles.samples = 64 if preview else 256


def linear_color(value):
    channels = [int(value[index:index + 2], 16) / 255 for index in (0, 2, 4)]
    return tuple(channel / 12.92 if channel < 0.04045 else ((channel + 0.055) / 1.055) ** 2.4 for channel in channels) + (1,)


body = bpy.data.objects["ME | Continuous glass"]
lavender = body.data.materials[0]
position = lavender.node_tree.nodes.new("ShaderNodeNewGeometry")
stroke_axis = lavender.node_tree.nodes.new("ShaderNodeVectorMath")
stroke_axis.operation = "DOT_PRODUCT"
stroke_axis.inputs[1].default_value = (0.847668, 0, -0.530526)
diagonal_blend = lavender.node_tree.nodes.new("ShaderNodeMapRange")
diagonal_blend.inputs["From Min"].default_value = -0.18
diagonal_blend.inputs["From Max"].default_value = -0.12
tints = lavender.node_tree.nodes.new("ShaderNodeMixRGB")
tints.inputs[1].default_value = linear_color("C39ADB")
tints.inputs[2].default_value = linear_color("7D6FB6")
main_shader = lavender.node_tree.nodes.get("Principled BSDF")
lavender.node_tree.links.new(position.outputs["Position"], stroke_axis.inputs[0])
lavender.node_tree.links.new(stroke_axis.outputs["Value"], diagonal_blend.inputs["Value"])
lavender.node_tree.links.new(diagonal_blend.outputs["Result"], tints.inputs[0])
lavender.node_tree.links.new(tints.outputs["Color"], main_shader.inputs["Base Color"])
indigo = bpy.data.materials.new("Melo E indigo")
indigo.use_nodes = True
shader = indigo.node_tree.nodes.get("Principled BSDF")
shader.inputs["Base Color"].default_value = linear_color("50387D")
shader.inputs["Roughness"].default_value = 0.12
shader.inputs["Transmission Weight"].default_value = 0.35
shader.inputs["IOR"].default_value = 1.46
shader.inputs["Coat Weight"].default_value = 0.25
body.data.materials.append(indigo)
for face in body.data.polygons:
    face.material_index = 1 if face.center.x >= 1.1376 else 0
outline = []
for center_z, start in ((2.1, 0), (-2.3, math.pi)):
    for step in range(33):
        angle = start + step * math.pi / 32
        outline.append((2.2376 + 1.1 * math.cos(angle), center_z + 1.1 * math.sin(angle)))
vertices = [(x, depth, z) for depth in (-1.0, 0.5) for x, z in outline]
count = len(outline)
faces = [tuple(range(count - 1, -1, -1)), tuple(range(count, count * 2))]
faces += [(index, (index + 1) % count, (index + 1) % count + count, index + count) for index in range(count)]
mesh = bpy.data.meshes.new("Defined shared vertical")
mesh.from_pydata(vertices, [], faces)
mesh.update()
spine = bpy.data.objects.new("ME | Defined E spine", mesh)
bpy.context.collection.objects.link(spine)
spine.data.materials.append(indigo)
bpy.ops.object.select_all(action="DESELECT")
spine.select_set(True)
bpy.context.view_layer.objects.active = spine
bpy.ops.object.mode_set(mode="EDIT")
bpy.ops.mesh.select_all(action="SELECT")
bpy.ops.mesh.normals_make_consistent(inside=False)
bpy.ops.object.mode_set(mode="OBJECT")
bevel = spine.modifiers.new("Rounded shared vertical", "BEVEL")
bevel.width = 0.65
bevel.segments = 12
bevel.limit_method = "ANGLE"
bevel.angle_limit = 0.4
bevel.harden_normals = True
bpy.ops.object.modifier_apply(modifier=bevel.name)
for face in spine.data.polygons:
    face.use_smooth = True
normals = spine.modifiers.new("Polished normals", "WEIGHTED_NORMAL")
bpy.ops.object.modifier_apply(modifier=normals.name)
compositor = scene.compositing_node_group
nodes = compositor.nodes
for node in list(nodes):
    if node.bl_idname == "CompositorNodeOutputFile":
        nodes.remove(node)
alpha = next(node for node in nodes if node.bl_idname == "CompositorNodeSetAlpha")
overs = [node for node in nodes if node.bl_idname == "CompositorNodeAlphaOver"]
composite = next(node for node in nodes if node.bl_idname == "NodeGroupOutput")
compositor.links.new(overs[0].outputs["Image"], composite.inputs["Image"])
sizes = [512] if preview else [1024, 512, 256, 128, 64, 32]
files = nodes.new("CompositorNodeOutputFile")
files.directory = str(output)
files.file_name = "me-melo-defined-"
files.format.media_type = "IMAGE"
files.format.file_format = "PNG"
files.format.color_mode = "RGBA"
files.format.color_depth = "8"
files.format.compression = 80
files.save_as_render = True
for variant, image in (("transparent", alpha), ("cream", overs[1])):
    name = f"{variant}-{sizes[0]}"
    files.file_output_items.new("RGBA", name)
    compositor.links.new(image.outputs["Image"], files.inputs[name])
scene.render.filepath = str(output / f"me-melo-defined-indigo-{sizes[0]}.png")
bpy.ops.render.render(write_still=True)
for variant in ("transparent", "cream", "indigo"):
    master = output / f"me-melo-defined-{variant}-{sizes[0]}.png"
    for size in sizes[1:]:
        image = bpy.data.images.load(str(master), check_existing=False)
        image.scale(size, size)
        image.filepath_raw = str(output / f"me-melo-defined-{variant}-{size}.png")
        image.file_format = "PNG"
        image.save()
        bpy.data.images.remove(image)
if not preview:
    bpy.ops.wm.save_as_mainfile(filepath=str(output / "me-melo-defined.blend"), compress=True)
    with ZipFile(output / "me-melo-defined-pngs.zip", "w", ZIP_DEFLATED) as archive:
        for path in sorted(output.glob("me-melo-defined-*.png")):
            archive.write(path, path.name)
