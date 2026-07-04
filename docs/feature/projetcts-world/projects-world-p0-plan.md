# Projects World — P0 Implementation Plan

|            |                                                                               |
| ---------- | ----------------------------------------------------------------------------- |
| **Status** | Approved plan — implementation not started                                    |
| **PRD**    | [projects-world-prd.md](./projects-world-prd.md) (§12 P0 acceptance criteria) |
| **Owner**  | Marek Elmayan                                                                 |
| **Date**   | 2026-07-02                                                                    |

P0 = playable skeleton with placeholder art: both world routes build statically, mobile gets the
teaser, a player walks with Tiled collision, house ↔ island doors work, one zone opens the real
Elemix card in both languages, and input goes through the abstraction layer. Proves the whole
pipeline before any art exists.

## Decisions locked in the planning interview (2026-07-02)

| #   | Question                                   | Decision                                                                                                                                                                                                                                                                                                                                                                                                        |
| --- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Plan location & PR granularity             | This doc + slice tracker below; **one PR per slice** against `main` (route unlinked, so partial merges are safe)                                                                                                                                                                                                                                                                                                |
| 2   | Test tooling                               | **None.** No vitest/jest. The input-layer criterion is verified by a dev-only `?input=fake-touch` runtime stub                                                                                                                                                                                                                                                                                                  |
| 3   | Bundle-isolation check                     | **Committed script** `scripts/check-world-isolation.mjs`, run per slice PR                                                                                                                                                                                                                                                                                                                                      |
| 4   | Tiled maps                                 | **Hand-written `.tmj`** (Tiled 1.10 JSON) in `public/world/maps/`; validated by opening once in the Tiled editor. GUI editor deferred to P1                                                                                                                                                                                                                                                                     |
| 5   | Placeholder paintings                      | **Real image files at final dimensions**: flat-color `island-v1.webp` 4096×4096, `house-v1.webp` 1536×1024. Locks the coordinate space for P1                                                                                                                                                                                                                                                                   |
| 6   | Info card                                  | Add dialog via the **repo-pinned** CLI `pnpm exec shadcn add dialog` (Base UI variant per `components.json`; **not** `dlx shadcn@latest`, which bypasses the pinned `^3.6.2`), composed with existing `Card`/`Badge`/`Button`. Input layer is the single owner of "world input paused"                                                                                                                          |
| 7   | `BookmarkLanguageToggle`                   | **Keep it** on the world route (zero Layout changes); it is the route's only language switch. Note: it is `hidden` below `md` (768px), so the mobile teaser has **no** language switch — accepted (the teaser CTA leads to the fully-chromed text page). HUD elements go **top-left** to avoid it                                                                                                               |
| 8   | P0 UI scope                                | Bare loading→"Enter" screen; HUD = "view as list" button only; **no `localStorage` in P0** (`state.ts` lands at P1); world i18n keys only for what ships                                                                                                                                                                                                                                                        |
| 9   | Slices                                     | Six PRs as tracked below                                                                                                                                                                                                                                                                                                                                                                                        |
| 10  | World i18n location _(adversarial review)_ | Separate module **`src/i18n/translations/world.ts`**, imported **only** by `world.astro`. The shared `fr.ts`/`en.ts` are bundled into client chunks on _every_ page (`MobileMenu` is `client:load` on every page and imports `getTranslations`, which statically imports both files) — adding keys there would break the bundle-diff-0 criterion. Deliberate deviation from PRD §9.5; backport to the PRD at P1 |
| 11  | DPR handling _(adversarial review)_        | P0 renders at **CSS pixels**: Phaser 3 has no `resolution` config option and `Scale.RESIZE` ignores `zoom`, so CSS-pixel rendering is the native behavior — and it trivially satisfies the §9.7 "cap DPR at 2" budget. Retina sharpness re-evaluated at P1 with real art                                                                                                                                        |
| 12  | `/world/` caching _(adversarial review)_   | Immutable rule narrowed to **`/world/*.webp`** (versioned paintings only). The `.tmj` maps are unversioned and edited across slices 3–5 and heavily in P1 — they stay on the default 1-hour revalidation until they stabilize                                                                                                                                                                                   |

## Slice tracker

| #   | Slice                                  | Status                                            |
| --- | -------------------------------------- | ------------------------------------------------- |
| 0   | Plan doc (this file)                   | done                                              |
| 1   | Route shell + teaser + isolation guard | done                                              |
| 2   | Engine boots                           | done                                              |
| 3   | Player + input + collision             | done                                              |
| 4   | House + door transitions               | done                                              |
| 5   | Info card                              | todo                                              |
| 6   | Fake-touch stub + acceptance sweep     | todo                                              |

Update the status column (`todo / in-progress / done` + PR link) as slices land.

## Codebase facts the plan relies on

- **DTO pattern exists**: `src/components/astro/FeaturedProjects.astro` already does
  `getProjectImageSafe(data.image)` → `await getImage({ src })` → pass `optimized.src` string to a
  React island. `world.astro` copies this.
- **Lang filtering / slug derivation**: entry ids are lang-prefixed and **extension-less**
  (`fr/elemix` — the Astro 5 glob loader strips extensions and lowercases segments, e.g.
  `minesweeper-LLM-arena.mdx` → `fr/minesweeper-llm-arena`). Pages filter with
  `id.startsWith(`${lang}/`)`; slug = id minus lang prefix (copy `[slug].astro`'s `getStaticPaths`
  — its extension-strip `replace` is a defensive no-op). **Tiled zone slugs must use this
  lowercased form.**
- **`manualChunks` is a function** in `astro.config.mjs` — `phaser-vendor` is one more
  `if (id.includes('node_modules/phaser')) return 'phaser-vendor';` branch. Do **not** touch the
  React/base-ui chunking (deliberately left to Rollup per the comment there).
- **Layout has no navbar/footer** — pages compose them; the world page simply doesn't render them.
  Layout does render `BookmarkLanguageToggle` (kept, decision 7) and Astro's **`ClientRouter`**
  (view transitions) — so the island can unmount via client-side navigation: Phaser teardown is
  mandatory (slice 2).
- **i18n**: world strings live in a **separate** `src/i18n/translations/world.ts` (decision 10),
  imported only by `world.astro` — **not** in the shared `ui.ts`/`fr.ts`/`en.ts`, which are pulled
  into client chunks on every page (`MobileMenu` is `client:load` everywhere and imports
  `getTranslations`, which statically imports both full translation files). `world.astro` selects
  the language slice and passes it to the island as a `t` prop (same shape as `carouselTranslations`).
- **shadcn stack is Base UI** (`@base-ui/react`), no Radix; `dialog.tsx` does not exist yet.
- **`public/_headers`**: today `/_astro/*` gets 1-year immutable; `/bg-*.webp` and `/favicon.svg`
  get 30 days; a catch-all `/*` gives 1-hour `must-revalidate` (this is what would otherwise govern
  `/world/*`). A `/world/*.webp` 1-year-immutable rule must be added (decision 12 — `.webp` only, so
  unversioned `.tmj` maps keep revalidating).
- **Sitemap**: `sitemap()` has no filter today — it would list the world routes pre-reveal.
  Slice 1 adds a filter; removed at P2 reveal (PRD decision #17).
- **`client:only` is a first** for this repo (existing islands use `client:load`/`client:visible`);
  nothing renders server-side inside the island, so all SEO/fallback text lives in `world.astro`.
- No route collision: `world.astro` is a static segment and wins over `projects/[slug].astro`; no
  project slug is named `world`.

## Global rules (every slice)

- pnpm. Every PR: `/validate` (format + lint + build) green + `node scripts/check-world-isolation.mjs`
  green + the slice's manual QA list below.
- No tests (decision 2). No speculative code: build only what the slice's checklist needs.
- Branch off `main` per slice; update the slice tracker in the same PR.
- Placeholder visuals are throwaway; **coordinates, schemas, and module boundaries are not** — they
  are the P1 contract.

---

## Slice 1 — Route shell + teaser + isolation guard

**Goal:** both world routes build statically with the full data pipeline and the mobile gate.
**No Phaser anywhere yet** — the isolation script gets a clean baseline first.

**Files**

- `src/pages/[...lang]/projects/world.astro` (new)
- `src/components/react/world/ProjectsWorld.tsx` (new)
- `src/i18n/translations/world.ts` (new — decision 10; **not** the shared `ui.ts`/`fr.ts`/`en.ts`)
- `scripts/check-world-isolation.mjs` (new) + `scripts/world-isolation-baseline.json` (new, committed)
- `astro.config.mjs` (sitemap filter only)

**Steps**

1. `world.astro`: `getStaticPaths` returning `{ lang: undefined }` and `{ lang: 'en' }` (same as
   `projects/index.astro`); resolve `lang`, `t`. `getCollection('projects')`, filter by lang prefix,
   map **all 6 projects** to the DTO
   `{ slug, title, description, techStack, status, imageUrl, detailUrl }`:
   - `slug` = id minus lang prefix minus extension (copy `[slug].astro`'s derivation).
   - `imageUrl` = `getProjectImageSafe` → `getImage()` → `.src` (copy `FeaturedProjects.astro`).
   - `detailUrl` = `` lang === 'en' ? `/en/projects/${slug}` : `/projects/${slug}` ``.
2. Page shell: `Layout` (title/description from `t.world`), **no Navbar/Footer**, a server-rendered
   heading + short paragraph (doubles as pre-hydration content and later the §6.9 SEO text), then
   `<ProjectsWorld client:only="react" projects={dtos} t={t.world} lang={lang} />`.
3. `ProjectsWorld.tsx`: evaluate the gate **once at mount**
   (`window.innerWidth < 1024 || matchMedia('(pointer: coarse)').matches` in a `useState`
   initializer). Gate fails → render the teaser (title, "best on desktop" line, prominent link to
   the text projects page — all from `t.world`). Gate passes → a stub shell (slice 2 replaces it).
   Resizing after mount never re-runs the gate (PRD §6.10).
4. `world.ts` keys (fr + en slices): `pageTitle`, `pageDescription`, `teaser.{title,body,cta}`,
   `entry.{loading,enter}`, `hud.viewAsList`. Structured as `{ fr: {...}, en: {...} }` (or two
   exports); `world.astro` picks by `lang`. No touch to the shared translation modules.
5. `scripts/check-world-isolation.mjs` (~60 lines, plain Node) — this is the verification for the
   "every other page unchanged" P0 criterion, in two parts:
   - **Leak check**: `pnpm build` first (script reads `dist/`). Walk every `dist/**/*.html`
     **except** `dist/projects/world/index.html` and `dist/en/projects/world/index.html`; fail if
     any references a chunk matching `/phaser/i` or any `/world/` asset path (covers `<script>`,
     module preloads, and inline import maps).
   - **Baseline check** (the real "unchanged" signal) _(strengthened at implementation vs the
     original 5-page plan — adversarial review)_: extract the sorted **union** of every
     `_astro/*.js` + `_astro/*.css` filename referenced by **all** non-world pages (not a fixed
     5-page subset) and compare against `scripts/world-isolation-baseline.json`. The 5-page subset
     gave a false PASS: world code that Rollup merges into a **non-baseline** page's own chunk (e.g.
     `/design-system`, or a `[slug]` detail page — the slice-5 Dialog concern) keeps its non-world
     name and only its content hash changes, which neither the name-based leak check nor a 5-page
     baseline would catch. The union covers every non-world page, so any world code reaching one
     shifts a hash → a filename appears/disappears → FAIL. World-only additions (Phaser, game
     scenes) never touch the union, so genuine world slices don't churn the baseline. A legitimate
     unrelated change is handled by regenerating in the same PR (`--update-baseline` flag) and
     calling it out in review — so world slices can never silently alter a shared page. (Verified
     with negative tests: injected phaser chunk, injected `/world/` asset, and a simulated
     hash-drift on `/design-system` all FAIL; a benign text edit still PASSES.)
   - Print a one-line PASS/FAIL summary. Slice 1 generates the initial baseline (pre-Phaser, so it
     captures the true zero-world state).
6. `astro.config.mjs`: `sitemap({ filter: (page) => !page.includes('/projects/world') })` —
   pre-reveal stealth; removed at P2 reveal. Verify `llms.txt.ts` doesn't independently list the
   route (check its source; adjust only if it does).

**Out of scope:** any Phaser, loading screen, HUD, canvas.

**QA checklist**

- [ ] `pnpm build` emits `dist/projects/world/index.html` and `dist/en/projects/world/index.html`.
- [ ] Narrow window or DevTools mobile emulation → teaser, in both languages; CTA navigates to the
      right-language projects page.
- [ ] Desktop → stub shell renders.
- [ ] Isolation script passes (leak + baseline); generated sitemap contains no world URL.
- [ ] `BookmarkLanguageToggle` floats top-right on **≥md** viewports and switches
      `/projects/world` ↔ `/en/projects/world`. (Below md — i.e. the teaser — there is no toggle;
      accepted per decision 7.)

---

## Slice 2 — Engine boots

**Goal:** desktop visitors preload, click "Enter the island", and see the flat-green 4096² island
with a camera; navigation away tears the game down cleanly.

**Files**

- `package.json` (add `phaser`, latest 3.x)
- `astro.config.mjs` (`phaser-vendor` branch in `manualChunks`)
- `src/components/react/world/GameCanvas.tsx`, `bridge.ts`, `WorldHud.tsx`,
  `scenes/BootScene.ts`, `scenes/IslandScene.ts` (new)
- `ProjectsWorld.tsx` (stub shell → loading/entry screen + mounts `GameCanvas` + `WorldHud`)
- `public/world/island-v1.webp` (flat-color 4096×4096; generate with the repo's `sharp` devDep in a
  throwaway node one-liner — do not commit the generator)
- `public/_headers` (add `/world/*.webp` → `Cache-Control: public, max-age=31536000, immutable` —
  decision 12: `.webp` only; `.tmj` maps stay on the 1-hour default until they stabilize)

**Steps**

1. `bridge.ts`: hand-rolled typed emitter (~20 lines, no dependency) over an event map:
   `boot:progress {value}`, `boot:ready`, `card:open {slug}`, `card:close` (card events used from
   slice 5). One instance created by `ProjectsWorld`, passed to both the game and the DOM side.
2. `GameCanvas.tsx`: after the gate passed and component mounted, `await import('phaser')`
   (this dynamic import is the **only** entry point to game code — keeps the vendor chunk off every
   other page). Create the game: `type: Phaser.AUTO`, `scale: { mode: Phaser.Scale.RESIZE }`,
   parent div, arcade physics, `roundPixels: false`. **DPR (decision 11):** there is no `resolution`
   config in Phaser 3 and `Scale.RESIZE` ignores `zoom`, so the canvas renders at CSS pixels
   (effective DPR 1) natively — this satisfies the §9.7 "cap DPR at 2" budget by construction, no
   code needed. Do not add a `resolution` key or a manual backing-store multiplier in P0 (retina
   sharpness revisited at P1).
3. `BootScene`: `load.image('island', '/world/island-v1.webp')` + future manifest entries; forward
   `load.on('progress')` to `bridge` → DOM progress bar; on complete emit `boot:ready`.
4. Loading/entry screen in `ProjectsWorld.tsx` (bare, per decision 8): progress indicator →
   "Enter the island" button on `boot:ready`; clicking starts `IslandScene` and focuses the canvas
   container. "View as list" link visible on this screen too.
5. `IslandScene`: `add.image(0, 0, 'island').setOrigin(0)`; camera bounds `(0, 0, 4096, 4096)`;
   temporary camera position at map center (player arrives in slice 3). Zoom fixed at 1 (§6.10).
6. `WorldHud.tsx`: "view as list" button, **top-left** (decision 7), navigating to the
   language-correct `/projects`.
7. **Teardown**: `useEffect` cleanup in `GameCanvas` calls `game.destroy(true)` and nulls the ref.
   This must survive `ClientRouter` view-transition navigation.

**QA checklist**

- [ ] Desktop: loading → Enter → flat-green island fills the viewport; window resize resizes the
      canvas (no teaser swap).
- [ ] Navigate to `/projects` via HUD and back **3×**: exactly one canvas each time, no console
      errors, no runaway `requestAnimationFrame` (check with Performance monitor).
- [ ] Network tab on `/` and `/projects`: no `phaser-vendor`, no `/world/` requests. On the world
      route as mobile-emulated: teaser, still zero game bytes.
- [ ] Isolation script green (now with Phaser actually in the build — the real first test of it).
- [ ] `_headers` `/world/*.webp` rule present and syntactically matches the existing immutable
      entries; `island-v1.webp` loads in the scene.

---

## Slice 3 — Player + input + collision

**Goal:** the P0 movement criterion — walk the island with WASD/arrows, collide with hand-written
Tiled shapes, camera follows.

**Files**

- `src/components/react/world/input/types.ts`, `input/keyboardSource.ts`, `input/manager.ts` (new)
- `scenes/IslandScene.ts` (player, collision, camera follow)
- `public/world/maps/island.tmj` (new)

**Steps**

1. **Input layer** (the PRD's phase-2 touch contract — design it here, once):
   - `types.ts`: `InputSource` interface — sources push _intents_, never keys:
     `onMove(vector: {x,y})` (normalized, zero on release), `onInteract()`, `onDismiss()`.
   - `keyboardSource.ts`: **window-level** `keydown`/`keyup` (PRD §6.11 — HUD clicks must not kill
     movement). WASD + arrows → move vector; `E`/`Enter` → interact; `Esc` → dismiss. `M` reserved
     (audio is P2). **`preventDefault()` on keydown for every consumed key** (arrows, WASD, E/Enter,
     Space if ever mapped) while the source is active **and not paused** — the world page scrolls
     (slice 1 renders a heading + paragraph above the canvas) and Phaser's own capture list is
     bypassed by this design, so nothing else stops ArrowDown/Space from scrolling the document.
     Do **not** `preventDefault` while paused (a card is open) — the Dialog needs Esc/Tab and page
     a11y must work. On `window` blur: clear all held state and emit zero vector (stuck-key, §6.11).
   - `manager.ts`: registers sources, exposes `getMoveVector()`, `on('interact')`, and
     `setPaused(bool)`. **While paused, all intents are swallowed** — move reads zero, interact and
     dismiss are dropped. In P0 **no game code subscribes to dismiss**: when a card is open the
     Base UI Dialog closes itself via its own native Esc handler (slice 5, single owner per PRD
     §6.11 "Esc precedence"); the `onDismiss` intent still ships on the interface purely as the
     phase-2 touch contract (decision 2/6). Game code talks **only** to the manager.
2. `island.tmj` — hand-written Tiled 1.10 JSON. **Required top-level skeleton** (Phaser's
   `ParseTilesets`/`CreateGroupLayer` read `json.tilesets.length` and `json.layers` with no guard —
   omitting `tilesets` throws `TypeError` inside `make.tilemap`, even though the map has none):
   ```json
   {
     "type": "map",
     "version": "1.10",
     "tiledversion": "1.10.2",
     "orientation": "orthogonal",
     "renderorder": "right-down",
     "infinite": false,
     "width": 128,
     "height": 128,
     "tilewidth": 32,
     "tileheight": 32,
     "tilesets": [],
     "layers": [
       /* objectgroups below */
     ]
   }
   ```
   (128×32 = 4096 px, matching the painting.) **No `imagelayer`** in the committed P0 file — Phaser
   adds the painting as a plain image (slice 2), and an `imagelayer` with a relative `../` image
   path only risks a stray load; the visual backdrop returns via the Tiled editor at P1.
   - `objectgroup "collision"`: ~6–10 rectangles (map-border strips standing in for water, two
     blocks standing in for buildings/props).
   - `objectgroup "zones"`: `spawn` objects (this slice adds `island-center` as a temporary spawn;
     slice 4 replaces it with `outside-front-door`).
   - **Object kind uses the JSON key `"type"`** (`"type": "spawn"`, later `"door"`/`"project"`) —
     Tiled 1.10 writes `type` (1.9 briefly used `class`, renamed back in 1.10), and Phaser's
     `ParseObject` only keeps `type` (a `class` key is silently dropped, so a `?? obj.class`
     fallback is dead code — the loader reads `obj.type` only). Extra data (`slug`, `target`,
     `spawn`, `promptOffset`) as Tiled custom `properties`, per PRD §9.3.
   - **Validation**: after hand-writing, open in the Tiled editor and re-save once, so the committed
     file is Tiled-normalized output (catches format drift the editor would silently fix but Phaser
     would choke on).
3. Loader in `IslandScene`: `load.tilemapTiledJSON` → `make.tilemap` → iterate
   `getObjectLayer('collision')` rects into a static physics group of invisible bodies; read spawns
   into a name → point map. Dev-only debug rendering of collision bodies behind
   `?debug=1` (arcade debug flag).
4. Player: `Graphics`-generated rectangle texture (~48×64), arcade body, spawned at the spawn
   point. Per-frame: `manager.getMoveVector()` → velocity, normalized × **150 px/s** (PRD §6.10
   starting value), 8-directional. Collider vs the static group.
5. Camera: `startFollow(player, false, 0.1, 0.1)` (gentle lerp), bounds already clamped.
6. Validation step for the map file: open `island.tmj` in the Tiled editor once, confirm it loads
   without warnings (decision 4's pipeline proof); screenshot in the PR description.

**QA checklist**

- [ ] WASD and arrows both move the player, 8 directions, constant speed on diagonals.
- [ ] Player cannot cross any collision rect or leave the painting.
- [ ] Click a HUD element, then press keys — movement still works (window-level listeners).
- [ ] Hold a key, Cmd-Tab away, return — player is not walking by itself (blur clears intents).
- [ ] Hold ArrowDown/Space with the page scrolled — the document does **not** scroll (preventDefault).
- [ ] `island.tmj` opens clean in Tiled and was re-saved from Tiled before commit.

---

## Slice 4 — House + door transitions

**Goal:** the P0 door criterion — house ↔ island transitions both ways with fades and correct
spawn points; the house's cover-zoom rule works.

**Files**

- `public/world/maps/house.tmj`, `public/world/house-v1.webp` (new; 1536×1024 flat color)
- `src/components/react/world/scenes/HouseScene.ts` (new)
- `scenes/IslandScene.ts` (door object + spawn rename), shared scene helpers as needed

**Steps**

1. `house.tmj` (48×32 tiles of 32 px → 1536×1024): collision border + one interior block;
   `spawn "bed"`; `door` object at the bottom edge with properties `target: "island"`,
   `spawn: "outside-front-door"`.
2. `island.tmj`: add `door` (`target: "house"`, `spawn: "bed"`) on the placeholder house block;
   replace the temporary spawn with `spawn "outside-front-door"` beside it.
3. Extract the shared plumbing (map loading, collision build, player factory, door wiring) into a
   small helper used by both scenes — **only** what both scenes actually need, nothing speculative.
4. Doors trigger on **overlap** (walk into the zone), not on interact. `fadeOut` is **non-blocking**,
   so the transition must chain off its completion event, not the next line:
   `this.cameras.main.fadeOut(400)` → `this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
() => this.scene.start(target, { spawn }))`; the **target scene's `create()`** calls
   `this.cameras.main.fadeIn(400)`. A `transitioning` boolean guards against re-triggering while
   the fade runs (also prevents registering the `once` listener twice). Spawn the player at the
   named point, offset one body-height off the door zone so re-overlap doesn't instantly bounce back.
5. `HouseScene` camera: cover zoom `zoom = max(viewportW/1536, viewportH/1024)`, recomputed on the
   scale manager's resize event (PRD §6.10 small-scene exception).
6. **P0 initial spawn becomes the house `bed`** (matches PRD first-visit flow; no intro flags —
   that's P1 `state.ts`).

**QA checklist**

- [ ] Boot spawns in the house; walking into the door fades to the island at `outside-front-door`;
      walking back returns to `bed`. Repeat 5× without stuck states.
- [ ] House painting always covers the viewport (test a small and a very wide window).
- [ ] No double-transition when standing on the door zone as the fade ends.
- [ ] Both `.tmj` files still open clean in Tiled.

---

## Slice 5 — Info card

**Goal:** the P0 content criterion — an Elemix zone on the island opens the real collection-fed
card in fr and en; "View full project" navigates to the detail page.

**Files**

- `src/components/ui/dialog.tsx` (via `pnpm exec shadcn add dialog` — Base UI variant, pinned CLI)
- `src/components/react/world/ProjectCardOverlay.tsx` (new)
- `scenes/IslandScene.ts` (interaction zone handling), `public/world/maps/island.tmj` (Elemix zone)
- `ProjectsWorld.tsx` (mount overlay, wire bridge)
- `src/i18n/translations/world.ts` (add `card.viewProject` + any card labels — the world module, not shared)

**Steps**

1. `island.tmj`: add `project` zone (`slug: "elemix"`, `promptOffset`) with a placeholder colored
   rectangle standing in for the landmark sprite.
2. `IslandScene`: proximity check (player body vs zone + radius). In range: show a minimal floating
   `E` Phaser text at `promptOffset` (the real §6.6 affordances are P1). `manager.on('interact')`
   while in range → `bridge.emit('card:open', { slug })`.
3. `ProjectCardOverlay.tsx`: controlled Base UI `Dialog` listening to the bridge. Looks up the DTO
   by slug from island props; renders image (`imageUrl`), title, description, `Badge` per
   `techStack` entry, status `Badge`, and a `Button` linking to `detailUrl`. Quick scale/fade open
   (§6.7). Dialog handles Esc/outside-click/close-button natively.
4. **Input pause protocol** (decision 6): on `card:open` → `manager.setPaused(true)`; Dialog's
   `onOpenChange(false)` → `bridge.emit('card:close')` → `setPaused(false)` + refocus the canvas
   container. The world never handles Esc while a card is open — single owner, no double-handling.
5. Both languages get correct content for free (the DTO is built per-language page at build time);
   verify explicitly.

**QA checklist**

- [ ] Walk to the Elemix zone: prompt appears in radius, disappears out of radius.
- [ ] `E` and `Enter` open the card; movement is dead while open; `Esc`, close button, and
      outside-click all close it; movement resumes; a held movement key during open/close doesn't
      stick.
- [ ] Card shows real Elemix title/description/techStack/status/image on `/projects/world` (fr) and
      `/en/projects/world` (en); "View full project" lands on `/projects/elemix` resp.
      `/en/projects/elemix`.
- [ ] Isolation script green (dialog import must not leak world code elsewhere).

---

## Slice 6 — Fake-touch stub + acceptance sweep

**Goal:** prove the input abstraction with a second source (P0 criterion 6), then walk the entire
P0 checklist and close the milestone.

**Files**

- `src/components/react/world/input/fakeTouchSource.ts` (new)
- `ProjectsWorld.tsx` or `manager.ts` (source selection by query param)
- this doc (statuses, sweep results)

**Steps**

1. `fakeTouchSource.ts`: pointer-driven source mimicking phase-2 touch semantics — press-drag on
   the canvas emits a move vector toward the pointer; a short tap emits `interact()`. Same
   `InputSource` interface, zero changes to game code — that absence of change **is** the
   verification.
2. Activation: `?input=fake-touch` swaps the keyboard source for the fake-touch source at manager
   setup. Dev-only by obscurity (a query param on an unlinked route); a few hundred bytes, ships
   harmlessly.
3. Acceptance sweep: run every P0 criterion (table below) on a real desktop browser + DevTools
   mobile emulation; fix anything red inside this slice; record results here; flip all tracker
   rows to `done`.

**QA checklist**

- [ ] With `?input=fake-touch` and hands off the keyboard: walk to a door, transition, walk to the
      Elemix zone, tap to open the card.
- [ ] Full P0 acceptance table verified and recorded below.

---

## P0 acceptance criteria → slice traceability

| PRD §12 P0 criterion                                                             | Slice(s)                  | Verified |
| -------------------------------------------------------------------------------- | ------------------------- | -------- |
| Both world routes build statically; every other page unchanged (bundle diff = 0) | 1, 2 + script every slice | ☐        |
| Mobile/coarse-pointer visitors get the teaser; no game assets downloaded         | 1, 2                      | ☐        |
| Player moves (WASD/arrows) with collision against Tiled shapes                   | 3                         | ☐        |
| House → island door transition works both ways                                   | 4                         | ☐        |
| Interaction zone opens real Elemix card, both languages; button → detail page    | 5                         | ☐        |
| Input goes through the abstraction layer (fake touch source proof)               | 3 (design), 6 (proof)     | ☐        |

## P0-specific risks

| Risk                                                                                                | Mitigation                                                                                                                                                                          |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `client:only` + `ClientRouter` teardown leaks (first `client:only` in the repo)                     | Explicit `game.destroy(true)` in effect cleanup; 3× navigation QA in slice 2; if islands don't unmount cleanly under view transitions, fall back to an `astro:before-swap` listener |
| 4096² texture too heavy for a mid-tier GPU                                                          | Known in slice 2 already (placeholder is full-size by design); if it janks, quadrant chunking is the PRD's sanctioned fallback (§8.2) and only touches slice 2 code                 |
| Base UI Dialog focus behavior fights canvas focus                                                   | Input pause protocol has one owner (manager); refocus canvas on close is explicit in slice 5                                                                                        |
| Hand-written `.tmj` drifts from what Phaser accepts (missing `tilesets: []`, wrong object-kind key) | Required-skeleton snippet in slice 3; objects use `"type"`; re-save from Tiled before commit so the file is editor-normalized                                                       |
| Isolation regressions after P0 (shared code importing world modules)                                | The script is permanent and runs in every future slice's checklist                                                                                                                  |
