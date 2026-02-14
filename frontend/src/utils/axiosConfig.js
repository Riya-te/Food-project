import axios from "axios";
import { serverUrl } from "../config/constants";

// ✅ Create axios instance with global credentials
const axiosInstance = axios.create({
  baseURL: serverUrl,
  withCredentials: true, // 🔥 ALWAYS send cookies
});

export default axiosInstance;
