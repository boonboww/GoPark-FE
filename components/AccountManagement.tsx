"use client";

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
import { useEffect, useState } from "react";
import API from "@/lib/api";
import { User as UserIcon } from "lucide-react";

interface Account {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export default function AccountManagement() {
  const [formData, setFormData] = useState<Account>({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });

  const [errors, setErrors] = useState<Partial<Account>>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch account info on mount
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await API.get("/api/v1/users/me");
        const { userName, email, phoneNumber, avatar } = res.data;
        setFormData({
          name: userName,
          email,
          phone: phoneNumber,
          avatar: avatar || "",
        });
      } catch (err) {
        console.error("❌ Failed to load account", err);
      }
    };
    fetchAccount();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<Account> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email format";
    if (!formData.phone.match(/^\d{10,11}$/))
      newErrors.phone = "Invalid phone number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateAccount = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await API.put("/api/v1/users/me", {
        userName: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        avatar: formData.avatar,
      });
      alert("✅ Account updated!");
    } catch (err) {
      console.error("❌ Failed to update", err);
      alert("Failed to update account");
    } finally {
      setLoading(false);
    }
  };

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
          <div className="flex flex-col items-center justify-center w-1/4 min-h-[300px]">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={formData.avatar || ""}
                alt="Avatar"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "";
                }}
              />
              <AvatarFallback className="bg-gray-100 text-gray-600 flex items-center justify-center">
                {formData.avatar ? (
                  formData.name.charAt(0) || "U"
                ) : (
                  <UserIcon className="w-10 h-10 opacity-60" />
                )}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-col space-y-4 w-3/4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            {/* <div>
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
              />
            </div> */}

            <Button onClick={handleUpdateAccount} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
