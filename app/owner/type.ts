// types.ts
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

export interface Vehicle {
  id: string;
  licensePlate: string;
  type: string;
  owner: string;
  status: "Parked" | "Reserved" | "Available";
  plateImage?: string;
}

export interface Ticket {
  id: string;
  licensePlate: string;
  customer: string;
  type: "Daily" | "Monthly" | "Annual";
  price: number;
  floor: string;
  expiry: string;
}

export interface ParkingLot {
  id: string;
  name: string;
  address: string;
  capacity: number;
  pricePerHour: number;
  image?: string;
}

export interface Account {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "owner" | "staff";
  avatar?: string;
}

export interface ParkingSlot {
  number: number;
  status: "available" | "occupied" | "reserved";
  vehicle?: Vehicle;
}

export interface Floor {
  number: number;
  slots: ParkingSlot[];
}