import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Quote } from "lucide-react";
import type { Project } from "@/data/portfolioData";
import { EASE_OUT, DUR } from "@/lib/motion";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { Reveal } from "@/components/motion/Reveal";
import { CaseSection } from "./parts";

const container = "container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

type GalleryImage = NonNullable<Project["gallery"]>[number];

/**
 * One wide screen, uncovered from the top as it scrolls in. A clip rather than a slide,
 * so the image never moves: it is the thing being looked at, and it holds still for it.
 * Reduced motion keeps only a fade.
 */
function GalleryShot({ image }: { image: GalleryImage }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduce = useReducedMotion();

  const hidden = reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" };
  const shown = reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" };

  return (
    <motion.div
      ref={ref}
      initial={hidden}
      animate={inView ? shown : hidden}
      transition={{ duration: reduce ? DUR.reduced : 0.8, ease: EASE_OUT }}
      className="overflow-hidden rounded-xl border border-white/10 bg-[#141414]"
      style={{ aspectRatio: image.ratio ?? 16 / 9 }}
    >
      <ResponsiveImage
        src={image.src}
        small={image.small}
        sizes="(min-width: 1344px) 1280px, 100vw"
        alt={image.alt}
        className="h-full w-full object-cover object-top"
      />
    </motion.div>
  );
}

export function CaseGallery({ project }: { project: Project }) {
  if (!project.gallery?.length) return null;
  return (
    <section className={`${container} space-y-6 py-10 md:space-y-10 md:py-14`}>
      <h2 className="sr-only">צילומי מסך</h2>
      {project.gallery.map((image) => (
        <GalleryShot key={image.src} image={image} />
      ))}
    </section>
  );
}

/** The project's typefaces and main colours, the way a style guide's first page shows them. */
export function StyleGuide({ project }: { project: Project }) {
  const guide = project.styleGuide;
  if (!guide || (guide.fonts.length === 0 && guide.colors.length === 0)) return null;

  return (
    <CaseSection label="שפה עיצובית" title="Style guide">
      <Reveal>
        {guide.fonts.length > 0 && (
          <ul className="mb-8 flex flex-wrap gap-x-10 gap-y-3">
            {guide.fonts.map((font) => (
              <li key={font} dir="ltr" className="text-2xl font-light text-white">
                {font}
              </li>
            ))}
          </ul>
        )}
        {guide.colors.length > 0 && (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {guide.colors.map((color) => (
              <li key={color.hex}>
                <div
                  className="aspect-[4/3] rounded-lg border border-white/10"
                  style={{ backgroundColor: color.hex }}
                  aria-hidden="true"
                />
                <p dir="ltr" className="mt-2.5 text-right font-mono text-sm uppercase text-white/80">
                  {color.hex}
                </p>
                {color.name && <p className="text-xs text-white/45">{color.name}</p>}
              </li>
            ))}
          </ul>
        )}
      </Reveal>
    </CaseSection>
  );
}

/** The client in their own words. Only ever a real quote, used with permission. */
export function Testimonial({ project }: { project: Project }) {
  const quote = project.testimonial;
  if (!quote) return null;

  return (
    <CaseSection label="מה אמרו">
      <Reveal as="div">
        <figure>
          <Quote size={32} className="text-white/25" aria-hidden="true" />
          <blockquote className="mt-5 text-2xl font-light leading-relaxed text-white md:text-3xl">
            {quote.quote}
          </blockquote>
          <figcaption className="mt-8 flex items-center gap-4">
            {quote.logo && <img src={quote.logo} alt="" className="h-10 w-auto object-contain" />}
            <span>
              <span className="block text-base font-medium text-white">{quote.name}</span>
              {quote.role && <span className="block text-sm text-white/50">{quote.role}</span>}
            </span>
          </figcaption>
        </figure>
      </Reveal>
    </CaseSection>
  );
}
