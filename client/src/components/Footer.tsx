const Footer = () => {
  const handleLinkClick = (page: string) => {
    // In a real app, this would navigate to legal pages
    console.log(`Navigate to ${page}`);
  };

  return (
    <footer className="border-t border-[#333333] py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="text-white text-xs sm:text-sm order-2 md:order-1">© {new Date().getFullYear()} אופיר זנגי. כל הזכויות שמורות.</div>
          <div className="flex flex-wrap gap-4 sm:gap-6 order-1 md:order-2">
            <a 
              className="text-white text-xs sm:text-sm hover:text-gray-300 transition-colors" 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('privacy');
              }}
            >
              מדיניות פרטיות
            </a>
            <a 
              className="text-white text-xs sm:text-sm hover:text-gray-300 transition-colors" 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('terms');
              }}
            >
              תנאי שימוש
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
