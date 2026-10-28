# Glass M/E logo

Rounded 3D versions of the M/E mark from `src/assets/logo.svg`, including the circular middle of the E. The glass uses a coral, purple, and blue tint with soft reflections and subtle emission on the surface. The Blender scenes have no opaque inner cores.

- `me-glass-neon.png` and `.blend` contain the approved studio presentation.
- `app-icon/me-icon-{transparent,background}-{size}.png` contains square app assets at 1024, 512, 256, 128, 64, and 32 px. The app version uses a vivid candy-pink, violet, and cyan tint with brighter exposure and softer ambient shadows. The connected diagonals retain their pill bevels and have a slight depth offset. Native SDF fillets soften their junctions while the circular E middle is processed separately to preserve its gap. The app material uses 65% transmission, an IOR of 1.46, a clear coat, and no surface emission or bloom. Round key and rim lights remain visible in reflections but are hidden from transmission rays to avoid internal softbox patches. The background variant uses solid slate without a floor reflection.
- `app-icon/me-app-icon.blend` is the editable app scene.
- `app-icon/me-app-icon-pngs.zip` contains all 12 PNG exports.

## V2: luminous layered glass

V2 is a separate treatment inspired by the supplied glass reference. It preserves the connected M/E silhouette and adds a thin clear shell built from volume contours, tinted pearl rims, broad highlights, coral/cyan rim lighting, and subtle bloom. Its tinted body uses 90% transmission; the outer shell uses an IOR of 1.38. V1 sources and exports remain unchanged.

- `create_app_icon_v2.py` loads the preserved V1 scene at `app-icon/me-app-icon.blend` and saves only into `app-icon-v2/`. Both PNG variants are exported from a single render.
- `app-icon-v2/me-icon-v2-{transparent,background}-{size}.png` contains both variants at 1024, 512, 256, 128, 64, and 32 px.
- `app-icon-v2/me-app-icon-v2.blend` is the editable V2 scene.
- `app-icon-v2/me-app-icon-v2-pngs.zip` contains the 12 V2 PNG exports.

## Interactive website model

`export_web_model.py` reads the saved V2 scene and exports `public/models/me-glass.glb` plus `me-glass-poster.png`. Run it after a non-preview V2 generation, since previews do not save the required scene. The GLB is approximately 800 KB and 40,000 triangles; the Blender sources and V1/V2 PNG sets are preserved.

The web material is an approximation: vertex colors replace the procedural gradient, and an opaque colored body sits inside a transmissive clear shell so browser rendering can show the layered glass. Cycles lighting and Fresnel shader nodes are not exported. The website supplies real-time environment lighting and an interactive camera through a lazily loaded, self-hosted `<model-viewer>` component. A static poster remains available if loading or WebGL fails. Automatic camera motion is disabled for reduced-motion preferences.

## Regenerate

These scripts use the Blender 5.2 Python API. From the repository root on macOS:

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --python artifacts/logo-3d/create_logo.py
/Applications/Blender.app/Contents/MacOS/Blender --background --python artifacts/logo-3d/create_app_icon.py
/Applications/Blender.app/Contents/MacOS/Blender --background --python artifacts/logo-3d/create_app_icon_v2.py
/Applications/Blender.app/Contents/MacOS/Blender --background --python artifacts/logo-3d/export_web_model.py
```

When regenerating the app versions, run the V1 app-icon command without `-- --preview` before the V2 command. This creates or refreshes `app-icon/me-app-icon.blend`, which V2 loads. A V1 preview does not save this scene. The studio command can run independently.

For a faster 512 px preview, append `-- --preview` to either app-icon command. V1 previews go into `app-icon/preview/`; V2 previews go into `app-icon-v2/preview/`. Preview runs do not save Blender scenes or ZIP bundles. Previews, iteration renders, and Blender backup files stay local.

The hero uses the optimized web model. The navbar logo and favicon remain unchanged.
