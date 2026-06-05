# MDX Components — Full Reference

## `<Highlight>` — inline emphasis

```mdx
This is <Highlight>the important bit</Highlight>.
This is <Highlight color="red">a red flag</Highlight>.
```

Colors: `yellow` (default) · `red` · `blue` · `green` · `purple` · `orange`

---

## `<Callout>` — aside boxes

```mdx
<Callout variant="tip" title="Pro tip">
  One short sentence. No walls of text.
</Callout>

<Callout variant="warning" title="Watch out">
  This breaks in Safari 15.
</Callout>

<Callout variant="danger">Never commit your .env file.</Callout>

<Callout variant="success" title="TL;DR">
  The whole post in two sentences.
</Callout>

<Callout variant="info">Background context worth knowing.</Callout>
```

Variants: `info` · `tip` · `warning` · `success` · `danger`

---

## `<Citation>` — quotes

```mdx
<Citation author="Kent C. Dodds" source="Testing Trophy" url="https://kentcdodds.com">
  Write tests. Not too many. Mostly integration.
</Citation>

<Citation author="Past me, 2am">It works on my machine is not a deployment strategy.</Citation>
```

Props: `author` · `source` · `url` (all optional, but at least one adds credibility)

---

## `<Toggle>` — collapsible section

````mdx
<Toggle title="See the full config">
  ```ts
  // verbose config that would break the flow inline
````

</Toggle>

<Toggle title="Why does this even work?" defaultOpen={false}>
  Deep dive for the curious reader...
</Toggle>
```

Props: `title` (default: "Show details") · `defaultOpen` (default: `false`)

---

## `<Mermaid>` — diagrams

```mdx
<Mermaid
  chart={`
    flowchart LR
      A[User] --> B{Cache?}
      B -->|hit| C[Serve]
      B -->|miss| D[Fetch]
      D --> C
  `}
  caption="Cache strategy"
  title="Cache Flow"
/>
```

Props: `chart` (required) · `caption` · `title` · `className`

Diagram types: `flowchart` · `sequenceDiagram` · `gitGraph` · `classDiagram` · `pie` · `timeline`

---

## `<FileTree>` — file structure (needs import)

```mdx
import FileTree from '@/components/mdx/FileTree.astro';

<FileTree>
  - src - components - **mdx** ← bold = highlighted - Callout.tsx - content - blog -
  **your-post.mdx**
</FileTree>
```

Wrap filenames in `**bold**` to highlight them in primary color.

---

## `<Figure>` — images with captions (needs import)

```mdx
import Figure from '@/components/astro/Figure.astro';
import myImage from '@/assets/blog/your-post/screenshot.png';

<Figure
  src={myImage}
  alt="Accessible description"
  caption="What the reader should notice"
  objectFit="contain"
/>
```

Props: `src` (required) · `alt` (required) · `caption` · `objectFit` · `className`
