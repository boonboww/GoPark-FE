import axios from "axios";
import * as useAuthStore from "./auth-storage";
const apiVersion: string = "api/v1";
const URL_BE: string =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const API = axios.create({

  baseURL: URL_BE || "http://localhost:5000",

  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? useAuthStore.getAccessToken() : null;

  console.log("Token gửi trong yêu cầu:", token); // Debug token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor tự động refresh token khi gặp 401/403 (Unauthorized/Forbidden)
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest: any = error.config;
    if (!originalRequest) return Promise.reject(error);

    const status = error.response?.status;
    const url: string = originalRequest.url || "";
    // Các endpoint không được phép trigger refresh
    const skipEndpoints = ["/users/login", "/users/signup", "/users/refresh"]; // đồng bộ với prefix /auth
    if (skipEndpoints.some((ep) => url.includes(ep))) {
      return Promise.reject(error);
    }

    // Khởi tạo bộ đếm retry
    originalRequest._retryCount = originalRequest._retryCount || 0;

    // Chỉ thử refresh 1 lần khi gặp 401 hoặc 403 (tùy backend trả về trạng thái nào cho hết hạn token)
    if ((status === 401 || status === 403) && originalRequest._retryCount < 1) {
      originalRequest._retryCount += 1;
      if (process.env.NODE_ENV === "development") {
        console.log("[Auth] Attempting refresh after status", status);
      }
      try {
        // Gọi refresh bằng instance API để đảm bảo withCredentials + baseURL
        const refreshPath = `${apiVersion}/users/refresh`;
        const refreshRes = await API.post(refreshPath);
        const newAccessToken: string | undefined = refreshRes.data?.token;
        if (!newAccessToken)
          throw new Error("No accessToken in refresh response");
        console.log("new access token: ", newAccessToken);
        useAuthStore.saveAccessToken(newAccessToken);
        // Gắn header Authorization mới
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        if (process.env.NODE_ENV === "development") {
          console.log("[Auth] Refresh success, retrying original request");
        }
        return API(originalRequest);
      } catch (refreshErr) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[Auth] Refresh failed -> clearing auth data");
        }
        useAuthStore.clearAllAuthData();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints for parking lots
export const getParkingLotById = (id: string) =>
  API.get(`/api/v1/parkinglots/${id}/public`);

export const getParkingSlotsByLotId = (parkingLotId: string) =>
  API.get(`/api/v1/parkinglots/${parkingLotId}/slots-public`, {
    headers: { "Cache-Control": "no-cache" },
  });

export const getAvailableSlotsByDate = (
  parkingLotId: string,
  startTime: string,
  endTime: string
) =>
  API.get(`/api/v1/parking-slots/by-date/${parkingLotId}`, {
    params: { startTime, endTime },
    headers: { "Cache-Control": "no-cache" },
  });

// API endpoints for vehicles
export const getMyVehicles = () => API.get("/api/v1/vehicles/my-vehicles");

// API endpoints for bookings
export const createBookingOnline = (data: {
  userId: string;
  parkingSlotId: string;
  startTime: string;
  endTime: string;
  vehicleNumber: string;
  paymentMethod: "pay-at-parking" | "prepaid";
  bookingType: "date" | "hours" | "month";
  totalPrice: number;
}) => API.post("/api/v1/bookings/bookingOnline", data);

export const payAtParking = (bookingId: string) =>
  API.patch(`/api/v1/bookings/${bookingId}/payAtParking`);

export default API;
