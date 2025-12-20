# UI Components Guide

## Overview

This project uses shadcn/ui components built on Radix primitives. Components are in `src/components/ui/`.

## Available Components

| Component | Type | Context Required | Notes |
|-----------|------|------------------|-------|
| Button | Static-safe | No | Can use directly in Astro |
| Badge | Static-safe | No | Can use directly in Astro |
| Card | Static-safe | No | Can use directly in Astro |
| Input | Static-safe | No | Can use directly in Astro |
| Textarea | Static-safe | No | Can use directly in Astro |
| Label | Static-safe | No | Can use directly in Astro |
| Separator | Static-safe | No | Can use directly in Astro |
| Alert Dialog | **Needs wrapper** | Yes | Wrap in React component |
| Dropdown Menu | **Needs wrapper** | Yes | Wrap in React component |
| Select | **Needs wrapper** | Yes | Wrap in React component |
| Combobox | **Needs wrapper** | Yes | Wrap in React component |

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
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
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

| Directive | When to Use |
|-----------|-------------|
| `client:load` | Critical interactivity (theme toggle, nav) |
| `client:visible` | Below-fold content, modals |
| `client:idle` | Non-critical, after page is idle |
| `client:media="(...)"` | Responsive (mobile nav) |
| (none) | Static render only |

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
