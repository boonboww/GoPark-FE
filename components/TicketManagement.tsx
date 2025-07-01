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

// Type definitions
interface Vehicle {
  id: string;
  licensePlate: string;
}

interface Customer {
  id: string;
  name: string;
}

interface Ticket {
  id: string;
  licensePlate: string;
  customer: string;
  type: "Daily" | "Monthly" | "Annual";
  price: string;
  floor: string;
  expiry: string;
}

interface TicketManagementProps {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  vehicles: Vehicle[];
  customers: Customer[];
}

export default function TicketManagement({ 
  tickets, 
  setTickets, 
  vehicles, 
  customers 
}: TicketManagementProps) {
  // State management
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  // Handler functions
  const handleAddTicket = (ticketData: Omit<Ticket, 'id'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: `T${Date.now()}` // Better ID generation using timestamp
    };
    setTickets([...tickets, newTicket]);
  };

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
  };

  const handleUpdateTicket = (updatedTicket: Ticket) => {
    setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    setEditingTicket(null);
  };

  const handleDeleteTicket = (id: string) => {
    setTickets(tickets.filter(t => t.id !== id));
  };

  // Filter tickets based on search term
  const filteredTickets = tickets.filter(ticket =>
    ticket.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">Ticket Management</CardTitle>
            <CardDescription>
              {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} found
            </CardDescription>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
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
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>License Plate</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                        {ticket.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {parseInt(ticket.price).toLocaleString()} VND
                    </TableCell>
                    <TableCell>{ticket.floor}</TableCell>
                    <TableCell>{formatDate(ticket.expiry)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTicket(ticket)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTicket(ticket.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    {tickets.length === 0 
                      ? "No tickets available. Create your first ticket!" 
                      : "No tickets match your search."}
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