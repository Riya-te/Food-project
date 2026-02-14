import express from "express";
import {
  createShop,
  editShop,
  getMyShop,
  getNearbyShops,
  getShopsByCity,
  getShopsByState,
} from "../controllers/shopController.js";

import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const shopRouter = express.Router();

/* ================= CREATE SHOP ================= */
shopRouter.post(
  "/",
  isAuth,
  upload.single("image"),
  createShop
);

/* ================= GET MY SHOP (OWNER) ================= */
shopRouter.get(
  "/my",
  isAuth,
  getMyShop
);

/* ================= GET SHOPS BY CITY (PUBLIC) ================= */
shopRouter.get(
  "/city",
  getShopsByCity
);

/* ================= GET SHOPS BY STATE (PUBLIC) ================= */
shopRouter.get(
  "/state",
  getShopsByState
);

/* ================= GET NEARBY SHOPS (PUBLIC) ================= */
shopRouter.get(
  "/nearby",
  getNearbyShops
);

/* ================= EDIT SHOP ================= */
shopRouter.put(
  "/:shopId",
  isAuth,
  upload.single("image"),
  editShop
);

export default shopRouter;
