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
        <h2 className="text-lg font-bold mb-4">Chỉnh sửa phương tiện</h2>

        <div className="mb-4">
          <Label>Biển số xe</Label>
          <Input
            value={edited.licensePlate}
            onChange={(e) =>
              setEdited({ ...edited, licensePlate: e.target.value })
            }
          />
        </div>

        <div className="mb-4">
          <Label>Sức chứa</Label>
          <Input
            type="number"
            value={edited.capacity}
            onChange={(e) =>
              setEdited({ ...edited, capacity: Number(e.target.value) })
            }
          />
        </div>

        <div className="mb-4">
          <Label>Đường dẫn hình ảnh</Label>
          <Input
            value={edited.imageVehicle || ""}
            onChange={(e) =>
              setEdited({ ...edited, imageVehicle: e.target.value })
            }
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="outline" className="flex gap-1">
            <X className="w-4 h-4" /> Hủy
          </Button>
          <Button onClick={() => onSave(edited)} className="flex gap-1">
            <Save className="w-4 h-4" /> Lưu
          </Button>
        </div>
      </div>
    </div>
  );
}