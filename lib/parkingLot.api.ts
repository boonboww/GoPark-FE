import API from "./api";
import type { ParkingLot } from "@/app/owner/types";

// Type dùng để tạo/patch (loại bỏ các field không cần gửi)
export type ParkingLotPayload = Omit<ParkingLot, "_id" | "isActive" | "createdAt" | "updatedAt" | "parkingOwner">;

export const fetchMyParkingLots = () =>
  API.get<{ data: ParkingLot[] }>("/api/v1/parkinglots/my-parkinglots");

export const createParkingLot = (data: ParkingLotPayload) =>
  API.post<ParkingLot>("/api/v1/parkinglots", data);

export const updateParkingLot = (id: string, data: Partial<ParkingLotPayload>) =>
  API.patch<ParkingLot>(`/api/v1/parkinglots/${id}`, data);

export const softDeleteParkingLot = (id: string) =>
  API.patch(`/api/v1/parkinglots/${id}/soft-delete`);

export const deleteParkingLot = (id: string) =>
  API.delete(`/api/v1/parkinglots/${id}`);
