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

interface Vehicle {
  id: string;
  licensePlate: string;
  type: string;
  owner: string;
  status: "Parked" | "Not Parked";
}

interface VehicleManagementProps {
  vehicles: Vehicle[];
}

export default function VehicleManagement({ vehicles }: VehicleManagementProps) {
  return (
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.licensePlate}</TableCell>
                <TableCell>{vehicle.type}</TableCell>
                <TableCell>{vehicle.owner}</TableCell>
                <TableCell>
                  <span className={vehicle.status === "Parked" ? "text-green-600" : "text-gray-600"}>
                    {vehicle.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}