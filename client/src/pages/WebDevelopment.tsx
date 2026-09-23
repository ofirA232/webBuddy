import React from 'react';
import { CircleCheck } from "lucide-react";

const WebDevelopment = () => {
  return (
    <div className="min-h-screen bg-black text-white py-20" dir="rtl">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">בניית אתרים</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">השירותים שלנו</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[rgb(var(--accent))] rounded-full me-3"></span>
                בניית אתרי וורדפרס מותאמים אישית
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[rgb(var(--accent))] rounded-full me-3"></span>
                פיתוח תוספים ותבניות מותאמות
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[rgb(var(--accent))] rounded-full me-3"></span>
                אינטגרציה עם מערכות צד שלישי
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[rgb(var(--accent))] rounded-full me-3"></span>
                אופטימיזציה לביצועים ומהירות
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[rgb(var(--accent))] rounded-full me-3"></span>
                תחזוקה שוטפת ותמיכה טכנית
              </li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">היתרונות שלנו</h2>
            <div className="bg-gray-900 p-6 rounded-lg">
              <ul className="space-y-3">
                <li className="grid grid-cols-[auto_1fr] items-start gap-2.5">
                  <CircleCheck size={16} strokeWidth={1.5} className="mt-1 text-white/45" aria-hidden="true" />
                  <span>ניסיון של שנים בבניית אתרים מורכבים</span>
                </li>
                <li className="grid grid-cols-[auto_1fr] items-start gap-2.5">
                  <CircleCheck size={16} strokeWidth={1.5} className="mt-1 text-white/45" aria-hidden="true" />
                  <span>התאמה מושלמת למובייל ולכל סוגי המסכים</span>
                </li>
                <li className="grid grid-cols-[auto_1fr] items-start gap-2.5">
                  <CircleCheck size={16} strokeWidth={1.5} className="mt-1 text-white/45" aria-hidden="true" />
                  <span>אבטחה מתקדמת והגנה על האתר</span>
                </li>
                <li className="grid grid-cols-[auto_1fr] items-start gap-2.5">
                  <CircleCheck size={16} strokeWidth={1.5} className="mt-1 text-white/45" aria-hidden="true" />
                  <span>תמיכה וליווי לאורך כל הדרך</span>
                </li>
                <li className="grid grid-cols-[auto_1fr] items-start gap-2.5">
                  <CircleCheck size={16} strokeWidth={1.5} className="mt-1 text-white/45" aria-hidden="true" />
                  <span>אחסון מאובטח ומהיר</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">תהליך העבודה שלנו</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="text-xl font-bold mb-2">1. אפיון</div>
              <p>הגדרת צרכים, מטרות ודרישות הפרויקט</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="text-xl font-bold mb-2">2. עיצוב</div>
              <p>עיצוב ממשק משתמש מותאם אישית</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="text-xl font-bold mb-2">3. פיתוח</div>
              <p>בניית האתר ופיתוח הפונקציונליות</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="text-xl font-bold mb-2">4. השקה</div>
              <p>בדיקות, אופטימיזציה והעלאה לאוויר</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebDevelopment; 