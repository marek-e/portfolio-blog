import satori from 'satori';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import type { CollectionEntry } from 'astro:content';
import { estimateReadingTime } from '@/lib/blog';
import { getTranslations } from '@/i18n';
import type { Lang } from '@/i18n/config';

type BlogPost = CollectionEntry<'blog'>;

// Cache fonts in memory to avoid refetching
let geistRegular: ArrayBuffer | null = null;
let geistBold: ArrayBuffer | null = null;

// Cache the artwork in memory to avoid re-encoding it for every post. The
// in-flight promise is cached too, so posts generated concurrently share a
// single read + resize instead of each starting its own.
const assetPromises = new Map<string, Promise<string>>();

// Every asset is read from disk, not from the deployed site, so builds don't
// depend on them already being live
function loadAsset(key: 'background' | 'logo' | 'portrait') {
  let promise = assetPromises.get(key);

  if (!promise) {
    promise = encodeAsset(key).catch((error) => {
      // Drop the rejected promise so a later call can retry
      assetPromises.delete(key);
      throw error;
    });
    assetPromises.set(key, promise);
  }

  return promise;
}

async function encodeAsset(key: 'background' | 'logo' | 'portrait') {
  if (key === 'logo') {
    const source = await readFile('public/favicon.svg');
    return `data:image/svg+xml;base64,${source.toString('base64')}`;
  }

  // The background quality is load-bearing: the documented contrast floors
  // below were measured on its pixels at this exact encoding.
  const { file, resize, quality } =
    key === 'background'
      ? { file: 'public/bg-light-v3.jpg', resize: [1200, 630] as const, quality: 80 }
      : { file: 'public/images/mareke.jpg', resize: [320, 320] as const, quality: 88 };

  const source = await readFile(file);
  const encoded = await sharp(source)
    .resize(resize[0], resize[1], { fit: 'cover' })
    .jpeg({ quality })
    .toBuffer();

  return `data:image/jpeg;base64,${encoded.toString('base64')}`;
}

async function loadFonts() {
  if (geistRegular && geistBold) {
    return { geistRegular, geistBold };
  }

  // Fetch Geist fonts from Fontsource CDN (TTF format)
  const [regularRes, boldRes] = await Promise.all([
    fetch('https://cdn.jsdelivr.net/fontsource/fonts/geist@latest/latin-400-normal.ttf'),
    fetch('https://cdn.jsdelivr.net/fontsource/fonts/geist@latest/latin-700-normal.ttf'),
  ]);

  if (!regularRes.ok || !boldRes.ok) {
    throw new Error('Failed to load Geist fonts');
  }

  geistRegular = await regularRes.arrayBuffer();
  geistBold = await boldRes.arrayBuffer();

  return { geistRegular, geistBold };
}

type CardContent = {
  /** Short, uppercased framing above the headline */
  kicker?: string;
  headline: string;
  headlineSize?: number;
  headlineClamp?: number;
  /** One line of value copy under the headline */
  tagline?: string;
  /** Topic chips, for the site-level cards */
  pills?: string[];
  /** Avatar + name + meta row, for post cards */
  byline?: { name: string; meta?: string };
  /** Large portrait on the right, for the site-level cards */
  portrait?: boolean;
};

// The card is text over a photograph, so contrast can't be left to the
// artwork: a veil carries it. It is strongest on the left and feathers out to
// the right so the sunrise still reads as a photograph rather than a wash.
// That gradient is why every text element lives inside COLUMN_WIDTH - past it
// the veil thins and the floors below stop holding. Measured across the whole
// column, so they hold whatever the headline length pushes the layout to, and
// with the background darkened by the worst deviation measured between a
// clean render and the bytes actually served (the JPEG encoder, plus the CDN's
// own re-encode), so they hold on the deployed card and not just locally:
//   #17130f headline/name -> 11.09:1 (needs 4.5)
//   #4a4038 tagline/meta  ->  6.06:1 (needs 4.5)
//   #7a3c00 pill labels   ->  5.10:1 (needs 4.5)
//   #a85200 kicker        ->  3.26:1 (needs 3.0, 28px bold) <- tightest
// Re-measure before widening the column, softening the veil, or swapping the
// artwork for something brighter.
const COLUMN_WIDTH = 840;
const VEIL =
  'linear-gradient(100deg, rgba(253,250,246,0.97) 0%, rgba(253,250,246,0.94) 58%, rgba(253,250,246,0.62) 74%, rgba(253,250,246,0.08) 100%)';
const INK = '#17130f';
const MUTED = '#4a4038';
const ACCENT = '#a85200';
const PILL_INK = '#7a3c00';

// Everything is sized for the width feeds actually render the card at. Slack
// shows the 1200px card at ~360px, so anything under ~28px here lands below
// 9px on screen and reads as noise - which is why no card repeats its page
// description: the unfurl already shows it as selectable text next to the
// image.
async function renderCard({
  kicker,
  headline,
  headlineSize = 66,
  headlineClamp = 3,
  tagline,
  pills,
  byline,
  portrait,
}: CardContent): Promise<Buffer> {
  const { geistRegular, geistBold } = await loadFonts();
  const [backgroundUrl, logoUrl, portraitUrl] = await Promise.all([
    loadAsset('background'),
    loadAsset('logo'),
    loadAsset('portrait'),
  ]);

  const svg = await satori(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        backgroundImage: `url('${backgroundUrl}')`,
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1200px',
          height: '630px',
          backgroundImage: VEIL,
        }}
      />

      {portrait && (
        <img
          style={{
            position: 'absolute',
            top: '175px',
            right: '74px',
            borderRadius: '150px',
            border: '6px solid rgba(255,255,255,0.85)',
          }}
          src={portraitUrl}
          alt="Marek Elmayan"
          width={280}
          height={280}
        />
      )}

      <img
        style={{ position: 'absolute', top: '44px', right: '60px' }}
        src={logoUrl}
        alt="Marek Elmayan's logo"
        height={76}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: `${COLUMN_WIDTH}px`,
          height: '630px',
          padding: '58px 72px',
          justifyContent: 'center',
          gap: '24px',
        }}
      >
        {kicker && (
          <div
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: ACCENT,
              fontFamily: 'Geist',
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}
          >
            {kicker}
          </div>
        )}

        <div
          style={{
            fontSize: `${headlineSize}px`,
            fontWeight: 700,
            color: INK,
            fontFamily: 'Geist',
            lineHeight: 1.05,
            display: 'block',
            lineClamp: headlineClamp,
          }}
        >
          {headline}
        </div>

        {tagline && (
          <div
            style={{
              fontSize: '32px',
              color: MUTED,
              fontFamily: 'Geist',
              lineHeight: 1.3,
              display: 'block',
              lineClamp: 2,
            }}
          >
            {tagline}
          </div>
        )}

        {pills && pills.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', flexWrap: 'wrap' }}>
            {pills.map((label) => (
              <div
                key={label}
                style={{
                  padding: '8px 22px',
                  borderRadius: '24px',
                  backgroundColor: 'rgba(220,119,2,0.13)',
                  border: '2px solid rgba(168,82,0,0.45)',
                  color: PILL_INK,
                  fontSize: '28px',
                  fontWeight: 700,
                  fontFamily: 'Geist',
                }}
              >
                {label}
              </div>
            ))}
          </div>
        )}

        {byline && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '18px',
              width: '100%',
            }}
          >
            <img
              style={{ borderRadius: '40px', border: '3px solid rgba(168,82,0,0.35)' }}
              src={portraitUrl}
              alt="Marek Elmayan"
              width={72}
              height={72}
            />

            <div style={{ fontSize: '30px', fontWeight: 700, color: INK, fontFamily: 'Geist' }}>
              {byline.name}
            </div>

            {byline.meta && (
              <div
                style={{
                  fontSize: '30px',
                  color: MUTED,
                  fontFamily: 'Geist',
                  marginLeft: 'auto',
                }}
              >
                {byline.meta}
              </div>
            )}
          </div>
        )}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Geist',
          data: geistRegular,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Geist',
          data: geistBold,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );

  // JPEG, not PNG: these are photographs, and PNG lands them at ~700 KB -
  // past the ~600 KB WhatsApp will fetch for a link preview. q90 is ~95 KB
  // with no difference visible at feed size, and the contrast floors above
  // were measured on its output, artefacts included.
  return sharp(Buffer.from(svg)).jpeg({ quality: 90, mozjpeg: true }).toBuffer();
}

export async function generateOgImage(post: BlogPost): Promise<Buffer> {
  const lang = post.id.split('/')[0] === 'en' ? 'en' : 'fr';
  const t = getTranslations(lang);

  return renderCard({
    // One legible topic beats three chips nobody can read at feed size
    kicker: post.data.tags?.[0],
    headline: post.data.title,
    headlineSize: 62,
    headlineClamp: 4,
    byline: {
      name: 'Marek Elmayan',
      meta: `${estimateReadingTime(post.body ?? '')} ${t.blog.minRead}`,
    },
  });
}

/**
 * The site-level cards for the home page and the blog index. Generated from
 * the same shell as the post cards so they can't drift apart the way the
 * hand-made PNGs did - those were still sitting on the v2 artwork.
 */
export async function generateSiteOgImage({
  lang,
  page,
}: {
  lang: Lang;
  page: 'home' | 'blog';
}): Promise<Buffer> {
  const t = getTranslations(lang);
  const topics = t.hero.badges.slice(0, 4).map((badge) => badge.replace('#', ''));

  if (page === 'blog') {
    return renderCard({
      kicker: t.blog.title,
      headline: t.blog.subtitle,
      headlineSize: 56,
      pills: topics,
      portrait: true,
    });
  }

  return renderCard({
    kicker: 'Portfolio · Blog',
    // Satori has no emoji font loaded, so the waving hand would render blank
    headline: t.hero.headline.replace(/\p{Extended_Pictographic}/gu, '').trim(),
    tagline: t.hero.subtitle.split('\n')[0],
    pills: topics,
    portrait: true,
  });
}
