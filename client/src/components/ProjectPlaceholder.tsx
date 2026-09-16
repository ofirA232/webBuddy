import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type Props = { title: string; className?: string; style?: CSSProperties };

/** Shown in place of a project screenshot until a real one is supplied. */
export function ProjectPlaceholder({ title, className, style }: Props) {
  return (
    <div
      aria-hidden="true"
      style={style}
      className={cn(
        "h-full w-full flex items-center justify-center p-6 bg-[#141414] bg-[radial-gradient(ellipse_at_top_right,rgba(192,31,31,0.5),transparent_60%)]",
        className,
      )}
    >
      <span className="text-2xl md:text-3xl font-black text-white/70 text-center leading-tight">
        {title}
      </span>
    </div>
  );
}
