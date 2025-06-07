import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToSection = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle initial load and hash changes
    if (location.hash) {
      const targetId = location.hash;
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        setTimeout(() => {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth'
          });
        }, 0);
      }
    }
  }, [location.hash]);
};
