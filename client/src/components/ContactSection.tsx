import { useState, FormEvent, useEffect } from "react";
import emailjs from '@emailjs/browser';
import "../components/MaskButton.css";

const ContactSection = () => {
  useEffect(() => {
    emailjs.init("gr9F4_3kEH2AsGWOA");
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    
    try {
      // Replace these with your actual EmailJS credentials
      const serviceId = 'service_sk2i8v9';
      const templateId = 'template_ihb55nw';
      const publicKey = 'gr9F4_3kEH2AsGWOA';
      
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        from_phone: formData.phone,
        message: formData.message
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
      
      setSubmitted(true);
      
      // Hide success message after a few seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("אירעה שגיאה בשליחת הטופס. אנא נסה שוב מאוחר יותר.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-8 sm:py-12">
      <h2 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight pb-3 pt-5 text-right">יצירת קשר</h2>
      <div className="bg-[#111111] p-4 sm:p-6 rounded-xl border border-[#333333] w-full md:max-w-[calc(100%-200px)] lg:max-w-[calc(100%-450px)] mx-auto">
        {submitted ? (
          <div className="text-white-400 p-4 text-center flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-white-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-base sm:text-lg font-medium mb-2">הודעתך התקבלה בהצלחה!</p>
            <p className="text-sm sm:text-base text-gray-300">תודה על פנייתך. נחזור אליך בהקדם האפשרי.</p>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit} dir="rtl">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-right" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="name" className="text-white text-sm font-medium text-right">
                  שם מלא
                </label>
                <input
                  type="text"
                  id="name"
                  className="bg-[#222222] border border-[#444444] text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#FFFFFF] text-right"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-white text-sm font-medium text-right">
                  אימייל
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-[#222222] border border-[#444444] text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#FFFFFF] text-right"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-white text-sm font-medium text-right">
                    טלפון
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="bg-[#222222] border border-[#444444] text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#FFFFFF] text-right"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder=""
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-white text-sm font-medium text-right">
                הודעה
              </label>
              <textarea
                id="message"
                rows={4}
                className="bg-[#222222] border border-[#444444] text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#FFFFFF] text-right"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="mask-button-container self-start">
              <span className="mask-text">{submitting ? "שולח..." : "שליחה"}</span>
            <button
              type="submit"
              disabled={submitting}
                className={`mask-button ${submitting ? "opacity-70 cursor-wait" : ""}`}
            >
                {submitting ? "שולח..." : "שליחה"}
            </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
