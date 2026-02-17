import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import { sendOrderConfirmation } from "../utils/mailer.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      paymentMethod,
      deliveryAddress = {},
      totalAmount,
      shopOrder = [],
    } = req.body;

    if (!paymentMethod || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = new Order({
      user: userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrder,
    });

    const saved = await order.save();

    // Send confirmation email (best-effort)
    try {
      const user = await User.findById(userId);
      if (user?.email) {
        // send async but don't block response
        sendOrderConfirmation(user.email, saved).catch((e) =>
          console.error("Failed to send order email:", e.message)
        );
      }
    } catch (e) {
      console.error("Order email task error:", e.message);
    }

    return res.status(201).json({ message: "Order created", order: saved });
  } catch (error) {
    console.error("createOrder error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { orderId } = req.params;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const order = await Order.findById(orderId).populate(
      "shopOrder.shop shopOrder.owner shopOrder.shopOrderItems.items"
    );

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== userId) return res.status(403).json({ message: "Forbidden" });

    return res.json({ order });
  } catch (error) {
    console.error("getOrderById error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getOrdersForUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const orders = await Order.find({ user: userId }).populate(
      "shopOrder.shop shopOrder.owner shopOrder.shopOrderItems.items"
    );

    return res.json({ orders });
  } catch (error) {
    console.error("getOrdersForUser error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
