const Hero = () => {
  const scrollToProjects = () => {
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="about" className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column - Image */}
        <div className="flex items-center justify-center">
          <div
            className="w-full h-80 md:h-96 bg-center bg-no-repeat bg-cover rounded-xl shadow-md"
            style={{
              backgroundImage:
                'url("https://cdn.usegalileo.ai/sdxl10/46abb76b-de61-4219-850b-d588e74ea23e.png")',
            }}
            aria-label="Profile photo of Ofir Zangi"
          ></div>
        </div>
        
        {/* Right column - Text and button */}
        <div className="flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-tight">
              Ofir Zangi
            </h1>
            <p className="text-white text-sm md:text-base font-normal leading-relaxed">
              I'm a digital manager specializing in crafting exceptional
              websites using WordPress. From conceptualization to
              implementation, I focus on creating engaging online presences that
              deliver results. With a strong background in SEO and content
              strategy, I ensure that every website I build not only looks great
              but also ranks high on search engines.
            </p>
          </div>
          <button
            onClick={scrollToProjects}
            className="flex w-fit cursor-pointer items-center justify-center rounded-full h-12 px-6 bg-white text-black text-base font-bold hover:bg-gray-200 transition-colors"
            aria-label="View projects button"
          >
            <span>View Projects</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
