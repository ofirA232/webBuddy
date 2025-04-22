import { skills } from "@/data/portfolioData";

const SkillsSection = () => {
  const handleSkillClick = (skillId: string) => {
    // In a real application, this could show more details about the skill
    console.log(`Clicked on skill: ${skillId}`);
  };

  return (
    <section id="skills" className="py-12">
      <h2 className="text-white text-2xl font-bold mb-6">Skills &amp; Expertise</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div 
            key={skill.id} 
            className="flex gap-4 rounded-lg border border-[#333333] bg-black/30 p-5 items-center hover:bg-black/50 transition-colors cursor-pointer"
            onClick={() => handleSkillClick(skill.id)}
          >
            <div className="text-white flex items-center justify-center min-w-[40px]">
              <span dangerouslySetInnerHTML={{ __html: skill.icon }} />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-lg font-semibold mb-1">{skill.name}</h3>
              <p className="text-gray-400 text-sm">
                {skill.id === "wordpress" && "Expert in custom theme development & plugins"}
                {skill.id === "seo" && "Implementing best practices for high rankings"}
                {skill.id === "content" && "Creating engaging and conversion-focused content"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;
