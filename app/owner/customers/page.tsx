"use client";


import { useState } from "react";
import { Users } from "lucide-react";
import CustomerManagement from "@/components/CustomerManagement";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Customer } from "@/app/owner/types";

const initialCustomers: (Customer & { status?: string })[] = [
  {
    id: "u001",
    userName: "Nguyen Van A",
    email: "nva@example.com",
    phoneNumber: "0901234567",
    status: "active",
  },
  {
    id: "u002",
    userName: "Tran Thi B",
    email: "ttb@example.com",
    phoneNumber: "0909876543",
    status: "inactive",
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // Lọc khách hàng
  const filteredCustomers = customers.filter((c) => {
    const matchSearch =
      c.userName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phoneNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status ? c.status === status : true;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-8 h-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý khách hàng</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin khách hàng và lịch sử sử dụng dịch vụ</p>
        </div>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Danh sách khách hàng</CardTitle>
          <CardDescription>Bộ lọc và tìm kiếm khách hàng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <Input
              placeholder="Tìm theo tên, email, số điện thoại..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:w-64"
            />
            <select
              className="border rounded px-3 py-2 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>
          </div>
          <CustomerManagement
            customers={filteredCustomers}
            setCustomers={setCustomers}
          />
        </CardContent>
      </Card>
    </div>
  );
}
