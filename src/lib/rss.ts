import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import type { Lang } from '@/i18n/config';

const RSS_CONFIGS: Record<Lang, { title: string; description: string }> = {
  fr: {
    title: 'Blog - Marek Elmayan',
    description:
      "Articles techniques sur le développement web, le code, l'UX, la cybersécurité et l'IA",
  },
  en: {
    title: 'Blog - Marek Elmayan',
    description: 'Technical articles about web development, coding, UX, cybersecurity and AI',
  },
};

export async function generateRSSFeed(context: APIContext, lang: Lang) {
  const config = RSS_CONFIGS[lang];
  const allPosts = await getCollection('blog');

  const posts = allPosts
    .filter((post) => post.id.startsWith(`${lang}/`))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());

  const basePath = lang === 'fr' ? '' : `/${lang}`;

  return rss({
    title: config.title,
    description: config.description,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `${basePath}/blog/${post.id.replace(`${lang}/`, '').replace(/\.(md|mdx)$/, '')}`,
      categories: post.data.tags,
    })),
    customData: `<language>${lang}</language>
<author>melmayan.dev@gmail.com (Marek Elmayan)</author>`,
  });
}
