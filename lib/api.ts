import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  //|| "http://localhost:5000"
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  console.log("Token gửi trong yêu cầu:", token); // Debug token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
