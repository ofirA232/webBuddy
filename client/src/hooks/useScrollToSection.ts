import { useEffect } from 'react';

export const useScrollToSection = () => {
  useEffect(() => {
    const handleNavigation = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      
      // Check if the clicked element is an anchor with a hash
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        
        const targetId = target.getAttribute('href');
        if (!targetId) return;
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        window.scrollTo({
          top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
          behavior: 'smooth'
        });
      }
    };

    // Add event listener to handle navigation clicks
    document.addEventListener('click', handleNavigation);
    
    // Cleanup
    return () => {
      document.removeEventListener('click', handleNavigation);
    };
  }, []);
};
