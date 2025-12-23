import type { Lang } from '@/i18n/config';

export interface TimelineEntry {
  id: string;
  type: 'education' | 'work';
  title: string;
  organization: string;
  startDate: string;
  endDate: string | null;
  description: string;
  logo?: string;
  tags?: string[];
}

export function formatDateRange(
  startDate: string,
  endDate: string | null,
  lang: Lang = 'fr',
  presentLabel: string = "Aujourd'hui"
): string {
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US';

  const formatDate = (date: string) => {
    const [year, month] = date.split('-');
    const dateObj = new Date(parseInt(year), parseInt(month, 10) - 1);
    return dateObj.toLocaleDateString(locale, { month: 'short', year: 'numeric' });
  };

  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : presentLabel;

  return `${start} → ${end}`;
}
