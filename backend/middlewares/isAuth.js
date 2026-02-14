import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ FIX: must be _id (mongoose standard)
    req.user = { id: decoded.id };

    next();
  } catch (error) {
    console.error("isAuth error:", error.message);
    return res.status(401).json({ message: "Authentication failed" });
  }
};

export default isAuth;
