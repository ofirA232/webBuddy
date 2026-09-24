import * as React from "react";

import {
  type HTMLMotionProps,
  type MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Scroll-linked gallery wall: the grid starts laid flat and stands upright as the
 * section scrolls past, with the columns drifting at different speeds.
 *
 * Every animated property is a transform (rotateX / scale / y) driven straight off
 * `scrollYProgress`, which is what lets Motion run the whole thing on the compositor.
 *
 * Reduced motion is handled here rather than by the caller: each piece falls back to
 * a plain, static grid, and `ContainerScroll` collapses its scroll runway so the
 * section does not become screens of empty scrolling for someone who sees no reveal.
 */

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>;
  /** True when the visitor asked for less motion; children render flat. */
  reduce: boolean;
}

const ContainerScrollContext = React.createContext<ContainerScrollContextValue | undefined>(
  undefined,
);

function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext);
  if (!context) {
    throw new Error("useContainerScrollContext must be used within a ContainerScroll component");
  }
  return context;
}

export const ContainerScroll = ({
  children,
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scrollRef });
  const reduce = useReducedMotion() ?? false;

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress, reduce }}>
      <div
        ref={scrollRef}
        // The tall runway is what the reveal is scrubbed against, so it goes when the
        // reveal does; `className` still wins for anything the caller sets deliberately.
        className={cn(reduce ? "relative" : "relative min-h-[120vh]", className)}
        style={{
          perspective: "1000px",
          perspectiveOrigin: "center top",
          transformStyle: "preserve-3d",
          ...style,
          ...(reduce ? { height: "auto", minHeight: 0 } : null),
        }}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  );
};
ContainerScroll.displayName = "ContainerScroll";

export const ContainerSticky = ({
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { reduce } = useContainerScrollContext();
  return (
    <div
      className={cn(
        reduce ? "relative w-full" : "sticky left-0 top-0 min-h-[30rem] w-full overflow-hidden",
        className,
      )}
      style={{
        perspective: "1000px",
        perspectiveOrigin: "center top",
        transformStyle: "preserve-3d",
        transformOrigin: "50% 50%",
        ...style,
        ...(reduce ? { position: "relative", height: "auto", minHeight: 0 } : null),
      }}
      {...props}
    />
  );
};
ContainerSticky.displayName = "ContainerSticky";

export const GalleryContainer = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ children, className, style, ...props }, ref) => {
    const { scrollYProgress, reduce } = useContainerScrollContext();
    // Flat-to-upright over the first half of the runway, then settling out of the zoom.
    const rotateX = useTransform(scrollYProgress, [0, 0.5], [75, 0]);
    const scale = useTransform(scrollYProgress, [0.5, 0.9], [1.2, 1]);

    return (
      <motion.div
        ref={ref}
        className={cn("relative grid size-full grid-cols-3 gap-2 rounded-2xl", className)}
        style={{
          ...(reduce ? null : { rotateX, scale }),
          transformStyle: "preserve-3d",
          perspective: "1000px",
          ...style,
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);
GalleryContainer.displayName = "GalleryContainer";

export const GalleryCol = ({
  className,
  style,
  yRange = ["0%", "-10%"],
  scrollRange = [0.5, 1],
  ...props
}: HTMLMotionProps<"div"> & {
  yRange?: string[];
  /**
   * The slice of the section's scroll that the drift is spread over. Ending before 1
   * leaves the wall still at the end of the section, which is what lets the pieces the
   * drift has just brought into frame be looked at rather than glimpsed.
   */
  scrollRange?: [number, number];
}) => {
  const { scrollYProgress, reduce } = useContainerScrollContext();
  const y = useTransform(scrollYProgress, scrollRange, yRange);

  return (
    <motion.div
      className={cn("relative flex w-full flex-col gap-2", className)}
      style={{ ...(reduce ? null : { y }), ...style }}
      {...props}
    />
  );
};
GalleryCol.displayName = "GalleryCol";
