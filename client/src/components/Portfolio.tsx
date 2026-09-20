import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { projects, type Project } from "@/data/portfolioData";
import { EASE_IN_OUT, exitTransition, revealItem } from "@/lib/motion";
import { TransitionLink } from "@/lib/viewTransition";
import { ProjectPlaceholder } from "./ProjectPlaceholder";
import { ResponsiveImage } from "./ResponsiveImage";
import { Reveal } from "./motion/Reveal";

type Category = Project["categories"][number];
type Filter = Category | "all";

/** Single source for category names, used by both the filter row and the tag pills on each card. */
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

/** Small uppercase category chips shown under every project. */
function TagList({ categories }: { categories: readonly Category[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <li
          key={category}
          className="rounded-full bg-black/[0.06] px-3 py-1 text-[11px] font-medium tracking-wide text-black/70"
        >
          {CATEGORY_LABELS[category]}
        </li>
      ))}
    </ul>
  );
}

function ProjectMedia({ project, sizes }: { project: Project; sizes: string }) {
  const style = { viewTransitionName: `project-${project.slug}` } as CSSProperties;
  return project.image ? (
    <ResponsiveImage
      src={project.image}
      small={project.imageSmall}
      sizes={sizes}
      alt=""
      style={style}
      className="h-full w-full object-cover object-top transition-transform duration-500 ease-out-strong can-hover:group-hover:scale-[1.03]"
    />
  ) : (
    <ProjectPlaceholder
      title={project.title}
      tone="light"
      style={style}
      className="transition-transform duration-500 ease-out-strong can-hover:group-hover:scale-[1.03]"
    />
  );
}

/** "View case" affordance: label plus a filled circular arrow, pointing right-to-left for Hebrew. */
function ViewCase() {
  return (
    <span className="mt-6 inline-flex items-center gap-3 text-[15px] text-black">
      <span className="can-hover:group-hover:underline underline-offset-4">צפייה בפרויקט</span>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-transform duration-200 ease-out-strong can-hover:group-hover:-translate-x-1">
        <ArrowLeft size={16} aria-hidden="true" />
      </span>
    </span>
  );
}

/** Full-width row: text on the reading side, a large media panel opposite it. */
function FeaturedProject({ project }: { project: Project }) {
  return (
    <Reveal as="li" className="border-t border-black/10 py-12 md:py-20">
      <TransitionLink
        to={`/project/${project.slug}`}
        className="group grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4 focus-visible:ring-offset-white"
      >
        <div className="order-2 flex h-full flex-col md:order-1">
          <h3 className="text-3xl font-light leading-tight tracking-tight text-black md:text-[42px] md:leading-[1.1]">
            {project.title}
          </h3>
          <p className="mt-5 max-w-prose text-base leading-relaxed text-black/70 line-clamp-[8]">
            {project.fullDescription || project.description}
          </p>
          <ViewCase />
          <div className="mt-8 md:mt-auto md:pt-10">
            <TagList categories={project.categories} />
          </div>
        </div>

        <div className="order-1 aspect-[3/2] w-full overflow-hidden rounded bg-[#efefef] md:order-2">
          <ProjectMedia project={project} sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
      </TransitionLink>
    </Reveal>
  );
}

/** Grid card: media, name, one-line tagline, category chips. */
function GridProject({ project }: { project: Project }) {
  return (
    <TransitionLink
      to={`/project/${project.slug}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4 focus-visible:ring-offset-white"
    >
      <div className="aspect-[16/10] w-full overflow-hidden rounded bg-[#efefef]">
        <ProjectMedia project={project} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-black">{project.title}</h3>
      {(project.tagline || project.description) && (
        <p className="mt-1 text-[15px] leading-snug text-black/55 line-clamp-2">
          {project.tagline || project.description}
        </p>
      )}
      <div className="mt-3">
        <TagList categories={project.categories} />
      </div>
    </TransitionLink>
  );
}

export function Portfolio() {
  const [selected, setSelected] = useState<Filter>("all");
  const reduce = useReducedMotion() ?? false;

  const matching =
    selected === "all" ? projects : projects.filter((p) => p.categories.includes(selected));
  const featured = matching.filter((p) => p.featured);
  const rest = matching.filter((p) => !p.featured);

  return (
    // A white band inside the dark site: the contrast itself is what makes the work stand out.
    <section id="projects" className="bg-white text-black" dir="rtl">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-light leading-tight tracking-tight md:text-6xl">הפרויקטים שלי</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-black/65 md:text-lg">
            תיק העבודות שלי משקף את עומק המומחיות שלי ואת האמון שלקוחותי נותנים בי.
            כל פרויקט מדגים מחויבות למצוינות בעיצוב, טכנולוגיות מתקדמות ותוצאות מדידות.
          </p>
        </Reveal>

        {/* Filter row: the selected chip is a solid black pill, the rest are plain text. */}
        <Reveal delay={0.1} className="mt-12 flex flex-wrap justify-center gap-x-2 gap-y-2 md:mt-16">
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
                    "pressable rounded-full px-5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                    isSelected
                      ? "bg-black font-medium text-white"
                      : "text-black/50 can-hover:hover:text-black",
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        {matching.length === 0 ? (
          <p className="py-24 text-center text-black/50">אין עדיין פרויקטים בקטגוריה זו.</p>
        ) : (
          <>
            {featured.length > 0 && (
              <ul className="mt-12 md:mt-16">
                {featured.map((project) => (
                  <FeaturedProject key={project.id} project={project} />
                ))}
              </ul>
            )}

            {rest.length > 0 && (
              <Reveal
                stagger={0.04}
                as="ul"
                className={cn(
                  "grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3",
                  featured.length > 0 ? "border-t border-black/10 pt-12 md:pt-20" : "mt-12 md:mt-16",
                )}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {rest.map((project) => (
                    <motion.li
                      key={project.id}
                      layout
                      variants={revealItem(reduce)}
                      exit={{ opacity: 0, scale: reduce ? 1 : 0.97, transition: exitTransition }}
                      transition={{ layout: { duration: reduce ? 0 : 0.25, ease: EASE_IN_OUT } }}
                    >
                      <GridProject project={project} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </Reveal>
            )}
          </>
        )}
      </div>
    </section>
  );
}
