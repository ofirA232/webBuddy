import pelecardImage from "../assets/pelecard-website.png";

export interface Project {
  id: number;
  title: string;
  slug: string;
  imageUrl: string;
  description: string;
  fullDescription?: string;
  technologies?: string[];
  features?: string[];
  role?: string;
  demoUrl?: string;
  githubUrl?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Pelecard Website",
    slug: "pelecard-website",
    imageUrl: pelecardImage,
    description: "A corporate website for payment solutions provider with modern design and user-friendly interface.",
    fullDescription: "פלקארד היא חברה מובילה בתחום פתרונות התשלום באינטרנט בישראל. עבדתי על עיצוב מחדש של האתר הראשי שלהם, תוך יצירת חווית משתמש נקייה ומשופרת. האתר החדש מדגיש את המוצרים והשירותים העיקריים של החברה ומשפר את הנגישות למידע חשוב עבור לקוחות פוטנציאליים וקיימים.",
    technologies: ["WordPress", "CSS3", "JavaScript", "PHP", "Responsive Design"],
    features: [
      "ממשק משתמש דו-לשוני (עברית ואנגלית)",
      "אינטגרציה של מערכת תשלומים",
      "טפסי יצירת קשר מותאמים אישית",
      "חיפוש מתקדם",
      "התאמה למובייל"
    ],
    role: "מנהל פרויקט, מפתח ראשי",
    demoUrl: "https://www.pelecard.com"
  },
  {
    id: 2,
    title: "Knowledge Center",
    slug: "knowledge-center",
    imageUrl: "https://cdn.usegalileo.ai/sdxl10/259b16b4-8954-4a08-ab3c-4787783e6420.png",
    description: "A comprehensive documentation platform with searchable resources and interactive guides.",
    fullDescription: "מרכז הידע הוא פלטפורמה מקיפה המאחדת את כל המשאבים, המדריכים והתיעוד של החברה במקום אחד. הפלטפורמה כוללת מערכת חיפוש חכמה, קטגוריות ברורות, ותוכן אינטראקטיבי שעוזר למשתמשים למצוא בדיוק את המידע שהם מחפשים.",
    technologies: ["React", "Node.js", "Algolia Search", "Markdown", "MongoDB"],
    features: [
      "חיפוש מהיר ומדויק",
      "קטגוריות מובנות",
      "מדריכים אינטראקטיביים",
      "אפשרות להגיב ולדרג תוכן",
      "תצוגת מובייל מותאמת"
    ],
    role: "מפתח Full-Stack, מעצב UX"
  },
  {
    id: 3,
    title: "Dev Portal",
    slug: "dev-portal",
    imageUrl: "https://cdn.usegalileo.ai/sdxl10/d3cf5e9a-31a1-45f0-b08c-38dfe9c421b7.png",
    description: "A developer hub featuring API documentation, code examples, and implementation tutorials.",
    fullDescription: "פורטל המפתחים הוא פלטפורמה ייעודית למפתחים המשתמשים ב-API של החברה. הפורטל כולל תיעוד מפורט, דוגמאות קוד, סביבת בדיקות אינטראקטיבית, ופורומים לשאלות ותמיכה. הפרויקט נבנה במטרה לשפר את חווית המפתח ולהאיץ את הזמן לשוק של אינטגרציות.",
    technologies: ["React", "TypeScript", "Swagger", "OAuth", "GraphQL"],
    features: [
      "תיעוד API אינטראקטיבי",
      "סביבת בדיקות מובנית",
      "דוגמאות קוד בשפות שונות",
      "מדריכי הטמעה מפורטים",
      "פורום תמיכה למפתחים"
    ],
    role: "מפתח Frontend, מומחה API"
  },
  {
    id: 4,
    title: "WatchyWatch",
    slug: "watchy-watch",
    imageUrl: "https://cdn.usegalileo.ai/sdxl10/92b3ef47-a879-4cda-a3c6-08eb2ec2faa3.png",
    description: "A streaming platform for curated video content with personalized recommendations.",
    fullDescription: "WatchyWatch היא פלטפורמת סטרימינג המציעה תוכן וידאו מקורי וקורטד. הפלטפורמה כוללת מנוע המלצות מתקדם המבוסס על בינה מלאכותית, המותאם אישית להעדפות הצפייה של כל משתמש. הפרויקט כלל פיתוח מקיף של צד שרת וצד לקוח, כולל טיפול באתגרים של סטרימינג וידאו בזמן אמת.",
    technologies: ["Vue.js", "Python", "Django", "AWS", "Machine Learning"],
    features: [
      "מנוע המלצות אישי",
      "סטרימינג באיכות גבוהה",
      "חיפוש מתקדם לפי ז'אנרים וקטגוריות",
      "אפשרות יצירת רשימות צפייה",
      "מעקב אחרי היסטוריית צפייה"
    ],
    role: "ארכיטקט מערכת, מפתח Backend"
  },
  {
    id: 5,
    title: "Tripy",
    slug: "tripy",
    imageUrl: "https://cdn.usegalileo.ai/sdxl10/259b16b4-8954-4a08-ab3c-4787783e6420.png",
    description: "A travel planning application with itinerary builder and destination guides.",
    fullDescription: "Tripy הוא אפליקציית תכנון טיולים המאפשרת למשתמשים ליצור מסלולי טיול מותאמים אישית. האפליקציה כוללת מידע מקיף על יעדים, אטרקציות, מסעדות ומלונות, וכן כלי תכנון אינטראקטיבי המאפשר למשתמשים לארגן את הביקור שלהם לפי ימים ושעות.",
    technologies: ["React Native", "Firebase", "Google Maps API", "Node.js", "Express"],
    features: [
      "בניית מסלולי טיול לפי ימים",
      "מידע מפורט על אטרקציות",
      "מפות אינטראקטיביות",
      "המלצות מותאמות אישית",
      "שיתוף מסלולים עם חברים"
    ],
    role: "מפתח אפליקציות מובייל, מנהל מוצר"
  }
];

export const skills = [
  {
    id: "wordpress",
    name: "WordPress Development",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
      <path
        d="M240,149.31c0,16.11-3.17,29.89-9.17,39.84-7.43,12.33-19,18.85-33.39,18.85-27.94,0-47.78-37-68.78-76.22C111.64,100,92.35,64,74,64c-9.38,0-19.94,10-28.25,26.67A138.18,138.18,0,0,0,32,149.31c0,13.2,2.38,24.12,6.88,31.58S49.82,192,58.56,192c15.12,0,30.85-24.54,44.23-48.55a8,8,0,0,1,14,7.8C101.46,178.71,83.07,208,58.56,208c-14.41,0-26-6.52-33.39-18.85-6-10-9.17-23.73-9.17-39.84A154.81,154.81,0,0,1,31.42,83.54C42.82,60.62,57.94,48,74,48c27.94,0,47.77,37,68.78,76.22C159.8,156,179.09,192,197.44,192c9.38,0,19.94-10,28.25-26.67A138.18,138.18,0,0,0,240,106.69a8,8,0,0,1,16,0v42.62Z"
      ></path>
    </svg>`
  },
  {
    id: "seo",
    name: "SEO Optimization",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
      <path
        d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
      ></path>
    </svg>`
  },
  {
    id: "content",
    name: "Content Strategy",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
      <path
        d="M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H192a8,8,0,0,0,0-16H115.32l112-112A16,16,0,0,0,227.32,73.37ZM192,84.69,171.31,64,192,43.31,212.69,64ZM48,163.31l88-88L156.69,96l-88,88H48Zm144-44.68L147.32,74l24-24L216,94.63Z"
      ></path>
    </svg>`
  }
];
