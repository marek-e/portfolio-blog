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
