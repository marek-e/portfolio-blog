import { generateOgImage } from '@/lib/og-image';
import { getBlogPostRoutes, type BlogPost } from '@/lib/blog-routes';
import type { GetStaticPaths } from 'astro';

export const getStaticPaths: GetStaticPaths = async () => getBlogPostRoutes();

type Props = {
  post: BlogPost;
};

export async function GET({ props }: { props: Props }) {
  const { post } = props;

  const jpegBuffer = await generateOgImage(post);

  return new Response(new Uint8Array(jpegBuffer), {
    // No Cache-Control here: the card is prerendered at build time, so Pages
    // serves it as a static asset and public/_headers owns its cache policy.
    headers: {
      'Content-Type': 'image/jpeg',
    },
  });
}
