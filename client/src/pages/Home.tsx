import Hero from "@/components/Hero";
import { Portfolio } from "@/components/Portfolio";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";
import { useScrollToSection } from "@/hooks/useScrollToSection";
import { useEffect } from "react";

const Home = () => {
  // Initialize scroll functionality
  useScrollToSection();
  
  // Set document title
  useEffect(() => {
    document.title = "אופיר זנגי | פורטפוליו";
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <Hero />
      <SkillsSection />
      <Portfolio />
      <ContactSection />
    </div>
  );
};

export default Home;
