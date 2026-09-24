import { useCallback, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import {
  Link,
  useLocation,
  useNavigate,
  type LinkProps,
  type NavigateOptions,
  type To,
} from "react-router-dom";

type DocumentWithVT = Document & { startViewTransition?: (update: () => void) => unknown };

/** Which way the page sweep runs. "back" mirrors it. */
export type NavDirection = "forward" | "back";

/** True when there is an earlier entry in this tab's in-app history. */
export function hasHistoryToGoBack() {
  const state = window.history.state as { idx?: number } | null;
  return (state?.idx ?? 0) > 0;
}

/** The path part of a `to`, ignoring any hash. */
function pathnameOf(to: To) {
  if (typeof to !== "string") return to.pathname ?? "";
  return to.split("#")[0] || "/";
}

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

type TransitionLinkProps = LinkProps & {
  direction?: NavDirection;
  /**
   * Step back through history instead of pushing a new entry, so the previous page
   * returns at the scroll position it was left at. Falls back to `to` on a fresh tab.
   */
  historyBack?: boolean;
};

/** A react-router <Link> that navigates through a page transition on plain left clicks. */
export function TransitionLink({
  to,
  onClick,
  target,
  direction = "forward",
  historyBack = false,
  replace,
  state,
  ...rest
}: TransitionLinkProps) {
  const navigate = useNavigate();
  const vtNavigate = useViewTransitionNavigate();
  const location = useLocation();

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

    if (historyBack && hasHistoryToGoBack()) {
      // PageTransitions animates this one, because it arrives as a popstate.
      navigate(-1);
      return;
    }

    // Jumping to a section of the page we are already on is a scroll, not a page change.
    // Sweeping the whole page for it would promise something that never happens.
    if (pathnameOf(to) === location.pathname) {
      navigate(to, { replace, state });
      return;
    }

    // The click is handled here rather than by <Link>, so its options are passed on by hand.
    vtNavigate(to, direction, { replace, state });
  };

  return <Link to={to} target={target} replace={replace} state={state} onClick={handleClick} {...rest} />;
}
