"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/app/owner/types";

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (customer: Omit<Customer, "id">) => void;
  onCancel: () => void;
}

export default function CustomerForm({ customer, onSubmit, onCancel }: CustomerFormProps) {
  const [formData, setFormData] = useState<Omit<Customer, "id">>({
    userName: customer?.userName || "",
    email: customer?.email || "",
    phoneNumber: customer?.phoneNumber || "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    if (!formData.userName.trim()) newErrors.userName = "Tên khách hàng là bắt buộc";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Định dạng email không hợp lệ";
    if (!formData.phoneNumber.match(/^\d{10,11}$/)) newErrors.phoneNumber = "Số điện thoại phải có 10-11 chữ số";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
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
      <div className="space-y-2">
        <Label htmlFor="userName" className="text-sm font-medium">Tên khách hàng</Label>
        <Input
          id="userName"
          value={formData.userName}
          onChange={(e) => handleChange("userName", e.target.value)}
          className={`transition-all duration-200 ${errors.userName ? "border-red-500" : "border-input"} hover:border-primary focus:ring-2 focus:ring-primary`}
          placeholder="Nhập tên khách hàng"
        />
        {errors.userName && <p className="text-red-500 text-xs mt-1">{errors.userName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className={`transition-all duration-200 ${errors.email ? "border-red-500" : "border-input"} hover:border-primary focus:ring-2 focus:ring-primary`}
          placeholder="Nhập email"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="text-sm font-medium">Số điện thoại</Label>
        <Input
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
          className={`transition-all duration-200 ${errors.phoneNumber ? "border-red-500" : "border-input"} hover:border-primary focus:ring-2 focus:ring-primary`}
          placeholder="Nhập số điện thoại"
        />
        {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
          Lưu
        </Button>
      </div>
    </div>
  );
}