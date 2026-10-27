import bpy
import sys
import runpy
from pathlib import Path
from mathutils import Vector
from zipfile import ZipFile, ZIP_DEFLATED


root = Path(__file__).resolve().parent
preview = "--preview" in sys.argv
output = root / "app-icon" / "preview" if preview else root / "app-icon"
output.mkdir(parents=True, exist_ok=True)
sys.argv.append("--app-icon")
runpy.run_path(str(root / "create_logo.py"), run_name="logo_scene")
scene = bpy.context.scene
scene.view_settings.exposure = 0.3
scene.view_settings.look = "AgX - Medium High Contrast"
glass = bpy.data.materials["Tinted glass with luminous edges"]
ramp = next(node for node in glass.node_tree.nodes if node.bl_idname == "ShaderNodeValToRGB")
for stop, color in zip(ramp.color_ramp.elements, ("FF8068", "EC6093", "A06AF0", "35ADE8", "35ADE8")):
    channels = [int(color[index:index + 2], 16) / 255 for index in (0, 2, 4)]
    stop.color = tuple(value / 12.92 if value < 0.04045 else ((value + 0.055) / 1.055) ** 2.4 for value in channels) + (1,)
for node in glass.node_tree.nodes:
    if node.bl_idname == "ShaderNodeMath":
        node.inputs[1].default_value = 0.0
    if node.bl_idname == "ShaderNodeMixRGB":
        node.inputs[0].default_value = 0.45
scene.world.node_tree.nodes.get("Background").inputs["Strength"].default_value = 0.35
shader = glass.node_tree.nodes.get("Principled BSDF")
shader.inputs["Roughness"].default_value = 0.025
shader.inputs["IOR"].default_value = 1.46
shader.inputs["Coat Weight"].default_value = 0
absorption = glass.node_tree.nodes.new("ShaderNodeVolumeAbsorption")
absorption.inputs["Density"].default_value = 1.2
glass.node_tree.links.new(ramp.outputs["Color"], absorption.inputs["Color"])
glass.node_tree.links.new(absorption.outputs["Volume"], glass.node_tree.nodes.get("Material Output").inputs["Volume"])
scene.render.resolution_x = 512 if preview else 1024
scene.render.resolution_y = scene.render.resolution_x
scene.render.resolution_percentage = 100
scene.cycles.samples = 96 if preview else 384
scene.cycles.use_adaptive_sampling = True
scene.cycles.adaptive_threshold = 0.025 if preview else 0.01
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.image_settings.color_depth = "8"
scene.render.image_settings.compression = 80
scene.render.dither_intensity = 0
camera = scene.camera
camera.location = (4, -28, 4.5)
target = Vector((0.44, 0, -0.1))
camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()
camera.data.ortho_scale = 12.8
camera.name = "Application icon"
backdrop = bpy.data.objects["Seamless studio"]
scene.render.film_transparent = True
scene.cycles.film_transparent_glass = False
backdrop.visible_camera = False
backdrop.visible_glossy = False
backdrop_material = backdrop.data.materials[0]
backdrop_nodes = backdrop_material.node_tree.nodes
backdrop_emission = backdrop_nodes.new("ShaderNodeEmission")
backdrop_emission.inputs["Color"].default_value = (0.42, 0.42, 0.42, 1)
position = backdrop_nodes.new("ShaderNodeNewGeometry")
height = backdrop_nodes.new("ShaderNodeSeparateXYZ")
illumination = backdrop_nodes.new("ShaderNodeMapRange")
illumination.inputs["From Min"].default_value = -4
illumination.inputs["From Max"].default_value = 4
illumination.inputs["To Min"].default_value = 0.65
illumination.inputs["To Max"].default_value = 1.5
backdrop_material.node_tree.links.new(position.outputs["Position"], height.inputs["Vector"])
backdrop_material.node_tree.links.new(height.outputs["Z"], illumination.inputs["Value"])
backdrop_material.node_tree.links.new(illumination.outputs["Result"], backdrop_emission.inputs["Strength"])
backdrop_material.node_tree.links.new(backdrop_emission.outputs["Emission"], backdrop_nodes.get("Material Output").inputs["Surface"])
for obj in list(bpy.data.objects):
    if obj.type == "LIGHT" and obj.name != "Large softbox":
        bpy.data.objects.remove(obj, do_unlink=True)
key = bpy.data.objects["Large softbox"]
key.data.specular_factor = 1
key.location = (-4, -5, 7)
key.data.size = 9
key.data.size_y = 3.5
key.data.energy = 650
key.rotation_euler = (Vector((0, 0, 0)) - key.location).to_track_quat("-Z", "Y").to_euler()
rim_data = bpy.data.lights.new("Cool rim", "AREA")
rim_data.energy = 1000
rim_data.shape = "DISK"
rim_data.size = 5
rim_data.color = (0.65, 0.8, 1)
rim = bpy.data.objects.new("Cool rim", rim_data)
bpy.context.collection.objects.link(rim)
rim.location = (5, 2, 5)
rim.rotation_euler = (Vector((0, 0, 0)) - rim.location).to_track_quat("-Z", "Y").to_euler()
fill_data = bpy.data.lights.new("Broad reflection", "AREA")
fill_data.energy = 180
fill_data.shape = "DISK"
fill_data.size = 10
fill = bpy.data.objects.new("Broad reflection", fill_data)
bpy.context.collection.objects.link(fill)
fill.location = (-7, -9, 2)
fill.rotation_euler = (Vector((0, 0, 0)) - fill.location).to_track_quat("-Z", "Y").to_euler()
compositor = scene.compositing_node_group
composite = next(node for node in compositor.nodes if node.bl_idname == "NodeGroupOutput")
render = next(node for node in compositor.nodes if node.bl_idname == "CompositorNodeRLayers")
glare = next(node for node in compositor.nodes if node.bl_idname == "CompositorNodeGlare")
glare.inputs["Strength"].default_value = 0.0
alpha = compositor.nodes.new("CompositorNodeSetAlpha")
compositor.links.new(render.outputs["Image"], alpha.inputs["Image"])
compositor.links.new(render.outputs["Alpha"], alpha.inputs["Alpha"])
compositor.links.new(alpha.outputs["Image"], composite.inputs["Image"])
background = compositor.nodes.new("CompositorNodeRGB")
background.outputs[0].default_value = (0.018, 0.025, 0.05, 1)
over = compositor.nodes.new("CompositorNodeAlphaOver")
compositor.links.new(background.outputs[0], over.inputs["Background"])
compositor.links.new(alpha.outputs["Image"], over.inputs["Foreground"])
sizes = [512] if preview else [1024, 512, 256, 128, 64, 32]

for variant in ("transparent", "background"):
    transparent = variant == "transparent"
    scene.render.film_transparent = True
    compositor.links.new(alpha.outputs["Image"] if transparent else over.outputs["Image"], composite.inputs["Image"])
    master = output / f"me-icon-{variant}-{sizes[0]}.png"
    scene.render.filepath = str(master)
    bpy.ops.render.render(write_still=True)
    for size in sizes[1:]:
        image = bpy.data.images.load(str(master), check_existing=False)
        image.scale(size, size)
        image.filepath_raw = str(output / f"me-icon-{variant}-{size}.png")
        image.file_format = "PNG"
        image.save()
        bpy.data.images.remove(image)

if not preview:
    bpy.ops.wm.save_as_mainfile(filepath=str(output / "me-app-icon.blend"))
    with ZipFile(output / "me-app-icon-pngs.zip", "w", ZIP_DEFLATED) as archive:
        for path in sorted(output.glob("me-icon-*.png")):
            archive.write(path, path.name)
