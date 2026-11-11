import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pickByHash<T>(key: string, items: readonly T[], charOffset = 0): T {
  const hash = key.split('').reduce((sum, char) => sum + char.charCodeAt(0) + charOffset, 0);
  return items[hash % items.length];
}
