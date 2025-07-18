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
import type {
  ParkingLot,
  Vehicle,
  Floor,
  ParkingSlot,
  Customer,
} from "@/app/owner/types";
import { fetchMyParkingLots, deleteParkingLot, fetchParkingLotDetails, updateSlotStatus } from "@/lib/parkingLot.api";
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
  customers: _customers, // Đánh dấu unused prop
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

  const selectedLot = parkingLots.find((lot) => lot._id === selectedLotId);
  const currentFloor =
    parkingFloors.find((floor) => floor.number === selectedFloor) ||
    parkingFloors[0];
  const parkedVehicles = parkingFloors
    .flatMap((floor) => floor.slots)
    .filter((slot) => slot.status === "booked" && slot.vehicle)
    .map((slot) => slot.vehicle!);

  // Đồng bộ vehicles với parkedVehicles
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
        setError(`Không có quyền truy cập danh sách bãi đỗ: ${errorMessage}. Vui lòng kiểm tra vai trò tài khoản.`);
      } else if (err.response?.status === 401) {
        setError(`Token không hợp lệ: ${errorMessage}. Vui lòng kiểm tra đăng nhập.`);
      } else {
        setError(`Lỗi khi tải danh sách bãi đỗ: ${errorMessage}`);
      }
      toast.error(errorMessage);
      console.error("Error fetching parking lots:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadParkingLotDetails = async (lotId: string) => {
    setIsLoading(true);
    try {
      const slotRes = await fetchParkingLotDetails(lotId) as unknown as ParkingLotDetailsResponse;
      const slots: ParkingSlot[] = slotRes.data?.data?.data ?? [];
      console.log("Slots:", slots);

      // Sử dụng selectedLot từ state thay vì gọi lại API
      const selectedLot = parkingLots.find((lot) => lot._id === lotId);
      const zones = selectedLot?.zones ?? [];
      console.log("Zones:", zones);

      const zonesMap: { [key: string]: ParkingSlot[] } = {};
      if (Array.isArray(slots)) {
        slots.forEach((slot: ParkingSlot) => {
          const zoneName = slot.zone || "Default";
          if (!zonesMap[zoneName]) zonesMap[zoneName] = [];
          zonesMap[zoneName].push(slot);
        });
      } else {
        console.warn("Slots is not an array:", slots);
      }

      const floors: Floor[] = zones.map((zone, index) => ({
        number: index + 1,
        name: zone.zone,
        slots: zonesMap[zone.zone] || [],
      }));

      console.log("Floors:", floors);
      setParkingFloors(floors.length > 0 ? floors : [{
        number: 1,
        name: "Default",
        slots: [],
      }]);
      setSelectedFloor(floors[0]?.number || 1);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(`Lỗi khi tải danh sách chỗ đỗ: ${errorMessage}`);
      console.error("Error fetching parking lot details:", error);
      setParkingFloors([{
        number: 1,
        name: "Default",
        slots: [],
      }]);
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
      loadParkingLotDetails(selectedLotId);
    }
  }, [selectedLotId, parkingLots]);

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
        return "bg-green-500 hover:bg-green-600";
      case "booked":
        return "bg-red-500 hover:bg-red-600";
      case "reserved":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const handleSlotClick = (slot: ParkingSlot) => {
    if (slot.status === "booked" && slot.vehicle) {
      setSelectedVehicle(slot.vehicle);
      setSelectedSlot(slot);
      generateQRCode(slot.vehicle.id);
      setShowModal(true);
    } else if (slot.status === "reserved") {
      const reservedVehicle: Vehicle = {
        id: `RES-${slot.slotNumber}`,
        licensePlate: `72A-${1000 + parseInt(slot.slotNumber.split("-")[1])}`,
        type: "Car",
        owner: `Nguyễn Văn ${slot.slotNumber}`,
        status: "Reserved",
        plateImage: `/bienso.png`,
      };
      setSelectedVehicle(reservedVehicle);
      setSelectedSlot(slot);
      generateQRCode(reservedVehicle.id);
      setShowModal(true);
    }
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
        await loadParkingLotDetails(selectedLotId);
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
          toast.error(`Không có quyền cập nhật trạng thái chỗ đỗ: ${errorMessage}`);
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
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="w-full md:w-[300px]">
            <SelectParkingLotDropdown
              parkingLots={parkingLots}
              selectedLotId={selectedLotId}
              onSelect={setSelectedLotId}
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
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
              <h3 className="text-lg font-semibold">Chỗ Đậu Xe - Khu vực {currentFloor.name}</h3>
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

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {currentFloor.slots.map((slot) => (
                <div
                  key={slot._id}
                  onClick={() => handleSlotClick(slot)}
                  className={`p-3 rounded-lg text-white text-center ${getStatusColor(
                    slot.status
                  )} h-20 flex flex-col justify-center items-center cursor-pointer transition-colors duration-200`}
                  title={`Slot ${slot.slotNumber} - ${slot.status}`}
                >
                  <div className="font-bold text-sm md:text-base">{slot.slotNumber}</div>
                  {slot.status === "booked" && slot.vehicle && (
                    <div className="text-xs mt-1 truncate w-full">
                      {slot.vehicle.licensePlate}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Còn trống</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Đã đặt trước</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Đã sử dụng</span>
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

        {showModal && selectedVehicle && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[90%] max-w-md relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
              <h2 className="text-xl font-bold mb-4">Chi Tiết Xe</h2>
              
              <div className="space-y-3">
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
                  <p className="font-medium">{selectedVehicle.licensePlate}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  {selectedVehicle.plateImage && (
                    <div>
                      <p className="text-sm text-gray-500">Hình biển số</p>
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
                
                <div>
                  <p className="text-sm text-gray-500">
                    {selectedSlot?.status === "reserved"
                      ? "Thời gian đặt chỗ"
                      : "Thời gian nhận xe"}
                  </p>
                  <p className="font-medium">{new Date().toLocaleString()}</p>
                </div>
              </div>

              {selectedSlot?.status === "reserved" && (
                <button
                  onClick={handleConfirm}
                  className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  disabled={isLoading}
                >
                  Xác Nhận
                </button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}