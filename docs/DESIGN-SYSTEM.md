# Design System

Visual rules for melmayan.fr. The goal is a site that feels **premium** (people want to work with me) with an **artistic pastel touch**. Product goals and content rules live in [DESIGN-SPEC.md](DESIGN-SPEC.md); Tailwind usage lives in [STYLING.md](STYLING.md).

The live reference is `/design-system`. Update it when you add or change a token, utility or component variant.

## Directives

Decisions taken during the 2026 rebrand review. Treat them as constraints, not suggestions.

1. **Brand colours are orange (light) and purple (dark).** `--primary` carries them. Pastels decorate; they never replace the brand colour.
2. **The hero keeps the day/night valley photos** (`BackgroundImage.astro`). No full-page gradient or aurora backgrounds: the page background stays the plain `--background`.
3. **The desktop navbar and the footer keep their original layout.** The footer's details follow the design language: an eyebrow label, a hand-drawn underline on link hover (`.hand-underline-hover`, which draws in), a hand-drawn divider, round frosted social buttons, and the name in the display serif. Don't restructure either of them as part of other work.
4. **Mobile navigation is a bottom tab bar** (`MobileTabBar.astro`), never a hamburger sheet. Every destination is one tap away.
5. **Glass is for the home page and a few CTAs.** Blog, projects, CV and other pages use solid `surface` cards or pastel-tinted fills. If glass shows up on a reading page, it's a mistake.
6. **Pastels must stay vivid.** Low-alpha pastel fills (`/12`) read as washed out and were rejected. See [Pastels](#pastels) for the minimums.
7. **Hand-drawn marks replace default decorations.** Section titles use the marker underline and links use the hand-drawn stroke, never `decoration-wavy` or plain underlines.
8. **Craft is checked at 4× zoom.** Edge hairlines, double rims and fringes are bugs, even if they're invisible at 1×. See [Edge artifacts](#edge-artifacts).
9. **Mobile is tested from 320px up to 430px**, in both languages and both themes, before anything ships.

## Typography

| Role                             | Font                  | How                                                   |
| -------------------------------- | --------------------- | ----------------------------------------------------- |
| Display (h1, h2, card titles)    | Fraunces              | automatic on `h1`/`h2`; `font-display-soft` elsewhere |
| Artistic accent word             | Fraunces italic, WONK | `font-display-wonk`, or `MarkedText`                  |
| Body                             | Geist                 | default `font-sans`                                   |
| Code, tags, dates, stats, labels | MapleMono             | `font-mono`; `eyebrow` for small uppercase labels     |

- MapleMono is the developer signature. Keep it for metadata and numbers, never for paragraphs.
- Section titles always go through `SectionHeading.astro`. It italicises the last word and draws the marker under it.
- Home sections carry numbered eyebrows (`01 — …` to `05 — …`), translated in both languages.

## Colour

### Brand

- `--primary`: orange `oklch(0.67 0.16 58)` in light, purple `oklch(70.2% 0.183 293.541)` in dark.
- `--marker` follows the primary colour. It's used by the title underline and the link stroke.

### Pastels

Tokens: `pastel-peach`, `pastel-rose`, `pastel-lilac`, `pastel-sky`, `pastel-mint`, `pastel-butter`. Each has an `-ink` shade for text on it (`text-pastel-sky-ink`): deep in light mode, light in dark mode.

Minimum intensity:

| Use              | Light mode                                          | Dark mode                        |
| ---------------- | --------------------------------------------------- | -------------------------------- |
| Card / callout   | fill `/35`–`/55`, full-colour border, `-ink` title  | fill `/12`–`/20`, border `/40`   |
| Chip / tag       | fill `/55` (butter `/70`), full border, `-ink` text | fill `/15`, border `/40`, `-ink` |
| Offset shadow    | `6px 6px 0` in the full token colour                | token mixed to ~40%              |
| Highlight marker | full token                                          | `/45`                            |

Text stays `foreground`, `muted-foreground` or a pastel `-ink`. Never set body text in a raw pastel.

## Surfaces

| Utility        | Use                                                                   |
| -------------- | --------------------------------------------------------------------- |
| `glass`        | Home page cards (ID card, timeline, projects, running, contact panel) |
| `glass-strong` | Dense glass content on the home page                                  |
| `surface`      | Default card everywhere else: solid `--card`, border, soft shadow     |
| `ring-pastel`  | Gradient ring for the one highlighted element of a view (CV button)   |
| pastel tint    | Blog cards, MDX components: see [Pastels](#pastels)                   |

Radius: `rounded-3xl` for cards, `rounded-2xl` for small tiles, `rounded-full` for every button, chip and pill.

## Buttons

All sizes are pills. Variants:

- `default`: the **radiant** primary (`btn-radiant`). A subtle orange gradient in light mode, purple in dark, with one soft top shine, a glow underneath and a semibold white label. Use it for the main action of a view.
- `pastel`: white/card fill with the orange→rose→purple gradient ring. Use it for the secondary CTA next to a radiant one.
- `glass`: home page only.
- `outline`, `secondary`, `ghost`, `link`, `destructive`: standard.

Radiant rules, learned from review:

- The glow lives in layers, not borders: the outer halo is a coloured `box-shadow`. The top shine and a warm "sun core" rising from the bottom are a `::before` layer that sits above the fill and below the label (`isolation: isolate`). Removing them makes the button look flat, and that was rejected.
- Hover spreads the halo, brightens the fill and sweeps a soft light band across it (`::after`). The sweep is off under reduced motion and on disabled buttons.
- No `backdrop-filter` on buttons. Chrome leaves a fringe along rounded edges.
- No inner 1px ring, no halo ring (`0 0 0 4px`), no tight dark outer shadow. Each one reads as an extra border.
- `background-origin: border-box` with `no-repeat`. Otherwise the gradient tiles under the transparent border and leaves a dark hairline on top and a light one at the bottom.
- The element needs a positioning context for the layers: `Button` has `relative` in its base class, and fixed elements like back-to-top already have one. Don't put `position` in the utility, because it would override `fixed`.
- White on orange is about 3:1. Keep the label semibold, and don't use radiant for small body-size text links.

Every variant has a visible hover cue, without moving: radiant gets a stronger glow and the light sweep, pastel a stronger glow, outline and secondary a border or fill change plus a shadow, ghost a fill, glass a stronger fill and shadow, and link an underline. Buttons don't lift on hover.

The radiant glow is always on at full strength. Hover only intensifies it; it must never appear only on hover.

The same style applies to back-to-top, the active language in `LanguageSwitcher`, and the "Live" button on project cards.

## Hand-drawn marks

From `src/components/shared/HandDrawn.tsx`:

- `MarkedText`: italic Fraunces word with the marker underline that draws in on load.
- `Doodle name="underline|squiggle|sparkle|arrow|loop|circle"`: inherits `currentColor`; `draw` animates the reveal.
- `.hand-underline` (global CSS) and prose links: hand-drawn SVG stroke as a background that repeats on every wrapped line. It thickens and turns primary on hover.

One flourish per section at most. Don't sprinkle doodles.

## Hero

- Day/night valley photo, serif headline with `MarkedText` on the name, and sparkles.
- Primary CTA is radiant; the CV CTA is `pastel`.
- Floating hashtag stickers (desktop): translucent 3D glass pills.
  - No borders and no zero-blur offset lip: both show up as hard lines. But shading alone is too faint, and the 3D disappears (rejected too). The balance:
    - a stacked lip of four slightly blurred offset shadows (`0 1px 1px` … `0 4px 3px`) in a deep tone, which gives visible thickness without a crisp edge;
    - blurred inset highlight and shade (`inset 0 2px 3px -1px`, `inset 0 -3px 5px -2px`), which round the top and bottom;
    - a light-to-dark fill gradient plus a `::after` layer with a bright top shine and a deep underside glow.
  - Translucent fill with `backdrop-filter: blur(10px)` so the photo shows through.
  - Pointer parallax with a per-sticker depth; off for touch and reduced motion.
- On mobile the tags become a row of the same pills, without parallax.
- The scroll hint is white with a dark text shadow so it reads over both photos.

## Mobile

- **Tab bar**: bottom glass pill, five tabs (home, projects, blog, slides, contact), icon above label, current page raised with a primary-coloured icon. It sits above `env(safe-area-inset-bottom)`, and `body` gets `max-md:pb-28` so the footer isn't covered. Back-to-top sits above the bar.
- **Top bar**: logo, language switcher, theme toggle.
- **No horizontal overflow.** `html, body { overflow-x: clip }` is a safety net, not a fix. The real rules:
  - Grid and flex children that hold text get `min-w-0`.
  - Text that must not wrap (the hero name) scales with the viewport (`clamp(…, 11.5vw, …)`).
  - Header rows with a button wrap (`flex-wrap`).
- Check that nothing overflows at 320, 360, 375, 390, 412 and 430px, in FR and EN.

## Motion

- Allowed: entrance reveals, hover/focus feedback, the title marker draw-in, sticker float and parallax, the scroll hint, the timeline line drawing on scroll.
- Everything decorative stops under `prefers-reduced-motion`.
- Scroll-driven animations must leave content fully visible when unsupported (Firefox) or before JS loads. A section must never render as a blank gap.

## Edge artifacts

Check new visual components at 4× zoom, in light and dark. Common causes:

- A gradient painted from the padding box under a transparent border (fix with `background-origin: border-box`).
- `backdrop-filter` on small rounded elements.
- Stacked inset and outer shadows that each draw a line.
- Two highlight layers that overlap and show hard ends.

## Accessibility

- Body text meets WCAG AA. Radiant buttons are the documented exception (large semibold label).
- Touch targets are at least 44px.
- Logos in dark mode use `logoInverted` when needed, never a white backing box.
