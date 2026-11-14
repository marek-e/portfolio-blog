# Project liquid glass

Approved reference: B, Soft liquid lens.

The material is entirely CSS and inline SVG. There are no bitmap textures, data-image URLs, external image filters or generated image assets in the effect. Project artwork remains ordinary image content.

`LiquidGlassMaterial` draws one outer contour, a softly shaded bevel, localized pastel edge gradients and curved corner reflections. Dark mode uses subdued, softly masked curves instead of the light theme’s pointed glints. The thumbnail rim is quieter in dark mode, and continuous masked reflections avoid hard horizontal endpoints. CSS inset shadows add shallow volume. A masked 2px backdrop blur is confined to the perimeter, leaving central artwork and text sharp. Circular controls omit backdrop blur to avoid edge fringes.

The same renderer fits project cards, thumbnails, circular arrows and the pagination pill. A ResizeObserver updates SVG dimensions only when its parent changes size. Card and thumbnail radii stay at 36px and 24px; controls clamp the radius to half their shorter side. There are no per-frame rendering updates or entrance animations.

Project arrows opt into `Button3D material="liquid"`. Icon buttons select the circular material, which uses two short perimeter arcs and omits the rectangular corner glints and crossing reflection bands. Pagination capsules also omit pointed corner glints. Other 3D buttons keep their existing material. Reduced transparency and increased contrast hide the decorative lens and use a solid face.

The earlier WebP frame and its padding compensation have been removed.

Hover feedback uses interruptible 160ms CSS opacity transitions. Cards gain a visible pastel sheen, rim light and contact glow. Arrows reveal a luminous pastel fill instead of a foreground-gray wash, and action pills gain a glaze or tint. Pagination hover brightens only the dot, without a background fill. These hovers require a fine pointer. Keyboard focus is immediate; reduced motion keeps gentle fades and removes artwork zoom.
