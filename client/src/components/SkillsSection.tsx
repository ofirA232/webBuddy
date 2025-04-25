import { skills } from "@/data/portfolioData";

const SkillsSection = () => {
  return (
    <section id="skills" className="py-12">
      <h2 className="text-white text-2xl font-bold mb-6 text-right" dir="rtl">כישורים והתמחויות</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div 
            key={skill.id} 
            className="flex gap-4 rounded-lg border border-[#333333] bg-black/30 p-5 items-center hover:bg-black/50 transition-colors cursor-pointer"
            dir="rtl"
          >
            <div className="text-white flex items-center justify-center min-w-[40px]">
              <span dangerouslySetInnerHTML={{ __html: skill.icon }} />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-lg font-semibold mb-1">{skill.name}</h3>
              <p className="text-gray-400 text-sm">
                {skill.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-right" dir="rtl">
        <h3 className="text-white text-lg font-bold mb-4">כישורים בינאישיים</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>יכולת מוכחת לעבודת צוות ושיתוף פעולה יעיל</li>
          <li>יכולת הסתגלות גבוהה והתמודדות עם משימות מורכבות</li>
          <li>חשיבה אנליטית ורמת דיוק גבוהה</li>
          <li>תקשורת בינאישית מצוינת ויכולת הסברה ברורה</li>
          <li>למידה עצמית והתעדכנות מתמדת בטכנולוגיות חדשות</li>
        </ul>
      </div>
    </section>
  );
};

export default SkillsSection;
