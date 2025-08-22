import API from "./api";
import { Booking as UIBooking } from "../app/myBooking/types";

export interface BookingResponse {
  status: string;
  results: number;
  data: Booking[];
}

export interface Booking {
  _id: string;
  userId: string;
  parkingSlotId: {
    _id: string;
    slotNumber: string;
    zone: string;
    parkingLot: {
      _id: string;
      name: string;
      address: string;
      image?: string[];
    };
  };
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "active";
  paymentMethod: "prepaid" | "pay-at-parking";
  totalPrice: number;
  vehicleNumber: string;
  bookingType: "hours" | "date" | "month";
  discount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TicketResponse {
  status: string;
  data: Ticket;
}

export interface Ticket {
  _id: string;
  bookingId: string;
  userId: string;
  parkingSlotId: string;
  vehicleNumber: string;
  ticketType: "hours" | "date" | "guest" | "month";
  startTime: string;
  expiryDate: string;
  status: "active" | "used" | "expired" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  qrCode: string;
  createdAt: string;
  updatedAt: string;
}

// Get user's bookings
export const getUserBookings = async (): Promise<BookingResponse> => {
  try {
    const response = await API.get("/api/v1/bookings/my-bookings");
    return response.data;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    throw error;
  }
};

// Get booking by ID
export const getBookingById = async (bookingId: string): Promise<{ status: string; data: Booking }> => {
  try {
    const response = await API.get(`/api/v1/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
};

// Get ticket by booking ID
export const getTicketByBookingId = async (bookingId: string): Promise<TicketResponse> => {
  try {
    const response = await API.get(`/api/v1/tickets/booking/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ticket:", error);
    throw error;
  }
};

// Cancel booking
export const cancelBooking = async (bookingId: string): Promise<{ status: string; message: string }> => {
  try {
    const response = await API.patch(`/api/v1/bookings/${bookingId}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error;
  }
};

// Format booking data for UI
export const formatBookingForUI = (booking: Booking): UIBooking => {
  return {
    id: booking._id,
    parkingName: booking.parkingSlotId?.parkingLot?.name || "Bãi đỗ xe",
    location: booking.parkingSlotId?.parkingLot?.address || "Địa chỉ không xác định",
    time: new Date(booking.startTime).toLocaleString("vi-VN"),
    status: booking.status,
    image: booking.parkingSlotId?.parkingLot?.image?.[0] || "/default-parking.jpg",
    feeEstimate: `${booking.totalPrice.toLocaleString()} VNĐ`,
    package: booking.bookingType === "hours" ? "Theo giờ" : 
             booking.bookingType === "date" ? "Theo ngày" : "Theo tháng",
    plateNumber: booking.vehicleNumber,
    spotNumber: booking.parkingSlotId?.slotNumber || "",
    zone: booking.parkingSlotId?.zone || "",
    ticketId: booking._id,
    startTime: booking.startTime,
    endTime: booking.endTime,
    paymentMethod: booking.paymentMethod,
    fee: `${booking.totalPrice.toLocaleString()} VNĐ`,
    bookingType: booking.bookingType,
    discount: booking.discount || 0,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt
  };
};
