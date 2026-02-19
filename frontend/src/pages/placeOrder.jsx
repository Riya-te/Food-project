import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../utils/axiosConfig";
import { clearCart } from "../redux/userSlice";
import Navbar from "../components/Navbar";
import { MapPin, Truck, Clock, AlertCircle, CheckCircle } from "lucide-react";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.user.cartItems || []);
  const { userData } = useSelector((state) => state.user);
  const map = useSelector((state) => state.map || {});

  const paymentMethod = useLocation().state?.paymentMethod || "COD";
  const [loading, setLoading] = useState(false);

  const addressText = map.address || "";
  const latitude = map.lat || null;
  const longitude = map.lng || null;

  // ✅ Group items by shop
  const groupByShop = () => {
    const grouped = {};

    cartItems.forEach((item) => {
      const shopId = item.shop.id;
      const shopName = item.shop.name;

      if (!grouped[shopId]) {
        grouped[shopId] = {
          shopId,
          shopName,
          items: [],
          subtotal: 0,
          tax: 0,
          deliveryFee: 0,
        };
      }

      grouped[shopId].items.push(item);
    });

    // Calculate individual shop totals
    Object.keys(grouped).forEach((shopId) => {
      const shop = grouped[shopId];
      const subtotal = shop.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      
      const TAX_PERCENT = 5;
      const FREE_DELIVERY_LIMIT = 500;
      const DELIVERY_FEE = 40;

      shop.subtotal = subtotal;
      shop.tax = Math.round((subtotal * TAX_PERCENT) / 100);
      shop.deliveryFee = subtotal >= FREE_DELIVERY_LIMIT ? 0 : DELIVERY_FEE;
    });

    return Object.values(grouped);
  };

  const shopGroups = groupByShop();

  // Calculate overall totals
  const overallSubtotal = shopGroups.reduce(
    (sum, shop) => sum + shop.subtotal,
    0
  );
  const overallTax = shopGroups.reduce((sum, shop) => sum + shop.tax, 0);
  const overallDeliveryFee = shopGroups.reduce(
    (sum, shop) => sum + shop.deliveryFee,
    0
  );
  const totalPayable = overallSubtotal + overallTax + overallDeliveryFee;

  // ✅ Prepare payload for backend
  const preparePayload = () => {
    const shopOrders = shopGroups.map((shop) => ({
      shop: shop.shopId,
      subTotal: shop.subtotal,
      shopOrderItems: shop.items.map((i) => ({
        items: i.id,
        price: i.price,
        quantity: i.quantity,
      })),
    }));

    return {
      paymentMethod: paymentMethod.toLowerCase() === "cod" ? "cod" : "online",
      deliveryAddress: {
        text: addressText,
        latitude,
        longitude,
      },
      totalAmount: totalPayable,
      shopOrder: shopOrders,
    };
  };

  // ✅ Handle confirm order
  const handleConfirmOrder = async () => {
    if (!addressText.trim()) {
      toast.error("Please provide a delivery address");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      const payload = preparePayload();

      const res = await axios.post("/api/order", payload);

      // ✅ Clear cart after successful order
      dispatch(clearCart());

      // ✅ Show success toast and redirect
      toast.success("Order placed successfully! 🎉");
      
      // Get order ID from response
      const orderId = res.data?.order?._id;
      if (orderId) {
        // Navigate to orders page with confirmation state
        navigate("/orders", {
          state: {
            message: `Your order #${orderId.slice(-8)} has been confirmed!`,
            showConfirmation: true,
          },
          replace: true,
        });
      } else {
        navigate("/orders", {
          state: {
            message: "Your order has been confirmed!",
            showConfirmation: true,
          },
          replace: true,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl text-gray-600">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* ================= LEFT: ORDER DETAILS ================= */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <h1 className="text-3xl font-extrabold text-gray-900">
              Order Summary
            </h1>

            {/* Delivery Info */}
            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-orange-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                📍 Delivery Details
              </h2>
              <div className="flex items-start gap-3">
                <MapPin className="text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Delivery Address</p>
                  <p className="font-semibold text-gray-900">
                    {addressText || "No address provided"}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-green-500" />
                  <span>30-40 min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-blue-500" />
                  <span>{paymentMethod === "COD" ? "Pay on Delivery" : "Online Payment"}</span>
                </div>
              </div>
            </div>

            {/* Items by Shop */}
            <div className="space-y-6">
              {shopGroups.map((shop, idx) => (
                <div
                  key={shop.shopId}
                  className="bg-white rounded-2xl p-6 shadow-md border-2 border-gray-100 hover:border-orange-200 transition"
                >
                  {/* Shop Header */}
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    🏪 {shop.shopName}
                  </h3>

                  {/* Items */}
                  <div className="space-y-3 mb-4 pb-4 border-b">
                    {shop.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-bold text-orange-600">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Shop billing */}
                  <div className="space-y-2 text-sm bg-orange-50 rounded-lg p-4">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Subtotal</span>
                      <span className="font-semibold">₹{shop.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Tax (5%)</span>
                      <span className="font-semibold">₹{shop.tax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Delivery Fee</span>
                      <span className="font-semibold">
                        {shop.deliveryFee === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          `₹${shop.deliveryFee}`
                        )}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-orange-600">
                      <span>Total for {shop.shopName}</span>
                      <span>
                        ₹{shop.subtotal + shop.tax + shop.deliveryFee}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= RIGHT: BILLING SUMMARY ================= */}
          <div className="lg:sticky lg:top-20 h-fit">
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-6 text-white shadow-xl">
              <h2 className="text-2xl font-bold mb-6">💰 Payment Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-white/30">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({shopGroups.length} shops)</span>
                  <span className="font-semibold">₹{overallSubtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span className="font-semibold">₹{overallTax}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">
                    {overallDeliveryFee === 0 ? "FREE" : `₹${overallDeliveryFee}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">Total Payable</span>
                <span className="text-3xl font-extrabold">₹{totalPayable}</span>
              </div>

              <div className="bg-white/20 rounded-lg p-3 mb-6 text-sm">
                <p className="flex items-center gap-2">
                  <AlertCircle size={16} />
                  {paymentMethod === "COD"
                    ? "Pay cash at delivery"
                    : "Secure online payment"}
                </p>
              </div>

              <button
                onClick={handleConfirmOrder}
                disabled={loading}
                className="w-full bg-white text-orange-600 font-bold py-3 rounded-xl
                           hover:bg-orange-50 active:scale-95 transition
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Confirm & Place Order"}
              </button>

              <p className="text-xs text-white/70 text-center mt-4">
                ✓ Secure payment • No extra charges
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;


