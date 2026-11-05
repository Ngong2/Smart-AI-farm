import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

const stats = [
  { value: 500,   label: 'Farmers Registered',        suffix: '+' },
  { value: 95,    label: 'Disease Detection Accuracy', suffix: '%' },
  { value: 10000, label: 'Acres Covered',              suffix: '+' },
  { value: 24,    label: 'Languages Supported',        suffix: '/7' }
];

const Stats = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-r from-green-900 via-emerald-800 to-teal-900">

      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-teal-400/10 blur-3xl" />
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

      {/* Top & bottom separator lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />

      <div className="relative container mx-auto px-6 lg:px-10">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="
                group relative text-center
                bg-white/5 hover:bg-white/8
                border border-white/10 hover:border-emerald-400/30
                backdrop-blur-sm rounded-2xl
                px-6 py-8
                transition-all duration-300
                hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20
              "
            >
              {/* Inner glow on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-emerald-500/8 to-transparent pointer-events-none" />

              {/* Number */}
              <div className="relative z-10 text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
                {inView && (
                  <CountUp end={stat.value} duration={2.5} suffix={stat.suffix} />
                )}
              </div>

              {/* Divider */}
              <div className="relative z-10 mx-auto mb-3 w-8 h-px bg-emerald-400/40" />

              {/* Label */}
              <div className="relative z-10 text-sm md:text-base font-medium text-emerald-200/70 leading-snug">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;