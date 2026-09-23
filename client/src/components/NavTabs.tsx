import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Rect = { left: number; width: number };

const EMPTY: Rect = { left: 0, width: 0 };

/** The class the caller should put on its link, so every tab measures the same. */
export const NAV_TAB_CLASS = "block px-3 py-2 text-sm font-medium leading-5 whitespace-nowrap";

export type NavTab = {
  id: string;
  /** Rendered by the caller, so these stay real links rather than clickable divs. */
  render: () => ReactNode;
};

/**
 * The tab strip from the Vercel-style component, with one change: the items are whatever
 * the caller renders. The original slides its highlight behind `div`s with onClick handlers,
 * which for site navigation would cost middle-click, open-in-new-tab, keyboard access and
 * anything that reads the page as links, so the caller keeps passing anchors.
 *
 * `offsetLeft` is measured from the container's left edge in both directions, so the same
 * maths places the indicator in a right-to-left layout.
 */
export function NavTabs({
  tabs,
  activeId,
  className,
  label,
}: {
  tabs: NavTab[];
  /** Undefined hides the underline, for pages with no matching section. */
  activeId?: string;
  className?: string;
  label: string;
}) {
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [hoverRect, setHoverRect] = useState<Rect>(EMPTY);
  const [activeRect, setActiveRect] = useState<Rect>(EMPTY);
  // Nothing slides on the first paint: the underline starts where it belongs.
  const [ready, setReady] = useState(false);

  const activeIndex = activeId ? tabs.findIndex((tab) => tab.id === activeId) : -1;

  const measure = (index: number): Rect => {
    const element = itemRefs.current[index];
    return element ? { left: element.offsetLeft, width: element.offsetWidth } : EMPTY;
  };

  useLayoutEffect(() => {
    setActiveRect(activeIndex >= 0 ? measure(activeIndex) : EMPTY);
  }, [activeIndex, tabs.length]);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  // Labels reflow when the webfont lands or the window changes width.
  useEffect(() => {
    const remeasure = () => setActiveRect(activeIndex >= 0 ? measure(activeIndex) : EMPTY);
    window.addEventListener("resize", remeasure);
    document.fonts?.ready.then(remeasure).catch(() => {});
    return () => window.removeEventListener("resize", remeasure);
  }, [activeIndex]);

  useEffect(() => {
    if (hovered !== null) setHoverRect(measure(hovered));
  }, [hovered]);

  // Nothing slides for anyone who asked for less motion; the indicator just moves.
  const slide = ready
    ? "transition-[left,width,opacity] duration-200 ease-out-strong motion-reduce:transition-none"
    : "";

  return (
    <nav
      className={cn("relative", className)}
      onMouseLeave={() => setHovered(null)}
      aria-label={label}
    >
      {/* Hover highlight, shown only to real pointers so a tap does not leave it stranded. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-1/2 hidden h-[30px] -translate-y-1/2 rounded-md bg-white/[0.08] can-hover:block",
          slide,
        )}
        style={{ ...hoverRect, opacity: hovered === null ? 0 : 1 }}
      />

      {/* Active underline. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -bottom-1.5 h-[2px] rounded-full bg-[rgb(var(--accent))]",
          slide,
        )}
        style={{ ...activeRect, opacity: activeIndex >= 0 ? 1 : 0 }}
      />

      <div className="relative flex items-center gap-x-1.5">
        {tabs.map((tab, index) => (
          <span
            key={tab.id}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            className="block"
            onMouseEnter={() => setHovered(index)}
          >
            {tab.render()}
          </span>
        ))}
      </div>
    </nav>
  );
}
