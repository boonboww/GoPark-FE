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
import { Label } from "@/components/ui/label";
import { DropzoneUpload } from "@/components/DropzoneUpload";
import Image from "next/image";
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

interface ParkingLot {
  id: string;
  name: string;
  address: string;
  capacity: number;
  pricePerHour: number;
  image?: string;
}

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
  const [image, setImage] = useState<File | null>(null);
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
            ...(image && { image: URL.createObjectURL(image) }),
          };
        }
        return lot;
      })
    );
    setImage(null);
    alert("Parking lot updated successfully");
  };

  const handleDeleteParkingLot = (id: string) => {
    setParkingLots(parkingLots.filter((lot) => lot.id !== id));
    if (selectedLotId === id) {
      setSelectedLotId(parkingLots[0]?.id || "");
    }
    alert("Parking lot deleted successfully");
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
        <div className="flex justify-between items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add New Parking Lot</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Parking Lot</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="lotName">Name</Label>
                  <Input
                    id="lotName"
                    value={newParkingLot.name}
                    onChange={(e) =>
                      setNewParkingLot({
                        ...newParkingLot,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="lotAddress">Address</Label>
                  <Input
                    id="lotAddress"
                    value={newParkingLot.address}
                    onChange={(e) =>
                      setNewParkingLot({
                        ...newParkingLot,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="lotCapacity">Capacity</Label>
                  <Input
                    id="lotCapacity"
                    type="number"
                    min="1"
                    value={newParkingLot.capacity}
                    onChange={(e) =>
                      setNewParkingLot({
                        ...newParkingLot,
                        capacity: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="lotPricePerHour">Hourly Rate (VND)</Label>
                  <Input
                    id="lotPricePerHour"
                    type="number"
                    min="0"
                    value={newParkingLot.pricePerHour}
                    onChange={(e) =>
                      setNewParkingLot({
                        ...newParkingLot,
                        pricePerHour: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <Button
                  onClick={handleAddParkingLot}
                  disabled={!newParkingLot.name || !newParkingLot.address}
                >
                  Create Parking Lot
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="w-64">
            <Label>Select Parking Lot</Label>
            <Select value={selectedLotId} onValueChange={setSelectedLotId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a parking lot" />
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
                <Label htmlFor="lotNameEdit">Name</Label>
                <Input
                  id="lotNameEdit"
                  value={selectedLot.name}
                  onChange={(e) => {
                    setParkingLots(
                      parkingLots.map((lot) =>
                        lot.id === selectedLotId
                          ? { ...lot, name: e.target.value }
                          : lot
                      )
                    );
                  }}
                />
              </div>
              <div>
                <Label htmlFor="lotAddressEdit">Address</Label>
                <Input
                  id="lotAddressEdit"
                  value={selectedLot.address}
                  onChange={(e) => {
                    setParkingLots(
                      parkingLots.map((lot) =>
                        lot.id === selectedLotId
                          ? { ...lot, address: e.target.value }
                          : lot
                      )
                    );
                  }}
                />
              </div>
              <div>
                <Label htmlFor="lotCapacityEdit">Capacity</Label>
                <Input
                  id="lotCapacityEdit"
                  type="number"
                  min="1"
                  value={selectedLot.capacity}
                  onChange={(e) => {
                    setParkingLots(
                      parkingLots.map((lot) =>
                        lot.id === selectedLotId
                          ? { ...lot, capacity: Number(e.target.value) }
                          : lot
                      )
                    );
                  }}
                />
              </div>
              <div>
                <Label htmlFor="lotPricePerHourEdit">Hourly Rate (VND)</Label>
                <Input
                  id="lotPricePerHourEdit"
                  type="number"
                  min="0"
                  value={selectedLot.pricePerHour}
                  onChange={(e) => {
                    setParkingLots(
                      parkingLots.map((lot) =>
                        lot.id === selectedLotId
                          ? { ...lot, pricePerHour: Number(e.target.value) }
                          : lot
                      )
                    );
                  }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Upload Image</Label>
                <DropzoneUpload
                  onFilesAccepted={(files) => setImage(files[0])}
                  accept="image/*"
                  maxFiles={1}
                />
              </div>

              {(image || selectedLot.image) && (
                <div className="mt-4">
                  <div className="relative h-64 w-full rounded-lg border shadow overflow-hidden">
                    <Image
                      src={
                        image ? URL.createObjectURL(image) : selectedLot.image!
                      }
                      alt="Parking lot preview"
                      fill
                      className="object-cover"
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
                  Delete Parking Lot
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
