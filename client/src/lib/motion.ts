import type { Transition, Variants } from "motion/react";

/**
 * Shared motion vocabulary. Keep in sync with the CSS variables in index.css
 * and `transitionTimingFunction` in tailwind.config.ts.
 */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

export const DUR = {
  press: 0.16,
  exit: 0.15,
  ui: 0.25,
  enter: 0.3,
  reveal: 0.4,
  reduced: 0.2,
} as const;

export const enterTransition: Transition = { duration: DUR.ui, ease: EASE_OUT };
export const exitTransition: Transition = { duration: DUR.exit, ease: EASE_OUT };

/** Scroll/enter reveal for a single item: fade + 12px rise. Reduced motion keeps only the fade. */
export const revealItem = (reduce: boolean, delay = 0): Variants => ({
  hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    ...(reduce ? {} : { y: 0 }),
    transition: { duration: reduce ? DUR.reduced : DUR.reveal, ease: EASE_OUT, delay },
  },
});

/** Parent variants that stagger `revealItem` children. */
export const staggerContainer = (stagger = 0.06, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/** Non-hook check for imperative code (scrollIntoView, view transitions). */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
