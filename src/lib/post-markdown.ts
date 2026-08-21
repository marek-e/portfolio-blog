import type { CollectionEntry } from 'astro:content';
import type { Lang } from '@/i18n/config';

type BlogPost = CollectionEntry<'blog'>;

interface PostToMarkdownOptions {
  /** Absolute URL of the rendered post, used in the header and in media notes */
  url: string;
  lang: Lang;
}

/**
 * Strings that end up *inside* the generated markdown. They describe content
 * rather than UI chrome, so they live here instead of src/i18n/ui.ts.
 */
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

/** Callout variants map onto GitHub's alert syntax, which most readers render */
const alertByVariant: Record<string, string> = {
  info: 'NOTE',
  tip: 'TIP',
  success: 'IMPORTANT',
  warning: 'WARNING',
  danger: 'CAUTION',
};

const placeholder = (index: number) => `%%VERBATIM${index}%%`;

/**
 * Holds verbatim chunks (code blocks, generated fences) out of harm's way while
 * the JSX transforms run, then puts them back untouched.
 */
class VerbatimStore {
  private readonly chunks: string[] = [];

  protect(chunk: string): string {
    this.chunks.push(chunk);
    return placeholder(this.chunks.length - 1);
  }

  restore(text: string): string {
    // Restore in reverse so a chunk that itself holds a placeholder still resolves
    return this.chunks.reduceRight(
      (acc, chunk, index) => acc.replaceAll(placeholder(index), chunk),
      text
    );
  }
}

/**
 * Replace fenced code blocks with placeholders. Fences are matched line by line
 * rather than with a regex because posts nest a ``` fence inside a ```` one, so
 * the closing fence has to be at least as long as the one that opened the block.
 */
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

  // An unterminated fence is left as-is rather than swallowed
  if (openingFence !== null) output.push(...block);

  return output.join('\n');
}

/** Protect inline code spans, kept to a single line so multi-line JSX template literals survive */
function protectInlineCode(source: string, store: VerbatimStore): string {
  return source.replace(/(`+)([^\n]*?)\1/g, (match) => store.protect(match));
}

function getAttribute(attributes: string, name: string): string | undefined {
  return attributes.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
}

function dedent(text: string): string {
  // Trims blank lines, including the whitespace-only ones that JSX indentation leaves behind
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

/**
 * `<Mermaid chart={`...`} title caption />` becomes a mermaid fence.
 *
 * The match is anchored on the chart's template literal rather than on the
 * first `/>`: charts contain `<br/>` for line breaks inside diagram labels, so
 * a lazy `[\s\S]*?\/>` would stop there and leak the rest of the element.
 */
function transformMermaid(source: string, store: VerbatimStore): string {
  return source.replace(
    /<Mermaid\b([^`>]*)chart=\{`([\s\S]*?)`\}([^>]*?)\/>/g,
    (_match, before: string, chart: string, after: string) => {
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

/**
 * `<Figure src={imported} alt caption />` becomes a note. The `src` is an
 * imported asset binding, so no URL is resolvable at this layer.
 */
function transformFigure(source: string, lang: Lang): string {
  return source.replace(/^[ \t]*<Figure\b([\s\S]*?)\/>[ \t]*$/gm, (_match, attributes: string) => {
    const alt = getAttribute(attributes, 'alt');
    const caption = getAttribute(attributes, 'caption');
    const note = `_[${labels[lang].image}${alt ? `: ${alt}` : ''}]_`;

    return caption ? `${note}\n\n_${caption}_` : note;
  });
}

/**
 * Bare `<video>` / `<img>` elements get the same treatment as Figure. Videos
 * carry their description in `aria-label`, so that is the richest source of alt
 * text. The leading indentation is consumed too, since these sit inside layout
 * wrappers that are about to be dropped.
 */
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

/** Collapsible sections keep their title as a bold line, then their content */
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

        // Padded with blank lines so consecutive cards stay separate blocks
        return heading ? `\n**${heading}**\n\n${dedent(body)}\n` : `\n${dedent(body)}\n`;
      }
    );
}

/** The file tree's children are already a markdown list, so they pass through */
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

/** Layout-only wrappers are dropped, their children kept */
function dropWrapperElements(source: string): string {
  return source.replace(/<\/?(?:div|p|span|figure|figcaption)\b[^>]*>/g, '');
}

/**
 * Anything still left is an MDX component this transform does not know about.
 * Self-closing tags are interactive islands with no textual equivalent; paired
 * tags are dropped so future components degrade to their children rather than
 * leaking JSX.
 */
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

/**
 * Turn a post's MDX body into plain markdown: imports stripped, every site
 * component converted to a markdown equivalent, no JSX left behind.
 */
export function postToMarkdown(post: BlogPost, options: PostToMarkdownOptions): string {
  const store = new VerbatimStore();

  // The glob loader already drops frontmatter; this only guards against a change there
  let body = (post.body ?? '').replace(/^---\n[\s\S]*?\n---\n/, '');

  body = protectFencedCode(body, store);

  // Ahead of protectInlineCode: a chart written on one line is a backtick span as
  // far as that pass is concerned, and protecting it first hides the chart from
  // transformMermaid, leaving handleUnknownComponents to discard the diagram
  body = transformMermaid(body, store);

  body = protectInlineCode(body, store);

  // Imports only live at the top level, and code samples containing them are protected by now
  body = body.replace(/^(?:import|export)\s[^\n]*\n/gm, '');

  // MDX expression comments such as {/* prettier-ignore */} are tooling directives
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
