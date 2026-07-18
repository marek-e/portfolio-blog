# Blog Writing Scope

## Writing Philosophy

### North star: earned insight density

Maximise **non-obvious claims that only you could make because you actually did the thing, per minute of reading**, under a hard non-abandonment cap. Every rule below is downstream of this. When a choice is unclear, ask: does this raise earned insight density without making the reader bail? An abandoned post scores zero no matter how strong its first three paragraphs were.

Two failure modes the model pushes you toward, pulling opposite directions:

- **Padding.** Filler that inflates reading time without adding insight. Lowers density. ("It's worth noting that...", "In this section we'll explore...")
- **Exaggeration.** Intensifiers with no evidence behind them. Destroys the "earned" half, and reads as confidence, so it's the easier one to miss.

### The principles (all serve the north star)

**One contestable thesis.** Write it as one sentence at the top of the file before drafting. A competent peer must be _able_ to disagree with it. A topic ("Slidev + AI") is not a thesis ("the more code-native your tool, the more AI multiplies it"). Every section feeds the thesis; tangents die for it, however interesting.

**Earn it or cut it.** Each load-bearing section needs a verifiable artifact (repo, live link, video) _and_ at least one unfakeable detail, a number, a trick, or a scar that betrays first-hand contact ("the `pointer-events: none` trick", "got it on the second try"). A section a generic dev could have written without doing the thing is off-mission. Pure explainers with no first-hand work are a different, lower-ceiling game; know when you're stepping off the north star.

**Density wins over brevity.** Brevity is a _side effect_ of deleting zero-insight words, not a goal. Judge each sentence by insight-per-word: cut the flabby ones at any length, protect the dense-but-long ones at any length (the `z-index`/`pointer-events` sentence is long and untouchable). No target length. "No paragraph over 5 lines" is a smell test, never a reason to split a dense passage.

**Pace the load.** Cap concepts-per-sentence, not just total length. After every dense passage, land a short release line ("Twenty minutes from prompt to a live demo that landed."). On a hard concept, spend the extra words on the _on-ramp_ (the intuition, the one-line analogy), not on padding the detail.

**Hype is a check the title writes and the body cashes.** Promise layer (title + description) may use intensifiers; that wins the click and the SEO. Delivery layer (body) may not: every superlative there points to a referent or gets cut. Quantify, don't amplify ("thirty seconds", "10% of the code" beat "stunning", "your imagination is the only limit"). An over-hyped body raises bounce, which hurts the ranking the hype was for.

**Voice is visible judgment.** Not contractions and a casual register, those are surface. Voice is opinions, taste, and verdicts a neutral writer would never commit to ("Try doing that in Keynote."). Test: swap your byline for another competent dev's; if the sentence survives unchanged, it's generic. The model hosts your taste, it can't supply it. Voice serves the thesis; an aside that doesn't advance it is cut.

**Steelman the strongest objection.** Find the one counter-argument that would otherwise nag the reader the whole way, give it its best version, then either concede a _bounded_ case ("for a corporate deck with bullet points, no-code ships faster") or refute it on the reader's own ground. A caveat must **bound** the claim (sharpens it), never **hedge** ("your mileage may vary", which retreats and costs trust).

**Show, don't tell, two classes of visual with opposite policies.**

- _Load-bearing_ (the insight IS the visual: a video of the demo, a `<Mermaid>` of the flow). Maximise these. Test: "can the reader only verify or feel this by seeing it?" If yes, it must be a visual. This is your unfair advantage on an interactive blog.
- _Emphasis_ (`<Highlight>`, `<Callout>`: add zero insight, just point at it). Ration these. Emphasis is currency that inflates; highlight everything and you've highlighted nothing. One Callout is often enough, three is already too many (advisory). Test: "would this lose its punch as plain prose?" If no, don't box it.

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
import Figure from '@/components/mdx/Figure.astro';
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

## Verification — run before publishing

Each test returns yes/no on _specific sentences_, not a vibe. The skill runs the mechanical ones (🤖) and reports the failing sentences; the judgment ones (👤) are yours to call, because the model can't reliably grade its own taste.

1. **Thesis** 👤 — one contestable sentence exists at the top. A peer could disagree with it.
2. **Byline-swap** 🤖→👤 — sample sentences. Could a generic competent dev have written this exact sentence without doing the work (facts) or without your taste (voice)? Every "yes" is a liability.
3. **Unfakeable detail** 🤖 — every load-bearing section has at least one number, trick, or scar. Flag the sections with none.
4. **Intensifier sweep** 🤖 — every superlative in the _body_ points to a referent or gets cut. Title and description are exempt (promise layer).
5. **Objection** 👤 — the single strongest counter is named, then bounded-conceded or refuted. A skeptic should not finish still holding it.
6. **Abandonment** 👤 — find the two longest consecutive high-load paragraphs; there's a release between them. Mark where you'd bail while skimming, fix that spot.
7. **Deletion pass** 🤖→👤 — try deleting each paragraph. If the thesis survives and nothing of value is lost, leave it deleted.

**The single proxy for the north star:** would you send this to one specific smart friend who already knows the domain, and would they learn something new? If not, it isn't done.

Then the basics:

- [ ] Title specific (not "Introduction to X"), description one punchy sentence
- [ ] Intro states the problem in the first 2 sentences, no warm-up
- [ ] At least one load-bearing visual
- [ ] No em dashes
- [ ] Read aloud to find where your own breath (= the reader's attention) runs out
- [ ] `draft: false` set
