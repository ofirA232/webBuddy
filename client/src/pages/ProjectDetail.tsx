import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projects, Project } from "@/data/portfolioData";
import { ArrowLeft, Globe, Github } from "lucide-react";

const ProjectDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const currentProject = projects.find(p => p.slug === params.slug);
    if (currentProject) {
      setProject(currentProject);
      // Set document title
      document.title = `${currentProject.title} | פורטפוליו אופיר זנגי`;
    } else {
      // Redirect to 404 if project not found
      navigate("/not-found");
    }
  }, [params.slug, navigate]);

  const goBack = () => {
    navigate("/");
  };

  if (!project) {
    return (
      <div className="container mx-auto py-20 px-4 min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">טוען...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 min-h-screen">
      <button 
        onClick={goBack}
        className="flex items-center gap-2 text-white mb-8 hover:text-gray-300 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>חזרה לדף הבית</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Right Column - Content */}
        <div className="order-2 lg:order-1">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-6 text-right">{project.title}</h1>
          
          <div className="mb-8 text-right" dir="rtl">
            <h2 className="text-white text-2xl font-bold mb-4">תיאור הפרויקט</h2>
            <p className="text-white/90 text-lg leading-relaxed">{project.fullDescription}</p>
          </div>

          {project.tools && project.tools.length > 0 && (
            <div className="mb-8 text-right" dir="rtl">
              <h2 className="text-white text-2xl font-bold mb-4">כלים בהם השתמשתי</h2>
              <div className="grid grid-cols-2 gap-4">
                {project.tools.map((tool, index) => (
                  <div key={index} className="flex items-center gap-3 bg-[#111111] p-4 rounded-lg">
                    <span className="text-2xl">{tool.icon}</span>
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

          {project.resultsTitle || project.resultsText ? (
            <div className="mb-8 text-right" dir="rtl">
              <h2 className="text-white text-2xl font-bold mb-4">{project.resultsTitle}</h2>
              <p className="text-white/90 text-lg leading-relaxed">{project.resultsText}</p>
            </div>
          ) : null}

          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-8 text-right" dir="rtl">
              <h2 className="text-white text-2xl font-bold mb-4">טכנולוגיות</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="bg-[#111111] px-3 py-1 rounded-lg text-white">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Left Column - Image */}
        <div className="order-1 lg:order-2">
          <div className="sticky top-8">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full h-auto"
              />
            </div>

            <div className="mt-8 space-y-4">
              {(project.liveUrl || project.demoUrl) && (
                <a
                  href={project.liveUrl || project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-gray-100 transition-colors"
                >
                  <Globe size={18} />
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
                  <Github size={18} />
                  <span>צפה בקוד</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;