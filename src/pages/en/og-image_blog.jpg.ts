import { generateSiteOgImage } from '@/lib/og-image';

export async function GET() {
  const jpegBuffer = await generateSiteOgImage({ lang: 'en', page: 'blog' });

  return new Response(new Uint8Array(jpegBuffer), {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
