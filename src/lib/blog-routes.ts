import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export type BlogPostRoute = {
  params: {
    lang: 'en' | undefined;
    slug: string;
  };
  props: {
    post: BlogPost;
  };
};

/**
 * One route per blog post path, and the post that serves it.
 *
 * English lives under a prefix, at /en/blog/<slug>/. The default locale is
 * unprefixed, and the post behind it is picked explicitly — French where it
 * exists, English as a fallback for an untranslated post — rather than pushing
 * both translations at the same path and letting Astro drop one by collection
 * order. Every generator hanging off a post path builds on this, so the page,
 * its OG card and its markdown never disagree about which post they describe.
 */
export async function getBlogPostRoutes(): Promise<BlogPostRoute[]> {
  const posts = await getCollection('blog');
  const bySlug = (lang: string) =>
    new Map(
      posts
        .filter((post) => post.id.startsWith(`${lang}/`))
        .map((post) => [post.id.split('/')[1], post])
    );

  const englishPosts = bySlug('en');
  const frenchPosts = bySlug('fr');
  const routes: BlogPostRoute[] = [];

  englishPosts.forEach((post, slug) => {
    routes.push({ params: { lang: 'en', slug }, props: { post } });
  });

  new Set([...frenchPosts.keys(), ...englishPosts.keys()]).forEach((slug) => {
    const post = frenchPosts.get(slug) ?? englishPosts.get(slug)!;
    routes.push({ params: { lang: undefined, slug }, props: { post } });
  });

  return routes;
}
