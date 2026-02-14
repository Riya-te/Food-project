import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import axios from "axios";
import axiosInstance from "../utils/axiosConfig";

import { serverUrl } from "../App";
import { setUser } from "../redux/userSlice";

// 🔥 Firebase
import { signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

/* ================== ANIMATIONS ================== */

const cardVariants = {
  initial: { opacity: 0, y: 50, scale: 0.9 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
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

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [focus, setFocus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [useOtp, setUseOtp] = useState(false);
  const [role, setRole] = useState("user");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================== HANDLE REDIRECT RESULT ================== */

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const idToken = await result.user.getIdToken();
          const storedRole = sessionStorage.getItem("googleSigninRole") || "user";
          sessionStorage.removeItem("googleSigninRole");

          // 🔁 Backend verification with role
          const res = await axiosInstance.post(`/api/auth/firebase-google`, {
            token: idToken,
            role: storedRole,
          });

          console.log("✅ Redirect auth response:", res.data);

          // 🔥 SAVE USER IN REDUX
          dispatch(
            setUser({
              user: res.data.user,
              profileComplete: res.data.profileComplete,
            })
          );

          // ✅ Small delay to ensure Redux updates
          setTimeout(() => {
            if (!res.data.profileComplete) {
              toast.warning("Please complete your profile to continue");
              navigate("/complete-profile", { replace: true });
            } else {
              toast.success("Welcome back 🎉");
              navigate("/", { replace: true });
            }
          }, 300);
        }
      } catch (err) {
        console.error("❌ Redirect result error:", err);
        if (err.code !== "auth/operation-not-supported-in-this-environment") {
          const errorMsg = err.response?.data?.message || "Authentication failed";
          setError(errorMsg);
          toast.error(errorMsg);
        }
      }
    };

    handleRedirectResult();
  }, [dispatch, navigate]);

  /* ================== OTP ================== */

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
  };

  const sendOtp = async () => {
    if (!email) return setError("Email is required");

    try {
      setLoading(true);
      await axiosInstance.post(`/api/auth/send-otp`, { email });
      setOtpSent(true);
      toast.success("OTP sent to your email 📧");
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================== EMAIL / OTP SIGNIN ================== */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      let res;

      if (!useOtp) {
        if (!password) return setError("Password is required");

        res = await axiosInstance.post(
          `/api/auth/signin`,
          { email, password }
        );

        toast.success("Signed in successfully ✅");
      } else {
        const enteredOtp = otp.join("");
        if (enteredOtp.length < 4) return setError("Enter valid OTP");

        res = await axiosInstance.post(
          `/api/auth/verify-otp`,
          { email, otp: enteredOtp }
        );

        toast.success("OTP verified & signed in ✅");
      }

      // 🔥 SAVE USER IN REDUX
      dispatch(
        setUser({
          user: res.data.user,
          profileComplete: res.data.profileComplete,
        })
      );

      // ✅ Check if profile is complete
      if (!res.data.profileComplete) {
        toast.warning("Please complete your profile to continue");
        navigate("/complete-profile");
        return;
      }

      toast.success("Welcome back 🎉");
      navigate("/");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Signin failed";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /* ================== GOOGLE SIGNIN ================== */

  const handleGoogleSignin = async () => {
    setError("");

    try {
      setLoading(true);

      // 🔥 Try Firebase popup first
      let result;
      try {
        result = await signInWithPopup(auth, googleProvider);
      } catch (popupError) {
        // If popup fails (CORS/COOP issue), fall back to redirect
        if (popupError.code === "auth/popup-closed-by-user" || 
            popupError.message?.includes("Cross-Origin")) {
          console.log("Popup blocked, using redirect method...");
          sessionStorage.setItem("googleSigninRole", role);
          await signInWithRedirect(auth, googleProvider);
          return;
        }
        throw popupError;
      }

      const idToken = await result.user.getIdToken();

      // 🔁 Backend verification with role
      const res = await axiosInstance.post(`/api/auth/firebase-google`, {
        token: idToken,
        role: role,
      });

      console.log("✅ Auth response:", res.data);

      // 🔥 SAVE USER IN REDUX
      dispatch(
        setUser({
          user: res.data.user,
          profileComplete: res.data.profileComplete,
        })
      );

      // ✅ Small delay to ensure Redux updates
      setTimeout(() => {
        if (!res.data.profileComplete) {
          toast.warning("Please complete your profile to continue");
          navigate("/complete-profile", { replace: true });
        } else {
          toast.success("Welcome back 🎉");
          navigate("/", { replace: true });
        }
      }, 300);
    } catch (err) {
      console.error("Google sign-in error:", err);

      // 🔍 Detailed error messages
      if (err.response?.data?.message) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else if (err.code === "auth/popup-closed-by-user") {
        toast.error("Sign-in was cancelled");
      } else if (err.message?.includes("network")) {
        toast.error("Network error - check your connection");
      } else {
        toast.error("Google sign-in failed ❌");
        setError("Google sign-in failed. Please try again.");
      }
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

        <h2 className="text-2xl font-semibold text-center">Welcome Back</h2>

        {error && (
          <p className="text-sm text-red-500 text-center mt-3">{error}</p>
        )}

        {/* Toggle */}
        <div className="flex justify-center my-5">
          <button
            onClick={() => setUseOtp(false)}
            className={`px-4 py-2 rounded-l-lg border ${
              !useOtp ? "bg-amber-500 text-white" : ""
            }`}
          >
            Password
          </button>
          <button
            onClick={() => setUseOtp(true)}
            className={`px-4 py-2 rounded-r-lg border ${
              useOtp ? "bg-amber-500 text-white" : ""
            }`}
          >
            OTP
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocus("email")}
              onBlur={() => setFocus(null)}
              className="w-full px-4 pt-6 pb-2 border rounded-xl"
            />
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2" />
          </motion.div>

          {/* Password */}
          {!useOtp && (
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
                className="w-full px-4 pt-6 pb-2 pr-12 border rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </motion.div>
          )}

          {/* OTP */}
          {useOtp && (
            <>
              {!otpSent ? (
                <button
                  type="button"
                  onClick={sendOtp}
                  className="w-full py-2 rounded-xl bg-amber-500 text-white"
                >
                  Send OTP
                </button>
              ) : (
                <div className="flex justify-center gap-3">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      maxLength={1}
                      value={d}
                      onChange={(e) =>
                        handleOtpChange(e.target.value, i)
                      }
                      className="w-12 h-12 text-center border rounded-lg"
                    />
                  ))}
                </div>
              )}
            </>
          )}

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl bg-amber-500 text-white font-semibold"
          >
            {useOtp ? "Verify & Sign In" : "Sign In"}
          </button>

          {/* Role Selection */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`py-2 rounded-xl border-2 font-semibold text-sm transition ${
                role === "user"
                  ? "bg-amber-500 text-white border-amber-500"
                  : "border-gray-300 text-gray-600 hover:border-amber-500"
              }`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => setRole("owner")}
              className={`py-2 rounded-xl border-2 font-semibold text-sm transition ${
                role === "owner"
                  ? "bg-amber-500 text-white border-amber-500"
                  : "border-gray-300 text-gray-600 hover:border-amber-500"
              }`}
            >
              Owner
            </button>
            <button
              type="button"
              onClick={() => setRole("deliveryBoy")}
              className={`py-2 rounded-xl border-2 font-semibold text-sm transition ${
                role === "deliveryBoy"
                  ? "bg-amber-500 text-white border-amber-500"
                  : "border-gray-300 text-gray-600 hover:border-amber-500"
              }`}
            >
              Delivery
            </button>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border hover:bg-gray-50 transition"
          >
            <FcGoogle size={22} />
            Sign in with Google
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-amber-500 hover:underline"
          >
            Sign Up
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Signin;
