# Code Conventions

## File Naming

| Type | Convention | Example |
|------|------------|---------|
| Astro components | PascalCase.astro | `Header.astro` |
| React components | PascalCase.tsx | `ThemeToggle.tsx` |
| Pages | kebab-case.astro | `design-system.astro` |
| Content files | kebab-case.md | `my-project.md` |
| Utilities | camelCase.ts | `utils.ts` |

## Component Organization

### Static Components (Zero JS)

Location: `src/components/astro/`

Use for:
- Headers, footers, navigation links
- Cards, badges, static content
- Layout sections

```astro
---
// src/components/astro/ProjectCard.astro
interface Props {
  title: string;
  description: string;
  href: string;
}

const { title, description, href } = Astro.props;
---

<a href={href} class="block rounded-lg border p-4 hover:bg-muted">
  <h3 class="font-semibold">{title}</h3>
  <p class="text-muted-foreground">{description}</p>
</a>
```

### Interactive Components (React Islands)

Location: `src/components/react/`

Use for:
- State management (forms, toggles)
- Event handlers beyond hover/focus
- Context-dependent shadcn components

```tsx
// src/components/react/ThemeToggle.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </Button>
  );
}
```

### shadcn/ui Primitives

Location: `src/components/ui/`

**Do not edit manually** - use shadcn CLI to add/update:

```bash
pnpm dlx shadcn@latest add button
```

## Import Patterns

Always use the `@/` alias:

```typescript
// ✅ Correct
import { Button } from '@/components/ui/button';
import Layout from '@/layouts/Layout.astro';

// ❌ Wrong
import { Button } from '../../../components/ui/button';
```

## Tailwind Usage

### Class Order

Use Prettier plugin to auto-sort (already configured).

### Semantic Colors

Use theme variables, not raw colors:

```tsx
// ✅ Correct
<div className="bg-background text-foreground">
<button className="bg-primary text-primary-foreground">

// ❌ Wrong
<div className="bg-white text-black dark:bg-gray-900">
```

### Responsive Design

Mobile-first approach with two primary breakpoints:

| Breakpoint | Width | Use Case |
|------------|-------|----------|
| Default | < 768px | Mobile phones |
| `md:` | ≥ 768px | Tablets and desktop |
| `lg:` | ≥ 1024px | Large desktop (optional refinement) |

#### Common Patterns

**Grid layouts:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

**Typography scaling:**
```tsx
<h1 className="text-3xl md:text-5xl lg:text-6xl">
```

**Spacing:**
```tsx
<div className="px-4 md:px-6 lg:px-8">
```

**Show/hide elements:**
```tsx
// Hide on mobile, show on desktop
<nav className="hidden md:flex">

// Show on mobile, hide on desktop
<button className="md:hidden">
```

**Flex direction:**
```tsx
<div className="flex flex-col md:flex-row">
```

#### Mobile Navigation

Use the `MobileMenu` component for navigation on mobile:
- Renders a hamburger icon that opens a Sheet (slide-out drawer)
- Automatically hidden on `md:` and above via `md:hidden`
- Desktop nav links use `hidden md:flex`

```astro
<!-- In Navbar.astro -->
<div class="hidden md:flex"><!-- Desktop links --></div>
<MobileMenu client:load />
```

#### Touch Targets

Ensure touch targets are at least 44x44px on mobile:
```tsx
<Button size="icon" className="size-11">
```

## Content Collections

### Project Frontmatter

```yaml
---
title: "Project Name"
description: "One-line description"
featured: true
techStack: ["Astro", "React", "TypeScript"]
role: "Full-stack Developer"
links:
  demo: "https://example.com"
  repo: "https://github.com/user/repo"
image: "./project-screenshot.png"
publishDate: 2024-01-15
---
```

### Blog Frontmatter

```yaml
---
title: "Blog Post Title"
description: "Meta description for SEO"
publishDate: 2024-01-15
updatedDate: 2024-01-20
tags: ["astro", "react", "tutorial"]
draft: false
---
```

## Accessibility Rules

### Always Include

- `alt` text on images
- `aria-label` on icon-only buttons
- Visible focus states (built into shadcn)
- Semantic HTML (`<main>`, `<nav>`, `<article>`)

### Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

## Animation Constraints

### Allowed

- Subtle entrance animations (opacity, small translate)
- Hover/focus micro-interactions
- Scroll reveal below the fold
- One signature flourish per page

### Forbidden

- Full-page constant motion
- Heavy parallax everywhere
- Bouncy/elastic easing
- Auto-scrolling
- Motion that blocks interaction

## Error Handling

### In Astro Pages

```astro
---
import { getCollection } from 'astro:content';

const projects = await getCollection('projects');
if (!projects.length) {
  return Astro.redirect('/404');
}
---
```

### In React Components

```tsx
export function ContactForm() {
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  return <form>...</form>;
}
```

## Git Commit Messages

Format: `type: description`

Types:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting (no logic change)
- `refactor:` Code restructure
- `test:` Tests
- `chore:` Maintenance

Example: `feat: add project detail page`
