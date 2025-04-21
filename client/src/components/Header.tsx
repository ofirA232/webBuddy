import { GithubLogo, TwitterLogo, LinkedinLogo } from "phosphor-react";

const Header = () => {
  const handleSocialLink = (platform: string) => {
    const urls: Record<string, string> = {
      github: "https://github.com/alexreed",
      twitter: "https://twitter.com/alexreed",
      linkedin: "https://linkedin.com/in/alexreed"
    };
    
    if (urls[platform]) {
      window.open(urls[platform], "_blank", "noopener,noreferrer");
    }
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#333333] px-4 sm:px-10 py-3">
      <div className="flex items-center gap-4 text-[#FFFFFF]">
        <div className="size-4">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
              fill="currentColor"
            ></path>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.714 12.9979 39.5416 13.2917 39.3758 13.5217C38.6355 14.5886 37.583 15.4332 36.5945 16.08C34.6182 17.3834 32.0034 18.362 29.3944 18.993C25.1865 20.0493 20.2832 20.5217 15.4737 20.5217C10.6642 20.5217 5.76089 20.0493 1.55296 18.993C-0.0666812 18.6254 -0.5 17.3333 -0.5 16C-0.5 14.6667 -0.0666808 13.3746 1.55296 13.007C5.76089 11.9507 10.6642 11.4783 15.4737 11.4783C20.2832 11.4783 25.1865 11.9507 29.3944 13.007C32.0034 13.638 34.6182 14.6166 36.5945 15.92C37.583 16.5668 38.6355 17.4114 39.3758 18.4783C39.5416 18.7083 39.714 19.0021 39.8346 19.2825C39.8949 19.4259 39.9436 19.5601 39.9748 19.6706C39.9875 19.7155 39.9944 19.7463 39.998 19.764C40 19.7734 40 19.779 40 19.7803V19.7806L40 20L40 19.7806C40.0001 19.7767 40.0001 19.7712 40 19.764C39.9955 19.7464 39.9885 19.7155 39.9758 19.6706C39.9446 19.5601 39.8959 19.4259 39.8356 19.2825C39.715 19.0021 39.5425 18.7083 39.3767 18.4783C38.6364 17.4114 37.584 16.5668 36.5955 15.92C34.6192 14.6166 32.0044 13.638 29.3954 13.007C25.1875 11.9507 20.2842 11.4783 15.4747 11.4783C10.6652 11.4783 5.76189 11.9507 1.55396 13.007C-0.0656808 13.3746 -0.499 14.6667 -0.499 16C-0.499 17.3333 -0.0656812 18.6254 1.55396 18.993C5.76189 20.0493 10.6652 20.5217 15.4747 20.5217C20.2842 20.5217 25.1875 20.0493 29.3954 18.993C32.0044 18.362 34.6192 17.3834 36.5955 16.08C37.584 15.4332 38.6364 14.5886 39.3767 13.5217C39.5425 13.2917 39.715 12.9979 39.8356 12.7175C39.8959 12.5741 39.9446 12.4399 39.9758 12.3294C39.9885 12.2845 39.9955 12.2537 39.9999 12.236C40.0001 12.2288 40.0001 12.2233 40 12.2195V12.2194L40 12L40 12.2194C40 12.2207 40 12.2263 39.998 12.236Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <h2 className="text-[#FFFFFF] text-lg font-bold leading-tight tracking-[-0.015em]">Alex Reed</h2>
      </div>
      <div className="flex flex-1 justify-end gap-4 sm:gap-8">
        <nav className="hidden sm:flex items-center gap-6 sm:gap-9">
          <a href="#about" className="text-[#FFFFFF] text-sm font-medium leading-normal hover:text-gray-300 transition-colors">About</a>
          <a href="#projects" className="text-[#FFFFFF] text-sm font-medium leading-normal hover:text-gray-300 transition-colors">Projects</a>
          <a href="#contact" className="text-[#FFFFFF] text-sm font-medium leading-normal hover:text-gray-300 transition-colors">Contact</a>
        </nav>
        <div className="flex gap-2">
          <button
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-[#333333] text-[#FFFFFF] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-[#444444] transition-colors"
            onClick={() => handleSocialLink("github")}
            aria-label="GitHub Profile"
          >
            <div className="text-[#FFFFFF]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM72,112v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104v8a40,40,0,0,1-40,40H112A40,40,0,0,1,72,112Z"
                ></path>
              </svg>
            </div>
          </button>
          <button
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-[#333333] text-[#FFFFFF] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-[#444444] transition-colors"
            onClick={() => handleSocialLink("twitter")}
            aria-label="Twitter Profile"
          >
            <div className="text-[#FFFFFF]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.52-6.25,27.56-17,37.88-30.19a8,8,0,0,0-5.19-13.18c-.64-.09-1.28-.18-1.91-.29a96.13,96.13,0,0,1-20.12-6.08c-19.57-14.67-28.67-36.76-28.48-69.58,8.69,7.33,33.41,27.32,65.91,34a8,8,0,0,0,9.93-7.88V88A32,32,0,0,1,136.9,56.4a30.82,30.82,0,0,1,22.25-9.3,32.64,32.64,0,0,1,30.43,21.13,8,8,0,0,0,7.52,5.26H213l-10.57,10.56Z"
                ></path>
              </svg>
            </div>
          </button>
          <button
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-[#333333] text-[#FFFFFF] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-[#444444] transition-colors"
            onClick={() => handleSocialLink("linkedin")}
            aria-label="LinkedIn Profile"
          >
            <div className="text-[#FFFFFF]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"
                ></path>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
