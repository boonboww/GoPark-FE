// app/myBooking/types.ts
export interface Booking {
  id: number;
  parkingName: string;
  location: string;
  time: string;
  status: "active" | "completed" | "cancelled";
  image: string;
  feeEstimate: string;
  package: string;
  plateNumber: string;
  spotNumber: string;
  zone: string;
  ticketId: string;
  startTime: string;
  endTime: string;
  paymentMethod: "prepaid" | "onsite";
  fee: string;
}