import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axiosConfig";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`/api/order/${orderId}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [orderId]);

  if (loading) return <div>Loading order...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <div className="border rounded p-4">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Placed:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Total:</strong> ₹{order.totalAmount}</p>
        <h3 className="mt-4 font-semibold">Delivery Address</h3>
        <p>{order.deliveryAddress?.text}</p>

        <h3 className="mt-4 font-semibold">Shops & Items</h3>
        <div className="space-y-3">
          {(order.shopOrder || []).map((s) => (
            <div key={s._id || s.shop} className="p-3 border rounded">
              <p className="font-semibold">Shop: {s.shop}</p>
              <p>Subtotal: ₹{s.subTotal}</p>
              <ul className="list-disc ml-6 mt-2">
                {(s.shopOrderItems || []).map((it, idx) => (
                  <li key={idx}>{it.items} — ₹{it.price} × {it.quantity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
