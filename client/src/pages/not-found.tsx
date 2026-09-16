import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  useEffect(() => {
    document.title = "דף לא נמצא | אופיר זנגי";
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center min-h-[60vh]" dir="rtl">
      <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">404 - הדף לא נמצא</h1>
      <p className="text-white/80 text-lg max-w-md mb-8">
        מצטערים, הדף שחיפשת לא קיים או שהוסר.
      </p>
      <Link
        to="/"
        className="flex w-fit items-center justify-center rounded-full h-10 px-6 bg-white text-black text-base font-bold hover:bg-gray-200 transition-colors"
      >
        חזרה לדף הבית
      </Link>
    </div>
  );
};

export default NotFound;
