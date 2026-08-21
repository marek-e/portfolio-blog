import { generateSiteOgImage } from '@/lib/og-image';

export async function GET() {
  const jpegBuffer = await generateSiteOgImage({ lang: 'en', page: 'blog' });

  return new Response(new Uint8Array(jpegBuffer), {
    // No Cache-Control here: the card is prerendered at build time, so Pages
    // serves it as a static asset and public/_headers owns its cache policy.
    headers: {
      'Content-Type': 'image/jpeg',
    },
  });
}
