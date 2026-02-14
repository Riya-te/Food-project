// src/pages/EditItem.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import { serverUrl } from "../App";
import { updateItem } from "../redux/ownerSlice";

const EditItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items } = useSelector((state) => state.owner);

  const existingItem = items.find((i) => i._id === itemId);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    foodType: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  /* PREFILL */
  useEffect(() => {
    if (!existingItem) return;

    setFormData({
      name: existingItem.name,
      price: existingItem.price,
      category: existingItem.category,
      foodType: existingItem.foodType,
    });

    setPreview(existingItem.image);
  }, [existingItem]);

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );

      if (image) data.append("image", image);

      const res = await axios.post(
        `${serverUrl}/api/item/edit/${itemId}`,
        data,
        { withCredentials: true }
      );

      dispatch(updateItem(res.data.item));
      toast.success("Item updated successfully");
      navigate("/");
    } catch (err) {
      toast.error("Failed to update item");
    } finally {
      setLoading(false);
    }
  };

  if (!existingItem) {
    return <p className="text-center mt-20">Item not found</p>;
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />

      <div className="max-w-md mx-auto px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow space-y-4"
        >
          <h1 className="text-xl font-bold">Edit Food Item</h1>

          <input
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="input"
            placeholder="Item name"
          />

          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="input"
            placeholder="Price"
          />

          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="input"
          >
            <option value="">Category</option>
            <option value="snacks">Snacks</option>
            <option value="main_course">Main Course</option>
            <option value="desserts">Desserts</option>
          </select>

          <select
            value={formData.foodType}
            onChange={(e) =>
              setFormData({ ...formData, foodType: e.target.value })
            }
            className="input"
          >
            <option value="">Food Type</option>
            <option value="veg">Veg</option>
            <option value="Non_veg">Non Veg</option>
          </select>

          {/* IMAGE */}
         {/* IMAGE PICKER */}
<div className="space-y-2">
  <label className="block text-sm font-semibold text-gray-700">
    Item Image
  </label>

  <label
    htmlFor="item-image"
    className="relative block w-full h-36
               rounded-xl overflow-hidden
               cursor-pointer
               border border-gray-200
               group"
  >
    {/* IMAGE */}
    <img
      src={preview}
      alt="Item"
      className="w-full h-full object-cover
                 transition-transform duration-500
                 group-hover:scale-105"
    />

    {/* HOVER OVERLAY */}
    <div
      className="absolute inset-0
                 bg-black/30
                 opacity-0 group-hover:opacity-100
                 flex items-center justify-center
                 transition"
    >
      <span className="text-white text-sm font-semibold">
        Change Image
      </span>
    </div>
  </label>

  {/* REAL FILE INPUT */}
  <input
    id="item-image"
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];
      if (!file) return;

      setImage(file);
      setPreview(URL.createObjectURL(file));
    }}
    className="hidden"
  />
</div>


          <button
            disabled={loading}
            className="w-full py-2 rounded-full
                       bg-orange-500 text-white font-semibold"
          >
            {loading ? "Updating..." : "Update Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditItem;
