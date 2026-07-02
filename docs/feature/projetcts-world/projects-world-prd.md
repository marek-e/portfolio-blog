# PRD — Projects World: an interactive 2D island for discovering projects

|            |                                                    |
| ---------- | -------------------------------------------------- |
| **Status** | Draft — approved decisions, pre-implementation     |
| **Route**  | `/projects/world` (fr) · `/en/projects/world` (en) |
| **Owner**  | Marek Elmayan                                      |
| **Date**   | 2026-07-02                                         |

## 1. Overview

A hand-crafted, chill 2D world — a small island village in a clean, modern (non-pixel) Pokemon-like art style — where visitors spawn inside Marek's house, walk outside, and discover all portfolio projects as themed landmarks scattered across the island. Interacting with a landmark opens a polished info card fed by the existing content collection, linking to the full project detail page.

The existing text-based `/projects` page remains the default, SEO-safe, mobile-friendly variant. The world is a second, cross-linked variant at its own URL. The page is itself a work sample: its polish is the point.

**Why:** the projects page is currently a plain card grid. A memorable, explorable world differentiates the portfolio, showcases front-end craft directly (the medium is the proof), and gives visitors a reason to see _every_ project, not just the first row of cards.

## 2. Goals

- Visitors can walk a cohesive island, find all 6 projects, and reach any project detail page from the world.
- The world feels **chill and polished**: ambient motion, lofi audio, smooth movement, zero jank at 60 fps on a mid-tier laptop.
- The text variant remains the default experience; the world never costs anything (bytes or SEO) to visitors who don't enter it.
- Adding a future project requires only: one landmark image, one map placement, one slug reference.
- The art pipeline is reproducible: a prompt kit that anyone (starting with ChatGPT) can rerun to generate style-coherent assets.

## 3. Non-goals (V1)

- **No mobile gameplay** — phones get a polished teaser + one-tap link to the text page (touch controls are phase 2, see §12 Phase 2 backlog).
- **No NPCs, no quests** beyond the light discovery tracker. No dialog system.
- **No night/dark variant** of the world — day only (night is phase 2).
- **No changes to `/projects`** beyond the entry banner and the variant-parity fix (§6.1) — no redesign of the grid.
- **No multiplayer, no server state** — everything is static build output + `localStorage`.
- **No blog/contact/CV zones** — the map _hints_ at them (a locked building, see §6.3) but they hold no content.

## 4. Decision record

Decisions locked during the design interview (2026-07-02):

| #   | Decision               | Choice                                                                                          |
| --- | ---------------------- | ----------------------------------------------------------------------------------------------- |
| 1   | World scope            | Projects-first, map designed expandable                                                         |
| 2   | Project representation | Themed landmark + in-game info card linking to detail page                                      |
| 3   | Spawn house role       | Intro/tutorial + 2–3 about-me props                                                             |
| 4   | Map ↔ data             | All 6 projects, hand-placed; card content from content collection at build time                 |
| 5   | Variant coexistence    | Separate route `/projects/world`, cross-linked, no auto-redirect                                |
| 6   | Mobile                 | Desktop V1; mobile teaser page; touch as phase 2; input layer abstract from day 1               |
| 7   | Engine                 | Phaser 3, lazy-loaded only on the world route                                                   |
| 8   | Art sourcing           | Fully AI-generated first (prompt kit for coherence); HD cartoon pack as fallback                |
| 9   | Map construction       | Large painted backgrounds + invisible Tiled collision/interaction shapes + layered prop sprites |
| 10  | Player character       | Cartoon avatar of Marek, 4 static directional poses + procedural motion                         |
| 11  | Ambience               | Ambient motion layers, no NPCs; simple animals nice-to-have                                     |
| 12  | Audio                  | Lofi loop + soft SFX after explicit entry click; persistent mute                                |
| 13  | Theme                  | Day-only V1; night variant phase 2                                                              |
| 14  | Progression            | Discreet "X/6 discovered" tracker, `localStorage`, celebration at 6/6                           |
| 15  | Entry points           | Animated banner on `/projects` + footer sitemap link; navbar unchanged                          |
| 16  | Setting                | Small island village (water bounds the map naturally)                                           |
| 17  | Rollout                | Route stays unlinked until fully polished; single reveal                                        |

## 5. Users & stories

- **Recruiter / hiring manager** (desktop, curious, 3–10 min): "I opened the projects page, saw an inviting 'explore the island' banner, spent five minutes walking around, and left remembering this portfolio over the other forty."
- **Fellow developer** (desktop, inspects everything): "I found all 6 landmarks, got the confetti, and then read how it was built."
- **Casual/mobile visitor**: "I got a nice teaser telling me the island is a desktop thing, and one tap took me to the normal projects list. Nothing felt broken."
- **Returning visitor**: "It remembered which projects I'd found and spawned me outside the house instead of replaying the intro."

## 6. UX specification

### 6.1 Routes & variant switching

- `/projects` and `/en/projects` — unchanged text grid, **default** everywhere.
- `/projects/world` and `/en/projects/world` — the game. Statically generated page whose only heavy content is the lazily hydrated game island.
- Cross-links, both directions, always visible:
  - On `/projects`: animated banner at the top of the grid — illustrated strip of the island + CTA ("Explorer l'île" / "Explore the island"). Distinctive but not blocking; the grid remains immediately visible below.
  - On `/projects/world`: a "Voir la liste" / "View as list" button in the HUD (top corner), plus the same link on the loading/entry screen.
- No auto-redirect in either direction. No preference cookie — URLs are the preference.
- Footer sitemap gains a "Projects World" link (both languages).
- **Variant parity prerequisite**: the text page currently renders only `featured: true` projects (`src/pages/[...lang]/projects/index.astro`), so Petanque (`featured: false`) is unreachable from the grid while the world shows all 6. Before launch, every world project must be reachable from `/projects` — recommended fix: a small secondary "More projects" section for non-featured entries (alternative: flip Petanque to featured). Decide at P1 (§14).

### 6.2 Loading & entry screen

1. Navigating to the world route renders instantly: page shell, title, and a branded **loading screen** (island illustration crop, progress bar, one rotating hint like "WASD / arrows to move").
2. Asset preload runs (paintings, character, props, UI sounds). Music is _not_ preloaded — it streams after entry.
3. When ready, the progress bar becomes an **"Enter the island" button**. This explicit click is the audio-unlock gesture (§10) and the moment the canvas takes focus.
4. Mobile / small viewports (`< 1024px` or coarse pointer, evaluated once at mount): skip all of the above; render the **teaser** instead — a screenshot of the island, "Best experienced on a desktop", and a prominent link to the text projects page. No engine or world-asset bytes are downloaded (the island's own shell JS — React + teaser/HUD code — necessarily loads before the gate can run; only Phaser and assets sit behind it).
5. `prefers-reduced-motion`: world loads normally but with ambience animation disabled (§6.9).

### 6.3 The island (exterior)

A compact island village, ~3–4 viewport-widths across (30–60 s to walk end-to-end). Water bounds every edge — no invisible walls. Layout anchors (final placement during map painting, P1):

- **Marek's house on a small hill** (north) — spawn building. A wooden sign at its door is the _Personal Portfolio_ landmark: the house is the portfolio, meta and true.
- **Village center** with a fountain or plaza — natural hub the paths radiate from.
- **Beach + pier** (south) — chill anchor: waves, moored boat, gulls.
- **The 5 remaining landmarks** (§7) spread so no two are visible in the same screen — exploration must pay off.
- **One locked building** — a shuttered **library** with a "coming soon" sign — the expansion hook for the future blog zone (decision #1). Interacting shows a one-line teaser card. (A contact zone — post office/mailbox — would be added separately in phase 2, not by reusing this building.)
- **6/6 celebration spot**: a small viewpoint bench (cliff over the sea) that acknowledges completion (§6.8).

### 6.4 The house (spawn & intro)

Single small interior room. Purpose: teach the two mechanics (move, interact) through curiosity, not tutorials.

- **First visit**: spawn beside the bed. A soft pulsing hint shows movement keys (fades after first input). The room contains exactly three interactable props:
  1. **Desk with computer** — card shows the developer ID: reuse the `t.devCard` translation content (name, job, tech stack) or embed the existing `DevIdCard` component directly in the overlay.
  2. **Bookshelf** — one-liner about learning/writing (light hook toward the blog).
  3. **Running shoes by the door** — one-liner nodding to the Strava/running section.
- Interacting with any prop teaches the interact key; the door to outside glows subtly once the player has moved.
- **Return visits**: spawn _outside_ the front door. The house stays enterable. The `world:intro-done` flag is set **the first time the player exits through the front door** (movement + door interaction completed = tutorial done); a visitor who quits mid-intro replays it next visit.

### 6.5 Controls (desktop V1)

| Input               | Action                                                |
| ------------------- | ----------------------------------------------------- |
| `WASD` / arrow keys | Move (8-directional, walk speed only — chill, no run) |
| `E` / `Enter`       | Interact with highlighted landmark/prop               |
| `Esc`               | Close card / dismiss                                  |
| `M`                 | Toggle mute                                           |

- Input goes through an **abstraction layer** (intent-based: `move(vector)`, `interact()`, `dismiss()`) so phase-2 touch (virtual joystick + tap) plugs in without touching game logic (decision #6).
- When a card is open, world input pauses; focus moves into the card (§6.7).

### 6.6 Interaction affordance

- Landmarks are **always separate layered sprites** above the painting (see §8.2) — this is what makes the affordances below possible; you can't outline a region of flat painting pixels.
- Within interaction radius of a landmark: the landmark sprite gets a soft **glow/outline**, and a small floating prompt (`E` keycap icon) bobs above it, positioned via the zone's `promptOffset`.
- Undiscovered landmarks additionally emit an idle sparkle so they read as "points of interest" from a distance; discovered ones swap the sparkle for a subtle checkmark marker (§6.8). Both are anchored via `promptOffset`, independent of the painting.
- The Personal Portfolio landmark (wooden sign on the spawn house, §7) is itself a small layered sprite, so it gets the same treatment.

### 6.7 Project info card

- **DOM overlay** (React + existing shadcn design system) rendered above the canvas — _not_ canvas-drawn UI. This buys accessibility, i18n, theme-awareness, and reuse of `Badge`/`Card`/button styles for free.
- Content, per project, from the content collection at build time: title, description, tech stack badges, status badge, project image, **"View full project"** button → existing detail page (`/projects/[slug]` or `/en/projects/[slug]`).
- Opens with a quick scale/fade (Pokemon-dialog energy, not a modal thud). Closes via `Esc`, close button, or clicking outside.
- Card follows the site theme (light/dark); the world behind stays day-lit (decision #13).
- First open of a card marks that project **discovered** (§6.8).

### 6.8 Discovery tracker & celebration

- Discreet HUD chip (top corner): "Projets découverts : 4/6" / "Projects discovered: 4/6".
- State: `localStorage` array of discovered slugs; survives visits; no server.
- Discovered landmarks show a small persistent checkmark marker in-world.
- At 6/6: one-time confetti burst + the HUD chip briefly celebrates; the viewpoint bench (§6.3) gains a congratulatory sign card ("You've seen everything — thanks for exploring"). Re-triggerable only by clearing storage.

### 6.9 Accessibility

- **Cards and HUD are DOM** — screen-reader accessible, focus-trapped while open, restore focus to canvas on close.
- **Keyboard-only playable** by construction (it's the primary input).
- **`prefers-reduced-motion`**: disable particles, character bob, ambient loops, camera smoothing, confetti; world remains fully functional.
- The world is inherently visual; the **equivalent experience is the text page**, linked from the HUD, the entry screen, and the teaser. This is stated honestly rather than pretending a canvas can be non-visual.
- Canvas gets `role="application"` and an `aria-label`; a visually-hidden paragraph on the page describes the world and links every project (also serves SEO, §9.8).

### 6.10 Canvas & viewport

- **Page chrome**: the world route is immersive — the canvas fills the viewport; no navbar/footer during play. The site `Layout` still wraps the page (head, theme, hreflang), and the HUD's "View as list" button is the way out.
- **Scaling**: Phaser `Scale.RESIZE` — the canvas always matches the viewport; camera zoom fixed at 1 on the island (1 painting px = 1 CSS px), `devicePixelRatio` capped at 2 (§9.7). No letterboxing.
- **Small-scene exception**: when a scene's painting is smaller than the viewport (the house interior), camera zoom rises to the cover ratio — `zoom = max(viewportW / paintingW, viewportH / paintingH)` — so the painting always fills the canvas. If cover-zoom blur shows on large displays, regenerate the interior at 2× (§8.2).
- **Proportions at zoom 1**: a 1280 px viewport sees ~31% of the 4096 px island width (~3.2 viewport-widths across); at 1600 px it's ~2.6 widths — the §6.3 "~3–4 viewport-widths" target holds for typical viewports and stays close enough at the wide end that "no two landmarks in the same screen" remains the binding constraint for landmark placement. Character renders ~96–128 px tall (§8.2).
- **Walk speed**: starting value ~150 world-px/s, tuned in P1 so a direct island crossing takes ~30 s (the §6.3 "30–60 s to walk end-to-end" includes path curvature).
- **Resize rules**: the mobile/teaser gate (§6.2) is evaluated **once at mount**; resizing the window after entry only resizes the camera viewport — it never swaps to the teaser mid-session.

### 6.11 Runtime lifecycle

- **Tab hidden** (`visibilitychange`): pause the game loop; fade music out. On return: resume, fade music back in.
- **Window/canvas blur**: clear all held input intents in the input layer (§6.5) — prevents the classic stuck-key walk-into-a-wall bug.
- **Keyboard listeners live at `window` level**, so clicking DOM HUD elements never kills movement input.
- **`Esc` precedence**: closes the open card only; no other effect.

### 6.12 Failure modes

- **Asset preload error, or stall > 15 s**: replace the progress bar with a friendly error card — retry button + prominent link to the text projects page (the designated equivalent, §6.9).
- **Renderer**: WebGL → Canvas2D fallback (Phaser `AUTO`); if neither works, render the teaser.
- **`localStorage` unavailable** (Safari private mode, lockdown): every access wrapped in try/catch, degrading to in-memory state — discovery tracker, intro flag, and mute all work for the session, persistence is lost silently.

## 7. Content mapping — projects → landmarks

Card data (title, description, techStack, status, image, detail-page link) is **always** sourced from the content collection — the map only stores slugs. Landmark art is bespoke per project:

| Project               | Landmark concept                                                             | Why                                                |
| --------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------- |
| Personal Portfolio    | **The spawn house itself** — wooden sign at the door                         | The house _is_ the portfolio; frees an island slot |
| Elemix                | **Building under construction** — scaffolding, glowing blue component blocks | A framework is scaffolding you build with          |
| Minesweeper LLM Arena | **Mine entrance** — numbered crates, warning flags planted outside           | Literal minesweeper iconography                    |
| Next-Armored          | **Small shield tower / armory** — banner with a shield crest                 | Security hardening = fortification                 |
| Equinox Theme         | **Sundial monument** in a clearing — half in warm light, half in cool shadow | Equinox = day/night balance                        |
| Petanque              | **Petanque court under plane trees** — boules and cochonnet on the ground    | Literal, and peak chill                            |

**Adding project #7** (the scaling contract, decision #4): generate one landmark sprite with the prompt kit → in Tiled, place the sprite reference plus a collision shape and an interaction zone carrying the project's slug. The Tiled file is the single source of the slug ↔ zone mapping (§9.3) — no code changes.

## 8. Art direction & prompt kit

### 8.1 Style bible

The one paragraph that must appear **verbatim in every generation prompt**:

> Clean modern 2D game illustration, soft cel shading, smooth rounded vector-like shapes, thin subtle outlines, warm saturated colors, gentle ambient occlusion, top-down 3/4 view (camera angled ~45° down), orthographic perspective with no vanishing point and uniform scale across the image, soft sunlight from the top-left, cozy casual game aesthetic inspired by modern Pokémon towns — absolutely no pixel art, no photorealism, no 3D render look.

Fixed style parameters:

- **Perspective**: top-down 3/4, orthographic. Building fronts visible, roofs visible. Never a horizon line inside world paintings.
- **Light**: sun top-left, soft shadows bottom-right, consistent everywhere.
- **Palette anchors**: warm grass green, turquoise-to-deep-blue sea, sandy cream paths, terracotta + wood buildings, one accent color per landmark (e.g. Elemix blue, Next-Armored steel).
- **Line & shape**: rounded, friendly, chunky silhouettes; detail density medium (readable at 100% zoom, not busy).

### 8.2 Asset inventory & technical specs

| Asset                                 | Spec                                                                                                                  | Notes                                                                                                                                                      |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Island painting                       | 4096×4096 master, exported WebP q80 (~1.5–2.5 MB)                                                                     | 4096 is the safe GPU texture ceiling; chunk into quadrants if needed (coords stay authoritative, §9.3)                                                     |
| House interior painting               | ~1536×1024 WebP                                                                                                       | Single room; regenerate at 2× if cover-zoom blur shows on large displays (§6.10)                                                                           |
| Character poses                       | 1 sheet → 4 sliced PNGs, ~256px tall source, rendered ~96–128px                                                       | Front / back / left / right (§8.3 sheet trick)                                                                                                             |
| Landmark sprites ×5 + house door sign | Transparent PNG, 512–1024px (sign smaller)                                                                            | **Always** layered sprites above the painting — required by the §6.6 affordances (glow/outline, checkmark). The map painting leaves cleared sites for them |
| Ambient sprites                       | Small transparent PNGs: butterfly (2 frames), gull (2 frames), smoke puff, sparkle, leaf/pollen particle              | Forgiving, low consistency risk. Sparkle doubles as the undiscovered-landmark marker (§6.6)                                                                |
| Ambience techniques (not sprites)     | Cloud/light drift: large soft translucent shapes scrolled slowly; water shimmer: subtle tween/shader on the shoreline | Implementation techniques, no generation needed                                                                                                            |
| Entry banner strip                    | ~1600×400 WebP for `/projects`                                                                                        | Dedicated prompt (Step 7) or a crop of the master painting; produced at P2                                                                                 |
| Loading-screen crop + teaser image    | Crops of the master painting, sized at implementation                                                                 | Produced at P1/P2                                                                                                                                          |
| OG share image                        | 1200×630 crop of the master painting                                                                                  | Produced at P2                                                                                                                                             |
| UI/HUD                                | None generated — DOM + existing design system                                                                         |                                                                                                                                                            |

All world art lives in `public/world/` (Phaser loads assets at runtime, so they must be in `public/`, not `src/assets/` — note this differs from project card images, which live in `src/assets/projects/` and are served content-hashed via `astro:assets`). **A new `/world/*` rule must be added to `public/_headers`** — today only `/_astro/*`, `/bg-*.webp` and `/favicon.svg` get long-lived caching; everything else defaults to 1-hour revalidation, which would re-fetch the multi-MB painting hourly. Use the 1-year-immutable pattern with versioned filenames (e.g. `island-v1.webp`).

### 8.3 Prompt templates

**Generation order matters** — each step feeds the next as a reference image:

**Step 1 — Master style frame** (generate first, iterate until loved; it becomes the attached reference for _everything_ else):

> {STYLE BIBLE}. A small cozy island village seen from above: a wooden house on a grassy hill to the north, a tiny village plaza with a fountain, a sandy beach with a wooden pier to the south, scattered pine and palm trees, flower patches, dirt paths connecting everything, calm turquoise sea surrounding the island. No characters, no text, no UI.

**Step 2 — Full island map** (attach master frame + style bible). The landmarks themselves are **not** painted into the map — they are layered sprites (§6.6/§8.2); the map provides cleared, prepared sites for them:

> Using the exact same art style, palette, perspective and lighting as the attached reference: a complete orthographic game map of the whole island, 1:1 square. Layout: {explicit layout description — house on north hill, plaza center with fountain, beach+pier south, one shuttered library building near the plaza, viewpoint bench on a sea cliff, and five cleared open sites (flattened grass/dirt patches, no structures) at north-east, west, south-west, east, and south-east where landmark objects will be placed separately}. Uniform scale, every area walkable-looking with connecting paths, no characters, no text labels.

**Step 3 — House interior** (attach master frame):

> Same style/perspective/lighting as reference: interior of a small cozy one-room wooden house seen from above — bed, desk with a computer, bookshelf, rug, running shoes by the door, warm morning light through the window. No characters, no text.

**Step 4 — Character sheet** (attach master frame; _one image, four poses_ — the single-image trick is what keeps the four directions consistent):

> Same art style as reference: character sheet of one young man ({Marek's description — hair, glasses?, outfit e.g. casual dev: t-shirt, jeans, sneakers}), chibi proportions about 3 heads tall, standing relaxed, shown in exactly 4 views side by side in a row: facing camera, facing away, facing left, facing right. Identical character in all four. Plain flat background, full body, no shadows on ground, no text.

**Step 5 — Landmark sprites** (attach master frame; template per landmark):

> Same style/perspective/lighting as reference: {LANDMARK_DESC from §7 table}, single isolated object/building on a plain flat single-color background for cutout, top-down 3/4 angle matching the reference map. No characters, no text.

**Step 6 — Ambient sprites** (same pattern, tiny subjects).

**Step 7 — Entry banner strip** (attach master frame): wide crop-style composition of the island for the `/projects` banner (~4:1 ratio) — or simply crop the master painting if a good strip exists.

### 8.4 Consistency workflow

1. Never generate without attaching the master style frame _and_ pasting the style bible verbatim.
2. Accept/reject at the **style** level first (palette, outline weight, perspective) before judging content.
3. Keep a `docs/feature/art/` folder (or Figma page) with every accepted asset — the growing reference set _is_ the style guide.
4. Post-process pass per asset: background removal (landmark and ambient sprites), color-balance nudge toward the palette anchors, downscale with sharpening.
5. **Kill criterion**: if after ~2 focused sessions the island painting can't hold one coherent style, switch to the fallback — buy one HD cartoon top-down pack family (single artist, CraftPix/itch.io, ~$20–60) for terrain/interior/character and keep AI generation only for the 5 landmark sprites + house sign (decision #8).

## 9. Technical architecture

### 9.1 Integration shape

```
src/pages/[...lang]/projects/world.astro   ← static page, SEO shell, teaser, loads island
  └─ <ProjectsWorld client:only="react" projects={...} t={...} lang={...} />
       src/components/react/world/
         ProjectsWorld.tsx        ← mount/teardown, loading screen, teaser gate
         GameCanvas.tsx           ← dynamic import('phaser'), scene boot
         ProjectCardOverlay.tsx   ← shadcn card, listens to game events
         WorldHud.tsx             ← tracker chip, mute, "view as list"
         bridge.ts                ← typed EventEmitter between Phaser ↔ React
         input/                   ← intent-based input layer (keyboard now, touch later)
         scenes/                  ← Boot, House, Island
         state.ts                 ← localStorage schema + helpers
```

- `client:only="react"` — Phaser cannot SSR; nothing game-related executes at build. (This is the repo's first use of `client:only` — existing islands use `client:load`/`client:visible` — but it follows the same island rules in docs/ASTRO-REACT.md.)
- **Phaser is dynamically imported** inside the island after the mobile/teaser gate passes, and split into its own Vite manual chunk (`phaser-vendor`, joining the existing `mermaid-vendor`/`katex-vendor` pattern). Visitors to every other page — and mobile visitors to this page — download zero game bytes.
- React 19 + Astro island rules apply: the whole game UI is **one** island (canvas + overlay + HUD in a single tree) so context/state sharing works — per the repo's island-context gotcha.

### 9.2 Scenes & systems

- **BootScene**: loads manifest, drives the DOM loading bar via bridge events.
- **HouseScene** / **IslandScene**: painting as base image layer, props as sprites with y-sorted depth, ambient layer, player.
- **Transitions**: door triggers fade-out → scene switch → fade-in (~400 ms).
- **Camera**: follows player with gentle lerp, clamped to painting bounds; `roundPixels` off (smooth art, not pixel art).
- **Physics**: Arcade. Player AABB vs static collision shapes.

### 9.3 Map & collision pipeline

- **One Tiled map per scene** (island, house). Map dimensions = painting native pixels with a nominal tile size (32 px — required by Tiled/Phaser even for object-only maps). The painting is an image layer anchored at (0,0), so **Tiled coordinates are Phaser world coordinates 1:1**. If the painting is chunked into quadrants (§8.2), chunks are positioned to preserve this — the Tiled coordinate space stays authoritative.
- Collision polygons, interaction zones, spawn points, landmark sprite anchors, and depth hints are drawn as object layers. Export JSON → loaded by Phaser.
- **Object schema**:

| Object type       | Properties                        | Meaning                                                                                                                                |
| ----------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `project`         | `slug`, `promptOffset: {x, y}` px | Interaction zone; slug is the canonical project slug (§9.4). The zone in Tiled is the **single source** of the slug ↔ landmark mapping |
| `prop`            | `id`, `promptOffset`              | House props (desk, bookshelf, shoes), bench, locked building                                                                           |
| `door`            | `target: sceneKey`, `spawn: name` | Scene transition trigger                                                                                                               |
| `spawn`           | `name`                            | Named spawn point — V1 needs at least `bed` (house) and `outside-front-door` (island)                                                  |
| `landmark-anchor` | `sprite`, `sortY?`                | Where a landmark sprite renders; optional `sortY` overrides y-sorted depth                                                             |

- The painting itself is dumb pixels; **all** gameplay data lives in the Tiled files. Re-generating art never breaks gameplay, and adding a project never touches code (§7).

### 9.4 Data flow (build time)

- `world.astro` calls `getCollection('projects')`, filters by language the way existing pages do (`entry.id.startsWith(`${lang}/`)` — the glob loader has no lang parameter and entries expose `id`, not `slug`), and maps to a minimal DTO: `{ slug, title, description, techStack, status, imageUrl, detailUrl }`, passed as island props. No client-side fetching, no duplication of content — frontmatter stays the single source of truth (decision #4).
- **Canonical slug** = entry `id` with the language prefix and extension stripped (exactly how `[slug].astro` derives it). It is identical across fr/en, so Tiled zone slugs and `world:discovered` are **language-agnostic by construction** — discovery state survives switching languages.
- **`imageUrl`**: the frontmatter `image` string is _not_ servable as-is (real files live in `src/assets/projects/` and are resolved via `getProjectImage()` in `src/lib/images.ts`; several have no `public/` copy). `world.astro` must resolve it at build time via the existing helper + `astro:assets` `getImage()` and put the resulting optimized URL in the DTO.
- **`detailUrl`**: built at build time with the site's language-aware path pattern (`/projects/${slug}` for fr, `/en/projects/${slug}` for en).
- There is **no separate landmark registry file** — the slug property on each Tiled `project` zone is the only world ↔ content mapping (§9.3).

### 9.5 i18n

- All world strings (HUD, hints, entry screen, teaser, celebration, locked-building teaser) go through the existing system: keys added to `src/i18n/ui.ts` + `fr.ts`/`en.ts`, resolved in `world.astro`, passed to the island. French default at `/projects/world`, English at `/en/projects/world` — standard `prefixDefaultLocale: false` behavior, hreflang handled by the existing Layout.
- Suggested world name: **"L'île de Marek" / "Marek's Island"** (final naming during P1).

### 9.6 State persistence (`localStorage`)

| Key                | Value               | Purpose                               |
| ------------------ | ------------------- | ------------------------------------- |
| `world:discovered` | `string[]` of slugs | Tracker + checkmarks + celebration    |
| `world:intro-done` | `boolean`           | Return visits spawn outside the house |
| `world:muted`      | `boolean`           | Audio preference                      |

Slugs are the canonical language-agnostic form (§9.4). No positional save; sessions always start at a designed spawn. All access degrades gracefully when storage is unavailable (§6.12).

### 9.7 Performance budget (hard limits)

| Metric                                                                    | Budget                                                            |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Game-route initial payload (engine + paintings + character + props + SFX) | ≤ 4 MB compressed                                                 |
| Music                                                                     | Streamed after entry click, excluded from budget                  |
| Time from navigation → "Enter the island" ready (broadband)               | ≤ 3 s                                                             |
| Frame rate                                                                | 60 fps on a mid-tier 2020 laptop; degrade ambience first if below |
| Every other page on the site                                              | 0 added bytes                                                     |
| Canvas resolution                                                         | Cap `devicePixelRatio` at 2                                       |

Browser support: last 2 versions of desktop Chrome, Firefox, Safari, and Edge.

### 9.8 SEO

- The world page ships static title/description/OG image (island illustration — strong social-share card) and the hidden descriptive paragraph with real links to all projects (§6.9).
- `/projects` remains the canonical home of project content; the world page is indexed but competes with nothing.

## 10. Audio

- **Music**: one royalty-free chill/lofi ambient loop (license permitting web embedding, attribution documented). Starts after the "Enter the island" click (the click is the browser autoplay-unlock gesture). Gentle fade-in; ~2–4 MB, streamed, never blocks entry.
- **SFX** (short, quiet): footsteps (surface-agnostic), interact blip, card open/close, discovery chime, confetti pop, door transition whoosh. Sourced royalty-free.
- **Mute** toggle in HUD + `M` key; persisted; muted state kills music _and_ SFX. Music fades out when the tab is hidden and back in on return (§6.11).
- Ambient layer (waves, birds) only if it stays subtle — nice-to-have, not required for launch.

## 11. Measurement

Cloudflare Web Analytics (already active) is page-view based, so V1 metrics are deliberately modest:

- **Adoption**: `/projects/world` page views ÷ `/projects` page views — target ≥ 20% after launch month.
- **Qualitative**: unsolicited mentions (LinkedIn comments, interview conversations) — honestly the real KPI for a portfolio.
- Custom events (entered world, discoveries, 6/6, variant switches) require an event-capable provider — logged as future work, not a V1 dependency.

## 12. Milestones & acceptance criteria

### P0 — Playable skeleton (placeholder art)

Colored rectangles for everything; proves the whole pipeline before any art exists.

- [ ] `/projects/world` + `/en/projects/world` build statically; every other page unchanged (bundle diff = 0).
- [ ] Mobile/coarse-pointer visitors get the teaser; no game assets downloaded.
- [ ] Player moves (WASD/arrows) with collision against Tiled shapes on a placeholder island.
- [ ] House → island door transition works both ways.
- [ ] One interaction zone opens the real info card with real Elemix data from the collection, in both languages; "View full project" navigates to the detail page.
- [ ] Input goes through the abstraction layer (verified by stubbing a fake touch source).

### P1 — Real world & full content

- [ ] Final island + interior paintings in place (prompt kit executed; style approved or fallback triggered per §8.4 kill criterion).
- [ ] Character with 4 directional poses + procedural motion (bob, lean, shadow, dust); walk speed tuned per §6.10.
- [ ] All 6 landmarks placed as layered sprites, interactable with full affordance states (glow/outline, floating prompt, sparkle/checkmark — §6.6), cards correct in fr + en.
- [ ] House intro: 3 props, movement hint, glowing door; `world:intro-done` set on first door exit (§6.4).
- [ ] Discovery tracker + checkmarks persist across reloads and across language switches (§9.4 slug form).
- [ ] Locked "coming soon" library present.
- [ ] Variant parity on `/projects` resolved (§6.1 — Petanque reachable from the text grid).

### P2 — Polish & launch

- [ ] Ambience layers (cloud/light drift, leaf/pollen particles, butterflies, gulls, chimney smoke, water shimmer — §8.2).
- [ ] `prefers-reduced-motion` disables particles, character bob, ambient loops, camera smoothing, and confetti (§6.9).
- [ ] Music + SFX + mute persistence; tab-hidden pause/fade behavior (§6.11).
- [ ] Failure modes implemented: preload error/stall card, renderer fallback, storage fallback (§6.12).
- [ ] 6/6 celebration (confetti + bench sign).
- [ ] Loading/entry screen polished; teaser polished.
- [ ] A11y pass: card focus trap + focus restore, canvas `role`/`aria-label`, visually-hidden descriptive paragraph with links to every project (§6.9).
- [ ] SEO: title/description/OG image on the world route (§9.8); banner strip, teaser, and OG assets produced (§8.2).
- [ ] Performance budget (§9.7) verified on a mid-tier laptop; browser matrix (§9.7) passes.
- [ ] _(Optional stretch, cut without blocking launch)_ Simple animals: sleeping cat, pond ducks (2-frame loops) — the decision-#11 nice-to-have.
- [ ] Entry banner on `/projects` + footer link added — **the reveal moment** (route was unlinked until now).
- [ ] `/validate` (format + lint + build) green.

### Phase 2 backlog (post-launch, in rough priority)

1. **Mobile touch**: virtual joystick + tap-to-interact + responsive canvas (input layer is ready for it).
2. **Night variant**: dark theme spawns dusk world — lit windows, lampposts, fireflies (second painting set via the same prompt kit).
3. **World expansion**: the locked library opens as the blog zone; a contact zone (post office/mailbox) added separately.
4. Custom analytics events.

## 13. Risks & mitigations

| Risk                                                           | Likelihood                      | Mitigation                                                                                                                                                |
| -------------------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AI art won't hold one coherent style across assets             | **High** — the top project risk | Master-style-frame workflow (§8.3), style bible verbatim in every prompt, single-image character sheet, explicit kill criterion → HD pack fallback (§8.4) |
| Island painting too heavy (4096² WebP)                         | Medium                          | q75–80 WebP, quadrant chunking, cap DPR at 2; budget enforced at P2 gate                                                                                  |
| Phaser bundle bloat leaking to other pages                     | Low                             | `client:only` + dynamic import + manual chunk; P0 acceptance criterion checks bundle diff = 0                                                             |
| Scope creep (NPCs, quests, night, mobile "while we're at it")  | High                            | Non-goals list (§3) + phased backlog; anything new goes to Phase 2 backlog by default                                                                     |
| Perspective/scale drift between painting and character/props   | Medium                          | Orthographic rule + fixed light direction in style bible; test-composite each asset over the map before acceptance                                        |
| Polished-only rollout stalls (perfectionism, no ship pressure) | Medium                          | P0/P1/P2 gates each have binary acceptance criteria; "polished" = P2 checklist done, not a feeling                                                        |

## 14. Open questions

1. Exact character description for the prompt kit (hair, glasses, outfit) — needed at P1 start.
2. World name confirmation ("L'île de Marek" / "Marek's Island").
3. Music track selection + license (P2).
4. Variant parity mechanism on `/projects` (§6.1): secondary "More projects" section (recommended) vs flipping Petanque to `featured: true` — decide at P1.
