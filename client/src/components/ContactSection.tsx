import { useState, FormEvent } from "react";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
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
    
    // Simulating form submission - in a real app, this would send data to a server
    try {
      // Simulate server request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form after "successful" submission
      setFormData({
        name: "",
        email: "",
        message: ""
      });
      
      setSubmitted(true);
      
      // Hide success message after a few seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="mb-12">
      <h2 className="text-[#FFFFFF] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Get in Touch</h2>
      <div className="bg-[#111111] p-6 rounded-xl border border-[#333333]">
        {submitted ? (
          <div className="text-green-400 p-4 text-center">
            <p className="text-lg font-medium">Thank you for your message!</p>
            <p className="mt-2">I'll get back to you as soon as possible.</p>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-[#FFFFFF] text-sm font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="bg-[#222222] border border-[#444444] text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[#FFFFFF] text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-[#222222] border border-[#444444] text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-[#FFFFFF] text-sm font-medium">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="bg-[#222222] border border-[#444444] text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className={`flex mt-2 min-w-[84px] max-w-[480px] w-fit cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#FFFFFF] text-black text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 transition-colors ${
                submitting ? "opacity-70 cursor-wait" : ""
              }`}
            >
              <span className="truncate">{submitting ? "Sending..." : "Send Message"}</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
