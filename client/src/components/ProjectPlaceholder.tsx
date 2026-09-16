import { cn } from "@/lib/utils";

/** Shown in place of a project screenshot until a real one is supplied. */
export function ProjectPlaceholder({ title, className }: { title: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
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
