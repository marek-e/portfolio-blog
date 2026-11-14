# Editable neon-glass M/E

Procedural reconstruction of the selected image reference, preserved as `reference.png`. This is a separate Blender scene, with six independently editable glass strokes and a charcoal app tile. The generated reference is an art-direction target; the model is a reconstruction, not extracted 3D geometry.

`design.json` defines a common `layout` rather than independently positioned strokes. `construction.py` derives all six stroke endpoints and widths. The two M diagonals share their length, angle, baseline and cap line. The E bars share their length and width and meet the spine at its cap centers. The dot is vertically centered between them, with its outer right edge aligned to theirs. One assembly rotation tilts the complete construction; `--front` removes that rotation. The assembly is centered from its projected geometry bounds.

The layout controls stroke width, height, diagonal run and pitch, spine position, right end and dot diameter. Each named stroke retains its own depth, tint and edge color. Glass thickness, bevel, roughness, refractive index, transmission, edge emission, assembly scale and camera are also adjustable. Coordinates are in the logo's front plane: X runs right, Z runs up. Smaller depth values move a stroke toward the camera. Keep neighboring overlapping strokes separated by more than `thickness` to avoid intersecting glass volumes.

The shared spine sits ahead of the inner M and E strokes. Air gaps keep the central junction editable without Boolean fusion or coincident surfaces. The E dot is its own object. Each glass object has a rounded, slightly convex front and rear profile built directly into its mesh. The bevel setting controls the profile radius. Selected rear strokes use `show_through_glass: false` to suppress magnified end caps at the shared junction while keeping those strokes visible directly.

## Render

From the repository root, create a 512px draft:

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --python-exit-code 1 --python artifacts/logo-3d/neon-glass/create.py -- --preview
```

Remove `--preview` for a 1024px, 96-sample still. Add `--front` for a level logo instead of the selected angled composition. Regenerating writes the same filenames in this new scene's output folder; earlier logo versions are unaffected.

Outputs are `preview/` or `output/`, each containing `me-aligned-angled.blend` and `me-aligned-angled.png`, or the corresponding `front` files. Open the `.blend` in Blender to edit individual objects or scrub the light animation. JSON changes take effect when the script is run again; manual Blender edits remain in the saved scene until regeneration replaces it.

## Light-sweep study

The model stays still while one tall reflection light crosses it over 72 frames at 24fps. This is a three-second, one-shot material demonstration, not a seamless loop. Frame 36 supplies the still. Use the static image for reduced motion when integrating into a website; no animation is installed on the site by these scripts.

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --python-exit-code 1 --python artifacts/logo-3d/neon-glass/create.py -- --preview --animate
ffmpeg -y -framerate 24 -i artifacts/logo-3d/neon-glass/preview/frames-angled/frame-%04d.png -c:v libx264 -pix_fmt yuv420p -movflags +faststart artifacts/logo-3d/neon-glass/output/light-sweep-aligned.mp4
```

The MP4 has an opaque background. PNGs retain alpha outside the tile. A transparent render of glass refracts the scene behind it, not arbitrary webpage content.

Animation previews use 384px and 12 samples per frame to keep iteration quick. The saved full-resolution scene retains 1024px and 96 samples for a final animation render. The preview MP4 is exported to `output/light-sweep-aligned.mp4` for review.

The earlier `me-neon-*` and `me-glass-*` exports preserve previous iterations. Current exports use `me-aligned-*` and `light-sweep-aligned.mp4`.
