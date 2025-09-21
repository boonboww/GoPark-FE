"use client";

import { useEffect, useState } from "react";
import { Ticket, Filter, Calendar, User, Car } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableCell, TableBody, TableHead } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

import TicketForm from "@/components/TicketForm";
import API from "@/lib/api";
import type { Ticket as TicketType, Customer, Vehicle } from "@/app/owner/types";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCustomer, setFilterCustomer] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterExpiry, setFilterExpiry] = useState("");
  const [loading, setLoading] = useState(false);
  // Modal tạo vé vãng lai
  const handleAddTicket = async (newTicket: Omit<TicketType, "id">) => {
    try {
      const res = await API.post("/api/v1/tickets/owner", newTicket);
      if (res.data?.data) {
        setTickets(prev => [res.data.data, ...prev]);
      }
    } catch (err) {
      // Xử lý lỗi
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Giả sử API trả về đúng định dạng
        const [ticketRes, customerRes, vehicleRes] = await Promise.all([
          API.get("/api/v1/tickets/owner"),
          API.get("/api/v1/customers/owner"),
          API.get("/api/v1/vehicles/owner"),
        ]);
        setTickets(ticketRes.data.data || []);
        setCustomers(customerRes.data.data || []);
        setVehicles(vehicleRes.data.data || []);
      } catch (err) {
        // Xử lý lỗi
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Lọc vé
  const filteredTickets = tickets.filter((ticket) => {
    const matchSearch =
      ticket.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType ? ticket.type === filterType : true;
    const matchCustomer = filterCustomer ? ticket.customer === filterCustomer : true;
    // Tính trạng thái dựa vào ngày hết hạn
    const now = new Date();
    const expiryDate = new Date(ticket.expiry);
    const status = expiryDate >= now ? "active" : "expired";
    const matchStatus = filterStatus ? status === filterStatus : true;
    const matchExpiry = filterExpiry ? ticket.expiry === filterExpiry : true;
    return matchSearch && matchType && matchCustomer && matchStatus && matchExpiry;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Ticket className="w-8 h-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý vé</h1>
          <p className="text-gray-600 mt-2">Quản lý vé đỗ xe và theo dõi thời hạn sử dụng</p>
        </div>
      </div>
      {/* Nút tạo vé vãng lai */}
      <div className="mb-2">
        <TicketForm
          vehicles={vehicles}
          customers={customers.map(c => ({ id: c.id, name: c.userName }))}
          onSubmit={handleAddTicket}
        />
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Danh sách vé</CardTitle>
          <CardDescription>Quản lý, lọc và tìm kiếm vé của khách hàng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bộ lọc */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <Input
              placeholder="Tìm theo biển số hoặc khách hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:w-64"
            />
            <select
              className="border rounded px-3 py-2 text-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Loại vé</option>
              <option value="Daily">Hàng ngày</option>
              <option value="Monthly">Hàng tháng</option>
              <option value="Annual">Hàng năm</option>
            </select>
            <select
              className="border rounded px-3 py-2 text-sm"
              value={filterCustomer}
              onChange={(e) => setFilterCustomer(e.target.value)}
            >
              <option value="">Khách hàng</option>
              {customers.map((c) => (
                <option key={c.id} value={c.userName}>{c.userName}</option>
              ))}
            </select>
            <select
              className="border rounded px-3 py-2 text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Trạng thái</option>
              <option value="active">Còn hiệu lực</option>
              <option value="expired">Hết hạn</option>
            </select>
            <Input
              type="date"
              value={filterExpiry}
              onChange={(e) => setFilterExpiry(e.target.value)}
              className="md:w-40"
            />
          </div>

          {/* Bảng vé */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã Vé</TableHead>
                  <TableHead>Biển Số</TableHead>
                  <TableHead>Khách Hàng</TableHead>
                  <TableHead>Loại Vé</TableHead>
                  <TableHead>Giá (VND)</TableHead>
                  <TableHead>Tầng</TableHead>
                  <TableHead>Hết Hạn</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">Đang tải dữ liệu...</TableCell>
                  </TableRow>
                ) : filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>{ticket.licensePlate}</TableCell>
                      <TableCell>{ticket.customer}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          ticket.type === 'Daily'
                            ? 'bg-blue-100 text-blue-800'
                            : ticket.type === 'Monthly'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {ticket.type === 'Daily' ? 'Hàng Ngày' : ticket.type === 'Monthly' ? 'Hàng Tháng' : 'Hàng Năm'}
                        </span>
                      </TableCell>
                      <TableCell>{ticket.price?.toLocaleString('vi-VN')}</TableCell>
                      <TableCell>{ticket.floor}</TableCell>
                      <TableCell>{formatDate(ticket.expiry)}</TableCell>
                      <TableCell>
                        {new Date(ticket.expiry) >= new Date() ? (
                          <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">Còn hiệu lực</span>
                        ) : (
                          <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">Hết hạn</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Không tìm thấy vé phù hợp
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
