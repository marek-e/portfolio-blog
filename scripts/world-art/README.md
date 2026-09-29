# Projects World art

Run from the repository root with Node 22 and the installed sharp dependency:

```sh
node scripts/world-art/generate.mjs
node scripts/world-art/validate.mjs
```

The generator writes only to `public/world/`. Source SVGs are generated alongside raster assets. All filenames carry `v1`; update the version for a release that changes coordinates. No network access, fonts, external illustrations, or audio samples are needed. ffmpeg is optional and adds MP3 and Opus encodings when its codecs are available. The WAV is always generated.

`public/world/manifest-v1.json` is the integration entry point. It records dimensions, URLs, source SVG URLs, byte sizes, SHA-256 hashes, palette, seed, site coordinates, and avatar origin. For identical bytes use the same Node, sharp/libvips and ffmpeg versions. Raster generation uses sharp 0.35.3. The fixed PRNG seed is 481516. The generator checks all six slugs against English project content filenames, using the lowercase IDs produced by Astro’s content loader.

## Rendering

The island background is 4096 × 4096. The house interior is 1536 × 1024. Both are WebP. Render the background at its native map size. The six transparent landmark PNGs are separate, so the engine can sort their depth against the avatar. They are not present in the island background. `island-overview-v1.webp` includes them and is for previews only.

Each `landmark-anchor` point places a PNG at a bottom-center origin, using its `width` and `height` properties. Sprites have some transparent padding below their painted feet. Use the anchor's Y for depth sorting. Trees and house furniture are baked into the backgrounds. Their trunk or footprint rectangles still block movement. Background trees do not support foreground occlusion.

Avatars are individual 110 × 110 transparent PNG files: `avatar-{down,up,left,right}-v1.png`. Origin is 0.5, 1 and collision radius is 18 map pixels. These are four directional standing poses, not an animation sheet. Ambient cloud, leaf, butterfly, sparkle and shadow PNGs are individually addressable in the manifest.

`banner-v1.webp` is 1920 × 640; `teaser-v1.webp` is 1200 × 900; `og-v1.webp` is 1200 × 630. They crop the composed island view. Exact crop regions are in the manifest.

## Tiled contract

`island-v1.json` and `house-v1.json` are orthogonal Tiled JSON maps with a 32-pixel reference grid and no tilesets or tile layers. Map `width` and `height` are in grid units. All objects use native pixels, with Y increasing downward. Rectangles use top-left coordinates. Point objects set `point: true`. Standard Tiled properties are arrays of `{name, type, value}` records. Object `type` defaults to its object layer name.

| Layer             | Contract                                                                                                                                                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `background`      | Image layer. `image` resolves relative to the map URL. Native image dimensions provided.                                                                                                                   |
| `collisions`      | Solid axis-aligned rectangles, including water perimeter, trunks, landmark bases, home and interior furniture.                                                                                             |
| `project-zones`   | Walkable interaction rectangles with exact `slug`, `label`, `promptOffsetX`, `promptOffsetY`.                                                                                                              |
| `props`           | Baked prop rectangles with `baked: true`, `solid: true`. Only desk, bookshelf, shoes, library and bench set `interactable: true`. Collision copies live in `collisions`; do not double-add physics bodies. |
| `doors`           | Interaction rectangles with `targetMap` equal to `island-v1` or `house-v1`, and `targetSpawn` matching a point name in that map.                                                                           |
| `spawns`          | Named points. Island has `default` and `house-exit`. House has `default` and `initial` beside the bed, plus `entry` near the door.                                                                         |
| `landmark-anchor` | Points with `slug`, absolute `asset` URL, `anchorX: 0.5`, `anchorY: 1`, `width`, `height`.                                                                                                                 |

The site table in `generate.mjs` drives plazas, connecting paths, collisions, zones, anchors, and preview composition. Shoreline collision rectangles conservatively cover every 32-pixel cell that touches water, using alpha sampling of the same SVG path that draws the coast. This leaves a small margin on the sand. The validator flood-fills both maps using an 18-pixel player radius and checks all spawns, door targets, project zones and island boundaries.

## Audio and provenance

All artwork is original procedural vector illustration authored for this project. The generator uses SVG paths and shapes, not image generation or stock assets. The visual palette uses muted teal water, sage foliage, warm sand, terracotta roofs and cream highlights.

`lofi-garden-v1.wav` is an original 78 BPM, eight-bar, mono PCM composition synthesized at 22,050 Hz. Its Cmaj7 / Am7 / Fmaj7 / G7 progression uses sine-wave electric-piano tones, synthesized bass and kick, deterministic noise percussion, and a sparse upper melody. Note tails wrap into the beginning of the buffer for looping. There are no recordings, quoted melodies, downloaded samples or third-party sound libraries. This provenance describes the creation process; it does not make a legal exclusivity claim over common chords.

Use `/world/music-v1.mp3` for compressed music when ffmpeg is present, or `/world/lofi-garden-v1.wav` as the fallback. `/world/lofi-garden-v1.ogg` is also generated when Opus encoding is available. Decode to an audio buffer for sample-based looping; HTML audio playback may add a gap depending on the browser.

Effects are `/world/{step,interact,open,close,discovery,celebrate,door}-v1.wav`. Each is an original short synthesized tone sequence. Audio generation checks include valid PCM headers, non-silent output and no sample clipping. Listen and set final playback gain in the application.

## Browser verification

Verify the production build with the Content-Security-Policy from `public/_headers` applied. Astro's preview server does not apply that file. Enter the house and revisit with `world:intro-done` set to verify the island's paintings, character and landmarks. Phaser must load images directly with `HTMLImageElement`; its default blob image URLs are blocked by the deployed policy.

Also serve invalid image bytes for `/world/house-v1.webp` with an HTTP 200 response. The loading screen must offer retry and the projects list instead of entering a scene with missing textures.

## Adding a project

The runtime contract is data-driven: add a landmark image, its `landmark-anchor` point, a `project-zones` rectangle with the exact content slug, and any collision rectangles to the map. No engine switch or project enumeration is required. To regenerate the illustrated world, add the site and its drawing to the generator too. Regeneration overwrites generated maps, so keep manual Tiled edits in sync with the source before rerunning it.

## Style reference

The vector pipeline is the art-sourcing path documented in the PRD. It uses one palette and shared geometry helpers. For future bitmap variants, keep this style reference with each prompt:

> Clean modern 2D game illustration, soft cel shading, smooth rounded vector-like shapes, thin subtle outlines, warm saturated colors, gentle ambient occlusion, top-down 3/4 view (camera angled ~45° down), orthographic perspective with no vanishing point and uniform scale across the image, soft sunlight from the top-left, cozy casual game aesthetic inspired by modern Pokémon towns — absolutely no pixel art, no photorealism, no 3D render look.

Generate the island reference first, then an empty map, interior, one four-pose character sheet, isolated landmarks, and ambient sprites. Attach the accepted reference at every step. Keep landmarks separate from the painting so interaction highlights remain possible.
