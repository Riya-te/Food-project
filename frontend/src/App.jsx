import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import ForgetPassword from "./pages/ForgetPassword";
import Home from "./pages/Home";
import CreateEditShop from "./pages/CreateEditShop";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/CheckOut"; // ✅ fixed name

import useGetCurrentUser from "./hooks/useGetCurrentUser";
import useGetCity from "./hooks/useGetCity";
import useGetMyShop from "./hooks/useGetMyShop";
import useGetShopByCity from "./hooks/useGetShopByCity";
import { serverUrl } from "./config/constants";

export { serverUrl };

const App = () => {
  const { userData, authChecked } = useSelector((state) => state.user);

  useGetCurrentUser();
  useGetCity();
  useGetMyShop();
  useGetShopByCity();

  if (!authChecked) {
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* AUTH ROUTES */}
      <Route
        path="/signin"
        element={userData ? <Navigate to="/" replace /> : <Signin />}
      />

      <Route
        path="/signup"
        element={userData ? <Navigate to="/" replace /> : <Signup />}
      />

      <Route
        path="/forget-password"
        element={userData ? <Navigate to="/" replace /> : <ForgetPassword />}
      />

      {/* CART */}
      <Route
        path="/cart"
        element={userData ? <CartPage /> : <Navigate to="/signin" replace />}
      />

      {/* CHECKOUT */}
      <Route
        path="/checkout"
        element={userData ? <Checkout /> : <Navigate to="/signin" replace />}
      />

      {/* HOME */}
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/signin" replace />}
      />

      {/* OWNER ROUTES */}
      <Route
        path="/create-edit-shop"
        element={
          userData?.role === "owner"
            ? <CreateEditShop />
            : <Navigate to="/" replace />
        }
      />

      <Route
        path="/add-item"
        element={
          userData?.role === "owner"
            ? <AddItem />
            : <Navigate to="/" replace />
        }
      />

      <Route
        path="/edit-item/:itemId"
        element={
          userData?.role === "owner"
            ? <EditItem />
            : <Navigate to="/" replace />
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
