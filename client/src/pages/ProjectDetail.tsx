import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { projects } from "@/data/portfolioData";
import { site } from "@/data/site";
import { CaseHero } from "@/components/case-study/CaseHero";
import { CaseIntro, CaseResults, ChallengeSolution } from "@/components/case-study/CaseStory";
import { CaseGallery, StyleGuide, Testimonial } from "@/components/case-study/CaseExtras";
import { CaseCta } from "@/components/case-study/CaseCta";
import { MoreProjects } from "@/components/case-study/MoreProjects";
import NotFound from "./not-found";

/**
 * A project as a case study: the project in its window with the facts beside it, the
 * story, each challenge against its solution, screens, results, the design language and
 * the client's words, then an invitation and the other projects.
 *
 * Every section renders only when the project has content for it (see the Project type),
 * so a case study grows as material is added, with no empty headings in the meantime.
 */
const ProjectDetail = () => {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    if (project) {
      document.title = `${project.title} | ${site.name}`;
    }
  }, [project]);

  if (!project) {
    return <NotFound />;
  }

  return (
    // Keyed by project: moving to another one remounts the page, so its entrance plays again.
    <article key={project.slug} dir="rtl">
      <CaseHero project={project} />
      <CaseIntro project={project} />
      <ChallengeSolution project={project} />
      <CaseGallery project={project} />
      <CaseResults project={project} />
      <StyleGuide project={project} />
      <Testimonial project={project} />
      <CaseCta />
      <MoreProjects current={project} />
    </article>
  );
};

export default ProjectDetail;
