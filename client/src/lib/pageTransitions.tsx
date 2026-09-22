import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

type DocumentWithVT = Document & { startViewTransition?: (update: () => void) => unknown };

/** Safety valve: never leave the page frozen under a transition overlay. */
const TRANSITION_TIMEOUT_MS = 500;

/** React Router numbers each history entry; the counter tells back from forward. */
const currentHistoryIndex = () => (window.history.state as { idx?: number } | null)?.idx ?? 0;

/**
 * Owns everything that happens between pages:
 *
 * - remembers the scroll position of each history entry, so going back returns you to the
 *   spot you left rather than the top of the page;
 * - runs the same sweep as in-app links when the browser's back/forward buttons are used.
 *
 * Back/forward can't be wrapped in startViewTransition directly, because React commits the
 * new route after the popstate handler returns. Instead the transition is opened with a
 * promise that stays pending until the new route has rendered and the scroll is restored.
 */
export function PageTransitions() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef(new Map<string, number>());
  const finishTransition = useRef<(() => void) | null>(null);
  const historyIndex = useRef(currentHistoryIndex());
  /** The page currently on screen, to tell a real page change from a jump within it. */
  const committedPath = useRef(location.pathname);

  // Take over from the browser, which would otherwise restore scroll at the wrong moment.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Keep the current entry's scroll position up to date.
  useEffect(() => {
    const key = location.key;
    const record = () => positions.current.set(key, window.scrollY);
    record();
    window.addEventListener("scroll", record, { passive: true });
    return () => window.removeEventListener("scroll", record);
  }, [location.key]);

  // Back and forward buttons animate like in-app links.
  useEffect(() => {
    const onPopState = () => {
      // Forward button sweeps the same way a link does; back mirrors it.
      const nextIndex = currentHistoryIndex();
      const direction = nextIndex < historyIndex.current ? "back" : "forward";
      historyIndex.current = nextIndex;

      // Chrome also fires popstate for a jump to an anchor on the same page, and for Back
      // after one. That is a scroll, not a page change: sweeping the page for it froze the
      // screen mid-scroll, so a smooth jump to a section landed in one hard cut.
      if (window.location.pathname === committedPath.current) return;

      const doc = document as DocumentWithVT;
      if (!doc.startViewTransition) return;

      document.documentElement.dataset.navDirection = direction;
      doc.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            let done = false;
            const settle = () => {
              if (done) return;
              done = true;
              finishTransition.current = null;
              resolve();
            };
            finishTransition.current = settle;
            window.setTimeout(settle, TRANSITION_TIMEOUT_MS);
          }),
      );
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Put the new page in position before the transition paints it.
  useLayoutEffect(() => {
    historyIndex.current = currentHistoryIndex();
    committedPath.current = location.pathname;
    if (!location.hash) {
      const saved = navigationType === "POP" ? positions.current.get(location.key) : undefined;
      // "instant", not "auto": html has scroll-behavior: smooth, and "auto" defers to it.
      // A smooth scroll here plays out on the new page, so a project opened from the grid
      // was shown at its bottom and then visibly rolled up to the top.
      window.scrollTo({ top: saved ?? 0, left: 0, behavior: "instant" });
    }
    finishTransition.current?.();
  }, [location.key, location.hash, navigationType]);

  return null;
}
