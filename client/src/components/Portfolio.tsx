import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, projects, type Category, type Project } from "@/data/portfolioData";
import { EASE_IN_OUT, exitTransition, revealItem } from "@/lib/motion";
import { TransitionLink } from "@/lib/viewTransition";
import { ProjectPlaceholder } from "./ProjectPlaceholder";
import { ResponsiveImage } from "./ResponsiveImage";
import { Reveal } from "./motion/Reveal";

type Filter = Category | "all";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "הכל" },
  ...(Object.keys(CATEGORY_LABELS) as Category[]).map((id) => ({ id, label: CATEGORY_LABELS[id] })),
];

/**
 * One project card: a 16:9 media panel with the client mark centred on it,
 * then the name, a one-line tagline and the category tags.
 */
export function ProjectCard({
  project,
  replace,
  placeholderTone = "dark",
}: {
  project: Project;
  /** Swap the current history entry instead of adding one, as links between projects do. */
  replace?: boolean;
  /** Placeholder style for projects without a screenshot; see ProjectPlaceholder. */
  placeholderTone?: "dark" | "neutral";
}) {
  return (
    <article>
      <TransitionLink
        to={`/project/${project.slug}`}
        replace={replace}
        className="group pressable-card block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black"
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#141414]">
          {project.image ? (
            <ResponsiveImage
              src={project.image}
              small={project.imageSmall}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              alt=""
              className="h-full w-full object-cover object-top transition-transform duration-300 ease-out-strong can-hover:group-hover:scale-[1.04]"
            />
          ) : (
            <ProjectPlaceholder
              title={project.title}
              tone={placeholderTone}
              className="transition-transform duration-300 ease-out-strong can-hover:group-hover:scale-[1.04]"
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

/** Where the selected filter sits inside the row, in px from each edge. */
type Inset = { top: number; right: number; bottom: number; left: number };

// Narrower on phones, so all four fit on one line from 390px instead of leaving SEO on its own.
// Narrower screens still wrap; the pill follows onto the second line.
const FILTER_CLASS = "rounded-full px-3.5 py-2 text-sm font-medium sm:px-5";

/**
 * The selected filter is a red pill that slides to the next one. The row is drawn twice:
 * plain underneath, and an all-red copy on top clipped down to the selected button. Moving
 * the clip moves the fill and the white label as one, which timing a background slide
 * against separate colour changes on each label never quite does.
 *
 * Both copies use the same weight, so their labels land on exactly the same pixels.
 */
function FilterRow({ selected, onSelect }: { selected: Filter; onSelect: (filter: Filter) => void }) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const [inset, setInset] = useState<Inset | null>(null);
  // Nothing slides on the first paint: the pill starts where it belongs.
  const [ready, setReady] = useState(false);
  const index = FILTERS.findIndex((filter) => filter.id === selected);

  useLayoutEffect(() => {
    const measure = () => {
      const button = buttons.current[index];
      const row = button?.offsetParent as HTMLElement | null;
      if (!button || !row) return;
      setInset({
        top: button.offsetTop,
        left: button.offsetLeft,
        right: row.offsetWidth - button.offsetLeft - button.offsetWidth,
        bottom: row.offsetHeight - button.offsetTop - button.offsetHeight,
      });
    };
    measure();
    // Labels reflow when the webfont lands, and the row can wrap as the window narrows.
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, [index]);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <div className="relative" role="group" aria-label="סינון לפי קטגוריה">
      <div className="flex flex-wrap justify-center gap-2">
        {FILTERS.map((filter, i) => (
          <button
            key={filter.id}
            ref={(element) => {
              buttons.current[i] = element;
            }}
            type="button"
            onClick={() => onSelect(filter.id)}
            aria-pressed={selected === filter.id}
            className={cn(
              FILTER_CLASS,
              "pressable text-white/45 can-hover:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black",
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {inset && (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 flex flex-wrap justify-center gap-2 bg-[rgb(var(--accent))]",
            ready && "transition-[clip-path] duration-200 ease-out-strong motion-reduce:transition-none",
          )}
          style={{
            clipPath: `inset(${inset.top}px ${inset.right}px ${inset.bottom}px ${inset.left}px round 9999px)`,
          }}
        >
          {FILTERS.map((filter) => (
            <span key={filter.id} className={cn(FILTER_CLASS, "text-white")}>
              {filter.label}
            </span>
          ))}
        </div>
      )}
    </div>
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
          <p className="section-eyebrow">פרויקטים</p>
          <h2 className="mt-4 text-4xl font-light leading-tight tracking-tight text-white md:text-6xl">
            הפרויקטים שלי
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
            תיק העבודות שלי משקף את עומק המומחיות שלי ואת האמון שלקוחותי נותנים בי.
            כל פרויקט מדגים מחויבות למצוינות בעיצוב, טכנולוגיות מתקדמות ותוצאות מדידות.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 flex justify-center md:mt-16">
          <FilterRow selected={selected} onSelect={setSelected} />
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
