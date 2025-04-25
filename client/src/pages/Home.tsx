import Hero from "@/components/Hero";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";
import { useScrollToSection } from "@/hooks/useScrollToSection";
import { useEffect } from "react";

const Home = () => {
  // Initialize scroll functionality
  useScrollToSection();
  
  // Set document title
  useEffect(() => {
    document.title = "Ofir Zangi | Portfolio";
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <Hero />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />
    </div>
  );
};

export default Home;
