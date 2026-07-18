# Development

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

## Environment Variables

See the [README](../README.md#environment-variables) for the required `.env` variables (Strava integration, optional).

## Commands

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | Start dev server at `localhost:4321` |
| `pnpm build`        | Build production site to `./dist/`   |
| `pnpm preview`      | Preview production build locally     |
| `pnpm lint`         | Run ESLint                           |
| `pnpm lint:fix`     | Run ESLint with auto-fix             |
| `pnpm format`       | Format code with Prettier            |
| `pnpm format:check` | Check code formatting                |

## Project Structure

```
src/
├── components/
│   ├── astro/      # Astro components
│   ├── react/      # React islands
│   ├── mdx/        # MDX components
│   └── ui/         # shadcn/ui components
├── content/
│   ├── blog/       # Blog posts (en/fr)
│   └── projects/   # Project writeups (en/fr)
├── i18n/           # Internationalization (fr/en)
├── layouts/        # Page layouts
├── lib/            # Utility functions
├── pages/          # File-based routing
└── styles/         # Global CSS
```
