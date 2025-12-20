# Architecture

## Overview

This is a static-first developer portfolio built with Astro. The architecture prioritizes:

1. **Performance** - Static HTML, minimal JS
2. **SEO** - Server-rendered content, proper meta tags
3. **Accessibility** - Keyboard navigation, reduced motion support
4. **Developer Experience** - Type-safe content, hot reload

## Technology Decisions

### Why Astro?

- Static-first with optional hydration
- Built-in content collections with type safety
- Excellent performance (zero JS by default)
- MDX support for rich blog content
- File-based routing

### Why React Islands?

React is used only for interactive features that require:
- Client-side state management
- Complex user interactions
- Third-party React libraries

Examples: Theme toggle, mobile navigation, contact form, modals.

### Why shadcn/ui?

- Copy/paste components (full ownership)
- Radix primitives (accessible by default)
- Tailwind-based (consistent with project styling)
- Customizable variants

## Directory Structure

```
astro-perso-website/
├── .claude/                    # Agent configuration
│   ├── CLAUDE.md              # Main context file
│   ├── commands/              # Slash commands
│   ├── hooks/                 # Error capture hooks
│   └── settings.local.json    # Permissions
│
├── docs/                       # Detailed documentation
│   ├── ARCHITECTURE.md        # This file
│   ├── CONVENTIONS.md         # Code patterns
│   ├── COMPONENTS.md          # UI component guide
│   └── LESSONS.md             # Learned lessons
│
├── public/                     # Static assets (copied as-is)
│   └── favicon.svg
│
├── src/
│   ├── assets/                # Processed assets (images, SVGs)
│   │
│   ├── components/
│   │   ├── astro/            # Pure Astro components (no JS)
│   │   ├── react/            # React island wrappers
│   │   └── ui/               # shadcn/ui primitives
│   │
│   ├── content/
│   │   ├── config.ts         # Collection schemas
│   │   ├── projects/         # Project .md/.mdx files
│   │   └── blog/             # Blog post .md/.mdx files
│   │
│   ├── layouts/
│   │   └── Layout.astro      # Base HTML layout
│   │
│   ├── lib/
│   │   └── utils.ts          # Utility functions (cn, etc.)
│   │
│   ├── pages/                 # File-based routing
│   │   ├── index.astro       # Homepage
│   │   ├── design-system.astro
│   │   ├── projects/
│   │   │   ├── index.astro   # Projects list
│   │   │   └── [slug].astro  # Project detail
│   │   └── blog/
│   │       ├── index.astro   # Blog list
│   │       └── [slug].astro  # Blog post
│   │
│   └── styles/
│       └── global.css        # Tailwind + CSS variables
│
├── astro.config.mjs           # Astro configuration
├── tailwind.config.mjs        # Tailwind configuration (if needed)
├── tsconfig.json              # TypeScript configuration
├── eslint.config.js           # ESLint flat config
├── .prettierrc                # Prettier configuration
└── package.json
```

## Data Flow

### Content Collections

```
src/content/projects/*.md
         ↓
   Zod schema validation (content.config.ts)
         ↓
   Type-safe getCollection('projects')
         ↓
   Rendered in Astro pages
```

### Build Process

```
pnpm build
    ↓
Astro compiles .astro → HTML
    ↓
React islands bundled separately
    ↓
Tailwind purges unused CSS
    ↓
Static files in dist/
```

## Rendering Modes

| Content Type | Rendering | JavaScript |
|--------------|-----------|------------|
| Pages | Static (SSG) | None |
| Blog posts | Static (SSG) | None |
| Project details | Static (SSG) | None |
| Theme toggle | React island | ~2KB |
| Mobile nav | React island | ~5KB |
| Contact form | React island | ~3KB |
| 2D exploration | React island | Lazy loaded |

## SEO Strategy

- Semantic HTML structure
- Meta tags via Layout.astro props
- Open Graph tags for social sharing
- Sitemap.xml auto-generated
- RSS feed for blog

## Performance Budget

- First Contentful Paint: < 1.5s
- Total JS (excluding 2D mode): < 50KB gzipped
- Lighthouse Performance: > 95
