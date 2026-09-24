import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { projects, type Project } from "@/data/portfolioData";
import { TransitionLink } from "@/lib/viewTransition";
import { ProjectCard } from "@/components/Portfolio";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "./parts";

const arrowClass =
  "pressable flex size-11 items-center justify-center rounded-full border border-white/15 text-white can-hover:hover:bg-white/[0.08] disabled:cursor-default disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";

/**
 * The other projects, in a row that drags and snaps. It starts with the one after the
 * current project and wraps around, so reading on always means moving forward.
 *
 * Opening one replaces the current history entry: "back to projects" should return to the
 * grid, not step back through every case study read on the way.
 */
export function MoreProjects({ current }: { current: Project }) {
  const index = projects.findIndex((p) => p.slug === current.slug);
  const others = [...projects.slice(index + 1), ...projects.slice(0, Math.max(index, 0))];

  const [viewportRef, embla] = useEmblaCarousel({ direction: "rtl", align: "start", containScroll: "trimSnaps" });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const sync = useCallback(() => {
    if (!embla) return;
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    sync();
    embla.on("select", sync).on("reInit", sync);
    return () => {
      embla.off("select", sync).off("reInit", sync);
    };
  }, [embla, sync]);

  if (others.length === 0) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex items-end justify-between gap-6 border-t border-white/10 pt-10 md:pt-12">
          <div>
            <Eyebrow>עוד פרויקטים</Eyebrow>
            <h2 className="mt-5 text-3xl font-light leading-tight tracking-tight text-white md:text-5xl">
              Case studies נוספים
            </h2>
          </div>
          {/* RTL: the first button sits on the right and goes back; the second goes on. */}
          <div className="hidden gap-2 sm:flex">
            <button type="button" className={arrowClass} onClick={() => embla?.scrollPrev()} disabled={!canPrev} aria-label="הפרויקט הקודם">
              <ArrowRight size={20} aria-hidden="true" />
            </button>
            <button type="button" className={arrowClass} onClick={() => embla?.scrollNext()} disabled={!canNext} aria-label="הפרויקט הבא">
              <ArrowLeft size={20} aria-hidden="true" />
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="mt-10 md:mt-14">
          <div ref={viewportRef} dir="rtl" className="overflow-hidden">
            <div className="-ms-6 flex touch-pan-y">
              {others.map((project) => (
                <div
                  key={project.id}
                  className="min-w-0 shrink-0 grow-0 basis-[85%] ps-6 sm:basis-1/2 lg:basis-1/3"
                >
                  <ProjectCard project={project} replace placeholderTone="neutral" />
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-12 flex justify-center">
          <TransitionLink
            to="/#projects"
            direction="back"
            historyBack
            className="pressable rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium text-white can-hover:hover:bg-white/[0.08]"
          >
            לכל הפרויקטים
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
