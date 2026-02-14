import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDb from "./config/db.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import shopRouter from "./routes/shopRoute.js";
import itemRouter from "./routes/itemRoute.js";
dotenv.config();

const app = express();

/* ---------- Middleware ---------- */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// 🔥 Add COOP header to allow Firebase popups
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.use(express.json());
app.use(cookieParser());

/* ---------- Routes ---------- */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/api/auth", authRouter);
app.use("/api/user",userRouter);
app.use("/api/shop",shopRouter);
app.use("/api/item",itemRouter);

/* ---------- Start Server ---------- */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start ❌", error.message);
  }
};

startServer();
