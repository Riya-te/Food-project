import jwt from "jsonwebtoken";

const genToken = (userId) => {
  return jwt.sign(
    { id: userId },          // ✅ MUST be "id"
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export default genToken;
