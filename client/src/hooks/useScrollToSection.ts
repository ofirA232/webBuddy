import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * How long a section reached from another page is held in place while the page above it
 * finishes laying out. Long enough for the creative wall to measure itself and size its
 * runway, which takes a frame or two after mount.
 */
const SETTLE_MS = 1500;

/** Any of these means the visitor has started moving the page themselves. */
const TAKEOVER_EVENTS = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const;

/**
 * Jumps to `target` and keeps it there while the page settles.
 *
 * The first scroll happens in the same commit that mounts the page, before the sections
 * above have their real height: the creative wall only knows how tall its runway is once
 * it has measured its frame, and it grows by thousands of pixels a frame later. Scrolled
 * only once, the visitor ended up somewhere in the middle of the wall with the contact
 * form screens further down. So every time the page changes size during the settling
 * window, the section is put back at the top — unless the visitor has already started
 * scrolling, which they should never have taken away from them.
 */
function jumpAndHold(target: HTMLElement) {
  // "instant", not "auto": auto defers to the smooth scroll-behavior set on html.
  const jump = () => target.scrollIntoView({ behavior: 'instant' });
  jump();

  const observer = new ResizeObserver(jump);
  observer.observe(document.body);

  const release = () => {
    observer.disconnect();
    window.clearTimeout(timer);
    TAKEOVER_EVENTS.forEach((type) => window.removeEventListener(type, release));
  };
  const timer = window.setTimeout(release, SETTLE_MS);
  TAKEOVER_EVENTS.forEach((type) => window.addEventListener(type, release, { passive: true }));
  return release;
}

/**
 * Scrolls to the section named by the URL hash (e.g. /#projects).
 * Offset from the sticky header comes from `section[id] { scroll-margin-top }` in index.css.
 *
 * Keyed on `location.key`, not on the hash: every click on a nav link is a new history
 * entry even when it points at the hash already in the address bar. Watching the hash alone
 * meant that clicking "projects" a second time did nothing, so anyone who had scrolled
 * away in the meantime stayed exactly where they were.
 */
export const useScrollToSection = () => {
  const location = useLocation();
  const arrivedOnThisPage = useRef(false);

  useEffect(() => {
    if (!location.hash) {
      arrivedOnThisPage.current = true;
      return;
    }
    const target = document.getElementById(location.hash.slice(1));
    if (!target) return;
    // Gliding there is the point when we are already on the page, and by then the
    // layout has long settled.
    if (arrivedOnThisPage.current) {
      target.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    // Arriving from another page should just be in position, with no scroll animation
    // under the page transition, and it has to stay in position while the page settles.
    arrivedOnThisPage.current = true;
    return jumpAndHold(target);
  }, [location.key, location.hash]);
};
