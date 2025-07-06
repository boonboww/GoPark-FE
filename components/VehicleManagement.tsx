// components/VehicleManagement.tsx
"use client";

import { useState } from "react";
import { Vehicle, Customer, ParkingSlot, Floor } from "@/app/owner/type"; // Adjust the import path as necessary
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import VehicleForm from "./VehicleForm";

interface VehicleManagementProps {
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  customers: Customer[];
}

export default function VehicleManagement({ 
  vehicles, 
  setVehicles,
  customers
}: VehicleManagementProps) {
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Initialize parking floors with sample data
  const [parkingFloors, setParkingFloors] = useState<Floor[]>(() => [
    {
      number: 1,
      slots: Array.from({ length: 20 }, (_, i) => ({
        number: i + 1,
        status: Math.random() < 0.3 ? "reserved" : "available",
        vehicle: undefined,
      })),
    },
    {
      number: 2,
      slots: Array.from({ length: 20 }, (_, i) => ({
        number: i + 1,
        status: Math.random() < 0.3 ? "reserved" : "available",
        vehicle: undefined,
      })),
    },
  ]);

  // Get current floor data
  const currentFloor = parkingFloors.find((floor) => floor.number === selectedFloor) || parkingFloors[0];

  // Get list of currently parked vehicles
  const parkedVehicles = parkingFloors
    .flatMap((floor) => floor.slots)
    .filter((slot) => slot.status === "occupied" && slot.vehicle)
    .map((slot) => slot.vehicle!);

  // Filter vehicles based on search term
  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get color for slot status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500 hover:bg-green-600";
      case "occupied":
        return "bg-red-500 hover:bg-red-600";
      case "reserved":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  // Handle slot click event
  const handleSlotClick = (slot: ParkingSlot) => {
    if (slot.status === "occupied" && slot.vehicle) {
      setSelectedVehicle(slot.vehicle);
      setSelectedSlot(slot);
      generateQRCode(slot.vehicle.id);
      setShowDetailsModal(true);
    } else if (slot.status === "reserved") {
      const reservedVehicle: Vehicle = {
        id: `RES-${slot.number}`,
        licensePlate: `72A-${1000 + slot.number}`,
        type: "Car",
        owner: `Nguyễn Văn ${slot.number}`,
        status: "Reserved",
      };
      setSelectedVehicle(reservedVehicle);
      setSelectedSlot(slot);
      generateQRCode(reservedVehicle.id);
      setShowDetailsModal(true);
    }
  };

  // Generate fake QR code
  const generateQRCode = (id: string) => {
    const fakeQR = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${id}-${Date.now()}`;
    setQrCodeUrl(fakeQR);
  };

  // Confirm parking action
  const handleConfirmParking = () => {
    if (selectedSlot && selectedVehicle) {
      setParkingFloors((prevFloors) =>
        prevFloors.map((floor) => {
          if (floor.number !== selectedFloor) return floor;
          return {
            ...floor,
            slots: floor.slots.map((s) => {
              if (s.number === selectedSlot.number) {
                return {
                  ...s,
                  status: "occupied",
                  vehicle: {
                    ...selectedVehicle,
                    status: "Parked",
                    plateImage: "/bienso.png",
                  },
                };
              }
              return s;
            }),
          };
        })
      );
      setShowDetailsModal(false);
    }
  };

  // Add new vehicle
  const handleAddVehicle = (vehicleData: Omit<Vehicle, "id">) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `V${vehicles.length + 1}`,
      status: "Available"
    };
    setVehicles([...vehicles, newVehicle]);
    setShowAddModal(false);
  };

  // Delete vehicle
  const handleDeleteVehicle = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Vehicle Management</CardTitle>
              <CardDescription>Manage all registered vehicles and parking slots</CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64"
              />
              <div className="flex gap-4">
                <Select
                  value={selectedFloor.toString()}
                  onValueChange={(value) => setSelectedFloor(parseInt(value))}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select floor" />
                  </SelectTrigger>
                  <SelectContent>
                    {parkingFloors.map((floor) => (
                      <SelectItem key={floor.number} value={floor.number.toString()}>
                        Floor {floor.number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                  <DialogTrigger asChild>
                    <Button className="whitespace-nowrap">Add Vehicle</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Vehicle</DialogTitle>
                    </DialogHeader>
                    <VehicleForm
                      customers={customers}
                      onSubmit={handleAddVehicle}
                      onCancel={() => setShowAddModal(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Parking Slots Grid */}
          <div>
            <h3 className="font-medium mb-2">Parking Slots - Floor {selectedFloor}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {currentFloor.slots.map((slot) => (
                <div
                  key={slot.number}
                  onClick={() => handleSlotClick(slot)}
                  className={`p-3 rounded-lg text-white text-center ${getStatusColor(
                    slot.status
                  )} h-20 flex flex-col justify-center items-center cursor-pointer transition-all`}
                  title={`Slot ${slot.number} - ${slot.status}`}
                >
                  <div className="font-bold text-sm">Slot {slot.number}</div>
                  {slot.status === "occupied" && slot.vehicle && (
                    <div className="text-xs mt-1 truncate w-full">
                      {slot.vehicle.licensePlate}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Reserved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm">Occupied</span>
              </div>
            </div>
          </div>

          {/* Currently Parked Vehicles */}
          {parkedVehicles.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Currently Parked Vehicles</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Plate</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {parkedVehicles.map((vehicle) => {
                      const slot = parkingFloors
                        .flatMap(floor => floor.slots)
                        .find(s => s.vehicle?.id === vehicle.id);
                      
                      return (
                        <tr key={vehicle.id}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            {vehicle.licensePlate}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {vehicle.type}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {vehicle.owner}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {slot ? `Floor ${selectedFloor}, Slot ${slot.number}` : 'Unknown'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* All Vehicles Table */}
          <div className="mt-6">
            <h3 className="font-medium mb-2">All Registered Vehicles</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Plate</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVehicles.length > 0 ? (
                    filteredVehicles.map((vehicle) => (
                      <tr key={vehicle.id}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {vehicle.licensePlate}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {vehicle.type}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {vehicle.owner}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            vehicle.status === "Parked" 
                              ? "bg-green-100 text-green-800" 
                              : vehicle.status === "Reserved" 
                                ? "bg-yellow-100 text-yellow-800" 
                                : "bg-blue-100 text-blue-800"
                          }`}>
                            {vehicle.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteVehicle(vehicle.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-4 text-center text-sm text-gray-500">
                        No vehicles found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Details Modal */}
      {showDetailsModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Vehicle Details</h2>
                <button 
                  onClick={() => setShowDetailsModal(false)} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">License Plate</p>
                    <p className="mt-1 text-sm font-medium">{selectedVehicle.licensePlate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Type</p>
                    <p className="mt-1 text-sm font-medium">{selectedVehicle.type}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Owner</p>
                  <p className="mt-1 text-sm font-medium">{selectedVehicle.owner}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="mt-1 text-sm font-medium">{selectedVehicle.status}</p>
                  </div>
                  {selectedSlot && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="mt-1 text-sm font-medium">
                        Floor {selectedFloor}, Slot {selectedSlot.number}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {selectedVehicle.plateImage && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Plate Image</p>
                      <img 
                        src={selectedVehicle.plateImage} 
                        alt="License plate" 
                        className="mt-2 w-full h-auto border rounded"
                      />
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">QR Code</p>
                    {qrCodeUrl ? (
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code" 
                        className="mt-2 w-full h-auto border rounded"
                      />
                    ) : (
                      <div className="mt-2 w-full aspect-square border rounded flex items-center justify-center text-gray-500">
                        Loading QR code...
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedSlot?.status === "reserved" && (
                  <Button 
                    onClick={handleConfirmParking}
                    className="w-full mt-4"
                  >
                    Confirm Parking
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}