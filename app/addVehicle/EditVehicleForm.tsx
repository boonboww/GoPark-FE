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
          <Label>Type</Label>
          <Input
            value={edited.type}
            onChange={(e) =>
              setEdited({ ...edited, type: e.target.value })
            }
          />
        </div>

        <div className="mb-4">
          <Label>Plate</Label>
          <Input
            value={edited.plate}
            onChange={(e) =>
              setEdited({ ...edited, plate: e.target.value })
            }
          />
        </div>

        <div className="mb-4">
          <Label>Document</Label>
          <Input
            value={edited.document}
            onChange={(e) =>
              setEdited({ ...edited, document: e.target.value })
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
