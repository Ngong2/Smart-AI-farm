import React from 'react';
import { motion } from 'framer-motion';
import {
  FaCamera,
  FaCloudSun,
  FaSeedling,
  FaHistory,
  FaMobile,
  FaLanguage
} from 'react-icons/fa';

const features = [
  {
    icon: FaCamera,
    title: 'AI Disease Detection',
    description: 'Snap a photo of your crop and our AI instantly identifies diseases and provides treatment solutions.',
    iconBg: 'bg-red-500/15',
    iconRing: 'ring-red-400/25',
    iconColor: 'text-red-400',
    accent: 'group-hover:text-red-400',
  },
  {
    icon: FaCloudSun,
    title: 'Weather Advisory',
    description: 'Get real-time weather updates and smart planting recommendations based on local conditions.',
    iconBg: 'bg-sky-500/15',
    iconRing: 'ring-sky-400/25',
    iconColor: 'text-sky-400',
    accent: 'group-hover:text-sky-400',
  },
  {
    icon: FaSeedling,
    title: 'Soil Health Analysis',
    description: 'Understand your soil better with AI-powered recommendations for fertilizers and crop rotation.',
    iconBg: 'bg-emerald-500/15',
    iconRing: 'ring-emerald-400/25',
    iconColor: 'text-emerald-400',
    accent: 'group-hover:text-emerald-400',
  },
  {
    icon: FaHistory,
    title: 'Farm History Tracking',
    description: 'Keep records of all your crop analyses and soil reports for better farm management.',
    iconBg: 'bg-violet-500/15',
    iconRing: 'ring-violet-400/25',
    iconColor: 'text-violet-400',
    accent: 'group-hover:text-violet-400',
  },
  {
    icon: FaMobile,
    title: 'Works Offline First',
    description: 'Designed for low-bandwidth areas. Upload photos when you have connection.',
    iconBg: 'bg-amber-500/15',
    iconRing: 'ring-amber-400/25',
    iconColor: 'text-amber-400',
    accent: 'group-hover:text-amber-400',
  },
  {
    icon: FaLanguage,
    title: 'Local Language Support',
    description: 'Available in English and Swahili, with more local languages coming soon.',
    iconBg: 'bg-teal-500/15',
    iconRing: 'ring-teal-400/25',
    iconColor: 'text-teal-400',
    accent: 'group-hover:text-teal-400',
  },
];

const Features = () => {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-gradient-to-b from-green-950 to-emerald-950">

      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-emerald-700/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-teal-500/8 blur-3xl" />
      </div>

      {/* Grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      <div className="relative container mx-auto px-6 lg:px-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/25 text-emerald-300 px-4 py-1.5 rounded-full text-sm font-medium tracking-widest uppercase backdrop-blur-sm mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Platform Features
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-5">
            Powerful Features for
            <span className="block text-emerald-400 mt-1">Modern Farming</span>
          </h2>

          <p className="text-lg text-emerald-100/60 max-w-2xl mx-auto leading-relaxed">
            Everything you need to maximize your crop yield and make data-driven farming decisions
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="
                  group relative
                  bg-white/5 hover:bg-white/8
                  border border-white/10 hover:border-emerald-400/30
                  backdrop-blur-sm
                  rounded-2xl p-8
                  transition-all duration-300
                  hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30
                  cursor-default
                "
              >
                {/* Subtle inner glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />

                {/* Icon */}
                <div className={`relative z-10 w-14 h-14 ${feature.iconBg} ring-1 ${feature.iconRing} rounded-xl flex items-center justify-center mb-6`}>
                  <Icon className={`text-2xl ${feature.iconColor}`} />
                </div>

                {/* Text */}
                <h3 className="relative z-10 text-lg font-bold text-white mb-3 tracking-tight">
                  {feature.title}
                </h3>

                <p className="relative z-10 text-emerald-100/55 leading-relaxed text-sm">
                  {feature.description}
                </p>

                {/* Learn more link */}
                <div className={`relative z-10 mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400/60 ${feature.accent} transition-colors duration-200`}>
                  <span>Learn more</span>
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;