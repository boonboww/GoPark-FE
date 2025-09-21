"use client";

import { Building2 } from "lucide-react";
import CombinedParkingManagement from "@/components/VehicleManagement";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";
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
  const [tab, setTab] = useState("parking");
  const [subTab, setSubTab] = useState("checkin");

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
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="parking">Quản lý bãi đỗ</TabsTrigger>
          <TabsTrigger value="checkinout">Quản lý Checkin/Checkout</TabsTrigger>
        </TabsList>
        <TabsContent value="parking">
          <CombinedParkingManagement
            vehicles={vehicleList}
            setVehicles={setVehicleList}
            customers={customerList}
            parkingLots={parkingLots}
            setParkingLots={setParkingLots}
          />
        </TabsContent>
        <TabsContent value="checkinout">
          <Card className="shadow-sm border">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Quản lý Checkin/Checkout</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={subTab} onValueChange={setSubTab} className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="checkin">Checkin</TabsTrigger>
                  <TabsTrigger value="checkout">Checkout</TabsTrigger>
                </TabsList>
                <TabsContent value="checkin">
                  {/* Tra cứu thời gian checkin */}
                  <div className="mb-4 flex gap-2 items-center">
                    <label className="text-sm font-medium text-gray-700">Chọn ngày checkin:</label>
                    <input
                      type="date"
                      className="border rounded px-2 py-1 text-sm"
                      value={''}
                      onChange={() => {}}
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* TODO: Render danh sách hình ảnh và thông tin checkin theo ngày đã chọn */}
                    <div className="border rounded-lg p-3 flex flex-col items-center">
                      <img src="/" alt="Checkin" className="w-24 h-24 object-cover mb-2" />
                      <div className="text-sm font-semibold">Biển số: 51H-12345</div>
                      <div className="text-xs text-gray-600">Thời gian: 08:00 21/09/2025</div>
                    </div>
                    {/* ...Thêm các item khác... */}
                  </div>
                </TabsContent>
                <TabsContent value="checkout">
                  {/* Tra cứu thời gian checkout */}
                  <div className="mb-4 flex gap-2 items-center">
                    <label className="text-sm font-medium text-gray-700">Chọn ngày checkout:</label>
                    <input
                      type="date"
                      className="border rounded px-2 py-1 text-sm"
                      value={''}
                      onChange={() => {}}
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* TODO: Render danh sách hình ảnh và thông tin checkout theo ngày đã chọn */}
                    <div className="border rounded-lg p-3 flex flex-col items-center">
                      <img src="/checkout.png" alt="Checkout" className="w-24 h-24 object-cover mb-2" />
                      <div className="text-sm font-semibold">Biển số: 51H-67890</div>
                      <div className="text-xs text-gray-600">Thời gian: 09:30 21/09/2025</div>
                    </div>
                    {/* ...Thêm các item khác... */}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
