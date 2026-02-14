import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import admin from "../config/firebaseAdmin.js";
import genToken from "../utils/token.js";
import { sendOtpMail } from "../utils/mailer.js";

/* ================= SIGN UP ================= */
export const signup = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    if (!mobile || mobile.length < 10) {
      return res
        .status(400)
        .json({ message: "Mobile number must be at least 10 digits" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      mobile,
      role,
      password: hashedPassword,
    });

    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // localhost
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...safeUser } = user.toObject();

    res.status(201).json({
      message: "Signup successful",
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= SIGN IN ================= */
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...safeUser } = user.toObject();

    res.status(200).json({
      message: "Login successful",
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= SIGN OUT ================= */
export const signOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= SEND OTP ================= */
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;

    await user.save();
    await sendOtpMail(email, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const user = await User.findOne({ email });

    if (!user || !user.resetOtp) {
      return res.status(400).json({ message: "Invalid request" });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isOtpVerified = true;
    user.resetOtp = null;
    user.otpExpires = null;
    await user.save();

    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...safeUser } = user.toObject();

    res.status(200).json({
      message: "OTP verified & login successful",
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ message: "OTP not verified" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = null;
    user.otpExpires = null;
    user.isOtpVerified = false;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Password reset failed" });
  }
};

/* ================= GOOGLE AUTH ================= */
export const googleAuth = async (req, res) => {
  try {
    const { token, role } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Firebase token missing" });
    }

    let decoded;
    try {
      decoded = await admin.auth().verifyIdToken(token);
    } catch (verifyError) {
      console.error("❌ Token verification failed:", verifyError.message);
      return res.status(401).json({ 
        message: "Invalid or expired Google token. Please try again." 
      });
    }

    const { email, name, picture, uid } = decoded;

    if (!email) {
      return res.status(400).json({ message: "Invalid Google account - email not found" });
    }

    console.log(`🔐 Google Auth - Email: ${email}, Requested Role: ${role}`);

    let user = await User.findOne({ email });

    if (!user) {
      console.log(`✅ Creating new user: ${email} with role: ${role}`);
      try {
        user = await User.create({
          fullName: name,
          email,
          role: role || "user",
          provider: "google",
          firebaseUid: uid,
          avatar: picture,
        });
      } catch (createError) {
        console.error("❌ User creation failed:", createError.message);
        return res.status(500).json({ 
          message: "Failed to create user account" 
        });
      }
    } else if (user.provider !== "google") {
      // User exists with different provider (local/email) - allow migration to Google
      console.log(`📱 Migrating user ${email} from provider "${user.provider}" to "google"`);
      user.provider = "google";
      user.firebaseUid = uid;
      if (picture) user.avatar = picture; // Update avatar if available
      if (!user.fullName && name) user.fullName = name; // Update name if empty
      await user.save();
      console.log(`✅ Migration successful for ${email}`);
    } else if (user.role !== role) {
      // User exists with Google provider but different role selected
      console.warn(`⚠️ Role mismatch for ${email}: stored=${user.role}, requested=${role}, using stored role`);
    } else {
      console.log(`✅ User ${email} found, logging in with role: ${user.role}`);
    }

    const jwtToken = genToken(user._id);

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...safeUser } = user.toObject();

    const profileComplete = !!(user.mobile && user.password);

    console.log(`✅ Google auth successful - User: ${email}, Role: ${user.role}, ProfileComplete: ${profileComplete}`);

    res.status(200).json({
      message: "Google login successful",
      user: safeUser,
      profileComplete,
    });
  } catch (error) {
    console.error("❌ Google auth error:", error.message);
    res.status(500).json({ 
      message: "Google authentication failed. Please try again later." 
    });
  }
};

/* ================= COMPLETE PROFILE ================= */
export const completeProfile = async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const userId = req.user.id;

    if (!mobile || mobile.length < 10) {
      return res.status(400).json({ message: "Valid mobile number required" });
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(userId, {
      mobile,
      password: hashedPassword,
    });

    res.status(200).json({ message: "Profile completed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Profile completion failed" });
  }
};
