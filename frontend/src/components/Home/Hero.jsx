import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCamera, FaCloudSun, FaSeedling } from "react-icons/fa";

const bgImages = [
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=2000&q=80",
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % bgImages.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* Background Image Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImages[current]})` }}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Light Transparent Overlay (Professional) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/20" />

      {/* Soft Bottom Fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 lg:px-12 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full mb-6 text-xs uppercase tracking-wider">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              AI-Powered Farming Platform
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Smart Agriculture for
              <span className="block text-emerald-400 mt-2">
                Turkana Communities
              </span>
            </h1>

            <p className="text-lg text-white/85 leading-relaxed mb-10 max-w-xl">
              Identify crop diseases instantly, receive intelligent planting
              advice, and improve soil productivity using advanced AI
              technology designed for farmers in Kakuma and beyond.
            </p>

            <div className="flex flex-wrap gap-4 mb-14">
              <Link
                to="/register"
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-3.5 rounded-xl transition duration-300 shadow-lg hover:-translate-y-1"
              >
                Get Started
              </Link>

              <Link
                to="/about"
                className="border border-white/40 text-white hover:bg-white/10 px-8 py-3.5 rounded-xl transition duration-300"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-12 pt-8 border-t border-white/20">
              {[
                { value: "500+", label: "Farmers Supported" },
                { value: "95%", label: "Detection Accuracy" },
                { value: "24/7", label: "AI Assistance" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-3xl font-bold text-emerald-400">
                    {item.value}
                  </div>
                  <div className="text-sm text-white/70 mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT SIDE GLASS CARDS */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative hidden md:flex items-center justify-center min-h-[420px]"
          >
            {/* Center Badge */}
            <div className="relative z-20 w-24 h-24 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-xl">
              <FaSeedling className="text-emerald-400 text-4xl" />
            </div>

            {/* Disease Card */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute top-6 left-0 bg-white/15 border border-white/25 p-4 rounded-2xl shadow-xl"
            >
              <div className="flex items-center gap-3">
                <FaCamera className="text-red-400 text-lg" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Disease Detected
                  </p>
                  <p className="text-xs text-white/80">
                    Early Blight Risk
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Weather Card */}
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
              className="absolute bottom-6 right-0 bg-white/15 border border-white/25 p-4 rounded-2xl shadow-xl"
            >
              <div className="flex items-center gap-3">
                <FaCloudSun className="text-sky-400 text-lg" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Weather Insight
                  </p>
                  <p className="text-xs text-white/80">
                    Ideal Planting Window
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;