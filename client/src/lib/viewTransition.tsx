import { useCallback, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { Link, useNavigate, type LinkProps, type NavigateOptions, type To } from "react-router-dom";
import { prefersReducedMotion } from "@/lib/motion";

type DocumentWithVT = Document & { startViewTransition?: (update: () => void) => unknown };

/**
 * navigate() wrapped in the View Transitions API when the browser supports it.
 * Elements sharing a `view-transition-name` on both routes morph between them (see index.css).
 * Falls back to a plain navigation on unsupported browsers and under reduced motion.
 */
export function useViewTransitionNavigate() {
  const navigate = useNavigate();
  return useCallback(
    (to: To, opts?: NavigateOptions) => {
      const doc = document as DocumentWithVT;
      if (!doc.startViewTransition || prefersReducedMotion()) {
        navigate(to, opts);
        return;
      }
      doc.startViewTransition(() => {
        // The route must commit synchronously inside the callback for the snapshot to be taken.
        flushSync(() => navigate(to, opts));
      });
    },
    [navigate],
  );
}

/** A react-router <Link> that navigates through a view transition on plain left clicks. */
export function TransitionLink({ to, onClick, target, ...rest }: LinkProps) {
  const vtNavigate = useViewTransitionNavigate();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      (target && target !== "_self")
    ) {
      return;
    }
    event.preventDefault();
    vtNavigate(to);
  };

  return <Link to={to} target={target} onClick={handleClick} {...rest} />;
}
