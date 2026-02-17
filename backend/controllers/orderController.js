import Order from "../models/order.model.js";

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

    return res.status(201).json({ message: "Order created", order: saved });
  } catch (error) {
    console.error("createOrder error:", error.message);
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
