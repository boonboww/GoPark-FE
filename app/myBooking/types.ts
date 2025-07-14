export interface Booking {
  id: number;
  ticketId: string;
  parkingName: string;
  location: string;
  time: string;
  status: 'active' | 'completed' | 'cancelled';
  image: string;
  fee: string;
  package: string;
  plateNumber: string;
  spotNumber: string;
  zone: string;
  startTime: string;
  endTime: string;
  paymentMethod: string;
}