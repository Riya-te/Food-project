import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Search,
  ShoppingCart,
  MapPin,
  Star,
  Filter,
  X,
  Phone,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useGetShopByState from "../hooks/useGetShopByState";
import { addToCart } from "../redux/userSlice";
import { categories } from "../category";

const Menu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useGetShopByState();
  const { nearbyShops } = useSelector((state) => state.shop);
  const { city } = useSelector((state) => state.user);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  /* ================= STABLE RATING ================= */
  const generateRating = (id) => {
    const seed = id?.charCodeAt(0) || 4;
    return (3.8 + (seed % 12) / 10).toFixed(1);
  };

  /* ================= FLATTEN ITEMS ================= */
  const allItems = useMemo(() => {
    if (!nearbyShops) return [];

    return nearbyShops.flatMap((shop) =>
      (shop.items || []).map((item) => ({
        ...item,
        shopId: shop._id,
        shopName: shop.name,
        shopImage: shop.image,
        shopRating: generateRating(shop._id),
      }))
    );
  }, [nearbyShops]);

  /* ================= FILTER ================= */
  const filteredItems = useMemo(() => {
    let filtered = allItems;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.shopName.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "all") {
      // Convert "Snacks" → "snacks", "Main Course" → "main_course"
      const normalizedCategory = selectedCategory
        .toLowerCase()
        .replace(/\s+/g, "_");
      
      filtered = filtered.filter(
        (item) => item.category === normalizedCategory
      );
    }

    return filtered;
  }, [allItems, searchQuery, selectedCategory]);

  /* ================= GROUP BY SHOP ================= */
  const itemsByShop = useMemo(() => {
    const grouped = {};
    filteredItems.forEach((item) => {
      if (!grouped[item.shopId]) {
        grouped[item.shopId] = {
          shopId: item.shopId,
          shopName: item.shopName,
          shopImage: item.shopImage,
          shopRating: item.shopRating,
          items: [],
        };
      }
      grouped[item.shopId].items.push(item);
    });

    return Object.values(grouped);
  }, [filteredItems]);

  /* ================= ADD TO CART ================= */
  const handleAddToCart = (item) => {
    dispatch(
      addToCart({
        id: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        shop: { id: item.shopId, name: item.shopName },
      })
    );
    toast.success(`${item.name} added to cart 🛒`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">

        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <MapPin className="text-orange-500" />
            <h1 className="text-3xl font-extrabold text-gray-900">
              Explore in{" "}
              <span className="text-orange-500">
                {city || "Your Area"}
              </span>
            </h1>
          </div>
          <p className="text-gray-600">
            Discover top-rated dishes crafted with love
          </p>
        </motion.div>

        {/* ================= SEARCH ================= */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search restaurants or dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border-2
                       border-gray-200 focus:border-orange-500
                       focus:outline-none shadow-sm"
          />
        </div>

        {/* ================= CATEGORY FILTER ================= */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${
              selectedCategory === "all"
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                : "bg-white border hover:border-orange-400"
            }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory(cat.category)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${
                selectedCategory === cat.category
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                  : "bg-white border hover:border-orange-400"
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* ================= SHOPS ================= */}
        {itemsByShop.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            No items found. Try different filters.
          </div>
        ) : (
          itemsByShop.map((shop) => (
            <div key={shop.shopId} className="space-y-6">

              {/* ===== SHOP HEADER ===== */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative h-52 rounded-3xl overflow-hidden shadow-xl cursor-pointer"
                onClick={() => navigate(`/shop/${shop.shopId}`)}
              >
                <img
                  src={shop.shopImage}
                  alt={shop.shopName}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end text-white">
                  <h2 className="text-2xl font-extrabold">
                    {shop.shopName}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Star size={16} className="text-yellow-400" />
                    <span>{shop.shopRating}</span>
                    <span className="text-sm opacity-80">
                      • {shop.items.length} items
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* ===== ITEMS ===== */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {shop.items.map((item, i) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -6 }}
                    className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/40 overflow-hidden"
                  >
                    {/* IMAGE */}
                    <div className="relative h-48">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition duration-500 hover:scale-110"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500 capitalize">
                          {item.category}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-extrabold text-orange-600">
                          ₹{item.price}
                        </span>

                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAddToCart(item)}
                          className="p-2 rounded-full bg-gradient-to-r
                                     from-orange-500 to-amber-500
                                     text-white shadow-md"
                        >
                          <ShoppingCart size={18} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= SUPPORT SECTION ================= */}
      <section className="relative py-16 px-6 max-w-6xl mx-auto">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl p-12 text-white text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">Need Help?</h2>
          <p className="text-xl mb-8 text-blue-50">
            Have questions? Our support team is here to assist you 24/7!
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <motion.button
              onClick={() => navigate("/contact")}
              className="px-10 py-4 bg-white text-blue-500 font-bold rounded-xl hover:bg-gray-100 transition flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail size={20} />
              Contact Us
            </motion.button>
            <motion.button
              onClick={() => navigate("/call-support")}
              className="px-10 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone size={20} />
              Call Support
            </motion.button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Menu;
