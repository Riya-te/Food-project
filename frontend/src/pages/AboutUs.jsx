import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Target,
  Zap,
  Heart,
  Award,
  Globe,
  Leaf,
  Lightbulb,
} from "lucide-react";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative py-20 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white overflow-hidden">
        <motion.div
          className="absolute top-10 right-10 text-6xl opacity-20"
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        >
          🍽️
        </motion.div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About SwadWala
          </motion.h1>
          <motion.p
            className="text-xl text-red-50 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Connecting hungry customers with their favorite local restaurants
          </motion.p>
        </div>
      </section>

      {/* ================= STORY SECTION ================= */}
      <section className="relative py-20 px-6 max-w-6xl mx-auto">
        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {/* LEFT: TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              SwadWala was born from a simple idea: make delicious food from
              your favorite restaurants accessible to everyone in just minutes.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Founded in 2023, we started with a vision to revolutionize food
              delivery by connecting restaurant owners with hungry customers
              efficiently and reliably.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Today, we've grown to serve 50,000+ customers across partnering
              restaurants, delivering over 500,000 meals while maintaining our
              commitment to quality and speed.
            </p>
          </motion.div>

          {/* RIGHT: STATS */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              { number: "50K+", label: "Happy Customers" },
              { number: "1000+", label: "Partner Restaurants" },
              { number: "500K+", label: "Meals Delivered" },
              { number: "4.8/5", label: "Average Rating" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-8 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-700 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ================= MISSION & VALUES ================= */}
      <section className="relative py-20 px-6 max-w-6xl mx-auto">
        <motion.h2
          className="text-4xl font-bold text-center text-gray-900 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Our Mission & Values
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              title: "Our Mission",
              desc: "Deliver exceptional food experiences by connecting quality local restaurants with customers, one meal at a time.",
              color: "from-red-500 to-pink-500",
            },
            {
              icon: Heart,
              title: "Quality First",
              desc: "Every meal is carefully prepared and delivered fresh. We verify restaurants and maintain highest standards.",
              color: "from-orange-500 to-red-500",
            },
            {
              icon: Zap,
              title: "Speed & Reliability",
              desc: "Average 25-30 minute delivery. Real-time tracking and support team ready to help 24/7.",
              color: "from-yellow-500 to-orange-500",
            },
            {
              icon: Users,
              title: "Community Focus",
              desc: "We support local restaurants and help them reach more customers while employing thousands of delivery partners.",
              color: "from-green-500 to-emerald-500",
            },
            {
              icon: Award,
              title: "Excellence",
              desc: "Constantly innovating to improve service, user experience, and food quality standards.",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: Leaf,
              title: "Sustainability",
              desc: "Committed to eco-friendly packaging and reducing our environmental footprint with every delivery.",
              color: "from-purple-500 to-pink-500",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-orange-400"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className={`bg-gradient-to-br ${item.color} p-4 rounded-xl text-white w-fit mb-4`}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
              >
                <item.icon size={32} />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 text-lg">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= TEAM SECTION ================= */}
      <section className="relative py-20 px-6 max-w-6xl mx-auto">
        <motion.h2
          className="text-4xl font-bold text-center text-gray-900 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Our Leadership Team
        </motion.h2>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { name: "Raj Kumar", role: "Founder & CEO", avatar: "👨‍💼" },
            {
              name: "Priya Singh",
              role: "Co-Founder & COO",
              avatar: "👩‍💼",
            },
            { name: "Amit Patel", role: "CTO", avatar: "🧑‍💻" },
            {
              name: "Sneha Gupta",
              role: "Head of Operations",
              avatar: "👩‍💼",
            },
          ].map((member, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-6xl mb-4">{member.avatar}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {member.name}
              </h3>
              <p className="text-orange-600 font-semibold">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="relative py-20 px-6 max-w-6xl mx-auto">
        <motion.div
          className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-12 text-white text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-xl mb-8 text-red-50">
            Discover thousands of meals from your favorite local restaurants!
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <motion.button
              onClick={() => navigate("/menu")}
              className="px-10 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-100 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Menu
            </motion.button>
            <motion.button
              onClick={() => navigate("/contact")}
              className="px-10 py-4 bg-yellow-400 text-gray-900 font-bold rounded-xl hover:bg-yellow-500 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
            </motion.button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
