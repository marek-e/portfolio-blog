import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.toString().replace(/\/$/, '') ?? 'https://melmayan.fr';

  const allBlogPosts = await getCollection('blog');
  const enPosts = allBlogPosts
    .filter((post) => post.id.startsWith('en/') && !post.data.draft)
    .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());

  const allProjects = await getCollection('projects');
  const enProjects = allProjects.filter((p) => p.id.startsWith('en/'));

  const blogLines = enPosts
    .map((post) => {
      const slug = post.id.replace('en/', '').replace(/\.(md|mdx)$/, '');
      return `- [${post.data.title}](${baseUrl}/en/blog/${slug}/): ${post.data.description}`;
    })
    .join('\n');

  const projectLines = enProjects
    .map((p) => {
      const slug = p.id.replace('en/', '').replace(/\.(md|mdx)$/, '');
      return `- [${p.data.title}](${baseUrl}/en/projects/${slug}/): ${p.data.description}`;
    })
    .join('\n');

  const content = `# Marek Elmayan

> Portfolio and technical blog of Marek Elmayan, full-stack software engineer.
> Specializations: web development, UX, cybersecurity, AI, and developer experience (DevX).
> Contact: melmayan.dev@gmail.com

## Blog

${blogLines}

## Projects

${projectLines}

## Pages

- [Portfolio](${baseUrl}/en/): Main portfolio — skills, running, open-source projects
- [Contact](${baseUrl}/en/contact/): Get in touch
- [CV/Resume](${baseUrl}/en/curriculum-vitae/): Full professional resume
- [RSS Feed](${baseUrl}/en/rss.xml): Subscribe to blog updates
- [Blog index](${baseUrl}/en/blog/): All blog posts
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
