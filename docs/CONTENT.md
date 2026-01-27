# Content Collections

Content lives in `src/content/` with Zod schema validation in `content.config.ts`.

## Project Frontmatter

```yaml
---
title: 'Project Name'
description: 'One-line description'
featured: true
techStack: ['Astro', 'React', 'TypeScript']
role: 'Full-stack Developer'
links:
  demo: 'https://example.com'
  repo: 'https://github.com/user/repo'
image: './project-screenshot.png'
publishDate: 2024-01-15
---
```

## Blog Frontmatter

```yaml
---
title: 'Blog Post Title'
description: 'Meta description for SEO'
publishDate: 2024-01-15
updatedDate: 2024-01-20
tags: ['astro', 'react', 'tutorial']
draft: false
---
```

## File Naming

- Content files: `kebab-case.md` (e.g., `my-project.md`)
- Images: Place in same directory, reference with `./`

## Data Flow

```
src/content/projects/*.md
         ↓
   Zod schema validation (content.config.ts)
         ↓
   Type-safe getCollection('projects')
         ↓
   Rendered in Astro pages
```
