import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Vehicle {
  licensePlate: string;
  type: string;
}

interface VehicleFormProps {
  onSubmit: (vehicle: Vehicle) => void;
  onCancel: () => void;
}

export default function VehicleForm({ onSubmit, onCancel }: VehicleFormProps) {
  const [formData, setFormData] = useState<Vehicle>({
    licensePlate: "",
    type: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Vehicle, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Vehicle, string>> = {};
    
    if (!formData.licensePlate.trim()) newErrors.licensePlate = "License plate is required";
    else if (!formData.licensePlate.match(/^[A-Z0-9-]+$/)) newErrors.licensePlate = "Invalid license plate format";
    if (!formData.type) newErrors.type = "Vehicle type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof Vehicle, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="space-y-6 p-4 bg-background rounded-lg">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label htmlFor="licensePlate" className="text-sm font-medium">License Plate</Label>
          <Input
            id="licensePlate"
            value={formData.licensePlate}
            onChange={(e) => handleChange("licensePlate", e.target.value.toUpperCase())}
            className={`transition-all duration-200 ${errors.licensePlate ? "border-red-500" : "border-input"} hover:border-primary focus:ring-2 focus:ring-primary`}
            placeholder="Enter license plate (e.g., 51H-12345)"
          />
          {errors.licensePlate && <p className="text-red-500 text-xs mt-1">{errors.licensePlate}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm font-medium">Vehicle Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange("type", value)}
          >
            <SelectTrigger className={`transition-all duration-200 ${errors.type ? "border-red-500" : "border-input"} hover:border-primary focus:ring-2 focus:ring-primary`}>
              <SelectValue placeholder="Select vehicle type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Car">Car</SelectItem>
              <SelectItem value="Motorbike">Motorbike</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="hover:bg-gray-100 transition-colors duration-200"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-primary hover:bg-primary/90 transition-colors duration-200"
        >
          Save
        </Button>
      </div>
    </div>
  );
}