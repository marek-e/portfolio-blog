# UI Components Guide

## Overview

This project uses shadcn/ui components built on Base UI primitives. Components are in `src/components/ui/`, with custom Astro and React components in their respective directories.
A design system page is present at `/[lang]/design-system`.
This page is generated automatically by the `DesignSystemPreview` component inside the `src/pages/design-system.astro` file.

## Available Components

| Component     | Type              | Context Required | Notes                        |
| ------------- | ----------------- | ---------------- | ---------------------------- |
| Button        | Static-safe       | No               | Can use directly in Astro    |
| Badge         | Static-safe       | No               | Can use directly in Astro    |
| Card          | Static-safe       | No               | Can use directly in Astro    |
| Input         | Static-safe       | No               | Can use directly in Astro    |
| Textarea      | Static-safe       | No               | Can use directly in Astro    |
| Label         | Static-safe       | No               | Can use directly in Astro    |
| Separator     | Static-safe       | No               | Can use directly in Astro    |
| Field         | Static-safe       | No               | Form field layout primitives |
| InputGroup    | Static-safe       | No               | Input with addons/buttons    |
| Alert Dialog  | **Needs wrapper** | Yes              | Wrap in React component      |
| Dropdown Menu | **Needs wrapper** | Yes              | Wrap in React component      |
| Select        | **Needs wrapper** | Yes              | Wrap in React component      |
| Combobox      | **Needs wrapper** | Yes              | Wrap in React component      |
| Sheet         | **Needs wrapper** | Yes              | Wrap in React component      |
| Tooltip       | **Needs wrapper** | Yes              | Uses Base UI, wrap in React  |

## Adding New Components

```bash
pnpm dlx shadcn@latest add [component-name]
```

Example:

```bash
pnpm dlx shadcn@latest add accordion
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add sheet
```

## Usage Patterns

### Static-Safe Components

Can be imported directly in `.astro` files:

```astro
---
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
---

<Button variant="outline">Click me</Button>
<Badge variant="secondary">New</Badge>
```

### Context-Dependent Components

**Must be wrapped** in a React component file:

```tsx
// src/components/react/DeleteConfirm.tsx
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmProps {
  onConfirm: () => void;
  itemName: string;
}

export function DeleteConfirm({ onConfirm, itemName }: DeleteConfirmProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {itemName}?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

Then use in Astro with client directive:

```astro
---
import { DeleteConfirm } from '@/components/react/DeleteConfirm';
---

<DeleteConfirm client:visible itemName="project" onConfirm={() => {}} />
```

## Button Variants

```tsx
<Button variant="default">Primary action</Button>
<Button variant="secondary">Secondary action</Button>
<Button variant="outline">Outlined</Button>
<Button variant="ghost">Subtle</Button>
<Button variant="destructive">Dangerous action</Button>
<Button variant="link">Link style</Button>
```

## Button Sizes

```tsx
<Button size="xs">Extra small</Button>
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>
```

## Badge Variants

```tsx
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
```

## Card Structure

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

## Form Pattern

```tsx
<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" placeholder="you@example.com" />
  </div>
  <div className="space-y-2">
    <Label htmlFor="message">Message</Label>
    <Textarea id="message" placeholder="Your message..." />
  </div>
  <Button type="submit">Send</Button>
</div>
```

## Client Directives Reference

| Directive              | When to Use                                |
| ---------------------- | ------------------------------------------ |
| `client:load`          | Critical interactivity (theme toggle, nav) |
| `client:visible`       | Below-fold content, modals                 |
| `client:idle`          | Non-critical, after page is idle           |
| `client:media="(...)"` | Responsive (mobile nav)                    |
| (none)                 | Static render only                         |

## Theme Colors

Available CSS variables for styling:

```css
--background
--foreground
--primary / --primary-foreground
--secondary / --secondary-foreground
--muted / --muted-foreground
--accent / --accent-foreground
--destructive
--border
--input
--ring
```

Usage in Tailwind:

```tsx
<div className="bg-background text-foreground">
<button className="bg-primary text-primary-foreground">
<p className="text-muted-foreground">
```

## Custom React Components

Located in `src/components/react/`:

### ModeToggle

Theme switcher with circular reveal animation (View Transitions API).

```astro
<ModeToggle client:load />
```

- Three modes: Light, Dark, System
- Circular reveal animation on supported browsers
- Fade fallback on Firefox
- Respects `prefers-reduced-motion`

### MobileMenu

Hamburger menu for mobile navigation.

```astro
<MobileMenu client:load />
```

- Opens a Sheet (slide-out drawer) from right
- Automatically hidden on `md:` breakpoint and above
- Contains all navigation links
- Close on link click or backdrop tap

### Icon

Wrapper for Hugeicons that works in both Astro and React.

```astro
---
import { Icon } from '@/components/react/Icon';
import { Star } from '@hugeicons/core-free-icons';
---

<Icon icon={Star} className="size-5" />
```

### LanguageSwitcher

Pill-shaped language toggle with active state highlighting.

```astro
<LanguageSwitcher client:load currentLang="fr" currentPath={Astro.url.pathname} />
```

- Glass-morphism styling with backdrop blur
- Active language highlighted with primary color
- Uses `aria-current="page"` for accessibility

### BookmarkLanguageToggle

Fixed bookmark-style language toggle with tooltip.

```astro
<BookmarkLanguageToggle client:load currentLang="fr" currentPath={Astro.url.pathname} />
```

- Fixed position at top-right of viewport
- Expands on hover to reveal flag icon
- 3D shadow and glass highlight effects
- Includes tooltip with localized label
- Respects `prefers-reduced-motion`
- Hidden on mobile (`md:flex`)

### TimelineCards

Scroll-driven timeline with 3D card animations.

```astro
<TimelineCards client:visible entries={timelineEntries} lang="fr" presentLabel="Aujourd'hui" />
```

- Alternating left/right layout on desktop
- Single column with vertical line on mobile
- 3D perspective transforms on scroll
- Animated curved SVG path with glowing dot
- Respects `prefers-reduced-motion`
- Supports education and work entry types

## Astro Components

Located in `src/components/astro/`:

### CursorSpotlight

Adds a radial gradient spotlight effect that follows the cursor.

```astro
---
import CursorSpotlight from '@/components/astro/CursorSpotlight.astro';
---

<CursorSpotlight>
  <div>Content with spotlight effect</div>
</CursorSpotlight>
```

- Uses CSS custom properties for cursor position
- Gradient uses theme `--primary` color
- Disabled for `prefers-reduced-motion`
- Disabled for touch devices (`pointer: coarse`)
- Supports View Transitions via `astro:after-swap`

## Additional UI Primitives

### Tooltip

Tooltip built on Base UI (not Radix). Requires React context.

```tsx
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

<Tooltip>
  <TooltipTrigger render={<button>Hover me</button>} />
  <TooltipContent side="top">Tooltip text</TooltipContent>
</Tooltip>;
```

- `side`: top | bottom | left | right
- `sideOffset`: distance from trigger
- `align`: start | center | end
- Includes arrow pointer

### Field

Form field layout components for labels, descriptions, and errors.

```tsx
import { Field, FieldLabel, FieldDescription, FieldError, FieldGroup } from '@/components/ui/field';

<FieldGroup>
  <Field>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" type="email" />
    <FieldDescription>We'll never share your email.</FieldDescription>
    <FieldError>Invalid email address</FieldError>
  </Field>
</FieldGroup>;
```

- Supports `orientation`: vertical | horizontal | responsive
- Automatic invalid state styling
- Nested field groups with proper spacing

### InputGroup

Input with inline addons, buttons, or icons.

```tsx
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from '@/components/ui/input-group';

<InputGroup>
  <InputGroupAddon align="inline-start">
    <SearchIcon />
  </InputGroupAddon>
  <InputGroupInput placeholder="Search..." />
  <InputGroupButton>Go</InputGroupButton>
</InputGroup>;
```

- `align`: inline-start | inline-end | block-start | block-end
- Supports buttons, icons, and text addons
- Focus ring on input focus
- Invalid state styling

## MDX Components

Located in `src/components/mdx/`. These components are available in all MDX blog posts via the `mdxComponents` object.

### Architecture: Why `.tsx` and Not `.astro`?

**Important**: MDX components must be React components (`.tsx`), not Astro components (`.astro`), because they are passed through the `components` prop of `<Content>`:

```astro
<Content components={mdxComponents} />
```

This prop expects React components. The components render as **static HTML during build** - React hooks like `useEffect`, `useState` do NOT run because there's no client-side hydration.

### Client-Side Interactivity Pattern

For MDX components that need client-side JavaScript (like Mermaid diagrams), use the **data attribute + script** pattern:

1. **Component (`.tsx`)**: Renders a placeholder with data attributes
2. **Page script (`[slug].astro`)**: Initializes the feature client-side

```tsx
// Component: renders placeholder with data
export function MyComponent({ data }: Props) {
  return (
    <div data-my-component data-config={JSON.stringify(data)}>
      <div className="animate-spin" /> {/* Loading state */}
    </div>
  );
}
```

```astro
<!-- Page: client-side initialization -->
<script>
  function initMyComponents() {
    document.querySelectorAll('[data-my-component]').forEach((el) => {
      const config = JSON.parse(el.getAttribute('data-config') || '{}');
      // Initialize with config...
    });
  }
  initMyComponents();
  document.addEventListener('astro:after-swap', initMyComponents);
</script>
```

### Available MDX Components

| Component   | Purpose                          | Client JS? |
| ----------- | -------------------------------- | ---------- |
| `Highlight` | Colored text highlighting        | No         |
| `Callout`   | Alert boxes (info, warning, tip) | No         |
| `Citation`  | Block quotes with attribution    | No         |
| `Figure`    | Images with captions             | No         |
| `Mermaid`   | Diagrams (flowchart, sequence)   | Yes        |
| `Pre`       | Code blocks with copy button     | Yes\*      |
| `H1-H4`     | Headings with anchor links       | Yes\*      |

\*Copy buttons and heading anchors are initialized via scripts in `[slug].astro`.

### Figure

Image with optional caption and styling.

```mdx
<Figure
  src="/images/example.png"
  alt="Description of the image"
  caption="Optional caption text"
  width={800}
  height={600}
/>
```

### Mermaid

Renders Mermaid diagrams. Supports all diagram types: flowchart, sequence, gitGraph, etc.

```mdx
<Mermaid
  chart={`
    flowchart LR
      A[Start] --> B{Decision}
      B -->|Yes| C[Done]
      B -->|No| D[Retry]
      D --> B
  `}
  caption="Optional caption"
/>
```

Features:

- Client-side rendering (dynamically imports Mermaid library)
- Auto theme switching (light/dark mode)
- Loading spinner while rendering
- Error display if diagram syntax is invalid

### Callout

Alert boxes for important information.

```mdx
<Callout variant="tip" title="Pro Tip">
  This is helpful advice.
</Callout>
```

Variants: `info`, `warning`, `success`, `tip`, `danger`

### Highlight

Inline text highlighting with colors.

```mdx
Learn <Highlight color="red">JavaScript</Highlight> and <Highlight color="blue">TypeScript</Highlight>.
```

Colors: `red`, `blue`, `green`, `yellow`, `purple`, `orange`

### Citation

Block quotes with attribution.

```mdx
<Citation author="Kent Beck" source="Extreme Programming Explained" url="https://example.com">
  Make it work, make it right, make it fast.
</Citation>
```
