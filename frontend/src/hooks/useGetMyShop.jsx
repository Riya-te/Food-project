import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShop, clearShop, setItems } from "../redux/ownerSlice";
import axiosInstance from "../utils/axiosConfig";

const useGetMyShop = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData || userData.role !== "owner") return;

    const fetchShop = async () => {
      try {
        const res = await axiosInstance.get("/api/shop/my");

        // 🔥 PUT SHOP INTO REDUX
        dispatch(setShop(res.data.shop));

        // 🔥 PUT ITEMS INTO REDUX
        if (res.data.items) {
          dispatch(setItems(res.data.items));
        }
      } catch (err) {
        if (err.response?.status === 404) {
          dispatch(clearShop());
          dispatch(setItems([])); // 🔥 Clear items when owner has no shop
        }
      }
    };

    fetchShop();
  }, [dispatch, userData]);
};

export default useGetMyShop;
