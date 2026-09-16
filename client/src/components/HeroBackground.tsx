import { motion, type MotionValue } from "motion/react";

type Props = {
  /** Optional transform string (e.g. from useMotionTemplate) for a subtle pointer parallax on the blobs. */
  parallax?: MotionValue<string>;
};

/**
 * CSS-only aurora: three soft radial-gradient blobs drifting slowly on black.
 * No WebGL, no external scripts. Static under prefers-reduced-motion (see index.css).
 * Blob sizes use max(vw, px) so phones still get a visible glow.
 */
export function HeroBackground({ parallax }: Props) {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-black">
      <motion.div className="absolute inset-0" style={parallax ? { transform: parallax } : undefined}>
        <div className="aurora-blob left-[-10%] top-[-20%] w-[max(70vw,640px)] h-[max(70vw,640px)] bg-[radial-gradient(closest-side,rgba(192,31,31,0.8),transparent)]" />
        <div className="aurora-blob right-[-15%] top-[0%] w-[max(55vw,460px)] h-[max(55vw,460px)] bg-[radial-gradient(closest-side,rgba(255,120,60,0.45),transparent)] [animation-delay:-9s] [animation-duration:30s]" />
        <div className="aurora-blob left-[20%] bottom-[-30%] w-[max(60vw,520px)] h-[max(60vw,520px)] bg-[radial-gradient(closest-side,rgba(160,20,40,0.65),transparent)] [animation-delay:-16s] [animation-duration:36s]" />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.9)_100%)]" />
    </div>
  );
}
