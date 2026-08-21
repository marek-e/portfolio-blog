import { getCollection } from 'astro:content';
import type { APIContext, GetStaticPaths } from 'astro';
import { postToMarkdown } from '@/lib/post-markdown';
import { defaultLang } from '@/i18n';

type BlogPost = Awaited<ReturnType<typeof getCollection<'blog'>>>[number];

type StaticPaths = {
  params: {
    lang: 'en' | undefined;
    slug: string;
  };
  props: {
    post: BlogPost;
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog');
  const staticPaths: StaticPaths[] = [];

  const postsByLang = (lang: string) => posts.filter((post) => post.id.startsWith(`${lang}/`));
  const frenchPosts = postsByLang('fr');

  postsByLang('en').forEach((post) => {
    staticPaths.push({ params: { lang: 'en', slug: post.id.split('/')[1] }, props: { post } });
  });

  // The default locale is unprefixed. Unlike the sibling routes, which push both
  // translations at the same path and let Astro drop one, the French post is
  // picked explicitly and English is only a fallback for untranslated posts —
  // so this file's markdown always matches the HTML served at the same slug.
  const translatedSlugs = new Set(frenchPosts.map((post) => post.id.split('/')[1]));
  const defaultLocalePosts = [
    ...frenchPosts,
    ...postsByLang('en').filter((post) => !translatedSlugs.has(post.id.split('/')[1])),
  ];

  defaultLocalePosts.forEach((post) => {
    staticPaths.push({ params: { lang: undefined, slug: post.id.split('/')[1] }, props: { post } });
  });

  return staticPaths;
};

type Props = {
  post: BlogPost;
};

export async function GET({ props, params, site }: APIContext & { props: Props }) {
  const { post } = props;
  const lang = params.lang === 'en' ? 'en' : defaultLang;
  const slug = post.id.split('/').pop();
  const url = new URL(lang === 'en' ? `/en/blog/${slug}/` : `/blog/${slug}/`, site).toString();

  const markdown = postToMarkdown(post, { url, lang });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}
