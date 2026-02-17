import express from "express";
import { createOrder, getOrdersForUser, getOrderById } from "../controllers/orderController.js";
import isAuth from "../middlewares/isAuth.js";

const orderRouter = express.Router();

orderRouter.post("/", isAuth, createOrder);
orderRouter.get("/my", isAuth, getOrdersForUser);
orderRouter.get("/:orderId", isAuth, getOrderById);

export default orderRouter;
