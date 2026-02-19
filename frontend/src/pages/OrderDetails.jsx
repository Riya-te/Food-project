import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../utils/axiosConfig";
import Navbar from "../components/Navbar";
import {
  CheckCircle,
  Clock,
  Truck,
  MapPin,
  Phone,
  ChefHat,
  Package,
  ArrowLeft,
} from "lucide-react";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/order/${orderId}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [orderId]);

  // ✅ Order timeline states
  const getOrderTimeline = (status) => {
    const timeline = [
      {
        step: "Order Placed",
        icon: CheckCircle,
        status: "completed",
      },
      {
        step: "Confirmed",
        icon: CheckCircle,
        status:
          status === "pending" ? "pending" : "completed",
      },
      {
        step: "Preparing",
        icon: ChefHat,
        status:
          status === "pending" || status === "confirmed"
            ? "pending"
            : status === "processing"
            ? "active"
            : "completed",
      },
      {
        step: "Out for Delivery",
        icon: Truck,
        status:
          status === "out_for_delivery"
            ? "active"
            : "pending",
      },
      {
        step: "Delivered",
        icon: Package,
        status:
          status === "delivered"
            ? "completed"
            : "pending",
      },
    ];

    return timeline;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Order Not Found</h2>
            <button
              onClick={() => navigate("/orders")}
              className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-full"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const timeline = getOrderTimeline(order.status || "pending");

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* ================= HEADER ================= */}
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 text-orange-600 font-semibold mb-6 hover:gap-3 transition"
        >
          <ArrowLeft size={20} />
          Back to Orders
        </button>

        {/* ================= ORDER STATUS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-gray-600 mt-2">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-3xl font-extrabold text-orange-600">
                ₹{order.totalAmount}
              </p>
            </div>
          </div>

          {/* ===== ORDER TIMELINE ===== */}
          <div className="space-y-6">
            {timeline.map((item, idx) => {
              const Icon = item.icon;
              const isCompleted = item.status === "completed";
              const isActive = item.status === "active";
              const isPending = item.status === "pending";

              return (
                <div key={idx} className="flex gap-4">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={
                        isActive
                          ? { scale: [1, 1.1, 1], opacity: [1, 0.8, 1] }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        repeat: isActive ? Infinity : 0,
                      }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? "bg-green-100"
                          : isActive
                          ? "bg-orange-100 ring-4 ring-orange-300"
                          : "bg-gray-100"
                      }`}
                    >
                      <Icon
                        size={24}
                        className={
                          isCompleted
                            ? "text-green-600"
                            : isActive
                            ? "text-orange-600"
                            : "text-gray-400"
                        }
                      />
                    </motion.div>

                    {/* Connector line */}
                    {idx < timeline.length - 1 && (
                      <div
                        className={`w-1 h-12 mt-2 ${
                          isCompleted
                            ? "bg-green-300"
                            : isActive
                            ? "bg-orange-300"
                            : "bg-gray-200"
                        }`}
                      ></div>
                    )}
                  </div>

                  {/* Timeline content */}
                  <div className="flex-1 pt-2">
                    <p
                      className={`font-bold text-lg ${
                        isCompleted
                          ? "text-green-600"
                          : isActive
                          ? "text-orange-600"
                          : "text-gray-400"
                      }`}
                    >
                      {item.step}
                    </p>
                    {isActive && (
                      <p className="text-sm text-orange-500 font-semibold">
                        Currently processing...
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ================= LEFT: ORDER ITEMS ================= */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="text-orange-500" size={24} />
                Delivery Address
              </h2>
              <p className="text-gray-700 text-lg">
                {order.deliveryAddress?.text}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Coordinates: {order.deliveryAddress?.latitude},{" "}
                {order.deliveryAddress?.longitude}
              </p>
            </motion.div>

            {/* Items by Shop */}
            <div className="space-y-6">
              {order.shopOrder?.map((shop, shopIdx) => (
                <motion.div
                  key={shopIdx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + shopIdx * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    🏪 Shop #{shopIdx + 1}
                  </h3>

                  {/* Items list */}
                  <div className="space-y-3 mb-4 pb-4 border-b">
                    {shop.shopOrderItems?.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            Item #{itemIdx + 1}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-orange-600">
                            ₹{item.price * item.quantity}
                          </p>
                          <p className="text-sm text-gray-500">
                            @ ₹{item.price} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shop subtotal */}
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex justify-between font-bold text-orange-600">
                      <span>Shop Subtotal</span>
                      <span>₹{shop.subTotal}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ================= RIGHT: PAYMENT SUMMARY ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:sticky lg:top-20 h-fit space-y-6"
          >
            {/* Payment Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Payment Summary
              </h2>

              <div className="space-y-3 pb-4 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-700">Payment Method</span>
                  <span className="font-semibold capitalize">
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Online"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Status</span>
                  <span className="font-semibold capitalize text-green-600">
                    {order.paymentStatus || "Pending"}
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4">
                <div className="flex justify-between font-bold text-lg text-orange-600">
                  <span>Total</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Phone size={20} />
                Need Help?
              </h3>
              <p className="text-sm text-white/90 mb-4">
                Contact us for any issues with your order
              </p>
              <button className="w-full bg-white text-orange-600 font-bold py-2 rounded-xl hover:bg-orange-50 transition">
                Call Support
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
