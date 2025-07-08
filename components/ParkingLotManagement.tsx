"use client";

import { useState } from "react";
import { DropzoneUpload } from "@/components/DropzoneUpload";
import Image from "next/image";
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
import type { ParkingLot, ParkingLotManagementProps } from "@/app/owner/types";

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

  const selectedLot = parkingLots.find((lot) => lot.id === selectedLotId);

  const handleAddParkingLot = () => {
    const newLot: ParkingLot = {
      ...newParkingLot,
      id: `P${Date.now()}`,
      capacity: Number(newParkingLot.capacity),
      pricePerHour: Number(newParkingLot.pricePerHour),
    };
    setParkingLots([...parkingLots, newLot]);
    setNewParkingLot({ name: "", address: "", capacity: 0, pricePerHour: 0 });
    setSelectedLotId(newLot.id);
  };

  const handleUpdateParkingLot = () => {
    if (!selectedLotId) return;

    setParkingLots(
      parkingLots.map((lot) => {
        if (lot.id === selectedLotId) {
          return {
            ...lot,
            name: lot.name,
            address: lot.address,
            capacity: lot.capacity,
            pricePerHour: lot.pricePerHour,
            ...(imageFile && { image: URL.createObjectURL(imageFile) }),
          };
        }
        return lot;
      })
    );
    setImageFile(null);
  };

  const handleDeleteParkingLot = (id: string) => {
    setParkingLots(parkingLots.filter((lot) => lot.id !== id));
    if (selectedLotId === id) {
      setSelectedLotId(parkingLots[0]?.id || "");
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Parking Lot Management
        </CardTitle>
        <CardDescription>
          Add, edit, and manage your parking lots
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add New Parking Lot</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Parking Lot</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Keep form fields unchanged or add them if needed */}
              </div>
            </DialogContent>
          </Dialog>

          <div className="w-64">
            <Label>Select Parking Lot</Label>
            <Select value={selectedLotId} onValueChange={setSelectedLotId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a lot" />
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
              {/* You can put editable form fields for selectedLot here if needed */}
            </div>

            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Parking Lot Image</Label>
                <DropzoneUpload
                  onFilesAccepted={(files) => {
                    if (files.length > 0) {
                      setImageFile(files[0]);
                    }
                  }}
                  accept={{
                    "image/jpeg": [".jpeg", ".jpg"],
                    "image/png": [".png"],
                  }}
                  multiple={false}
                  maxFiles={1}
                />
              </div>

              {(imageFile || selectedLot.image) && (
                <div className="mt-4">
                  <div className="relative h-64 w-full rounded-lg border shadow overflow-hidden">
                    <Image
                      src={
                        imageFile
                          ? URL.createObjectURL(imageFile)
                          : selectedLot.image!
                      }
                      alt="Parking lot image"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button onClick={handleUpdateParkingLot}>Save Changes</Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteParkingLot(selectedLotId)}
                >
                  Delete Lot
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
