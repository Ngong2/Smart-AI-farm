import React from "react";
import { motion } from "framer-motion";
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock,
  FaWhatsapp,
  FaTwitter,
  FaFacebook
} from "react-icons/fa";

const contactInfo = [
  {
    icon: FaMapMarkerAlt,
    title: "Visit Us",
    details: ["SMART FARM Hub", "Kakuma Refugee Camp", "Turkana County, Kenya"],
    bgColor: "bg-green-100",
    textColor: "text-green-600"
  },
  {
    icon: FaPhone,
    title: "Call Us",
    details: ["+254 700 000 000", "+254 711 111 111"],
    bgColor: "bg-green-100",
    textColor: "text-green-600"
  },
  {
    icon: FaEnvelope,
    title: "Email Us",
    details: ["info@smartfarm.co.ke", "support@smartfarm.co.ke"],
    bgColor: "bg-green-100",
    textColor: "text-green-600"
  },
  {
    icon: FaClock,
    title: "Working Hours",
    details: ["Monday - Friday: 8am - 6pm", "Saturday: 9am - 2pm", "Sunday: Closed"],
    bgColor: "bg-green-100",
    textColor: "text-green-600"
  }
];

const ContactInfo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-green-50 p-8 rounded-xl shadow-md"
    >
      <h2 className="text-2xl font-bold text-green-900 mb-6 text-center">Contact Information</h2>

      <div className="space-y-6">
        {contactInfo.map((info, index) => {
          const Icon = info.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-4"
            >
              <div className={`w-12 h-12 ${info.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className={`text-2xl ${info.textColor}`} />
              </div>
              <div>
                <h3 className="font-semibold text-green-900 mb-1">{info.title}</h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-green-700 text-sm">{detail}</p>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Social Media Links */}
      <div className="mt-8 pt-8 border-t border-green-200 text-center">
        <h3 className="font-semibold text-green-900 mb-4">Connect With Us</h3>
        <div className="flex justify-center space-x-4">
          <a
            href="#"
            className="w-12 h-12 bg-green-500 text-white rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
          >
            <FaWhatsapp size={24} />
          </a>
          <a
            href="#"
            className="w-12 h-12 bg-blue-400 text-white rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="#"
            className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <FaFacebook size={24} />
          </a>
        </div>
      </div>

      {/* Quick Support */}
      <div className="mt-8 bg-green-100 rounded-lg p-6 text-center">
        <h3 className="font-semibold text-green-900 mb-2">Need Quick Help?</h3>
        <p className="text-green-700 text-sm mb-4">
          Our AI assistant is available 24/7 to answer your farming questions
        </p>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors w-full">
          Chat with AI Assistant
        </button>
      </div>
    </motion.div>
  );
};

export default ContactInfo;
