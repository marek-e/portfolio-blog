# Glass M/E logo

Rounded 3D versions of the M/E mark from `src/assets/logo.svg`, including the circular middle of the E. The glass uses a coral, purple, and blue tint with soft reflections and subtle emission on the surface. There are no opaque inner cores.

- `me-glass-neon.png` and `.blend` contain the approved studio presentation.
- `app-icon/me-icon-{transparent,background}-{size}.png` contains square app assets at 1024, 512, 256, 128, 64, and 32 px. The app version uses a vivid candy-pink, violet, and cyan tint with brighter exposure and softer ambient shadows. The connected diagonals retain their pill bevels and have a slight depth offset. Native SDF fillets soften their junctions while the circular E middle is processed separately to preserve its gap. The app material uses 65% transmission, an IOR of 1.46, a clear coat, and no surface emission or bloom. Round key and rim lights remain visible in reflections but are hidden from transmission rays to avoid internal softbox patches. The background variant uses solid slate without a floor reflection.
- `app-icon/me-app-icon.blend` is the editable app scene.
- `app-icon/me-app-icon-pngs.zip` contains all 12 PNG exports.

## Regenerate

These scripts use the Blender 5.2 Python API. From the repository root on macOS:

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --python artifacts/logo-3d/create_logo.py
/Applications/Blender.app/Contents/MacOS/Blender --background --python artifacts/logo-3d/create_app_icon.py
```

The scripts can run independently. The second builds the icon geometry from `create_logo.py`, renders both icon variants, exports the smaller sizes, saves the editable icon scene, and rebuilds the ZIP.

For a faster 512 px preview, append `-- --preview` to the second command. Previews, iteration renders, and Blender backup files stay local.

These are standalone assets. The website logo and favicon remain unchanged.
