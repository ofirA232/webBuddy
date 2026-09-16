import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { site } from "@/data/site";

const socialLinks = [
  {
    key: "github",
    href: site.social.github,
    label: "פרופיל GitHub",
    path: "M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM72,112v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104v8a40,40,0,0,1-40,40H112A40,40,0,0,1,72,112Z",
  },
  {
    key: "twitter",
    href: site.social.twitter,
    label: "פרופיל Twitter",
    path: "M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.52-6.25,27.56-17,37.88-30.19a8,8,0,0,0-5.19-13.18c-.64-.09-1.28-.18-1.91-.29a96.13,96.13,0,0,1-20.12-6.08c-19.57-14.67-28.67-36.76-28.48-69.58,8.69,7.33,33.41,27.32,65.91,34a8,8,0,0,0,9.93-7.88V88A32,32,0,0,1,136.9,56.4a30.82,30.82,0,0,1,22.25-9.3,32.64,32.64,0,0,1,30.43,21.13,8,8,0,0,0,7.52,5.26H213l-10.57,10.56Z",
  },
  {
    key: "linkedin",
    href: site.social.linkedin,
    label: "פרופיל LinkedIn",
    path: "M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z",
  },
].filter((s) => s.href);

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (hash: string) =>
    hash ? location.hash === hash : location.pathname === "/" && !location.hash;

  const linkClass = (hash: string) =>
    `text-sm font-medium hover:text-gray-300 transition-colors ${
      isActive(hash) ? "text-gray-300" : "text-white"
    }`;

  return (
    <header className="border-b border-[#333333] sticky top-0 z-50 bg-black">
      <div className="px-4 sm:px-6 lg:px-8 relative z-50 bg-black py-3 sm:py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <div className="h-5 w-5 sm:h-6 sm:w-6">
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <h2 className="text-white text-base sm:text-lg font-bold">{site.name}</h2>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="md:hidden p-2 text-white hover:text-gray-300 transition-colors"
            aria-label={mobileMenuOpen ? "סגור תפריט" : "פתח תפריט"}
            aria-expanded={mobileMenuOpen}
          >
            <div className="relative w-5 h-5">
              <span
                className={`absolute left-0 top-0 w-full h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                  mobileMenuOpen ? "rotate-45 top-2" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-2 w-full h-0.5 bg-current transform transition-all duration-200 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 bottom-0 w-full h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                  mobileMenuOpen ? "-rotate-45 bottom-2" : ""
                }`}
              />
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-end gap-4 sm:gap-6">
            <nav className="flex items-center gap-4 sm:gap-6">
              {site.navLinks.map((link) => (
                <Link key={link.to} to={link.to} className={linkClass(link.hash)}>
                  {link.label}
                </Link>
              ))}
            </nav>

            {socialLinks.length > 0 && (
              <div className="flex gap-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex items-center justify-center rounded-full h-10 w-10 bg-[#333333] text-white hover:bg-[#444444] transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      aria-hidden="true"
                    >
                      <path d={s.path}></path>
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden z-40 ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div
        className={`md:hidden fixed top-[57px] sm:top-[65px] right-0 w-full bg-black transform transition-transform duration-500 ease-out z-40 ${
          mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="px-4">
          <nav className="flex flex-col space-y-3 py-4">
            {site.navLinks.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                className={`${linkClass(link.hash)} py-2 text-right transform transition-all duration-500 ease-out ${
                  mobileMenuOpen
                    ? "translate-x-0 opacity-100 scale-100"
                    : "translate-x-16 opacity-0 scale-90"
                }`}
                style={{ transitionDelay: `${100 + i * 100}ms` }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
