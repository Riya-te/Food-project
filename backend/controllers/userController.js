import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user); // 🔍 should log { id }

    // ✅ FIX: use id (set by isAuth middleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user,
      profileComplete: !!user.mobile,
    });
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return res.status(500).json({
      message: "Get current user failed",
      error: error.message,
    });
  }
};
