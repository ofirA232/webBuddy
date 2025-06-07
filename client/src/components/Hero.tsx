import { useEffect, useRef, useState } from "react";
import profileImage from "../assets/ofir_4.jpg";
import "./MaskButton.css";

// Global declaration for Vanta
declare global {
  interface Window {
    VANTA: {
      HALO: (config: any) => any;
    };
  }
}

const Hero = () => {
  const heroSectionRef = useRef<HTMLElement>(null);
  const vantaEffectRef = useRef<any>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: '50%', y: '50%' });

  useEffect(() => {
    if (!vantaEffectRef.current && heroSectionRef.current && window.VANTA) {
      vantaEffectRef.current = window.VANTA.HALO({
        el: heroSectionRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        baseColor: 0xc01f1f,
        backgroundColor: 0x0,
        amplitudeFactor: window.innerWidth < 768 ? 1.50 : 2.00,
        size: window.innerWidth < 768 ? 1.00 : 1.50,
        xOffset: window.innerWidth < 768 ? 0.14 : -0.14,
        yOffset: window.innerWidth < 768 ? 0.15 : 0,
        scale: window.innerWidth < 768 ? 0.75 : 1.00,
        scaleMobile: 0.75
      });
    }

    // Cleanup effect on component unmount
    return () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.setOptions({
          amplitudeFactor: window.innerWidth < 768 ? 1.50 : 2.00,
          size: window.innerWidth < 768 ? 1.00 : 1.50,
          xOffset: window.innerWidth < 768 ? 0.24 : -0.24,
          yOffset: window.innerWidth < 768 ? 0.1 : 0,
          scale: window.innerWidth < 768 ? 0.75 : 1.00,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x: `${x}px`, y: `${y}px` });
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const buttonStyle = {
    '--x': mousePos.x,
    '--y': mousePos.y,
    background: isHovered 
      ? `radial-gradient(circle at ${mousePos.x} ${mousePos.y}, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 30%, rgba(255, 255, 255, 1) 100%)`
      : 'white'
  } as React.CSSProperties;

  return (
    <section 
      id="about" 
      ref={heroSectionRef} 
      className="relative w-full h-[75vh] md:h-screen overflow-hidden"
      style={{ 
        position: 'relative',
        width: '100vw',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw'
      }}
    >
      <div className="absolute inset-0 z-0"></div>
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column - Text */}
            <div className="order-2 md:order-1 flex flex-col justify-center gap-4 md:gap-6 text-right">
              <div className="flex flex-col gap-3 md:gap-4">
                <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight">
                  אופיר זנגי
                </h1>
                <p className="text-white text-sm sm:text-base font-normal leading-relaxed max-w-prose">
                  אני מנהל דיגיטל המתמחה בבניית אתרים מרשימים בוורדפרס. מהקונספט ועד ליישום, אני מתמקד ביצירת נוכחות אינטרנטית מעניינת שמביאה תוצאות. עם רקע חזק ב-SEO ואסטרטגיית תוכן, אני מבטיח שכל אתר שאני בונה לא רק נראה נהדר אלא גם מדורג גבוה במנועי חיפוש.
                </p>
              </div>
              <div className="mask-button-container self-start">
                <span className="mask-text">יצירת קשר</span>
              <button
                onClick={scrollToContact}
                  className="mask-button"
                aria-label="יצירת קשר"
              >
                  יצירת קשר
              </button>
              </div>
            </div>
            
            {/* Right column - Image (now on the right) */}
            <div className="order-1 flex items-center justify-center">
              <div
                className="w-full h-80 md:h-96 bg-center bg-no-repeat bg-cover rounded-xl shadow-md"
                style={{
                  backgroundImage: `url(${profileImage})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }}
                aria-label="תמונת פרופיל של אופיר זנגי"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
