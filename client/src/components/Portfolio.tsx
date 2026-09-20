import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { projects, type Project } from "@/data/portfolioData";
import { EASE_IN_OUT, exitTransition, revealItem } from "@/lib/motion";
import { TransitionLink } from "@/lib/viewTransition";
import { ProjectPlaceholder } from "./ProjectPlaceholder";
import { ResponsiveImage } from "./ResponsiveImage";
import { Reveal } from "./motion/Reveal";

type Category = Project["categories"][number];
type Filter = Category | "all";

/** Single source for category names, used by both the filter row and the tags on each card. */
const CATEGORY_LABELS: Record<Category, string> = {
  webDev: "בניית אתרים",
  webDesign: "עיצוב אתרים",
  branding: "מיתוג",
  seo: "קידום אתרים",
  digitalMarketing: "שיווק דיגיטלי",
};

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "הכל" },
  ...(Object.keys(CATEGORY_LABELS) as Category[]).map((id) => ({ id, label: CATEGORY_LABELS[id] })),
];

/**
 * One project card: a 16:9 media panel with the client mark centred on it,
 * then the name, a one-line tagline and the category tags.
 */
function ProjectCard({ project }: { project: Project }) {
  const mediaStyle = { viewTransitionName: `project-${project.slug}` } as CSSProperties;

  return (
    <article>
      <TransitionLink
        to={`/project/${project.slug}`}
        className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black"
      >
        <div className="relative aspect-video w-full overflow-hidden rounded bg-[#141414]">
          {project.image ? (
            <ResponsiveImage
              src={project.image}
              small={project.imageSmall}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              alt=""
              style={mediaStyle}
              className="h-full w-full object-cover object-top transition-transform duration-500 ease-out-strong can-hover:group-hover:scale-[1.04]"
            />
          ) : (
            <ProjectPlaceholder
              title={project.title}
              style={mediaStyle}
              className="transition-transform duration-500 ease-out-strong can-hover:group-hover:scale-[1.04]"
            />
          )}

          {/* TODO(user): add `logo` to a project to centre the client mark over the image, like Bou does. */}
          {project.logo && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
              <img src={project.logo} alt="" className="max-h-[35%] w-[45%] max-w-[240px] object-contain" />
            </div>
          )}
        </div>

        <h3 className="mt-4 text-lg font-bold leading-snug text-white">{project.title}</h3>
        <p className="mt-1 text-[15px] leading-snug text-white/55 line-clamp-2">
          {project.tagline || project.description}
        </p>
      </TransitionLink>

      <ul className="mt-3 flex flex-wrap gap-2">
        {project.categories.map((category) => (
          <li
            key={category}
            className="rounded-full bg-white/[0.08] px-3 py-1 text-[11px] font-medium tracking-wide text-white/65"
          >
            {CATEGORY_LABELS[category]}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Portfolio() {
  const [selected, setSelected] = useState<Filter>("all");
  const reduce = useReducedMotion() ?? false;

  const visible =
    selected === "all" ? projects : projects.filter((p) => p.categories.includes(selected));

  return (
    <section id="projects" dir="rtl">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-light leading-tight tracking-tight text-white md:text-6xl">
            הפרויקטים שלי
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
            תיק העבודות שלי משקף את עומק המומחיות שלי ואת האמון שלקוחותי נותנים בי.
            כל פרויקט מדגים מחויבות למצוינות בעיצוב, טכנולוגיות מתקדמות ותוצאות מדידות.
          </p>
        </Reveal>

        {/* Filter row: the selected filter is a solid pill, the rest are plain text. */}
        <Reveal delay={0.1} className="mt-12 flex flex-wrap justify-center gap-2 md:mt-16">
          <div className="contents" role="group" aria-label="סינון לפי קטגוריה">
            {FILTERS.map((filter) => {
              const isSelected = selected === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setSelected(filter.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    "pressable rounded-full px-5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                    isSelected
                      ? "bg-white font-medium text-black"
                      : "text-white/45 can-hover:hover:text-white",
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        {visible.length === 0 ? (
          <p className="py-24 text-center text-white/45">אין עדיין פרויקטים בקטגוריה זו.</p>
        ) : (
          <Reveal
            stagger={0.08}
            as="ul"
            className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 md:mt-16"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((project) => (
                <motion.li
                  key={project.id}
                  layout
                  variants={revealItem(reduce)}
                  exit={{ opacity: 0, scale: reduce ? 1 : 0.97, transition: exitTransition }}
                  transition={{ layout: { duration: reduce ? 0 : 0.25, ease: EASE_IN_OUT } }}
                >
                  <ProjectCard project={project} />
                </motion.li>
              ))}
            </AnimatePresence>
          </Reveal>
        )}
      </div>
    </section>
  );
}
