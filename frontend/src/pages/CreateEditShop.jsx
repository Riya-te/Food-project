import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import gsap from "gsap";
import { ImagePlus, Trash2, ArrowLeft } from "lucide-react";
import axiosInstance from "../utils/axiosConfig";

import { serverUrl } from "../App";
import Navbar from "../components/Navbar";
import { useDispatch } from "react-redux";
import { setShop } from "../redux/ownerSlice";


const CreateEditShop = () => {
  const navigate = useNavigate();
   const dispatch = useDispatch(); 
  const { shop } = useSelector((state) => state.owner);
  const { city, state: userState, lat, lng } = useSelector(
    (state) => state.user
  );

  const isEdit = Boolean(shop);

  /* ================= FORM STATE ================= */
  const [formData, setFormData] = useState({
    name: "",
    city: city || "",
    state: userState || "",
    address: "",
  });

  /* ================= IMAGE STATE ================= */
  const [imageMode, setImageMode] = useState("file"); // file | url
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  const cardRef = useRef(null);
  const bgRef = useRef(null);

  /* ================= PREFILL EDIT ================= */
  useEffect(() => {
    if (isEdit && shop) {
      setFormData({
        name: shop.name || "",
        city: shop.city || "",
        state: shop.state || "",
        address: shop.address || "",
      });
      setPreview(shop.image);
      setImageMode("file"); // existing image treated as file
    }
  }, [isEdit, shop]);

  /* ================= GSAP ================= */
  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );

  gsap.to(bgRef.current, {
  backgroundPosition: "400% 400%",
  duration: 15,        // 🔥 faster
  repeat: -1,          // 🔁 infinite
  ease: "linear",      // 🎯 smooth loop
});

  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    setImageUrl("");
  };

  /* ================= SUBMIT ================= */
 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.city || !formData.state || !formData.address) {
    return toast.error("All fields are required");
  }

  try {
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("city", formData.city);
    data.append("state", formData.state);
    data.append("address", formData.address);

    if (imageMode === "file" && image) data.append("image", image);
    if (imageMode === "url" && imageUrl) data.append("imageUrl", imageUrl);
    if (lat && lng) {
      data.append("lat", lat);
      data.append("lng", lng);
    }

    const url = isEdit
      ? `/api/shop/${shop._id}`
      : `/api/shop`;

    const method = isEdit ? "put" : "post";

    const res = await axiosInstance({
      method,
      url,
      data,
    });

    // ✅ THIS IS THE MISSING PIECE
    dispatch(setShop(res.data.shop));

    toast.success(
      isEdit ? "Restaurant updated successfully!" : "Restaurant created!"
    );

    navigate("/", { replace: true });
  } catch (err) {
    toast.error(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      ref={bgRef}
      className="min-h-screen bg-gradient-to-br
                 from-orange-50 via-amber-50 to-orange-100
                 bg-[length:300%_300%]"
    >
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
            <h1 className="text-xl font-extrabold">
              {isEdit ? "Edit Restaurant" : "Create Restaurant"}
            </h1>
          </div>

          {/* IMAGE MODE */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setImageMode("file");
                setImageUrl("");
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
                setImage(null);
                setPreview(null);
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

          {/* IMAGE */}
          <div>
            <label className="font-semibold">Image</label>

            {imageMode === "file" && (
              <div className="mt-2 relative w-full h-44 rounded-xl border
                              border-dashed flex items-center justify-center
                              bg-gray-50 overflow-hidden">
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Restaurant"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2
                                 bg-white p-2 rounded-full shadow
                                 text-red-500"
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
                      onChange={handleImage}
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
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* INPUTS */}
          {["name", "city", "state"].map((field) => (
            <div key={field}>
              <label className="font-semibold capitalize">{field}</label>
              <input
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="input"
              />
            </div>
          ))}

          <div>
            <label className="font-semibold">Address</label>
            <textarea
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              className="input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-full
                       bg-gradient-to-r from-orange-500 to-amber-500
                       text-white font-bold
                       hover:shadow-lg active:scale-95 transition"
          >
            {loading
              ? "Please wait..."
              : isEdit
              ? "Update Restaurant"
              : "Create Restaurant"}
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

export default CreateEditShop;
