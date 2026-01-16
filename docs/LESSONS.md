# Lessons Learned

This file is updated by the `/learn` command after each session. It captures mistakes made and rules to prevent them.

---

## How to Use This File

1. After completing a task, run `/learn`
2. The agent will analyze the session for mistakes
3. New lessons are appended below
4. Critical lessons are promoted to `CONVENTIONS.md`

---

## Lessons

<!-- New lessons are appended below this line -->

### 2026-01-16: MDX Components Don't Hydrate - Use Data Attributes

**Mistake**: Created a Mermaid component using React hooks (`useEffect`, `useState`) expecting them to run client-side. The component showed an infinite loader because the hooks never executed.

**Root Cause**: When passing React components to `<Content components={mdxComponents} />` in Astro MDX, they render as **static HTML during build**. There is no client-side hydration, so React hooks never run. The `'use client'` directive is a Next.js concept and does nothing in Astro.

**Solution**: For MDX components needing client-side JavaScript:

1. Component renders a placeholder with `data-*` attributes containing the config
2. A `<script>` tag in the page initializes the feature by reading those attributes

```tsx
// Component: static placeholder
export function Mermaid({ chart }: Props) {
  return (
    <div data-mermaid-chart data-chart={chart}>
      Loading...
    </div>
  );
}
```

```astro
<!-- Page: client initialization -->
<script>
  document.querySelectorAll('[data-mermaid-chart]').forEach(async (el) => {
    const chart = el.getAttribute('data-chart');
    const mermaid = (await import('mermaid')).default;
    const { svg } = await mermaid.render('id', chart);
    el.innerHTML = svg;
  });
</script>
```

**Rule**: MDX components must be `.tsx` (not `.astro`) but cannot use React hooks. For interactivity, use the data-attribute + script pattern. See `docs/COMPONENTS.md` > "MDX Components" for details.
