import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axiosConfig";
import { setNearbyShops, clearNearbyShops } from "../redux/shopSlice";

const useGetShopByState = () => {
  const dispatch = useDispatch();
  const { state: userState, lat, lng } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    // ⛔ Stop if user is not a regular user or location data missing
    if (!userState && (!lat || !lng)) {
      console.log("⏳ Waiting for location data...");
      return;
    }

    const fetchShops = async () => {
      try {
        let url;

        // ✅ Priority 1: Fetch by state if available
        if (userState) {
          console.log("🔍 Fetching shops for state:", userState);
          url = `/api/shop/state?state=${encodeURIComponent(userState)}`;
        }
        // ✅ Priority 2: Fetch nearby shops by coordinates if state unavailable
        else if (lat && lng) {
          console.log(
            `🔍 Fetching nearby shops for coordinates: ${lat}, ${lng}`
          );
          url = `/api/shop/nearby?lat=${lat}&lng=${lng}&limit=20`;
        }

        if (!url) return;

        const res = await axiosInstance.get(url);

        console.log("✅ Shops fetched:", res.data.shops);
        dispatch(setNearbyShops(res.data.shops));
      } catch (error) {
        console.error("❌ Fetch shops failed:", error.message);
        dispatch(clearNearbyShops());
      }
    };

    fetchShops();
  }, [userState, lat, lng, dispatch]);
};

export default useGetShopByState;
