"use client";

import { Vehicle } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { useState } from "react";

export default function EditVehicleForm({
  vehicle,
  onClose,
  onSave,
}: {
  vehicle: Vehicle;
  onClose: () => void;
  onSave: (v: Vehicle) => void;
}) {
  const [edited, setEdited] = useState<Vehicle>(vehicle);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-md">
        <h2 className="text-lg font-bold mb-4">Edit Vehicle</h2>

        <div className="mb-4">
          <Label>License Plate *</Label>
          <Input
            value={edited.licensePlate}
            onChange={(e) =>
              setEdited({ ...edited, licensePlate: e.target.value })
            }
            required
          />
        </div>

        <div className="mb-4">
          <Label>Capacity *</Label>
          <Input
            type="number"
            value={edited.capacity}
            onChange={(e) =>
              setEdited({ ...edited, capacity: Number(e.target.value) })
            }
            min="1"
            required
          />
        </div>

        <div className="mb-4">
          <Label>Image URL</Label>
          <Input
            value={edited.imageVehicle}
            onChange={(e) =>
              setEdited({ ...edited, imageVehicle: e.target.value })
            }
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex gap-1 cursor-pointer items-center"
          >
            <X className="w-4 h-4" /> Cancel
          </Button>

          <Button
            onClick={() => onSave(edited)}
            className="flex gap-1 cursor-pointer items-center"
          >
            <Save className="w-4 h-4" /> Save
          </Button>
        </div>
      </div>
    </div>
  );
}