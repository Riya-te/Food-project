import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CategoryCard from "./CategoryCard";

// example categories
import cat1 from "../assets/categories/1.png";
import cat2 from "../assets/categories/2.png";
import cat3 from "../assets/categories/3.png";
import cat4 from "../assets/categories/4.png";
import cat5 from "../assets/categories/5.png";
import cat6 from "../assets/categories/6.png";

const categories = [
  { name: "Biryani", image: cat1 },
  { name: "Pizza", image: cat2 },
  { name: "Burgers", image: cat3 },
  { name: "North Indian", image: cat4 },
  { name: "Chinese", image: cat5 },
  { name: "Desserts", image: cat6 },
];

const CategorySection = () => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -260 : 260,
      behavior: "smooth",
    });
  };

  return (
    <section className="mt-14">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-extrabold text-gray-900">
          What’s on your mind?
        </h2>

        {/* arrows */}
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* SCROLLER */}
      <motion.div
        ref={scrollRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="
          flex gap-5
          overflow-x-auto
          pb-4
          scroll-smooth
          scrollbar-hide
        "
      >
        {categories.map((cat, i) => (
          <CategoryCard
            key={i}
            category={cat.name}
            image={cat.image}
            onClick={() => console.log(cat.name)}
          />
        ))}
      </motion.div>
    </section>
  );
};

export default CategorySection;
