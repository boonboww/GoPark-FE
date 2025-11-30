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
import { useEffect, useRef, useState } from "react";
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [userId, setUserId] = useState<string>(""); // <-- thêm userId
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch account info on mount
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await API.get("/api/v1/users/me");
        // backend có thể trả profilePicture hoặc avatar, lấy _id làm userId
        const { _id, userName, email, phoneNumber, profilePicture, avatar } =
          res.data;
        setUserId(_id || res.data.id || "");
        setFormData({
          name: userName || "",
          email: email || "",
          phone: phoneNumber || "",
          avatar: (profilePicture || avatar) ?? "",
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
      let avatarUrl = formData.avatar;

      // Nếu có file ảnh mới → upload qua route BE /api/v1/upload (BE đã xử lý Supabase)
      if (avatarFile && userId) {
        const data = new FormData();
        // backend của bạn trước đó dùng "file", "type", "userId" — giữ giống vậy để tương thích
        data.append("file", avatarFile);
        data.append("type", "avatar");
        data.append("userId", userId);

        const uploadRes = await API.post("/api/v1/upload", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // kiểm tra response, lấy url
        avatarUrl = uploadRes?.data?.url || avatarUrl;
        if (!avatarUrl) {
          throw new Error("Upload failed: no url returned");
        }
      }

      // cập nhật thông tin user ở BE
      // Ở file PersonInfoPage bạn đang dùng users_new để PUT => đồng bộ theo đó
      if (!userId) throw new Error("User ID missing");

      await API.put(`/api/v1/users_new/${userId}`, {
        userName: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        avatar: avatarUrl,
      });

      // cập nhật local state + clear file
      setFormData((prev) => ({ ...prev, avatar: avatarUrl }));
      setAvatarFile(null);
      setAvatarPreview("");
      alert("✅ Account updated!");
    } catch (err) {
      console.error("❌ Failed to update", err);
      alert("Failed to update account");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý chọn file ảnh
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Xóa ảnh preview nếu huỷ chọn
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông Tin Tài Khoản</CardTitle>
        <CardDescription>Cập nhật thông tin tài khoản của bạn</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar + upload */}
          <div className="flex flex-col items-center justify-center md:w-1/4 w-full min-h-[220px] gap-4">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={avatarPreview || formData.avatar || ""}
                alt="Ảnh đại diện"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "";
                }}
              />
              <AvatarFallback className="bg-gray-100 text-gray-600 flex items-center justify-center">
                {formData.avatar ? formData.name.charAt(0) || "U" : <UserIcon className="w-10 h-10 opacity-60" />}
              </AvatarFallback>
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              size="sm"
            >
              {avatarFile ? "Đổi Ảnh" : "Chọn Ảnh"}
            </Button>
            {avatarFile && (
              <span className="text-xs text-gray-500 max-w-[120px] truncate">{avatarFile.name}</span>
            )}
          </div>

          {/* Form fields */}
          <div className="flex flex-col space-y-4 md:w-3/4 w-full">
            <div>
              <Label htmlFor="name">Tên</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Số Điện Thoại</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            <Button onClick={handleUpdateAccount} disabled={loading}>
              {loading ? "Đang Lưu..." : "Lưu Thay Đổi"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
