import express from "express";
import { createOrder, getOrdersForUser } from "../controllers/orderController.js";
import isAuth from "../middlewares/isAuth.js";

const orderRouter = express.Router();

orderRouter.post("/", isAuth, createOrder);
orderRouter.get("/my", isAuth, getOrdersForUser);

export default orderRouter;
