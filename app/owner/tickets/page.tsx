"use client";

import { useState } from "react";
import { Ticket } from "lucide-react";
import TicketManagement from "@/components/TicketManagement";
import type { Ticket as TicketType } from "@/app/owner/types";

const initialTickets: TicketType[] = [
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
];

const mockVehicles = [
  { id: "V1", licensePlate: "51H-12345" },
  { id: "V2", licensePlate: "51H-67890" },
  { id: "V3", licensePlate: "51G-54321" },
];

const mockCustomers = [
  { id: "u001", name: "Nguyen Van A" },
  { id: "u002", name: "Tran Thi B" },
];

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketType[]>(initialTickets);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Ticket className="w-8 h-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý vé</h1>
          <p className="text-gray-600 mt-2">
            Quản lý vé đỗ xe và theo dõi thời hạn sử dụng
          </p>
        </div>
      </div>
      <TicketManagement
        tickets={tickets}
        setTickets={setTickets}
        vehicles={mockVehicles}
        customers={mockCustomers}
      />
    </div>
  );
}
