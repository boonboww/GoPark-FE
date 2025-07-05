export interface ParkingZone {
  zone: string;
  count: number;
  _id: string;
}

export interface ParkingLocation {
  type: string;
  coordinates: [number, number];
}

export interface Parking {
  _id: string;
  name: string;
  location: ParkingLocation;
  address: string;
  description?: string;
  pricePerHour: number;
  isActive: boolean;
  avtImage: string;
  zones: ParkingZone[];
  createdAt?: string;
  updatedAt?: string;
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
export const DEFAULT_RADIUS_KM = 3;

export const CITY_CENTERS: Record<string, [number, number]> = {
  "hồ chí minh": [10.762622, 106.660172],
  "hà nội": [21.028511, 105.804817],
  "đà nẵng": [16.054407, 108.202167],
  "biên hòa": [10.957413, 106.842687],
  "nha trang": [12.238791, 109.196749],
  "huế": [16.463713, 107.590866],
  "cần thơ": [10.045162, 105.746857],
};