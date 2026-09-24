import { useEffect, useRef, useState } from "react";
import { motion, type MotionValue } from "motion/react";

type Props = {
  /** Optional transform string (e.g. from useMotionTemplate) for a subtle pointer parallax on the blobs. */
  parallax?: MotionValue<string>;
};

/**
 * CSS-only aurora: three soft radial-gradient blobs drifting slowly on black.
 * No WebGL, no external scripts. Static under prefers-reduced-motion (see index.css).
 * Blob sizes use max(vw, px) so phones still get a visible glow.
 *
 * The drift pauses once the hero has scrolled away: three viewport-sized layers kept
 * animating out of sight cost GPU time and battery for nothing anyone can see.
 */
export function HeroBackground({ parallax }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [offscreen, setOffscreen] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-black"
      data-paused={offscreen || undefined}
    >
      <motion.div className="absolute inset-0" style={parallax ? { transform: parallax } : undefined}>
        <div className="aurora-blob aurora-blob--core left-[-10%] top-[-20%] w-[max(70vw,640px)] h-[max(70vw,640px)]" />
        <div className="aurora-blob aurora-blob--warm right-[-15%] top-[0%] w-[max(55vw,460px)] h-[max(55vw,460px)] [animation-delay:-9s] [animation-duration:30s]" />
        <div className="aurora-blob aurora-blob--deep left-[20%] bottom-[-30%] w-[max(60vw,520px)] h-[max(60vw,520px)] [animation-delay:-16s] [animation-duration:36s]" />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.9)_100%)]" />
    </div>
  );
}
