import type { APIContext } from 'astro';
import { generateRSSFeed } from '@/lib/rss';

export const GET = (context: APIContext) => generateRSSFeed(context, 'en');
