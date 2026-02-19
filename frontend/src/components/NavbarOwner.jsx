import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import gsap from "gsap";
import {
  Plus,
  LogOut,
  Store,
  MapPin,
  User,
} from "lucide-react";
import axios from "axios";
import { clearUser } from "../redux/userSlice";
import { clearOwnerState } from "../redux/ownerSlice";
import { serverUrl } from "../App";

const NavbarOwner = () => {
  const navRef = useRef(null);
  const btnsRef = useRef([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userData, city } = useSelector((state) => state.user);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" }
    );

    gsap.from(btnsRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.2,
    });
  }, []);

  const handleLogout = async () => {
    await axios.post(
      `${serverUrl}/api/auth/signout`,
      {},
      { withCredentials: true }
    );
    dispatch(clearUser());
    dispatch(clearOwnerState()); // 🔥 Clear owner state on logout
    navigate("/signin", { replace: true });
  };

  const ownerInitial = userData?.fullName?.charAt(0).toUpperCase();

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50
                 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600
                 shadow-xl"
    >
      <div className="max-w-7xl mx-auto px-6 py-4
                      flex items-center justify-between">

        {/* LEFT: LOGO + LOCATION */}
        <div className="flex items-center gap-6">
          <h1
            onClick={() => navigate("/owner/dashboard")}
            className="text-2xl font-extrabold text-white cursor-pointer"
          >
            SwadWala<span className="text-black">.</span>
          </h1>

          {/* 📍 LOCATION */}
          <div className="hidden md:flex items-center gap-1 text-white">
            <MapPin size={18} />
            <span className="text-sm font-semibold max-w-[160px] truncate">
              {city || "Detecting..."}
            </span>
          </div>
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-4">
          {/* ➕ ADD ITEM */}
          <button
            ref={(el) => (btnsRef.current[0] = el)}
            onClick={() => navigate("/owner/add-item")}
            className="flex items-center gap-2 px-5 py-2
                       rounded-full bg-white text-orange-600
                       font-semibold shadow-lg
                       hover:scale-105 transition"
          >
            <Plus size={18} />
            Add Item
          </button>

          {/* 🏪 MY SHOP */}
          <button
            ref={(el) => (btnsRef.current[1] = el)}
            onClick={() => navigate("/owner/shop")}
            className="flex items-center gap-2 px-4 py-2
                       rounded-full bg-black/20 text-white
                       hover:bg-black/30 transition"
          >
            <Store size={18} />
          </button>

          {/* 👤 PROFILE */}
          <div
            ref={(el) => (btnsRef.current[2] = el)}
            onClick={() => navigate("/owner/profile")}
            className="w-10 h-10 rounded-full
                       bg-black/30 text-white
                       flex items-center justify-center
                       font-bold cursor-pointer
                       hover:bg-black/40 transition"
            title={userData?.fullName}
          >
            {ownerInitial || <User size={18} />}
          </div>

          {/* 🚪 LOGOUT */}
          <button
            ref={(el) => (btnsRef.current[3] = el)}
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2
                       rounded-full text-white
                       hover:bg-black/20 transition"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarOwner;
