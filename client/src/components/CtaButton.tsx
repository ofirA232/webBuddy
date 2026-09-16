import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import "./CtaButton.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Blurs the label and marks the button busy while an async action runs. */
  pending?: boolean;
  size?: "md" | "sm";
};

export const CtaButton = forwardRef<HTMLButtonElement, Props>(function CtaButton(
  { children, pending = false, size = "md", className, disabled, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn("cta-button", size === "sm" && "cta-button--sm", className)}
      aria-busy={pending || undefined}
      disabled={disabled || pending}
      {...rest}
    >
      <span className="cta-button__label" data-pending={pending || undefined}>
        {children}
      </span>
      <span className="cta-button__overlay" aria-hidden="true">
        <span className="cta-button__label">{children}</span>
      </span>
    </button>
  );
});
