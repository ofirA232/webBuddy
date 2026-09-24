import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { TriangleAlert } from "lucide-react";
import emailjs from "@emailjs/browser";
import { cn } from "@/lib/utils";
import { EASE_OUT, exitTransition } from "@/lib/motion";
import { site } from "@/data/site";
import { CtaButton } from "./CtaButton";
import { Reveal } from "./motion/Reveal";

const EMAILJS = {
  serviceId: "service_sk2i8v9",
  templateId: "template_ihb55nw",
  publicKey: "gr9F4_3kEH2AsGWOA",
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

const EMPTY: FormState = { firstName: "", lastName: "", email: "", phone: "", message: "" };

// 16px on phones: iOS zooms the whole page into any field set smaller than that.
const inputClass =
  "contact-input h-11 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 text-base text-white placeholder:text-white/30 sm:text-sm";

function Field({
  id,
  label,
  className,
  children,
}: {
  id: string;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[13px] font-medium text-white/90">
        {label}
      </label>
      {children}
    </div>
  );
}

const ContactSection = () => {
  const reduce = useReducedMotion() ?? false;
  const [form, setForm] = useState<FormState>(EMPTY);
  const [wantsCall, setWantsCall] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    emailjs.init(EMAILJS.publicKey);
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // The EmailJS template takes one name and one message, so the new fields are folded
      // into those instead of needing the template changed.
      await emailjs.send(
        EMAILJS.serviceId,
        EMAILJS.templateId,
        {
          from_name: `${form.firstName} ${form.lastName}`.trim(),
          from_email: form.email,
          from_phone: form.phone,
          message: wantsCall ? `${form.message}\n\n— מבקש/ת שיחת היכרות טלפונית` : form.message,
        },
        EMAILJS.publicKey,
      );

      setForm(EMPTY);
      setWantsCall(false);
      setSubmitted(true);
      window.setTimeout(() => setSubmitted(false), 6000);
    } catch (sendError) {
      console.error("Error submitting form:", sendError);
      setError("משהו השתבש בשליחה. נסה שוב בעוד רגע.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" dir="rtl" className="contact-section relative isolate overflow-hidden">
      <div className="contact-backdrop" aria-hidden="true">
        <div className="contact-horizon" />
        <div className="contact-glow" />
        <div className="contact-stars" />
      </div>

      {/* Top padding keeps the heading just inside the planet, below the rim. */}
      <div className="container relative mx-auto max-w-7xl px-4 pb-24 pt-[15.5rem] sm:px-6 md:pb-32 md:pt-[16.5rem] lg:px-8">
        {/* TODO(user): approve or edit this copy */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">יצירת קשר</p>
          <h2 className="mt-4 text-4xl font-light leading-tight tracking-tight text-white md:text-5xl">
            בוא נעבוד יחד
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
            ספר לי קצת על הפרויקט שלך, ואחזור אליך בהקדם עם כל המידע שצריך.
          </p>
          {site.whatsapp && (
            <p className="mt-4 text-sm text-white/50">
              מעדיפים וואטסאפ?{" "}
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="accent-text font-medium underline decoration-[rgb(var(--accent-soft)/0.4)] underline-offset-4 can-hover:hover:decoration-[rgb(var(--accent-soft))]"
              >
                <span dir="ltr">{site.phone}</span>
              </a>
            </p>
          )}
        </Reveal>

        <Reveal
          delay={0.08}
          className="relative mx-auto mt-12 w-full max-w-[580px] rounded-2xl border border-white/[0.08] bg-[#0b0a0b]/85 p-5 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] backdrop-blur-sm sm:p-7 md:mt-14"
        >
          {/* Success is a rare, high-emotion moment: it earns a scale-in and a drawn checkmark. */}
          <AnimatePresence mode="wait" initial={false}>
            {submitted ? (
              <motion.div
                key="success"
                role="status"
                initial={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.3, ease: EASE_OUT } }}
                exit={{ opacity: 0, transition: exitTransition }}
                className="flex flex-col items-center justify-center px-2 py-10 text-center"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="accent-text mb-5 h-14 w-14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
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
                    d="M8.5 12.5l2.5 2.5 4.5-5"
                    initial={{ pathLength: reduce ? 1 : 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3, ease: EASE_OUT, delay: 0.35 }}
                  />
                </svg>
                <p className="text-lg font-medium text-white">ההודעה נשלחה</p>
                <p className="mt-2 text-sm text-white/60">תודה על הפנייה, אחזור אליך בהקדם.</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                exit={{ opacity: 0, transition: exitTransition }}
                className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2"
              >
                <AnimatePresence initial={false}>
                  {error && (
                    <motion.div
                      key="error"
                      role="alert"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 0.15 } }}
                      exit={{ opacity: 0, transition: exitTransition }}
                      className="flex items-start gap-2.5 rounded-lg border border-[rgb(var(--warn)/0.35)] bg-[rgb(var(--warn)/0.12)] px-4 py-3 text-sm text-[rgb(var(--warn))] sm:col-span-2"
                    >
                      <TriangleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Field id="firstName" label="שם פרטי">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="השם הפרטי שלך"
                    className={inputClass}
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                </Field>

                <Field id="lastName" label="שם משפחה">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="שם המשפחה שלך"
                    className={inputClass}
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </Field>

                <Field id="email" label="אימייל">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@example.com"
                    dir="ltr"
                    className={cn(inputClass, "text-right")}
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </Field>

                <Field id="phone" label="טלפון">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="050-0000000"
                    dir="ltr"
                    className={cn(inputClass, "text-right")}
                    value={form.phone}
                    onChange={handleChange}
                  />
                </Field>

                <Field id="message" label="על מה נדבר?" className="sm:col-span-2">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="כמה מילים על הפרויקט, המטרות ולוחות הזמנים"
                    className={cn(inputClass, "h-auto min-h-[120px] resize-y py-3 leading-relaxed")}
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </Field>

                {/* Intro call toggle, the counterpart of the reference's "schedule a demo call". */}
                <div className="flex items-center justify-between gap-6 pt-1 sm:col-span-2">
                  <div>
                    <label htmlFor="wantsCall" className="block text-sm font-semibold text-white">
                      אשמח לשיחת היכרות
                    </label>
                    <p className="mt-1 text-[13px] leading-snug text-white/50">
                      אחזור אליך בטלפון לתיאום שיחה קצרה.
                    </p>
                  </div>
                  <SwitchPrimitive.Root
                    id="wantsCall"
                    checked={wantsCall}
                    onCheckedChange={setWantsCall}
                    dir="rtl"
                    className="contact-switch relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-white/15 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    {/* RTL: off rests on the right, on travels to the left. */}
                    <SwitchPrimitive.Thumb className="block h-5 w-5 translate-x-[-2px] rounded-full bg-white shadow-md transition-transform duration-200 ease-out-strong data-[state=checked]:translate-x-[-22px]" />
                  </SwitchPrimitive.Root>
                </div>

                <div className="sm:col-span-2">
                  <CtaButton type="submit" variant="accent" block pending={submitting}>
                    {submitting ? "שולח..." : "שליחה"}
                  </CtaButton>
                  <p className="mt-4 text-center text-[12px] text-white/40">
                    הפרטים שלך נשארים אצלי ולא מועברים לאף אחד.
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
};

export default ContactSection;
