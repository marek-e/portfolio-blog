# CLAUDE.md

Personal portfolio + blog at melmayan.fr. Astro SSG + React 19 islands + Tailwind v4 + shadcn/ui. Deployed to Cloudflare Pages.

## Package Manager

pnpm (not npm)

## Commands

```bash
pnpm dev          # Dev server (localhost:4321)
pnpm build        # Production build
pnpm lint         # ESLint
pnpm format       # Prettier
/validate         # Run format + lint + build checks
```

## Critical Gotcha

shadcn components using React Context (Dialog, Sheet, Select, DropdownMenu) **must be wrapped** in a single `.tsx` file. Astro creates separate islands that can't share context.

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

## Documentation

- [docs/ASTRO-REACT.md](../docs/ASTRO-REACT.md) - Island architecture, hydration, MDX patterns
- [docs/STYLING.md](../docs/STYLING.md) - Tailwind, theme colors, responsive design
- [docs/COMPONENTS.md](../docs/COMPONENTS.md) - shadcn/ui usage, custom components
- [docs/CONTENT.md](../docs/CONTENT.md) - Content collections, frontmatter schemas
- [docs/LESSONS.md](../docs/LESSONS.md) - Learned mistakes (updated by `/learn`)
