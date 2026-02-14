import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axiosConfig";
import { setNearbyShops, clearNearbyShops } from "../redux/shopSlice";

const useGetShopByState = () => {
  const dispatch = useDispatch();
  const { state: userState } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userState) {
      console.log("⏳ Waiting for state...");
      return;
    }

    const fetchShopsByState = async () => {
      try {
        console.log("🔍 Fetching shops for state:", userState);
        const res = await axiosInstance.get(
          `/api/shop/state?state=${encodeURIComponent(userState)}`
        );

        console.log("✅ Shops fetched:", res.data.shops);
        dispatch(setNearbyShops(res.data.shops));
      } catch (error) {
        console.error("❌ Fetch shops by state failed:", error);
        dispatch(clearNearbyShops());
      }
    };

    fetchShopsByState();
  }, [userState, dispatch]);
};

export default useGetShopByState;
