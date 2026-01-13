import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    featured: z.boolean().default(false),
    techStack: z.array(z.string()),
    role: z.string().optional(),
    links: z
      .object({
        demo: z.string().url().optional(),
        repo: z.string().url().optional(),
      })
      .optional(),
    image: z.string(),
    imageAlt: z.string().optional(),
    objectFit: z.enum(['cover', 'contain', 'fill', 'none', 'scale-down']).default('contain'),
    publishDate: z.coerce.date(),
    // Optional fields for richer detail pages
    status: z.enum(['completed', 'in-progress', 'archived', 'concept']).default('completed'),
    duration: z.string().optional(),
    team: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    lessons: z.array(z.string()).optional(),
    gallery: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
          caption: z.string().optional(),
        })
      )
      .optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, blog };
