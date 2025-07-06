// components/AccountManagement.tsx
"use client";

import { useState, useEffect } from "react";
import { Account } from "@/app/owner/type"; // Adjust the import path as necessary
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
import { Loader2 } from "lucide-react";

interface AccountManagementProps {
  account: Account;
  setAccount: React.Dispatch<React.SetStateAction<Account>>;
}

export default function AccountManagement({ 
  account, 
  setAccount 
}: AccountManagementProps) {
  const [formData, setFormData] = useState<Account>(account);
  const [errors, setErrors] = useState<Partial<Account>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update form data when account prop changes
  useEffect(() => {
    setFormData(account);
  }, [account]);

  // Handle file selection for avatar
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: Partial<Account> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.phone.match(/^[0-9]{10,11}$/)) {
      newErrors.phone = "Phone number must be 10-11 digits";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    
    if (!validateForm()) {
      setErrorMessage("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update account with new data
      const updatedAccount: Account = {
        ...formData,
        ...(avatarPreview && { avatar: avatarPreview }),
      };
      
      setAccount(updatedAccount);
      setSuccessMessage("Account updated successfully");
    } catch (error) {
      setErrorMessage("Failed to update account");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Account Information</CardTitle>
        <CardDescription>Update your account details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success/Error Messages */}
          {successMessage && (
            <div className="p-4 bg-green-100 text-green-800 rounded-md">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="p-4 bg-red-100 text-red-800 rounded-md">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Column */}
            <div className="flex flex-col items-center space-y-4 w-full md:w-1/3">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage 
                    src={avatarPreview || formData.avatar || "https://github.com/shadcn.png"} 
                    alt="User avatar" 
                  />
                  <AvatarFallback className="text-4xl">
                    {formData.name.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <label 
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <p className="text-sm text-muted-foreground">
                Click on the avatar to upload a new image
              </p>
            </div>

            {/* Form Fields Column */}
            <div className="space-y-4 w-full md:w-2/3">
              {/* Name Field */}
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Role Field (readonly) */}
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  readOnly
                  className="opacity-70 cursor-not-allowed"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}