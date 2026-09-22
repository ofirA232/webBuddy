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
      {/* Every section brings its own container; contact is full-bleed for its horizon. */}
      <SkillsSection />
      <Portfolio />
      <ContactSection />
    </>
  );
};

export default Home;
