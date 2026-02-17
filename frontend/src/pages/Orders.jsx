import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("/api/order/my");
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.length === 0 && <p>No orders found</p>}
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="border rounded p-4">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Order ID: {o._id}</p>
                <p className="text-sm text-gray-600">Placed: {new Date(o.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-orange-600">₹{o.totalAmount}</p>
                <Link to={`/order/${o._id}`} className="text-sm text-amber-500">View</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
