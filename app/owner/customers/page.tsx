"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import CustomerManagement from "@/components/CustomerManagement";
import type { Customer } from "@/app/owner/types";

const initialCustomers: Customer[] = [
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
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-8 h-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý khách hàng</h1>
          <p className="text-gray-600 mt-2">
            Quản lý thông tin khách hàng và lịch sử sử dụng dịch vụ
          </p>
        </div>
      </div>
      <CustomerManagement
        customers={customers}
        setCustomers={setCustomers}
      />
    </div>
  );
}
