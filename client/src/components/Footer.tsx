import { site } from "@/data/site";

const Footer = () => {
  return (
    <footer className="border-t border-[#333333] py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="text-white text-xs sm:text-sm order-2 md:order-1">
            © {new Date().getFullYear()} {site.name}. כל הזכויות שמורות.
          </div>
          {site.email && (
            <a
              className="text-white text-xs sm:text-sm hover:text-gray-300 transition-colors order-1 md:order-2"
              href={`mailto:${site.email}`}
              dir="ltr"
            >
              {site.email}
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
