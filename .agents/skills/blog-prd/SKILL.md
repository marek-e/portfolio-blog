---
name: blog-prd
description: |
  Grills Marek into a locked Blog PRD (per-post decision record) before any MDX drafting.
  Use when starting a new blog post, refining intent/thesis, stress-testing a post idea,
  or when the user says "blog PRD", "grill this post", "lock the brief", or is unsure what
  the post is arguing. Also use proactively before blog-writer if no locked PRD exists
  for the slug. Writes docs/blog-prds/<slug>.md. Does not draft the post body.
---

# Blog PRD

Interview relentlessly until the Blog PRD is lockable. One question at a time. For every question, give your recommended answer. Explore the repo instead of asking when the answer is already there (related posts, existing drafts, prior PRDs).

## Ground truth (read first)

1. [docs/BLOG-PRD.md](../../../docs/BLOG-PRD.md) — schema, lifecycle, lock bar
2. [docs/BLOG-SCOPE.md](../../../docs/BLOG-SCOPE.md) — north star (earned insight density); do not re-litigate style here
3. [docs/blog-prds/_TEMPLATE.md](../../../docs/blog-prds/_TEMPLATE.md) — output shape
4. Optional: [docs/blog-prds/examples/](../../../docs/blog-prds/examples/) — filled reference

If a PRD already exists for the slug, read it and grill only the unlocked / contradictory fields.

## Hard rules

- **Do not draft MDX** (`src/content/blog/**`) in this skill. Output is the PRD file only.
- **Do not lock** (`status: locked`) without an explicit author “lock it” / “I agree” on the final summary.
- **One contestable thesis.** If the user glues two claims with “and”, force a split.
- **Earn it or cut it.** If the evidence plan is “explain the concept,” push for an artifact or mark the post as off the north star deliberately.
- **No em dashes** in PRD prose you write.
- Prefer the user’s words for thesis/intent when they nail it; don’t sanitize voice out of the PRD.

## Workflow

### 0. Bootstrap

- Infer topic from the conversation. Ask for a working slug only if missing.
- Create or open `docs/blog-prds/<slug>.md` from the template (`status: grilling`).
- Skim related posts / drafts if referenced.

### 1. Grill (decision tree)

Walk branches in dependency order. Skip a branch only if the user already locked it clearly in-thread. Question bank (detail + good recommendations): [references/question-bank.md](references/question-bank.md).

Default order:

1. **Thesis** — one contestable sentence (split dual claims)
2. **Intent** — IS / is NOT (especially “not a summary of …”)
3. **Unifying shape** — if they want two angles (e.g. camouflage + mechanism), force one thesis that requires both
4. **Evidence / finale** — what “done proving” means; earned ladder vs single path
5. **Scope** — in / out / mention-only; agents vs skills-only when relevant
6. **Audience** — for / willing to lose
7. **Takeaways ranked** — must follow from thesis; diligence vs structural controls
8. **Objection** — strongest skeptic counter + bounded response
9. **Payoff** — concrete control or action
10. **Meta** — languages, related posts, working title, lab rules

After each answer: update the in-progress PRD (mentally or on disk), note contradictions, ask the next blocking question.

### 2. Reflect

When fields 1–10 in BLOG-PRD are filled, pause drafting questions and:

1. Paste a **Locked brief** (compact bullet summary of every required field)
2. List remaining tensions explicitly (“you want X and Y; they pull apart because …”)
3. Run the lock checklist from BLOG-PRD.md aloud
4. Ask: lock, or reopen which field?

### 3. Write the file

On lock approval:

1. Write `docs/blog-prds/<slug>.md` fully from the template
2. Set `status: locked` and today’s `updated` date
3. Append a short **Decision log** of flips during the grill
4. Point the user to **blog-writer** for MDX (PRD is now the contract)

If they want to keep grilling, set `status: draft` and leave open questions checked.

## Tone of the grill

- Casual, terse, expert-to-expert (same bar as Marek’s writing voice)
- Challenge soft theses and “topic” labels
- Steelman before you recommend
- Recommend concretely (A/B/C with a pick), don’t dump open questionnaires
- One question per turn — never a form

## Done means

- PRD file on disk
- Status `locked` only with explicit consent
- Author knows: next step is evidence (if ladder) or `blog-writer`, not more vibes
