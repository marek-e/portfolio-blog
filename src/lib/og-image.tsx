import satori from 'satori';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import type { CollectionEntry } from 'astro:content';
import { estimateReadingTime } from '@/lib/blog';
import { getTranslations } from '@/i18n';

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
function loadAsset(key: 'background' | 'logo' | 'avatar') {
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

async function encodeAsset(key: 'background' | 'logo' | 'avatar') {
  if (key === 'logo') {
    const source = await readFile('public/favicon.svg');
    return `data:image/svg+xml;base64,${source.toString('base64')}`;
  }

  // The background quality is load-bearing: the documented contrast floors
  // below were measured on its pixels at this exact encoding.
  const { file, resize, quality } =
    key === 'background'
      ? { file: 'public/bg-dark-v3.jpg', resize: [1200, 630] as const, quality: 80 }
      : { file: 'public/images/mareke.jpg', resize: [160, 160] as const, quality: 84 };

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

export async function generateOgImage(post: BlogPost): Promise<Buffer> {
  const { geistRegular, geistBold } = await loadFonts();
  const [backgroundUrl, logoUrl, avatarUrl] = await Promise.all([
    loadAsset('background'),
    loadAsset('logo'),
    loadAsset('avatar'),
  ]);

  const lang = post.id.split('/')[0] === 'en' ? 'en' : 'fr';
  const t = getTranslations(lang);
  const title = post.data.title;
  // One legible topic beats three chips nobody can read at feed size
  const topic = post.data.tags?.[0];
  const readingTime = `${estimateReadingTime(post.body ?? '')} ${t.blog.minRead}`;

  // The card is text over a photograph, so contrast can't be left to the
  // artwork: a scrim carries it. These values are measured against the darkest
  // and lightest pixels of the scrimmed background anywhere text can land, so
  // the floors hold whatever the title length pushes the layout to:
  //   #fafafa title    -> 5.77:1 (needs 3.0, 78px bold)
  //   #eeecf4 meta     -> 5.14:1 (needs 4.5)
  //   #cdbcff topic    -> 3.51:1 (needs 3.0, 34px bold)
  // The floors are set by the moon, the brightest thing under the scrim.
  // Dropping the scrim opacity, or swapping in lighter artwork, invalidates
  // them - re-measure before touching either.
  const scrim =
    'linear-gradient(180deg, rgba(11,9,16,0.58) 0%, rgba(11,9,16,0.70) 45%, rgba(11,9,16,0.84) 100%)';
  const brandColor = '#cdbcff';
  const textColor = '#fafafa';
  const mutedColor = '#eeecf4';

  // Everything on the card is sized for the width feeds actually render it at.
  // Slack shows the 1200px card at ~360px, so anything under ~34px here lands
  // below 10px on screen and reads as noise - which is why the post
  // description is not repeated on the card: the unfurl already shows it as
  // selectable text next to the image.
  const svg = await satori(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundImage: `url('${backgroundUrl}')`,
        padding: '56px 80px',
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
          backgroundImage: scrim,
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {topic && (
          <div
            style={{
              fontSize: '34px',
              fontWeight: 700,
              color: brandColor,
              fontFamily: 'Geist',
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}
          >
            {topic}
          </div>
        )}

        <img style={{ marginLeft: 'auto' }} src={logoUrl} alt="Marek Elmayan's logo" height={92} />
      </div>

      <div
        style={{
          fontSize: '78px',
          fontWeight: 700,
          color: textColor,
          fontFamily: 'Geist',
          lineHeight: 1.08,
          maxWidth: '1040px',
          display: 'block',
          lineClamp: 3,
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '20px',
          width: '100%',
        }}
      >
        <img
          style={{ borderRadius: '40px', border: '3px solid rgba(255,255,255,0.35)' }}
          src={avatarUrl}
          alt="Marek Elmayan"
          width={72}
          height={72}
        />

        <div style={{ fontSize: '34px', fontWeight: 700, color: textColor, fontFamily: 'Geist' }}>
          Marek Elmayan
        </div>

        <div
          style={{
            fontSize: '34px',
            color: mutedColor,
            fontFamily: 'Geist',
            marginLeft: 'auto',
          }}
        >
          {readingTime}
        </div>
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

  // Convert SVG to PNG using Sharp
  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return png;
}
