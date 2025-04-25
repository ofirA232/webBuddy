import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function NotFound() {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Set document title
    document.title = "404 - Page Not Found | Ofir Zangi Portfolio";
  }, []);
  
  const goHome = () => {
    navigate("/");
  };
  
  return (
    <div className="container mx-auto px-4 py-20 min-h-[80vh] flex flex-col items-center justify-center text-center">
      <div className="mb-6">
        <h1 className="text-6xl md:text-8xl font-black text-white mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">עמוד לא נמצא</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          העמוד שחיפשת לא קיים או שהועבר למקום אחר
        </p>
      </div>
      
      <button 
        onClick={goHome}
        className="flex items-center justify-center gap-2 bg-white text-black rounded-full px-6 py-3 font-medium hover:bg-gray-200 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>חזרה לדף הבית</span>
      </button>
    </div>
  );
}
