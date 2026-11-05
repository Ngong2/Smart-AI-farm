import React from "react";
import { motion } from "framer-motion";
import { FaTwitter, FaLinkedin, FaEnvelope } from "react-icons/fa";

const team = [
  {
    name: "Dr. Sarah Omondi",
    role: "Agricultural Expert",
    bio: "PhD in Plant Pathology with 15 years experience in Kenyan agriculture",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    social: {
      twitter: "#",
      linkedin: "#",
      email: "sarah@smartfarm.co.ke",
    },
  },
  {
    name: "James Ekiru",
    role: "Lead Developer",
    bio: "Full-stack developer passionate about using tech for social impact",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    social: {
      twitter: "#",
      linkedin: "#",
      email: "james@smartfarm.co.ke",
    },
  },
  {
    name: "Mary Auma",
    role: "Community Manager",
    bio: "Works directly with farmers in Kakuma to gather feedback and improve",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    social: {
      twitter: "#",
      linkedin: "#",
      email: "mary@smartfarm.co.ke",
    },
  },
  {
    name: "Peter Lokiru",
    role: "Field Coordinator",
    bio: "Local Turkana farmer helping bridge the gap between tech and farming",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    social: {
      twitter: "#",
      linkedin: "#",
      email: "peter@smartfarm.co.ke",
    },
  },
];

const Team = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg text-green-700 max-w-2xl mx-auto">
            Dedicated professionals combining agriculture expertise and modern technology
            to empower farmers in Turkana.
          </p>
          <div className="mt-6 w-20 h-1 bg-green-600 mx-auto rounded-full"></div>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-green-100"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="text-sm opacity-90">{member.role}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {member.bio}
                </p>

                <div className="flex space-x-4">
                  <a
                    href={member.social.twitter}
                    className="text-green-600 hover:text-green-800 transition-colors"
                  >
                    <FaTwitter />
                  </a>
                  <a
                    href={member.social.linkedin}
                    className="text-green-600 hover:text-green-800 transition-colors"
                  >
                    <FaLinkedin />
                  </a>
                  <a
                    href={`mailto:${member.social.email}`}
                    className="text-green-600 hover:text-green-800 transition-colors"
                  >
                    <FaEnvelope />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Team;
