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

// Interface definitions
interface Vehicle {
  id: string;
  licensePlate: string;
}

interface Customer {
  id: string;
  name: string;
}

interface Ticket {
  licensePlate: string;
  customer: string;
  type: "Daily" | "Monthly" | "Annual";
  price: string;
  floor: string;
  expiry: string;
}

interface TicketFormProps {
  vehicles: Vehicle[];
  customers: Customer[];
  onSubmit: (ticket: Ticket) => void;
  editingTicket?: Ticket | null;
  onUpdate?: (ticket: Ticket) => void;
}

export default function TicketForm({ 
  vehicles = [], 
  customers = [], 
  onSubmit, 
  editingTicket = null, 
  onUpdate 
}: TicketFormProps) {
  // State initialization
  const [ticket, setTicket] = useState<Ticket>({
    licensePlate: "",
    customer: "",
    type: "Daily",
    price: "",
    floor: "",
    expiry: "",
  });

  // Effect to handle editing mode
  useEffect(() => {
    if (editingTicket) {
      setTicket(editingTicket);
    } else {
      resetForm();
    }
  }, [editingTicket]);

  // Helper function to reset form
  const resetForm = () => {
    setTicket({
      licensePlate: "",
      customer: "",
      type: "Daily",
      price: "",
      floor: "",
      expiry: "",
    });
  };

  // Form submission handler
  const handleSubmit = () => {
    if (editingTicket && onUpdate) {
      onUpdate(ticket);
    } else {
      onSubmit(ticket);
      resetForm();
    }
  };

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setTicket(prev => ({ ...prev, [id]: value }));
  };

  // Select change handler for ticket type
  const handleTypeChange = (value: "Daily" | "Monthly" | "Annual") => {
    setTicket(prev => ({ ...prev, type: value }));
  };

  // Check if form is valid for submission
  const isFormValid = ticket.licensePlate && ticket.customer && ticket.type;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mb-6 text-white">
          {editingTicket ? "Edit Ticket" : "Create Ticket"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingTicket ? "Edit Ticket" : "Create New Ticket"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* License Plate Select */}
          <div>
            <Label htmlFor="licensePlate">License Plate</Label>
            <Select
              value={ticket.licensePlate}
              onValueChange={(value) => setTicket({ ...ticket, licensePlate: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select license plate" />
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

          {/* Customer Select */}
          <div>
            <Label htmlFor="customer">Customer</Label>
            <Select
              value={ticket.customer}
              onValueChange={(value) => setTicket({ ...ticket, customer: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
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

          {/* Ticket Type Select */}
          <div>
            <Label htmlFor="type">Ticket Type</Label>
            <Select
              value={ticket.type}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ticket type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Input */}
          <div>
            <Label htmlFor="price">Price (VND)</Label>
            <Input
              id="price"
              type="number"
              value={ticket.price}
              onChange={handleInputChange}
              placeholder="Enter price"
              min="0"
            />
          </div>

          {/* Floor Input */}
          <div>
            <Label htmlFor="floor">Floor</Label>
            <Input
              id="floor"
              value={ticket.floor}
              onChange={handleInputChange}
              placeholder="Enter floor number"
            />
          </div>

          {/* Expiry Date Input */}
          <div>
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input
              id="expiry"
              type="date"
              value={ticket.expiry}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={!isFormValid}
          >
            {editingTicket ? "Update Ticket" : "Create Ticket"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}