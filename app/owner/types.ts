// src/types.ts

export interface Customer {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
}

export interface Vehicle {
  id: string;
  licensePlate: string;
  type: string;
  owner: string;
  status: "Parked" | "Reserved" | "Available" | "Not Parked";
  plateImage?: string;
  imageVehicle?: string;
}

export interface Ticket {
  _id: string; // Backend uses _id
  id?: string; // Keep for compatibility if needed, or mapped
  vehicleNumber: string; // Changed from licensePlate to match query params/backend
  // customer: string; // Replaced by populated userId object usually
  userId?: {
    _id: string;
    userName: string;
    phoneNumber: string;
    email: string;
  };
  ticketType: "hours" | "date" | "guest" | "month"; // Changed from type
  price: number;
  floor?: string; // Might be in booking -> parkingSlot -> floor/zone
  expiryDate?: string; // Backend might use endTime or specific expiry
  status: "active" | "used" | "cancelled";
  bookingId?: {
    _id: string;
    startTime: string;
    endTime: string;
    totalPrice?: number;
    parkingSlotId?: {
      _id: string;
      slotNumber: string;
      zone: string;
    };
  };
}

export interface ParkingLot {
  _id: string;
  name: string;
  address: string;
  pricePerHour: number;
  image: string[];
  zones: { zone: string; count: number }[];
  parkingOwner: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  description?: string;
  isActive: boolean;
  avtImage?: string;
  allowedPaymentMethods: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ParkingSlot {
  _id: string;
  parkingLot: string;
  slotNumber: string;
  status: "available" | "booked" | "reserved";
  zone: string;
  pricePerHour: number;
  vehicle?: Vehicle;
}

export interface Floor {
  number: number;
  name: string;
  slots: ParkingSlot[];
}

export interface Account {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
}

export interface VehicleFormData {
  licensePlate: string;
  capacity: number;
  imageVehicle?: string;
}

export interface CustomerManagementProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

export interface VehicleManagementProps {
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  customers: Customer[];
}

export interface TicketManagementProps {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  vehicles: Array<{ id: string; licensePlate: string }>;
  customers: Array<{ id: string; name: string }>;
}

export interface ParkingLotManagementProps {
  parkingLots: ParkingLot[];
  setParkingLots: React.Dispatch<React.SetStateAction<ParkingLot[]>>;
}

export interface AccountManagementProps {
  account: Account;
  setAccount: React.Dispatch<React.SetStateAction<Account>>;
}

export interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (customer: Omit<Customer, "id" | "vehicles">) => void;
  onCancel: () => void;
}

export interface VehicleFormProps {
  onSubmit: (vehicle: VehicleFormData) => void;
  onCancel: () => void;
}

export interface TicketFormProps {
  vehicles: Array<{ id: string; licensePlate: string }>;
  customers: Array<{ id: string; name: string }>;
  onSubmit: (ticket: Omit<Ticket, "id">) => void;
  editingTicket?: Ticket | null;
  onUpdate?: (ticket: Ticket) => void;
}
