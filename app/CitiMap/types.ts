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

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export const DEFAULT_RADIUS_KM = 3;

export const CITY_CENTERS: Record<string, [number, number]> = {
  "ho chi minh": [10.762622, 106.660172],
  "ha noi": [21.028511, 105.804817],
  "da nang": [16.054407, 108.202167],
  "bien hoa": [10.957413, 106.842687],
  "nha trang": [12.238791, 109.196749],
  "hue": [16.463713, 107.590866],
  "can tho": [10.045162, 105.746857],
};
