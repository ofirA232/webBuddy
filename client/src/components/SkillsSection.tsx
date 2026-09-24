import { useMemo } from "react";
import { CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/hooks/useActiveSection";
import { Reveal } from "./motion/Reveal";
import codeEditing_icon from "../assets/codeEditing_icon.svg";
import api_integration_icon from "../assets/api_integration_icon.svg";
import HOSTING_ICON from "../assets/HOSTING_ICON.svg";
import WabsiteMaintaince_icon from "../assets/WabsiteMaintaince_icon.svg";
import reponsive_icon from "../assets/reponsive_icon.svg";
import CMSintegration_icon from "../assets/CMSintegration_icon.svg";
import wireframe_icon from "../assets/wireframe_icon.svg";
import ux_icon from "../assets/ux_icon.svg";
import mockups_icon from "../assets/mockups_icon.svg";
import prototyping_icon from "../assets/prototyping_icon.svg";
import sitemaps_icon from "../assets/sitemaps_icon.svg";
import typography_icon from "../assets/typography_icon.svg";
import assetcreaion_icon from "../assets/assetcreaion_icon.svg";
import logoCreation_icon from "../assets/logoCreation_icon.svg";
import brandguidelines_icon from "../assets/brandguidelines_icon.svg";
import seoAudit_icon from "../assets/seoAudit_icon.svg";
import contentAstrategy_icon from "../assets/contentAstrategy_icon.svg";
import keywordsResarch_icon from "../assets/keywordsResarch_icon.svg";
import linkbuilding_icon from "../assets/linkbuilding_icon.svg";
import optimization_icon from "../assets/optimization_icon.svg";
import schemaMarkup_icon from "../assets/schemaMarkup_icon.svg";
import socialMedia_icon from "../assets/socialMedia_icon.svg";
import videoMarketing_icon from "../assets/videoMarketing_icon.svg";
import analytics_icon from "../assets/analytics_icon.svg";
import capaignManagement_icon from "../assets/capaignManagement_icon.svg";
import contentCreation_icon from "../assets/contentCreation_icon.svg";
import googleAds_icon from "../assets/googleAds_icon.svg";

interface Service {
  /** Anchor id and image file name: assets-src/skills/<key>.png → npm run images */
  key: string;
  title: string;
  description: string;
  /** Local image (webp). Undefined until one is supplied; a gradient panel is shown instead. */
  image?: string;
  /** Icons shown in the placeholder panel while there is no photograph. */
  icons: string[];
  includes: string[];
}

// TODO(user): approve copy; add photos to assets-src/skills/<key>.png and run `npm run images`
const services: Service[] = [
  {
    key: "web-development",
    title: "בניית אתרים",
    description:
      "בניית אתרים מורכבים מאפס: פיתוח תבניות ותוספים מותאמים אישית, עבודה עם Elementor, וחיבור לכל מערכת שהעסק כבר עובד איתה.",
    icons: [codeEditing_icon, CMSintegration_icon, reponsive_icon, HOSTING_ICON, api_integration_icon, WabsiteMaintaince_icon],
    includes: [
      "פיתוח בקוד",
      "אינטגרציית CMS",
      "ריספונסיביות",
      "אחסון אתרים",
      "אינטגרציית API",
      "תחזוקת אתרים",
    ],
  },
  {
    key: "web-design",
    title: "עיצוב אתרים",
    description:
      "עיצוב ממשקים נקיים וברורים: מ-Wireframe ו-Sitemap ועד Mockup ו-Prototype, עם דגש על UI/UX וטיפוגרפיה שמשרתים את המשתמש ואת העסק.",
    icons: [wireframe_icon, sitemaps_icon, typography_icon, prototyping_icon, ux_icon, mockups_icon],
    includes: ["Wireframe", "Sitemaps", "טיפוגרפיה", "Prototyping", "UI/UX", "Mockups"],
  },
  {
    key: "branding",
    title: "מיתוג",
    description:
      "בניית זהות מותגית עקבית: עיצוב לוגו, מדריך מיתוג, טיפוגרפיה ונכסים דיגיטליים שעובדים יחד בכל הערוצים.",
    icons: [logoCreation_icon, brandguidelines_icon, assetcreaion_icon, typography_icon],
    includes: ["עיצוב לוגו", "מדריכי מיתוג", "יצירת נכסים דיגיטליים", "טיפוגרפיה"],
  },
  {
    key: "seo",
    title: "קידום אתרים",
    description:
      "קידום אורגני וממומן: מחקר מילות מפתח, אופטימיזציה טכנית, כתיבת תוכן איכותי ובניית סמכות לאורך זמן.",
    icons: [keywordsResarch_icon, seoAudit_icon, optimization_icon, linkbuilding_icon, contentAstrategy_icon, schemaMarkup_icon],
    includes: [
      "מחקר מילות מפתח",
      "SEO Audit",
      "אופטימיזציה",
      "בניית קישורים",
      "אסטרטגיית תוכן",
      "בניית סכמות",
    ],
  },
  {
    key: "digital-marketing",
    title: "שיווק דיגיטלי",
    description:
      "ניהול קמפיינים בגוגל וברשתות החברתיות, יצירת תוכן ווידאו, ומדידה ואופטימיזציה שוטפת מול הנתונים.",
    icons: [googleAds_icon, contentCreation_icon, socialMedia_icon, videoMarketing_icon, analytics_icon, capaignManagement_icon],
    includes: [
      "גוגל אדס",
      "יצירת תוכן",
      "רשתות חברתיות",
      "שיווק בוידאו",
      "אנליטיקס",
      "ניהול קמפיינים",
    ],
  },
];

const labelClass = "text-[11px] font-medium uppercase tracking-[0.08em] text-white/45";

const SkillsSection = () => {
  // The last service whose heading has passed the reading line, same as the header's tabs.
  const ids = useMemo(() => services.map((service) => `service-${service.key}`), []);
  const active = useActiveSection(ids)?.replace(/^service-/, "");

  return (
    <section id="skills" dir="rtl">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          {/* TODO(user): approve or edit this copy */}
          <p className="section-eyebrow">שירותים</p>
          <h2 className="mt-4 text-4xl font-light leading-tight tracking-tight text-white md:text-6xl">
            בונה, מעצב ומקדם נוכחות דיגיטלית.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
            חמישה תחומים שעובדים יחד: בלי אתר טוב אין מה לקדם, ובלי קידום ותוכן אף אחד לא יגיע אליו.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-x-8 md:mt-24 lg:grid-cols-12">
          {/* Category list, sticky beside the content. On phones it would scroll away
              immediately, so it is left out and the blocks simply stack. */}
          <nav
            className="hidden lg:col-span-4 lg:sticky lg:top-28 lg:block lg:self-start"
            aria-label="תחומי התמחות"
          >
            <p className={labelClass}>כל תחומי ההתמחות</p>
            <ul className="mt-6 flex flex-col gap-y-2">
              {services.map((service) => {
                const isActive = service.key === active;
                return (
                  <li key={service.key}>
                    <a
                      href={`#service-${service.key}`}
                      aria-current={isActive ? "true" : undefined}
                      className={cn("service-nav-link block text-2xl text-white", isActive && "is-active")}
                    >
                      {service.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="lg:col-span-8">
            {services.map((service) => (
              <Reveal
                key={service.key}
                as="section"
                className="border-t border-white/10 py-10 first:border-t-0 first:pt-0 md:py-14 lg:first:pt-0"
              >
                <div id={`service-${service.key}`} className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
                  <div>
                    <h3 className="text-2xl font-light leading-tight tracking-tight text-white md:text-[28px]">
                      {service.title}
                    </h3>
                    <p className="mt-4 max-w-prose text-base leading-relaxed text-white/65">
                      {service.description}
                    </p>

                    <p className={cn(labelClass, "mt-8")}>מה זה כולל:</p>
                    <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2.5">
                      {service.includes.map((item) => (
                        <li key={item} className="grid grid-cols-[auto_1fr] items-start gap-2 text-sm text-white/85">
                          <CircleCheck size={15} className="mt-[3px] text-white/45" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#0f0f0f]">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="media-placeholder--panel flex h-full w-full items-center justify-center"
                      >
                        <div className="grid grid-cols-3 gap-6 opacity-80 md:gap-8">
                          {service.icons.slice(0, 6).map((icon) => (
                            <img key={icon} src={icon} alt="" className="h-9 w-9 md:h-12 md:w-12" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
