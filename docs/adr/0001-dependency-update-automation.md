# 1. Dependency update automation: Renovate over Dependabot

- **Status:** Accepted
- **Date:** 2026-08-16
- **Deciders:** Marek Elmayan (sole maintainer)

## Context

The site has ~50 direct dependencies (`package.json`) across a fast-moving stack: Astro 7, React 19, Tailwind 4, ESLint 10, plus a long tail of rehype/hast/unist utilities. Nothing updates them today; the lockfile drifts until something breaks or a manual `pnpm update` happens.

Three properties of _this_ repo shape the decision:

**It is a static site.** Astro SSG builds to `dist/` and Cloudflare Pages serves the output. There is no server runtime, so almost every dependency is build-time only. A transitive CVE in a rehype plugin is not remotely exploitable the way it would be in an SSR app. This weakens the usual "patch fast, vulnerabilities are burning" framing — the real supply-chain risk here is a **compromised npm release** being pulled into a build, not a long-lived unpatched CVE.

**There is one maintainer.** The cost that matters is attention, not response time. With ~50 direct deps, an ungrouped daily bot produces enough PRs to be ignored — and an ignored bot is worse than no bot, because it manufactures the appearance of maintenance.

**There is a build check, but nothing is required.** `.github/` does not exist, so there is no GitHub Actions CI — but Cloudflare Pages' Git integration already builds every pull request and reports a `Cloudflare Pages` check run. So a bump that breaks the build is visible today. Two real gaps remain: that check covers `astro build` but not lint, and — more importantly — `allow_auto_merge` is `false` with no branch protection on `main`, so no check is actually _required_. This is the binding constraint on the whole decision: automerging is only safe if something waits for that check rather than merging past it.

Secondary facts: package manager is pnpm 9.15 with `lockfileVersion: 9.0`, single package (no workspace, no catalogs); Node is pinned in both `.node-version` and `engines.node`.

## Decision drivers

1. **PR noise control** — grouping and scheduling must be good enough that the bot stays readable for one person.
2. **Automerge for the safe majority** — patch/minor bumps of build tooling should land without a human, or the attention cost is unchanged.
3. **Protection against malicious releases** — ability to delay adoption of brand-new versions.
4. **Setup and moving parts** — how much config and infrastructure this adds to a personal site.
5. **Framework majors stay manual** — Astro/React/Tailwind majors must never automerge.

## Decision

**Adopt Renovate** (the Mend-hosted GitHub App) for version-update PRs, and **keep Dependabot alerts enabled** for vulnerability reporting.

Two things are part of this decision rather than preconditions to be satisfied later:

1. **A `lint` workflow** (`.github/workflows/ci.yml`) running `pnpm lint` and `pnpm format:check` on pull requests. The build is deliberately not duplicated — Cloudflare Pages already covers it — so this exists purely to close the lint gap, which is exactly where an ESLint or Prettier bump would break things.
2. **`platformAutomerge: false`.** Because `main` has no branch protection, GitHub's native auto-merge would merge immediately rather than waiting on a check that is not required. With platform automerge disabled, Renovate itself waits for `Cloudflare Pages` and `lint` to go green and then merges via the API. This is what makes automerge safe here without imposing branch protection on a solo maintainer's own workflow.

Shape of the configuration (see `renovate.json`):

- Extend `config:best-practices`, which enables the Dependency Dashboard — a single issue listing every pending, open, and errored update. For a solo maintainer this is the feature that makes the difference: one place to look instead of a PR list to triage.
- `minimumReleaseAge: "14 days"` on anything that automerges, so a compromised release has time to be pulled from the registry before it reaches a build. Given that the security exposure here is supply-chain rather than CVE, this matters more than update latency.
- Group the dev-tooling tail (eslint/prettier/types/rehype/hast/unist) into one PR; automerge patch and minor.
- Astro, React, Tailwind and any major: separate PRs, no automerge, reviewed by hand.
- Weekly schedule rather than daily.

## Consequences

**Positive**

- Automerge is native config, not infrastructure — no bespoke merge workflow to maintain, and no branch protection imposed on the maintainer's own pushes.
- The Dependency Dashboard collapses triage to one issue, which suits low-frequency attention better than a PR queue.
- One config file (`renovate.json`) covers npm, GitHub Actions and `.node-version` (the `nodenv` manager, on by default) under a single set of grouping and scheduling rules. Dependabot also covers npm and GitHub Actions, so this is a convenience rather than a decisive gap.
- The new `lint` workflow closes a pre-existing gap that has nothing to do with the bot: until now nothing checked lint or formatting on a pull request, only the build.

**Negative**

- Renovate's configuration surface is large and easy to get subtly wrong; a misgrouped rule can automerge more than intended. Mitigated by starting with `config:best-practices` and adding narrow rules only as needed.
- It requires installing a third-party GitHub App with write access to the repo. That is itself a supply-chain surface, and a real one to weigh against Dependabot being first-party.
- Renovate reads GitHub's vulnerability alerts too, so running both PR-openers would duplicate work. This is an either/or for PRs — alerts stay on regardless of which tool is chosen.
- `minimumReleaseAge: 14 days` deliberately trades update latency for safety. Fine for a static site; it would be the wrong default for a service.

**If automerge is deliberately turned off**, this decision should be revisited rather than partially applied. Renovate without automerge is mostly Dependabot with more configuration — and in a manual-review world Dependabot is the better fit, because reviewing every PR by hand does not need the machinery that justifies Renovate here. (Dropping just the `lint` workflow is a lesser matter: automerge would still gate correctly on the Cloudflare Pages check, only without lint coverage.)

## Alternatives considered

### Dependabot

Rejected, but the gap is much narrower than it once was, and several claims commonly made against it are now out of date:

- **Grouping** is supported via `groups`, including `multi-ecosystem-groups`.
- **Cooldown** is supported, with per-semver-tier granularity (`semver-major-days`, `semver-minor-days`, `semver-patch-days`) — a finer-grained equivalent of Renovate's `minimumReleaseAge`.
- **pnpm** is supported, and the `lockfileVersion: 9.0` parsing failure ([dependabot-core#9522](https://github.com/dependabot/dependabot-core/issues/9522)) is **closed and fixed**. The pnpm issues still open concern workspace catalogs, which this single-package repo does not use. pnpm support is therefore _not_ a reason to reject Dependabot here.

What remains genuinely different:

- **No native automerge.** Merging requires a separate GitHub Actions workflow combining `dependabot/fetch-metadata` with `gh pr merge --auto`. That is a second moving part to write and maintain, and the place where the decision actually turns.
- **No dependency dashboard equivalent.** Triage happens in the PR list.

Its real advantages — first-party, no third-party app to install, zero infrastructure — are the reason it stays the recommended fallback if automerge is ever abandoned.

### Both tools together

Rejected. Renovate consumes GitHub's vulnerability alerts as well, so running both PR-openers produces duplicate and occasionally conflicting PRs against the same lockfile. The one combination that _is_ coherent — and the one chosen — is Dependabot **alerts** (a repository setting, independent of any config file) alongside a single tool opening PRs.

### Manual `pnpm update` on a schedule

Rejected. It is what happens today, and it does not happen. It also provides no signal about a compromised release and no per-dependency changelog trail.

### Nothing / pin everything

Rejected. Deferred updates on a stack moving as fast as Astro and Tailwind convert into painful multi-major migrations, which is exactly the situation that most risks breaking a site nobody is watching closely.

## Notes

Capability claims above were verified against GitHub and Renovate documentation on 2026-08-16. Both tools are free for this repository; cost was not a factor.
