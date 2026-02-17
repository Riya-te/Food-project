import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../utils/axiosConfig";
import { clearCart } from "../redux/userSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.user.cartItems || []);
  const map = useSelector((state) => state.map || {});

  const paymentMethodFromState = location.state?.paymentMethod || "COD";
  const [paymentMethod] = useState(paymentMethodFromState);
  const addressText = map.address || "";
  const latitude = map.lat || null;
  const longitude = map.lng || null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const TAX_PERCENT = 5;
  const FREE_DELIVERY_LIMIT = 500;
  const DELIVERY_FEE = 40;

  const taxAmount = Math.round((subtotal * TAX_PERCENT) / 100);
  const deliveryFee = subtotal >= FREE_DELIVERY_LIMIT ? 0 : DELIVERY_FEE;
  const totalPayable = subtotal + taxAmount + deliveryFee;

  const groupByShop = (items) => {
    const map = new Map();
    items.forEach((it) => {
      const shopId = it.shop;
      if (!map.has(shopId)) map.set(shopId, []);
      map.get(shopId).push(it);
    });
    const arr = [];
    for (const [shopId, itemsArr] of map.entries()) {
      const sub = itemsArr.reduce(
        (s, i) => s + i.price * i.quantity,
        0
      );
      arr.push({
        shop: shopId,
        subTotal: sub,
        shopOrderItems: itemsArr.map((i) => ({
          items: i.id,
          price: i.price,
          quantity: i.quantity,
        })),
      });
    }
    return arr;
  };

  const handleConfirmOrder = async () => {
    if (!addressText.trim()) {
      toast.error("Please provide a delivery address");
      return;
    }

    const payload = {
      paymentMethod: paymentMethod.toLowerCase() === "cod" ? "cod" : "online",
      deliveryAddress: {
        text: addressText,
        latitude,
        longitude,
      },
      totalAmount: totalPayable,
      shopOrder: groupByShop(cartItems),
    };

    try {
      const res = await axios.post("/api/order", payload);
      toast.success("Order placed successfully");
      dispatch(clearCart());
      const orderId = res.data?.order?._id;
      if (orderId) {
        navigate(`/order/${orderId}`);
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 px-4 py-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 shadow">
        <h1 className="text-2xl font-bold mb-4">Confirm Order</h1>

        <div className="mb-4">
          <h2 className="font-semibold">Delivery Address</h2>
          <p className="text-sm text-gray-700">{addressText || "No address set"}</p>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold">Payment Method</h2>
          <p className="text-sm text-gray-700">{paymentMethod}</p>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold">Order Items</h2>
          <div className="text-sm space-y-2">
            {cartItems.map((it) => (
              <div key={it.id} className="flex justify-between">
                <span>{it.name} × {it.quantity}</span>
                <span>₹{it.price * it.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-3 space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className="flex justify-between"><span>Tax ({TAX_PERCENT}%)</span><span>₹{taxAmount}</span></div>
          <div className="flex justify-between"><span>Delivery Fee</span><span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span></div>
          <div className="flex justify-between font-bold text-orange-600"><span>Total</span><span>₹{totalPayable}</span></div>
        </div>

        <button
          onClick={handleConfirmOrder}
          className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold"
        >
          Confirm & Place Order
        </button>
      </div>
    </div>
  );
};

export default PlaceOrder;

