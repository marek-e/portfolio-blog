import bpy
import sys
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED


root = Path(__file__).resolve().parent
preview = "--preview" in sys.argv
output = root / "app-icon-melo" / "preview" if preview else root / "app-icon-melo"
output.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(root / "app-icon" / "me-app-icon.blend"))
scene = bpy.context.scene
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Medium High Contrast"
scene.view_settings.exposure = 0.6
scene.render.resolution_x = 512 if preview else 1024
scene.render.resolution_y = scene.render.resolution_x
scene.cycles.samples = 64 if preview else 256


def linear_color(value):
    channels = [int(value[index:index + 2], 16) / 255 for index in (0, 2, 4)]
    return tuple(channel / 12.92 if channel < 0.04045 else ((channel + 0.055) / 1.055) ** 2.4 for channel in channels) + (1,)


glass = bpy.data.materials["Tinted glass with luminous edges"]
glass.name = "Melo lavender violet plum"
ramp = next(node for node in glass.node_tree.nodes if node.bl_idname == "ShaderNodeValToRGB")
for stop, color in zip(ramp.color_ramp.elements, ("C39ADB", "9665B6", "7D6FB6", "50387D", "50387D")):
    stop.color = linear_color(color)
body = bpy.data.objects["ME | Continuous glass"]
bpy.ops.object.select_all(action="DESELECT")
body.select_set(True)
bpy.context.view_layer.objects.active = body
bpy.ops.object.mode_set(mode="EDIT")
bpy.ops.mesh.select_all(action="SELECT")
bpy.ops.mesh.separate(type="LOOSE")
bpy.ops.object.mode_set(mode="OBJECT")
dot = min(bpy.context.selected_objects, key=lambda obj: len(obj.data.vertices))
dot.name = "ME | Melo amber dot"
gold = bpy.data.materials.new("Melo amber")
gold.use_nodes = True
shader = gold.node_tree.nodes.get("Principled BSDF")
shader.inputs["Base Color"].default_value = linear_color("FBA54D")
shader.inputs["Roughness"].default_value = 0.12
shader.inputs["Transmission Weight"].default_value = 0.65
shader.inputs["IOR"].default_value = 1.46
shader.inputs["Coat Weight"].default_value = 0.2
shader.inputs["Emission Color"].default_value = linear_color("FBA54D")
shader.inputs["Emission Strength"].default_value = 0.12
dot.data.materials.clear()
dot.data.materials.append(gold)
for face in dot.data.polygons:
    face.material_index = 0
bpy.data.objects["Large softbox"].data.color = (1, 0.89, 0.78)
bpy.data.objects["Soft rim"].data.color = (0.72, 0.6, 1)
compositor = scene.compositing_node_group
nodes = compositor.nodes
alpha = next(node for node in nodes if node.bl_idname == "CompositorNodeSetAlpha")
alpha.inputs["Type"].default_value = "Replace Alpha"
background = next(node for node in nodes if node.bl_idname == "CompositorNodeRGB")
background.outputs[0].default_value = (0.017724609375000002, 0.009228515625000003, 0.037060546875, 1)
over = next(node for node in nodes if node.bl_idname == "CompositorNodeAlphaOver")
cream = nodes.new("CompositorNodeRGB")
cream.outputs[0].default_value = (4.484375, 3.015625, 1.640625, 1)
cream_over = nodes.new("CompositorNodeAlphaOver")
compositor.links.new(cream.outputs[0], cream_over.inputs["Background"])
compositor.links.new(alpha.outputs["Image"], cream_over.inputs["Foreground"])
composite = next(node for node in nodes if node.bl_idname == "NodeGroupOutput")
compositor.links.new(over.outputs["Image"], composite.inputs["Image"])
sizes = [512] if preview else [1024, 512, 256, 128, 64, 32]
files = nodes.new("CompositorNodeOutputFile")
files.directory = str(output)
files.file_name = "me-melo-"
files.format.media_type = "IMAGE"
files.format.file_format = "PNG"
files.format.color_mode = "RGBA"
files.format.color_depth = "8"
files.format.compression = 80
files.save_as_render = True
for variant, image in (("transparent", alpha), ("cream", cream_over)):
    name = f"{variant}-{sizes[0]}"
    files.file_output_items.new("RGBA", name)
    compositor.links.new(image.outputs["Image"], files.inputs[name])
scene.render.filepath = str(output / f"me-melo-indigo-{sizes[0]}.png")
bpy.ops.render.render(write_still=True)
for variant in ("transparent", "cream", "indigo"):
    master = output / f"me-melo-{variant}-{sizes[0]}.png"
    for size in sizes[1:]:
        image = bpy.data.images.load(str(master), check_existing=False)
        image.scale(size, size)
        image.filepath_raw = str(output / f"me-melo-{variant}-{size}.png")
        image.file_format = "PNG"
        image.save()
        bpy.data.images.remove(image)
if not preview:
    bpy.ops.wm.save_as_mainfile(filepath=str(output / "me-melo.blend"), compress=True)
    with ZipFile(output / "me-melo-pngs.zip", "w", ZIP_DEFLATED) as archive:
        for path in sorted(output.glob("me-melo-*.png")):
            archive.write(path, path.name)
