# Portfolio visual system

The artistic direction is [DESIGN.md](../DESIGN.md). The character identity reference is [MELO.md](../MELO.md) and `public/melo/melo.png`.

## Type and color

Geist is the reading and interface font. Georgia supplies the editorial headlines, with italic violet phrases. Maple Mono is reserved for code and small metadata. The locally served Caveat face supplies handwritten annotations. Fonts are served locally, including those used by the social card renderer.

| Role       | Day       | Night     |
| ---------- | --------- | --------- |
| Page       | `#fbf6ee` | `#1b1a2c` |
| Ink        | `#25243e` | `#f4edf5` |
| Primary    | `#70538e` | `#c6a7e1` |
| Paper      | `#fffaf4` | `#262339` |
| Secondary  | `#eee6f2` | `#332c46` |
| Quiet text | `#696273` | `#b7aec5` |

Semantic tokens live in `src/styles/global.css`. Compositions live in `src/styles/rebrand.css`. The glass, sculpted objects, pastel surfaces, botanical artwork and journal layouts live in `src/styles/materials.css`. UI components continue to use semantic Tailwind colors.

## Composition and materials

The homepage introduces Marek beside Melo and Orbi in an illustrated studio, then moves to the projects, personal story, experience, journal, running, and contact. Both locales share this structure. Projects and posts retain their existing routes and content.

Use glass for the floating navigation and small scene captions. Project cards have solid paper surfaces, raised edges, and softly lit pastel stages. Screenshots sit in frosted frames; selected app icons sit above sculpted plinths. Buttons have a molded top, a visible lower edge and press feedback. Reading pages have opaque backgrounds and no scenic artwork behind their content. Contact closes the journey with an illustrated postcard.

The star and `marek.` wordmark connect the website, browser icon and social cards. App icons derive from `public/favicon-rebrand.svg`.

## Characters and assets

Melo appears in the welcome scene and the contact postcard. The developer, real products, and article titles lead the other sections. Preserve Melo's cream face, feathered purple ear frills, navy hoodie, gold guardian mark and explorer backpack. Orbi keeps its pale shell, black face and gold light.

The original two generated poses and their exact prompts are recorded in [artifacts/rebrand/PROMPTS.md](../artifacts/rebrand/PROMPTS.md). PNG originals retain their alpha channels. WebP versions in `public/melo/` are the production assets. The new day and night studio scenes and their exact generation prompts are recorded in [artifacts/rebrand/PROMPTS-MATERIALS.md](../artifacts/rebrand/PROMPTS-MATERIALS.md). Responsive WebP assets keep the large illustrations under 220 KB each. The existing valley images remain in the contact postcard at responsive sizes.

## Interaction

Press feedback lasts 150 ms. Hover movement is limited to project cards on devices with a fine pointer. The experience timeline renders as a static ordered list, with no JavaScript or scroll dependency. The hero enters once. A restrained liquid-hover effect responds to the pointer over the studio artwork. Its shader is supplied unchanged by the invoked design skill and releases its context offscreen. Touch, reduced motion and unavailable WebGL all show the original artwork. Theme changes initiated with the keyboard apply immediately. Reduced motion removes movement, smooth scrolling and view transition animations. Focus outlines and the skip link remain visible when used. Blog contents come from the rendered article headings, with a native collapsible contents control on mobile.
