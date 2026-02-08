import satori from 'satori';
import sharp from 'sharp';
import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

// Cache fonts in memory to avoid refetching
let geistRegular: ArrayBuffer | null = null;
let geistBold: ArrayBuffer | null = null;

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

function formatDate(date: Date, lang: 'fr' | 'en'): string {
  return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export async function generateOgImage(post: BlogPost): Promise<Buffer> {
  const { geistRegular, geistBold } = await loadFonts();

  const lang = post.id.split('/')[0] === 'en' ? 'en' : 'fr';
  const title = post.data.title;
  const description = truncateText(post.data.description, 120);
  const tags = post.data.tags;
  const publishDate = formatDate(post.data.publishDate, lang);

  // Colors matching the dark theme from global.css
  const primaryColor = '#dc7702';
  const textColor = '#0a0a0a';

  const svg = await satori(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundImage: `url('https://melmayan.fr/bg-light.jpg')`,
        padding: '60px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <img
        style={{
          position: 'absolute',
          top: '60px',
          right: '80px',
        }}
        src="https://melmayan.fr/favicon.svg"
        alt="Marek Elmayan's logo"
        height={120}
      />

      <div
        style={{
          fontSize: '48px',
          fontWeight: 700,
          color: primaryColor,
          fontFamily: 'Geist',
          marginBottom: 'auto',
        }}
      >
        melmayan.fr
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          width: '100%',
        }}
      >
        <div
          style={{
            fontSize: '64px',
            fontWeight: 700,
            color: textColor,
            fontFamily: 'Geist',
            lineHeight: 1.1,
            maxWidth: '1000px',
          }}
        >
          {title}
        </div>

        {description && (
          <div
            style={{
              fontSize: '28px',
              fontWeight: 400,
              color: textColor,
              fontFamily: 'Geist',
              lineHeight: 1.4,
              maxWidth: '900px',
            }}
          >
            {description}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginTop: 'auto',
          }}
        >
          {Array.isArray(tags) && tags.length > 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              {tags.slice(0, 3).map((tag: string) => (
                <div
                  key={tag}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    backgroundColor: `${primaryColor}90`,
                    color: textColor,
                    fontSize: '18px',
                    fontWeight: 600,
                    fontFamily: 'Geist',
                    border: `1px solid ${primaryColor}`,
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          ) : null}

          <div
            style={{
              fontSize: '20px',
              color: textColor,
              fontFamily: 'Geist',
              marginLeft: 'auto',
            }}
          >
            {publishDate}
          </div>
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
