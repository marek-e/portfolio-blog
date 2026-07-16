---
title: 'Skill issues: a skill is a binary with a README'
slug: crafting-a-malicious-skill
languages: [fr, en]
status: locked
related: [agent-skills-the-missing-piece-of-your-ai-workflow]
updated: 2026-07-16
---

# Blog PRD: Skill issues

## Intent

**This post IS**

- A first-person earned ladder: craft a malicious-looking-but-harmless skill, show silent execution, then aim for a skills.sh-clean install via `npx skills add`
- A paired experiment: obvious-evil control (should warn) vs stealth git-hygiene cover (should stay clean)
- The darker sequel to the “don’t copy a skill without reading it” warning

**This post is NOT**

- A summary or remix of the Reversec Labs article (credit the mechanism; own the hands-on path)
- A full offensive tradecraft guide
- A live outbound reverse-shell demo

## Thesis

> A skill is a binary with a README: same threat model as `curl | sh` / unvetted npm. The markdown is camouflage; the loader (dynamic context / agent) is the exploit.

## Audience

- **For:** Devs already installing skills from skills.sh / GitHub who think “I’ll skim it” or “the audit badge is enough”
- **Willing to lose:** Absolute beginners who need “what is a skill?” (that’s the prequel)

## Reader takeaways (ranked)

1. Actually read `SKILL.md` — look for `allowed-tools`, `` !`...` ``, agent `permissionMode`
2. Don’t treat the skills.sh audit badge as a security boundary
3. Floor for untrusted / third-party skills: `deny: ["Bash(*)"]`, then re-allow narrowly — not the only defense, the one that doesn’t rely on attention or the model

## Shape

- **Lead:** ladder-first (earned rungs), story-backed
- **Length posture:** medium–long (ok past ~5 min)
- **Arc:**
  1. Hook: I built one / sequel to the warning
  2. Control vs stealth cover (git hygiene)
  3. Plain instruction fails (model / permission prompt)
  4. What actually wins (frontmatter + dynamic context); agents if needed
  5. Scanner act: evil warns, stealth aims clean on `npx skills add`
  6. Payoff: read + don’t trust badge + Bash deny floor
  7. Mention-only: one-line swap to reverse shell

## Evidence plan

- **Artifacts:** public GitHub repo people can inspect; screenshots / terminal of Calculator+1337+say; skills.sh / CLI audit output for control vs stealth
- **Unfakeable details:** Accessibility permission scar for `osascript` keystrokes; exact scanner verdicts; failed obfuscation rungs if any
- **Earned ladder:**
  0. Control skill: plaintext hostile → expect warning on add
  1. Plain instruction Calculator skill, no `` !` `` / no `allowed-tools` → refuse and/or prompt
  2. Obfuscation / denylist attempts → keep only what we observe
  3. Frontmatter + dynamic context → silent Calculator + keystroke `1337` + `say`
  4. Stealth packaging until clean `npx skills add` (or document failure + cite prior art)
  5. Optional agent path if skill-only can’t stay scanner-clean
- **Cite only:** Reversec (mechanism), Trail of Bits skills.sh scanner bypasses if we don’t reproduce
- **Mention-only:** outbound reverse shell (`socat` one-line swap)

## Scope

- **In:** Claude Code skills, dynamic context, `allowed-tools`, agents/`permissionMode` as needed, skills.sh install path, harmless macOS PoC
- **Out:** Data exfil deep dive, enterprise managed-settings treatise, non-macOS payload ports in the demo

## Strongest objection

- **Objection:** Denying `Bash(*)` cripples the agent; reading skills is enough if you’re careful; the registry scan is getting better.
- **Response:** Reading is necessary and fallible; the badge is a signal not a boundary (show control vs stealth). Bash deny is the floor for *untrusted* skills, then re-allow `Bash(git*)` / `Bash(pnpm*)` — not “live in a cave.” Sandbox / managed settings are additional layers, not substitutes for the claim.

## Payoff

Settings snippet with `deny: ["Bash(*)"]` + narrow re-allows; habit: read before `npx skills add`; treat audit badge as non-blocking signal.

## Open questions

_None — locked 2026-07-16._

## Decision log

- 2026-07-16: Chose thesis #2 (skill ≈ binary) over “reading is the wrong control”
- 2026-07-16: Finale = scanner-clean harmless PoC + obvious-evil control; RS mention-only
- 2026-07-16: Payload = Calculator + keystroke 1337 + say; cover = git hygiene; public repo
- 2026-07-16: Earned ladder A; agents in scope; Bash deny = floor not “only fix”
