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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

// Định nghĩa interface cho account
interface Account {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

// Định nghĩa interface cho props
interface AccountManagementProps {
  account: Account;
  setAccount: React.Dispatch<React.SetStateAction<Account>>;
}

export default function AccountManagement({ account, setAccount }: AccountManagementProps) {
  const [formData, setFormData] = useState<Account>(account);
  const [errors, setErrors] = useState<Partial<Account>>({});

  // Hàm validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Account> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email format";
    if (!formData.phone.match(/^\d{10,11}$/)) newErrors.phone = "Invalid phone number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm xử lý cập nhật tài khoản
  const handleUpdateAccount = () => {
    if (validateForm()) {
      setAccount(formData);
      alert("Account updated successfully");
    } else {
      alert("Please fix the errors in the form");
    }
  };

  // Hàm xử lý thay đổi input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>Update your account details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-row gap-6">
          {/* Avatar Column */}
          <div className="flex flex-col items-center justify-center w-1/4 min-h-[300px]">
            <Avatar className="w-24 h-24">
              <AvatarImage src={formData.avatar || "https://via.placeholder.com/150"} alt="Avatar" />
              <AvatarFallback className="bg-gray-100 text-gray-600 text-2xl">
                {formData.name.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Form Fields Column */}
          <div className="flex flex-col space-y-4 w-3/4">
            {/* Name Field */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Phone Field */}
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            {/* Save Button */}
            <Button onClick={handleUpdateAccount}>Save Changes</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}