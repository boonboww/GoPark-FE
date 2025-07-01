import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import CustomerForm from "./CustomerForm";
import VehicleForm from "./VehicleForm";

// Define interface for customer
export interface Customer {
  id: string;
  fullName: string;
  idNumber: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber: string;
  address: string;
  vehicles: string[];
}

// Define interface for props
interface CustomerManagementProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

export default function CustomerManagement({ customers, setCustomers }: CustomerManagementProps) {
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingVehicles, setViewingVehicles] = useState<Customer | null>(null);
  const [addingVehicleFor, setAddingVehicleFor] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddCustomer = (customer: Customer) => {
    setCustomers([...customers, { ...customer, id: `C${customers.length + 1}`, vehicles: [] }]);
    alert("Customer added");
  };

  const handleEditCustomer = (customer: Customer) => {
    setCustomers(customers.map((c) => (c.id === customer.id ? customer : c)));
    setEditingCustomer(null);
    alert("Customer updated");
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(customers.filter((c) => c.id !== id));
    alert("Customer deleted");
  };

  const handleAddVehicle = (vehicle: { licensePlate: string; type: string }, customerId: string) => {
    setCustomers(customers.map((c) => 
      c.id === customerId 
        ? { ...c, vehicles: [...c.vehicles, `${vehicle.licensePlate} (${vehicle.type})`] }
        : c
    ));
    setAddingVehicleFor(null);
    alert("Vehicle added");
  };

  const filteredCustomers = customers.filter((c) =>
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>Manage customer information and their vehicles</CardDescription>
        </div>
        <Input
          type="text"
          placeholder="Search by name, email, or phone..."
          className="w-full md:w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </CardHeader>

      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mb-4">Add Customer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <CustomerForm
              onSubmit={handleAddCustomer}
              onCancel={() => {}}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingCustomer} onOpenChange={() => setEditingCustomer(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
            </DialogHeader>
            {editingCustomer && (
              <CustomerForm
                customer={editingCustomer}
                onSubmit={handleEditCustomer}
                onCancel={() => setEditingCustomer(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!addingVehicleFor} onOpenChange={() => setAddingVehicleFor(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Vehicle for {addingVehicleFor?.fullName}</DialogTitle>
            </DialogHeader>
            {addingVehicleFor && (
              <VehicleForm
                onSubmit={(vehicle) => handleAddVehicle(vehicle, addingVehicleFor.id)}
                onCancel={() => setAddingVehicleFor(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!viewingVehicles} onOpenChange={() => setViewingVehicles(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Vehicle Information - {viewingVehicles?.fullName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              {viewingVehicles?.vehicles.length ? (
                <ul className="list-disc pl-5">
                  {viewingVehicles.vehicles.map((vehicle, index) => (
                    <li key={index}>{vehicle}</li>
                  ))}
                </ul>
              ) : (
                <p>No vehicles registered</p>
              )}
            </div>
            <Button onClick={() => setViewingVehicles(null)}>Close</Button>
          </DialogContent>
        </Dialog>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.fullName}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phoneNumber}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setViewingVehicles(customer)}
                    className="mr-2"
                  >
                    View Vehicles
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAddingVehicleFor(customer)}
                    className="mr-2"
                  >
                    Add Vehicle
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingCustomer(customer)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteCustomer(customer.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
