import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    name: 'John Ekai',
    role: 'Maize Farmer, Kakuma',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    content: "SMART FARM saved my maize crop from a disease I couldn't identify. The AI detected it immediately and gave me simple treatment options. My harvest doubled!",
    rating: 5
  },
  {
    name: 'Mary Achieng',
    role: 'Vegetable Farmer, Lodwar',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    content: "The weather advisory feature is a game-changer. I now know exactly when to plant and when to expect rain. No more guessing!",
    rating: 5
  },
  {
    name: 'Peter Lokol',
    role: 'Sorghum Farmer, Turkana',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    content: "Simple to use even with basic phone. The soil advice helped me improve my soil fertility using local materials. Highly recommended!",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-gradient-to-b from-emerald-950 to-green-950">

      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 rounded-full bg-emerald-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-green-500/10 blur-3xl" />
      </div>

      {/* Grain texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '128px 128px',
        }}
      />

      {/* Top separator */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent" />

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
            Farmer Stories
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-5">
            What Farmers
            <span className="block text-emerald-400 mt-1">Say About Us</span>
          </h2>

          <p className="text-lg text-emerald-100/60 max-w-2xl mx-auto leading-relaxed">
            Real stories from farmers in Turkana who transformed their farming with SMART FARM
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative bg-white/5 hover:bg-white/8 border border-white/10 hover:border-emerald-400/30 backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30"
            >
              {/* Inner hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-emerald-500/6 to-transparent pointer-events-none" />

              {/* Decorative quote icon */}
              <FaQuoteLeft className="absolute top-6 right-6 text-emerald-400/15 text-4xl" />

              {/* Avatar + identity */}
              <div className="relative z-10 flex items-center mb-6">
                <div className="relative shrink-0">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-400/30"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-green-950" />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-white text-base leading-tight">{testimonial.name}</h3>
                  <p className="text-emerald-300/60 text-sm mt-0.5">{testimonial.role}</p>
                </div>
              </div>

              {/* Star rating */}
              <div className="relative z-10 flex gap-1 mb-5">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-amber-400 text-sm" />
                ))}
              </div>

              {/* Quote body */}
              <p className="relative z-10 text-emerald-100/65 leading-relaxed text-sm italic">
                "{testimonial.content}"
              </p>

              {/* Animated bottom accent */}
              <div className="relative z-10 mt-6 h-px w-10 bg-emerald-400/30 group-hover:w-16 group-hover:bg-emerald-400/60 transition-all duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
