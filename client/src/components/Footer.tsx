const Footer = () => {
  const handleLinkClick = (page: string) => {
    // In a real app, this would navigate to legal pages
    console.log(`Navigate to ${page}`);
  };

  return (
    <footer className="border-t border-solid border-t-[#333333] px-4 sm:px-10 py-6">
      <div className="max-w-[960px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-[#FFFFFF] text-sm">© {new Date().getFullYear()} Alex Reed. All rights reserved.</div>
        <div className="flex gap-6">
          <a 
            className="text-[#FFFFFF] text-sm hover:text-gray-300 transition-colors" 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('privacy');
            }}
          >
            Privacy Policy
          </a>
          <a 
            className="text-[#FFFFFF] text-sm hover:text-gray-300 transition-colors" 
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
    </footer>
  );
};

export default Footer;
