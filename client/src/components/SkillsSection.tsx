import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { EASE_OUT, exitTransition, revealItem, staggerContainer } from "@/lib/motion";
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

interface Slide {
  id: number;
  /** File name for the image pipeline: assets-src/skills/<key>.png → npm run images */
  key: string;
  title: string;
  description: string;
  /** Local image (webp). Undefined until the user supplies one; a gradient panel is shown instead. */
  image?: string;
  icons: { icon: string; text: string }[];
}

// TODO(user): approve copy; add photos to assets-src/skills/<key>.png and run `npm run images`
const slides: Slide[] = [
  {
    id: 1,
    key: "web-development",
    title: "בניית אתרים",
    description: "בניית אתרים מורכבים מאפס, פיתוח תבניות ותוספים מותאמים אישית, עבודה עם Elementor",
    icons: [
      { icon: codeEditing_icon, text: "פיתוח בקוד" },
      { icon: CMSintegration_icon, text: "אינטגרציית CMS" },
      { icon: reponsive_icon, text: "ריספונסיביות" },
      { icon: HOSTING_ICON, text: "אחסון אתרים" },
      { icon: api_integration_icon, text: "אינטגרציית API" },
      { icon: WabsiteMaintaince_icon, text: "תחזוקת אתרים" },
    ],
  },
  {
    id: 2,
    key: "web-design",
    title: "עיצוב אתרים",
    description: "עיצוב ממשקים נקיים וברורים: מ-Wireframe ו-Sitemap ועד Mockup ו-Prototype, עם דגש על UI/UX וטיפוגרפיה שמשרתים את המשתמש ואת העסק",
    icons: [
      { icon: wireframe_icon, text: "Wireframe" },
      { icon: sitemaps_icon, text: "Sitemaps" },
      { icon: typography_icon, text: "טיפוגרפיה" },
      { icon: prototyping_icon, text: "Prototyping" },
      { icon: ux_icon, text: "UI/UX" },
      { icon: mockups_icon, text: "Mockups" },
    ],
  },
  {
    id: 3,
    key: "branding",
    title: "מיתוג",
    description: "בניית זהות מותגית עקבית: עיצוב לוגו, מדריך מיתוג, טיפוגרפיה ונכסים דיגיטליים לכל הערוצים",
    icons: [
      { icon: logoCreation_icon, text: "עיצוב לוגו" },
      { icon: brandguidelines_icon, text: "מדריכי מיתוג" },
      { icon: assetcreaion_icon, text: "יצירת נכסים דיגיטליים" },
      { icon: typography_icon, text: "טיפוגרפיה" },
    ],
  },
  {
    id: 4,
    key: "seo",
    title: "קידום אתרים",
    description: "קידום אורגני וממומן (SEO), כתיבת תוכן איכותי, יצירת תוכן ויזואלי לקמפיינים",
    icons: [
      { icon: keywordsResarch_icon, text: "מחקר מילות מפתח" },
      { icon: seoAudit_icon, text: "SEO Audit" },
      { icon: optimization_icon, text: "אופטימיזציה" },
      { icon: linkbuilding_icon, text: "בניית קישורים" },
      { icon: contentAstrategy_icon, text: "אסטרטגיית תוכן" },
      { icon: schemaMarkup_icon, text: "בניית סכמות" },
    ],
  },
  {
    id: 5,
    key: "digital-marketing",
    title: "שיווק דיגיטלי",
    description: "ניהול קמפיינים בגוגל וברשתות החברתיות, יצירת תוכן ווידאו, ומדידה ואופטימיזציה עם אנליטיקס",
    icons: [
      { icon: googleAds_icon, text: "גוגל אדס" },
      { icon: contentCreation_icon, text: "יצירת תוכן" },
      { icon: socialMedia_icon, text: "רשתות חברתיות" },
      { icon: videoMarketing_icon, text: "שיווק בוידאו" },
      { icon: analytics_icon, text: "אנליטיקס" },
      { icon: capaignManagement_icon, text: "ניהול קמפיינים" },
    ],
  },
];

const pad = (num: number) => String(num).padStart(2, "0");

/** Reads "01 / 05" (current / total) regardless of page direction. Digits swap instantly: they are data. */
function Counter({ current, total, className = "" }: { current: number; total: number; className?: string }) {
  return (
    <div dir="ltr" aria-live="polite" className={`flex items-baseline font-bold tabular-nums ${className}`}>
      <span className="text-white">{pad(current + 1)}</span>
      <span className="text-[#666666] mx-2">/</span>
      <span className="text-[#666666]">{pad(total)}</span>
    </div>
  );
}

const arrowButtonClass =
  "pressable-sm w-10 h-10 sm:w-12 sm:h-12 border border-[#333] bg-transparent text-white can-hover:hover:bg-[#111] flex items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";

function Arrows({ onPrev, onNext, className = "" }: { onPrev: () => void; onNext: () => void; className?: string }) {
  return (
    <div className={`flex gap-3 ${className}`}>
      <button type="button" onClick={onPrev} className={arrowButtonClass} aria-label="שקופית קודמת">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" onClick={onNext} className={arrowButtonClass} aria-label="שקופית הבאה">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

type Direction = 1 | -1;

const SkillsSection = () => {
  const [[current, direction], setSlide] = useState<[number, Direction]>([0, 1]);
  const reduce = useReducedMotion() ?? false;

  const prevSlide = () => setSlide(([i]) => [i === 0 ? slides.length - 1 : i - 1, -1]);
  const nextSlide = () => setSlide(([i]) => [i === slides.length - 1 ? 0 : i + 1, 1]);

  const slide = slides[current];

  // Crossfade masked with a little blur so the two slides read as one image changing, not two overlapping.
  // RTL: "next" moves content leftward, so the incoming slide starts slightly to the left (negative x).
  const shift = reduce ? 0 : 12;
  const slideVariants: Variants = {
    enter: (d: Direction) => ({ opacity: 0, filter: "blur(4px)", x: -shift * d }),
    center: { opacity: 1, filter: "blur(0px)", x: 0, transition: { duration: 0.25, ease: EASE_OUT } },
    exit: (d: Direction) => ({ opacity: 0, filter: "blur(4px)", x: shift * d, transition: { duration: 0.15, ease: EASE_OUT } }),
  };

  return (
    <section id="skills" className="min-h-screen bg-black overflow-hidden py-8 md:py-12 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl w-full">
        {/* Desktop counter: top-left */}
        <Reveal className="hidden md:flex justify-start mb-8">
          <Counter current={current} total={slides.length} className="text-4xl" />
        </Reveal>

        <div className="flex flex-col md:flex-row md:items-center md:gap-6">
          {/* Image column (visually left on desktop) */}
          <Reveal delay={0.05} className="w-full md:w-2/3 order-1 md:order-2 relative">
            <div className="relative w-full h-[250px] sm:h-[300px] md:h-[480px] overflow-hidden rounded-[15px] sm:rounded-[20px] md:rounded-[30px] bg-[#0a0a0a]">
              <AnimatePresence mode="sync" custom={direction} initial={false}>
                <motion.div
                  key={slide.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0"
                >
                  {slide.image ? (
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="w-full h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,rgba(192,31,31,0.55),transparent_60%),linear-gradient(135deg,#1a1a1a,#0a0a0a)]"
                    >
                      <div className="grid grid-cols-3 gap-6 sm:gap-8 md:gap-10 opacity-80">
                        {slide.icons.slice(0, 6).map((item) => (
                          <img key={item.text} src={item.icon} alt="" className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16" />
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 right-3 sm:right-4 md:right-6 flex items-center text-white">
                    <p className="text-sm sm:text-base md:text-lg font-medium">{slide.title}</p>
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full bg-white mr-2 sm:mr-3"></div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Mobile controls under the image */}
            <div className="flex flex-col items-center gap-4 mt-4 sm:mt-6 md:hidden">
              <Counter current={current} total={slides.length} className="text-2xl sm:text-3xl" />
              <Arrows onPrev={prevSlide} onNext={nextSlide} />
            </div>
          </Reveal>

          {/* Text column (visually right on desktop). min-height keeps the arrows from jumping between slides. */}
          <Reveal delay={0.1} className="w-full md:w-1/3 md:text-right text-center flex flex-col justify-between order-2 md:order-1 mt-6 md:mt-0 md:min-h-[400px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={slide.id}
                variants={staggerContainer(0.03)}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, transition: exitTransition }}
                className="flex flex-col md:items-end items-center"
              >
                <div className="w-full mb-8 md:mb-12">
                  <motion.h3 variants={revealItem(reduce)} className="text-2xl md:text-3xl text-white font-bold mb-4">
                    {slide.title}
                  </motion.h3>
                  <motion.p variants={revealItem(reduce)} className="text-[1rem] md:text-[1.125rem] text-gray-300 leading-relaxed">
                    {slide.description}
                  </motion.p>
                </div>

                <div className="w-full">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4 md:justify-items-start justify-items-center">
                    {slide.icons.map((item) => (
                      <motion.div
                        key={item.text}
                        variants={revealItem(reduce)}
                        className="flex items-center md:justify-end justify-center gap-2 text-white"
                      >
                        <img src={item.icon} alt="" className="w-5 h-5 md:w-6 md:h-6" />
                        <span className="text-sm whitespace-nowrap">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="hidden md:flex md:justify-center mt-12">
              <Arrows onPrev={prevSlide} onNext={nextSlide} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
