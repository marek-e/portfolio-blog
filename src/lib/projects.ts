import type { Lang } from '@/i18n/config';
import { pickByHash } from '@/lib/utils';
import type { CollectionEntry } from 'astro:content';

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
 * Extract slug from project ID (removes lang prefix and file extension)
 */
export function getProjectSlug(id: string, lang: Lang): string {
  return id.replace(`${lang}/`, '').replace(/\.(md|mdx)$/, '');
}

/**
 * Format date for projects (shorter format: MMM YYYY)
 */
export function formatProjectDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'short',
  });
}

/**
 * Get badge variant for project status
 */
export function getStatusVariant(
  status: string
): 'default' | 'outline' | 'pastel-green' | 'pastel-yellow' | 'pastel-blue' | 'pastel-rose' {
  switch (status) {
    case 'completed':
      return 'pastel-green';
    case 'in-progress':
      return 'pastel-blue';
    case 'archived':
      return 'pastel-rose';
    case 'concept':
      return 'pastel-yellow';
    default:
      return 'outline';
  }
}

/**
 * Get a consistent pastel color variant for a tech stack item
 */
export function getTechColor(tech: string) {
  return pickByHash(tech, pastelVariants, 99);
}

/**
 * Sort projects by publish date
 */
export function sortProjects(
  projects: CollectionEntry<'projects'>[],
  direction: 'asc' | 'desc' = 'desc'
) {
  return [...projects].sort((a, b) => {
    const diff = b.data.publishDate.valueOf() - a.data.publishDate.valueOf();
    return direction === 'desc' ? diff : -diff;
  });
}
