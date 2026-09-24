/**
 * Single source of truth for real-world site values.
 * Components hide anything whose value is an empty string, so nothing fake ships.
 */
export const site = {
  name: "אופיר זנגי",
  role: "מנהל דיגיטל",
  title: "אופיר זנגי | בניית אתרי וורדפרס וניהול דיגיטל",
  description:
    "אופיר זנגי, מנהל דיגיטל ובונה אתרי וורדפרס. אתרי תדמית, מרכזי ידע ומערכות פנימיות, עם דגש על עיצוב, SEO ותוצאות.",
  url: "", // TODO(user): canonical URL, e.g. https://ofirzangi.com (used for og:url)
  email: "", // TODO(user): contact email, shown in the footer when set
  /** Shown as written; the WhatsApp link uses the international form of the same number. */
  phone: "054-914-0830",
  whatsapp: "https://wa.me/972549140830",
  social: {
    github: "https://github.com/ofirA232",
    linkedin: "https://www.linkedin.com/in/ofir-zangi-abc123/",
    twitter: "", // TODO(user): leave empty to hide
  },
  /** `section` is the id the link points at, which is also what the header underlines. */
  navLinks: [
    { to: "/", label: "אודות", hash: "", section: "about" },
    { to: "/#skills", label: "כישורים", hash: "#skills", section: "skills" },
    { to: "/#projects", label: "פרויקטים", hash: "#projects", section: "projects" },
    { to: "/#creative", label: "קריאייטיב", hash: "#creative", section: "creative" },
    { to: "/#contact", label: "יצירת קשר", hash: "#contact", section: "contact" },
  ],
} as const;
