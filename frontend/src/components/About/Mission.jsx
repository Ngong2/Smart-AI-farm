import React from "react";
import { motion } from "framer-motion";
import { FaHeart, FaLeaf, FaUsers, FaGlobeAfrica } from "react-icons/fa";

const values = [
  {
    icon: <FaHeart className="text-2xl text-rose-600" />,
    title: "Commitment",
    bg: "bg-rose-100",
  },
  {
    icon: <FaLeaf className="text-2xl text-emerald-600" />,
    title: "Sustainable Growth",
    bg: "bg-emerald-100",
  },
  {
    icon: <FaUsers className="text-2xl text-blue-600" />,
    title: "Farmer Community",
    bg: "bg-blue-100",
  },
];

const Mission = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Transforming Agriculture Through Intelligent Innovation
            </h2>

            {/* Mission Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-emerald-700 mb-3">
                Our Mission
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                To empower farmers with AI-driven insights and digital tools 
                that enhance productivity, reduce crop losses, and promote 
                climate-smart agriculture. We bridge technology and traditional 
                farming knowledge to improve livelihoods and strengthen food security.
              </p>
            </div>

            {/* Vision Section */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-blue-700 mb-3 flex items-center gap-2">
                <FaGlobeAfrica className="text-blue-600" />
                Our Vision
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                To become a leading digital agriculture platform transforming 
                rural farming communities across Africa through sustainable 
                innovation, data-driven decision-making, and inclusive growth.
              </p>
            </div>

            {/* Core Values */}
            <div className="grid grid-cols-3 gap-6">
              {values.map((value, index) => (
                <div key={index} className="text-center group">
                  <div
                    className={`w-16 h-16 ${value.bg} rounded-full flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}
                  >
                    {value.icon}
                  </div>
                  <p className="font-semibold text-gray-800">
                    {value.title}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1740&q=80"
              alt="Smart agriculture field with drone monitoring crops"
              className="rounded-3xl shadow-2xl object-cover w-full h-full"
            />

            {/* Highlight Badge */}
            <div className="absolute -bottom-8 -left-8 bg-emerald-600 text-white px-8 py-6 rounded-3xl shadow-xl backdrop-blur-md">
              <p className="text-4xl font-bold tracking-tight">2026</p>
              <p className="text-sm uppercase tracking-wide opacity-90">
                Advancing Smart Farming
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Mission;