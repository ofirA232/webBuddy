import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";
import { revealItem, staggerContainer } from "@/lib/motion";

type Tag = "div" | "section" | "ul" | "li" | "h2" | "p";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds. */
  delay?: number;
  /** Seconds between children. When set, this element is a container and children should be <Reveal.Item>. */
  stagger?: number;
  as?: Tag;
};

/**
 * Reveals content once when it scrolls into view: opacity 0→1 and a 12px rise, 400ms ease-out.
 * Never re-triggers. Under prefers-reduced-motion it only fades (200ms).
 */
export function Reveal({ children, className, delay = 0, stagger, as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion() ?? false;
  const Component = motion[as];
  const variants = stagger !== undefined ? staggerContainer(stagger, delay) : revealItem(reduce, delay);

  return (
    <Component
      ref={ref as never}
      className={className}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {children}
    </Component>
  );
}

type ItemProps = { children: ReactNode; className?: string; as?: Tag };

/** Child of a staggered <Reveal>; inherits the container's initial/animate state. */
function RevealItem({ children, className, as = "div" }: ItemProps) {
  const reduce = useReducedMotion() ?? false;
  const Component = motion[as];
  return (
    <Component className={className} variants={revealItem(reduce)}>
      {children}
    </Component>
  );
}

Reveal.Item = RevealItem;
