const Footer = () => {
  const handleLinkClick = (page: string) => {
    // In a real app, this would navigate to legal pages
    console.log(`Navigate to ${page}`);
  };

  return (
    <footer className="border-t border-[#333333] py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white text-sm">© {new Date().getFullYear()} Ofir Zangi. All rights reserved.</div>
          <div className="flex flex-wrap gap-6">
            <a 
              className="text-white text-sm hover:text-gray-300 transition-colors" 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('privacy');
              }}
            >
              Privacy Policy
            </a>
            <a 
              className="text-white text-sm hover:text-gray-300 transition-colors" 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('terms');
              }}
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
