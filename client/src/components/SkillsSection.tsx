import { useState } from "react";
import { Link } from "react-router-dom";
import codeEditing_icon from "../assets/codeEditing_icon.svg"
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




const SkillsSection = () => {
  // Cards data - creating 5 cards as requested
  const slides = [
    {
      id: 1,
      title: "בניית אתרים",
      image: "https://cdn.prod.website-files.com/671637dedb791904db049377/67c8672d344b5a50f8f427ca_Web%20developer%20finalising%20amends%20on%20new%20website%20layout%20using%20multiple%20computer%20screens-1.avif",
      description: "בניית אתרים מורכבים מאפס, פיתוח תבניות ותוספים מותאמים אישית, עבודה עם Elementor",
      link: "/web-development",
      icons: [
        { icon: codeEditing_icon, text: "פיתוח בקוד" },
        { icon: CMSintegration_icon, text: "אינטגרצית CMS" },
        { icon: reponsive_icon, text: "ריספונסיביות" },
        { icon: HOSTING_ICON, text: "אחסון אתרים" },
        { icon: api_integration_icon, text: "אינטגרצית API" },
        { icon: WabsiteMaintaince_icon, text: "תחזוקת אתרים " }
      ]
    },
    {
      id: 2,
      title: "עיצוב אתרים",
      image: "https://cdn.prod.website-files.com/671637dedb791904db049377/67c8672e674d430d5e133fe3_Modal%20digital%20office%20space%20with%20two%20discussing%20technical%20feasibility%20of%20code%20base-1.avif",
      description: "פיתוח אפליקציות מובייל חדשניות, ממשקי משתמש מותאמים אישית ותכנות צד שרת",
      link: "/web-design",
      icons: [
        { icon: wireframe_icon, text: "Wireframe" },
        { icon: sitemaps_icon, text: "Sitemaps" },
        { icon: typography_icon, text: " טופוגרפיה" },
        { icon: prototyping_icon, text: "Prototyping" },
        { icon: ux_icon, text: "UI/UX" },
        { icon: mockups_icon, text: "Mockups" }
      ]
    },
    {
      id: 3,
      title: "מיתוג",
      image: "https://cdn.prod.website-files.com/671637dedb791904db049377/67c8672dd00eb224bda97f5a_Branding%20Agency%20in%20situ%20artwork%20with%20person%20walking%20past%20in%20dark%20tunnel-1.avif",
      description: "עיצוב חווית משתמש מקיפה, אפיון ממשקים ויצירת רכיבים אינטראקטיביים",
      link: "/branding",
      icons: [
        { icon: logoCreation_icon, text: "עיצוב לוגו" },
        { icon: brandguidelines_icon, text: "מדריכי מיתוג" },
        { icon: assetcreaion_icon, text: "יצירת נכסים דיגיטליים" },
        { icon: typography_icon, text: "טופוגרפיה" }
      ]
    },
    {
      id: 4,
      title: "קידום אתרים",
      image: "https://cdn.prod.website-files.com/671637dedb791904db049377/67c8667441f4c28f3db50371_Search%20engine%20with%20magnifying%20glass%20ready%20to%20search%20the%20World%20Wide%20Web.avif",
      description: "קידום אורגני וממומן (SEO), כתיבת תוכן איכותי, יצירת תוכן ויזואלי לקמפיינים",
      link: "/seo",
      icons: [
        { icon: keywordsResarch_icon, text: "מחקר מילות מפתח  " },
        { icon: seoAudit_icon, text: "SEO Audit" },
        { icon: optimization_icon, text: "אופטימיזציה " },
        { icon: linkbuilding_icon, text: "בניית קישורים" },
        { icon: contentAstrategy_icon, text: "אסטרטגיית תוכן" },
        { icon: schemaMarkup_icon, text: "בניית סכמות" }
      ]
    },
    {
      id: 5,
      title: "שיווק דיגיטלי",
      image: "https://cdn.prod.website-files.com/671637dedb791904db049377/67c866749a64604de0fe7547_Shopify%20HQ%20Logo%20on%20front%20of%20building.avif",
      description: " שיווק דיגיטלי למגוון עסקים",
      link: "/digital-marketing",
      icons: [
        { icon: googleAds_icon, text: "גוגל אדס" },
        { icon: contentCreation_icon, text: "יצירת תוכן" },
        { icon: socialMedia_icon, text: "רשתות חברתיות" },
        { icon: videoMarketing_icon, text: "שיווק בוידאו" },
        { icon: analytics_icon, text: "אנליטיקס" },
        { icon: capaignManagement_icon, text: "ניהול קמפיינים" }
      ]
    }
  ];
  
  const [current, setCurrent] = useState(0);
  
  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  
  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };
  
  const slide = slides[current];
  
  // Format slide number with leading zero
  const formatSlideNumber = (num: number) => {
    return num < 10 ? `0${num}` : num;
  };

  return (
    <section id="skills" className="min-h-screen bg-black overflow-hidden py-8 md:py-12 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl w-full">
        {/* Desktop Counter: Visually Top-Left */}
        <div className="hidden md:flex justify-start mb-8" dir="ltr">
          <div className="flex items-baseline text-4xl font-bold">
            <span className="text-[#666666]">{formatSlideNumber(slides.length)}</span>
            <span className="text-white mx-2">/</span>
            <span className="text-white">{formatSlideNumber(current + 1)}</span>
          </div>
        </div>

        {/* Main Content Row */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-6">
          
          {/* Image Column (Visually Left on Desktop) */}
          {/* For RTL with flex-row: order-2 makes it appear on the left */}
          <div className="w-full md:w-2/3 order-1 md:order-2 relative">
            <div 
              className="block relative w-full h-[250px] sm:h-[300px] md:h-[480px] overflow-hidden transition-transform duration-500 hover:scale-[1.02] rounded-[15px] sm:rounded-[20px] md:rounded-[30px]"
            >
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 right-3 sm:right-4 md:right-6 flex items-center text-white">
                <p className="text-sm sm:text-base md:text-lg font-medium">{slide.title}</p>
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full bg-white mr-2 sm:mr-3"></div>
              </div>
            </div>

            {/* Mobile Navigation Controls - Placed here to be under image on mobile */}
            <div className="flex flex-col items-center gap-4 mt-4 sm:mt-6 md:hidden">
              {/* Counter */}
              <div className="flex items-center justify-center space-x-4">
                <div className="count-column flex items-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    {formatSlideNumber(current + 1)}
                  </h2>
                  <span className="mx-2 text-gray-600">/</span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-500">
                    {formatSlideNumber(slides.length)}
                  </h2>
                </div>
              </div>

              {/* Navigation arrows */}
              <div className="flex justify-center space-x-3 sm:space-x-4">
                <button 
                  onClick={prevSlide} 
                  className="relative w-10 h-10 sm:w-12 sm:h-12 border border-gray-700 text-white hover:bg-gray-800 transition-colors flex items-center justify-center rounded-md"
                  aria-label="previous slide"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button 
                  onClick={nextSlide} 
                  className="relative w-10 h-10 sm:w-12 sm:h-12 border border-gray-700 text-white hover:bg-gray-800 transition-colors flex items-center justify-center rounded-md"
                  aria-label="next slide"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Text & Navigation Column (Visually Right on Desktop) */}
          {/* For RTL with flex-row: order-1 makes it appear on the right */}
          <div className="w-full md:w-1/3 md:text-right text-center flex flex-col justify-between order-2 md:order-1 mt-6 md:mt-0">
            <div className="flex flex-col md:items-end items-center">
              <div className="w-full mb-8 md:mb-12">
                <h3 className="text-2xl md:text-3xl text-white font-bold mb-4">
                  {slide.title}
                </h3>
                <p className="text-[1rem] md:text-[1.125rem] text-gray-300 leading-relaxed">
                  {slide.description}
                </p>
              </div>
              
              {/* Icons grid */}
              <div className="w-full">
                <div className="grid grid-cols-2 gap-x-4 gap-y-4 md:justify-items-start justify-items-center">
                  {slide.icons.map((item, index) => (
                    <div key={index} className="flex items-center md:justify-end justify-center gap-2 text-white">
                      <img src={item.icon} alt={item.text} className="w-5 h-5 md:w-6 md:h-6" />
                      <span className="text-sm whitespace-nowrap">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop Navigation Arrows */}
            <div className="hidden md:flex md:justify-center mt-12">
              <div className="flex gap-3">
                <button 
                  onClick={prevSlide} 
                  className="w-12 h-12 border border-[#333] bg-transparent hover:bg-[#111] transition-colors flex items-center justify-center rounded-md"
                  aria-label="previous slide"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button 
                  onClick={nextSlide} 
                  className="w-12 h-12 border border-[#333] bg-transparent hover:bg-[#111] transition-colors flex items-center justify-center rounded-md"
                  aria-label="next slide"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
