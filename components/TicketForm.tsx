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
  onUpdate 
}: TicketFormProps) {
  const [ticket, setTicket] = useState<Omit<Ticket, "id">>({
    licensePlate: "",
    customer: "",
    type: "Daily",
    price: 0,
    floor: "",
    expiry: "",
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (editingTicket) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = editingTicket;
      setTicket(rest);
    } else {
      setTicket({
        licensePlate: "",
        customer: "",
        type: "Daily",
        price: 0,
        floor: "",
        expiry: "",
      });
    }
  }, [editingTicket, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTicket && onUpdate) {
      onUpdate({ ...ticket, id: editingTicket.id });
    } else {
      onSubmit(ticket);
    }
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setTicket(prev => ({ 
      ...prev, 
      [id]: id === "price" ? Number(value) : value 
    }));
  };

  const handleSelectChange = (field: keyof Omit<Ticket, "id">, value: string) => {
    setTicket(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = !!ticket.licensePlate && !!ticket.customer && !!ticket.type;

  return (
   <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button className="mb-4">
      {editingTicket ? "Sửa Vé" : "Thêm Vé Mới"}
    </Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>{editingTicket ? "Sửa Vé" : "Thêm Vé Mới"}</DialogTitle>
    </DialogHeader>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="licensePlate">Biển Số</Label>
        <Input  
          id="licensePlate"
          value={ticket.licensePlate}
          onChange={handleInputChange}
          placeholder="Nhập biển số xe"
          required
        />
      </div>

      <div>
        <Label htmlFor="customer">Khách Hàng</Label>
        <Input
          id="customer"
          value={ticket.customer}
          onChange={handleInputChange}
          placeholder="Nhập tên khách vãng lai"
          required
        />
      </div>

      <div>
        <Label htmlFor="type">Loại Vé</Label>
        <Select
          value={ticket.type}
          onValueChange={(value) => handleSelectChange("type", value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại vé" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Daily">Vé Hàng Ngày</SelectItem>
            <SelectItem value="Monthly">Vé Hàng Tháng</SelectItem>
            <SelectItem value="Annual">Vé Hàng Năm</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="price">Giá Vé (VND)</Label>
        <Input
          id="price"
          type="number"
          value={ticket.price}
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
          value={ticket.floor}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="expiry">Ngày Hết Hạn</Label>
        <Input
          id="expiry"
          type="date"
          value={ticket.expiry}
          onChange={handleInputChange}
          min={new Date().toISOString().split("T")[0]}
          required
        />
      </div>

      <Button 
        type="submit"
        className="w-full mt-4"
        disabled={!isFormValid}
      >
        {editingTicket ? "Cập Nhật Vé" : "Thêm Vé"}
      </Button>
    </form>
  </DialogContent>
</Dialog>
  );
}
