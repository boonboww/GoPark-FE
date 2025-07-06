// components/ParkingLotManagement.tsx
"use client";

import { useState } from "react";
import { ParkingLot } from "@/app/owner/type"; // Adjust the import path as necessary
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { DropzoneUpload } from "@/components/DropzoneUpload";
import Image from "next/image";

interface ParkingLotManagementProps {
  parkingLots: ParkingLot[];
  setParkingLots: React.Dispatch<React.SetStateAction<ParkingLot[]>>;
}

export default function ParkingLotManagement({
  parkingLots,
  setParkingLots,
}: ParkingLotManagementProps) {
  const [selectedLotId, setSelectedLotId] = useState<string>(
    parkingLots[0]?.id || ""
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [newParkingLot, setNewParkingLot] = useState<Omit<ParkingLot, "id">>({
    name: "",
    address: "",
    capacity: 0,
    pricePerHour: 0,
  });
  const [showAddDialog, setShowAddDialog] = useState(false);

  const selectedLot = parkingLots.find((lot) => lot.id === selectedLotId);

  // Handle add new parking lot
  const handleAddParkingLot = () => {
    if (!newParkingLot.name || !newParkingLot.address) {
      alert("Please fill in all required fields");
      return;
    }

    const newLot: ParkingLot = {
      ...newParkingLot,
      id: `P${Date.now()}`,
      capacity: Number(newParkingLot.capacity),
      pricePerHour: Number(newParkingLot.pricePerHour),
      ...(imageFile && { image: URL.createObjectURL(imageFile) }),
    };

    setParkingLots([...parkingLots, newLot]);
    setSelectedLotId(newLot.id);
    setNewParkingLot({ name: "", address: "", capacity: 0, pricePerHour: 0 });
    setImageFile(null);
    setShowAddDialog(false);
  };

  // Handle update parking lot
  const handleUpdateParkingLot = () => {
    if (!selectedLotId) return;

    setParkingLots(
      parkingLots.map((lot) => {
        if (lot.id === selectedLotId) {
          return {
            ...lot,
            ...(imageFile && { image: URL.createObjectURL(imageFile) }),
          };
        }
        return lot;
      })
    );
    setImageFile(null);
  };

  // Handle delete parking lot
  const handleDeleteParkingLot = (id: string) => {
    if (!confirm("Are you sure you want to delete this parking lot?")) return;
    
    setParkingLots(parkingLots.filter((lot) => lot.id !== id));
    if (selectedLotId === id) {
      setSelectedLotId(parkingLots[0]?.id || "");
    }
  };

  // Handle input change for new parking lot
  const handleNewLotInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewParkingLot({
      ...newParkingLot,
      [id]: id === "name" || id === "address" ? value : Number(value),
    });
  };

  // Handle input change for existing parking lot
  const handleLotInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (!selectedLotId) return;

    setParkingLots(
      parkingLots.map((lot) =>
        lot.id === selectedLotId
          ? {
              ...lot,
              [id]: id === "name" || id === "address" ? value : Number(value),
            }
          : lot
      )
    );
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Parking Lot Management
        </CardTitle>
        <CardDescription>Add, edit, and manage parking lots</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>Add New Parking Lot</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Parking Lot</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={newParkingLot.name}
                    onChange={handleNewLotInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={newParkingLot.address}
                    onChange={handleNewLotInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={newParkingLot.capacity}
                    onChange={handleNewLotInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="pricePerHour">Hourly Rate (VND)</Label>
                  <Input
                    id="pricePerHour"
                    type="number"
                    min="0"
                    value={newParkingLot.pricePerHour}
                    onChange={handleNewLotInputChange}
                  />
                </div>
                <div>
                  <Label>Upload Image</Label>
                  <DropzoneUpload
                    onFilesAccepted={(files) => setImageFile(files[0])}
                    accept="image/*"
                    maxFiles={1}
                  />
                  {imageFile && (
                    <div className="mt-2">
                      <Image
                        src={URL.createObjectURL(imageFile)}
                        alt="Parking lot preview"
                        width={200}
                        height={150}
                        className="rounded border"
                      />
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleAddParkingLot}
                  disabled={!newParkingLot.name || !newParkingLot.address}
                  className="w-full"
                >
                  Create Parking Lot
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="w-full md:w-64">
            <Label>Select Parking Lot</Label>
            <Select
              value={selectedLotId}
              onValueChange={setSelectedLotId}
              disabled={parkingLots.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={parkingLots.length === 0 ? "No parking lots" : "Select a parking lot"} />
              </SelectTrigger>
              <SelectContent>
                {parkingLots.map((lot) => (
                  <SelectItem key={lot.id} value={lot.id}>
                    {lot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedLot && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={selectedLot.name}
                  onChange={handleLotInputChange}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={selectedLot.address}
                  onChange={handleLotInputChange}
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={selectedLot.capacity}
                  onChange={handleLotInputChange}
                />
              </div>
              <div>
                <Label htmlFor="pricePerHour">Hourly Rate (VND)</Label>
                <Input
                  id="pricePerHour"
                  type="number"
                  min="0"
                  value={selectedLot.pricePerHour}
                  onChange={handleLotInputChange}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Upload New Image</Label>
                <DropzoneUpload
                  onFilesAccepted={(files) => setImageFile(files[0])}
                  accept="image/*"
                  maxFiles={1}
                />
              </div>

              {(imageFile || selectedLot.image) && (
                <div className="mt-4">
                  <Label>Parking Lot Image</Label>
                  <div className="relative h-48 w-full rounded-lg border shadow overflow-hidden mt-2">
                    <Image
                      src={imageFile ? URL.createObjectURL(imageFile) : selectedLot.image!}
                      alt="Parking lot preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={handleUpdateParkingLot}
                  disabled={!imageFile}
                >
                  Save Changes
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteParkingLot(selectedLotId)}
                >
                  Delete Parking Lot
                </Button>
              </div>
            </div>
          </div>
        )}

        {parkingLots.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No parking lots available. Add your first parking lot.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}