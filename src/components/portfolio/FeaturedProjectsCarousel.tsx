import { useCallback, useEffect, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { ProjectCardReact, type ProjectData } from './ProjectCardReact';
import { cn } from '@/lib/utils';
import { defaultLang, type Lang } from '@/i18n/config';

interface FeaturedProjectsCarouselProps {
  projects: Array<{
    data: ProjectData;
    slug: string;
  }>;
  translations: {
    liveDemo: string;
    code: string;
    viewDetails: string;
  };
  lang: Lang;
}

function translatePath(lang: Lang, path: string): string {
  return lang === defaultLang ? path : `/${lang}${path}`;
}

export function FeaturedProjectsCarousel({
  projects,
  translations,
  lang,
}: FeaturedProjectsCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Create autoplay plugin with configuration
  const autoplayPlugin = useCallback(() => {
    if (prefersReducedMotion) return undefined;
    return Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    });
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          loop: true,
        }}
        plugins={autoplayPlugin() ? [autoplayPlugin()!] : undefined}
        className="w-full"
      >
        <CarouselContent className="-ml-4 py-1">
          {projects.map((project) => (
            <CarouselItem
              key={project.slug}
              className="h-auto basis-full pl-4 md:basis-1/2 lg:basis-1/3"
            >
              <ProjectCardReact
                project={project.data}
                projectUrl={translatePath(lang, `/projects/${project.slug}`)}
                translations={translations}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation arrows */}
        <CarouselPrevious className="-left-12 hidden md:flex" aria-label="Previous projects" />
        <CarouselNext className="-right-12 hidden md:flex" aria-label="Next projects" />
      </Carousel>

      {/* Navigation dots */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              'size-2 rounded-full transition-all',
              current === index
                ? 'bg-primary w-6'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            )}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={current === index ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  );
}
