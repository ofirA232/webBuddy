import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

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
    // Gliding there is the point when we are already on the page. Arriving from another
    // page should just be in position, with no scroll animation under the page transition.
    target.scrollIntoView({ behavior: arrivedOnThisPage.current ? 'smooth' : 'auto' });
    arrivedOnThisPage.current = true;
  }, [location.key, location.hash]);
};
