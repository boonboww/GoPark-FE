// app/myBooking/types.ts
export interface Booking {
  id: string;
  parkingId: string;
  parkingName: string;
  location: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "active";
  image: string;
  feeEstimate: string;
  package: string;
  plateNumber: string;
  spotNumber: string;
  zone: string;
  ticketId: string;
  startTime: string;
  endTime: string;
  paymentMethod: "prepaid" | "pay-at-parking";
  fee: string;
  bookingType?: "hours" | "date" | "month";
  discount?: number;
  createdAt?: string;
  updatedAt?: string;
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