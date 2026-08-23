import type { CollectionEntry } from 'astro:content';
import type { Lang } from '@/i18n/config';

type BlogPost = CollectionEntry<'blog'>;

interface PostToMarkdownOptions {
  url: string;
  lang: Lang;
}

const labels: Record<Lang, Record<string, string>> = {
  fr: {
    source: 'Source',
    published: 'Publié le',
    updated: 'Mis à jour le',
    tags: 'Tags',
    image: 'Image',
    video: 'Vidéo',
    interactive: 'Contenu interactif, à voir sur',
  },
  en: {
    source: 'Source',
    published: 'Published',
    updated: 'Updated',
    tags: 'Tags',
    image: 'Image',
    video: 'Video',
    interactive: 'Interactive content, view at',
  },
};

const alertByVariant: Record<string, string> = {
  info: 'NOTE',
  tip: 'TIP',
  success: 'IMPORTANT',
  warning: 'WARNING',
  danger: 'CAUTION',
};

const placeholder = (index: number) => `%%VERBATIM${index}%%`;

class VerbatimStore {
  private readonly chunks: string[] = [];

  protect(chunk: string): string {
    this.chunks.push(chunk);
    return placeholder(this.chunks.length - 1);
  }

  restore(text: string): string {
    return this.chunks.reduceRight(
      (acc, chunk, index) => acc.replaceAll(placeholder(index), chunk),
      text
    );
  }
}

function protectFencedCode(source: string, store: VerbatimStore): string {
  const output: string[] = [];
  let openingFence: string | null = null;
  let block: string[] = [];

  for (const line of source.split('\n')) {
    const fence = line.match(/^\s*(`{3,}|~{3,})/)?.[1];

    if (openingFence === null) {
      if (fence) {
        openingFence = fence;
        block = [line];
      } else {
        output.push(line);
      }
      continue;
    }

    block.push(line);

    const closes =
      fence !== undefined &&
      fence[0] === openingFence[0] &&
      fence.length >= openingFence.length &&
      line.trim() === fence;

    if (closes) {
      output.push(store.protect(block.join('\n')));
      openingFence = null;
    }
  }

  if (openingFence !== null) output.push(...block);

  return output.join('\n');
}

function getAttribute(attributes: string, name: string): string | undefined {
  return attributes.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
}

function dedent(text: string): string {
  const lines = text.replace(/^(?:[ \t]*\n)+|(?:\n[ \t]*)+$/g, '').split('\n');
  const indents = lines.filter((line) => line.trim()).map((line) => line.match(/^ */)![0].length);
  const shortest = indents.length ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(shortest)).join('\n');
}

function blockquote(text: string): string {
  return dedent(text)
    .split('\n')
    .map((line) => (line.trim() ? `> ${line}` : '>'))
    .join('\n');
}

function transformMermaidAndProtectInlineCode(source: string, store: VerbatimStore): string {
  return source.replace(
    /<Mermaid\b([^`>]*)chart=\{`([\s\S]*?)`\}([^>]*?)\/>|(`+)[^\n]*?\4/g,
    (match, before: string, chart: string | undefined, after: string) => {
      if (chart === undefined) return store.protect(match);

      const attributes = `${before} ${after}`;
      const title = getAttribute(attributes, 'title');
      const caption = getAttribute(attributes, 'caption');
      const fence = store.protect(`\`\`\`mermaid\n${dedent(chart)}\n\`\`\``);

      return [title && `**${title}**`, fence, caption && `_${caption}_`]
        .filter(Boolean)
        .join('\n\n');
    }
  );
}

function transformFigure(source: string, lang: Lang): string {
  return source.replace(/^[ \t]*<Figure\b([\s\S]*?)\/>[ \t]*$/gm, (_match, attributes: string) => {
    const alt = getAttribute(attributes, 'alt');
    const caption = getAttribute(attributes, 'caption');
    const note = `_[${labels[lang].image}${alt ? `: ${alt}` : ''}]_`;

    return caption ? `${note}\n\n_${caption}_` : note;
  });
}

function transformMediaElements(source: string, lang: Lang): string {
  return source.replace(
    /^[ \t]*<(video|img)\b([\s\S]*?)\/>[ \t]*$/gm,
    (_match, tag: string, attributes: string) => {
      const alt =
        getAttribute(attributes, 'alt') ??
        getAttribute(attributes, 'aria-label') ??
        getAttribute(attributes, 'title');
      const label = tag === 'video' ? labels[lang].video : labels[lang].image;

      return `_[${label}${alt ? `: ${alt}` : ''}]_`;
    }
  );
}

function transformCallouts(source: string): string {
  return source.replace(
    /<Callout\b([^>]*)>([\s\S]*?)<\/Callout>/g,
    (_match, attributes: string, body: string) => {
      const alert = alertByVariant[getAttribute(attributes, 'variant') ?? 'info'] ?? 'NOTE';
      const title = getAttribute(attributes, 'title');
      const heading = title ? `> [!${alert}]\n> **${title}**\n>` : `> [!${alert}]`;

      return `${heading}\n${blockquote(body)}`;
    }
  );
}

function transformCitations(source: string): string {
  return source.replace(
    /<Citation\b([^>]*)>([\s\S]*?)<\/Citation>/g,
    (_match, attributes: string, body: string) => {
      const author = getAttribute(attributes, 'author');
      const cited = getAttribute(attributes, 'source');
      const url = getAttribute(attributes, 'url');
      const attribution = [author, url && cited ? `[${cited}](${url})` : cited]
        .filter(Boolean)
        .join(', ');

      return attribution ? `${blockquote(body)}\n>\n> — ${attribution}` : blockquote(body);
    }
  );
}

function transformToggles(source: string): string {
  return source.replace(
    /<(Toggle|CodeToggle)\b([^>]*)>([\s\S]*?)<\/\1>/g,
    (_match, _tag: string, attributes: string, body: string) => {
      const title = getAttribute(attributes, 'title');
      return title ? `**${title}**\n\n${dedent(body)}` : dedent(body);
    }
  );
}

function transformPastelCards(source: string): string {
  return source
    .replace(/<PastelCards\b[^>]*>([\s\S]*?)<\/PastelCards>/g, (_match, body: string) =>
      dedent(body)
    )
    .replace(
      /<PastelCard\b([^>]*)>([\s\S]*?)<\/PastelCard>/g,
      (_match, attributes: string, body: string) => {
        const emoji = getAttribute(attributes, 'emoji');
        const title = getAttribute(attributes, 'title');
        const heading = [emoji, title].filter(Boolean).join(' ');

        return heading ? `\n**${heading}**\n\n${dedent(body)}\n` : `\n${dedent(body)}\n`;
      }
    );
}

function transformFileTrees(source: string): string {
  return source.replace(/<FileTree\b[^>]*>([\s\S]*?)<\/FileTree>/g, (_match, body: string) =>
    dedent(body)
  );
}

function transformInlineElements(source: string): string {
  return source
    .replace(/<Highlight\b[^>]*>([\s\S]*?)<\/Highlight>/g, '$1')
    .replace(/<(?:strong|b)>([\s\S]*?)<\/(?:strong|b)>/g, '**$1**')
    .replace(/<(?:em|i)>([\s\S]*?)<\/(?:em|i)>/g, '_$1_')
    .replace(/<code>([\s\S]*?)<\/code>/g, '`$1`')
    .replace(/<br\s*\/?>/g, '\n');
}

function dropWrapperElements(source: string): string {
  return source.replace(/<\/?(?:div|p|span|figure|figcaption)\b[^>]*>/g, '');
}

function handleUnknownComponents(source: string, options: PostToMarkdownOptions): string {
  return source
    .replace(
      /<[A-Z][A-Za-z0-9]*\b[^>]*\/>/g,
      `_[${labels[options.lang].interactive} ${options.url}]_`
    )
    .replace(/<\/?[A-Z][A-Za-z0-9]*\b[^>]*>/g, '');
}

function buildHeader(post: BlogPost, options: PostToMarkdownOptions): string {
  const { title, description, publishDate, updatedDate, tags } = post.data;
  const t = labels[options.lang];
  const isoDate = (date: Date) => date.toISOString().slice(0, 10);

  const meta = [
    `- **${t.source}:** ${options.url}`,
    `- **${t.published}:** ${isoDate(publishDate)}`,
    updatedDate && `- **${t.updated}:** ${isoDate(updatedDate)}`,
    tags.length > 0 && `- **${t.tags}:** ${tags.join(', ')}`,
  ].filter(Boolean);

  return [`# ${title}`, `> ${description}`, meta.join('\n'), '---'].join('\n\n');
}

export function postToMarkdown(post: BlogPost, options: PostToMarkdownOptions): string {
  const store = new VerbatimStore();

  let body = (post.body ?? '').replace(/^---\n[\s\S]*?\n---\n/, '');

  body = protectFencedCode(body, store);
  body = transformMermaidAndProtectInlineCode(body, store);

  body = body.replace(/^(?:import|export)\s[^\n]*\n/gm, '');

  body = body
    .replace(/^[ \t]*\{\/\*[\s\S]*?\*\/\}[ \t]*\n/gm, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

  body = transformFigure(body, options.lang);
  body = transformMediaElements(body, options.lang);
  body = transformCallouts(body);
  body = transformCitations(body);
  body = transformFileTrees(body);
  body = transformToggles(body);
  body = transformPastelCards(body);
  body = transformInlineElements(body);
  body = dropWrapperElements(body);
  body = handleUnknownComponents(body, options);

  body = store.restore(body);

  const cleaned = body
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return `${buildHeader(post, options)}\n\n${cleaned}\n`;
}
