import type { Lang } from '@/i18n/config';
import { pickByHash } from '@/lib/utils';

const pastelVariants = [
  'pastel-blue-outline',
  'pastel-green-outline',
  'pastel-yellow-outline',
  'pastel-pink-outline',
  'pastel-purple-outline',
  'pastel-orange-outline',
  'pastel-teal-outline',
  'pastel-rose-outline',
] as const;

/**
 * Get a consistent pastel color variant for a tag based on its name
 */
export function getTagColor(tag: string) {
  return pickByHash(tag, pastelVariants);
}

/**
 * Format a date according to the specified locale
 */
export function formatDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Estimate reading time in minutes based on content length
 */
export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Extract the slug from a blog post ID (removes lang prefix and file extension)
 */
export function getSlug(id: string, lang: Lang): string {
  return id.replace(`${lang}/`, '').replace(/\.(md|mdx)$/, '');
}
