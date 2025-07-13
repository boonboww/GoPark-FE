"use client";

import { useEffect, useState } from "react";
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

import type { ParkingLot } from "@/app/owner/types";
import {
  fetchMyParkingLots,
  createParkingLot,
  updateParkingLot,
  deleteParkingLot,
} from "@/lib/parkingLot.api";

export default function ParkingLotManagement() {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [selectedLotId, setSelectedLotId] = useState<string>("");
  const [newLotDialogOpen, setNewLotDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  const [newParkingLot, setNewParkingLot] = useState<Omit<ParkingLot, "_id" | "isActive">>({
    name: "",
    address: "",
    capacity: 0,
    pricePerHour: 0,
    image: [],
  });

  const [streetAddress, setStreetAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");

  const selectedLot = parkingLots.find((lot) => lot._id === selectedLotId);

  const loadParkingLots = async () => {
    const res = await fetchMyParkingLots();
    setParkingLots(res.data.data);
    if (res.data.data.length > 0) {
      setSelectedLotId(res.data.data[0]._id);
    }
  };

  useEffect(() => {
    loadParkingLots();
  }, []);

  useEffect(() => {
    if (selectedLot?.address) {
      const parts = selectedLot.address.split(",").map((s) => s.trim());
      setStreetAddress(parts[0] || "");
      setDistrict(parts[1] || "");
      setCity(parts[2] || "");
    }
  }, [selectedLot]);

  const handleAddParkingLot = async () => {
    const payload = {
      ...newParkingLot,
      address: `${streetAddress}, ${district}, ${city}`,
      image: imageUrl ? [imageUrl] : [],
    };

    await createParkingLot(payload);
    await loadParkingLots();
    setNewLotDialogOpen(false);
    setNewParkingLot({
      name: "",
      address: "",
      capacity: 0,
      pricePerHour: 0,
      image: [],
    });
    setImageUrl("");
    setStreetAddress("");
    setDistrict("");
    setCity("");
  };

  const handleUpdateParkingLot = async () => {
    if (!selectedLotId) return;
    const updated = parkingLots.find((lot) => lot._id === selectedLotId);
    if (!updated) return;

    const payload = {
      ...updated,
      address: `${streetAddress}, ${district}, ${city}`,
      image: updated.image ? updated.image : [],
    };

    try {
      await updateParkingLot(selectedLotId, payload);
      await loadParkingLots();
    } catch (error) {
      console.error("❌ Error while updating:", error);
    }
  };

  const handleDeleteParkingLot = async (id: string) => {
    await deleteParkingLot(id);
    await loadParkingLots();
  };

  return (
    <Card className="shadow-xl rounded-2xl p-4 bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Parking Lot Management</CardTitle>
        <CardDescription className="text-gray-500">
          Add, edit, and manage your parking lots
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <Dialog open={newLotDialogOpen} onOpenChange={setNewLotDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">+ Add New Parking Lot</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] rounded-2xl">
              <DialogHeader>
                <DialogTitle>Create New Parking Lot</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Label>Name</Label>
                <Input
                  className="rounded-xl"
                  value={newParkingLot.name}
                  onChange={(e) =>
                    setNewParkingLot({ ...newParkingLot, name: e.target.value })
                  }
                />
                <Label>Street Address</Label>
                <Input
                  className="rounded-xl"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="123 Lê Lợi"
                />
                <Label>District</Label>
                <Input
                  className="rounded-xl"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Thanh Khê"
                />
                <Label>City</Label>
                <Input
                  className="rounded-xl"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Đà Nẵng"
                />
                <Label>Capacity</Label>
                <Input
                  type="number"
                  className="rounded-xl"
                  value={newParkingLot.capacity}
                  onChange={(e) =>
                    setNewParkingLot({ ...newParkingLot, capacity: Number(e.target.value) })
                  }
                />
                <Label>Price per Hour</Label>
                <Input
                  type="number"
                  className="rounded-xl"
                  value={newParkingLot.pricePerHour}
                  onChange={(e) =>
                    setNewParkingLot({
                      ...newParkingLot,
                      pricePerHour: Number(e.target.value),
                    })
                  }
                />
                <Label>Image URL</Label>
                <Input
                  className="rounded-xl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="preview"
                    className="rounded-xl border shadow w-full h-48 object-cover"
                  />
                )}
                <Button className="w-full rounded-xl" onClick={handleAddParkingLot}>
                  Create
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="w-full md:w-64">
            <Label>Select Parking Lot</Label>
            <Select value={selectedLotId} onValueChange={setSelectedLotId}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select a lot" />
              </SelectTrigger>
              <SelectContent>
                {parkingLots.map((lot) => (
                  <SelectItem key={lot._id} value={lot._id}>
                    {lot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedLot && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border">
            <h3 className="text-lg font-semibold col-span-full">📝 Edit Parking Lot</h3>

            <Label>Name</Label>
            <Input
              className="rounded-xl"
              value={selectedLot.name}
              onChange={(e) =>
                setParkingLots((prev) =>
                  prev.map((lot) =>
                    lot._id === selectedLot._id ? { ...lot, name: e.target.value } : lot
                  )
                )
              }
            />

            <Label>Street Address</Label>
            <Input
              className="rounded-xl"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
            />

            <Label>District</Label>
            <Input
              className="rounded-xl"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />

            <Label>City</Label>
            <Input
              className="rounded-xl"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <Label>Capacity</Label>
            <Input
              type="number"
              className="rounded-xl"
              value={selectedLot.capacity ?? 0}
              onChange={(e) =>
                setParkingLots((prev) =>
                  prev.map((lot) =>
                    lot._id === selectedLot._id
                      ? { ...lot, capacity: Number(e.target.value) }
                      : lot
                  )
                )
              }
            />

            <Label>Price per Hour</Label>
            <Input
              type="number"
              className="rounded-xl"
              value={selectedLot.pricePerHour ?? 0}
              onChange={(e) =>
                setParkingLots((prev) =>
                  prev.map((lot) =>
                    lot._id === selectedLot._id
                      ? { ...lot, pricePerHour: Number(e.target.value) }
                      : lot
                  )
                )
              }
            />

            <Label>Image URL</Label>
            <Input
              className="rounded-xl col-span-full"
              value={selectedLot.image?.[0] || ""}
              onChange={(e) =>
                setParkingLots((prev) =>
                  prev.map((lot) =>
                    lot._id === selectedLot._id
                      ? { ...lot, image: [e.target.value] }
                      : lot
                  )
                )
              }
            />

            {selectedLot.image?.[0] && (
              <img
                src={selectedLot.image[0]}
                alt="parking"
                className="rounded-xl border shadow-md w-full h-48 object-cover col-span-full"
              />
            )}

            <div className="flex gap-4 col-span-full pt-4">
              <Button className="rounded-xl px-6 py-2" onClick={handleUpdateParkingLot}>
                Save Changes
              </Button>
              <Button
                variant="destructive"
                className="rounded-xl px-6 py-2"
                onClick={() => handleDeleteParkingLot(selectedLot._id)}
              >
                Delete Lot
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
