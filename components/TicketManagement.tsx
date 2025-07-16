"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import TicketForm from "./TicketForm";
import type { Ticket, TicketManagementProps } from "@/app/owner/types";

export default function TicketManagement({ 
  tickets, 
  setTickets, 
  vehicles, 
  customers 
}: TicketManagementProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingTicket, setEditingTicket] = useState<Ticket | undefined>(undefined);

  const handleAddTicket = (ticketData: Omit<Ticket, "id">) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: `T${Date.now()}`
    };
    setTickets([...tickets, newTicket]);
  };

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
  };

  const handleUpdateTicket = (updatedTicket: Ticket) => {
    setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    setEditingTicket(undefined);
  };

  const handleDeleteTicket = (id: string) => {
    setTickets(tickets.filter(t => t.id !== id));
    if (editingTicket?.id === id) {
      setEditingTicket(undefined);
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN"); // Changed to Vietnamese date format
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">Quản Lý Vé</CardTitle>
            <CardDescription>
              Tổng cộng: {tickets.length} vé
            </CardDescription>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo biển số hoặc khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <TicketForm
          vehicles={vehicles}
          customers={customers}
          onSubmit={handleAddTicket}
          editingTicket={editingTicket}
          onUpdate={handleUpdateTicket}
        />

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Mã Vé</TableHead>
                <TableHead>Biển Số</TableHead>
                <TableHead>Khách Hàng</TableHead>
                <TableHead>Loại Vé</TableHead>
                <TableHead className="text-right">Giá (VND)</TableHead>
                <TableHead>Tầng</TableHead>
                <TableHead>Hết Hạn</TableHead>
                <TableHead className="text-right">Hành Động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.length > 0 ? (
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
                    <TableCell className="text-right">
                      {ticket.price.toLocaleString('vi-VN')}
                    </TableCell>
                    <TableCell>{ticket.floor}</TableCell>
                    <TableCell>{formatDate(ticket.expiry)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTicket(ticket)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTicket(ticket.id)}
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    {tickets.length === 0 
                      ? "Chưa có vé nào" 
                      : "Không tìm thấy vé phù hợp"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}