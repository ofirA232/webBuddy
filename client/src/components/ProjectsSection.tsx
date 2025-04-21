import { projects } from "@/data/portfolioData";

const ProjectsSection = () => {
  const handleProjectClick = (id: number) => {
    // In a real application, this would navigate to a project detail page
    console.log(`Viewing project ${id} details`);
  };

  return (
    <section id="projects" className="mb-8">
      <h2 className="text-[#FFFFFF] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Selected Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-video cursor-pointer hover:shadow-lg transition-shadow"
            style={{ backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%), url("${project.imageUrl}")` }}
            onClick={() => handleProjectClick(project.id)}
          >
            <p className="text-white text-base font-bold leading-tight w-4/5 line-clamp-2">{project.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
