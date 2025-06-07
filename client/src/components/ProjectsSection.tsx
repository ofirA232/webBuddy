import { projects } from "@/data/portfolioData";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ProjectsSection = () => {
  const navigate = useNavigate();
  
  const handleProjectClick = (id: number) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      navigate(`/project/${project.slug}`);
    }
  };

  return (
    <section id="projects" className="py-12">
      <h2 className="text-white text-2xl font-bold mb-6 text-right" dir="rtl">פרויקטים נבחרים</h2>
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {projects.map((project) => (
              <CarouselItem key={project.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <div
                  className="bg-cover bg-center flex flex-col rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow h-full"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <div className="h-48 w-full overflow-hidden">
                    <img 
                      src={project.imageUrl} 
                      alt={project.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="p-4 bg-gradient-to-t from-black to-black/70 flex-1 text-right" dir="rtl">
                    <h3 className="text-white text-lg font-bold mb-2">{project.title}</h3>
                    <p className="text-white/80 text-sm">{project.description}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden sm:block">
            <CarouselPrevious className="absolute -left-4 md:-left-5 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/80 border-0" />
            <CarouselNext className="absolute -right-4 md:-right-5 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/80 border-0" />
          </div>
        </Carousel>
        <div className="flex justify-center mt-4 sm:hidden">
          <div className="text-xs text-white/60">החלק לצפייה בפרויקטים נוספים</div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
