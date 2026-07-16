---
name: blog-writer
description: |
  Collaborative blog post writer for melmayan.fr. Guides Marek through writing a polished,
  ready-to-publish MDX blog post from a locked Blog PRD to finished FR/EN files.
  Use when drafting, revising, or finishing a post after intent is locked. If no locked
  PRD exists for the slug, hand off to blog-prd first. Also use for section feedback or
  pre-publish verification against BLOG-SCOPE.
---

## Context

This is a personal dev blog at melmayan.fr (Astro SSG). Blog posts live in:

- `src/content/blog/fr/your-slug.mdx` — French
- `src/content/blog/en/your-slug.mdx` — English

The full writing guide and component reference are in:

- `docs/BLOG-PRD.md` — per-post decision record (intent, thesis, evidence, scope)
- `docs/blog-prds/<slug>.md` — locked PRD for this post (required before drafting)
- `docs/BLOG-SCOPE.md` — style philosophy, frontmatter schema, component usage
- `.claude/skills/blog-writer/references/voice.md` — Marek's actual register, calibrated from a real rewrite (before/after evidence)
- `.claude/skills/blog-writer/_template.mdx` — ready-to-use skeleton (copy into `src/content/blog/<lang>/<slug>.mdx`)

Read BLOG-SCOPE and the post's Blog PRD at the start of every session before drafting. They are the ground truth. Where BLOG-SCOPE's "punchy" guidance and voice.md conflict, voice.md wins: it is his hand, observed.

---

## Workflow

This is an interactive, back-and-forth collaboration — not a one-shot generator. The goal is a post that feels like Marek wrote it, not a blog post factory.

### 0. Require a locked Blog PRD

Before outlining or writing MDX:

1. Resolve the slug (from the user, an existing draft, or `docs/blog-prds/`).
2. If `docs/blog-prds/<slug>.md` is missing, or `status` is not `locked`, **stop drafting**. Switch to the **blog-prd** skill (grill → lock) and only resume here after the author locks the PRD.
3. If the PRD is `locked`, treat it as the contract: thesis, intent IS/NOT, evidence plan, scope Out, payoff. Do not silently invent a new angle.

Re-open **blog-prd** if drafting reveals a contradiction with the locked brief; re-lock before continuing.

### 1. Confirm from the PRD (don't re-interview from scratch)

Read the locked PRD and confirm only gaps that block drafting (e.g. missing title options, FR/EN preference already set). Do not re-run the full thesis grill unless the author asks.

### 2. Propose a structure

Map the PRD arc into a lightweight outline:

- Title (2-3 options; may refine the PRD working title)
- H2 sections aligned to the PRD arc (one idea per section)
- Where MDX components could add value (suggest specific ones, not generic "add a callout here")
- Call out any PRD evidence rung not yet earned (don't fake it in prose)

Get a thumbs up or let the user reshape it — without breaking the locked thesis.

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

### 5. Verify before publishing

Before Marek flips `draft: false`, run the verification battery in BLOG-SCOPE.md. Run the mechanical checks automatically and report the _specific failing sentences_: the intensifier sweep (superlatives in the body with no referent), the copywriter-cadence sweep (escalating triplets, staccato fragments, dramatic kickers, urgency words — see `references/voice.md`), the em-dash sweep (the clickjacking draft shipped full of them despite the rule above), byline-swap suspects (sentences a generic dev could have written), sections missing an unfakeable detail, and the deletion pass. Leave the judgment calls (thesis, objection, abandonment, voice) to Marek. The single proxy for the whole thing: would he send this to one smart friend in the domain who'd learn something new?

---

## Writing Principles (internalize these, don't just follow them)

These come from BLOG-SCOPE.md — understand the _why_. The full quality model and the pre-publish verification battery live there; read it first.

**North star: earned insight density.** Maximise non-obvious claims only Marek could make because he did the thing, per minute of reading, under a hard non-abandonment cap. Everything below serves this. The model's two enemies here pull opposite ways: padding (lowers density) and exaggeration (destroys the "earned" half, reads as confidence).

**One contestable thesis.** One sentence, written before drafting, that a competent peer could disagree with. A topic is not a thesis. Every section feeds it; tangents die for it.

**Earn it or cut it.** Each load-bearing section needs a verifiable artifact plus one unfakeable detail (a number, a trick, a scar). A section a generic dev could have written without doing the thing is off-mission.

**Density wins; brevity is the side effect.** Judge each sentence by insight-per-word: cut flabby ones at any length, protect dense-but-long ones at any length. No target length. "5-line paragraph" is a smell test, never a reason to split a dense passage. Pace the load: a short release line after every dense passage.

**Hype is a check the title writes and the body cashes.** Title and description may use intensifiers (the click, the SEO). The body may not: every superlative there points to a referent or gets cut. Quantify, don't amplify.

**Voice is visible judgment.** Opinions, taste, verdicts a neutral writer would never commit to, not just contractions. Byline-swap test: if another competent dev could have written the sentence unchanged, it's generic. Pull opinions out of Marek; don't generate them.

**Steelman the strongest objection.** Name the one counter that would nag the reader, give it its best version, then concede a bounded case or refute it. Caveats bound the claim, never hedge it.

**Show the component, two classes.** Load-bearing visuals (the insight IS the visual: demo video, flow diagram) — maximise. Emphasis components (`<Highlight>`, `<Callout>`: point at insight, add none) — ration; one Callout is often enough, three is too many (advisory).

**Never use em dashes (—).** They are a telltale sign of AI-generated text. Rewrite around them: use a comma, a colon, a period, or restructure the sentence entirely.

---

## Register (learned the hard way)

The clickjacking draft followed every principle above and Marek still rewrote most of it. The gap was register: the draft read like a copywriter, Marek writes like a teacher giving a talk. Full before/after evidence lives in `references/voice.md`; the short version:

- **One hook, then drop the act.** One punchy opening line max. Then plain explanation. No escalating triplets ("so simple..., so effective..., so misunderstood..."), no staccato fragments ("No malware. No network anomaly."), no dramatic kickers ("One click away."), no urgency ("tonight").
- **Teach, to "you".** State the principle explicitly in plain words, then anticipate the reader's next question and pose it out loud ("You are probably wondering why..."). The reader is "you", never "your user".
- **Marek is in the post.** Ask him why he picked the topic and put the answer in the intro. Meta-navigation is welcome ("we will cover them shortly later"). Link his own talks/repos/demos at the end.
- **Headings: descriptive or question-form.** "How X works", "How to keep the victim fooled?", "Takeaways". Never clever parallels ("The double con") or dash-appended punchlines.
- **Structure beats prose.** 3+ facts sharing a shape become a table; flows over time become a Mermaid diagram; categorized lists get colored `<Highlight>` labels; one `<strong>` on the load-bearing phrase of an explanatory paragraph.
- **Focused depth, linked breadth.** Cut exhaustive coverage (per-stack config snippets); link MDN/OWASP-style references instead.
- **Natural beats polished.** A slightly loose conversational sentence in his register beats a slick one in a copywriter's.

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

| When                                 | Use                           |
| ------------------------------------ | ----------------------------- |
| Emphasize a key term inline          | `<Highlight color="yellow">`  |
| Flag a gotcha or key warning         | `<Callout variant="warning">` |
| Share a memorable quote or principle | `<Citation>`                  |
| Hide verbose code or bonus explainer | `<Toggle>`                    |
| Explain a flow or architecture       | `<Mermaid>`                   |
| Show a file/folder structure         | `<FileTree>` (needs import)   |
| Show a screenshot with caption       | `<Figure>` (needs import)     |

`Highlight`, `Callout`, `Citation`, `Mermaid`, `Toggle` are globally available — no import needed.
`FileTree` and `Figure` require an import at the top of the MDX file.

**`FileTree` always needs a `{/* prettier-ignore */}` comment on the line before it.** Prettier collapses its content into one line on save, which breaks the rendered tree.
