import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Mail,
  Phone,
  Zap,
  Shield,
  Heart,
  ArrowRight,
} from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="relative mt-24 overflow-hidden">

      {/* ===== TOP WAVE DIVIDER ===== */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          className="relative block w-full h-[80px] md:h-[120px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44C169.09,92.45,0,65.06,0,65.06V0H1200V27.35C1200,27.35,1001.75,77.74,830.89,71.08,659.9,64.39,473.69,26.23,321.39,56.44Z"
            className="fill-gradient-to-r from-orange-600 to-amber-500"
          ></path>
        </svg>
      </div>

      {/* ===== NEWSLETTER SECTION ===== */}
      <div className="relative bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white pt-20 pb-16 px-6">
        
        {/* Decorative elements */}
        <motion.div
          className="absolute top-10 right-10 text-6xl opacity-10"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20 }}
        >
          🎉
        </motion.div>

        <div className="max-w-4xl mx-auto text-center">
          <motion.h3
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Get Exclusive Deals & Offers
          </motion.h3>
          <p className="text-gray-300 mb-8 text-lg">
            Subscribe to our newsletter for special discounts, new restaurants, and food tips!
          </p>
          
          <motion.div
            className="flex flex-col md:flex-row gap-3 justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <motion.button
              onClick={() => navigate("/offers")}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full whitespace-nowrap hover:shadow-lg transition flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Offers <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* ===== MAIN FOOTER ===== */}
      <div className="bg-gradient-to-b from-orange-50 to-white text-gray-900 pt-16 pb-12 px-6 relative">

        {/* FLOATING FOOD ICONS */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
          className="absolute top-16 left-16 text-5xl opacity-10"
        >
          🍕
        </motion.div>

        <motion.div
          animate={{ y: [0, 25, 0] }}
          transition={{ repeat: Infinity, duration: 8 }}
          className="absolute bottom-10 right-20 text-6xl opacity-10"
        >
          🍔
        </motion.div>

        <div className="max-w-7xl mx-auto">
          
          {/* GRID LAYOUT */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">

            {/* LOGO & BRAND */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  SwadWala
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Premium food delivery experience
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed max-w-sm">
                Delivering happiness with every bite. Fast, fresh, and delicious meals from your favorite local restaurants, brought straight to your doorstep.
              </p>
              
              {/* Trust Badges */}
              <div className="flex gap-4 pt-4">
                <motion.div
                  className="flex items-center gap-2 text-sm text-green-600 font-semibold"
                  whileHover={{ scale: 1.05 }}
                >
                  <Shield size={18} className="text-green-600" />
                  100% Safe & Secure
                </motion.div>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h3 className="font-bold mb-6 text-lg text-gray-900">Company</h3>
              <ul className="space-y-3">
                {[
                  { label: "About Us", href: "#" },
                  { label: "Careers", href: "#" },
                  { label: "Blog", href: "#" },
                  { label: "Awards", href: "#" },
                  { label: "Book a Shop", href: "#" },
                ].map((link) => (
                  <motion.li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-700 hover:text-orange-500 transition flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* SUPPORT */}
            <div>
              <h3 className="font-bold mb-6 text-lg text-gray-900">Support</h3>
              <ul className="space-y-3">
                {[
                  { label: "Help Center", href: "#" },
                  { label: "Contact Us", href: "#" },
                  { label: "Privacy Policy", href: "#" },
                  { label: "Terms & Conditions", href: "#" },
                  { label: "Refund Policy", href: "#" },
                ].map((link) => (
                  <motion.li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-700 hover:text-orange-500 transition flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* CONTACT INFO */}
            <div>
              <h3 className="font-bold mb-6 text-lg text-gray-900">Contact</h3>
              <div className="space-y-4">
                <motion.div
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 transition"
                  whileHover={{ x: 4 }}
                >
                  <MapPin size={20} className="text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Address</p>
                    <p className="text-gray-600 text-sm">Jhansi, Uttar Pradesh</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 transition"
                  whileHover={{ x: 4 }}
                >
                  <Mail size={20} className="text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Email</p>
                    <p className="text-gray-600 text-sm">support@swadwala.com</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 transition"
                  whileHover={{ x: 4 }}
                >
                  <Phone size={20} className="text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Phone</p>
                    <p className="text-gray-600 text-sm">+91 9876543210</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="border-t border-gray-200 my-12"></div>

          {/* BOTTOM SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">

            <div>
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} SwadWala. All rights reserved. | Delivering happiness, one meal at a time.
              </p>
            </div>

            {/* SOCIAL MEDIA */}
            <div className="flex gap-4">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "Twitter" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full text-orange-600 hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-500 hover:text-white transition"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>

            {/* DOWNLOAD APP */}
            <div className="flex gap-3">
              <motion.button
                className="px-4 py-2 bg-gray-900 text-white rounded-lg flex items-center gap-2 hover:bg-gray-800 transition"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-xl">🍎</span>
                <div className="text-left text-xs">
                  <p className="text-gray-400">Download on</p>
                  <p className="font-bold">App Store</p>
                </div>
              </motion.button>
              <motion.button
                className="px-4 py-2 bg-gray-900 text-white rounded-lg flex items-center gap-2 hover:bg-gray-800 transition"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-xl">🤖</span>
                <div className="text-left text-xs">
                  <p className="text-gray-400">Get it on</p>
                  <p className="font-bold">Play Store</p>
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
