# melmayan.fr - Developer Portfolio

## Project Overview

Personal developer portfolio + blog built with Astro and React. Static-first architecture with interactive islands for specific features.

**Domain:** https://melmayan.fr

## Tech Stack

- **Framework:** Astro 5.x (static-first SSG)
- **UI Islands:** React 19 (only for interactive components)
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Content:** Astro Content Collections (MD/MDX)
- **Linting:** ESLint + Prettier
- **Build:** Static output for Cloudflare Pages

## Project Structure

```
src/
├── components/
│   ├── astro/       # Static Astro components (zero JS)
│   ├── react/       # React island wrappers (interactive)
│   └── ui/          # shadcn/ui primitives
├── content/
│   ├── projects/    # Project markdown files
│   └── blog/        # Blog post markdown files
├── layouts/
│   └── Layout.astro # Base layout with SEO
├── pages/           # File-based routing
└── styles/
    └── global.css   # Tailwind + theme variables
```

## Key Commands

```bash
pnpm dev           # Start dev server
pnpm build         # Production build
pnpm lint          # Run ESLint
pnpm format        # Run Prettier
/validate          # Run all checks (format + lint + build)
/learn             # Capture mistakes, update docs
/update-docs       # Refresh docs from codebase
```

## Critical Conventions

### Component Patterns

1. **Static components** → `.astro` files in `components/astro/`
2. **Interactive features** → `.tsx` wrappers in `components/react/`
3. **shadcn primitives** → Auto-generated in `components/ui/`

### React Context in Astro (IMPORTANT)

shadcn components using React Context (Dialog, DropdownMenu, Accordion, Select) **must be wrapped** in a single `.tsx` file. Astro creates separate islands that can't share context.

```tsx
// CORRECT: Single wrapper component
// src/components/react/ProjectModal.tsx
export function ProjectModal() {
  return (
    <Dialog>
      <DialogTrigger>...</DialogTrigger>
      <DialogContent>...</DialogContent>
    </Dialog>
  );
}
```

### Client Directives

```astro
<Component client:load />     <!-- Critical, load immediately -->
<Component client:visible />  <!-- Below fold, lazy load -->
<Component client:media="(max-width: 768px)" />  <!-- Conditional -->
```

### Import Aliases

Always use `@/` prefix for imports:
```typescript
import { Button } from '@/components/ui/button';
import Layout from '@/layouts/Layout.astro';
```

## Forbidden Patterns

- ❌ Skill percentages or charts
- ❌ Full-page constant motion
- ❌ Heavy parallax effects
- ❌ Motion that blocks reading
- ❌ Overconfident claims ("expert", "10x dev")
- ❌ Generic template language

## Accessibility Requirements

- Respect `prefers-reduced-motion`
- Keyboard navigable everywhere
- Clear focus states
- ARIA labels where needed

## Documentation

- `docs/ARCHITECTURE.md` - System design details
- `docs/CONVENTIONS.md` - Code patterns and rules
- `docs/COMPONENTS.md` - UI component guide
- `docs/LESSONS.md` - Learned lessons from mistakes

## Current Lessons

<!-- Updated by /learn command -->

_No lessons recorded yet. Run `/learn` after encountering issues._
