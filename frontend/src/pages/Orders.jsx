import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../utils/axiosConfig";
import Navbar from "../components/Navbar";
import {
  CheckCircle,
  Clock,
  Truck,
  MapPin,
  Phone,
  ChevronDown,
  Package,
} from "lucide-react";

const Orders = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const confirmationMessage = location.state?.message;
  const showConfirmation = location.state?.showConfirmation;

  // ✅ Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/order/my");
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ✅ Get status color and icon
  const getStatusDisplay = (status) => {
    const statusMap = {
      pending: {
        colorClass: "yellow",
        bgClass: "bg-yellow-100",
        textClass: "text-yellow-700",
        iconClass: "text-yellow-500",
        icon: Clock,
        label: "Pending",
        description: "Your order is being prepared",
      },
      confirmed: {
        colorClass: "blue",
        bgClass: "bg-blue-100",
        textClass: "text-blue-700",
        iconClass: "text-blue-500",
        icon: CheckCircle,
        label: "Confirmed",
        description: "Your order has been confirmed",
      },
      processing: {
        colorClass: "blue",
        bgClass: "bg-blue-100",
        textClass: "text-blue-700",
        iconClass: "text-blue-500",
        icon: Package,
        label: "Processing",
        description: "Your order is being prepared",
      },
      out_for_delivery: {
        colorClass: "orange",
        bgClass: "bg-orange-100",
        textClass: "text-orange-700",
        iconClass: "text-orange-500",
        icon: Truck,
        label: "Out for Delivery",
        description: "Driver is on the way",
      },
      delivered: {
        colorClass: "green",
        bgClass: "bg-green-100",
        textClass: "text-green-700",
        iconClass: "text-green-500",
        icon: CheckCircle,
        label: "Delivered",
        description: "Order delivered successfully",
      },
      cancelled: {
        colorClass: "red",
        bgClass: "bg-red-100",
        textClass: "text-red-700",
        iconClass: "text-red-500",
        icon: Clock,
        label: "Cancelled",
        description: "Order has been cancelled",
      },
    };

    return statusMap[status] || statusMap["pending"];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* ================= CONFIRMATION MESSAGE ================= */}
        <AnimatePresence>
          {showConfirmation && confirmationMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-6 text-white shadow-xl border-2 border-green-300">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle size={48} className="text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-extrabold">
                      🎉 Order Confirmed!
                    </h2>
                    <p className="text-white/90 mt-1">{confirmationMessage}</p>
                    <p className="text-sm text-white/80 mt-2">
                      A confirmation email has been sent to your registered email address.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= HEADER ================= */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track your food orders in real-time</p>
        </div>

        {/* ================= EMPTY STATE ================= */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-12 text-center shadow-md border-2 border-gray-100"
          >
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start ordering delicious food from our restaurants!
            </p>
            <button
              onClick={() => navigate("/menu")}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500
                         text-white font-bold rounded-full hover:shadow-lg transition"
            >
              Browse Menu
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, idx) => {
              const statusDisplay = getStatusDisplay(order.status || "pending");
              const StatusIcon = statusDisplay.icon;
              const isExpanded = expandedOrder === order._id;

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl shadow-md border-2 border-gray-100 overflow-hidden hover:border-orange-200 transition"
                >
                  {/* ===== ORDER HEADER ===== */}
                  <button
                    onClick={() =>
                      setExpandedOrder(
                        isExpanded ? null : order._id
                      )
                    }
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4 text-left flex-1">
                      {/* Status Icon */}
                      <div className={`p-3 rounded-full ${statusDisplay.bgClass}`}>
                        <StatusIcon
                          size={24}
                          className={statusDisplay.iconClass}
                        />
                      </div>

                      {/* Order Info */}
                      <div>
                        <p className="text-sm text-gray-600">Order ID</p>
                        <h3 className="font-bold text-gray-900 text-lg">
                          #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>

                      {/* Spacer */}
                      <div className="flex-1"></div>

                      {/* Status Badge */}
                      <div className="text-right">
                        <span
                          className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${statusDisplay.bgClass} ${statusDisplay.textClass}`}
                        >
                          {statusDisplay.label}
                        </span>
                        <p className="text-2xl font-extrabold text-orange-600 mt-2">
                          ₹{order.totalAmount}
                        </p>
                      </div>
                    </div>

                    {/* Expand Icon */}
                    <ChevronDown
                      size={24}
                      className={`text-gray-600 transition ${
                        isExpanded ? "rotate-180" : ""
                      } ml-4`}
                    />
                  </button>

                  {/* ===== ORDER DETAILS (EXPANDABLE) ===== */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 bg-gray-50"
                      >
                        <div className="p-6 space-y-6">
                          {/* Delivery Address */}
                          <div>
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <MapPin size={18} className="text-orange-500" />
                              Delivery Address
                            </h4>
                            <p className="text-gray-700 bg-white rounded-lg p-3">
                              {order.deliveryAddress?.text ||
                                "Address not provided"}
                            </p>
                          </div>

                          {/* Order Items */}
                          <div>
                            <h4 className="font-bold text-gray-900 mb-3">
                              Items ({order.shopOrder?.length || 0} from{" "}
                              {order.shopOrder?.length || 0} shops)
                            </h4>
                            <div className="space-y-4">
                              {order.shopOrder?.map((shop, shopIdx) => (
                                <div
                                  key={shopIdx}
                                  className="bg-white rounded-lg p-4 border border-gray-200"
                                >
                                  <p className="font-semibold text-gray-900 mb-4">
                                    🏪 Restaurant
                                  </p>
                                  <div className="space-y-3">
                                    {shop.shopOrderItems?.map(
                                      (item, itemIdx) => (
                                        <motion.div
                                          key={itemIdx}
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: itemIdx * 0.05 }}
                                          className="flex gap-3 border-b pb-3 last:border-b-0 last:pb-0"
                                        >
                                          {/* Item Image */}
                                          {item.items?.image && (
                                            <div className="shrink-0">
                                              <img
                                                src={item.items.image}
                                                alt={item.items?.name}
                                                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                              />
                                            </div>
                                          )}
                                          
                                          {/* Item Details */}
                                          <div className="flex-1 min-w-0">
                                            <h5 className="font-semibold text-gray-900 text-sm truncate">
                                              {item.items?.name || "Item"}
                                            </h5>
                                            <p className="text-xs text-gray-500 mt-1">
                                              Category: {item.items?.category || "Unknown"}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1">
                                              Quantity: {item.quantity}x
                                            </p>
                                          </div>

                                          {/* Price Info */}
                                          <div className="text-right shrink-0">
                                            <p className="text-sm text-gray-600">
                                              ₹{item.price.toFixed(2)}/item
                                            </p>
                                            <p className="font-bold text-orange-600 text-base">
                                              ₹{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                          </div>
                                        </motion.div>
                                      )
                                    )}
                                  </div>
                                  <div className="border-t mt-3 pt-3 font-bold text-orange-600 flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{shop.subTotal.toFixed(2)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Payment Info */}
                          <div>
                            <h4 className="font-bold text-gray-900 mb-3">
                              Payment Details
                            </h4>
                            <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-700">
                                  Payment Method
                                </span>
                                <span className="font-semibold capitalize">
                                  {order.paymentMethod === "cod"
                                    ? "Cash on Delivery"
                                    : "Online Payment"}
                                </span>
                              </div>
                              <div className="flex justify-between font-bold text-base pt-2 border-t">
                                <span>Total Amount</span>
                                <span className="text-orange-600">
                                  ₹{order.totalAmount}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            onClick={() => navigate(`/order/${order._id}`)}
                            className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500
                                     text-white font-bold rounded-xl hover:shadow-lg transition"
                          >
                            View Full Details
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
