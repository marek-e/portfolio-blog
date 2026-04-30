# Blog Writing Scope

## Writing Philosophy

**Brevity over verbosity.** Every sentence should earn its place. If you can cut a word without losing meaning, cut it.

**Human, not corporate.** Write like you're explaining to a smart friend over coffee — not to a committee. First person, present tense, contractions welcome.

**Humor as seasoning.** One well-placed joke beats five forced ones. Tie it to real experience: "I spent 3 hours debugging this before realizing I'd forgotten a semicolon. You're welcome."

**Show, don't tell.** Use code blocks, diagrams, and visuals instead of long explanations. A Mermaid flowchart can replace two paragraphs.

---

## Post Structure

```
Hook (1-2 sentences) → Problem/Context → Solution/Insight → Takeaway
```

- **Title**: specific and punchy. "How I cut build time by 60% with one Rollup trick" > "Optimizing builds"
- **Description**: one sentence, the TL;DR. Appears in SEO and cards.
- **Intro**: state the problem immediately — no warm-up preamble
- **Body**: one idea per section, H2s are signposts not chapter titles
- **Outro**: one concrete takeaway, no "in conclusion"

---

## Frontmatter

```yaml
---
title: 'Your punchy title here'
description: 'One-sentence TL;DR that makes someone want to read this.'
publishDate: 2026-01-01
tags: ['tag1', 'tag2'] # 2-4 tags max
draft: true # flip to false when ready
updatedDate: 2026-01-15 # optional, only if meaningfully revised
---
```

---

## MDX Components Reference

All components below are **globally available** — no import needed except `Figure` and `FileTree`.

### `<Highlight>` — inline text emphasis

Use for key terms, important phrases. Feels like a physical highlighter.

```mdx
This is <Highlight>the important bit</Highlight> you shouldn't miss.
This is <Highlight color="red">a red flag</Highlight> in your code.
```

Colors: `yellow` (default) · `red` · `blue` · `green` · `purple` · `orange`

---

### `<Callout>` — aside boxes

Use to flag gotchas, tips, warnings. Don't overuse — one per section max.

```mdx
<Callout variant="tip" title="Pro tip">
  Run `pnpm build` before pushing. CI will thank you.
</Callout>

<Callout variant="warning" title="Watch out">
  This breaks in Safari 15. Yes, really.
</Callout>

<Callout variant="danger">Never commit your `.env` file. I'm serious.</Callout>
```

Variants: `info` · `tip` · `warning` · `success` · `danger`

---

### `<Citation>` — quotes

Use for memorable quotes from docs, people, or your own past mistakes.

```mdx
<Citation author="Kent C. Dodds" source="Testing Trophy" url="https://kentcdodds.com">
  Write tests. Not too many. Mostly integration.
</Citation>

<Citation author="Past me, 2am">"It works on my machine" is not a deployment strategy.</Citation>
```

---

### `<Toggle>` — collapsible sections

Use for long code examples, "bonus" content, or details that break flow.

````mdx
<Toggle title="See the full config">
  ```ts
  // 50-line config that would kill the reading flow
````

</Toggle>

<Toggle title="Why does this even work? (bonus explainer)" defaultOpen={false}>
  Deep dive for the curious reader...
</Toggle>
```

---

### `<Mermaid>` — diagrams

Use instead of walls of text for flows, architectures, sequences. Way more fun to read.

```mdx
<Mermaid
  chart={`
    flowchart LR
      A[User clicks] --> B{Cache hit?}
      B -->|Yes| C[Serve instantly]
      B -->|No| D[Fetch & cache]
      D --> C
  `}
  caption="Cache strategy — the simple version"
  title="Cache Flow"
/>
```

Supports: `flowchart` · `sequenceDiagram` · `gitGraph` · `classDiagram` · `pie` · `timeline`

---

### `<FileTree>` — project structure

Use when explaining repo structure or showing "where to put this file".

```mdx
import FileTree from '@/components/mdx/FileTree.astro';

<FileTree>
  - src - components - **mdx** ← the fun stuff lives here - Callout.tsx - Mermaid.tsx - content -
  blog - **your-post.mdx**
</FileTree>
```

Wrap a filename in `**bold**` to highlight it.

---

### `<Figure>` — images with captions

Use for screenshots, diagrams exported as images, hero visuals.

```mdx
import Figure from '@/components/astro/Figure.astro';
import myImage from '@/assets/blog/your-post/screenshot.png';

<Figure
  src={myImage}
  alt="Description for accessibility"
  caption="What the reader should notice in this image"
/>
```

---

### Code blocks — syntax highlighted

Use liberally. Always specify the language. Use `// [!code highlight]` for line emphasis.

````mdx
```typescript
function theInterestingPart(input: string) {
  return input.trim().toLowerCase(); // [!code highlight]
}
```
````

---

## Component Cheat Sheet

| Goal                        | Component                     |
| --------------------------- | ----------------------------- |
| Emphasize a term inline     | `<Highlight color="yellow">`  |
| Flag a gotcha               | `<Callout variant="warning">` |
| Share a memorable quote     | `<Citation>`                  |
| Hide verbose details        | `<Toggle>`                    |
| Explain a flow/architecture | `<Mermaid>`                   |
| Show file structure         | `<FileTree>`                  |
| Display a screenshot        | `<Figure>`                    |
| Show code                   | fenced code block             |

---

## Checklist Before Publishing

- [ ] Title is specific (not "Introduction to X")
- [ ] Description is one punchy sentence
- [ ] Intro states the problem in the first 2 sentences
- [ ] At least one visual (diagram, code, or figure)
- [ ] At least one MDX component beyond code blocks
- [ ] No paragraph longer than 5 lines
- [ ] `draft: false` set
- [ ] Read aloud — if it sounds robotic, rewrite it
