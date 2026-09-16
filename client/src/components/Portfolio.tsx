import { useState } from "react";
import { Link } from "react-router-dom";
import { Section } from "./section.js";
import { cn } from "@/lib/utils";
import { projects } from "@/data/portfolioData";
import { ProjectPlaceholder } from "./ProjectPlaceholder";
import { ResponsiveImage } from "./ResponsiveImage";

type Category = 'all' | 'webDev' | 'webDesign' | 'branding' | 'seo' | 'digitalMarketing';

interface CategoryInfo {
  id: Category;
  label: string;
  icon: JSX.Element;
}

const categories: CategoryInfo[] = [
  {
    id: 'all',
    label: 'הכל',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
      </svg>
    )
  },
  {
    id: 'webDev',
    label: 'בניית אתרים',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    )
  },
  {
    id: 'webDesign',
    label: 'עיצוב אתרים',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M16 18l6-6-6-6" />
        <path d="M8 6l-6 6 6 6" />
      </svg>
    )
  },
  {
    id: 'branding',
    label: 'מיתוג',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
        <line x1="16" y1="8" x2="2" y2="22" />
        <line x1="17.5" y1="15" x2="9" y2="15" />
      </svg>
    )
  },
  {
    id: 'seo',
    label: 'קידום אתרים',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    )
  },
  {
    id: 'digitalMarketing',
    label: 'שיווק דיגיטלי',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 20v-6M6 20V10M18 20V4" />
      </svg>
    )
  }
];

export function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(project => project.categories.includes(selectedCategory));

  return (
    <Section id="projects" className="bg-background py-8 sm:py-12 md:py-24">
      <div className="container mx-auto px-4" dir="rtl">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 md:mb-6">הפרויקטים שלי</h2>
          <p className="text-[1rem] md:text-[1.125rem] text-gray-300 leading-relaxed">
            תיק העבודות שלי משקף את עומק המומחיות שלי ואת האמון שלקוחותי נותנים בי.
            כל פרויקט מדגים מחויבות למצוינות בעיצוב, טכנולוגיות מתקדמות ותוצאות מדידות.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8 md:mb-12" role="group" aria-label="סינון לפי קטגוריה">
          {categories.map((category) => {
            const selected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                aria-pressed={selected}
                className={cn(
                  "inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm border transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                  selected
                    ? "bg-white text-black border-white"
                    : "bg-[#1a1a1a] text-gray-300 border-[#333333] hover:bg-[#2a2a2a] hover:text-white"
                )}
              >
                {category.icon}
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <p className="text-center text-gray-500 py-12">אין עדיין פרויקטים בקטגוריה זו.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/project/${project.slug}`}
                className="group block overflow-hidden rounded-lg border border-[#262626] bg-[#0d0d0d] transition-colors hover:border-[#444444] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <div className="aspect-[16/9] w-full overflow-hidden bg-[#161616]">
                  {project.image ? (
                    <ResponsiveImage
                      src={project.image}
                      small={project.imageSmall}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      alt=""
                      className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <ProjectPlaceholder title={project.title} />
                  )}
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1">{project.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{project.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
