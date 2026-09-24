import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared pieces of the case-study page. The page is monochrome: white type, grey text,
 * hairlines. The site's red survives only as the dot in the eyebrow, a thread back to the
 * rest of the site rather than a colour competing with the screenshots.
 */

/** The small outlined label that names a section. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/60",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-[rgb(var(--accent))]" aria-hidden="true" />
      {children}
    </span>
  );
}

/** A faint square grid, for a backdrop to sit on. Position and mask it from the caller. */
export function GridBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-x-0 top-0 h-full", className)}
      style={{
        backgroundImage:
          "linear-gradient(to right, rgb(255 255 255 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.05) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        backgroundPosition: "center top",
      }}
    />
  );
}

/** Registration marks on the four outer corners of a hairline grid. Needs a `relative` parent. */
export function Crosshairs() {
  const mark = "pointer-events-none absolute size-3 text-white/35";
  const plus = (
    <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M6 0v12M0 6h12" />
    </svg>
  );
  return (
    <>
      <span aria-hidden="true" className={cn(mark, "-left-1.5 -top-1.5")}>{plus}</span>
      <span aria-hidden="true" className={cn(mark, "-right-1.5 -top-1.5")}>{plus}</span>
      <span aria-hidden="true" className={cn(mark, "-bottom-1.5 -left-1.5")}>{plus}</span>
      <span aria-hidden="true" className={cn(mark, "-bottom-1.5 -right-1.5")}>{plus}</span>
    </>
  );
}

/**
 * The page's rhythm: a narrow column naming the section, sticky on wide screens, beside
 * the content. Every section below the hero uses it, so the eye finds the same edge each time.
 */
export function CaseSection({
  label,
  title,
  children,
  className,
}: {
  label: string;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("container mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8", className)}>
      <div className="grid gap-8 border-t border-white/10 pt-10 md:pt-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Eyebrow>{label}</Eyebrow>
            {title && (
              <h2 className="mt-5 text-2xl font-light leading-tight tracking-tight text-white md:text-3xl">{title}</h2>
            )}
          </div>
        </div>
        <div className="lg:col-span-8">{children}</div>
      </div>
    </section>
  );
}
