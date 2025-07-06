import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Customer } from "@/app/owner/types"; // Sửa dòng import này
import { useState } from "react";

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (customer: Customer) => void;
  onCancel: () => void;
}

export default function CustomerForm({ customer, onSubmit, onCancel }: CustomerFormProps) {
  const [formData, setFormData] = useState<Customer>(
    customer || {
      id: "",
      fullName: "",
      idNumber: "",
      dateOfBirth: "",
      gender: "",
      email: "",
      phoneNumber: "",
      address: "",
      vehicles: [],
    }
  );
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Customer, string>> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.idNumber.match(/^\d{9,12}$/)) newErrors.idNumber = "ID number must be 9-12 digits";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Invalid email format";
    if (!formData.phoneNumber.match(/^\d{10,11}$/)) newErrors.phoneNumber = "Phone number must be 10-11 digits";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof Customer, value: string) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className={`transition-all duration-200 ${errors.fullName ? "border-red-500" : "border-input"} hover:border-primary focus:ring-2 focus:ring-primary`}
            placeholder="Enter full name"
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="idNumber" className="text-sm font-medium">ID Number</Label>
          <Input
            id="idNumber"
            value={formData.idNumber}
            onChange={(e) => handleChange("idNumber", e.target.value)}
            className={`transition-all duration-200 ${errors.idNumber ? "border-red-500" : "border-input"} hover:border-primary focus:ring-2 focus:ring-primary`}
            placeholder="Enter ID number"
          />
          {errors.idNumber && <p className="text-red-500 text-xs mt-1">{errors.idNumber}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            className={`transition-all duration-200 ${errors.dateOfBirth ? "border-red-500" : "border-input"} hover:border-primary focus:ring-2 focus:ring-primary`}
          />
          {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleChange("gender", value)}
          >
            <SelectTrigger className={`transition-all duration-200 ${errors.gender ? "border-red-500" : "border-input"} hover:border-primary focus:ring-2 focus:ring-primary`}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`transition-all duration-200 ${errors.email ? "border-red-500" : "border-input"} hover:border-primary focus:ring-2 focus:ring-primary`}
            placeholder="Enter email address"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            className={`transition-all duration-200 ${errors.phoneNumber ? "border-red-500" : "border-input"} hover:border-primary focus:ring-2 focus:ring-primary`}
            placeholder="Enter phone number"
          />
          {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address" className="text-sm font-medium">Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className={`transition-all duration-200 ${errors.address ? "border-red-500" : "border-input"} hover:border-primary focus:ring-2 focus:ring-primary`}
            placeholder="Enter address"
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
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