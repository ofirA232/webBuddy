import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { projects } from "@/data/portfolioData";
import { ArrowRight, Globe, Github } from "lucide-react";
import { ProjectPlaceholder } from "@/components/ProjectPlaceholder";
import { site } from "@/data/site";
import NotFound from "./not-found";

const ProjectDetail = () => {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

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
    <div className="container mx-auto py-12 px-4 min-h-screen">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-white mb-8 hover:text-gray-300 transition-colors"
      >
        <ArrowRight size={20} aria-hidden="true" />
        <span>חזרה לדף הבית</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Content column */}
        <div className="order-2 lg:order-1">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-6 text-right">{project.title}</h1>

          {project.fullDescription && (
            <div className="mb-8 text-right" dir="rtl">
              <h2 className="text-white text-2xl font-bold mb-4">תיאור הפרויקט</h2>
              <p className="text-white/90 text-lg leading-relaxed">{project.fullDescription}</p>
            </div>
          )}

          {project.tools && project.tools.length > 0 && (
            <div className="mb-8 text-right" dir="rtl">
              <h2 className="text-white text-2xl font-bold mb-4">כלים בהם השתמשתי</h2>
              <div className="grid grid-cols-2 gap-4">
                {project.tools.map((tool) => (
                  <div key={tool.name} className="flex items-center gap-3 bg-[#111111] p-4 rounded-lg">
                    <span className="text-2xl" aria-hidden="true">{tool.icon}</span>
                    <span className="text-white">{tool.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.challengeTitle && project.challengeText && (
            <div className="mb-8 text-right" dir="rtl">
              <h2 className="text-white text-2xl font-bold mb-4">{project.challengeTitle}</h2>
              <p className="text-white/90 text-lg leading-relaxed">{project.challengeText}</p>
            </div>
          )}

          {project.solutionTitle && project.solutionText && (
            <div className="mb-8 text-right" dir="rtl">
              <h2 className="text-white text-2xl font-bold mb-4">{project.solutionTitle}</h2>
              <p className="text-white/90 text-lg leading-relaxed">{project.solutionText}</p>
            </div>
          )}

          {project.resultsTitle && project.resultsText && (
            <div className="mb-8 text-right" dir="rtl">
              <h2 className="text-white text-2xl font-bold mb-4">{project.resultsTitle}</h2>
              <p className="text-white/90 text-lg leading-relaxed">{project.resultsText}</p>
            </div>
          )}

          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-8 text-right" dir="rtl">
              <h2 className="text-white text-2xl font-bold mb-4">טכנולוגיות</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="bg-[#111111] px-3 py-1 rounded-lg text-white">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Image column */}
        <div className="order-1 lg:order-2">
          <div className="sticky top-8">
            <div className="rounded-2xl overflow-hidden shadow-2xl aspect-video bg-[#161616]">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <ProjectPlaceholder title={project.title} />
              )}
            </div>

            {(liveUrl || project.githubUrl) && (
              <div className="mt-8 space-y-4">
                {liveUrl && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-gray-100 transition-colors"
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
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#333333] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#444444] transition-colors"
                  >
                    <Github size={18} aria-hidden="true" />
                    <span>צפה בקוד</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
