# 🔥 Developer Portfolio + Blog (Astro + React)

Personal portfolio website built with Astro, React, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
pnpm install
```

### Environment Variables

Create a `.env` file at the root with the following variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `STRAVA_CLIENT_ID` | Strava API client ID | Optional |
| `STRAVA_CLIENT_SECRET` | Strava API client secret | Optional |
| `STRAVA_REFRESH_TOKEN` | Strava OAuth refresh token | Optional |

> **Note:** Strava integration is optional. The site builds fine without it—running stats section will just be empty.

### Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server at `localhost:4321` |
| `pnpm build` | Build production site to `./dist/` |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Run ESLint with auto-fix |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check code formatting |

### Project Structure

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

---

## Design Spec

### Goal
Create a personal portfolio that proves real competence, shows enthusiasm, and tells a memorable technical story.

**Audience priority:**
1. HR (30–60s scan): clarity, competence, fit
2. Developers: depth, problem-solving, humility, growth

### Core Principles

- Content > effects
- Depth > breadth
- Static-first, JS only where it adds value
- Motion must improve comprehension, not distract
- Accessibility is mandatory, not optional

### Tech Stack

- Framework: Astro (static-first)
- UI: React used only for interactive islands
- Content: Astro Content Collections + MD/MDX
- Animations: CSS first, then Framer Motion / GSAP if needed
- Game module: client-only React + Canvas (Phaser recommended)
- Hosting: Static hosting (Cloudflare Pages recommended)
- Custom domain enabled

### Site Structure

#### Homepage

- About Me
  - Conversational, human, specific
  - Personal anecdotes, motivation, background
  - No corporate speak, no bragging
- Featured Projects
  - 2–5 max
  - Each links to its own Project Detail page
- Contact
  - Email or form (not only socials)
- Optional portrait/photo

#### Projects Section

Two modes (user-toggle):

**Mode A — Default (Lightweight, SEO-first)**

- Grid or list
- Fast, scannable
- Filters/search allowed
- Mandatory deep links to project detail pages
- This is the primary hiring surface

**Mode B — 2D Exploration (Opt-in)**

- Separate toggle: “Explore in 2D”
- Heavy JS loaded ONLY after user opts in
- Treat as a delight / easter egg, never required
- Keyboard accessible + clear controls
- Always-visible exit + “switch to list view”
- If prefers-reduced-motion → default to Mode A
- Project pages still exist separately and are indexable

### Animation Guidelines

**Allowed / Recommended:**

- Subtle entrance sequencing (hero, cards)
- Micro-interactions (hover, focus, button feedback)
- Scroll reveal ONLY below the fold
- ONE signature flourish max (parallax shape, animated accent)

**Forbidden:**

- Full-page constant motion
- Heavy parallax everywhere
- Large motion distances or bouncy easing
- Motion that blocks reading or navigation
- Skill bars, percentages, gimmicks

**Accessibility:**

- Respect prefers-reduced-motion (disable non-essential motion)
- Keyboard navigable everywhere
- Clear focus states
- No auto-scrolling or disorienting motion

### Project Selection Rules

**Include projects that show:**

- Real problems solved
- Shipped work (even small audience)
- Open-source with clearly stated role
- Initiative, autonomy, creativity

**Avoid:**

- Tutorial-only projects
- Confidential work
- Non-dev projects (put in About)
- Listing the portfolio itself unless it has deep technical value

**Quantity:**

- Ideal: 2–5 projects
- If only 1: add a small second or a WIP with disclaimer

### Project Detail Page Template

Each project MUST include:

**1. Introduction**

- What it is
- Key features
- Your role
- Tech stack
- Links (repo/demo, low priority)

**2. Purpose & Goal**

- Why you built it
- Problem it solves
- Initial design intent

**3. Spotlight (Core)**

- Hardest / most interesting technical problem
- Constraints and trade-offs
- How you solved it
- Deep technical explanation (for dev reviewers)

**4. Current Status** (optional)

- Usage, feedback, impact

**5. Lessons Learned**

- Technical lessons
- Non-technical lessons
- Accessibility considerations
- How it shaped later decisions

**6. Visuals**

- Screenshots placed to support the story
- Diagrams/sketches encouraged

**Style:**

- Short paragraphs
- Headings + bullet points
- Highly scannable
- Story-driven, not academic

### Blog

- MD/MDX
- Minimal animation
- Readability first
- RSS + sitemap enabled

### Design Guidelines

- Clean, modern, trustworthy
- Consistent spacing
- Borrow inspiration from multiple sources, never copy one
- Small “sprinkles” only (hover, theme toggle, easter eggs)
- Light/dark mode allowed

### Forbidden Elements

- Skill percentages or charts
- “What I do” service boxes
- Overconfident claims (“expert”, “10x dev”)
- Generic template language
- Long unstructured paragraphs

### Deployment

- Static build output
- Global CDN
- HTTPS enforced
- Custom domain configured
- Heavy JS routes lazy-loaded (projects 2D mode)

### Final Check

The portfolio must:

- Be unique to the developer
- Tell a personal technical story
- Show real problem-solving
- Demonstrate growth and humility
- Be fast, accessible, and memorable
- Avoid all clichés and gimmicks
