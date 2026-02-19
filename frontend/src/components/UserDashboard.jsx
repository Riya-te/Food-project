import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Navbar from "./Navbar";
import UserHero from "./UserHero";
import CategoryCard from "../components/CategoryCard";

import useGetShopItems from "../hooks/useGetShopItems";
import useGetShopByState from "../hooks/useGetShopByState";
import { categories } from "../category";

import { addToCart } from "../redux/userSlice";
import Footer from "./Footer";

/* ================= PREMIUM RATING HELPERS ================= */

// Stable premium rating (3.6 – 4.9)
const getItemRating = (item) => {
  if (item.rating) return Number(item.rating.toFixed(1));

  let hash = 0;
  for (let i = 0; i < item._id.length; i++) {
    hash = item._id.charCodeAt(i) + ((hash << 5) - hash);
  }

  const rating = 3.6 + (Math.abs(hash) % 14) * 0.1;
  return Number(rating.toFixed(1));
};

// Stable review count (80 – 900)
const getReviewCount = (item) => {
  let hash = 0;
  for (let i = 0; i < item._id.length; i++) {
    hash = item._id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return 80 + (Math.abs(hash) % 820);
};

/* ================= 5-CARD POSITIONS ================= */

const cardPositions = {
  farLeft: { x: -420, scale: 0.72, opacity: 0.35, zIndex: 5 },
  left: { x: -220, scale: 0.88, opacity: 0.7, zIndex: 10 },
  center: { x: 0, scale: 1, opacity: 1, zIndex: 30 },
  right: { x: 220, scale: 0.88, opacity: 0.7, zIndex: 10 },
  farRight: { x: 420, scale: 0.72, opacity: 0.35, zIndex: 5 },
  hidden: { opacity: 0, scale: 0.6, zIndex: 0 },
};

const SWIPE_THRESHOLD = 90;

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const autoplayRef = useRef(null);

  /* ================= DATA ================= */

  const { items: heroItems } = useGetShopItems();
  useGetShopByState();

  const { nearbyShops } = useSelector((state) => state.shop);

  const items =
    nearbyShops?.flatMap((shop) =>
      shop.items?.map((item) => ({ ...item, shop }))
    ) || [];

  /* ================= STATE ================= */

  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  /* ================= AUTO PLAY ================= */

  useEffect(() => {
    if (items.length <= 1 || paused) return;

    autoplayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 4200);

    return () => clearInterval(autoplayRef.current);
  }, [items.length, paused]);

  /* ================= SWIPE ================= */

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -SWIPE_THRESHOLD) {
      setActiveIndex((prev) => (prev + 1) % items.length);
    } else if (info.offset.x > SWIPE_THRESHOLD) {
      setActiveIndex(
        (prev) => (prev - 1 + items.length) % items.length
      );
    }
  };

  /* ================= ADD TO CART (ONCLICK HANDLER) ================= */

  const handleAddToCartClick = (e, item) => {
    e.stopPropagation(); // ⛔ prevent card click

    dispatch(
      addToCart({
        id: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        shop: {
          id: item.shop._id,
          name: item.shop.name,
        },
      })
    );

    // Optional future hooks:
    // toast.success(`${item.name} added to cart`);
    // openCartDrawer();
    // analytics.track("add_to_cart", item._id);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Navbar />

      {/* ================= HERO ================= */}
      <UserHero items={heroItems || []} />

      {/* ================= CATEGORIES ================= */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-extrabold mb-6">
          Explore Categories
        </h2>

        <div className="flex gap-5 overflow-x-auto scrollbar-hide">
          {categories.map((cat, i) => (
            <CategoryCard
              key={i}
              category={cat.category}
              image={cat.image}
            />
          ))}
        </div>

        {/* VIEW ALL MENU BUTTON */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/menu")}
            className="px-8 py-3 rounded-full
                       bg-gradient-to-r from-orange-500 to-amber-500
                       text-white font-bold shadow-lg
                       hover:shadow-xl active:scale-95 transition"
          >
            View Complete Menu →
          </button>
        </div>
      </div>

      {/* ================= CUSTOMER FAVOURITES ================= */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-center text-4xl font-extrabold mb-16">
          Customer Favourites
        </h2>

        <motion.div
          className="relative h-[440px] flex items-center justify-center"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {items.map((item, index) => {
            const total = items.length;
            const offset = (index - activeIndex + total) % total;

            let style = cardPositions.hidden;
            if (offset === 0) style = cardPositions.center;
            else if (offset === 1) style = cardPositions.right;
            else if (offset === 2) style = cardPositions.farRight;
            else if (offset === total - 1)
              style = cardPositions.left;
            else if (offset === total - 2)
              style = cardPositions.farLeft;

            const rating = getItemRating(item);
            const reviews = getReviewCount(item);
            const isTopRated = rating >= 4.6;

            return (
              <motion.div
                key={item._id}
                animate={style}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={() => setActiveIndex(index)}
                className="
                  absolute w-[260px] h-[380px]
                  bg-white rounded-3xl
                  shadow-[0_25px_60px_rgba(0,0,0,0.15)]
                  cursor-pointer overflow-hidden
                "
              >
                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />

                  {isTopRated && (
                    <span className="
                      absolute top-3 left-3
                      bg-gradient-to-r from-yellow-400 to-orange-500
                      text-white text-xs font-bold
                      px-3 py-1 rounded-full shadow-lg
                    ">
                      ⭐ Top Rated
                    </span>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-5 space-y-2">
                  <p className="text-xs text-gray-500">
                    {item.shop.name}
                  </p>

                  <h3 className="text-lg font-bold truncate">
                    {item.name}
                  </h3>

                  {/* ⭐ PREMIUM RATING */}
                  <div className="flex items-center gap-1">
                    <div className="flex text-yellow-400">
                      {"★".repeat(Math.floor(rating))}
                      {rating % 1 !== 0 && "☆"}
                    </div>
                    <span className="text-sm font-semibold">
                      {rating}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({reviews})
                    </span>
                  </div>

                  {/* PRICE + CART */}
                  <div className="flex justify-between items-center pt-3">
                    <span className="text-lg font-bold">
                      ₹{item.price}
                    </span>

                    <button
                      onClick={(e) =>
                        handleAddToCartClick(e, item)
                      }
                      className="
                        px-4 py-2 rounded-xl
                        bg-green-500 hover:bg-green-600
                        text-white font-semibold
                        active:scale-95 transition
                      "
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* ================= HOW WE WORK PREVIEW SECTION ================= */}
      <section className="relative py-20 bg-gradient-to-br from-cyan-100 via-blue-100 to-teal-100 overflow-hidden">
        
        {/* Decorative elements */}
        <motion.div
          className="absolute top-10 left-5 text-6xl opacity-20"
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        >
          🍕
        </motion.div>
        <motion.div
          className="absolute bottom-10 right-5 text-6xl opacity-20"
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 7 }}
        >
          🍔
        </motion.div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              How SwadWala Works
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
              From discovering your favorite local restaurants to savoring delicious meals at your doorstep - we make food delivery simple, fast, and delightful.
            </p>
          </motion.div>

          {/* 6 STEPS PREVIEW */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: "🔍", title: "Find Store", desc: "Discover restaurants near you" },
              { icon: "📋", title: "Browse Menu", desc: "Explore delicious dishes" },
              { icon: "🛒", title: "Add to Cart", desc: "Select & customize orders" },
              { icon: "💳", title: "Checkout", desc: "Secure payment options" },
              { icon: "✅", title: "Confirmed", desc: "Get instant confirmation" },
              { icon: "🚚", title: "Delivered", desc: "Hot & fresh at your door" },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border-2 border-white/40 hover:border-orange-400/50 transition"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl mb-3">{step.icon}</div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-700 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA BUTTON */}
          <div className="text-center">
            <motion.button
              onClick={() => navigate("/howwework")}
              className="px-10 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg font-bold rounded-full hover:shadow-2xl transition inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More →
            </motion.button>
          </div>
        </div>
      </section>

      {/* ================= EXCLUSIVE DEALS SECTION ================= */}
      <section className="relative py-20 px-6 bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 overflow-hidden">
        <motion.div
          className="absolute top-10 right-10 text-7xl opacity-20"
          animate={{ rotate: [0, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          🎉
        </motion.div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get Exclusive Deals & Offers
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Discover amazing discounts and special offers on your favorite meals!
              Use coupon codes to save more on every order.
            </p>

            <motion.button
              onClick={() => navigate("/offers")}
              className="px-12 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg rounded-full hover:shadow-2xl transition inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Offers 🎁
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UserDashboard;
