import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "./Navbar";
import UserHero from "./UserHero";
import CategoryCard from "../components/CategoryCard";

import useGetShopItems from "../hooks/useGetShopItems";
import useGetShopByState from "../hooks/useGetShopByState";
import { categories } from "../category";

import { addToCart } from "../redux/userSlice";

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
    </div>
  );
};

export default UserDashboard;
