export interface BookingInfo {
  bookingId: string;
  parkingSlotId: string;
  vehicleId: string;
  vehicleNumber: string;

  name: string; // tên khách hàng
  vehicle: string; // biển số hiển thị
  zone: string; // khu
  spot: string; // chỗ đậu

  startTime: string;
  endTime: string;
  bookingType: string;
  estimatedFee: string;
  paymentMethod: string;
}
