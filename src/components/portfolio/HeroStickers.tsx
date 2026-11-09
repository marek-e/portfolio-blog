import type { CSSProperties } from 'react';
import { GlassMaterial } from '@/components/ui/glass-material';
import '@/styles/hero-stickers.css';

const stickers = [
  { tone: 'peach', position: '-rotate-6 top-[14%] left-[6%]', depth: 1.2 },
  { tone: 'sky', position: 'rotate-3 top-[22%] right-[7%]', depth: 0.8 },
  { tone: 'mint', position: 'rotate-6 bottom-[30%] left-[9%]', depth: 1.4 },
  { tone: 'lilac', position: '-rotate-3 bottom-[24%] right-[10%]', depth: 1 },
  { tone: 'butter', position: 'rotate-2 bottom-[12%] left-[26%]', depth: 0.6 },
];

export function HeroStickers({
  badges,
  floating = false,
}: {
  badges: string[];
  floating?: boolean;
}) {
  const pills = badges.map((badge, index) => {
    const sticker = stickers[index % stickers.length];
    const pill = (
      <span
        className={`hero-glass-pill ${floating ? 'sticker-parallax h-10 px-4 text-sm' : 'h-8 px-3 text-xs'}`}
        style={
          {
            '--tone': `var(--pastel-${sticker.tone})`,
            '--tone-ink': `var(--pastel-${sticker.tone}-ink)`,
          } as CSSProperties
        }
      >
        <GlassMaterial />
        {badge}
      </span>
    );

    return floating ? (
      <span
        key={badge}
        className={`hero-sticker absolute ${sticker.position}`}
        style={{ animationDelay: `${index * -1.7}s`, '--depth': sticker.depth } as CSSProperties}
      >
        {pill}
      </span>
    ) : (
      <li key={badge}>{pill}</li>
    );
  });

  return floating ? (
    <div aria-hidden="true" className="absolute inset-0 z-10 hidden lg:block" data-sticker-layer>
      {pills}
    </div>
  ) : (
    <ul className="mt-12 flex flex-wrap justify-center gap-2 lg:hidden">{pills}</ul>
  );
}
