# Blog PRD

A **Blog PRD** is the per-post equivalent of a feature PRD: a short decision record you lock **before** drafting MDX. It is not the post. It is the contract the post must satisfy.

| Document | Job |
| --- | --- |
| [BLOG-SCOPE.md](./BLOG-SCOPE.md) | How every post is written (philosophy, voice, components, verification) |
| **This file** | What *this* post is arguing, proving, and excluding |
| `docs/blog-prds/<slug>.md` | The filled PRD for one post |

If the PRD and the draft disagree, the PRD wins until you explicitly revise and re-lock it.

---

## Why this exists

Drafting without a locked brief produces two failure modes:

1. **Topic posts** — interesting sections that never commit to a contestable claim
2. **Summary posts** — competent restatements of someone else's article, no first-hand scar

The PRD forces the same decisions a good grill session surfaces: thesis, intent, evidence, scope, objection, payoff. Writing starts only when those are locked.

---

## Lifecycle

```
idea → grill (blog-prd skill) → PRD draft → lock → draft MDX (blog-writer) → verify → publish
```

| Status | Meaning |
| --- | --- |
| `idea` | Notes only; not a PRD yet |
| `grilling` | Interview in progress; fields may be contradictory |
| `draft` | PRD written; author has not signed off |
| `locked` | Author approved; drafting may start |
| `drafting` | MDX in progress; PRD changes require re-lock |
| `done` | Post shipped (`draft: false`); PRD kept as archive |

**Gate:** do not write `src/content/blog/**` until status is `locked` (or you are deliberately revising a locked PRD and will re-lock before continuing).

---

## Required fields

Every Blog PRD must answer these. Empty = not ready to lock.

### 1. Meta

- **Working title** (may change; SEO title can wait)
- **Slug** (stable once locked)
- **Languages** (`fr` / `en` / both; default both)
- **Related posts** (sequel / prequel / none)
- **Status** + date

### 2. Intent

Two lists, both mandatory:

- **This post IS…** (1–3 bullets: the job)
- **This post is NOT…** (1–3 bullets: the traps — e.g. “not a summary of X”, “not a beginner tutorial”)

### 3. Thesis

One contestable sentence. A competent peer in the domain must be *able* to disagree.

- A **topic** is not a thesis (“agent skills security”)
- A **thesis** takes a side (“a skill is a binary with a README; reading helps, registry badges don’t replace a Bash deny floor”)

If you have two claims glued with “and”, split them. Pick the load-bearing one; demote the other to takeaway or payoff.

### 4. Audience

Who it is for, and who it is willing to lose. One sentence each.

### 5. Reader takeaways (ranked)

Ordered list of what the reader should leave with. Rank matters: the #1 takeaway must follow from the thesis. Soft advice (“be careful”) is not enough unless ranked against a harder control.

### 6. Shape

- **Arc** in H2-sized beats (one idea per beat)
- **Lead** (mechanism-first, story-first, ladder-first, …)
- **Length posture** (short / medium / long — no minute targets required; posture only)

### 7. Evidence plan

What must be *earned*, not asserted:

- **Artifacts** (repo, screenshot, recording, Mermaid of a flow you ran)
- **Unfakeable details** you expect to capture (numbers, scars, failed attempts)
- **Earned ladder** (optional): ordered rungs you will personally verify; failed rungs become scars or get cut — never padded with “in theory”
- **Secondhand sources**: what you may cite vs what you must reproduce

### 8. Scope

- **In:** techniques, tools, modes, platforms
- **Out:** explicit non-goals (keeps the draft honest)
- **Mention-only:** things named in prose without a live PoC (e.g. reverse shell one-line swap)

### 9. Strongest objection

Name the counter that would nag a smart skeptic. Give it its best form. Then: bounded concede, or refute. No hedge (“YMMV”).

### 10. Payoff

The concrete action or control the reader walks away with (settings snippet, checklist, habit). Must not contradict the thesis.

### 11. Open questions

Unresolved decisions. A PRD with open questions in load-bearing fields cannot be `locked`.

---

## Optional fields

Use when they change decisions; skip when empty.

- **Working titles** (2–3 options)
- **Tone constraints** (funny / deadpan / angry — only if it affects word choice)
- **Component bets** (which load-bearing visuals are non-negotiable)
- **Lab / safety rules** (for security or destructive demos)
- **Distribution notes** (public PoC repo, disclosure, credits)
- **Decision log** (dated bullets of what flipped during the grill)

---

## Quality bar to lock

Before flipping `status: locked`, all must be true:

- [ ] Thesis is one sentence and contestable
- [ ] Intent IS / is NOT are both filled
- [ ] Evidence plan names at least one artifact you will produce or already have
- [ ] Scope Out is non-empty (forces exclusion)
- [ ] Strongest objection is named with a real response
- [ ] No open questions remain in fields 2–10
- [ ] Byline test: a generic “AI skills are risky” post could not satisfy this PRD unchanged

---

## File layout

```
docs/
  BLOG-PRD.md                 ← this standard
  BLOG-SCOPE.md               ← writing philosophy + MDX + verification
  blog-prds/
    _TEMPLATE.md              ← copy me
    <slug>.md                 ← one filled PRD per post
    examples/                 ← optional reference PRDs
```

Copy the template:

```bash
cp docs/blog-prds/_TEMPLATE.md docs/blog-prds/your-slug.md
```

---

## Relationship to drafting

1. **blog-prd** skill grills you and writes/updates `docs/blog-prds/<slug>.md`
2. Author locks it
3. **blog-writer** skill reads the locked PRD + BLOG-SCOPE, then drafts MDX section by section
4. Pre-publish verification still runs from BLOG-SCOPE; the PRD is the intent check (“did we write the post we locked?”)

---

## Anti-patterns

- Locking a PRD that is really an outline of sections with no thesis
- “Thesis” that is a topic label
- Evidence plan that is only “I’ll explain the concept”
- Scope that includes everything interesting you might mention
- Payoff that is pure diligence (“just be careful”) when the thesis says structural controls matter
- Drafting MDX in parallel with an unresolved thesis “to find the angle” — that’s exploration notes, not a PRD
