import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls to the section named by the URL hash (e.g. /#projects).
 * Offset from the sticky header comes from `section[id] { scroll-margin-top }` in index.css,
 * and smoothness from `html { scroll-behavior }`, so no manual math is needed here.
 */
export const useScrollToSection = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }, [location.hash]);
};
