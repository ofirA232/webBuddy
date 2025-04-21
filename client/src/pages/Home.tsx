import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { useScrollToSection } from "@/hooks/useScrollToSection";

const Home = () => {
  // Initialize scroll functionality
  useScrollToSection();

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-black overflow-x-hidden" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <Hero />
            <ProjectsSection />
            <SkillsSection />
            <ContactSection />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
