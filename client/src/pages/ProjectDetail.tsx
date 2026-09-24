import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Globe, Github } from "lucide-react";
import { projects } from "@/data/portfolioData";
import { site } from "@/data/site";
import { TransitionLink } from "@/lib/viewTransition";
import { ProjectPlaceholder } from "@/components/ProjectPlaceholder";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { Reveal } from "@/components/motion/Reveal";
import NotFound from "./not-found";

const ProjectDetail = () => {
  const { slug } = useParams();
  const index = projects.findIndex((p) => p.slug === slug);
  const project = index >= 0 ? projects[index] : undefined;
  // Wraps around, so the last project still leads somewhere instead of ending the visit.
  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : undefined;

  useEffect(() => {
    if (project) {
      document.title = `${project.title} | ${site.name}`;
    }
  }, [project]);

  if (!project) {
    return <NotFound />;
  }

  const liveUrl = project.liveUrl || project.demoUrl;

  return (
    // Keyed by project: moving to the next one remounts the page, so its entrance plays again.
    <div key={project.slug} className="container mx-auto py-12 px-4 min-h-screen">
      {/* Steps back in history so the projects grid returns at the scroll position it was left at. */}
      <TransitionLink
        to="/#projects"
        direction="back"
        historyBack
        className="pressable inline-flex items-center gap-2 text-white mb-8 can-hover:hover:text-gray-300"
      >
        <ArrowRight size={20} aria-hidden="true" />
        <span>חזרה לפרויקטים</span>
      </TransitionLink>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Content column */}
        <Reveal stagger={0.06} className="order-2 lg:order-1">
          <Reveal.Item>
            <p className="section-eyebrow text-right">פרויקט</p>
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-6 mt-3 text-right">{project.title}</h1>
          </Reveal.Item>

          {project.fullDescription && (
            <Reveal.Item className="mb-8 text-right">
              <div dir="rtl">
                <h2 className="text-white text-2xl font-bold mb-4">תיאור הפרויקט</h2>
                <p className="text-white/90 text-lg leading-relaxed">{project.fullDescription}</p>
              </div>
            </Reveal.Item>
          )}

          {project.tools && project.tools.length > 0 && (
            <Reveal.Item className="mb-8 text-right">
              <div dir="rtl">
                <h2 className="text-white text-2xl font-bold mb-4">כלים בהם השתמשתי</h2>
                <div className="grid grid-cols-2 gap-3">
                  {project.tools.map(({ icon: Icon, name }) => (
                    <div
                      key={name}
                      className="flex items-center gap-3 rounded-lg border border-white/[0.07] bg-white/[0.03] px-4 py-3.5"
                    >
                      <Icon size={18} className="shrink-0 text-[rgb(var(--accent-soft))]" aria-hidden="true" />
                      <span className="text-sm text-white/90">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal.Item>
          )}

          {project.challengeTitle && project.challengeText && (
            <Reveal.Item className="mb-8 text-right">
              <div dir="rtl">
                <h2 className="text-white text-2xl font-bold mb-4">{project.challengeTitle}</h2>
                <p className="text-white/90 text-lg leading-relaxed">{project.challengeText}</p>
              </div>
            </Reveal.Item>
          )}

          {project.solutionTitle && project.solutionText && (
            <Reveal.Item className="mb-8 text-right">
              <div dir="rtl">
                <h2 className="text-white text-2xl font-bold mb-4">{project.solutionTitle}</h2>
                <p className="text-white/90 text-lg leading-relaxed">{project.solutionText}</p>
              </div>
            </Reveal.Item>
          )}

          {project.resultsTitle && project.resultsText && (
            <Reveal.Item className="mb-8 text-right">
              <div dir="rtl">
                <h2 className="text-white text-2xl font-bold mb-4">{project.resultsTitle}</h2>
                <p className="text-white/90 text-lg leading-relaxed">{project.resultsText}</p>
              </div>
            </Reveal.Item>
          )}

          {project.technologies && project.technologies.length > 0 && (
            <Reveal.Item className="mb-8 text-right">
              <div dir="rtl">
                <h2 className="text-white text-2xl font-bold mb-4">טכנולוגיות</h2>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-[rgb(var(--accent)/0.3)] bg-[rgb(var(--accent)/0.12)] px-3 py-1 text-sm text-[rgb(var(--accent-soft))]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal.Item>
          )}
        </Reveal>

        {/* Image column */}
        <div className="order-1 lg:order-2">
          {/* Clears the sticky header (57–65px), which would otherwise cover the top of the image. */}
          <div className="sticky top-24">
            {/* Unveiled top-down like the hero photo, so it arrives with the text rather than before it. */}
            <div className="media-reveal rounded-xl overflow-hidden shadow-2xl aspect-video bg-[#161616]">
              {project.image ? (
                <ResponsiveImage
                  src={project.image}
                  small={project.imageSmall}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  alt={project.title}
                  priority
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <ProjectPlaceholder title={project.title} />
              )}
            </div>

            {(liveUrl || project.githubUrl) && (
              <Reveal delay={0.15} className="mt-8 space-y-4">
                {liveUrl && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pressable flex w-full items-center justify-center gap-2 rounded-full bg-[rgb(var(--accent))] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgb(var(--accent)/0.75)] can-hover:hover:brightness-110"
                  >
                    <Globe size={18} aria-hidden="true" />
                    <span>צפה באתר</span>
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pressable flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white can-hover:hover:bg-white/[0.08]"
                  >
                    <Github size={18} aria-hidden="true" />
                    <span>צפה בקוד</span>
                  </a>
                )}
              </Reveal>
            )}
          </div>
        </div>
      </div>

      {next && (
        <Reveal className="mt-20 border-t border-white/10 pt-10 md:mt-28">
          {/* Replaces this entry rather than stacking one per project, so "back to projects"
              still returns to the grid however many projects were browsed in between. */}
          <TransitionLink
            to={`/project/${next.slug}`}
            replace
            className="group pressable-card flex items-center justify-between gap-6 text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black"
          >
            <span>
              <span className="section-eyebrow block">הפרויקט הבא</span>
              <span className="mt-3 block text-2xl font-light leading-tight tracking-tight text-white md:text-4xl">
                {next.title}
              </span>
            </span>
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-[transform,background-color] duration-200 ease-out-strong can-hover:group-hover:-translate-x-1 can-hover:group-hover:bg-white/[0.08] md:size-14">
              <ArrowLeft size={22} aria-hidden="true" />
            </span>
          </TransitionLink>
        </Reveal>
      )}
    </div>
  );
};

export default ProjectDetail;
