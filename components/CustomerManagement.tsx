'use client';

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import CustomerForm from "./CustomerForm";
import VehicleForm from "./VehicleForm";
import type {
  Customer,
  CustomerManagementProps,
  Vehicle,
  VehicleFormData,
} from "@/app/owner/types";

export default function CustomerManagement({
  customers,
  setCustomers,
}: CustomerManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addVehicleCustomer, setAddVehicleCustomer] = useState<Customer | null>(null);
  const [viewVehicleCustomer, setViewVehicleCustomer] = useState<Customer | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get<
          { _id: string; userName: string; email: string; phoneNumber: string }[]
        >("/api/v1/users_new");
        const mapped: Customer[] = res.data.map((user) => ({
          id: user._id,
          userName: user.userName,
          email: user.email,
          phoneNumber: user.phoneNumber,
        }));
        setCustomers(mapped);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchCustomers();
  }, [setCustomers]);

  const handleAddCustomer = async (data: Omit<Customer, "id">) => {
    try {
      const res = await api.post("/api/v1/users_new", data);
      const newCustomer: Customer = {
        id: res.data._id,
        userName: res.data.userName,
        email: res.data.email,
        phoneNumber: res.data.phoneNumber,
      };
      setCustomers((prev) => [...prev, newCustomer]);
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error("Failed to add user:", err);
    }
  };

  const handleEditCustomer = async (updated: Customer) => {
    try {
      const res = await api.put(`/api/v1/users_new/${updated.id}`, updated);
      const updatedCustomer: Customer = {
        id: res.data._id,
        userName: res.data.userName,
        email: res.data.email,
        phoneNumber: res.data.phoneNumber,
      };
      setCustomers((prev) =>
        prev.map((c) => (c.id === updated.id ? updatedCustomer : c))
      );
      setEditingCustomer(null);
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      await api.delete(`/api/v1/users_new/${id}`);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const handleAddVehicle = async (vehicleData: VehicleFormData) => {
    if (!addVehicleCustomer) return;

    try {
      await api.post(`/api/v1/vehicles/for-user/${addVehicleCustomer.id}`, vehicleData);
      setAddVehicleCustomer(null);
    } catch (err) {
      console.error("Failed to add vehicle:", err);
    }
  };

  const handleViewVehicles = async (customer: Customer) => {
    try {
      const res = await api.get<Vehicle[]>(`/api/v1/vehicles/by-user/${customer.id}`);
      setVehicles(res.data);
      setViewVehicleCustomer(customer);
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>Manage registered customers</CardDescription>
        </div>
        <Input
          placeholder="Search name/email/phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-72"
        />
      </CardHeader>

      <CardContent>
        {/* Add Customer */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Customer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <CustomerForm
              onSubmit={handleAddCustomer}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Customer */}
        <Dialog open={!!editingCustomer} onOpenChange={() => setEditingCustomer(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
            </DialogHeader>
            {editingCustomer && (
              <CustomerForm
                customer={editingCustomer}
                onSubmit={(data) =>
                  handleEditCustomer({ ...editingCustomer, ...data })
                }
                onCancel={() => setEditingCustomer(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Add Vehicle */}
        <Dialog open={!!addVehicleCustomer} onOpenChange={() => setAddVehicleCustomer(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Vehicle</DialogTitle>
            </DialogHeader>
            {addVehicleCustomer && (
              <VehicleForm
                onSubmit={handleAddVehicle}
                onCancel={() => setAddVehicleCustomer(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* View Vehicles */}
        <Dialog open={!!viewVehicleCustomer} onOpenChange={() => setViewVehicleCustomer(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Vehicles of {viewVehicleCustomer?.userName}
              </DialogTitle>
            </DialogHeader>
            {vehicles.length === 0 ? (
              <p className="text-sm text-gray-500">No vehicles found.</p>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {vehicles.map((v, idx) => (
                  <Card key={idx} className="p-3 border shadow-sm">
                    <p><strong>License Plate:</strong> {v.licensePlate}</p>
                  </Card>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Customer Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.userName}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phoneNumber}</TableCell>
                <TableCell className="space-x-2 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditingCustomer(c)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteCustomer(c.id)}>
                    Delete
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => handleViewVehicles(c)}>
                    View Vehicles
                  </Button>
                  <Button size="sm" onClick={() => setAddVehicleCustomer(c)}>
                    Add Vehicle
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
