# Projects World

Status: implemented for review. V1 routes are `/projects/world` and `/en/projects/world`.

The original PRD supplied with this change defines a desktop island for discovering every project. The ordinary projects list stays the default. This implementation follows its documented vector-art sourcing path.

## Scope

- Phaser 3 loads dynamically after a one-time desktop and pointer check. Mobile visitors receive a teaser and a link to the complete project list.
- First visits start beside the bed. The desk, bookshelf and running shoes introduce interaction. Exiting the house saves the intro flag; returning visitors start outside.
- Six layered landmarks open native, focus-trapped DOM dialogs with collection-derived images, translated status labels, descriptions, technologies and detail links. A build-time assertion checks map slugs against both language collections.
- Keyboard and injected movement use one intent layer. Movement pauses for cards; blur clears held keys. HUD focus does not disable movement.
- Discovery, intro and mute persist in local storage and fall back to session memory when storage is blocked. Completing the collection triggers one celebration and changes the bench card.
- Audio starts on the entry click. Music streams separately from preloaded effects. Hidden tabs pause gameplay and fade audio. Reduced motion disables ambient movement, bob, camera smoothing and confetti.
- Failed or stalled preloads offer retry and list links. Phaser AUTO uses Canvas when WebGL is unavailable; unsupported renderers show the teaser.
- The text route gains a compact illustrated banner and a secondary nonfeatured section. The footer adds a localized world link. No navigation redesign or mobile controls are included.

## Art and maps

[The reproducible generator and asset provenance](../../../scripts/world-art/README.md) document the shared palette, source SVGs, original synthesized audio and Tiled schema. Run:

```sh
node scripts/world-art/generate.mjs
node scripts/world-art/validate.mjs
```

The generator draws the island, northern house, central fountain, beach and pier, locked library, viewpoint bench, and themed landmarks. It emits collision geometry from the same coordinates and shoreline mask. Runtime project mapping exists only in the Tiled project zones.

To add a project, add its image, anchor, collision and slug-bearing interaction zone. If regenerating the art, preserve these edits in the generator as documented there. Version filenames when changing released assets because `/world/*` is cached immutably.

## Verification

```sh
node --experimental-strip-types --test src/components/world/*.test.ts
node scripts/world-art/validate.mjs
pnpm format:check
pnpm lint
pnpm check
pnpm build
```

Input tests cover injected movement, normalization, action edges, HUD focus, editable controls, blur, hidden tabs and teardown. Persistence tests cover corrupt data, unavailable storage, slug filtering, duplicate discovery, language-independent persistence and intro timing. Map validation flood-fills walkable space with player clearance and checks asset hashes, dimensions, alpha and audio.

Browser observations and payload measurements are recorded in the pull request. The full two-version Chrome, Firefox, Safari and Edge matrix and the 2020-laptop frame-rate target require hardware testing; they are not claimed as completed by the automated checks.

## Deferred

Mobile touch, night art, blog/contact expansion and custom analytics remain outside V1. Optional animals are not required for this release.
