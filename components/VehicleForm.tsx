// components/VehicleForm.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Vehicle {
  licensePlate: string;
  capacity: number;
  imageVehicle?: string;
}

interface VehicleFormProps {
  onSubmit: (vehicle: Vehicle) => void;
  onCancel: () => void;
}

export default function VehicleForm({ onSubmit, onCancel }: VehicleFormProps) {
  const [formData, setFormData] = useState<Vehicle>({
    licensePlate: "",
    capacity: 4,
    imageVehicle: "",
  });

  const handleChange = (
    field: keyof Vehicle,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label>License Plate</Label>
        <Input
          value={formData.licensePlate}
          onChange={(e) => handleChange("licensePlate", e.target.value)}
        />
      </div>
      <div>
        <Label>Capacity</Label>
        <Input
          type="number"
          value={formData.capacity}
          onChange={(e) => handleChange("capacity", parseInt(e.target.value))}
        />
      </div>
      <div>
        <Label>Image URL (optional)</Label>
        <Input
          value={formData.imageVehicle}
          onChange={(e) => handleChange("imageVehicle", e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Add</Button>
      </div>
    </div>
  );
}
