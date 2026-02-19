import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import gsap from "gsap";
import axiosInstance from "../utils/axiosConfig";
import {
  MapPin,
  Search,
  ShoppingCart,
  Menu,
  X,
  Plus,
} from "lucide-react";

import { serverUrl } from "../App";
import { clearUser } from "../redux/userSlice";
import { clearOwnerState } from "../redux/ownerSlice";

const Navbar = () => {
  const { userData, city } = useSelector((state) => state.user);
  const { shop } = useSelector((state) => state.owner);
const cartItems = useSelector((state) => state.user.cartItems || []);


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navRef = useRef(null);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const addBtnRef = useRef(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isUser = userData?.role === "user";
  const isOwner = userData?.role === "owner";
  const hasShop = Boolean(shop);

  /* ================= GSAP NAVBAR ENTRANCE ================= */
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" }
    );
  }, []);

  /* ================= ADD ITEM PREMIUM HOVER ================= */
  useEffect(() => {
    if (!addBtnRef.current) return;
    const btn = addBtnRef.current;

    const enter = () => {
      gsap.to(btn, {
        scale: 1.06,
        rotateX: 6,
        rotateY: -6,
        boxShadow: "0 20px 40px rgba(16,185,129,0.45)",
        duration: 0.3,
        ease: "power3.out",
      });
    };

    const leave = () => {
      gsap.to(btn, {
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        boxShadow: "0 10px 20px rgba(16,185,129,0.25)",
        duration: 0.3,
        ease: "power3.out",
      });
    };

    btn.addEventListener("mouseenter", enter);
    btn.addEventListener("mouseleave", leave);

    return () => {
      btn.removeEventListener("mouseenter", enter);
      btn.removeEventListener("mouseleave", leave);
    };
  }, [hasShop]);

  /* ================= SEARCH ================= */
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);

    if (!searchOpen) {
      gsap.to(searchRef.current, { width: 220, duration: 0.35 });
      gsap.to(inputRef.current, { opacity: 1, delay: 0.15 });
      inputRef.current.focus();
    } else {
      gsap.to(searchRef.current, { width: 40, duration: 0.25 });
      gsap.to(inputRef.current, { opacity: 0 });
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/signout", {});
      dispatch(clearUser());
      dispatch(clearOwnerState()); // 🔥 Clear owner state on logout
      toast.success("Logged out 👋");
      navigate("/signin", { replace: true });
    } catch {
      toast.error("Logout failed");
    }
  };

  if (!userData) return null;
  const userInitial = userData.fullName?.charAt(0).toUpperCase();

  return (
    <>
      <nav
        ref={navRef}
        className="w-full sticky top-0 z-50
                   bg-white/80 backdrop-blur-xl
                   px-4 md:px-6 py-3
                   flex items-center justify-between
                   shadow-md"
      >
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <h1
            onClick={() => navigate("/")}
            className="text-2xl font-extrabold text-amber-500 cursor-pointer"
          >
            SwadWala
          </h1>

          <div className="hidden sm:flex items-center gap-1 text-gray-700">
            <MapPin size={18} className="text-amber-500" />
            <span className="text-sm font-semibold truncate max-w-[160px]">
              {city || "Detecting..."}
            </span>
          </div>
        </div>

        {/* RIGHT (DESKTOP) */}
        <div className="hidden md:flex items-center gap-3">
          {/* CONTACT (ALL USERS) */}
          <button
            onClick={() => navigate("/contact")}
            className="flex items-center gap-1 px-4 py-2 rounded-full
                       bg-cyan-100 text-cyan-700 hover:bg-cyan-200
                       font-semibold transition text-sm"
          >
            📞 Contact
          </button>

          {/* ABOUT US (ALL USERS) */}
          <button
            onClick={() => navigate("/about-us")}
            className="flex items-center gap-1 px-4 py-2 rounded-full
                       bg-purple-100 text-purple-700 hover:bg-purple-200
                       font-semibold transition text-sm"
          >
            ℹ️ About
          </button>

          {/* MENU (USER ONLY) */}
          {isUser && (
            <button
              onClick={() => navigate("/menu")}
              className="flex items-center gap-1 px-4 py-2 rounded-full
                         bg-amber-100 text-amber-700 hover:bg-amber-200
                         font-semibold transition"
            >
              <Menu size={18} />
              Menu
            </button>
          )}

          {/* ORDERS (USER ONLY) */}
          {isUser && (
            <button
              onClick={() => navigate("/orders")}
              className="flex items-center gap-1 px-4 py-2 rounded-full
                         bg-blue-100 text-blue-700 hover:bg-blue-200
                         font-semibold transition"
            >
              📦
              Orders
            </button>
          )}

          {/* SEARCH (USER ONLY) */}
          {isUser && (
            <div
              ref={searchRef}
              className="flex items-center bg-gray-100
                         h-10 w-10 overflow-hidden rounded-full px-3"
            >
              <input
                ref={inputRef}
                placeholder="Search food..."
                className="bg-transparent outline-none text-sm w-full opacity-0"
              />
              <button onClick={toggleSearch}>
                <Search className="text-amber-500" size={18} />
              </button>
            </div>
          )}

          {/* CART (USER ONLY) */}
          {isUser && (
            <button
              onClick={() => navigate("/cart")}
              className="icon-btn text-emerald-500 relative"
            >
              <ShoppingCart />
              {cartItems.length > 0 && (
                <span className="badge">{cartItems.length}</span>
              )}
            </button>
          )}

          {/* ADD ITEM (OWNER + HAS SHOP) */}
          {isOwner && hasShop && (
            <button
              ref={addBtnRef}
              onClick={() => navigate("/owner/add-item")}
              className="flex items-center gap-2 px-5 py-2
                         bg-gradient-to-r from-green-500 to-emerald-600
                         text-white rounded-full font-semibold
                         shadow-lg transition-transform"
            >
              <Plus size={18} /> Add Item
            </button>
          )}

          {/* AVATAR */}
          <div className="avatar">{userInitial}</div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-semibold"
          >
            Logout
          </button>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-lg px-4 py-4 space-y-3">
          {/* CONTACT */}
          <button
            onClick={() => {
              navigate("/contact");
              setMobileOpen(false);
            }}
            className="mobile-item text-cyan-600"
          >
            📞 Contact Us
          </button>

          {/* ABOUT */}
          <button
            onClick={() => {
              navigate("/about-us");
              setMobileOpen(false);
            }}
            className="mobile-item text-purple-600"
          >
            ℹ️ About Us
          </button>

          {isUser && (
            <button
              onClick={() => {
                navigate("/menu");
                setMobileOpen(false);
              }}
              className="mobile-item text-amber-600"
            >
              📋 Menu
            </button>
          )}

          {isUser && (
            <button
              onClick={() => {
                navigate("/orders");
                setMobileOpen(false);
              }}
              className="mobile-item text-blue-600"
            >
              📦 Orders
            </button>
          )}

          {isUser && (
            <button
              onClick={() => {
                navigate("/cart");
                setMobileOpen(false);
              }}
              className="mobile-item text-green-600"
            >
              🛒 Cart ({cartItems.length})
            </button>
          )}

          {isOwner && hasShop && (
            <button
              onClick={() => {
                navigate("/add-item");
                setMobileOpen(false);
              }}
              className="mobile-item text-green-600"
            >
              <Plus /> Add Item
            </button>
          )}

          <button
            onClick={handleLogout}
            className="mobile-item text-red-500"
          >
            Logout
          </button>
        </div>
      )}

      {/* STYLES */}
      <style jsx>{`
        .icon-btn {
          padding: 0.5rem;
          border-radius: 999px;
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
        }
        .badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #f59e0b;
          color: white;
          width: 18px;
          height: 18px;
          border-radius: 999px;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mobile-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 10px;
          background: #f9fafb;
          font-weight: 500;
        }
      `}</style>
    </>
  );
};

export default Navbar;
