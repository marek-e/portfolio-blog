# Design System

Visual rules for melmayan.fr. The goal is a site that feels **premium** (people want to work with me) with an **artistic pastel touch**. Product goals and content rules live in [DESIGN-SPEC.md](DESIGN-SPEC.md); Tailwind usage lives in [STYLING.md](STYLING.md).

The live reference is `/design-system`. Update it when you add or change a token, utility or component variant.

## Directives

Decisions taken during the 2026 rebrand review. Treat them as constraints, not suggestions.

1. **Brand colours are orange (light) and purple (dark).** `--primary` carries them. Pastels decorate; they never replace the brand colour.
2. **The hero keeps the day/night valley photos** (`BackgroundImage.astro`). No full-page gradient or aurora backgrounds: the page background stays the plain `--background`.
3. **The desktop navbar and the footer keep their original layout.** The footer's details follow the design language: an eyebrow label, a hand-drawn underline on link hover (`.hand-underline-hover`, which draws in), a single-stroke hand-drawn divider (`Doodle name="line"`; the two-stroke `underline` looks glitchy when stretched wide), and the name in the display serif. Footer social icons stay plain with the wiggle on hover (`motion-safe:hover:animate-wiggle`), so they don't duplicate the round buttons in the contact panel just above. Don't restructure either of them as part of other work.
4. **Mobile navigation is a bottom tab bar** (`MobileTabBar.astro`), never a hamburger sheet. Every destination is one tap away.
5. **Glass is for the home page and a few CTAs.** The shared contact panel uses `Card3D` on both the home and contact pages. Blog, projects, CV and other pages use solid `surface` cards or pastel-tinted fills. If glass shows up on a reading page, it's a mistake.
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

`Card3D` and `Button3D` add the clear glass treatment shown on `/design-system`: rounded bevels, curved reflections and diffused shadows. Brand accents follow `primary`, orange in light mode and purple in dark. Keep these components to home page highlights and occasional CTAs, following the same placement rules as glass surfaces.

The home page project carousel uses `Card3D` with compact padding and concentric image corners. The current work entry uses the default `Card3D` in the timeline; past entries use `variant="glass"` for a clearer face and thinner reflections. The shared contact panel also uses the glass variant on both the home and contact pages, with the existing glass ribbon artwork behind the panel so translucency is visible. The ribbons fade outside the card, leaving the page background plain, and disappear under reduced transparency or increased contrast. Project and timeline cards retain semantic `article` elements through `Card3D`'s `as` prop.

The glass variant uses 6px backdrop blur and narrow edge highlights. Both variants share the same radius, exterior contour and opaque accessibility fallbacks.

The timeline line follows the entry accents in order: peach, sky, mint, lilac and butter. Gradient stops align with the centre of each year badge and update when the layout resizes. The existing scroll reveal stays in place, with a faint neutral dotted line underneath and a static pastel gradient before JavaScript runs.

`Card3D` has a 2.75rem radius, a translucent primary-tinted face with 14px backdrop blur, and one thin exterior contour. The face, rim, icon tile and shadow use the same primary hue so warm and cool tints do not clash. One continuous rounded surface uses soft inset shading and asymmetric corner highlights; separate filled inner rectangles create visible seams and must not be added. The optional `.card-3d-icon` tile is 64px square and uses the same continuous shading. Reduced transparency, increased contrast and browsers without backdrop filtering use an opaque face.

`Button3D` is a pill with primary and secondary variants. Its translucent SVG lens has coloured edge refraction, curved reflections and a concentrated band of light along the bottom. The lens adapts to the button's dimensions to keep the ends rounded, including the icon size. Buttons use neither bitmap assets nor backdrop blur, and support focus, disabled states and reduced motion.

The home page developer ID card uses the approved type specimen layout: a large two-line serif name, three icon-led metadata rows, the softly rendered full-body avatar and a small Melo companion. Five unboxed technology logos and labels form the footer. A thin contour and curved glass-ribbon artwork frame the front. Both faces share the same soft pearlescent sheen, broad glare and physical tilt on hover, without the old rainbow wash. The layout uses container queries to preserve the content at narrow widths. Names, labels and technology icons stay live HTML; the character and material artwork use optimised transparent WebP assets. Its reverse uses the approved iridescent-art design: an isolated sculptural glass ribbon, a quiet role label and a serif signature. Both themes use the same frame and ribbon image geometry. A static colour filter shifts the shared artwork from warm peach in light mode to an iridescent lavender finish in dark mode, preserving its alpha edges, crop, highlights and colour variation. The front uses a separate shallow lower rim below the technology labels, clipped by the card's own rounded contour. Labels stay live HTML. Fine grain and pointer-following pearlescent reflections sit above the artwork. The interaction is inspired by [Anish's Morfe card](https://lab.anishfn.ink/morfe-card). The React and CSS implementation keeps the content as HTML. A fine pointer tilts the card by up to 5° vertically and 6° horizontally, with a settling spring. The reflection layers on both faces move through transforms and opacity. Clicking the left half turns it by −180°, and the right half by +180°, from either face. Each turn lasts 500ms with the strong ease-in-out curve and can reverse mid-turn. Keyboard activation and reduced motion switch faces immediately. Touch keeps normal page scrolling and does not trigger tilt. The tilt loop stops when settled, offscreen or in a hidden tab.

## Buttons

The `Button3D` secondary variant uses cool neutral glass, slate text and softer reflections. Its faint blue-grey edge and shadow distinguish it from the primary variant's brand-coloured lens.

The contact panel's social links use the secondary `Button3D` in the 48px circular icon size. Only the social icon wiggles on hover, with motion disabled under reduced motion; the glass lens stays still. These render as links with translated accessible labels on both the home and contact pages.

On a fine pointer, 3D buttons fade in a brighter copy of their glass lens over 200ms with the strong `--ease-out` curve. The glass brightens evenly, preserving its hue; the label, reflections and outer shape stay still. The brighter lens uses a static brightness and saturation filter, and only its opacity animates. Transitions reverse smoothly when interrupted. Disabled buttons and touch do not trigger hover; reduced motion uses a 160ms opacity fade. Press feedback lasts 160ms and does not animate keyboard presses.

All classic button sizes are pills. Variants:

- `default`: the **radiant** primary (`btn-radiant`). A subtle orange gradient in light mode, purple in dark, with one soft top shine, a glow underneath and a semibold white label. Use it for the main action of a view.
- `pastel`: white/card fill with the orange→rose→purple gradient ring. Use it for the secondary CTA next to a radiant one.
- `ghost`, `link`, `destructive`: standard.

Radiant rules, learned from review:

- The glow lives in layers, not borders: the outer halo is a coloured `box-shadow`. The top shine and a warm "sun core" rising from the bottom are a `::before` layer that sits above the fill and below the label (`isolation: isolate`). Removing them makes the button look flat, and that was rejected.
- Hover spreads the halo, brightens the fill and sweeps a soft light band across it (`::after`). The sweep is off under reduced motion and on disabled buttons.
- No `backdrop-filter` on buttons. Chrome leaves a fringe along rounded edges.
- No inner 1px ring, no halo ring (`0 0 0 4px`), no tight dark outer shadow. Each one reads as an extra border.
- `background-origin: border-box` with `no-repeat`. Otherwise the gradient tiles under the transparent border and leaves a dark hairline on top and a light one at the bottom.
- The element needs a positioning context for the layers: `Button` has `relative` in its base class, and fixed elements like back-to-top already have one. Don't put `position` in the utility, because it would override `fixed`.
- White on orange is about 3:1. Keep the label semibold, and don't use radiant for small body-size text links.

Every variant has a visible hover cue, without moving: radiant gets a stronger glow and the light sweep, pastel swaps the orange and purple ends of its gradient border with a subtle primary-tinted fill, ghost a fill, destructive a stronger fill and shadow, and link an underline. Buttons don't lift on hover.

The pastel button has one masked border layer, with a linear orange-to-rose-to-purple blend spread across the full width so long pills keep smooth colour transitions. The oversized gradient covers the border throughout its half-turn rotation over 500ms with the strong ease-in-out curve `cubic-bezier(0.77, 0, 0.175, 1)`, reversing smoothly on leave, while the pill and label stay still. There is no static gradient underneath the moving border. The fill tint fades over 250ms with the same easing as the border. Keyboard focus and reduced motion keep the border stationary. Disabled controls do not trigger either effect.

The radiant glow is always on at full strength. Hover only intensifies it; it must never appear only on hover.

The same radiant style applies to back-to-top and the "Live" button on project cards. In the mobile header, `LanguageSwitcher` uses a thin liquid-glass track and a softly bevelled brand-coloured lens for the current language, with 44px targets. The footer keeps its original compact frosted track and radiant active language through `variant="classic"`. Inactive options get a quiet primary tint on hover. The desktop language tab uses the same clear glass with a brighter rounded lower edge; its flag appears on hover or keyboard focus.

## Hand-drawn marks

From `src/components/shared/HandDrawn.tsx`:

- `MarkedText`: italic Fraunces word with the marker underline that draws in on load.
- `Doodle name="underline|squiggle|sparkle|arrow|loop|circle"`: inherits `currentColor`; `draw` animates the reveal.
- `.hand-underline` (global CSS) and prose links: hand-drawn SVG stroke as a background that repeats on every wrapped line. It thickens and turns primary on hover.

One flourish per section at most. Don't sprinkle doodles.

## Hero

- Day/night valley photo, serif headline with `MarkedText` on the name, and sparkles.
- The project CTA uses the classic radiant button; the CV CTA uses the classic `pastel` variant. Their flatter treatment distinguishes actions from the sculpted floating pills.
- The navbar and portrait identity bar use thin `liquid-glass` containers, with a clear centre, soft perimeter reflections and restrained backdrop blur. The identity bar gets a darker transparent fill over the moon in dark mode for text contrast.
- In light mode, the navbar adds a faint foreground contour and a soft contact shadow so it remains distinct against pale page backgrounds.
- The desktop navbar hover pill uses the shared `GlassMaterial` lens with a stronger primary-coloured face and rim, tinted highlights and subdued white reflections. It moves between links over 200ms using transforms; reduced motion places it immediately.
- Floating hashtag stickers (desktop): translucent 3D glass pills.
  - Use the same `GlassMaterial` SVG lens as `Button3D`, with curved reflections, a thin coloured contour and a bright lower edge. Its geometry measures the untransformed pill so parallax cannot distort the rounded ends.
  - Pastel material tokens preserve each tag's colour. A translucent face and soft shadow give the pills depth over the photo without backdrop blur or a stacked lip.
  - Pointer parallax with a per-sticker depth; off for touch and reduced motion.
- On mobile the tags become a row of the same pills, without parallax.
- The scroll hint is white with a dark text shadow so it reads over both photos. It is visible only at scroll position zero, and returns when the user scrolls back to the top.

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
