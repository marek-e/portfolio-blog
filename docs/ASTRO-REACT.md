# Astro + React Integration

## Component Placement

| Type | Location | Use Case |
|------|----------|----------|
| Static content | `src/components/astro/*.astro` | Headers, cards, layout sections (zero JS) |
| Interactive | `src/components/react/*.tsx` | State, event handlers, context-dependent UI |
| shadcn primitives | `src/components/ui/` | Use CLI: `pnpm dlx shadcn@latest add <name>` |

## Client Directives

```astro
<Component client:load />    <!-- Critical: load immediately -->
<Component client:visible /> <!-- Below fold: lazy load -->
<Component client:idle />    <!-- Non-critical: after page idle -->
```

## React Context in Astro

Astro creates separate islands that **cannot share React Context**. Components using context (Dialog, Sheet, Select, DropdownMenu, Accordion) must be wrapped in a single `.tsx` file.

```tsx
// src/components/react/DeleteConfirm.tsx
export function DeleteConfirm({ onConfirm }: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm deletion?</AlertDialogTitle>
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

## MDX Components

MDX components must be React (`.tsx`), not Astro. They render as **static HTML during build** - React hooks (`useEffect`, `useState`) do NOT run.

### Client-Side Interactivity Pattern

For MDX components needing JavaScript, use the **data-attribute + script** pattern:

**1. Component renders placeholder with data:**
```tsx
export function Mermaid({ chart }: Props) {
  return (
    <div data-mermaid-chart data-chart={chart}>
      <div className="animate-spin" /> {/* Loading state */}
    </div>
  );
}
```

**2. Page script initializes client-side:**
```astro
<script>
  function initMermaid() {
    document.querySelectorAll('[data-mermaid-chart]').forEach(async (el) => {
      const chart = el.getAttribute('data-chart');
      const mermaid = (await import('mermaid')).default;
      const { svg } = await mermaid.render('id', chart);
      el.innerHTML = svg;
    });
  }
  initMermaid();
  document.addEventListener('astro:after-swap', initMermaid);
</script>
```

## Rendering Modes

| Content | Rendering | JavaScript |
|---------|-----------|------------|
| Pages, blog posts, project details | Static (SSG) | None |
| Theme toggle | React island | ~2KB |
| Mobile nav | React island | ~5KB |
| Contact form | React island | ~3KB |
