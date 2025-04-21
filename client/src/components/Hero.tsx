const Hero = () => {
  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="about" className="@container">
      <div className="flex flex-col gap-6 py-10 @[480px]:gap-8 @[864px]:flex-row">
        <div
          className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl @[480px]:h-auto @[480px]:min-w-[400px] @[864px]:w-full"
          style={{ backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/46abb76b-de61-4219-850b-d588e74ea23e.png")' }}
          aria-label="Profile photo of Alex Reed"
        ></div>
        <div className="flex flex-col gap-6 @[480px]:min-w-[400px] @[480px]:gap-8 @[864px]:justify-center">
          <div className="flex flex-col gap-2 text-left">
            <h1 className="text-[#FFFFFF] text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
              Alex Reed
            </h1>
            <p className="text-[#FFFFFF] text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
              I'm a digital manager specializing in crafting exceptional websites using WordPress. From conceptualization to implementation, I focus on creating engaging
              online presences that deliver results. With a strong background in SEO and content strategy, I ensure that every website I build not only looks great but also
              ranks high on search engines.
            </p>
          </div>
          <button
            onClick={scrollToProjects}
            className="flex min-w-[84px] max-w-[480px] w-fit cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#FFFFFF] text-black text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] hover:bg-gray-200 transition-colors"
            aria-label="View projects button"
          >
            <span className="truncate">View Projects</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
