<p align="center">
  <a href="https://melmayan.fr">
    <img src="src/assets/logo.svg" alt="melmayan.fr logo" width="140" />
  </a>
</p>

<h1 align="center">melmayan.fr</h1>

<p align="center">
  Personal portfolio & blog, built with <a href="https://astro.build">Astro</a>, React islands, and Tailwind CSS. Deployed on Cloudflare Pages.
</p>

## Getting Started

```bash
pnpm install
pnpm dev
```

The site runs at `localhost:4321`. Build for production with `pnpm build`.

## Environment Variables

Create a `.env` file at the root with the following variables:

| Variable               | Description                | Required |
| ---------------------- | -------------------------- | -------- |
| `STRAVA_CLIENT_ID`     | Strava API client ID       | Optional |
| `STRAVA_CLIENT_SECRET` | Strava API client secret   | Optional |
| `STRAVA_REFRESH_TOKEN` | Strava OAuth refresh token | Optional |

> **Note:** Strava integration is optional. The site builds fine without it—running stats section will just be empty.

## Documentation

- [Development](docs/DEVELOPMENT.md) — commands, environment variables, project structure
- [Design Spec](docs/DESIGN-SPEC.md) — goals, principles, and content guidelines
- [Astro + React](docs/ASTRO-REACT.md) — island architecture, hydration, MDX patterns
- [Styling](docs/STYLING.md) — Tailwind, theme colors, responsive design
- [Components](docs/COMPONENTS.md) — shadcn/ui usage, custom components
- [Content](docs/CONTENT.md) — content collections, frontmatter schemas
