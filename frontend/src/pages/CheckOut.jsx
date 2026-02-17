import React, { useEffect, useState } from "react";
import {
  MapPin,
  Wallet,
  CreditCard,
  ArrowLeft,
  LocateFixed,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { clearCart } from "../redux/userSlice";
import { setLocation, updateAddress } from "../redux/mapSlice";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ================= FIX LEAFLET DEFAULT ICON ================= */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ================= CONSTANTS ================= */
const FREE_DELIVERY_LIMIT = 500;
const DELIVERY_FEE = 40;
const TAX_PERCENT = 5;

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.user.cartItems || []);
  const savedLocation = useSelector((state) => state.map);

  const [address, setAddress] = useState(savedLocation?.address || "");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [coords, setCoords] = useState({
    lat: savedLocation?.lat || 20.5937,
    lng: savedLocation?.lng || 78.9629,
  });

  /* ================= REDIRECT IF CART EMPTY ================= */
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [cartItems, navigate]);

  /* ================= PRICE CALC ================= */
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const taxAmount = Math.round((subtotal * TAX_PERCENT) / 100);
  const deliveryFee =
    subtotal >= FREE_DELIVERY_LIMIT ? 0 : DELIVERY_FEE;
  const totalPayable = subtotal + taxAmount + deliveryFee;

  /* ================= REVERSE GEOCODE ================= */
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      const detectedAddress = data.display_name || "";

      setAddress(detectedAddress);

      dispatch(
        setLocation({
          lat,
          lng,
          address: detectedAddress,
        })
      );
    } catch {
      toast.error("Failed to fetch address");
    }
  };

  /* ================= CLICK TO SELECT LOCATION ================= */
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setCoords({ lat, lng });
        reverseGeocode(lat, lng);
        toast.success("Location selected 📍");
      },
    });
    return null;
  };

  /* ================= DRAG MARKER ================= */
  const DraggableMarker = () => {
    const eventHandlers = {
      dragend(e) {
        const marker = e.target;
        const position = marker.getLatLng();
        setCoords({
          lat: position.lat,
          lng: position.lng,
        });
        reverseGeocode(position.lat, position.lng);
        toast.success("Marker moved 📍");
      },
    };

    return (
      <Marker
        position={[coords.lat, coords.lng]}
        draggable={true}
        eventHandlers={eventHandlers}
      />
    );
  };

  /* ================= FORCE MAP RESIZE ================= */
  const FixMapSize = () => {
    const map = useMap();
    useEffect(() => {
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 300);
      return () => clearTimeout(timer);
    }, [map]);
    
    useEffect(() => {
      window.addEventListener("resize", () => map.invalidateSize());
      return () => window.removeEventListener("resize", () => map.invalidateSize());
    }, [map]);
    
    return null;
  };

  /* ================= RECENTER MAP ================= */
  const RecenterMap = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
  };

  /* ================= CURRENT LOCATION ================= */
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        reverseGeocode(latitude, longitude);
        toast.success("Location detected 📍");
        setLoadingLocation(false);
      },
      () => {
        toast.error("Location permission denied");
        setLoadingLocation(false);
      }
    );
  };

  /* ================= PLACE ORDER ================= */
  const handlePlaceOrder = () => {
    if (!address.trim()) {
      toast.error("Please enter delivery address");
      return;
    }

    // Persist the typed address to the map slice so place-order page can read it
    dispatch(updateAddress(address));

    // Navigate to place-order confirmation page where order will be sent to backend
    navigate("/place-order", { state: { paymentMethod } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 px-4 py-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/cart")}
              className="p-2 rounded-full bg-white shadow"
            >
              <ArrowLeft />
            </button>
            <h1 className="text-2xl font-extrabold">
              Secure Checkout
            </h1>
          </div>

          {/* ADDRESS */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <MapPin className="text-orange-500" />
              Delivery Address
            </h2>

            <div className="flex gap-2 mb-3">
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter delivery address"
                className="flex-1 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />

              <button
                onClick={getCurrentLocation}
                disabled={loadingLocation}
                className="p-3 rounded-xl bg-orange-500 text-white"
              >
                <LocateFixed size={18} />
              </button>
            </div>

            {/* MAP */}
            <div className="rounded-xl overflow-hidden border mt-4">
              <MapContainer
                center={[coords.lat, coords.lng]}
                zoom={15}
                style={{ height: "400px", width: "100%" }}
                key={`${coords.lat}-${coords.lng}`}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <DraggableMarker />
                <LocationMarker />
                <RecenterMap lat={coords.lat} lng={coords.lng} />
                <FixMapSize />
              </MapContainer>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              Payment Method
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div
                onClick={() => setPaymentMethod("COD")}
                className={`cursor-pointer rounded-xl p-4 border ${
                  paymentMethod === "COD"
                    ? "border-orange-500 bg-orange-50"
                    : "hover:border-gray-300"
                }`}
              >
                <Wallet className="text-green-600" />
                <p className="font-semibold">Cash on Delivery</p>
              </div>

              <div
                onClick={() => setPaymentMethod("ONLINE")}
                className={`cursor-pointer rounded-xl p-4 border ${
                  paymentMethod === "ONLINE"
                    ? "border-orange-500 bg-orange-50"
                    : "hover:border-gray-300"
                }`}
              >
                <CreditCard className="text-purple-600" />
                <p className="font-semibold">UPI / Card</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="bg-white rounded-2xl p-6 shadow-xl h-fit sticky top-24">
          <h2 className="text-lg font-bold mb-4">
            Order Summary
          </h2>

          <div className="space-y-2 text-sm">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} × {item.quantity}</span>
                <span>
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}

            <hr />

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax ({TAX_PERCENT}%)</span>
              <span>₹{taxAmount}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>
                {deliveryFee === 0
                  ? "FREE"
                  : `₹${deliveryFee}`}
              </span>
            </div>

            <hr />

            <div className="flex justify-between font-bold text-orange-600">
              <span>Total Payable</span>
              <span>₹{totalPayable}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
