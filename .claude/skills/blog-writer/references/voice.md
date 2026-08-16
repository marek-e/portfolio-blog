# Marek's Voice — calibrated from a real rewrite

In July 2026 Marek rewrote most of the skill-drafted clickjacking post by hand. The draft followed the BLOG-SCOPE principles and still missed his voice. This file records the exact deltas so future drafts start where his rewrite ended.

The core diagnosis: **the draft read like a copywriter, Marek writes like a teacher giving a talk.** Punchy cadence, dramatic fragments, and clever headings are the failure mode, even when each sentence is individually "good". When BLOG-SCOPE's "punchy" guidance conflicts with the rules below, these win: they are his actual hand.

## 1. One hook, then drop the act

One punchy opening line is enough. Immediately after it, switch to plain explanation. Never stack rhetorical effects.

Draft:

> That's clickjacking — a UI attack so simple it fits in a `<style>` block, so effective it has been hitting production apps since 2008, and so misunderstood that most teams think "we have CSRF tokens" covers it. It doesn't.

Marek's rewrite:

> That's `<Highlight>`clickjacking`</Highlight>`, a UI attack so simple it fits in a `<style>` block.

He kept the first clause and deleted the escalating triplet. Other cuts of the same kind:

- Staccato fragments: "No malware. No network anomaly. No server-side trace" (deleted whole paragraph)
- Dramatic kickers: "The target button is live. One click away." (deleted)
- Urgency: "Scan your app's response headers **tonight**" (kept the advice, cut the "tonight")
- Sales phrasing: "has copy-paste configs for every major stack" became "is a good resource to dive a bit deeper into the topic"

## 2. Explain like a teacher, to "you"

After the hook, the draft jumped straight to the attack mechanics. Marek inserted three plain paragraphs first:

> The principle is quite simple: its to **trick the user into clicking something different from what they perceive** they are clicking [...]
>
> You are probably wondering **why do victims fall for this?** That's because nowadays it is very common to have to accept cookies or dismiss a banner [...]

The pattern: state the principle explicitly in plain words, then anticipate the reader's next question and pose it out loud. Address the reader as "you" (the draft's opening said "Your user thinks..."; his says "You think you are accepting cookies").

## 3. Marek is present in the post

He added, in his own words:

- Why he picked the topic: "I decided to write about it because I find it still interesting since its quite visual which changes from the usual miss-configured server attacks."
- Meta-navigation: "(we will cover them shortly later)", "For this two headers are available."
- Assumed knowledge with a link out: "I will suppose you know what CSP is and how it works. If not, you can read the [MDN documentation] to get started."
- His own artifacts at the end: "I have given a talk about this topic so if you prefer to check the slides, here you can find my [deck]."

Pull these from him during drafting (why this topic? any talk/repo/demo of yours to link?), and leave room for them in the structure.

## 4. Headings: descriptive or question-form, never clever

| Draft (rejected)                                    | Marek's rewrite                             |
| --------------------------------------------------- | ------------------------------------------- |
| Five lines of CSS, one stolen click                 | How Clickjacking works: Five lines of CSS   |
| The double con                                      | How to keep the victim fooled?              |
| Three prerequisites — fix one, the attack collapses | The 3 prerequisites for a successful attack |
| The fix in thirty seconds                           | Takeaways                                   |

Patterns: "How X works", question-form H2s, plain nouns ("The defenses", "Takeaways"), digits over spelled-out numbers. No parallelism jokes, no dash-appended punchlines.

## 5. Structure beats prose

- **3+ facts sharing a shape → table.** He converted the three-CSS-properties bullet list into a Property/Role table and folded the draft's entire explanatory paragraph about `opacity: 0.001` into one table cell.
- **Anything that flows over time → `<Mermaid>` sequence diagram.** He added one for the cookie/iframe session flow, replacing the draft's prose kicker.
- **Categorized lists → colored `<Highlight>` labels.** The draft's `**Social manipulation** — ...` bullets became `<Highlight color="blue">Social manipulation</Highlight>: ...` with a different color per category.
- **Load-bearing phrase of a paragraph → `<strong>`.** He bolds the one clause that carries the point, roughly one per paragraph in explanatory sections.

## 6. Focused depth, linked breadth

He deleted the per-stack config one-liners (Nginx, Django, Spring Security) and the second warning callout about SameSite limits. He added links (MDN, OWASP cheat sheet) where the draft tried to be exhaustive. Don't demonstrate coverage; link it.

## 7. Endings recap the idea

The draft ended by teasing the next post as "the more interesting question". Marek's ending restates the core principle one more time in plain words ("the idea behind them is the same, divert the click from its initial intent to trigger a sensitive action") before pointing forward and linking his talk deck.

## 8. Natural beats polished

His sentences are sometimes loose ("Also means of protection exist and are used but not everyone is really aware of them."), and that is the voice. Do not sand every line to marketing sheen. When choosing between a slick formulation and a plain conversational one, pick plain. Preserve his phrasing when he supplies it; fix only real errors he'd want fixed (spelling, broken MDX), not register.
