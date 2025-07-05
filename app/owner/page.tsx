"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CustomerManagement, { Customer } from "@/components/CustomerManagement";
import VehicleManagement from "@/components/VehicleManagement";
import TicketManagement from "@/components/TicketManagement";
import ParkingLotManagement from "@/components/ParkingLotManagement";
import AccountManagement from "@/components/AccountManagement";

// Type definitions
interface Vehicle {
  id: string;
  licensePlate: string;
  type: string;
  owner: string;
  status: "Parked" | "Not Parked";
}

interface Ticket {
  id: string;
  licensePlate: string;
  customer: string;
  type: "Daily" | "Monthly" | "Annual";
  price: number;
  floor: string;
  expiry: string;
}

interface ParkingLot {
  id: string;
  name: string;
  address: string;
  capacity: number;
  pricePerHour: number;
}

interface Account {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: "owner" | "staff";
}

// Sample data
const initialData = {
  customers: [
    {
      id: "C1",
      fullName: "Nguyen Van A",
      idNumber: "123456789",
      dateOfBirth: "1990-01-01",
      gender: "Male",
      email: "nva@example.com",
      phoneNumber: "0901234567",
      address: "123 Lang Street, Hanoi",
      vehicles: ["51H-12345", "51H-67890"],
    },
    {
      id: "C2",
      fullName: "Tran Thi B",
      idNumber: "987654321",
      dateOfBirth: "1995-05-15",
      gender: "Female",
      email: "ttb@example.com",
      phoneNumber: "0909876543",
      address: "456 Cau Giay, Hanoi",
      vehicles: ["51G-54321"],
    },
  ],
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
  ],
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
  ],
  parkingLots: [
    {
      id: "P1",
      name: "Central Parking",
      address: "123 Lang Street, Hanoi",
      capacity: 100,
      pricePerHour: 20000,
    },
    {
      id: "P2",
      name: "Cau Giay Parking",
      address: "456 Cau Giay, Hanoi",
      capacity: 50,
      pricePerHour: 15000,
    },
  ],
  account: {
    id: "A1",
    name: "Owner Name",
    email: "owner@example.com",
    phone: "0901234567",
    role: "owner",
  },
};

export default function OwnerDashboard() {
  const [customerList, setCustomerList] = useState<Customer[]>(
    initialData.customers
  );

  const [vehicleList, setVehicleList] = useState<Vehicle[]>(
    initialData.vehicles.map((v) => ({
      ...v,
      status: v.status as "Parked" | "Not Parked",
    }))
  );

  const [ticketList, setTicketList] = useState<Ticket[]>(
    initialData.tickets.map((t) => ({
      ...t,
      type: t.type as "Daily" | "Monthly" | "Annual",
    }))
  );

  const [parkingLotList, setParkingLotList] = useState<ParkingLot[]>(
    initialData.parkingLots
  );

  const [account, setAccount] = useState<Account>({
    ...initialData.account,
    role: initialData.account.role as "owner" | "staff",
  });

  const ticketManagementData = {
    vehicles: vehicleList.map((v) => ({
      id: v.id,
      licensePlate: v.licensePlate,
    })),
    customers: customerList.map((c) => ({ id: c.id, name: c.fullName })),
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Parking Management System
          </h1>
          <p className="text-sm text-gray-500">Welcome back, {account.name}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => alert("Logged out")}
          className="hover:bg-gray-100"
        >
          Log Out
        </Button>
      </header>

      <Tabs defaultValue="customers" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="parkingLots">Parking Lots</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="customers">
            <CustomerManagement
              customers={customerList}
              setCustomers={setCustomerList}
            />
          </TabsContent>

          <TabsContent value="vehicles">
            <VehicleManagement
              vehicles={vehicleList}
              setVehicles={setVehicleList}
              customers={customerList}
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

          <TabsContent value="parkingLots">
            <ParkingLotManagement
              parkingLots={parkingLotList}
              setParkingLots={setParkingLotList}
            />
          </TabsContent>

          <TabsContent value="account">
            <AccountManagement account={account} setAccount={setAccount} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
