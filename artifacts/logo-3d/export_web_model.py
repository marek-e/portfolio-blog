import bpy
import shutil
from pathlib import Path


root = Path(__file__).resolve().parent
output = root.parent.parent / "public" / "models"
output.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(root / "app-icon-v2" / "me-app-icon-v2.blend"))
body = bpy.data.objects["ME | Continuous glass"]
shell = bpy.data.objects["ME | Clear V2 shell"]
ramp = next(node for node in body.data.materials[0].node_tree.nodes if node.bl_idname == "ShaderNodeValToRGB")
stops = [(stop.position, tuple(stop.color)) for stop in ramp.color_ramp.elements]
left = min(vertex.co.x for vertex in body.data.vertices)
right = max(vertex.co.x for vertex in body.data.vertices)
bpy.ops.object.select_all(action="DESELECT")
for obj, triangles in ((body, 16000), (shell, 24000)):
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    obj.data.calc_loop_triangles()
    decimate = obj.modifiers.new("Web mesh", "DECIMATE")
    decimate.ratio = triangles / len(obj.data.loop_triangles)
    decimate.use_collapse_triangulate = True
    bpy.ops.object.modifier_apply(modifier=decimate.name)
    for face in obj.data.polygons:
        face.use_smooth = True
    material = bpy.data.materials.new("Web color" if obj == body else "Web clear glass")
    material.use_nodes = True
    shader = material.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Roughness"].default_value = 0.18 if obj == body else 0.05
    shader.inputs["Coat Weight"].default_value = 0.6
    shader.inputs["Coat Roughness"].default_value = 0.1
    shader.inputs["Transmission Weight"].default_value = 0 if obj == body else 0.95
    shader.inputs["IOR"].default_value = 1.46 if obj == body else 1.38
    if obj == body:
        colors = obj.data.color_attributes.new(name="Color", type="FLOAT_COLOR", domain="POINT")
        for vertex in obj.data.vertices:
            position = (vertex.co.x - left) / (right - left)
            for start, end in zip(stops, stops[1:]):
                if position <= end[0]:
                    amount = max(0, min(1, (position - start[0]) / (end[0] - start[0])))
                    colors.data[vertex.index].color = tuple(a + (b - a) * amount for a, b in zip(start[1], end[1]))
                    break
            else:
                colors.data[vertex.index].color = stops[-1][1]
        color = material.node_tree.nodes.new("ShaderNodeVertexColor")
        color.layer_name = "Color"
        material.node_tree.links.new(color.outputs["Color"], shader.inputs["Base Color"])
    obj.data.materials.clear()
    obj.data.materials.append(material)
    for face in obj.data.polygons:
        face.material_index = 0
bpy.ops.export_scene.gltf(
    filepath=str(output / "me-glass.glb"),
    export_format="GLB",
    use_selection=True,
    export_animations=False,
    export_texcoords=False,
    export_normals=True,
    export_tangents=False,
    export_all_vertex_colors=False,
    export_apply=True,
)
shutil.copyfile(root / "app-icon-v2" / "me-icon-v2-transparent-512.png", output / "me-glass-poster.png")
print("Web model exported:", (output / "me-glass.glb").stat().st_size, "bytes")
