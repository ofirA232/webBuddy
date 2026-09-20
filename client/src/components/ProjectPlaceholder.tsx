import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  className?: string;
  style?: CSSProperties;
  /** "light" sits inside the white projects section, "dark" on the dark project page. */
  tone?: "light" | "dark";
};

/** Shown in place of a project screenshot until a real one is supplied. */
export function ProjectPlaceholder({ title, className, style, tone = "dark" }: Props) {
  return (
    <div
      aria-hidden="true"
      style={style}
      className={cn(
        "h-full w-full flex items-center justify-center p-6",
        tone === "light"
          ? "bg-[#ededed] bg-[radial-gradient(ellipse_at_top_right,rgba(192,31,31,0.12),transparent_65%)]"
          : "bg-[#141414] bg-[radial-gradient(ellipse_at_top_right,rgba(192,31,31,0.5),transparent_60%)]",
        className,
      )}
    >
      <span
        className={cn(
          "text-2xl md:text-3xl font-black text-center leading-tight",
          tone === "light" ? "text-black/30" : "text-white/70",
        )}
      >
        {title}
      </span>
    </div>
  );
}
