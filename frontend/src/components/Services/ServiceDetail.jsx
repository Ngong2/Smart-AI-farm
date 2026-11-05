import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!localStorage.getItem('token');

  // Service data (in a real app, this would come from an API)
  const servicesData = {
    'crop-detection': {
      id: 1,
      title: 'Crop Disease Detection',
      category: 'Technology',
      description: 'AI-powered instant detection of crop diseases using your smartphone camera.',
      fullDescription: 'Our advanced AI model has been trained on thousands of images of crops affected by various diseases common in East Africa. Simply take a photo of your crop, and within seconds, you\'ll receive a diagnosis along with recommended treatment options and prevention strategies.',
      icon: '📸',
      features: [
        'Instant disease identification',
        'Treatment recommendations',
        'Prevention tips',
        'Disease tracking history',
        'Offline capability'
      ],
      stats: { accuracy: '98%', diseases: '50+', users: '10,000+' },
      color: 'from-green-600 to-green-500',
      requiresAuth: true,
      benefits: [
        'Save crops from diseases',
        'Reduce pesticide use',
        'Increase yield quality',
        '24/7 availability',
        'Expert-backed recommendations'
      ],
      pricing: 'Free for basic use',
      image: '/images/crop-detection.jpg'
    },
    'weather-advisory': {
      id: 2,
      title: 'Weather Advisory',
      category: 'Forecasting',
      description: 'Hyper-local weather forecasts and early warnings tailored for farmers.',
      fullDescription: 'Get accurate, location-specific weather forecasts for the next 7 days. Our system provides early warnings for extreme weather events, optimal planting windows, and irrigation scheduling based on forecasted rainfall.',
      icon: '⛅',
      features: [
        '7-day weather forecast',
        'Rainfall predictions',
        'Extreme weather alerts',
        'Planting recommendations',
        'Irrigation scheduling'
      ],
      stats: { accuracy: '95%', coverage: '47 counties', alerts: '500+' },
      color: 'from-blue-600 to-blue-500',
      requiresAuth: false,
      benefits: [
        'Plan farming activities',
        'Prevent weather damage',
        'Optimize irrigation',
        'Save water resources',
        'Increase crop survival'
      ],
      pricing: 'Free',
      image: '/images/weather.jpg'
    },
    'soil-analysis': {
      id: 3,
      title: 'Soil Analysis',
      category: 'Advisory',
      description: 'Comprehensive soil testing and recommendations for optimal crop growth.',
      fullDescription: 'Submit soil samples for detailed analysis of nutrient content, pH levels, and organic matter. Receive personalized recommendations for soil amendments, fertilizer application, and crop selection based on your soil profile.',
      icon: '🌱',
      features: [
        'Soil nutrient analysis',
        'pH level testing',
        'Fertilizer recommendations',
        'Crop suitability mapping',
        'Organic matter assessment'
      ],
      stats: { tests: '5,000+', accuracy: '99%', satisfaction: '96%' },
      color: 'from-amber-600 to-amber-500',
      requiresAuth: true,
      benefits: [
        'Improve soil health',
        'Optimize fertilizer use',
        'Increase crop yields',
        'Reduce costs',
        'Sustainable farming'
      ],
      pricing: 'Premium service',
      image: '/images/soil.jpg'
    },
    'market-intelligence': {
      id: 4,
      title: 'Market Intelligence',
      category: 'Data',
      description: 'Real-time market prices and demand forecasts.',
      fullDescription: 'Access real-time market prices from major markets across Kenya. Get insights on price trends, demand forecasts, and connect directly with buyers. Make data-driven decisions to maximize your profits.',
      icon: '📊',
      features: [
        'Live market prices',
        'Price trend analysis',
        'Demand forecasting',
        'Buyer connections',
        'Transport logistics'
      ],
      stats: { markets: '120+', commodities: '85+', updates: 'Hourly' },
      color: 'from-purple-600 to-purple-500',
      requiresAuth: false,
      benefits: [
        'Get best prices',
        'Find buyers easily',
        'Reduce post-harvest losses',
        'Market trends insights',
        'Increase profits'
      ],
      pricing: 'Free',
      image: '/images/market.jpg'
    },
    'expert-consultation': {
      id: 5,
      title: 'Expert Consultation',
      category: 'Advisory',
      description: 'Direct access to agricultural experts for personalized advice.',
      fullDescription: 'Connect with certified agricultural extension officers and agronomists through video calls, chat, or in-person visits. Get personalized advice for your specific farming situation.',
      icon: '👨‍🌾',
      features: [
        'Video consultations',
        'Expert chat support',
        'Farm visits',
        'Custom farm plans',
        'Follow-up support'
      ],
      stats: { experts: '45+', consultations: '3,000+', rating: '4.9/5' },
      color: 'from-red-600 to-red-500',
      requiresAuth: true,
      benefits: [
        'Expert guidance',
        'Personalized advice',
        'Problem solving',
        'Knowledge transfer',
        'Continuous support'
      ],
      pricing: 'Premium service',
      image: '/images/expert.jpg'
    },
    'training': {
      id: 6,
      title: 'Training & Workshops',
      category: 'Education',
      description: 'Practical training programs on modern farming techniques.',
      fullDescription: 'Join our hands-on training sessions covering everything from basic farming practices to advanced agricultural technologies. Learn from experienced farmers and agricultural experts.',
      icon: '📚',
      features: [
        'Practical workshops',
        'Online courses',
        'Demonstration farms',
        'Certification programs',
        'Farmer networks'
      ],
      stats: { courses: '25+', graduates: '5,000+', workshops: '150+' },
      color: 'from-teal-600 to-teal-500',
      requiresAuth: false,
      benefits: [
        'Learn new skills',
        'Modern techniques',
        'Network with farmers',
        'Get certified',
        'Increase productivity'
      ],
      pricing: 'Various options',
      image: '/images/training.jpg'
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      if (servicesData[serviceId]) {
        setService(servicesData[serviceId]);
      }
      setLoading(false);
    }, 500);
  }, [serviceId]);

  const handleAccess = () => {
    if (service?.requiresAuth && !isAuthenticated) {
      toast.error('Please login to access this service');
      navigate('/login', { state: { from: `/services/${serviceId}` } });
    } else {
      // Navigate to the actual service page
      switch(serviceId) {
        case 'crop-detection':
          navigate('/crop/detect');
          break;
        case 'weather-advisory':
          navigate('/weather');
          break;
        case 'soil-analysis':
          navigate('/soil');
          break;
        default:
          toast.success('Service will be available soon');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h2>
          <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
          <Link
            to="/services"
            className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
          >
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className={`bg-gradient-to-r ${service.color} py-16`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <div className="text-6xl mb-4">{service.icon}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.title}</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              {service.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Service</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.fullDescription}</p>

                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Benefits</h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {service.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">Features</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Stats & CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Service Overview</h3>
                
                {/* Stats */}
                <div className="space-y-4 mb-6">
                  {Object.entries(service.stats).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-gray-600 capitalize">{key}</span>
                      <span className="text-lg font-bold text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Pricing</p>
                  <p className="text-lg font-bold text-gray-900">{service.pricing}</p>
                </div>

                {/* Auth Status */}
                {service.requiresAuth && !isAuthenticated && (
                  <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      🔒 This service requires login. Please sign in to access.
                    </p>
                  </div>
                )}

                {/* CTA Buttons */}
                <button
                  onClick={handleAccess}
                  className={`w-full py-4 rounded-xl font-semibold text-white mb-3 transition-all duration-300 transform hover:-translate-y-1 shadow-lg bg-gradient-to-r ${service.color}`}
                >
                  {service.requiresAuth && !isAuthenticated ? 'Login to Access' : 'Access Service'}
                </button>

                <Link
                  to="/services"
                  className="block w-full text-center py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                >
                  Back to Services
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Other Services You Might Like</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(servicesData)
              .filter(([id]) => id !== serviceId)
              .slice(0, 3)
              .map(([id, relatedService]) => (
                <Link to={`/services/${id}`} key={id}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all"
                  >
                    <div className="text-3xl mb-3">{relatedService.icon}</div>
                    <h3 className="font-bold text-gray-900 mb-2">{relatedService.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{relatedService.description}</p>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r ${relatedService.color} text-white`}>
                      {relatedService.category}
                    </span>
                  </motion.div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;