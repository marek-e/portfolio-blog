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
  const bySlug = (lang: string) =>
    new Map(
      posts
        .filter((post) => post.id.startsWith(`${lang}/`))
        .map((post) => [post.id.split('/')[1], post])
    );

  const englishPosts = bySlug('en');
  const frenchPosts = bySlug('fr');
  const routes: StaticPaths[] = [];

  englishPosts.forEach((post, slug) => {
    routes.push({ params: { lang: 'en', slug }, props: { post } });
  });

  // The default locale is unprefixed. Unlike the sibling routes, which push both
  // translations at the same path and let Astro drop one, the post serving the
  // route is chosen explicitly — French where it exists, English as a fallback
  // for untranslated posts — so the markdown always matches the HTML there.
  new Set([...frenchPosts.keys(), ...englishPosts.keys()]).forEach((slug) => {
    const post = frenchPosts.get(slug) ?? englishPosts.get(slug)!;
    routes.push({ params: { lang: undefined, slug }, props: { post } });
  });

  // Opting out drops the file entirely, so a post's prose is not left sitting at
  // a public URL once the header action is taken away. This is filtered after the
  // route's post is resolved: opting out of a translation must not promote the
  // other language into its slot.
  return routes.filter((route) => route.props.post.data.copyMarkdown);
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
