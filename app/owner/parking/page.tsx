"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import CombinedParkingManagement from "@/components/VehicleManagement";
import type { Customer, Vehicle, ParkingLot } from "@/app/owner/types";

const initialData = {
  customers: [
    {
      id: "u001",
      userName: "Nguyen Van A",
      email: "nva@example.com",
      phoneNumber: "0901234567",
    },
    {
      id: "u002",
      userName: "Tran Thi B",
      email: "ttb@example.com",
      phoneNumber: "0909876543",
    },
  ] satisfies Customer[],

  vehicles: [
    {
      id: "V1",
      licensePlate: "51H-12345",
      type: "Car",
      owner: "Nguyen Van A",
      status: "Parked",
    },
    {
      id: "V2",
      licensePlate: "51H-67890",
      type: "Car",
      owner: "Nguyen Van A",
      status: "Not Parked",
    },
    {
      id: "V3",
      licensePlate: "51G-54321",
      type: "Motorbike",
      owner: "Tran Thi B",
      status: "Parked",
    },
  ] satisfies Vehicle[],
};

export default function ParkingPage() {
  const [customerList] = useState<Customer[]>(initialData.customers);
  const [vehicleList, setVehicleList] = useState<Vehicle[]>(initialData.vehicles);
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="w-8 h-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý bãi đỗ</h1>
          <p className="text-gray-600 mt-2">
            Theo dõi và quản lý chỗ đậu xe trong thời gian thực
          </p>
        </div>
      </div>
      <CombinedParkingManagement
        vehicles={vehicleList}
        setVehicles={setVehicleList}
        customers={customerList}
        parkingLots={parkingLots}
        setParkingLots={setParkingLots}
      />
    </div>
  );
}
