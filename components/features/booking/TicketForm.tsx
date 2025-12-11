"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Ticket, TicketFormProps } from "@/app/owner/types";

export default function TicketForm({
  vehicles = [],
  customers = [],
  onSubmit,
  editingTicket,
  onUpdate,
}: TicketFormProps) {
  // Use explicit fields matching new Ticket interface + any extra form fields
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    customerName: "", // Helper for UI, will mapped to optional userId or ignored
    ticketType: "date",
    price: 0,
    floor: "",
    expiryDate: "",
    status: "active",
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (editingTicket) {
      // Map editingTicket (Ticket type) to form data
      setFormData({
        vehicleNumber: editingTicket.vehicleNumber || "",
        customerName: editingTicket.userId?.userName || "", // Show name if available
        ticketType: (editingTicket.ticketType as string) || "date",
        price: editingTicket.price || 0,
        floor: editingTicket.floor || "",
        expiryDate: editingTicket.expiryDate || "",
        status: editingTicket.status || "active",
      });
    } else {
      setFormData({
        vehicleNumber: "",
        customerName: "",
        ticketType: "date",
        price: 0,
        floor: "",
        expiryDate: "",
        status: "active",
      });
    }
  }, [editingTicket, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Construct payload. Note: We can't easily create a full userId object from just a name.
    // We'll pass the form data and let the parent handle the API formatting or mock it.
    // The props define `onSubmit` taking `Omit<Ticket, "id">`.
    // We satisfy the Ticket interface as much as possible.

    const payload: any = {
      vehicleNumber: formData.vehicleNumber,
      ticketType: formData.ticketType as any,
      price: formData.price,
      floor: formData.floor,
      expiryDate: formData.expiryDate,
      status: formData.status as any,
      // Helper for backend/parent if needed
      _customerName: formData.customerName,
    };

    if (editingTicket && onUpdate) {
      onUpdate({ ...editingTicket, ...payload });
    } else {
      onSubmit(payload);
    }
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "price" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = !!formData.vehicleNumber && !!formData.ticketType;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{editingTicket ? "Sửa Vé" : "Thêm Vé Mới"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingTicket ? "Sửa Vé" : "Thêm Vé Mới"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="vehicleNumber">Biển Số</Label>
            <Input
              id="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleInputChange}
              placeholder="Nhập biển số xe"
              required
            />
          </div>

          <div>
            <Label htmlFor="customerName">Khách Hàng</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              placeholder="Nhập tên khách vãng lai"
              required
            />
          </div>

          <div>
            <Label htmlFor="ticketType">Loại Vé</Label>
            <Select
              value={formData.ticketType}
              onValueChange={(value) => handleSelectChange("ticketType", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại vé" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">Theo giờ</SelectItem>
                <SelectItem value="date">Theo ngày</SelectItem>
                <SelectItem value="month">Theo tháng</SelectItem>
                <SelectItem value="guest">Khách vãng lai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price">Giá Vé (VND)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="1000"
              required
            />
          </div>

          <div>
            <Label htmlFor="floor">Tầng Đậu Xe</Label>
            <Input
              id="floor"
              value={formData.floor}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="expiryDate">Ngày Hết Hạn</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Trạng Thái</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="used">Used</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full mt-4" disabled={!isFormValid}>
            {editingTicket ? "Cập Nhật Vé" : "Thêm Vé"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
