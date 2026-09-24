import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A screenshot presented the way hero-section06 (21st.dev) presents its dashboard: dashed
 * rings radiating from behind the top edge, a soft glow under that edge, and the image in a
 * double frame (an outer glass rim, an inner bezel) that dissolves into the page below.
 *
 * Adapted for this site rather than copied: the original is Next.js (next/image, next/link)
 * and blue; here it is a plain container for any image, in white on black, and the rings are
 * static paths only. The original's OrbitingCircles also animates icons along the rings,
 * which this does not use, and a glow that pulses forever would be motion with no purpose.
 */

type RingsProps = { className?: string };

/** One dashed circle, sized by its box. r="49.5%" keeps the stroke inside the box. */
function Ring({ className }: RingsProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2", className)}
    >
      <circle cx="50%" cy="50%" r="49.5%" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
    </svg>
  );
}

export function ScreenShowcase({
  children,
  className,
  fade = true,
}: {
  children: ReactNode;
  className?: string;
  /** A gradient over the bottom half, dissolving the screen into the page. Off to show it whole. */
  fade?: boolean;
}) {
  return (
    <div className={cn("relative isolate", className)}>
      {/* Rings centred on the frame's top edge, so they rise from behind it like arcs. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 text-white/[0.09]">
        <Ring className="size-[440px] md:size-[640px]" />
        <Ring className="size-[620px] md:size-[880px]" />
        <Ring className="size-[800px] md:size-[1120px]" />
      </div>

      {/* The glow sits on the top edge, where the rings meet the frame. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-24 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 blur-[4rem] lg:h-40 lg:w-3/4 lg:blur-[7rem]"
      />

      {/* Outer rim: glass over the rings. Inner bezel: the screen itself. */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-lg lg:rounded-[32px] lg:p-2">
        <div className="overflow-hidden rounded-lg border border-white/10 bg-black lg:rounded-[22px]">{children}</div>
      </div>

      {fade && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent"
        />
      )}
    </div>
  );
}
