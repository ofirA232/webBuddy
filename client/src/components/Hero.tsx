import { useMemo, type CSSProperties, type PointerEvent } from "react";
import { useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import heroImage from "@/assets/hero/ofir.webp";
import heroImageSmall from "@/assets/hero/ofir@480.webp";
import { site } from "@/data/site";
import { canHover } from "@/lib/motion";
import { HeroBackground } from "./HeroBackground";
import { ResponsiveImage } from "./ResponsiveImage";
import { CtaButton } from "./CtaButton";

const PARALLAX_PX = 8;

const Hero = () => {
  // Pointer parallax on the aurora only (never on text or the photo). Mouse only, off under reduced motion.
  const reduce = useReducedMotion();
  const parallaxEnabled = useMemo(() => !reduce && canHover(), [reduce]);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 100, damping: 20 });
  const sy = useSpring(my, { stiffness: 100, damping: 20 });
  const parallax = useMotionTemplate`translate3d(${sx}px, ${sy}px, 0)`;

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!parallaxEnabled || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set(((event.clientX - rect.left) / rect.width - 0.5) * PARALLAX_PX * 2);
    my.set(((event.clientY - rect.top) / rect.height - 0.5) * PARALLAX_PX * 2);
  };

  const handlePointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView();
  };

  const item = (index: number) => ({ "--i": index }) as CSSProperties;

  return (
    <section
      id="about"
      className="relative w-full overflow-hidden min-h-[75svh] md:min-h-svh flex items-center"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <HeroBackground parallax={parallaxEnabled ? parallax : undefined} />
      <div className="relative z-10 w-full container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 md:py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Text column */}
          <div className="order-2 md:order-1 flex flex-col justify-center gap-4 md:gap-6 text-right">
            <div className="flex flex-col gap-3 md:gap-4">
              {/* TODO(user): approve or edit this positioning copy */}
              <p className="hero-item text-[rgb(var(--accent-soft))] text-sm sm:text-base font-medium tracking-wide" style={item(0)}>
                {site.name} · {site.role}
              </p>
              <h1
                className="hero-item text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight"
                style={item(1)}
              >
                בונה אתרי וורדפרס שנראים מצוין ומביאים לקוחות
              </h1>
              <p className="hero-item text-gray-300 text-base sm:text-lg font-normal leading-relaxed max-w-prose" style={item(2)}>
                מהאפיון ועד ההשקה: אתרי תדמית, מרכזי ידע ומערכות פנימיות, עם רקע חזק ב-SEO ובאסטרטגיית תוכן. בין היתר הובלתי את בניית האתר החדש של פלאקארד, חברת הסליקה המובילה בישראל.
              </p>
            </div>
            <div className="hero-item" style={item(3)}>
              <CtaButton onClick={scrollToContact} variant="accent">יצירת קשר</CtaButton>
            </div>
          </div>

          {/* Image column */}
          <div className="order-1 md:order-2 flex items-center justify-center">
            <div className="hero-photo w-full">
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
      </div>
    </section>
  );
};

export default Hero;
