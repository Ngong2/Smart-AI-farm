import React from 'react';
import { motion } from 'framer-motion';

const Map = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="h-96 w-full">
        <iframe
          title="SMART FARM Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255282.35859752384!2d34.77060455!3d3.7145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1785f3b3f3b3f3b3%3A0x3b3f3b3f3b3f3b3f!2sKakuma%2C%20Kenya!5e0!3m2!1sen!2sus!4v1633000000000!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
      
      <div className="p-6 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Our Main Office</h3>
            <p className="text-gray-600 text-sm">Kakuma Refugee Camp, Turkana County</p>
          </div>
          <a
            href="https://maps.google.com/?q=Kakuma,Kenya"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Get Directions →
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default Map;
