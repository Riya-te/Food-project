import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { Copy, Check } from "lucide-react";

const Offers = () => {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(null);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const offers = [
    {
      id: 1,
      title: "Welcome Offer",
      code: "WELCOME50",
      discount: "50% OFF",
      desc: "on your first order above ₹199",
      color: "from-orange-500 to-red-500",
      emoji: "🎉",
      valid: "Valid for new users only",
    },
    {
      id: 2,
      title: "Birthday Special",
      code: "BDAY60",
      discount: "60% OFF",
      desc: "during your birthday date",
      color: "from-pink-500 to-rose-500",
      emoji: "🎂",
      valid: "Valid only on your registered birthday",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white text-center">
        <motion.h1
          className="text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Special Offers 🎁
        </motion.h1>

        <motion.p
          className="text-lg max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Enjoy exclusive discounts crafted just for you!
        </motion.p>
      </section>

      {/* ================= OFFERS ================= */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.03 }}
              viewport={{ once: true }}
            >
              {/* HEADER */}
              <div
                className={`bg-gradient-to-r ${offer.color} p-10 text-white text-center`}
              >
                <div className="text-6xl mb-4">{offer.emoji}</div>
                <h3 className="text-3xl font-bold mb-2">
                  {offer.title}
                </h3>
                <div className="text-5xl font-extrabold">
                  {offer.discount}
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-8 space-y-6 text-center">
                <p className="text-gray-700 text-lg font-medium">
                  {offer.desc}
                </p>

                {/* CODE */}
                <div
                  onClick={() => copyCode(offer.code)}
                  className="bg-gray-100 rounded-xl py-4 px-6 flex items-center justify-between cursor-pointer hover:bg-gray-200 transition"
                >
                  <code className="text-xl font-bold">
                    {offer.code}
                  </code>

                  {copiedCode === offer.code ? (
                    <Check size={24} className="text-green-500" />
                  ) : (
                    <Copy size={24} className="text-orange-500" />
                  )}
                </div>

                <p className="text-sm text-gray-500 italic">
                  {offer.valid}
                </p>

                <motion.button
                  onClick={() => navigate("/menu")}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Apply & Order →
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Offers;
