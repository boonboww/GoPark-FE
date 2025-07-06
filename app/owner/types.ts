// src/types.ts

// Customer type
export interface Customer {
  id: string;
  fullName: string;
  idNumber: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber: string;
  address: string;
  vehicles: string[];
}

// Vehicle type
export interface Vehicle {
  id: string;
  licensePlate: string;
  type: string;
  owner: string;
  status: "Parked" | "Reserved" | "Available" | "Not Parked";
  plateImage?: string;
}

// Ticket type
export interface Ticket {
  id: string;
  licensePlate: string;
  customer: string;
  type: "Daily" | "Monthly" | "Annual";
  price: number;
  floor: string;
  expiry: string;
}

// ParkingLot type
export interface ParkingLot {
  id: string;
  name: string;
  address: string;
  capacity: number;
  pricePerHour: number;
  image?: string;
}

// Account type
export interface Account {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
}

// ParkingSlot type
export interface ParkingSlot {
  number: number;
  status: "available" | "occupied" | "reserved";
  vehicle?: Vehicle;
}

// Floor type
export interface Floor {
  number: number;
  slots: ParkingSlot[];
}

// Vehicle form type
export interface VehicleFormData {
  licensePlate: string;
  type: string;
}

// Props types for components
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
  editingTicket?: Ticket | null; // Thêm | null vào đây
  onUpdate?: (ticket: Ticket) => void;
}