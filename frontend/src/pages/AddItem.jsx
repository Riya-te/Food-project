import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import gsap from "gsap";
import { ImagePlus, Trash2, ArrowLeft } from "lucide-react";
import axiosInstance from "../utils/axiosConfig";

import Navbar from "../components/Navbar";
import { serverUrl } from "../App";
import { addItem } from "../redux/ownerSlice";

const CATEGORIES = [
  "snacks",
  "main_course",
  "desserts",
  "pizza",
  "burgers",
  "sandwiches",
  "south_indian",
  "north_indian",
  "chinese",
  "fast_food",
  "others",
];

const AddItem = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shop } = useSelector((state) => state.owner);

  /* ================= FORM STATE ================= */
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    foodType: "",
  });

  /* ================= IMAGE STATE ================= */
  const [imageMode, setImageMode] = useState("file"); // file | url
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);

  /* ================= GSAP ================= */
  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setImageUrl("");
    setPreview(null);
  };

  /* ================= SUBMIT ================= */
const handleSubmit = async (e) => {
  e.preventDefault();

  const { name, price, category, foodType } = formData;

  if (!name || !price || !category || !foodType) {
    return toast.error("All fields are required");
  }

  if (imageMode === "file" && !image) {
    return toast.error("Item image is required");
  }

  if (imageMode === "url" && !imageUrl.trim()) {
    return toast.error("Image URL is required");
  }

  try {
    setLoading(true);

    const data = new FormData();
    data.append("name", name);
    data.append("price", Number(price));
    data.append("category", category);
    data.append("foodType", foodType);
    data.append("shopId", shop._id);

    if (imageMode === "file") data.append("image", image);
    if (imageMode === "url") data.append("imageUrl", imageUrl);

    const res = await axiosInstance.post(
      "/api/item/create",
      data
    );

    dispatch(addItem(res.data.item));
    toast.success("Food item added successfully!");
    navigate("/", { replace: true });
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to add item");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      <Navbar />

      <div className="max-w-lg mx-auto px-4 py-10">
        <form
          ref={cardRef}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-6 space-y-5"
        >
          {/* HEADER */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-orange-100 text-orange-500"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-xl font-extrabold">Add Food Item</h1>
          </div>

          {/* IMAGE MODE TOGGLE */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setImageMode("file");
                removeImage();
              }}
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                imageMode === "file"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              Upload File
            </button>

            <button
              type="button"
              onClick={() => {
                setImageMode("url");
                removeImage();
              }}
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                imageMode === "url"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              Image URL
            </button>
          </div>

          {/* IMAGE INPUT */}
          <div>
            <label className="font-semibold">Image</label>

            {imageMode === "file" && (
              <div className="mt-2 relative w-full h-44 rounded-xl border
                              border-dashed flex items-center justify-center
                              bg-gray-50 overflow-hidden">
                {preview ? (
                  <>
                    <img src={preview} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-white p-2
                                 rounded-full shadow text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer text-gray-400">
                    <ImagePlus size={32} />
                    <span className="text-sm mt-1">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFile}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            )}

            {imageMode === "url" && (
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  placeholder="Paste image URL"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setPreview(e.target.value);
                  }}
                  className="input"
                />
                {preview && (
                  <div className="w-full h-44 rounded-xl overflow-hidden border">
                    <img
                      src={preview}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* FORM FIELDS */}
          <input
            name="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={handleChange}
            className="input"
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="input"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.replace("_", " ")}
              </option>
            ))}
          </select>

          <select
            name="foodType"
            value={formData.foodType}
            onChange={handleChange}
            className="input"
          >
            <option value="">Food Type</option>
            <option value="veg">Veg</option>
            <option value="Non_veg">Non Veg</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-full
                       bg-gradient-to-r from-orange-500 to-amber-500
                       text-white font-bold
                       hover:shadow-lg active:scale-95 transition"
          >
            {loading ? "Please wait..." : "Add Item"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.65rem 1rem;
          border-radius: 999px;
          border: 1px solid #e5e7eb;
          outline: none;
        }
        .input:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.25);
        }
      `}</style>
    </div>
  );
};

export default AddItem;
