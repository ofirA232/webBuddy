import { TransitionLink } from "@/lib/viewTransition";
import { Reveal } from "@/components/motion/Reveal";
import { Crosshairs, GridBackdrop } from "./parts";
import "@/components/CtaButton.css";

/**
 * The invitation at the end of a case study. It sends the visitor to the form on the home
 * page rather than repeating it here, so there is one form to keep working.
 */
export function CaseCta() {
  return (
    <section className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <Reveal className="relative">
        <Crosshairs />
        <div className="relative overflow-hidden border border-white/10 bg-[#070707] px-6 py-14 text-center md:py-20">
          <GridBackdrop className="[mask-image:radial-gradient(ellipse_70%_80%_at_50%_100%,#000_20%,transparent_100%)]" />
          <div className="relative">
            <h2 className="text-3xl font-light leading-tight tracking-tight text-white md:text-5xl">
              רוצה שנדבר על <span className="text-white/45">הפרויקט שלך?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/50 md:text-lg">
              ספר לי מה אתה בונה, ואחזור אליך עם כל המידע שצריך.
            </p>
            {/* The CTA pill's markup, on a link: the label, and the overlay that sweeps in on hover. */}
            <TransitionLink to="/#contact" className="cta-button mt-8">
              <span className="cta-button__label">יצירת קשר</span>
              <span className="cta-button__overlay" aria-hidden="true">
                <span className="cta-button__label">יצירת קשר</span>
              </span>
            </TransitionLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
