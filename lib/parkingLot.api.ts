import API from "./api"; // Import API từ api.ts
import type { ParkingLot, ParkingSlot } from "@/app/owner/types";

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

export const fetchParkingLotDetails = async (id: string, startTime: string, endTime: string) => {
  try {
    const response = await API.get<{
      message: string;
      status: string;
      data: { data: ParkingSlot[] };
    }>(`/api/v1/parking-slots/by-date/${id}?startTime=${startTime}&endTime=${endTime}`, {
      headers: { "Cache-Control": "no-cache" },
    });
    console.log('fetchParkingLotDetails response:', response.data);
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Lỗi khi lấy danh sách slot');
    }
    return response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error in fetchParkingLotDetails:', error);
    throw error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateSlotStatus = (lotId: string, slotId: string, data: { status: string; vehicle?: any }) =>
  API.patch(`/api/v1/parking-slots/${slotId}`, data);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createParkingSlot = async (data: any) => {
  return API.post(`/api/v1/parkinglots/${data.parkingLot}/slots`, data);
};

// Thêm hàm để lấy bookings của một slot
export const fetchSlotBookings = (slotId: string, startTime: string, endTime: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  API.get<{ status: string; results: number; data: any[] }>(
    `/api/v1/parking-slots/${slotId}/bookings?startTime=${startTime}&endTime=${endTime}`,
    {
      headers: { "Cache-Control": "no-cache" },
    }
  );