"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CustomerManagement from "@/components/CustomerManagement";
import CombinedParkingManagement from "@/components/VehicleManagement"; // Thay VehicleManagement
import TicketManagement from "@/components/TicketManagement";
import AccountManagement from "@/components/AccountManagement";
import type { Customer, Vehicle, Ticket, ParkingLot } from "@/app/owner/types";
import API from "@/lib/api";

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

  tickets: [
    {
      id: "T001",
      licensePlate: "51H-12345",
      customer: "Nguyen Van A",
      type: "Daily",
      price: 50000,
      floor: "1",
      expiry: "2025-07-02",
    },
    {
      id: "T002",
      licensePlate: "51G-54321",
      customer: "Tran Thi B",
      type: "Monthly",
      price: 1000000,
      floor: "2",
      expiry: "2025-07-30",
    },
  ] satisfies Ticket[],
};

export default function OwnerDashboard() {
  const router = useRouter();

  const [customerList, setCustomerList] = useState<Customer[]>(initialData.customers);
  const [vehicleList, setVehicleList] = useState<Vehicle[]>(initialData.vehicles);
  const [ticketList, setTicketList] = useState<Ticket[]>(initialData.tickets);
  const [accountName, setAccountName] = useState<string>("");
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]); // Thêm state cho parkingLots

  useEffect(() => {
    const fetchAccountName = async () => {
      try {
        const res = await API.get("/api/v1/users/me");
        setAccountName(res.data.userName || "User");
      } catch (err) {
        console.error("❌ Failed to fetch account info", err);
      }
    };
    fetchAccountName();
  }, []);

  const ticketManagementData = {
    vehicles: vehicleList.map((v) => ({
      id: v.id,
      licensePlate: v.licensePlate,
    })),
    customers: customerList.map((c) => ({
      id: c.id,
      name: c.userName,
    })),
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/account/login");
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hệ thống quản lý bãi đỗ xe
          </h1>
          <p className="text-sm text-gray-500">
            Chào mừng trở lại, {accountName}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="hover:bg-gray-100"
        >
          Đăng xuất
        </Button>
      </header>

      <Tabs defaultValue="customers" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="customers">Khách hàng</TabsTrigger>
          <TabsTrigger value="vehicles">Quản lý bãi đỗ</TabsTrigger>
          <TabsTrigger value="tickets">Vé</TabsTrigger>
          <TabsTrigger value="account">Tài khoản</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="customers">
            <CustomerManagement
              customers={customerList}
              setCustomers={setCustomerList}
            />
          </TabsContent>

          <TabsContent value="vehicles">
            <CombinedParkingManagement                                                                                                                                                                                 
              vehicles={vehicleList}
              setVehicles={setVehicleList}
              customers={customerList}
              parkingLots={parkingLots}
              setParkingLots={setParkingLots}
            />
          </TabsContent>                          
                                                                                                                                                                                                                                                        
          <TabsContent value="tickets">
            <TicketManagement
              tickets={ticketList}
              setTickets={setTicketList}
              vehicles={ticketManagementData.vehicles}
              customers={ticketManagementData.customers}
            />
          </TabsContent>

          <TabsContent value="account">
            <AccountManagement />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}