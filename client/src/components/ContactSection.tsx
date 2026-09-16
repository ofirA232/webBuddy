import { useState, useEffect, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import emailjs from '@emailjs/browser';
import { EASE_OUT, exitTransition } from "@/lib/motion";
import { CtaButton } from "./CtaButton";
import { Reveal } from "./motion/Reveal";

const inputClass =
  "bg-[#222222] border border-[#444444] text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#FFFFFF] text-right";

const ContactSection = () => {
  useEffect(() => {
    emailjs.init("gr9F4_3kEH2AsGWOA");
  }, []);

  const reduce = useReducedMotion() ?? false;

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
      <Reveal>
        <h2 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight pb-3 pt-5 text-right">יצירת קשר</h2>
      </Reveal>
      <Reveal delay={0.05} className="bg-[#111111] p-4 sm:p-6 rounded-xl border border-[#333333] w-full md:max-w-[calc(100%-200px)] lg:max-w-[calc(100%-450px)] mx-auto">
        {/* Success is a rare, high-emotion moment: it earns a scale-in and a drawn checkmark. */}
        <AnimatePresence mode="wait" initial={false}>
          {submitted ? (
            <motion.div
              key="success"
              role="status"
              initial={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.3, ease: EASE_OUT } }}
              exit={{ opacity: 0, transition: exitTransition }}
              className="p-4 text-center flex flex-col items-center justify-center"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-12 w-12 mb-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <motion.circle
                  cx="12"
                  cy="12"
                  r="9"
                  initial={{ pathLength: reduce ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.1 }}
                />
                <motion.path
                  d="M9 12l2 2 4-4"
                  initial={{ pathLength: reduce ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, ease: EASE_OUT, delay: 0.35 }}
                />
              </svg>
              <p className="text-base sm:text-lg font-medium mb-2">הודעתך התקבלה בהצלחה!</p>
              <p className="text-sm sm:text-base text-gray-300">תודה על פנייתך. נחזור אליך בהקדם האפשרי.</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              className="flex flex-col gap-4"
              onSubmit={handleSubmit}
              dir="rtl"
              exit={{ opacity: 0, transition: exitTransition }}
            >
              <AnimatePresence initial={false}>
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.15 } }}
                    exit={{ opacity: 0, transition: exitTransition }}
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-right"
                    role="alert"
                  >
                    <span className="block sm:inline">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="name" className="text-white text-sm font-medium text-right">
                    שם מלא
                  </label>
                  <input
                    type="text"
                    id="name"
                    autoComplete="name"
                    className={inputClass}
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
                      autoComplete="email"
                      className={inputClass}
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
                      autoComplete="tel"
                      className={inputClass}
                      value={formData.phone}
                      onChange={handleChange}
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
                  className={inputClass}
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="self-start">
                <CtaButton type="submit" size="sm" pending={submitting}>
                  {submitting ? "שולח..." : "שליחה"}
                </CtaButton>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </Reveal>
    </section>
  );
};

export default ContactSection;
