import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ================= BACKGROUND GRADIENTS ================= */
const gradients = [
  "from-orange-50 via-amber-100 to-orange-200",
  "from-yellow-50 via-orange-100 to-red-200",
  "from-rose-50 via-pink-100 to-orange-200",
  "from-emerald-50 via-green-100 to-lime-200",
];

const UserHero = ({ items = [] }) => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const visibleItems = items.slice(0, 5);
  const current = visibleItems[index];

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (!visibleItems.length) return;

    const timer = setInterval(() => {
      setIndex((p) => (p + 1) % visibleItems.length);
    }, 5200);

    return () => clearInterval(timer);
  }, [visibleItems.length]);

  const prev = () =>
    setIndex((p) => (p - 1 + visibleItems.length) % visibleItems.length);

  const next = () =>
    setIndex((p) => (p + 1) % visibleItems.length);

  if (!current) return null;

  return (
    <section className="relative min-h-[100svh] overflow-hidden flex items-center">

      {/* ================= BACKGROUND ================= */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className={`absolute inset-0 bg-gradient-to-br ${
            gradients[index % gradients.length]
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-20 items-center pt-20">

        {/* ================= LEFT TEXT ================= */}
        <div className="space-y-8 max-w-xl">
          <AnimatePresence mode="wait">
            <motion.h1
              key={current._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight"
            >
              {current.name}
            </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={current.price}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl italic text-gray-700"
            >
              Crafted fresh, rich in flavour, delivered with care.
            </motion.p>
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/menu")}
            className="
              px-10 py-4 rounded-full
              bg-gradient-to-r from-orange-600 to-red-600
              text-white font-semibold shadow-xl
            "
          >
            Order Now →
          </motion.button>
        </div>

        {/* ================= RIGHT FOOD IMAGE ================= */}
        <div className="relative flex justify-center items-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={current.image}
              src={current.image}
              alt={current.name}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="
                relative z-20
                w-full max-w-[520px]
                object-contain
                drop-shadow-[0_35px_80px_rgba(0,0,0,0.55)]
              "
            />
          </AnimatePresence>
        </div>
      </div>

      {/* ================= NAV BUTTONS ================= */}
      <div className="absolute right-6 bottom-24 flex gap-3 z-30">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prev}
          className="p-3 rounded-full bg-white/80 backdrop-blur shadow-lg"
        >
          <ChevronLeft className="text-orange-600" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={next}
          className="p-3 rounded-full bg-white/80 backdrop-blur shadow-lg"
        >
          <ChevronRight className="text-orange-600" />
        </motion.button>
      </div>

      {/* ================= DOT INDICATORS ================= */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {visibleItems.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-3 rounded-full transition-all ${
              i === index
                ? "bg-orange-600 w-8"
                : "bg-white/60 w-3"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default UserHero;
