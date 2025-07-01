"use client";

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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";

interface Vehicle {
  id: string;
  licensePlate: string;
  type: string;
  owner: string;
  status: "Parked" | "Reserved" | "Available";
  floor?: number;
  slot?: number;
}

interface ParkingSlot {
  number: number;
  status: "available" | "occupied" | "reserved";
  vehicle?: string;
}

interface Floor {
  number: number;
  slots: ParkingSlot[];
}

interface VehicleManagementProps {
  vehicles: Vehicle[];
}

export default function VehicleManagement({
  vehicles,
}: VehicleManagementProps) {
  const [selectedFloor, setSelectedFloor] = useState<number>(1);

  // Sample parking floors data
  const parkingFloors: Floor[] = [
    {
      number: 1,
      slots: Array.from({ length: 20 }, (_, i) => ({
        number: i + 1,
        status:
          Math.random() > 0.7
            ? "occupied"
            : Math.random() > 0.5
            ? "reserved"
            : "available",
        vehicle:
          Math.random() > 0.7
            ? vehicles[Math.floor(Math.random() * vehicles.length)]
                ?.licensePlate
            : undefined,
      })),
    },
    {
      number: 2,
      slots: Array.from({ length: 20 }, (_, i) => ({
        number: i + 1,
        status:
          Math.random() > 0.7
            ? "occupied"
            : Math.random() > 0.5
            ? "reserved"
            : "available",
        vehicle:
          Math.random() > 0.7
            ? vehicles[Math.floor(Math.random() * vehicles.length)]
                ?.licensePlate
            : undefined,
      })),
    },
  ];

  const currentFloor =
    parkingFloors.find((floor) => floor.number === selectedFloor) ||
    parkingFloors[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "occupied":
        return "bg-red-500";
      case "reserved":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Parking Slots</CardTitle>
              <CardDescription>View and manage parking slots</CardDescription>
            </div>
            <Select
              value={selectedFloor.toString()}
              onValueChange={(value) => setSelectedFloor(parseInt(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select floor" />
              </SelectTrigger>
              <SelectContent>
                {parkingFloors.map((floor) => (
                  <SelectItem
                    key={floor.number}
                    value={floor.number.toString()}
                  >
                    Floor {floor.number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {currentFloor.slots.map((slot) => (
              <div
                key={slot.number}
                className={`p-4 rounded-lg text-white text-center ${getStatusColor(
                  slot.status
                )} h-20 flex flex-col justify-center items-center`}
                title={`Slot ${slot.number} - ${slot.status}`}
              >
                <div className="font-bold">{slot.number}</div>
                <div className="text-xs mt-1 h-5 truncate w-full">
                  {slot.vehicle || " "}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span>Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>Occupied</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle List</CardTitle>
          <CardDescription>Manage vehicles in the parking lot</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>License Plate</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Slot</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>{vehicle.licensePlate}</TableCell>
                  <TableCell>{vehicle.type}</TableCell>
                  <TableCell>{vehicle.owner}</TableCell>
                  <TableCell>
                    <span
                      className={
                        vehicle.status === "Parked"
                          ? "text-red-600"
                          : vehicle.status === "Reserved"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }
                    >
                      {vehicle.status}
                    </span>
                  </TableCell>
                  <TableCell>{vehicle.floor || "-"}</TableCell>
                  <TableCell>{vehicle.slot || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
