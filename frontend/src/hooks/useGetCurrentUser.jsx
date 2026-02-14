import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../redux/userSlice";
import axiosInstance from "../utils/axiosConfig";

const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/api/user/current");

        dispatch(
          setUser({
            user: res.data.user,
            profileComplete: res.data.profileComplete,
          })
        );
      } catch (error) {
        // ❌ do NOT redirect yet — just mark auth checked
        dispatch(clearUser());
      }
    };

    fetchUser();
  }, [dispatch]);
};

export default useGetCurrentUser;
