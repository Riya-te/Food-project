import express from "express";
import {
  createItem,
  editItem,
  deleteItem,
  getItemsByShop,
} from "../controllers/itemController.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const itemRouter = express.Router();

// Create item
itemRouter.post(
  "/create",
  isAuth,
  upload.single("image"),
  createItem
);

// Edit item
itemRouter.post(
  "/edit/:itemId",
  isAuth,
  upload.single("image"),
  editItem
);

// Delete item
itemRouter.delete(
  "/delete/:itemId",
  isAuth,
  deleteItem
);

// Get items of a shop (public)
itemRouter.get(
  "/shop/:shopId",
  getItemsByShop
);

export default itemRouter;
