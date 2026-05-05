# astro-perso-website

## What this codebase does

Personal portfolio and bilingual (fr/en) blog at melmayan.fr. Astro SSG deployed to Cloudflare Pages — all pages are statically generated at build time; there is no runtime server, no user accounts, no sessions. React 19 is used for interactive islands only. Blog posts are MDX files in `src/content/blog/{lang}/`. The only runtime-adjacent code is Cloudflare Pages edge handling of static assets.

## Auth shape

There is no user authentication. The only credentials in the codebase are Strava API secrets consumed exclusively at build time:

- `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `STRAVA_REFRESH_TOKEN` — env vars read in `src/lib/strava.ts` via `import.meta.env`
- `getAccessToken()` / `refreshAccessToken()` — build-time helpers, result is never emitted into the built bundle
- No auth middleware, no session cookies, no protected routes

## Threat model

The primary risk is build-time secret leakage: if Strava credentials or other `import.meta.env` values are accidentally serialized into emitted JS bundles, they become public. Secondary risk is content injection via MDX — the site renders author-controlled MDX, but if a third-party MDX source were ever added it could embed arbitrary JSX. Supply-chain compromise of npm packages is the most realistic runtime threat given the static deployment model.

## Project-specific patterns to flag

- **`import.meta.env` secrets in output** — check that `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `STRAVA_REFRESH_TOKEN` never appear in `dist/` build artifacts or client-side JS bundles
- **`set:html` usage** — used in `src/pages/[...lang]/blog/[slug].astro` for JSON-LD structured data; flag if the value ever derives from user-supplied input rather than content collection frontmatter
- **Build-time external fetches** — `src/lib/og-image.tsx` fetches fonts from `cdn.jsdelivr.net` and `melmayan.fr`; flag any new `fetch()` at build time whose URL is parameterized
- **MDX component props** — `src/components/mdx/` components (`Callout`, `Highlight`, `Mermaid`, `Link`) receive props from blog MDX; flag if `dangerouslySetInnerHTML` or raw HTML injection is added
- **Hardcoded athlete ID** — `STRAVA_ATHLETE_ID = '73173630'` in `strava.ts` is intentionally public, not a secret

## Known false positives

- `set:html` in `[slug].astro` (JSON-LD block) — content is from Astro content collections, fully author-controlled, no user input path
- `fetch()` calls in `strava.ts` and `og-image.tsx` — build-time only, all URLs are hardcoded constants
- `melmayan.dev@gmail.com` in `src/lib/rss.ts` RSS feed — intentional public contact address
- Draft posts rendered in dev (`draft: true` frontmatter) — `generateRSSFeed` filters them out; dev visibility is intentional per codebase design
