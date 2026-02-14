import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, User, Store, Bike } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import axiosInstance from "../utils/axiosConfig";

import { serverUrl } from "../App";
import { setUser } from "../redux/userSlice";

// 🔥 Firebase
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

/* ================== ANIMATIONS ================== */

const cardVariants = {
  initial: { opacity: 0, y: 50, scale: 0.9 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 18 },
  },
};

const shineVariants = {
  animate: {
    x: ["-100%", "100%"],
    transition: { repeat: Infinity, duration: 6, ease: "linear" },
  },
};

const inputVariants = {
  focus: { scale: 1.03 },
  blur: { scale: 1 },
};

/* ================== COMPONENT ================== */

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [focus, setFocus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  /* ================== EMAIL SIGNUP ================== */

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !mobile || !password)
      return setError("All fields are required");

    if (password.length < 6)
      return setError("Password must be at least 6 characters");

    if (mobile.length < 10)
      return setError("Mobile number must be at least 10 digits");

    try {
      setLoading(true);

      await axiosInstance.post(
        `/api/auth/signup`,
        { fullName, email, mobile, password, role }
      );

      toast.success("Account created successfully 🎉");
      navigate("/signin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================== GOOGLE SIGNUP ================== */

  const handleGoogleSignup = async () => {
    setError("");

    try {
      setLoading(true);

      // 🔐 Firebase popup
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      // 🔁 Backend verification
      const res = await axiosInstance.post(
        `/api/auth/firebase-google`,
        { token: idToken, role }
      );

      toast.success("Google account verified ✅");

      // 🔥 SAVE USER IN REDUX
      dispatch(
        setUser({
          user: res.data.user,
          profileComplete: res.data.profileComplete,
        })
      );

      // 🚨 Profile incomplete
      if (!res.data.profileComplete) {
        toast.warning("Please complete your profile to continue");
        navigate("/complete-profile");
        return;
      }

      toast.success("Welcome to SwadWala 🎉");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Google signup failed ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================== UI ================== */

  return (
    <div className="bg-gradient-to-br from-white via-white to-amber-50 flex items-center justify-center px-4 py-10">
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        className="relative w-full max-w-md rounded-2xl bg-white border border-gray-200 shadow-xl p-6 sm:p-8 overflow-hidden"
      >
        <motion.div
          variants={shineVariants}
          animate="animate"
          className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/30 to-transparent pointer-events-none"
        />

        <h2 className="text-2xl sm:text-3xl font-semibold text-center">
          Create Account
        </h2>

        {error && (
          <p className="text-sm text-red-500 text-center mt-3">{error}</p>
        )}

        <form onSubmit={handleSignUp} className="space-y-5 mt-6">
          {/* Full Name */}
          <motion.div
            variants={inputVariants}
            animate={focus === "name" ? "focus" : "blur"}
            className="relative"
          >
            <label className="absolute left-4 top-1 text-sm text-amber-500">
              Full Name
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onFocus={() => setFocus("name")}
              onBlur={() => setFocus(null)}
              className="w-full px-4 pt-6 pb-2 rounded-xl border"
            />
          </motion.div>

          {/* Email */}
          <motion.div
            variants={inputVariants}
            animate={focus === "email" ? "focus" : "blur"}
            className="relative"
          >
            <label className="absolute left-4 top-1 text-sm text-amber-500">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocus("email")}
              onBlur={() => setFocus(null)}
              className="w-full px-4 pt-6 pb-2 rounded-xl border"
            />
          </motion.div>

          {/* Mobile */}
          <motion.div
            variants={inputVariants}
            animate={focus === "mobile" ? "focus" : "blur"}
            className="relative"
          >
            <label className="absolute left-4 top-1 text-sm text-amber-500">
              Mobile Number
            </label>
            <input
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              onFocus={() => setFocus("mobile")}
              onBlur={() => setFocus(null)}
              className="w-full px-4 pt-6 pb-2 rounded-xl border"
            />
          </motion.div>

          {/* Password */}
          <motion.div
            variants={inputVariants}
            animate={focus === "password" ? "focus" : "blur"}
            className="relative"
          >
            <label className="absolute left-4 top-1 text-sm text-amber-500">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocus("password")}
              onBlur={() => setFocus(null)}
              className="w-full px-4 pt-6 pb-2 pr-12 rounded-xl border"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </motion.div>

          {/* Role */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "user", icon: User, label: "User" },
              { id: "owner", icon: Store, label: "Owner" },
              { id: "deliveryBoy", icon: Bike, label: "Delivery" },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setRole(id)}
                className={`py-3 rounded-xl border flex flex-col items-center ${
                  role === id
                    ? "bg-amber-500 text-white"
                    : "hover:border-amber-400"
                }`}
              >
                <Icon size={20} />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl bg-amber-500 text-white font-semibold"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border"
          >
            <FcGoogle size={22} />
            Sign up with Google
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/signin")}
            className="text-amber-500 hover:underline"
          >
            Sign In
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
