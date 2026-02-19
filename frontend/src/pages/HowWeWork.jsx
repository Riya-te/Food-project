import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  MapPin, 
  Menu as MenuIcon, 
  ShoppingCart, 
  CreditCard, 
  CheckCircle, 
  Truck,
  Zap,
  Users,
  Trophy,
  Star
} from "lucide-react";

const steps = [
  {
    icon: MapPin,
    title: "Find Store",
    desc: "Discover top-rated restaurants near you with diverse cuisines and special offers.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: MenuIcon,
    title: "Browse Menu",
    desc: "Explore delicious dishes, filter by categories, check nutritional info and ratings.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: ShoppingCart,
    title: "Add to Cart",
    desc: "Select items, customize your order, and enjoy exclusive discounts on bulk orders.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: CreditCard,
    title: "Checkout",
    desc: "Secure payment gateway with multiple options, transparent pricing and real-time billing.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: CheckCircle,
    title: "Order Confirmed",
    desc: "Get instant confirmation via email, real-time tracking, and restaurant updates.",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: Truck,
    title: "Delivered Fresh",
    desc: "Track your delivery live, get notified at every step, delivered hot and fresh.",
    color: "from-amber-500 to-orange-500",
  },
];

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Average delivery time of 25-30 minutes to your doorstep",
  },
  {
    icon: Users,
    title: "Best Selection",
    desc: "1000+ restaurants with 50,000+ unique dishes to choose from",
  },
  {
    icon: Trophy,
    title: "Quality Assured",
    desc: "Verified restaurants and quality checks at every step",
  },
];

const HowWeWork = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [autoPlay]);

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="relative py-20 bg-gradient-to-br from-cyan-100 via-blue-100 to-teal-100 overflow-hidden">
        
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-20 left-10 text-7xl opacity-30"
          animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 8 }}
        >
          🍕
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10 text-7xl opacity-30"
          animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 9 }}
        >
          🍔
        </motion.div>
        <motion.div
          className="absolute top-1/3 right-1/4 text-6xl opacity-25"
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 7 }}
        >
          🍜
        </motion.div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              How SwadWala Works
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              From discovering your favorite local restaurants to savoring delicious meals at your doorstep - we make food delivery simple, fast, and delightful.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= PROCESS STEPS SECTION ================= */}
      <section className="relative py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            6 Simple Steps to Your Meal
          </motion.h2>

          {/* DESKTOP VIEW - Vertical Timeline */}
          <div className="hidden md:block">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="mb-16 flex gap-8 items-center"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                {/* Left content for even, right content for odd */}
                <div className={`flex-1 ${index % 2 === 1 ? "order-2" : ""}`}>
                  <motion.div
                    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition border-l-4 border-orange-400"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div
                        className={`bg-gradient-to-br ${step.color} p-4 rounded-xl text-white`}
                        whileHover={{ scale: 1.1 }}
                      >
                        <step.icon size={28} />
                      </motion.div>
                      <div>
                        <div className="text-sm font-semibold text-orange-500">Step {index + 1}</div>
                        <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-gray-700 text-lg">{step.desc}</p>
                  </motion.div>
                </div>

                {/* Center Timeline */}
                <div className="flex flex-col items-center justify-between" style={{ height: "150px" }}>
                  <motion.div
                    className={`w-6 h-6 rounded-full border-4 border-gray-300 ${
                      activeStep >= index ? "bg-gradient-to-br from-orange-400 to-red-500 border-orange-500" : ""
                    }`}
                    animate={{ scale: activeStep === index ? [1, 1.3, 1] : 1 }}
                    transition={{ repeat: activeStep === index ? Infinity : 0, duration: 1 }}
                  />
                  {index < steps.length - 1 && (
                    <motion.div
                      className="flex-1 w-1 bg-gradient-to-b from-orange-300 to-gray-300"
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      transition={{ delay: index * 0.2, duration: 0.8 }}
                    />
                  )}
                </div>

                {/* Spacer for layout */}
                <div className={`flex-1 ${index % 2 === 1 ? "" : "order-2"}`} />
              </motion.div>
            ))}
          </div>

          {/* MOBILE VIEW - Carousel */}
          <div className="md:hidden">
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  className="bg-white rounded-3xl p-8 shadow-lg border-l-4 border-orange-400 min-h-96 flex flex-col justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <motion.div
                        className={`bg-gradient-to-br ${steps[activeStep].color} p-4 rounded-xl text-white`}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        {React.createElement(steps[activeStep].icon, { size: 32 })}
                      </motion.div>
                      <div>
                        <div className="text-sm font-semibold text-orange-500">Step {activeStep + 1}</div>
                        <h3 className="text-2xl font-bold text-gray-900">{steps[activeStep].title}</h3>
                      </div>
                    </div>
                    <p className="text-gray-700 text-lg">{steps[activeStep].desc}</p>
                  </div>

                  {/* Controls */}
                  <div className="mt-8 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setAutoPlay(false);
                        setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
                      }}
                      className="px-6 py-2 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600 font-semibold">
                      {activeStep + 1} / {steps.length}
                    </span>
                    <button
                      onClick={() => {
                        setAutoPlay(false);
                        setActiveStep((prev) => (prev + 1) % steps.length);
                      }}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
                    >
                      Next
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Dot Indicators */}
              <div className="flex justify-center gap-3 mt-8">
                {steps.map((_, index) => (
                  <motion.button
                    key={index}
                    className={`w-3 h-3 rounded-full transition ${
                      activeStep === index ? "bg-orange-500 w-8" : "bg-gray-300"
                    }`}
                    onClick={() => {
                      setAutoPlay(false);
                      setActiveStep(index);
                    }}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US SECTION ================= */}
      <section className="relative py-24 bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
        
        <motion.div
          className="absolute top-5 right-10 text-8xl opacity-10"
          animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 7 }}
        >
          🎉
        </motion.div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Why Choose SwadWala?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition border-t-4 border-orange-400"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="bg-gradient-to-br from-orange-400 to-red-500 text-white p-5 rounded-2xl inline-block mb-6"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2, delay: index * 0.3 }}
                >
                  <feature.icon size={32} />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-700 text-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TRUST METRICS SECTION ================= */}
      <section className="relative py-24 bg-gradient-to-r from-slate-900 to-slate-800 text-white overflow-hidden">
        
        <motion.div
          className="absolute bottom-10 left-5 text-7xl opacity-10"
          animate={{ rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
        >
          ⭐
        </motion.div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Trusted by Thousands
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50K+", label: "Happy Customers", icon: Users },
              { number: "1000+", label: "Partner Restaurants", icon: Trophy },
              { number: "500K+", label: "Meals Delivered", icon: Truck },
              { number: "4.8/5", label: "Average Rating", icon: Star },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: index * 0.2 }}
                >
                  {React.createElement(stat.icon, { size: 48, className: "mx-auto mb-4 text-yellow-300" })}
                </motion.div>
                <div className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="relative py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Order?
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Start exploring thousands of delicious meals from your favorite local restaurants today!
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <motion.button
                onClick={() => navigate("/menu")}
                className="px-10 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg font-bold rounded-full hover:shadow-2xl transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse Restaurants
              </motion.button>
              <motion.button
                onClick={() => navigate("/contact")}
                className="px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-lg font-bold rounded-full hover:shadow-2xl transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HowWeWork;
