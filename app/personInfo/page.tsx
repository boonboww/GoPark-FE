"use client";
import { useEffect, useState } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon, Car, Plus, Camera, Save} from "lucide-react";
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [registeredVehicles, setRegisteredVehicles] = useState<Vehicle[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>(""); 
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch user info & vehicles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/api/v1/users/me");
        const { _id, userName, email, phoneNumber, profilePicture } = res.data;
        setUserId(_id);
        setFormData({
          name: userName,
          email,
          phone: phoneNumber,
          avatar: profilePicture || "",
        });
        const vehiclesRes = await API.get("/api/v1/vehicles/my-vehicles");
        setRegisteredVehicles(vehiclesRes.data.data);
      } catch (err) {
        console.error("❌ Failed to load info", err);
      }
    };
    fetchData();
  }, []);

  // Input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  // Avatar change & preview
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Update user info
  const handleUpdate = async () => {
    setLoading(true);
    try {
      if (!formData.name || !formData.email || !formData.phone) {
        setErrors({
          name: !formData.name ? "Vui lòng nhập tên" : "",
          email: !formData.email ? "Vui lòng nhập email" : "",
          phone: !formData.phone ? "Vui lòng nhập số điện thoại" : "",
        });
        setLoading(false);
        return;
      }

      let avatarUrl = formData.avatar;

      // Nếu có file mới → upload
      if (avatarFile && userId) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", avatarFile);
        formDataUpload.append("type", "avatar");
        formDataUpload.append("userId", userId);
        const uploadRes = await API.post("/api/v1/upload", formDataUpload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        avatarUrl = uploadRes.data.url;
        setFormData(prev => ({ ...prev, avatar: avatarUrl }));
      }

      // PUT /users/:id
      await API.put(`/api/v1/users_new/${userId}`, {
        userName: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        avatar: avatarUrl,
      });

      alert("✅ Cập nhật thành công!");
      setAvatarFile(null);
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
              {/* Avatar */}
              <div className="flex flex-col items-center w-full md:w-1/3 gap-2">
                <Avatar className="w-28 h-28">
                  <AvatarImage src={formData.avatar} alt="avatar" />
                  <AvatarFallback>
                    {formData.avatar ? formData.name.charAt(0) : <UserIcon />}
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="avatar-upload" className="flex items-center gap-2 mt-2 cursor-pointer">
                  <Camera className="w-5 h-5" />
                  Chọn ảnh đại diện
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>

              {/* Form Info */}
              <div className="flex flex-col gap-4 w-full md:w-2/3">
                {["name", "email", "phone"].map((field) => (
                  <div key={field} className="flex flex-col gap-2">
                    <Label htmlFor={field}>
                      {field === "name" ? "Tên" : field === "email" ? "Email" : "Số điện thoại"}
                    </Label>
                    <Input
                      id={field}
                      value={formData[field as "name" | "email" | "phone"]}
                      onChange={handleInputChange}
                    />
                    {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                  </div>
                ))}
                <Button onClick={handleUpdate} disabled={loading}>
                  <Save className="w-4 h-4" />
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
                <CardContent>
                  {v.imageVehicle ? (
                    <img src={v.imageVehicle} alt="Xe" className="w-full h-36 object-cover rounded-md" />
                  ) : (
                    <div className="w-full h-36 bg-gray-100 flex items-center justify-center rounded-md">
                      <Car className="w-8 h-8" />
                    </div>
                  )}
                  <div className="font-semibold mt-2">Biển số: {v.licensePlate}</div>
                  <div><strong>Dung tích:</strong> {v.capacity}</div>
                  <div className="pt-2">
                    <QRCode value={`${baseURL}/addvehicle/${v._id}`} size={80} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Link href="/addVehicle">
            <Button className="mt-6">
              <Plus className="w-4 h-4" /> Đăng Ký Xe Mới
            </Button>
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
