import { useState, useRef, useEffect } from "react";
import { Mail, ArrowLeft, Lock } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import gsap from "gsap";

const ForgetPassword = () => {
  const navigate = useNavigate();

  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const sweepRef = useRef(null);
  const otpRefs = useRef([]);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ================== GSAP ================== */
  useEffect(() => {
    gsap.to(glowRef.current, {
      opacity: 0.8,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const hoverIn = () => {
      gsap.to(cardRef.current, {
        y: -6,
        boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
        duration: 0.4,
      });
      gsap.fromTo(
        sweepRef.current,
        { x: "-120%", opacity: 0 },
        { x: "120%", opacity: 1, duration: 1.2 }
      );
    };

    const hoverOut = () => {
      gsap.to(cardRef.current, {
        y: 0,
        boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
        duration: 0.4,
      });
    };

    const card = cardRef.current;
    card.addEventListener("mouseenter", hoverIn);
    card.addEventListener("mouseleave", hoverOut);

    return () => {
      card.removeEventListener("mouseenter", hoverIn);
      card.removeEventListener("mouseleave", hoverOut);
    };
  }, []);

  /* ================== HANDLERS ================== */

  const sendOtp = async () => {
    if (!email) return setError("Email is required");
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      await axios.post(`${serverUrl}/api/auth/send-otp`, { email });
      setSuccess("OTP sent to your email");
      setStep(2);
      setTimeout(() => otpRefs.current[0]?.focus(), 200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 4) return setError("Enter valid OTP");

    setError("");
    setSuccess("");

    try {
      setLoading(true);
      await axios.post(`${serverUrl}/api/auth/verify-otp`, {
        email,
        otp: enteredOtp,
      });
      setSuccess("OTP verified");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (newPassword.length < 6)
      return setError("Password must be at least 6 characters");
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match");

    setError("");
    setSuccess("");

    try {
      setLoading(true);
      await axios.post(`${serverUrl}/api/auth/reset-password`, {
        email,
        otp: otp.join(""),
        newPassword,
      });
      setSuccess("Password reset successful");
      setTimeout(() => navigate("/signin"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const copy = [...otp];
    copy[idx] = val;
    setOtp(copy);
    if (val && idx < 3) otpRefs.current[idx + 1]?.focus();
  };

  /* ================== UI ================== */

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white via-orange-50 to-orange-100">
      <div className="relative w-full max-w-md">
        <div
          ref={glowRef}
          className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-orange-300 via-orange-400 to-orange-300 blur-2xl opacity-60"
        />
        <div
          ref={sweepRef}
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0"
        />

        <div
          ref={cardRef}
          className="relative rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg p-6 sm:p-8"
        >
          <button
            onClick={() => navigate("/signin")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 mb-4"
          >
            <ArrowLeft size={18} /> Back to Sign In
          </button>

          <h2 className="text-2xl font-semibold text-center">Forgot Password</h2>

          {error && <p className="text-red-500 text-center mt-3">{error}</p>}
          {success && (
            <p className="text-green-600 text-center mt-3">{success}</p>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div className="relative mt-6">
                <label className="absolute left-4 top-1 text-sm text-orange-500">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 pt-6 pb-2 rounded-xl border"
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2" />
              </div>

              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full mt-6 py-3 rounded-xl bg-orange-500 text-white font-semibold"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div className="flex justify-center gap-3 mt-6">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    className="w-12 h-12 text-center border rounded-lg text-lg"
                  />
                ))}
              </div>

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full mt-6 py-3 rounded-xl bg-orange-500 text-white font-semibold"
              >
                Verify OTP
              </button>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <div className="relative mt-6">
                <label className="absolute left-4 top-1 text-sm text-orange-500">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 pt-6 pb-2 rounded-xl border"
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2" />
              </div>

              <div className="relative mt-4">
                <label className="absolute left-4 top-1 text-sm text-orange-500">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 pt-6 pb-2 rounded-xl border"
                />
              </div>

              <button
                onClick={resetPassword}
                disabled={loading}
                className="w-full mt-6 py-3 rounded-xl bg-orange-500 text-white font-semibold"
              >
                Reset Password
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
