import { useCallback, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { Link, useNavigate, type LinkProps, type NavigateOptions, type To } from "react-router-dom";

type DocumentWithVT = Document & { startViewTransition?: (update: () => void) => unknown };

/** Which way the page sweep runs. "back" mirrors it. */
export type NavDirection = "forward" | "back";

/**
 * navigate() wrapped in the View Transitions API when the browser supports it.
 * The animation itself lives in index.css (::view-transition-new(root)); here we only
 * mark the direction so the sweep can be mirrored when going back.
 * Browsers without the API fall back to a plain navigation.
 */
export function useViewTransitionNavigate() {
  const navigate = useNavigate();
  return useCallback(
    (to: To, direction: NavDirection = "forward", opts?: NavigateOptions) => {
      const doc = document as DocumentWithVT;
      if (!doc.startViewTransition) {
        navigate(to, opts);
        return;
      }
      document.documentElement.dataset.navDirection = direction;
      doc.startViewTransition(() => {
        // The route must commit synchronously inside the callback for the snapshot to be taken.
        flushSync(() => navigate(to, opts));
      });
    },
    [navigate],
  );
}

type TransitionLinkProps = LinkProps & { direction?: NavDirection };

/** A react-router <Link> that navigates through a page transition on plain left clicks. */
export function TransitionLink({
  to,
  onClick,
  target,
  direction = "forward",
  ...rest
}: TransitionLinkProps) {
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
    vtNavigate(to, direction);
  };

  return <Link to={to} target={target} onClick={handleClick} {...rest} />;
}
