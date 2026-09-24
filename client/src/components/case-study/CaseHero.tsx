import type { CSSProperties } from "react";
import { ArrowRight, ArrowUpLeft, Github } from "lucide-react";
import { CATEGORY_LABELS, type Project } from "@/data/portfolioData";
import { cn } from "@/lib/utils";
import { TransitionLink } from "@/lib/viewTransition";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { ScreenShowcase } from "@/components/ui/screen-showcase";
import { Reveal } from "@/components/motion/Reveal";
import { Crosshairs, Eyebrow, GridBackdrop } from "./parts";
import "@/components/CtaButton.css";

/** Stand-in for a missing screenshot: the grid, and the name set quietly in the middle. */
function FramePlaceholder({ title }: { title: string }) {
  return (
    <div aria-hidden="true" className="relative flex h-full w-full items-center justify-center bg-[#0c0c0c]">
      <GridBackdrop className="opacity-60" />
      <span className="relative text-3xl font-light tracking-tight text-white/35 md:text-5xl">{title}</span>
    </div>
  );
}

/**
 * Opening of a case study, in the order a reader wants it: what it is, the facts, where to
 * see it, then the thing itself, large. Monochrome on purpose; the screenshot brings the
 * colour, and the page around it stays out of its way.
 */
export function CaseHero({ project }: { project: Project }) {
  const liveUrl = project.liveUrl || project.demoUrl;

  const facts = [
    { label: "תחום", value: project.categories.map((c) => CATEGORY_LABELS[c]).join(" · ") },
    project.year && { label: "שנה", value: project.year },
    project.role && { label: "תפקיד", value: project.role },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <section className="relative overflow-hidden">
      {/* No grid here: the showcase's rings are the hero's backdrop, and the two lines fought. */}

      <div className="container relative mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Steps back in history so the projects grid returns at the scroll position it was left at. */}
        <TransitionLink
          to="/#projects"
          direction="back"
          historyBack
          className="pressable inline-flex items-center gap-2 text-sm text-white/55 can-hover:hover:text-white"
        >
          <ArrowRight size={18} aria-hidden="true" />
          <span>חזרה לפרויקטים</span>
        </TransitionLink>

        <Reveal stagger={0.06} className="mx-auto mt-12 max-w-4xl text-center md:mt-16">
          <Reveal.Item>
            <Eyebrow>Case study</Eyebrow>
          </Reveal.Item>
          <Reveal.Item>
            <h1 className="mt-6 text-5xl font-light leading-[1.05] tracking-tight text-white md:text-7xl">
              {project.title}
            </h1>
          </Reveal.Item>
          {(project.tagline || project.description) && (
            <Reveal.Item>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/50 md:text-xl">
                {project.tagline || project.description}
              </p>
            </Reveal.Item>
          )}
          {(liveUrl || project.githubUrl) && (
            <Reveal.Item>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {liveUrl && (
                  <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="cta-button cta-button--sm gap-2">
                    <span className="cta-button__label inline-flex items-center gap-2">
                      צפה באתר <ArrowUpLeft size={16} aria-hidden="true" />
                    </span>
                    <span className="cta-button__overlay" aria-hidden="true">
                      <span className="cta-button__label inline-flex items-center gap-2">
                        צפה באתר <ArrowUpLeft size={16} />
                      </span>
                    </span>
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pressable inline-flex h-10 items-center gap-2 rounded-full border border-white/15 px-5 text-sm text-white/80 can-hover:hover:bg-white/[0.06] can-hover:hover:text-white sm:h-11"
                  >
                    <Github size={16} aria-hidden="true" />
                    <span>קוד ב-GitHub</span>
                  </a>
                )}
              </div>
            </Reveal.Item>
          )}
        </Reveal>

        {/* The facts as a spec strip: hairline cells, like the first page of a report. */}
        <Reveal delay={0.2} className="relative mx-auto mt-12 max-w-5xl md:mt-16">
          <Crosshairs />
          <dl className="grid grid-cols-2 border-s border-t border-white/10 md:grid-cols-[repeat(var(--facts),minmax(0,auto))_1fr]" style={{ "--facts": facts.length } as CSSProperties}>
            {facts.map((fact, i) => (
              <div
                key={fact.label}
                className={cn(
                  "border-b border-e border-white/10 px-5 py-4 md:px-6",
                  // Two to a row on phones; an odd one out takes the whole row rather than leave a hole.
                  facts.length % 2 === 1 && i === facts.length - 1 && "col-span-2 md:col-span-1",
                )}
              >
                <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-white/40">{fact.label}</dt>
                <dd className="mt-1.5 whitespace-nowrap text-sm text-white/85">{fact.value}</dd>
              </div>
            ))}
            {project.technologies && project.technologies.length > 0 && (
              <div className="col-span-2 border-b border-e border-white/10 px-5 py-4 md:col-span-1 md:px-6">
                <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-white/40">טכנולוגיות</dt>
                <dd className="mt-2">
                  {/* Pills: names like "dnd-kit" stay whole, and Latin names keep a readable order. */}
                  <ul className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <li
                        key={tech}
                        dir="auto"
                        className="whitespace-nowrap rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-white/70"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
        </Reveal>

        {/* The project itself, framed like hero-section06: rings rising from behind it, a glow on
            its top edge, and the screen dissolving into the page. Only the image inside is
            unveiled top-down; a clip on the whole showcase would cut the rings off at its edge. */}
        <ScreenShowcase className="mx-auto mt-16 max-w-6xl md:mt-24">
          <div className="media-reveal aspect-video">
            {project.image ? (
              <ResponsiveImage
                src={project.image}
                small={project.imageSmall}
                sizes="(min-width: 1216px) 1152px, 100vw"
                alt={project.title}
                priority
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <FramePlaceholder title={project.title} />
            )}
          </div>
        </ScreenShowcase>
      </div>
    </section>
  );
}
