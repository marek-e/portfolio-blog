import { useEffect, useState } from 'react';
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
import { useReducedMotion } from '@/lib/useReducedMotion';

interface FeaturedProjectsCarouselProps {
  projects: Array<{
    data: ProjectData;
    slug: string;
  }>;
  translations: {
    liveDemo: string;
    code: string;
    viewDetails: string;
    previous: string;
    next: string;
    slide: string;
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
  const reducedMotion = useReducedMotion();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(projects.length);

  useEffect(() => {
    if (!api) return;

    const update = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap());
    };

    update();
    api.on('select', update);
    api.on('reInit', update);
    api.on('resize', update);

    return () => {
      api.off('select', update);
      api.off('reInit', update);
      api.off('resize', update);
    };
  }, [api]);

  const slideLabel = (index: number) =>
    translations.slide.replace('{current}', String(index + 1)).replace('{count}', String(count));

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        opts={{ align: 'start', loop: true, ...(reducedMotion ? { duration: 0 } : {}) }}
        aria-labelledby="projects-title"
        className="w-full"
      >
        <CarouselContent
          className="-ml-4 items-stretch py-2"
          viewportClassName="-mx-3 -my-6 px-3 py-6 touch-pan-y"
        >
          {projects.map((project, index) => (
            <CarouselItem
              key={project.slug}
              aria-label={translations.slide
                .replace('{current}', String(index + 1))
                .replace('{count}', String(projects.length))}
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
        <div className="mt-4 flex items-center justify-between md:mt-0">
          <CarouselPrevious
            className="static size-11 translate-y-0 md:absolute md:top-1/2 md:-left-14 md:-translate-y-1/2 [&_svg]:size-4.5"
            aria-label={translations.previous}
          />
          <p
            className="text-muted-foreground font-sans text-sm tabular-nums md:sr-only"
            aria-live="polite"
            aria-atomic="true"
          >
            {slideLabel(current)}
          </p>
          <CarouselNext
            className="static size-11 translate-y-0 md:absolute md:top-1/2 md:-right-14 md:-translate-y-1/2 [&_svg]:size-4.5"
            aria-label={translations.next}
          />
        </div>
      </Carousel>
      <div className="mt-6 hidden justify-center md:flex">
        <div className="glass flex items-center rounded-full px-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              disabled={!api}
              onClick={(event) => api?.scrollTo(index, event.detail === 0)}
              className="group/dot flex size-11 cursor-pointer items-center justify-center rounded-full"
              aria-label={slideLabel(index)}
              aria-current={current === index ? 'true' : undefined}
            >
              <span
                className={cn(
                  'block size-2 rounded-full',
                  current === index
                    ? 'bg-foreground'
                    : 'bg-foreground/35 group-hover/dot:bg-foreground/60'
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
