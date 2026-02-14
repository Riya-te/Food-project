// src/components/CategoryCard.jsx
import React from "react";
import { motion } from "framer-motion";

const CategoryCard = ({ category, image, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{
        scale: 1.06,
        rotateX: 6,
        rotateY: -6,
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="
        min-w-[160px] sm:min-w-[180px]
        bg-white rounded-2xl
        overflow-hidden cursor-pointer
        shadow-md
        hover:shadow-xl
        transform-gpu
      "
      style={{ perspective: 1000 }}
    >
      {/* IMAGE */}
      <div className="relative w-full h-36 overflow-hidden">
        <img
          src={image}
          alt={category}
          className="
            w-full h-full object-cover
            transition-transform duration-500
            hover:scale-110
          "
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* TEXT */}
      <div className="p-4 text-center">
        <h3 className="text-sm font-semibold tracking-wide text-gray-800">
          {category}
        </h3>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
