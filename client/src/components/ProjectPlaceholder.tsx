import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  className?: string;
  style?: CSSProperties;
  /**
   * "dark" is the red-washed panel of the projects grid; "neutral" is the quiet grid used on
   * the monochrome case-study page; "light" is for a white background.
   */
  tone?: "light" | "dark" | "neutral";
};

/** Shown in place of a project screenshot until a real one is supplied. */
export function ProjectPlaceholder({ title, className, style, tone = "dark" }: Props) {
  return (
    <div
      aria-hidden="true"
      style={style}
      className={cn(
        "h-full w-full flex items-center justify-center p-6",
        tone === "light" ? "media-placeholder--light" : tone === "neutral" ? "media-placeholder--neutral" : "media-placeholder",
        className,
      )}
    >
      <span
        className={cn(
          "text-2xl md:text-3xl font-black text-center leading-tight",
          tone === "light" ? "text-black/30" : tone === "neutral" ? "font-light text-white/35" : "text-white/70",
        )}
      >
        {title}
      </span>
    </div>
  );
}
