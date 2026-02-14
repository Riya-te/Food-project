import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axiosConfig";

const useGetShopItems = () => {
  const { lat, lng, userData } = useSelector((state) => state.user);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ⛔ Only fetch for regular users
    if (!userData || userData.role !== "user") return;

    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);

        let url = "/api/shop/nearby";

        // 🌍 Add location if available
        if (lat && lng) {
          url += `?lat=${lat}&lng=${lng}&limit=20`;
        }

        const res = await axiosInstance.get(url);

        // ✅ Flatten all items from all shops
        if (res.data.shops) {
          const allItems = res.data.shops.flatMap((shop) =>
            shop.items.map((item) => ({
              ...item,
              shopName: shop.name,
              shopId: shop._id,
            }))
          );

          setItems(allItems);
        }
      } catch (err) {
        console.error("useGetShopItems error:", err);
        setError(err.message);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [userData, lat, lng]);

  return { items, loading, error };
};

export default useGetShopItems;
