import { generateSiteOgImage } from '@/lib/og-image';

export async function GET() {
  const pngBuffer = await generateSiteOgImage({ lang: 'en', page: 'blog' });

  return new Response(new Uint8Array(pngBuffer), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
