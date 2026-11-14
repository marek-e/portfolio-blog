# Design System

Visual rules for melmayan.fr. The goal is a site that feels **premium** (people want to work with me) with an **artistic pastel touch**. Product goals and content rules live in [DESIGN-SPEC.md](DESIGN-SPEC.md); Tailwind usage lives in [STYLING.md](STYLING.md).

The live reference is `/design-system`. Update it when you add or change a token, utility or component variant.

The reference follows the home page's editorial layout, numbered `SectionHeading` titles and shared typography. Six linked sections cover foundations, materials, actions, forms, overlays and content. Desktop uses a sticky section index; mobile keeps the same links in the page flow. Examples are translated in French and English and follow the site theme. Colour swatches copy their CSS variable, so the reference stays valid across themes. Glass appears only in material and action specimens; the reference itself uses the plain page background.

## Directives

Decisions taken during the 2026 rebrand review. Treat them as constraints, not suggestions.

1. **Brand colours are orange (light) and purple (dark).** `--primary` carries them. Pastels decorate; they never replace the brand colour.
2. **The hero keeps the day/night valley photos** (`BackgroundImage.astro`). No full-page gradient or aurora backgrounds: the page background stays the plain `--background`.
3. **The desktop navbar keeps its original layout.** When the footer reaches the midpoint of the viewport, the bar fades over 180ms while the logo and matching Projects, Blog, Talks and Contact labels move together into their footer positions over 280ms with the strong ease-out curve. Scrolling back returns them to the navbar. Outbound copies move in page coordinates so the browser scrolls them with the footer; returning copies move in viewport coordinates toward the fixed navbar. Transfer keyframes stay unchanged during scrolling, avoiding a final-frame snap during fast flicks. A direction change starts from the current on-screen positions, and originals return after every moving copy finishes. Shared logo and labels have one visible owner: navbar before the handoff, temporary copies during it, and footer afterward. Keyboard focus in the footer reveals its originals immediately. The navbar stays visible while it contains keyboard focus. Keyboard scrolling switches immediately, reduced motion uses a 120ms bar fade without moving labels, and the mobile bottom tab bar hides while the footer is in view, unless it contains keyboard focus. Temporary moving links stay clickable and are hidden from assistive technology; the real links keep their accessible names. Resizing, focus changes and page navigation remove the temporary copies and restore the labels. The footer uses matching day and night alpine illustrations, with the identity block and three navigation groups above the landscape. It flows directly from the page without a top border or rounded corners. The artwork is decorative, switches with the site theme and keeps both companions visible on mobile. Names, descriptions and links stay live HTML. The illustrated scene fills at least the viewport height and grows on smaller screens when needed. Copyright, the centered theme switch and back-to-top sit over the bottom of the image, with a soft dark fade for contrast and no separate bottom strip. Footer navigation headings and links use Geist at 15px, with semibold sentence-case headings and regular-weight links. Footer navigation and back-to-top links use a rounded ghost hover with a 10% primary-coloured fill, orange in light mode and purple in dark. The fill fades over 150ms without an underline or movement. Keyboard focus gets the same fill and a visible outline. Reduced motion makes the change immediate. The name uses the display serif. Social icons stay plain with the wiggle on hover (`motion-safe:hover:animate-wiggle`), so they don't duplicate the round buttons in the contact panel just above. Don't restructure the navbar or footer as part of unrelated work.
4. **Mobile navigation is a bottom tab bar** (`MobileTabBar.astro`), never a hamburger sheet. Every destination is one tap away.
5. **Glass is for the home page and a few CTAs.** The shared contact panel uses `Card3D` on both the home and contact pages. Blog, projects, CV and other pages use solid `surface` cards or pastel-tinted fills. If glass shows up on a reading page, it's a mistake.
6. **Pastels must stay vivid.** Low-alpha pastel fills (`/12`) read as washed out and were rejected. See [Pastels](#pastels) for the minimums.
7. **Hand-drawn marks replace default decorations.** Section titles use the marker underline and editorial links use the hand-drawn stroke, never `decoration-wavy`. Inline biography links use foreground text and a permanent 1px native underline with a 4px offset and 40% foreground colour, changing to full primary on hover or keyboard focus. This keeps wrapped links quiet and identifiable without colour alone. Footer links use a primary-tinted ghost fill instead.
8. **Craft is checked at 4× zoom.** Edge hairlines, double rims and fringes are bugs, even if they're invisible at 1×. See [Edge artifacts](#edge-artifacts).
9. **Mobile is tested from 320px up to 430px**, in both languages and both themes, before anything ships.

The home page follows an exploration, so the footer can introduce a different environment from the hero. The upper sky in each image grades naturally toward its matching page background colour. A broad, eased alpha mask keeps the top edge seamless when responsive cropping changes the visible sky. Artwork blends continuously during theme previews, while navigation text and hover colours retain the active page theme until release. The companions remain visible below.

## Typography

| Role                                                              | Font                  | How                                                       |
| ----------------------------------------------------------------- | --------------------- | --------------------------------------------------------- |
| Page, section, editorial and portfolio card titles                | Fraunces              | automatic on `h1`/`h2`; `font-display-soft` elsewhere     |
| Artistic accent word                                              | Fraunces italic, WONK | `font-display-wonk`, or `MarkedText`                      |
| Body, navigation, controls, captions, dates and tags              | Geist                 | default `font-sans`; `eyebrow` for small uppercase labels |
| Code, technical diagrams, running metrics and identity signatures | MapleMono             | `font-mono`; use `tabular-nums` for changing metrics      |

- Fraunces carries the artistic character. Keep paragraphs and small UI text in Geist so the serif titles have room to stand out.
- Use Geist for supporting text, including badges, breadcrumbs, footer copy and CV metadata. UI headings such as footer navigation and dialog titles use `font-sans` explicitly instead of inheriting the display serif.
- MapleMono is a deliberate developer signature on code, technical diagrams, running numbers, the hero identity/music badge and the ID card's small header and reverse signature. It is not the default for every short string.
- Use shared font tokens instead of hard-coded family names, including print styles. Regular and bold Geist italics and medium MapleMono have matching font files; body and display fonts are preloaded.
- Body text uses regular weight, UI emphasis uses medium or semibold, and display titles use semibold. Prose bold uses the loaded 700 weight.
- Section titles always go through `SectionHeading.astro`. It italicises the last word and draws the marker under it.
- Home sections carry numbered eyebrows, translated in both languages.

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

The home page project carousel uses `Card3D` with `variant="glass"`, compact padding, concentric image corners and a tight shadow that fits the carousel gutters. Project cards follow the approved B soft liquid lens prototype: clear faces, rounded glass lips on the card and artwork, curved white corner reflections and faint pastel caustics below. `LiquidGlassMaterial` renders the lens entirely with inline SVG and CSS. A single contour, softly shaded bevel and localized pastel gradients keep the center clear. Light cards retain tapered corner reflections; dark cards use softer masked curves with subdued white and pastel light. Thumbnail reflections are quieter in dark mode to avoid doubled bright rims. Continuous masked perimeter strokes fade smoothly instead of ending in horizontal lines. A masked 2px backdrop blur affects only the perimeter. A ResizeObserver updates SVG geometry when the surface dimensions change, preserving the corner radius without stretching a texture. Cards, thumbnails, carousel arrows and pagination share this renderer. Circular icon buttons use restrained perimeter arcs instead of the rectangular corner reflections, keeping the icon area clear. Their lenses omit backdrop blur to avoid rounded-edge fringes. Pagination capsules also omit pointed corner reflections. No bitmap, encoded image or external image filter is used for the material. The inherited Card3D material, backdrop and border shadow remain hidden for projects. Text, artwork and controls remain live HTML. The face carries no opaque blue-grey or primary-colour fill. Cards use a 36px outer radius, 24px image corners and 12px padding. Reduced transparency and increased contrast replace the lens with a solid face and remove the caustics. Titles use a compact 22px size and natural height, descriptions use at most two lines on desktop, and neutral translucent technology chips take only the rows they need. Tighter content spacing keeps the cards compact while action buttons stay aligned at the bottom. Artwork uses a 3:2 crop on desktop. On mobile, it uses a shorter 16:9 crop, titles and descriptions wrap in full, and title and technology rows keep only the space they need. Cards stretch to the tallest slide at every screen size so swiping keeps the viewport and controls at a stable height. Contained artwork uses less vertical padding to keep logos legible in the shorter crop. Mobile previous/next controls have 44px targets and a translated position label. Keyboard navigation and reduced motion switch slides immediately. Projects advance only on input; the server-rendered carousel supports native horizontal scrolling before hydration. Extra technology counts stay beside the final visible chip. Logo padding balances the artwork's visual weight across projects. The current work entry uses the default `Card3D` in the timeline; past entries use `variant="glass"` for a clearer face and thinner reflections. The shared contact panel also uses the glass variant on both the home and contact pages, with the original glass ribbon artwork behind the panel so translucency is visible. The ribbons retain their soft colour blur, fade outside the card, and adapt to both themes, leaving the page background plain. They disappear under reduced transparency or increased contrast. Transparent storybook decorations overlap the upper edge: Melo and Orbi are 10% smaller, with their ledge aligned to the glass rim through a proportional vertical offset, and a paper plane trails two small butterflies. Extra space above the card keeps the companions clear of navigation at every breakpoint. The upper-right ribbon is 20% quieter than the lower ribbon. A small static butterfly and flight trail decorate the lower-left corner in the theme primary colour. The decorations stay outside the centered text and controls, scale down on mobile, and disappear under increased contrast. The card keeps its centered layout, email-copy pill, glass social buttons and theme colours, with tighter spacing, a smaller display heading and warm, direct French and English copy inviting visitors to discuss their project by email. On mobile, the paper plane moves to the upper left while the companions stay above the text on the right. Project and timeline cards retain semantic `article` elements through `Card3D`'s `as` prop.

The glass variant uses 6px backdrop blur and narrow edge highlights. Both variants share the same radius, exterior contour and opaque accessibility fallbacks.

Inside `CursorSpotlight`, glass cards respond to the same light source as the section backdrop. A soft reflection crosses the face and a concentrated glint follows the nearby rim, including when the pointer passes beside a card. A diagonal reflection moves in the opposite direction to suggest a glossy surface. Light mode uses warm primary-tinted reflections and a coloured rim glint for contrast against the pale background; dark mode keeps pale lavender highlights. A separate SVG displacement layer refracts the backdrop within a 22px bevel, leaving text and surface highlights sharp. Its rounded displacement map updates only when card dimensions change. Browsers without SVG backdrop filters keep the standard blurred glass. The ambient light sits behind the glass; text and cards stay still. Only the light layers' transforms and opacity update, once per pointer frame. Reflections pause during Sweep entrances and fade on leave. Reflections and refraction stop for touch, reduced motion, reduced transparency or increased contrast.

The timeline line follows the entry accents in order: peach, sky, mint, lilac and butter. Gradient stops and curve endpoints align with the centre of each year badge and update when the layout resizes. Broad alternating curves bow up to 36px on desktop and 18px on mobile, staying inside the spine gutter. The line keeps its scroll reveal and faint neutral dotted base, with a static pastel path before JavaScript runs.

Timeline cards use the selected Sweep entrance on desktop: a 700ms strong ease-out from the outer screen edge, with a 48px rise, a 5° tilt and scale from 0.94 to 1. Desktop entries alternate sides. Mobile entries use a 250ms strong ease-out with a 16px horizontal and vertical movement, without tilt or scale. Entries are ordered by start date, newest first. Each card plays once as its stationary row enters view. Wider cards and more vertical spacing give the reveal room. Keyboard focus and reduced motion reveal cards immediately. Completed animations release their transforms, and cards stay visible without JavaScript.

`Card3D` has a 2.75rem radius, a translucent primary-tinted face with 14px backdrop blur, and one thin exterior contour. The face, rim, icon tile and shadow use the same primary hue so warm and cool tints do not clash. One continuous rounded surface uses soft inset shading and asymmetric corner highlights; separate filled inner rectangles create visible seams and must not be added. The optional `.card-3d-icon` tile is 64px square and uses the same continuous shading. Reduced transparency, increased contrast and browsers without backdrop filtering use an opaque face.

`Button3D` is a pill with primary and secondary variants. Its translucent SVG lens has coloured edge refraction, curved reflections and a concentrated band of light along the bottom. The lens adapts to the button's dimensions to keep the ends rounded, including the icon size. Buttons use neither bitmap assets nor backdrop blur, and support focus, disabled states and reduced motion.

The home page developer ID card uses the approved type specimen layout: a large two-line serif name, three icon-led metadata rows, the softly rendered full-body avatar and a small Melo companion. Five unboxed technology logos and labels form the footer. A thin contour and curved glass-ribbon artwork frame the front. Both faces share the same soft pearlescent sheen, broad glare and physical tilt on hover, without the old rainbow wash. The layout uses container queries to preserve the content at narrow widths. Metadata and technology labels use at least 12px text; technology labels move to three columns below a 340px card width. A visible translated caption identifies the flip action. Names, labels and technology icons stay live HTML; the character and material artwork use optimised transparent WebP assets. Its reverse uses the approved iridescent-art design: an isolated sculptural glass ribbon, a quiet role label and a serif signature. Both themes use the same frame and ribbon image geometry. A static colour filter shifts the shared artwork from warm peach in light mode to an iridescent lavender finish in dark mode, preserving its alpha edges, crop, highlights and colour variation. The front uses a separate shallow lower rim below the technology labels, clipped by the card's own rounded contour. Labels stay live HTML. Fine grain and pointer-following pearlescent reflections sit above the artwork. The interaction is inspired by [Anish's Morfe card](https://lab.anishfn.ink/morfe-card). The React and CSS implementation keeps the content as HTML. A fine pointer tilts the card by up to 5° vertically and 6° horizontally, with a settling spring. The reflection layers on both faces move through transforms and opacity. Clicking the left half turns it by −180°, and the right half by +180°, from either face. Each turn lasts 500ms with the strong ease-in-out curve and can reverse mid-turn. Keyboard activation and reduced motion switch faces immediately. Touch keeps normal page scrolling and does not trigger tilt. The tilt loop stops when settled, offscreen or in a hidden tab.

## Buttons

Keyboard focus uses a solid 2px foreground outline with a 4px offset so it stays distinct in both themes and survives decorative box shadows. Project title links outline the whole card. The page reserves 7rem of scroll clearance at both edges so fixed navigation does not cover focused controls. Hidden back-to-top controls stay out of the tab order.

The `Button3D` secondary variant uses cool neutral glass, slate text and softer reflections. Its faint blue-grey edge and shadow distinguish it from the primary variant's brand-coloured lens.

The contact panel pairs primary and secondary `Button3D` email actions at 48px, using Geist. Copying keeps the address visible and swaps the copy icon for a checkmark, with a translated live status for screen readers. Both actions share one React island so their glass lenses fit their dimensions. The secondary copy action uses less horizontal padding, 13px text and a 14px icon to keep the primary email action prominent. A static hand-drawn loop sits beside the primary action on large screens and is hidden at narrower widths.

The contact panel's social links use the secondary `Button3D` in the 48px circular icon size. Only the social icon wiggles on hover, with motion disabled under reduced motion; the glass lens stays still. These render as links with translated accessible labels on both the home and contact pages.

Home page project cards keep the classic flat pills: radiant for "Live" and pastel for "Code", both with 44px targets. The title link covers the card, so there is no separate details arrow. On a fine pointer, hovering the card fades in a pastel sheen, a soft contact glow and a brighter glass rim over 160ms. The artwork retains its subtle 4% zoom over the same duration; the card, text and action buttons stay still. Hovering "Live" or "Code" uses the button's own feedback instead. Keyboard focus on the card link reveals the highlight immediately. Reduced motion keeps the highlight without the artwork zoom. Carousel navigation uses `Button3D material="liquid"` in a 44px circular target, with the same CSS/SVG lens as the project cards. The desktop pagination pill uses the shared lens with quieter reflections and five 44px dot targets. Arrow targets reveal a luminous cyan-to-lilac circular fill on hover, with a quieter translucent fill in dark mode. Pagination hover brightens only the dot, without a background fill; keyboard focus retains its visible fill and outline. Live and Code pills use a quick glaze or tint; their feedback uses 160ms CSS opacity transitions and the existing strong ease-out. Hover feedback is limited to fine pointers, keyboard focus changes immediately, and reduced motion omits the artwork zoom. Other Button3D uses retain their default material.

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

The footer centers `GlassThemeSwitch` below the characters, with copyright on the left and back-to-top on the right. The utility row has 20px bottom clearance, while mobile respects the safe-area inset. The back-to-top control uses a pointer cursor. Copyright is followed by the translated line "Always something to explore.", which moves to its own line on mobile. There is no footer language selector. Its recessed track, rounded-square glass knob and morphing pixel sun/moon icons follow [Zsolt Kacso's Glass Light Toggle](https://experiments.thisiswhitespace.com/glass-light-toggle), with amber day lighting and a cool blue night rim. Clicking or dragging changes the site theme, and keyboard input settles immediately. It shares theme state with the navbar and hydrates when visible. Velocity stretches the knob, end stops compress it, and the separate light spring completes a continuous orbit. Individual pixels stagger, curl, shrink and spring into the moon or sun; idle stars and rays vary subtly. Refraction includes RGB separation, frost, internal scattering and broad light spill. Dragging continuously blends the footer artwork and sky. Navigation text stays aligned with the current page background throughout the drag, and the global theme commits on release. Rendering pauses offscreen or in hidden tabs. Reduced motion removes the spring and pixel swirl; missing WebGL, context loss and increased contrast use the native icon fallback. On mobile, the theme switch stays centered, with back-to-top and copyright stacked below.

The same radiant style applies to back-to-top. In the mobile header, `LanguageSwitcher` uses plain text buttons with 44px targets, semibold for the current language and regular muted text for the other language. The controls have no glass track or lens. The desktop language tab uses the same clear glass with a brighter rounded lower edge; its flag appears on hover or keyboard focus.

## Hand-drawn marks

From `src/components/shared/HandDrawn.tsx`:

- `MarkedText`: italic Fraunces word with a marker underline that draws in on load. Desktop keeps the original two 4px strokes. Mobile uses only the first stroke at 2.5px, with a shallower shape so it stays distinct from the letters.
- `Doodle name="underline|squiggle|sparkle|arrow|loop|circle"`: inherits `currentColor`; `draw` animates the reveal.
- `.hand-underline` (global CSS) and prose links: hand-drawn SVG stroke as a background that repeats on every wrapped line. It thickens and turns primary on hover.

One flourish per section at most. Don't sprinkle doodles.

## Hero

- Day/night valley photo, serif headline with `MarkedText` on the name, and sparkles.
- The project CTA uses the classic radiant button; the CV CTA uses the classic `pastel` variant. Their flatter treatment distinguishes actions from the sculpted floating pills.
- The desktop navbar and portrait identity bar use thin `liquid-glass` containers, with a clear centre, soft perimeter reflections and restrained backdrop blur. The identity bar gets a darker transparent fill over the moon in dark mode for text contrast.
- The identity pill morphs over 400ms into a 280×88px background music panel with 24px corners. A clear centre, 10px backdrop blur, narrow rim and soft reflections replace the heavy capsule bevel. The portrait appears only in the closed badge; the expanded panel uses a small music note, a 36px brand-coloured play button inside a 44px target, and a thin volume track. Maple Mono is shared across both states. Playback status stays available to screen readers, and errors replace the title visibly. Music starts only from the play button, defaults to 35% volume, loops and persists across client navigation. A single 44px floating Button3D with a filled stop icon and a translated hover/focus tooltip is visible only during playback, hides while the footer is in view, and stops and resets the track when activated. The heading stays still during the morph. Keyboard activation and reduced motion switch immediately; reduced transparency and increased contrast use an opaque face.
- In light mode, the navbar adds a faint foreground contour and a soft contact shadow so it remains distinct against pale page backgrounds.
- The desktop navbar hover pill uses the shared `GlassMaterial` lens with a stronger primary-coloured face and rim, tinted highlights and subdued white reflections. It moves between links over 200ms using transforms; reduced motion places it immediately.
- The theme switch highlights the navbar's rounded right end on hover or keyboard focus. A neutral fill and a soft vertical divider fade in over 180ms while the icon stays still. The endcap is part of the clickable control; mobile keeps a 44px target. Reduced motion removes the fade, and increased contrast uses a solid fill. Outside the navbar, the switch stays unboxed.
- Floating hashtag stickers (desktop): translucent 3D glass pills.
  - Use the same `GlassMaterial` SVG lens as `Button3D`, with curved reflections, a thin coloured contour and a bright lower edge. Its geometry measures the untransformed pill so parallax cannot distort the rounded ends.
  - Pastel material tokens preserve each tag's colour. A translucent face and soft shadow give the pills depth over the photo without backdrop blur or a stacked lip.
  - Pointer parallax with a per-sticker depth; off for touch and reduced motion.
- On mobile the tags form two balanced rows of the same pills, without parallax. A restrained dark overlay keeps the white hero text legible over the moon. Mobile uses the first sentence of the supporting copy; shorter viewports tighten spacing so both main actions clear the tab bar.
- The scroll hint is white with a dark text shadow so it reads over both photos. It is visible only at scroll position zero, and returns when the user scrolls back to the top.

## Mobile

- **Tab bar**: bottom glass pill, five tabs (home, projects, blog, slides, contact), icon above label, current page raised with a primary-coloured icon. It sits above `env(safe-area-inset-bottom)` and hides while any part of the footer is in view, returning when the footer leaves. Keyboard focus keeps it visible until focus moves away. Pages with a footer have no extra bottom strip; other pages retain `max-md:pb-28` for navigation clearance. The home page floating back-to-top appears after 300px of scrolling on desktop and mobile. On mobile, its 44px target sits above the tab bar and safe-area inset. It hides while the footer is visible, where the footer back-to-top action takes over.
- **Mobile header**: an unboxed row with the logo on the left and plain language and theme controls on the right, all with 44px targets. No enclosing capsule, glass, shadows or theme endcap. It scrolls away with the hero; desktop keeps its fixed glass navbar.
- **Home page**: mobile order is hero, projects, about, timeline, running and contact, with matching numbered eyebrows and DOM/focus order. Desktop keeps the original section order. Mobile biography starts with a short introduction and offers the full story in a native disclosure. The running section shows three recent activities and links to the complete Strava profile. Mobile race cards omit decorative confetti.
- **Footer**: mobile keeps the identity in one compact row and omits the repeated tagline and social block. Resources spans the navigation grid, with its links in two columns. Both illustrated companions, theme switch, back-to-top and copyright remain visible.
- **No horizontal overflow.** `html, body { overflow-x: clip }` is a safety net, not a fix. The real rules:
  - Grid and flex children that hold text get `min-w-0`.
  - Text that must not wrap (the hero name) scales with the viewport (`clamp(…, 11.5vw, …)`).
  - Header rows with a button wrap (`flex-wrap`).
- Check that nothing overflows at 320, 360, 375, 390, 412 and 430px, in FR and EN.

## Motion

- Allowed: entrance reveals, hover/focus feedback, the title marker draw-in, sticker float and parallax, the scroll hint, the timeline line drawing on scroll.
- Everything decorative stops under `prefers-reduced-motion`.
- Scroll-driven animations must leave content fully visible when unsupported (Firefox) or before JS loads. A section must never render as a blank gap.

Code-copy feedback updates immediately and crossfades over 160ms, without shrinking icons to zero. File-tree folders reverse from their current height over 150ms; blog disclosures use a reversible 250ms expansion. Keyboard activation and reduced motion switch these states immediately. Menus and tooltips keep opacity feedback under reduced motion and skip animation for Base UI's instant states. Running totals update immediately when the time range changes. The desktop language tab reveals through translation over 200ms, with immediate keyboard focus and a fully visible reduced-motion state. Shared classic buttons transition only colour, opacity and press transforms over 160ms; hover filters and shadows change without interpolation. These controls use the strong ease-out curve `cubic-bezier(0.23, 1, 0.32, 1)`.

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
