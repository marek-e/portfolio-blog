# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal developer portfolio + blog at https://melmayan.fr. Built with Astro (static-first SSG), React 19 islands for interactivity, Tailwind CSS v4 + shadcn/ui. Deployed to Cloudflare Pages. Has to be responsive and accessible.

## Commands

```bash
pnpm dev             # Start dev server (localhost:4321)
pnpm build           # Production build to dist/
pnpm preview         # Preview production build
pnpm lint            # Run ESLint
pnpm lint:fix        # Run ESLint with auto-fix
pnpm format          # Format all files with Prettier
pnpm format:check    # Check formatting without writing

# Slash commands (Claude Code)
/validate            # Run format + lint + build checks
/learn               # Analyze session mistakes, update docs
/update-docs         # Refresh docs from codebase
```

## Adding shadcn Components

```bash
pnpm dlx shadcn@latest add <component-name>
```

## Architecture

```
src/
├── components/
│   ├── astro/       # Static Astro components (zero JS)
│   ├── react/       # React island wrappers (interactive)
│   └── ui/          # shadcn/ui primitives (don't edit manually)
├── content/         # Astro Content Collections (MD/MDX)
│   ├── projects/    # Project markdown files
│   └── blog/        # Blog post markdown files
├── layouts/         # Base layouts with SEO
├── pages/           # File-based routing
└── styles/global.css # Tailwind + theme variables
```

## Critical Conventions

### React Context in Astro (IMPORTANT)

shadcn components using React Context (Dialog, DropdownMenu, Accordion, Select) **must be wrapped** in a single `.tsx` file. Astro creates separate islands that can't share context.

```tsx
// CORRECT: Single wrapper in src/components/react/
export function ProjectModal() {
  return (
    <Dialog>
      <DialogTrigger>...</DialogTrigger>
      <DialogContent>...</DialogContent>
    </Dialog>
  );
}
```

### Component Placement

- **Static content** → `.astro` in `components/astro/`
- **Interactive features** → `.tsx` in `components/react/`
- **shadcn primitives** → `components/ui/` (use CLI to add)

### Client Directives

```astro
<Component client:load />
<!-- Critical, load immediately -->
<Component client:visible />
<!-- Below fold, lazy load -->
```

### Imports

Always use `@/` alias:

```typescript
import { Button } from '@/components/ui/button';
```

### Styling

Use semantic theme colors, not raw values:

```tsx
// ✓ bg-background text-foreground bg-primary
// ✗ bg-white text-black bg-blue-500
```

## Forbidden Patterns

- Skill percentages or charts
- Full-page constant motion / heavy parallax
- Overconfident claims ("expert", "10x dev")
- Generic template language

## Responsive Design

- Mobile-first approach
- Two primary breakpoints:
  - Default: < 768px
  - `md:`: ≥ 768px
  - `lg:`: ≥ 1024px

## Accessibility

- Respect `prefers-reduced-motion`
- Keyboard navigable everywhere
- ARIA labels on icon-only buttons

## Extended Documentation

- `docs/ARCHITECTURE.md` - System design, data flow, rendering modes
- `docs/CONVENTIONS.md` - Detailed code patterns, file naming, content schemas
- `docs/COMPONENTS.md` - UI component guide
- `docs/LESSONS.md` - Learned lessons (updated by `/learn`)
