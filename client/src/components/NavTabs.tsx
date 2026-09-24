import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Where a tab sits, as distances from the strip's two edges. */
type Rect = { left: number; right: number };

/** Nothing measured yet: a clip collapsed onto the left edge, as the old zero width was. */
const EMPTY: Rect = { left: 0, right: Number.POSITIVE_INFINITY };

/**
 * The indicators span the whole strip and are cut down to one tab with clip-path, so moving
 * between tabs animates a clip (paint only) rather than left/width, which re-lays out the
 * page every frame. `round` keeps the corners true at any width, which scaleX would squash.
 */
const clipTo = ({ left, right }: Rect, radius: number) =>
  `inset(0 ${Number.isFinite(right) ? `${right}px` : "100%"} 0 ${left}px round ${radius}px)`;

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
    const strip = element?.offsetParent as HTMLElement | null;
    if (!element || !strip) return EMPTY;
    const left = element.offsetLeft;
    return { left, right: strip.offsetWidth - left - element.offsetWidth };
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
    ? "transition-[clip-path,opacity] duration-200 ease-out-strong motion-reduce:transition-none"
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
          "pointer-events-none absolute inset-x-0 top-1/2 hidden h-[30px] -translate-y-1/2 bg-white/[0.08] can-hover:block",
          slide,
        )}
        style={{ clipPath: clipTo(hoverRect, 6), opacity: hovered === null ? 0 : 1 }}
      />

      {/* Active underline. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 -bottom-1.5 h-[2px] bg-[rgb(var(--accent))]",
          slide,
        )}
        style={{ clipPath: clipTo(activeRect, 1), opacity: activeIndex >= 0 ? 1 : 0 }}
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
