import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import heroImage from "@/assets/hero/ofir.webp";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";

/**
 * Opening title: the name rises letter by letter, a panel opens between the two words,
 * and it grows to fill the screen before the site is handed over.
 *
 * Shown once per browser session, so returning to the tab or moving between pages does not
 * replay it. Flip this to false to play it on every load.
 */
const ONCE_PER_SESSION = true;
const SESSION_KEY = "intro-played";

const FIRST_NAME = "OFIR";
const LAST_NAME = "ZANGI";

/**
 * The panel at its first, small size, before it takes over the screen. It keeps the height
 * of the letters, so it reads as a window cut into the name rather than a floating box.
 */
const PANEL_WIDTH_RATIO = 0.24;
const PANEL_MIN_WIDTH = 126;
const PANEL_MAX_WIDTH = 340;

const LETTER_STAGGER = 0.045;
const LETTERS_DURATION = 0.55;
/** When the panel starts opening, measured from the first letter. */
const PANEL_DELAY = 0.8;
/** Opens to a small panel, sits there long enough to register, then fills the screen. */
const PANEL_OPEN = 0.4;
const PANEL_HOLD = 0.18;
const PANEL_EXPAND = 0.8;
const HOLD_BEFORE_HANDOFF = 0.1;

const PANEL_TOTAL = PANEL_OPEN + PANEL_HOLD + PANEL_EXPAND;
const TOTAL = PANEL_DELAY + PANEL_TOTAL + HOLD_BEFORE_HANDOFF;

type Geometry = { strip: string; panel: string; full: string; shift: number };

function measure(word: HTMLElement | null): Geometry | null {
  if (!word) return null;
  const rect = word.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const panelWidth = Math.min(Math.max(vw * PANEL_WIDTH_RATIO, PANEL_MIN_WIDTH), PANEL_MAX_WIDTH);
  const top = Math.round(rect.top);
  const bottom = Math.round(vh - rect.bottom);
  const side = Math.round((vw - panelWidth) / 2);
  return {
    // A zero-width sliver on the baseline of the name.
    strip: `inset(${top}px 50% ${bottom}px 50%)`,
    // Open to a panel the height of the letters.
    panel: `inset(${top}px ${side}px ${bottom}px ${side}px)`,
    full: "inset(0px 0px 0px 0px)",
    shift: panelWidth / 2 + 8,
  };
}

function Word({ text, delayOffset }: { text: string; delayOffset: number }) {
  return (
    <span className="flex">
      {text.split("").map((letter, index) => (
        <span key={`${letter}-${index}`} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: LETTERS_DURATION,
              ease: EASE_OUT,
              delay: (delayOffset + index) * LETTER_STAGGER,
            }}
          >
            {letter}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function IntroScreen() {
  const reduce = useReducedMotion();
  const wordRef = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    if (ONCE_PER_SESSION) {
      try {
        if (window.sessionStorage.getItem(SESSION_KEY)) return false;
      } catch {
        // Private mode and blocked storage just mean the intro plays again.
      }
    }
    return true;
  });

  // Skipped entirely for anyone who asked for less motion.
  const active = visible && !reduce;

  const finish = useCallback(() => {
    setVisible(false);
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  useLayoutEffect(() => {
    if (!active) return;
    setGeometry(measure(wordRef.current));
  }, [active]);

  // Hold the page still underneath, and let the hero's own entrance wait its turn.
  useEffect(() => {
    if (!active) {
      document.documentElement.removeAttribute("data-intro");
      return;
    }
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.intro = "running";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    return () => {
      document.body.style.overflow = overflow;
      document.documentElement.removeAttribute("data-intro");
    };
  }, [active]);

  // Run to the end on its own, or let anyone cut it short.
  useEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(finish, TOTAL * 1000);
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("wheel", skip);
    };
  }, [active, finish]);

  // Mark it played as soon as it is skipped for reduced motion, so nothing lingers.
  useEffect(() => {
    if (visible && reduce) finish();
  }, [visible, reduce, finish]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="intro"
          aria-hidden="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          exit={{ opacity: 0, transition: { duration: 0.35, ease: EASE_OUT } }}
        >
          <motion.div
            aria-hidden="true"
            className="intro-glow pointer-events-none absolute left-1/2 top-1/2 h-[55vh] w-[92vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: TOTAL, times: [0, 0.25, 0.5, 1], ease: "linear" }}
          />

          <div
            dir="ltr"
            className="flex items-center text-white font-light tracking-tight leading-none select-none"
            style={{ fontSize: "clamp(2.75rem, 9vw, 8rem)" }}
          >
            <motion.div
              ref={wordRef}
              className="flex"
              animate={geometry ? { x: -geometry.shift } : undefined}
              transition={{ duration: PANEL_OPEN, ease: EASE_OUT, delay: PANEL_DELAY }}
            >
              <Word text={FIRST_NAME} delayOffset={0} />
            </motion.div>

            {/* Placeholder gap so the two words read as one name before the panel opens. */}
            <span className="w-[0.3em]" aria-hidden="true" />

            <motion.div
              className="flex"
              animate={geometry ? { x: geometry.shift } : undefined}
              transition={{ duration: PANEL_OPEN, ease: EASE_OUT, delay: PANEL_DELAY }}
            >
              <Word text={LAST_NAME} delayOffset={FIRST_NAME.length} />
            </motion.div>
          </div>

          {/* The panel: a full-screen image revealed through a growing rectangle. */}
          {geometry && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              initial={{ clipPath: geometry.strip }}
              // The repeated middle keyframe is the hold; without it the small panel
              // flashes past and the whole thing reads as one long expansion.
              animate={{ clipPath: [geometry.strip, geometry.panel, geometry.panel, geometry.full] }}
              transition={{
                duration: PANEL_TOTAL,
                times: [
                  0,
                  PANEL_OPEN / PANEL_TOTAL,
                  (PANEL_OPEN + PANEL_HOLD) / PANEL_TOTAL,
                  1,
                ],
                ease: [EASE_OUT, "linear", EASE_IN_OUT],
                delay: PANEL_DELAY,
              }}
            >
              {/* Biased upward so the narrow panel lands on the face, not the middle of it. */}
              <img
                src={heroImage}
                alt=""
                className="h-full w-full object-cover [object-position:50%_30%]"
                loading="eager"
                decoding="async"
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
