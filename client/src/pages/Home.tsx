import Hero from "@/components/Hero";
import { Portfolio } from "@/components/Portfolio";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";
import { useScrollToSection } from "@/hooks/useScrollToSection";
import { useEffect } from "react";
import { site } from "@/data/site";

const Home = () => {
  useScrollToSection();

  useEffect(() => {
    document.title = site.title;
  }, []);

  return (
    <>
      <Hero />
      {/* Both sections bring their own container. */}
      <SkillsSection />
      <Portfolio />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <ContactSection />
      </div>
    </>
  );
};

export default Home;
