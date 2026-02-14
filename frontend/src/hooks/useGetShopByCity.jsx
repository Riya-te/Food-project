import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axiosConfig";
import { setNearbyShops, clearNearbyShops } from "../redux/shopSlice";

const useGetShopByCity = () => {
  const dispatch = useDispatch();
  const { city } = useSelector((state) => state.user);

  useEffect(() => {
    if (!city) {
      console.log("⏳ Waiting for city...");
      return;
    }

    const fetchShopsByCity = async () => {
      try {
        console.log("🔍 Fetching shops for city:", city);
        const res = await axiosInstance.get(
          `/api/shop/city?city=${encodeURIComponent(city)}`
        );

        console.log("✅ Shops fetched:", res.data.shops);
        dispatch(setNearbyShops(res.data.shops));
      } catch (error) {
        console.error("❌ Fetch shops by city failed:", error);
        dispatch(clearNearbyShops());
      }
    };

    fetchShopsByCity();
  }, [city, dispatch]);
};

export default useGetShopByCity;
