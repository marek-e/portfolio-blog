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
function loadAsset(key: 'background' | 'portrait') {
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

async function encodeAsset(key: 'background' | 'portrait') {
  const { file, resize, quality } =
    key === 'background'
      ? { file: 'public/melo/melo-studio.webp', resize: [1200, 630] as const, quality: 80 }
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

  const [regular, bold] = await Promise.all([
    readFile('node_modules/@fontsource/geist/files/geist-latin-400-normal.woff'),
    readFile('node_modules/@fontsource/geist/files/geist-latin-700-normal.woff'),
  ]);
  geistRegular = regular.buffer.slice(
    regular.byteOffset,
    regular.byteOffset + regular.byteLength
  ) as ArrayBuffer;
  geistBold = bold.buffer.slice(bold.byteOffset, bold.byteOffset + bold.byteLength) as ArrayBuffer;

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
};

const COLUMN_WIDTH = 840;
const VEIL =
  'linear-gradient(100deg, rgba(253,250,246,0.97) 0%, rgba(253,250,246,0.94) 58%, rgba(253,250,246,0.62) 74%, rgba(253,250,246,0.08) 100%)';
const INK = '#292638';
const MUTED = '#696273';
const ACCENT = '#70538e';
const PILL_INK = '#534063';

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
}: CardContent): Promise<Buffer> {
  const { geistRegular, geistBold } = await loadFonts();
  const [backgroundUrl, portraitUrl] = await Promise.all([
    loadAsset('background'),
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

      <div
        style={{
          position: 'absolute',
          top: '40px',
          right: '60px',
          color: ACCENT,
          fontSize: '40px',
          fontFamily: 'Geist',
          fontWeight: 700,
        }}
      >
        marek.
      </div>

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
                  backgroundColor: 'rgba(112,83,142,0.1)',
                  border: '2px solid rgba(112,83,142,0.3)',
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
              style={{ borderRadius: '40px', border: '3px solid rgba(112,83,142,0.3)' }}
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
    });
  }

  return renderCard({
    kicker: 'Portfolio · Blog',
    // Satori has no emoji font loaded, so the waving hand would render blank
    headline: t.hero.headline.replace(/\p{Extended_Pictographic}/gu, '').trim(),
    tagline: t.hero.subtitle.split('\n')[0],
    pills: topics,
  });
}
