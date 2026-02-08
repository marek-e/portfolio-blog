import { getCollection } from 'astro:content';
import { generateOgImage } from '@/lib/og-image';
import type { GetStaticPaths } from 'astro';

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
  posts.forEach((post) => {
    const [lang, slug] = post.id.split('/');

    if (lang === 'en') {
      staticPaths.push({ params: { lang: 'en', slug }, props: { post } });
    }
    staticPaths.push({ params: { lang: undefined, slug }, props: { post } });
  });
  return staticPaths;
};

type Props = {
  post: BlogPost;
};

export async function GET({ props }: { props: Props }) {
  const { post } = props;

  const pngBuffer = await generateOgImage(post);

  return new Response(new Uint8Array(pngBuffer), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
