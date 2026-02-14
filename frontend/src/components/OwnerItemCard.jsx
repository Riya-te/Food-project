// src/components/OwnerItemCard.jsx
import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

import { serverUrl } from "../App";
import { removeItem } from "../redux/ownerSlice";

const OwnerItemCard = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ================= DELETE ITEM ================= */
  const handleDelete = async () => {
    const confirm = window.confirm(
      `Delete "${item.name}"? This action cannot be undone.`
    );

    if (!confirm) return;

    try {
      await axios.delete(
        `${serverUrl}/api/item/delete/${item._id}`,
        { withCredentials: true }
      );

      // ✅ Remove from redux (instant UI update)
      dispatch(removeItem(item._id));

      toast.success("Item deleted successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete item"
      );
    }
  };

  return (
    <div
      className="w-56 flex-shrink-0
                 bg-white/70 backdrop-blur-xl
                 rounded-xl p-3
                 border border-white/40
                 shadow-sm
                 transition-all duration-300
                 hover:-translate-y-0.5
                 hover:shadow-md"
    >
      {/* IMAGE */}
      <div className="overflow-hidden rounded-lg">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-28 object-cover
                     transition-transform duration-500
                     hover:scale-105"
        />
      </div>

      {/* INFO */}
      <div className="mt-3 space-y-1">
        <h3 className="font-semibold text-gray-800 text-sm truncate">
          {item.name}
        </h3>

        <p className="text-xs text-gray-500 capitalize">
          {item.category.replace("_", " ")}
        </p>

        <p className="text-orange-600 font-bold text-sm">
          ₹{item.price}
        </p>
      </div>

      {/* ACTION ICONS */}
      <div className="mt-3 flex justify-end gap-2">
        {/* EDIT */}
        <button
          onClick={() => navigate(`/edit-item/${item._id}`)}
          className="p-1.5 rounded-full
                     bg-orange-500/10 text-orange-500
                     hover:bg-orange-500/20
                     transition"
          title="Edit item"
        >
          <Pencil size={14} />
        </button>

        {/* DELETE */}
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-full
                     bg-red-500/10 text-red-500
                     hover:bg-red-500/20
                     transition"
          title="Delete item"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default OwnerItemCard;
