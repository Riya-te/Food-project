import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { Soup, Pencil } from "lucide-react";

import Navbar from "./Navbar";
import CinematicSlideshow from "./CinematicSlideShow";
import OwnerItemCard from "./OwnerItemCard";

const OwnerDashboard = () => {
  const { shop, items = [] } = useSelector((state) => state.owner);
  const navigate = useNavigate();
  const cardRef = useRef(null);

  /* ================= GSAP ENTRANCE ================= */
  useEffect(() => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
      }
    );
  }, [shop]);

  /* ================= EMPTY STATE ================= */
  if (!shop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
        <Navbar />

        <div className="flex items-center justify-center px-4 py-20">
          <div
            ref={cardRef}
            onClick={() => navigate("/create-edit-shop")}
            className="cursor-pointer bg-white/70 backdrop-blur-xl
                       rounded-3xl p-10 max-w-md w-full
                       text-center border border-white/40
                       shadow-[0_20px_60px_rgba(0,0,0,0.15)]
                       hover:shadow-[0_30px_80px_rgba(245,158,11,0.35)]
                       transition"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full
                              bg-gradient-to-br from-orange-400 to-amber-500
                              flex items-center justify-center shadow-lg">
                <Soup size={40} className="text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-800 mb-3">
              Add Your Restaurant
            </h2>

            <p className="text-gray-500 mb-6">
              Start selling delicious food to nearby customers
            </p>

            <button
              className="px-6 py-3 rounded-full
                         bg-gradient-to-r from-orange-500 to-amber-500
                         text-white font-semibold shadow-lg
                         hover:shadow-xl active:scale-95 transition"
            >
              Create Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ================= DASHBOARD ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-14">

        {/* ===== WELCOME HEADER ===== */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-orange-500/10
                          flex items-center justify-center">
            <Soup className="text-orange-500" size={22} />
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800">
            Welcome to{" "}
            <span className="text-orange-500">{shop.name}</span>
          </h1>
        </div>

        {/* ===== SHOP CARD ===== */}
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-3xl
                     backdrop-blur-xl bg-white/60
                     border border-white/40
                     shadow-[0_20px_60px_rgba(0,0,0,0.12)]
                     transition-all duration-500
                     hover:shadow-[0_30px_80px_rgba(245,158,11,0.35)]
                     hover:ring-1 hover:ring-orange-300"
        >
          <div className="relative h-56 sm:h-64">
            <CinematicSlideshow
              images={[
                shop.image,
                "https://images.unsplash.com/photo-1552566626-52f8b828add9",
                "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
              ]}
            />

            <button
              onClick={() => navigate("/create-edit-shop")}
              className="absolute top-4 right-4
                         bg-white/80 backdrop-blur
                         p-2 rounded-full shadow-md
                         hover:bg-white transition"
            >
              <Pencil size={16} />
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-2">
            <h2 className="text-2xl font-extrabold text-gray-900">
              {shop.name}
            </h2>
            <p className="text-gray-600 text-sm">
              {shop.address}, {shop.city}, {shop.state}
            </p>
          </div>
        </div>

        {/* ===== FAVOURITE COLLECTION ===== */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">
            Your Favourite Collection
          </h2>

          {items.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No items added yet.
            </p>
          ) : (
            <div className="relative overflow-hidden">
              <div
                className="flex gap-4 animate-marquee
                           hover:[animation-play-state:paused]"
              >
                {[...items.slice(0, 5), ...items.slice(0, 5)].map((item, i) => (
                  <OwnerItemCard key={i} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ===== COMPLETE MENU ===== */}
        <div className="space-y-4">
         <div className="flex items-center justify-between">
  <h2 className="text-xl font-bold text-gray-800">
    Complete Menu
  </h2>

  <button
    onClick={() => navigate("/add-item")}
    className="px-4 py-2 rounded-full
               bg-gradient-to-r from-orange-500 to-amber-500
               text-white text-sm font-semibold
               shadow-md hover:shadow-lg
               active:scale-95 transition"
  >
    + Add Food Item
  </button>
</div>


          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((item) => (
              <OwnerItemCard
                key={item._id}
                item={item}
                variant="large"
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OwnerDashboard;
