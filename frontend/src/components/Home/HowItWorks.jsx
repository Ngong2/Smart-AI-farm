import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCamera, FaRobot, FaLeaf, FaCheckCircle } from 'react-icons/fa';

const steps = [
  {
    icon: FaCamera,
    title: '1. Capture',
    description: 'Take a clear photo of your crop or upload from your gallery',
    color: 'from-green-400 to-lime-400'
  },
  {
    icon: FaRobot,
    title: '2. Analyze',
    description: 'Our AI instantly analyzes the image for diseases and issues',
    color: 'from-emerald-400 to-green-500'
  },
  {
    icon: FaLeaf,
    title: '3. Get Solutions',
    description: 'Receive treatment recommendations and prevention tips',
    color: 'from-lime-400 to-emerald-500'
  },
  {
    icon: FaCheckCircle,
    title: '4. Take Action',
    description: "Apply the solutions and track your farm's progress",
    color: 'from-green-500 to-emerald-400'
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-green-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
            How SMART FARM Works
          </h2>
          <p className="text-xl text-green-700 max-w-2xl mx-auto">
            Simple steps to smarter farming with AI technology
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-green-200 via-green-400 to-green-200 transform -translate-y-1/2"></div>

          <div className="grid lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow relative z-10 border border-green-100">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${step.color} p-0.5 mb-6 mx-auto`}>
                      <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                        <Icon className="text-4xl text-green-700" />
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-center mb-3 text-green-800">
                      {step.title}
                    </h3>

                    <p className="text-green-700 text-center">
                      {step.description}
                    </p>

                    {/* Step Number */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center my-4">
                      <svg className="w-6 h-6 text-green-400 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7-7-7m14-8l-7 7-7-7" />
                      </svg>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            to="/register"
            className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3 rounded-xl inline-flex items-center transition-colors"
          >
            Try It Now
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
