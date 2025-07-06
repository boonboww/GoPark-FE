"use client";

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
import { useState } from "react";

interface Vehicle {
  id: string;
  licensePlate: string;
  type: string;
  owner: string;
  status: "Parked" | "Reserved" | "Available";
  plateImage?: string;
}

interface ParkingSlot {
  number: number;
  status: "available" | "occupied" | "reserved";
  vehicle?: Vehicle;
}

interface Floor {
  number: number;
  slots: ParkingSlot[];
}

interface VehicleManagementProps {
  vehicles: Vehicle[];
}

export default function VehicleManagement({ vehicles }: VehicleManagementProps) {
  const [selectedFloor, setSelectedFloor] = useState<number>(1);

  // ✅ Khởi tạo: Tất cả available, chỉ một số reserved
  const [parkingFloors, setParkingFloors] = useState<Floor[]>(() => [
    {
      number: 1,
      slots: Array.from({ length: 20 }, (_, i) => {
        const isReserved = Math.random() < 0.3; // 30% reserved, 70% available
        return {
          number: i + 1,
          status: isReserved ? "reserved" : "available",
          vehicle: undefined,
        };
      }),
    },
    {
      number: 2,
      slots: Array.from({ length: 20 }, (_, i) => {
        const isReserved = Math.random() < 0.3; // 30% reserved
        return {
          number: i + 1,
          status: isReserved ? "reserved" : "available",
          vehicle: undefined,
        };
      }),
    },
  ]);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const currentFloor =
    parkingFloors.find((floor) => floor.number === selectedFloor) || parkingFloors[0];

  // ✅ Danh sách xe đỗ (tính từ slots occupied)
  const parkedVehicles = parkingFloors
    .flatMap((floor) => floor.slots)
    .filter((slot) => slot.status === "occupied" && slot.vehicle)
    .map((slot) => slot.vehicle!);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "occupied":
        return "bg-red-500";
      case "reserved":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleSlotClick = (slot: ParkingSlot) => {
    if (slot.status === "occupied" && slot.vehicle) {
      setSelectedVehicle(slot.vehicle);
      setSelectedSlot(slot);
      generateQRCode(slot.vehicle.id);
      setShowModal(true);
    } else if (slot.status === "reserved") {
      const reservedVehicle: Vehicle = {
        id: `RES-${slot.number}`,
        licensePlate: `72A-${1000 + slot.number}`,
        type: "Car",
        owner: `Nguyễn Văn ${slot.number}`,
        status: "Reserved",
      };
      setSelectedVehicle(reservedVehicle);
      setSelectedSlot(slot);
      generateQRCode(reservedVehicle.id);
      setShowModal(true);
    }
  };

  const generateQRCode = (id: string) => {
    const fakeQR = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${id}-${Date.now()}`;
    setQrCodeUrl(fakeQR);
  };

  const handleConfirm = () => {
    if (selectedSlot && selectedVehicle) {
      setParkingFloors((prevFloors) =>
        prevFloors.map((floor) => {
          if (floor.number !== selectedFloor) return floor;
          return {
            ...floor,
            slots: floor.slots.map((s) => {
              if (s.number === selectedSlot.number) {
                return {
                  ...s,
                  status: "occupied",
                  vehicle: {
                    ...selectedVehicle,
                    status: "Parked",
                    plateImage: `/bienso.png`,
                  },
                };
              }
              return s;
            }),
          };
        })
      );
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Parking Slots</CardTitle>
              <CardDescription>View and manage parking slots</CardDescription>
            </div>
            <Select
              value={selectedFloor.toString()}
              onValueChange={(value) => setSelectedFloor(parseInt(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select floor" />
              </SelectTrigger>
              <SelectContent>
                {parkingFloors.map((floor) => (
                  <SelectItem key={floor.number} value={floor.number.toString()}>
                    Floor {floor.number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {currentFloor.slots.map((slot) => (
              <div
                key={slot.number}
                onClick={() => handleSlotClick(slot)}
                className={`p-4 rounded-lg text-white text-center ${getStatusColor(
                  slot.status
                )} h-24 flex flex-col justify-center items-center cursor-pointer`}
                title={`Slot ${slot.number} - ${slot.status}`}
              >
                <div className="font-bold">{slot.number}</div>
                {slot.status === "occupied" && slot.vehicle && (
                  <div className="text-xs mt-1 truncate w-full">
                    {slot.vehicle.licensePlate}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span>Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>Occupied</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {parkedVehicles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Parked Vehicles</CardTitle>
            <CardDescription>Danh sách xe đã đỗ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-2 border">ID</th>
                    <th className="px-4 py-2 border">Owner</th>
                    <th className="px-4 py-2 border">License Plate</th>
                    <th className="px-4 py-2 border">Type</th>
                    <th className="px-4 py-2 border">Image</th>
                  </tr>
                </thead>
                <tbody>
                  {parkedVehicles.map((v) => (
                    <tr key={v.id} className="border-t">
                      <td className="px-4 py-2 border">{v.id}</td>
                      <td className="px-4 py-2 border">{v.owner}</td>
                      <td className="px-4 py-2 border">{v.licensePlate}</td>
                      <td className="px-4 py-2 border">{v.type}</td>
                      <td className="px-4 py-2 border">
                        {v.plateImage && (
                          <img src={v.plateImage} alt="Plate" className="w-20 rounded" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {showModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-2">Vehicle Details</h2>
            <div className="mb-2">
              <strong>Ticket ID:</strong> {selectedVehicle.id}
            </div>
            <div className="mb-2">
              <strong>Owner:</strong> {selectedVehicle.owner}
            </div>
            <div className="mb-2">
              <strong>License Plate:</strong> {selectedVehicle.licensePlate}
            </div>
            <div className="mb-4 flex gap-4 items-start">
              {selectedVehicle.plateImage && (
                <div className="flex-1">
                  <strong>Plate Image:</strong>
                  <img
                    src={selectedVehicle.plateImage}
                    alt="Plate"
                    className="mt-1 w-full max-w-[120px] rounded shadow"
                  />
                </div>
              )}
              <div className="flex-1">
                <strong>QR Code:</strong>
                <div className="mt-2">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="w-full max-w-[150px]"
                    />
                  ) : (
                    <span>Loading QR Code...</span>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-2">
              <strong>
                {selectedSlot?.status === "reserved"
                  ? "Booking Time"
                  : "Check-in Time"}
                :
              </strong>{" "}
              2025-07-05 09:00
            </div>
            {selectedSlot?.status === "reserved" && (
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Xác nhận
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
