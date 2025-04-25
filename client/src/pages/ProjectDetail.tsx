import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { projects, Project } from "@/data/portfolioData";
import { ArrowLeft, Globe, Github } from "lucide-react";

const ProjectDetail = () => {
  const [, setLocation] = useLocation();
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const currentProject = projects.find(p => p.slug === params.slug);
    if (currentProject) {
      setProject(currentProject);
      // Set document title
      document.title = `${currentProject.title} | Ofir Zangi Portfolio`;
    } else {
      // Redirect to 404 if project not found
      setLocation("/not-found");
    }
  }, [params.slug, setLocation]);

  const goBack = () => {
    setLocation("/");
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
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main content */}
        <div className="lg:col-span-8">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-6 text-right">{project.title}</h1>
          
          <div className="mb-10 rounded-xl overflow-hidden">
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full object-cover h-auto"
            />
          </div>
          
          <div className="mb-8 text-right" dir="rtl">
            <h2 className="text-white text-2xl font-bold mb-4">תיאור הפרויקט</h2>
            <p className="text-white/90 text-lg leading-relaxed">{project.fullDescription}</p>
          </div>
          
          {project.features && project.features.length > 0 && (
            <div className="mb-8 text-right" dir="rtl">
              <h2 className="text-white text-2xl font-bold mb-4">תכונות עיקריות</h2>
              <ul className="list-disc list-inside space-y-2">
                {project.features.map((feature, index) => (
                  <li key={index} className="text-white/90 text-lg">{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-black/30 rounded-xl p-6 border border-[#333333] sticky top-24 text-right" dir="rtl">
            {project.role && (
              <div className="mb-6">
                <h3 className="text-white text-lg font-bold mb-2">תפקיד</h3>
                <p className="text-white/90">{project.role}</p>
              </div>
            )}
            
            {project.technologies && project.technologies.length > 0 && (
              <div className="mb-6">
                <h3 className="text-white text-lg font-bold mb-2">טכנולוגיות</h3>
                <div className="flex flex-wrap gap-2 justify-end">
                  {project.technologies.map((tech, index) => (
                    <span 
                      key={index} 
                      className="bg-[#333333] text-white text-sm px-3 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Links */}
            <div className="space-y-3">
              {project.demoUrl && (
                <a 
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#333333] text-white py-2 px-4 rounded-lg hover:bg-[#444444] transition-colors"
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
                  className="flex items-center justify-center gap-2 w-full bg-[#333333] text-white py-2 px-4 rounded-lg hover:bg-[#444444] transition-colors"
                >
                  <Github size={18} />
                  <span>קוד המקור</span>
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