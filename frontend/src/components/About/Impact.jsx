import React from "react";
import { motion } from "framer-motion";
import { FaChartLine, FaWater, FaTree, FaUsers, FaSeedling, FaTractor } from "react-icons/fa";

const impacts = [
  {
    icon: FaChartLine,
    title: "Crop Productivity Growth",
    description:
      "AI-powered crop monitoring and predictive analytics have significantly improved harvest output across participating farms.",
    stat: "+40%",
    color: "text-green-600",
    bgColor: "bg-green-100",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop"
  },
  {
    icon: FaWater,
    title: "Smart Water Management",
    description:
      "Precision irrigation recommendations reduced unnecessary water usage while maintaining optimal soil moisture levels.",
    stat: "1M+ L",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop"
  },
  {
    icon: FaTree,
    title: "Eco-Friendly Practices",
    description:
      "Early disease detection and AI alerts helped farmers reduce chemical pesticide dependency.",
    stat: "-60%",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop"
  },
  {
    icon: FaUsers,
    title: "Farmer Network Expansion",
    description:
      "A growing digital agriculture community enabling collaboration, shared learning, and sustainable rural development.",
    stat: "500+",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    image: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7b0b?w=800&auto=format&fit=crop"
  },
];

const Impact = () => {
  // Multiple fallback images in case primary images fail
  const fallbackImages = [
    "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7b0b?w=800&auto=format&fit=crop"
  ];

  const handleImageError = (e) => {
    // Try different fallback images
    const randomIndex = Math.floor(Math.random() * fallbackImages.length);
    e.target.src = fallbackImages[randomIndex];
    
    // If that also fails, use a data URI placeholder
    e.target.onerror = () => {
      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%234CAF50' opacity='0.2'/%3E%3Ctext x='400' y='300' font-family='Arial' font-size='24' fill='%23333' text-anchor='middle'%3E SMART FARM Agriculture %3C/text%3E%3C/svg%3E";
    };
  };

  return (
    <section className="relative py-24 bg-gradient-to-b from-green-50 to-white overflow-hidden">
      {/* Agricultural Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20 L25 10 L30 20 L25 30 Z' fill='%232E7D32' opacity='0.2'/%3E%3Ccircle cx='40' cy='40' r='5' fill='%234CAF50' opacity='0.15'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center justify-center mb-6">
            <FaSeedling className="text-green-600 text-4xl mr-2" />
            <FaTractor className="text-green-700 text-4xl" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
            Driving Measurable Agricultural Impact
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Data-driven results demonstrating how AI is transforming farming
            productivity, sustainability, and rural livelihoods across Kenya.
          </p>
        </motion.div>

        {/* Impact Cards */}
        <div className="grid md:grid-cols-2 gap-10 mb-24">
          {impacts.map((impact, index) => {
            const Icon = impact.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row items-start gap-6 border border-gray-100 group hover:scale-[1.02]"
              >
                <div className="relative w-full md:w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                  <img 
                    src={impact.image} 
                    alt={impact.title}
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 ${impact.bgColor} opacity-20`}></div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div
                      className={`w-12 h-12 ${impact.bgColor} rounded-xl flex items-center justify-center`}
                    >
                      <Icon className={`text-2xl ${impact.color}`} />
                    </div>
                    <span className={`text-3xl font-extrabold ${impact.color}`}>
                      {impact.stat}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {impact.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {impact.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Strategy Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          
          {/* Strategy Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-block px-4 py-2 bg-green-100 rounded-full">
              <span className="text-green-700 font-medium">Our Approach</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Smart Agricultural Strategy for Turkana Farmers
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We integrate artificial intelligence, climate data modeling,
              and local agricultural knowledge to provide precision farming
              recommendations tailored to smallholder farmers in arid and semi-arid regions.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Through predictive analytics, soil health monitoring, and
              smart irrigation planning, our strategy ensures long-term
              food security while protecting natural ecosystems and adapting to climate change.
            </p>

            {/* Strategy Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">5,000+</div>
                <div className="text-xs text-gray-500">Farmers Reached</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">47</div>
                <div className="text-xs text-gray-500">Counties</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">85%</div>
                <div className="text-xs text-gray-500">Success Rate</div>
              </div>
            </div>
          </motion.div>

          {/* Strategy Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1600&auto=format&fit=crop"
                alt="Farmers working together in Turkana"
                onError={handleImageError}
                className="w-full h-[400px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent"></div>
              
              {/* Overlay Text */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-lg font-semibold">Turkana Farmers</p>
                <p className="text-sm opacity-90">Embracing smart agriculture</p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-500 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-yellow-500 rounded-full opacity-20 blur-2xl"></div>
          </motion.div>
        </div>

        {/* Success Stories */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-green-800 to-green-700 rounded-3xl p-12 text-white relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <FaUsers className="text-5xl mx-auto mb-4 opacity-80" />
            <h3 className="text-3xl font-bold mb-4">Join Our Growing Farmer Community</h3>
            <p className="text-green-100 mb-8 text-lg">
              Be part of the agricultural revolution in Turkana. Access real-time weather data, 
              crop advice, and connect with other farmers using our platform.
            </p>
            <button className="px-8 py-4 bg-white text-green-800 rounded-lg font-semibold hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Become a Member Today
            </button>
          </div>

          {/* Farmer Avatars */}
          <div className="flex justify-center -space-x-4 mt-8">
            <div className="w-12 h-12 rounded-full border-2 border-white bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              JM
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-white bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              AK
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-white bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              PL
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-white bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              MN
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-white bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              +500
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">2,500+</div>
              <div className="text-green-200 text-sm">Active Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">15,000+</div>
              <div className="text-green-200 text-sm">Acres Managed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">47</div>
              <div className="text-green-200 text-sm">Counties</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Impact;
