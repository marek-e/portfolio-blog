# Styling Guide

## Semantic Colors

Use theme variables, not raw colors:

```tsx
// Correct
<div className="bg-background text-foreground">
<button className="bg-primary text-primary-foreground">
<p className="text-muted-foreground">

// Wrong
<div className="bg-white text-black dark:bg-gray-900">
```

### Available Theme Variables

```
--background / --foreground
--primary / --primary-foreground
--secondary / --secondary-foreground
--muted / --muted-foreground
--accent / --accent-foreground
--destructive
--border / --input / --ring
```

## Responsive Design

Mobile-first with two primary breakpoints:

| Breakpoint | Width | Use Case |
|------------|-------|----------|
| Default | < 768px | Mobile |
| `md:` | ≥ 768px | Tablets and desktop |

(`lg:` at 1024px is available for optional refinement but not a primary breakpoint)

### Common Patterns

```tsx
// Grid layouts
<div className="grid grid-cols-1 md:grid-cols-2">

// Typography scaling
<h1 className="text-3xl md:text-5xl">

// Show/hide elements
<nav className="hidden md:flex">     {/* Desktop only */}
<button className="md:hidden">       {/* Mobile only */}

// Flex direction
<div className="flex flex-col md:flex-row">
```

### Touch Targets

Ensure 44x44px minimum on mobile:

```tsx
<Button size="icon" className="size-11">
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

### Accessibility

Always respect reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

## Forbidden Content Patterns

These are portfolio anti-patterns to avoid:

- Skill percentages or charts
- Full-page constant motion / heavy parallax
- Overconfident claims ("expert", "10x dev")
- Generic template language
