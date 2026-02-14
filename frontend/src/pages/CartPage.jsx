import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Minus, Plus, Trash2, MapPin, ArrowLeft, Pencil } from "lucide-react";
import { addToCart, decreaseQty, removeFromCart } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const FREE_DELIVERY_LIMIT = 500;
const DELIVERY_FEE = 40;

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.user.cartItems || []);

  /* ================= ADDRESS STATE ================= */

  const [addresses, setAddresses] = useState([
    { id: 1, label: "Home", address: "221B Baker Street, Mumbai" },
    { id: 2, label: "Office", address: "Andheri East, Mumbai" },
  ]);

  const [selectedAddress, setSelectedAddress] = useState(addresses[0]?.id);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({ label: "", address: "" });

  /* ================= PRICE CALC ================= */

  const itemTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const isFreeDelivery = itemTotal >= FREE_DELIVERY_LIMIT;
  const deliveryFee = isFreeDelivery ? 0 : DELIVERY_FEE;
  const taxes = Math.round(itemTotal * 0.05);
  const grandTotal = itemTotal + deliveryFee + taxes;

  /* ================= ADDRESS HANDLERS ================= */

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData({ label: "", address: "" });
    setShowModal(true);
  };

  const openEditModal = (addr) => {
    setEditingAddress(addr);
    setFormData({ label: addr.label, address: addr.address });
    setShowModal(true);
  };

  const saveAddress = () => {
    if (!formData.label || !formData.address) return;

    if (editingAddress) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingAddress.id ? { ...a, ...formData } : a
        )
      );
    } else {
      setAddresses((prev) => [
        ...prev,
        { id: Date.now(), ...formData },
      ]);
    }

    setShowModal(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Your cart is empty 🛒</h2>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden">
      {/* BACKGROUND FLOAT */}
      <div className="absolute inset-0 -z-10">
        <div className="float bg-orange-400/30 w-64 h-64 top-20 left-10" />
        <div className="float bg-amber-400/30 w-80 h-80 top-96 right-20 delay-2" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-100"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-2xl font-extrabold">Cart Items</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
            {/* ADDRESS */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <MapPin className="text-orange-500" />
                  Delivery Address
                </h2>
                <button
                  onClick={openAddModal}
                  className="text-orange-500 font-semibold"
                >
                  + Add Address
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`border rounded-lg p-4 cursor-pointer ${
                      selectedAddress === addr.id
                        ? "border-orange-500 bg-orange-50"
                        : ""
                    }`}
                    onClick={() => setSelectedAddress(addr.id)}
                  >
                    <div className="flex justify-between">
                      <p className="font-semibold">{addr.label}</p>
                      <Pencil
                        size={16}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(addr);
                        }}
                        className="text-gray-500 hover:text-black"
                      />
                    </div>
                    <p className="text-sm text-gray-600">{addr.address}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CART ITEMS */}
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <p className="text-xs text-gray-500">{item.shop?.name}</p>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">₹{item.price}</p>
                  </div>

                  <div className="flex items-center gap-2 border rounded-lg px-2 py-1">
                    <button onClick={() => dispatch(decreaseQty(item.id))}>
                      <Minus size={16} />
                    </button>
                    <span className="font-semibold w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        dispatch(addToCart({ ...item, quantity: 1 }))
                      }
                      className="text-green-600"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-xl p-6 shadow-sm h-fit sticky top-24">
            <h2 className="text-lg font-bold mb-4">Bill Details</h2>

            {!isFreeDelivery ? (
              <p className="text-sm text-orange-600 mb-3">
                Add ₹{FREE_DELIVERY_LIMIT - itemTotal} more for FREE delivery
              </p>
            ) : (
              <p className="text-sm text-green-600 mb-3">
                🎉 Free delivery unlocked
              </p>
            )}

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Item Total</span>
                <span>₹{itemTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>₹{taxes}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold">
                <span>To Pay</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

        <button
  onClick={() => navigate("/checkout")}
  className="
    w-full mt-6 py-3
    bg-orange-500 hover:bg-orange-600
    text-white font-semibold
    rounded-lg
  "
>
  Proceed to Checkout
</button>

          </div>
        </div>
      </div>

      {/* ADDRESS MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {editingAddress ? "Edit Address" : "Add Address"}
            </h2>

            <input
              placeholder="Label (Home / Office)"
              value={formData.label}
              onChange={(e) =>
                setFormData({ ...formData, label: e.target.value })
              }
              className="w-full border rounded-lg p-2 mb-3"
            />

            <textarea
              placeholder="Full Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full border rounded-lg p-2 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
                onClick={saveAddress}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOAT ANIMATION */}
      <style>{`
        .float {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: float 10s infinite ease-in-out;
        }
        .delay-2 { animation-delay: 2s; }
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-40px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CartPage;
