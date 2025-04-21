import { skills } from "@/data/portfolioData";

const SkillsSection = () => {
  const handleSkillClick = (skillId: string) => {
    // In a real application, this could show more details about the skill
    console.log(`Clicked on skill: ${skillId}`);
  };

  return (
    <section id="skills" className="mb-8">
      <h2 className="text-[#FFFFFF] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Skills &amp; Expertise</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {skills.map((skill) => (
          <div 
            key={skill.id} 
            className="flex flex-1 gap-3 rounded-lg border border-[#434343] bg-black p-4 items-center hover:bg-[#111111] transition-colors cursor-pointer"
            onClick={() => handleSkillClick(skill.id)}
          >
            <div className="text-[#FFFFFF]">
              <span dangerouslySetInnerHTML={{ __html: skill.icon }} />
            </div>
            <h3 className="text-[#FFFFFF] text-base font-bold leading-tight">{skill.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;
