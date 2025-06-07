import { useState } from "react";
import { Section } from "./section.js";
import { cn } from "@/lib/utils";
import { projects as portfolioProjects } from "@/data/portfolioData";
import { useNavigate } from "react-router-dom";

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
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
      </svg>
    )
  },
  {
    id: 'webDev',
    label: 'בניית אתרים',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 18l6-6-6-6" />
        <path d="M8 6l-6 6 6 6" />
      </svg>
    )
  },
  {
    id: 'branding',
    label: 'מיתוג',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    )
  },
  {
    id: 'digitalMarketing',
    label: 'שיווק דיגיטלי',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 20v-6M6 20V10M18 20V4" />
      </svg>
    )
  }
];

// Extend the Project type with categories
interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  categories: Category[];
  client: string;
  link: string;
}

// Convert and extend the existing projects data
const projects: Project[] = portfolioProjects.map(project => ({
  id: project.id,
  title: project.title,
  description: project.description,
  image: project.imageUrl,
  categories: project.categories,
  client: project.role || "לא צוין",
  link: project.demoUrl || project.githubUrl || "#"
}));

export function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const navigate = useNavigate();

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(project => project.categories.includes(selectedCategory));

  const handleProjectClick = (projectId: number) => {
    const project = portfolioProjects.find(p => p.id === projectId);
    if (project) {
      navigate(`/project/${project.slug}`);
    }
  };

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
        <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8 md:mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-colors",
                "hover:bg-primary/10",
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              {category.icon}
              <span className="mr-1.5 sm:mr-2">{category.label}</span>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-lg bg-secondary/50 cursor-pointer"
              onClick={() => handleProjectClick(project.id)}
            >
              <div className="aspect-[16/9] w-full overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0 p-3 sm:p-4 md:p-6 flex flex-col justify-end">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2">{project.title}</h3>
                <p className="text-xs sm:text-sm text-white/80 line-clamp-2">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
} 