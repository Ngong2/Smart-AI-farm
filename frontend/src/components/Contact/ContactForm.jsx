import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaPhone, FaEnvelope, FaComment } from "react-icons/fa";
import toast from "react-hot-toast";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      toast.success("Message sent successfully! We’ll contact you soon");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-green-50 via-white to-emerald-50 overflow-hidden">
      
      {/* Transparent Agriculture SVG Background */}
      <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
        <svg
          width="500"
          height="500"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 10C60 60 60 120 100 190C140 120 140 60 100 10Z"
            fill="#16A34A"
          />
          <circle cx="100" cy="100" r="40" fill="#22C55E" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-green-100"
        >
          <h2 className="text-3xl font-bold text-green-700 mb-3 text-center">
            Green Agriculture Contact
          </h2>

          <p className="text-gray-600 text-center mb-8">
            Let’s grow sustainable farming solutions together.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name + Phone */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Your Name *</label>
                <div className="relative">
                  <FaUser className="icon-style" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-style"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Phone Number</label>
                <div className="relative">
                  <FaPhone className="icon-style" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-style"
                    placeholder="0712345678"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="form-label">Email Address *</label>
              <div className="relative">
                <FaEnvelope className="icon-style" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-style"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="form-label">Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="input-style"
                placeholder="Sustainable farming inquiry"
              />
            </div>

            {/* Message */}
            <div>
              <label className="form-label">Message *</label>
              <div className="relative">
                <FaComment className="absolute left-3 top-3 text-green-500" />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="input-style pl-10 resize-none"
                  placeholder="Tell us about your agricultural project..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-all duration-300 rounded-xl shadow-md hover:shadow-lg disabled:opacity-70"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </div>
              ) : (
                "Send Message 🌿"
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Tailwind Utility Classes */}
      <style jsx>{`
        .input-style {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #d1fae5;
          border-radius: 0.75rem;
          outline: none;
          transition: 0.3s ease;
        }

        .input-style:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
        }

        .form-label {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #166534;
        }

        .icon-style {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #22c55e;
        }
      `}</style>
    </section>
  );
};

export default ContactForm;