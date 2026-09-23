import { useEffect, useRef, useState } from "react";

/** A third of the way down the viewport: the line a heading has to cross to become current. */
const READING_LINE = 0.33;

/**
 * Tracks which of the given elements is currently being read: the last one whose top has
 * passed the reading line. Taking the last match rather than the first element in view
 * means every section takes its turn, including the one at the end of the page.
 *
 * Measures once per animation frame; reading layout on every scroll event is wasteful.
 * Pass an empty list to switch it off, which is what routes without these sections do.
 */
export function useActiveSection(ids: string[]): string | undefined {
  const key = ids.join("|");
  const [active, setActive] = useState<string | undefined>(ids[0]);
  const frame = useRef(0);

  useEffect(() => {
    const list = key ? key.split("|") : [];
    if (list.length === 0) {
      setActive(undefined);
      return;
    }

    const update = () => {
      frame.current = 0;
      const line = window.innerHeight * READING_LINE;
      let current = list[0];
      for (const id of list) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };

    const schedule = () => {
      if (!frame.current) frame.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, [key]);

  return active;
}
