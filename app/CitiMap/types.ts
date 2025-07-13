// types.ts
export interface ParkingZone {
  zone: string;
  count: number;
  _id: string;
}

export interface ParkingLocation {
  type: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Parking {
  _id: string;
  name: string;
  location: ParkingLocation;
  address: string;
  description?: string;
  pricePerHour?: number;
  isActive: boolean;
  avtImage: string;
  zones: ParkingZone[];
  createdAt?: string;
  updatedAt?: string;
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export const DEFAULT_RADIUS_KM = 3;

export const CITY_CENTERS: Record<string, [number, number]> = {
  "Hồ Chí Minh": [10.762622, 106.660172],
  "Hà Nội": [21.028511, 105.804817],
  "Đà Nẵng": [16.054407, 108.202167],
  "Biên Hòa": [10.957413, 106.842687],
  "Nha Trang": [12.238791, 109.196749],
  "Huế": [16.463713, 107.590866],
  "Cần Thơ": [10.045162, 105.746857],
  "Vũng Tàu": [10.34599, 107.08426],
  "Hải Phòng": [20.844911, 106.688087],
};
