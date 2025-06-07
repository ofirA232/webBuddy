import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, title, subtitle, children, className }: SectionProps) {
  return (
    <section id={id} className={cn("py-8 sm:py-12", className)}>
      {(title || subtitle) && (
        <div className="container mx-auto px-4 mb-6 sm:mb-8 text-right" dir="rtl">
          {title && <h2 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h2>}
          {subtitle && <p className="text-sm sm:text-base text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      <div className="container mx-auto px-4">
        {children}
      </div>
    </section>
  );
} 