import heroImage from "@/assets/hero/ofir.webp";
import heroImageSmall from "@/assets/hero/ofir@480.webp";
import { site } from "@/data/site";
import { HeroBackground } from "./HeroBackground";
import { ResponsiveImage } from "./ResponsiveImage";

const Hero = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView();
  };

  return (
    <section id="about" className="relative w-full overflow-hidden min-h-[75vh] md:min-h-screen flex items-center">
      <HeroBackground />
      <div className="relative z-10 w-full container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 md:py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Text column */}
          <div className="order-2 md:order-1 flex flex-col justify-center gap-4 md:gap-6 text-right">
            <div className="flex flex-col gap-3 md:gap-4">
              {/* TODO(user): approve or edit this positioning copy */}
              <p className="text-[#ff5c5c] text-sm sm:text-base font-medium tracking-wide">
                {site.name} · {site.role}
              </p>
              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                בונה אתרי וורדפרס שנראים מצוין ומביאים לקוחות
              </h1>
              <p className="text-gray-300 text-base sm:text-lg font-normal leading-relaxed max-w-prose">
                מהאפיון ועד ההשקה: אתרי תדמית, מרכזי ידע ומערכות פנימיות, עם רקע חזק ב-SEO ובאסטרטגיית תוכן. בין היתר הובלתי את בניית האתר החדש של פלאקארד, חברת הסליקה המובילה בישראל.
              </p>
            </div>
            <div>
              <button type="button" onClick={scrollToContact} className="btn-cta">
                יצירת קשר
              </button>
            </div>
          </div>

          {/* Image column */}
          <div className="order-1 md:order-2 flex items-center justify-center">
            <ResponsiveImage
              src={heroImage}
              small={heroImageSmall}
              widths={[480, 960]}
              sizes="(min-width: 768px) 50vw, 100vw"
              alt={`תמונת פרופיל של ${site.name}`}
              width={960}
              height={720}
              priority
              className="w-full h-80 md:h-96 object-cover rounded-xl shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
