import type { Project } from "@/data/portfolioData";
import { Reveal } from "@/components/motion/Reveal";
import { CaseSection, Crosshairs } from "./parts";

/** Text written as one string with blank lines between paragraphs. */
const paragraphs = (text: string) => text.split(/\n\s*\n/).filter(Boolean);

/** Two-digit index, as in "01". */
const pad = (n: number) => String(n).padStart(2, "0");

/** As many columns as there are figures, so no row is left half empty. Whole class names for Tailwind. */
const METRIC_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-4",
};

const rowClass =
  "grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-white/10 py-7 first:pt-0 md:grid-cols-[3.5rem_1fr] md:py-9";

/** The claim, the story, and what the work took. */
export function CaseIntro({ project }: { project: Project }) {
  if (!project.headline && !project.fullDescription && !project.tools?.length) return null;

  return (
    <CaseSection label="סקירה">
      <Reveal>
        {project.headline && (
          <h2 className="text-3xl font-light leading-[1.2] tracking-tight text-white md:text-[40px]">
            {project.headline}
          </h2>
        )}
        {project.fullDescription && (
          <div className={project.headline ? "mt-8 space-y-5" : "space-y-5"}>
            {paragraphs(project.fullDescription).map((text) => (
              <p key={text.slice(0, 32)} className="text-lg leading-relaxed text-white/60">
                {text}
              </p>
            ))}
          </div>
        )}
      </Reveal>

      {project.tools && project.tools.length > 0 && (
        <Reveal delay={0.08} className="relative mt-12">
          <Crosshairs />
          {/* A hairline grid: the cells share their borders instead of each drawing a box. */}
          <ul className="grid grid-cols-2 border-s border-t border-white/10 sm:grid-cols-3">
            {project.tools.map(({ icon: Icon, name }) => (
              <li key={name} className="flex flex-col gap-4 border-b border-e border-white/10 p-5 md:p-6">
                <span className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                  <Icon size={18} className="text-white/80" aria-hidden="true" />
                </span>
                <span className="text-sm text-white/85">{name}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </CaseSection>
  );
}

/**
 * Each problem and what was done about it, as numbered rows. Projects not yet broken into
 * points show their challenge and solution texts as two rows instead.
 */
export function ChallengeSolution({ project }: { project: Project }) {
  const points = project.highlights ?? [];
  const prose = [
    project.challengeText && { title: "האתגר", text: project.challengeText },
    project.solutionText && { title: "הפתרון", text: project.solutionText },
  ].filter(Boolean) as { title: string; text: string }[];
  if (points.length === 0 && prose.length === 0) return null;

  const rows =
    points.length > 0
      ? points.map((point) => ({ heading: point.challenge, body: point.solution }))
      : prose.map((block) => ({ heading: block.title, body: block.text }));

  return (
    <CaseSection label="האתגר והפתרון" title="מה עמד בדרך, ואיך ניגשתי לזה">
      <ol>
        {rows.map((row, i) => (
          <Reveal as="li" key={row.heading.slice(0, 32)} className={rowClass}>
            <span dir="ltr" className="pt-1 text-right font-mono text-sm text-white/30">
              {pad(i + 1)}
            </span>
            <div>
              <h3 className="text-xl leading-snug text-white md:text-2xl md:font-light">{row.heading}</h3>
              <p className="mt-3 text-base leading-relaxed text-white/55">{row.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </CaseSection>
  );
}

/** Where it landed: the measured numbers in a ruled strip, then the story of the outcome. */
export function CaseResults({ project }: { project: Project }) {
  const metrics = project.metrics ?? [];
  if (!project.resultsText && metrics.length === 0) return null;

  return (
    <CaseSection label="תוצאות" title="מה יצא מזה">
      {metrics.length > 0 && (
        <Reveal className="relative mb-10">
          <Crosshairs />
          <ul className={`grid border-s border-t border-white/10 ${METRIC_COLS[Math.min(metrics.length, 4)]}`}>
            {metrics.map((metric) => (
              <li key={metric.label} className="border-b border-e border-white/10 p-5 md:p-6">
                <p dir="ltr" className="whitespace-nowrap text-right text-3xl font-light tracking-tight text-white sm:text-4xl">
                  {metric.value}
                </p>
                <p className="mt-2 text-sm leading-snug text-white/50">{metric.label}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      {project.resultsText && (
        <Reveal delay={0.08} className="space-y-5">
          {paragraphs(project.resultsText).map((text) => (
            <p key={text.slice(0, 32)} className="text-lg leading-relaxed text-white/60">
              {text}
            </p>
          ))}
        </Reveal>
      )}
    </CaseSection>
  );
}
