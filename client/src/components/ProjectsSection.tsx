import { projects } from "@/data/portfolioData";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ProjectsSection = () => {
  const handleProjectClick = (id: number) => {
    // In a real application, this would navigate to a project detail page
    console.log(`Viewing project ${id} details`);
  };

  return (
    <section id="projects" className="mb-8">
      <h2 className="text-[#FFFFFF] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Selected Projects</h2>
      <div className="relative px-4">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {projects.map((project) => (
              <CarouselItem key={project.id} className="md:basis-1/2 lg:basis-1/3">
                <div
                  className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-video cursor-pointer hover:shadow-lg transition-shadow h-full"
                  style={{ backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%), url("${project.imageUrl}")` }}
                  onClick={() => handleProjectClick(project.id)}
                >
                  <div className="space-y-1">
                    <h3 className="text-white text-base font-bold leading-tight line-clamp-2">{project.title}</h3>
                    <p className="text-white text-xs opacity-80 line-clamp-2">{project.description}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/80 border-0" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/80 border-0" />
        </Carousel>
      </div>
    </section>
  );
};

export default ProjectsSection;
