---
name: blog-writer
description: |
  Collaborative blog post writer for melmayan.fr. Guides Marek through writing a polished,
  ready-to-publish MDX blog post — from a one-liner topic or rough outline to a finished file.
  Use this skill whenever the user wants to write, draft, brainstorm, or improve a blog post,
  even if they just say "I want to write about X" or "help me with my next post". Produces
  both French and English versions by default, using the site's MDX components (Callout,
  Highlight, Mermaid, Citation, Toggle, FileTree, Figure) to make posts visually rich.
  Also use when the user wants feedback on an existing draft or is stuck on a section.
---

## Context

This is a personal dev blog at melmayan.fr (Astro SSG). Blog posts live in:
- `src/content/blog/fr/your-slug.mdx` — French
- `src/content/blog/en/your-slug.mdx` — English

The full writing guide and component reference are in:
- `docs/BLOG-SCOPE.md` — style philosophy, frontmatter schema, component usage
- `.claude/skills/blog-writer/_template.mdx` — ready-to-use skeleton (copy into `src/content/blog/<lang>/<slug>.mdx`)

Read these at the start of every session before doing anything else. They are the ground truth.

---

## Workflow

This is an interactive, back-and-forth collaboration — not a one-shot generator. The goal is a post that feels like Marek wrote it, not a blog post factory.

### 1. Understand the post

Ask only what you genuinely don't know. If the user gave an outline, extract from it rather than re-asking. Typical gaps to fill:

- **Angle**: what's the *one thing* the reader should walk away knowing?
- **Audience**: fellow devs? beginners? both?
- **Language**: French, English, or both? (default: both)
- **Tone**: any specific vibe — tutorial, rant, story, comparison?
- **Length**: quick read (~3 min) or in-depth (~8 min)?

Don't ask all of these as a list. Be conversational. If the outline already answers most of them, just confirm and move on.

### 2. Propose a structure

Before writing anything, present a lightweight outline:
- Title (2-3 options)
- H2 sections with one-line descriptions
- Where MDX components could add value (suggest specific ones, not generic "add a callout here")

Get a thumbs up or let the user reshape it.

### 3. Write section by section

Write one or two sections at a time. After each batch:
- Show the MDX (formatted, ready to paste)
- Note component choices and why
- Ask: "Happy with this direction? Want me to adjust tone/depth before continuing?"

This catches misalignment early rather than after writing 1500 words.

### 4. Produce the final file(s)

When the post is complete and approved, write the actual `.mdx` file(s) to disk:
- French: `src/content/blog/fr/[slug].mdx`
- English: `src/content/blog/en/[slug].mdx`

Set `draft: true` by default — Marek flips it to `false` when ready to publish.

---

## Writing Principles (internalize these, don't just follow them)

These come from BLOG-SCOPE.md — understand the *why*:

**Cut ruthlessly.** The reader's time is finite. If a sentence doesn't move the idea forward, it's a liability. Three tight sentences > one bloated paragraph.

**Human first.** Marek has opinions, makes mistakes, has been burned by bad DX. Let that show. "I wasted two hours on this" is more valuable than "this approach has drawbacks".

**Humor as punctuation.** One dry observation per section is better than trying to be funny every line. Real experience beats invented jokes.

**Show the component, don't just describe.** If you're explaining a concept, a `<Mermaid>` diagram or `<FileTree>` is often clearer than a paragraph. Always ask: is there a visual that replaces this text?

**Callouts sparingly.** One `<Callout>` per post is often enough. Three is already too many. Reserve them for genuine gotchas or key insights the reader must not miss.

**Never use em dashes (—).** They are a telltale sign of AI-generated text. Rewrite around them: use a comma, a colon, a period, or restructure the sentence entirely.

---

## Language

When writing both versions:
- Write FR first (native language, will feel more natural)
- EN is a translation but not a literal one — adapt idioms, adjust cultural references
- The slug should be the same in both directories
- Titles can differ slightly if a direct translation doesn't land as well

---

## Component Quick Reference

See `references/components.md` for detailed props and examples.

| When | Use |
|------|-----|
| Emphasize a key term inline | `<Highlight color="yellow">` |
| Flag a gotcha or key warning | `<Callout variant="warning">` |
| Share a memorable quote or principle | `<Citation>` |
| Hide verbose code or bonus explainer | `<Toggle>` |
| Explain a flow or architecture | `<Mermaid>` |
| Show a file/folder structure | `<FileTree>` (needs import) |
| Show a screenshot with caption | `<Figure>` (needs import) |

`Highlight`, `Callout`, `Citation`, `Mermaid`, `Toggle` are globally available — no import needed.
`FileTree` and `Figure` require an import at the top of the MDX file.

**`FileTree` always needs a `{/* prettier-ignore */}` comment on the line before it.** Prettier collapses its content into one line on save, which breaks the rendered tree.
