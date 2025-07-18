"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon, Car, Plus } from "lucide-react";
import QRCode from "react-qr-code";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import API from "@/lib/api";

interface Vehicle {
  _id?: string;
  licensePlate: string;
  capacity: number;
  imageVehicle?: string;
}

export default function PersonInfoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [registeredVehicles, setRegisteredVehicles] = useState<Vehicle[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/api/v1/users/me");
        const { userName, email, phoneNumber, avatar } = res.data;
        setFormData({
          name: userName,
          email,
          phone: phoneNumber,
          avatar: avatar || "",
        });

        const vehiclesRes = await API.get("/api/v1/vehicles/my-vehicles");
        setRegisteredVehicles(vehiclesRes.data.data);
      } catch (err) {
        console.error("❌ Failed to load info", err);
      }
    };
    fetchData();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = "Tên không được bỏ trống";
    if (!formData.email.includes("@")) newErrors.email = "Email không hợp lệ";
    if (!formData.phone.match(/^\d{10,11}$/))
      newErrors.phone = "Số điện thoại không hợp lệ";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await API.put("/api/v1/users/me", {
        userName: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        avatar: formData.avatar,
      });
      alert("✅ Cập nhật thành công!");
    } catch (err) {
      console.error("❌ Update failed", err);
      alert("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen px-4 py-10 mt-20 flex flex-col items-center gap-10">
        {/* User Info */}
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle>Thông Tin Tài Khoản</CardTitle>
            <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex justify-center w-full md:w-1/3">
                <Avatar className="w-20 h-20">
                  <AvatarImage
                    src={formData.avatar}
                    alt="avatar"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "";
                    }}
                  />
                  <AvatarFallback className="bg-gray-100 text-gray-600 flex items-center justify-center">
                    {formData.avatar ? (
                      formData.name.charAt(0) || "U"
                    ) : (
                      <UserIcon className="w-8 h-8 opacity-60" />
                    )}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex flex-col gap-4 w-full md:w-2/3">
                <div>
                  <Label htmlFor="name">Tên</Label>
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
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Số điện thoại</Label>
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

                <Button onClick={handleUpdate} disabled={loading}>
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle List */}
        <section className="w-full max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            Xe Đã Đăng Ký ({registeredVehicles.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {registeredVehicles.map((v) => (
              <Card key={v._id} className="p-4">
                <CardContent className="space-y-2 p-0">
                  {v.imageVehicle ? (
                    <img
                      src={v.imageVehicle}
                      alt="Xe"
                      className="w-full h-36 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-36 bg-gray-100 flex items-center justify-center rounded-md text-gray-400">
                      <Car className="w-8 h-8" />
                    </div>
                  )}
                  <div className="font-semibold flex items-center gap-2 mt-1">
                    <Car className="w-4 h-4" /> Biển số: {v.licensePlate}
                  </div>
                  <div>
                    <strong>Dung tích:</strong> {v.capacity}
                  </div>
                  <div className="pt-2">
                    <QRCode
                      value={`${baseURL}/addvehicle/${v._id}`}
                      size={80}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Link href="/addVehicle">
            <Button className="flex gap-2 items-center mt-6 bg-black text-white hover:bg-gray-900">
              <Plus className="w-4 h-4" /> Đăng Ký Xe Mới
            </Button>
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
