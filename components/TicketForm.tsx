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
          {editingTicket ? "Edit Ticket" : "Add New Ticket"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingTicket ? "Edit Ticket" : "Add New Ticket"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="licensePlate">License Plate</Label>
            <Select
              value={ticket.licensePlate}
              onValueChange={(value) => handleSelectChange("licensePlate", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a license plate" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.licensePlate}>
                    {vehicle.licensePlate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="customer">Customer</Label>
            <Select
              value={ticket.customer}
              onValueChange={(value) => handleSelectChange("customer", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.name}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="type">Ticket Type</Label>
            <Select
              value={ticket.type}
              onValueChange={(value) => handleSelectChange("type", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a ticket type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily Ticket</SelectItem>
                <SelectItem value="Monthly">Monthly Ticket</SelectItem>
                <SelectItem value="Annual">Annual Ticket</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price">Ticket Price (VND)</Label>
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
            <Label htmlFor="floor">Parking Floor</Label>
            <Input
              id="floor"
              value={ticket.floor}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="expiry">Expiry Date</Label>
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
            {editingTicket ? "Update Ticket" : "Add Ticket"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
