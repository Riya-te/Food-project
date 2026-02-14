import express from "express";
import {
  signup,
  signIn,
  signOut,
  sendOtp,
  verifyOtp,
  resetPassword,
  googleAuth,
} from "../controllers/authController.js";

import isAuth from "../middlewares/isAuth.js"; // ✅ REQUIRED

const authRouter = express.Router();

/* ================= AUTH ================= */
authRouter.post("/signup", signup);
authRouter.post("/signin", signIn);
authRouter.post("/signout", signOut);

/* ================= PERSIST LOGIN ================= */
authRouter.get("/me", isAuth, (req, res) => {
  res.status(200).json({
    user: req.user,
    profileComplete: true,
  });
});

/* ================= GOOGLE AUTH ================= */
authRouter.post("/firebase-google", googleAuth);

/* ================= OTP / FORGOT PASSWORD ================= */
authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
