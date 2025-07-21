/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  fetchMyParkingLots,
  deleteParkingLot,
  fetchParkingLotDetails,
  updateSlotStatus,
  fetchSlotBookings,
} from "@/lib/parkingLot.api";
import type {
  ParkingLot,
  Vehicle,
  Floor,
  ParkingSlot,
  Customer,
} from "@/app/owner/types";
import AddParkingLotDialog from "@/components/AddParkingLotDialog";
import EditParkingLotDialog from "@/components/EditParkingLotDialog";
import SelectParkingLotDropdown from "@/components/SelectParkingLotDropdown";
import { AxiosError } from "axios";

interface ParkingLotDetailsResponse {
  data: {
    data: {
      data: ParkingSlot[];
    };
  };
}

interface Booking {
  _id: string;
  userId: { name: string; email: string } | null;
  vehicleNumber: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface CombinedParkingManagementProps {
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  customers: Customer[];
  parkingLots: ParkingLot[];
  setParkingLots: React.Dispatch<React.SetStateAction<ParkingLot[]>>;
}

export default function CombinedParkingManagement({
  vehicles,
  setVehicles,
  customers: _customers,
  parkingLots,
  setParkingLots,
}: CombinedParkingManagementProps) {
  const [selectedLotId, setSelectedLotId] = useState<string>("");
  const [newLotDialogOpen, setNewLotDialogOpen] = useState(false);
  const [editLotDialogOpen, setEditLotDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [parkingFloors, setParkingFloors] = useState<Floor[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slotBookings, setSlotBookings] = useState<Booking[]>([]);

  const selectedLot = parkingLots.find((lot) => lot._id === selectedLotId);
  const currentFloor =
    parkingFloors.find((floor) => floor.number === selectedFloor) ||
    parkingFloors[0];
  const parkedVehicles = parkingFloors
    .flatMap((floor) => floor.slots)
    .filter((slot) => slot.status === "booked" && slot.vehicle)
    .map((slot) => slot.vehicle!);

  useEffect(() => {
    if (parkedVehicles.length > 0) {
      setVehicles((prev) => {
        const updatedVehicles = [...prev];
        parkedVehicles.forEach((pv) => {
          const index = updatedVehicles.findIndex((v) => v.id === pv.id);
          if (index !== -1) {
            updatedVehicles[index] = { ...pv, status: "Parked" };
          } else {
            updatedVehicles.push({ ...pv, status: "Parked" });
          }
        });
        return updatedVehicles;
      });
    }
  }, [parkedVehicles, setVehicles]);

  const loadParkingLots = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchMyParkingLots();
      setParkingLots(res.data.data);
      if (res.data.data.length > 0 && !selectedLotId) {
        setSelectedLotId(res.data.data[0]._id);
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage = err.response?.data?.message || err.message;
      if (err.response?.status === 403) {
        setError(
          `Không có quyền truy cập danh sách bãi đỗ: ${errorMessage}. Vui lòng kiểm tra vai trò tài khoản.`
        );
        "!".toUpperCase();
      } else if (err.response?.status === 401) {
        setError(
          `Token không hợp lệ: ${errorMessage}. Vui lòng kiểm tra đăng nhập.`
        );
      } else {
        setError(`Lỗi khi tải danh sách bãi đỗ: ${errorMessage}`);
      }
      toast.error(errorMessage);
      console.error("Error fetching parking lots:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadParkingLotDetails = async (lotId: string, date?: string) => {
    setIsLoading(true);
    try {
      const startTime = date
        ? new Date(date).toISOString()
        : new Date().toISOString();
      const endTime = date
        ? new Date(new Date(date).setHours(23, 59, 59, 999)).toISOString()
        : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const slotRes = (await fetchParkingLotDetails(
        lotId,
        startTime,
        endTime
      )) as unknown as ParkingLotDetailsResponse;
      const slots: ParkingSlot[] = slotRes.data?.data?.data ?? [];

      const selectedLot = parkingLots.find((lot) => lot._id === lotId);
      const zones = selectedLot?.zones ?? [];

      const zonesMap: { [key: string]: ParkingSlot[] } = {};
      if (Array.isArray(slots)) {
        slots.forEach((slot: ParkingSlot) => {
          const zoneName = slot.zone || "Default";
          if (!zonesMap[zoneName]) zonesMap[zoneName] = [];
          zonesMap[zoneName].push(slot);
        });
      }

      const floors: Floor[] = zones.map((zone, index) => ({
        number: index + 1,
        name: zone.zone,
        slots: zonesMap[zone.zone] || [],
      }));

      setParkingFloors(
        floors.length > 0
          ? floors
          : [
              {
                number: 1,
                name: "Default",
                slots: [],
              },
            ]
      );
      setSelectedFloor(floors[0]?.number || 1);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(`Lỗi khi tải danh sách chỗ đỗ: ${errorMessage}`);
      console.error("Error fetching parking lot details:", error);
      setParkingFloors([
        {
          number: 1,
          name: "Default",
          slots: [],
        },
      ]);
      setSelectedFloor(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadParkingLots();
  }, []);

  useEffect(() => {
    if (selectedLotId) {
      loadParkingLotDetails(selectedLotId, selectedDate);
    }
  }, [selectedLotId, selectedDate, parkingLots]);

  const handleDeleteParkingLot = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteParkingLot(id);
      toast.success("Xóa bãi đỗ thành công");
      await loadParkingLots();
      setEditLotDialogOpen(false);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage = err.response?.data?.message || err.message;
      if (err.response?.status === 403) {
        toast.error(`Không có quyền xóa bãi đỗ: ${errorMessage}`);
      } else {
        toast.error(`Lỗi khi xóa bãi đỗ: ${errorMessage}`);
      }
      console.error("Error deleting parking lot:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-400";
      case "booked":
      case "reserved":
        return "bg-red-400";
      default:
        return "bg-gray-500";
    }
  };

  const fetchSlotBookingsLocal = async (
    slotId: string,
    startTime: string,
    endTime: string
  ) => {
    try {
      const response = await fetchSlotBookings(slotId, startTime, endTime);
      console.log("Fetched bookings:", response.data);
      setSlotBookings(response.data.data || []);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(`Lỗi khi tải danh sách booking: ${errorMessage}`);
      console.error("Error fetching slot bookings:", error);
      setSlotBookings([]);
    }
  };

  const handleSlotClick = (slot: ParkingSlot) => {
    setSelectedSlot(slot);
    setSlotBookings([]);
    const startTime = selectedDate
      ? new Date(selectedDate).toISOString()
      : new Date().toISOString();
    const endTime = selectedDate
      ? new Date(new Date(selectedDate).setHours(23, 59, 59, 999)).toISOString()
      : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    if (slot.status === "booked" || slot.status === "reserved") {
      setSelectedVehicle(slot.vehicle || null);
      generateQRCode(slot.vehicle?.id || `RES-${slot.slotNumber}`);
      fetchSlotBookingsLocal(slot._id, startTime, endTime);
    } else {
      setSelectedVehicle(null);
      setQrCodeUrl(null);
      fetchSlotBookingsLocal(slot._id, startTime, endTime);
    }
    setShowModal(true);
  };

  const generateQRCode = (id: string) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${id}-${Date.now()}`;
    setQrCodeUrl(qrUrl);
  };

  const handleConfirm = async () => {
    if (selectedSlot && selectedVehicle && selectedLotId) {
      setIsLoading(true);
      try {
        await updateSlotStatus(selectedLotId, selectedSlot._id, {
          status: "booked",
          vehicle: {
            ...selectedVehicle,
            status: "Parked",
            plateImage: selectedVehicle.plateImage || `/bienso.png`,
          },
        });
        toast.success("Xác nhận đỗ xe thành công");
        await loadParkingLotDetails(selectedLotId, selectedDate);
        setShowModal(false);
        setVehicles((prev) => {
          const index = prev.findIndex((v) => v.id === selectedVehicle.id);
          if (index !== -1) {
            return [
              ...prev.slice(0, index),
              { ...selectedVehicle, status: "Parked" },
              ...prev.slice(index + 1),
            ];
          }
          return [...prev, { ...selectedVehicle, status: "Parked" }];
        });
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        const errorMessage = err.response?.data?.message || err.message;
        if (err.response?.status === 403) {
          toast.error(
            `Không có quyền cập nhật trạng thái chỗ đỗ: ${errorMessage}`
          );
        } else {
          toast.error(`Lỗi khi xác nhận đỗ xe: ${errorMessage}`);
        }
        console.error("Error updating slot status:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (error) {
    return (
      <Card className="shadow-xl rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Lỗi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">{error}</div>
          <div className="mt-4 flex justify-center">
            <Button
              onClick={loadParkingLots}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Thử lại
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl rounded-2xl bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Quản Lý Bãi Đỗ Xe</CardTitle>
        <CardDescription className="text-gray-500">
          Quản lý thông tin bãi đỗ xe và các chỗ đậu xe
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoading && (
          <div className="text-center text-gray-500">Đang tải...</div>
        )}

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between flex-wrap">
          {/* Dropdown chọn bãi */}
          <div className="w-full md:w-[300px]">
            <SelectParkingLotDropdown
              parkingLots={parkingLots}
              selectedLotId={selectedLotId}
              onSelect={setSelectedLotId}
            />
          </div>

          {/* Ngày và nút reset */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <label className="text-sm font-medium whitespace-nowrap">
              Ngày:
            </label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-10 text-sm w-[140px]"
              placeholder="Chọn ngày"
            />
            <Button
              onClick={() => setSelectedDate("")}
              className="h-10 px-4 bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Reset
            </Button>
          </div>

          {/* Nút Add + Edit */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <AddParkingLotDialog
              open={newLotDialogOpen}
              onOpenChange={setNewLotDialogOpen}
              onCreated={loadParkingLots}
            />
            <EditParkingLotDialog
              open={editLotDialogOpen}
              onOpenChange={setEditLotDialogOpen}
              selectedLot={selectedLot}
              onUpdate={loadParkingLots}
              onDelete={handleDeleteParkingLot}
              setParkingLots={setParkingLots}
            />
          </div>
        </div>

        {parkingFloors.length > 0 && currentFloor?.slots.length > 0 ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Chỗ Đậu Xe - Khu vực {currentFloor.name}
              </h3>
              <Select
                value={selectedFloor.toString()}
                onValueChange={(value) => setSelectedFloor(parseInt(value))}
                disabled={parkingFloors.length === 0}
              >
                <SelectTrigger className="w-[180px]" aria-label="Chọn khu vực">
                  <SelectValue placeholder="Chọn khu vực" />
                </SelectTrigger>
                <SelectContent>
                  {parkingFloors.map((floor) => (
                    <SelectItem
                      key={floor.number}
                      value={floor.number.toString()}
                    >
                      {floor.name || `Khu vực ${floor.number}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-8 gap-4">
              {currentFloor.slots
                .sort((a, b) => parseInt(a.slotNumber.replace(/^\D+/g, '')) - parseInt(b.slotNumber.replace(/^\D+/g, '')))
                .map((slot) => {
                  const selected =
                    selectedSlot?._id === slot._id ? "ring-2 ring-black" : "";
                  return (
                    <button
                      key={slot._id}
                      onClick={() => handleSlotClick(slot)}
                      className={`text-xs text-white flex items-center justify-center h-16 rounded ${getStatusColor(
                        slot.status
                      )} ${selected}`}
                      title={`Slot ${slot.slotNumber} - ${slot.status}`}
                    >
                      {slot.slotNumber}
                    </button>
                  );
                })}
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm">Còn trống</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span className="text-sm">Đã đặt trước/Đang sử dụng</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            Không có dữ liệu chỗ đỗ cho khu vực này.
          </div>
        )}

        {parkedVehicles.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Xe Đang Đậu</h3>
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr className="text-left">
                      <th className="px-4 py-2 font-medium">ID</th>
                      <th className="px-4 py-2 font-medium">Chủ xe</th>
                      <th className="px-4 py-2 font-medium">Biển số</th>
                      <th className="px-4 py-2 font-medium">Loại xe</th>
                      <th className="px-4 py-2 font-medium">Hình ảnh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {parkedVehicles.map((v) => (
                      <tr key={v.id}>
                        <td className="px-4 py-2">{v.id}</td>
                        <td className="px-4 py-2">{v.owner}</td>
                        <td className="px-4 py-2">{v.licensePlate}</td>
                        <td className="px-4 py-2">{v.type}</td>
                        <td className="px-4 py-2">
                          {v.plateImage && (
                            <img
                              src={v.plateImage}
                              alt="Biển số"
                              className="w-16 h-10 object-cover rounded"
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {showModal && selectedSlot && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[90%] max-w-md relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
              <h2 className="text-xl font-bold mb-4">
                Chi Tiết Slot {selectedSlot.slotNumber}
              </h2>

              <div className="space-y-3">
                {selectedSlot.status === "available" ? (
                  <p className="text-sm text-gray-500">
                    Chỗ đỗ này chưa được đặt trong ngày này.
                  </p>
                ) : (
                  <>
                    {selectedVehicle && (
                      <>
                        <div>
                          <p className="text-sm text-gray-500">Mã vé</p>
                          <p className="font-medium">{selectedVehicle.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Chủ xe</p>
                          <p className="font-medium">{selectedVehicle.owner}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Biển số</p>
                          <p className="font-medium">
                            {selectedVehicle.licensePlate}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          {selectedVehicle.plateImage && (
                            <div>
                              <p className="text-sm text-gray-500">
                                Hình biển số
                              </p>
                              <img
                                src={selectedVehicle.plateImage}
                                alt="Biển số"
                                className="mt-1 w-full rounded border"
                              />
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-gray-500">Mã QR</p>
                            <div className="mt-1 border rounded p-1 flex justify-center">
                              {qrCodeUrl ? (
                                <img
                                  src={qrCodeUrl}
                                  alt="Mã QR"
                                  className="w-24 h-24"
                                />
                              ) : (
                                <span>Đang tải...</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Danh sách đặt chỗ</p>
                      {slotBookings.length > 0 ? (
                        <div className="mt-2 space-y-2">
                          {slotBookings.map((booking) => (
                            <div
                              key={booking._id}
                              className="border p-2 rounded"
                            >
                              <p>
                                <strong>Biển số:</strong>{" "}
                                {booking.vehicleNumber}
                              </p>
                              <p>
                                <strong>Thời gian bắt đầu:</strong>{" "}
                                {new Date(booking.startTime).toLocaleString()}
                              </p>
                              <p>
                                <strong>Thời gian kết thúc:</strong>{" "}
                                {new Date(booking.endTime).toLocaleString()}
                              </p>
                              <p>
                                <strong>Trạng thái:</strong> {booking.status}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm">
                          Không có đặt chỗ nào trong khoảng thời gian này.
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}