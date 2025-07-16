"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import QRCode from "react-qr-code";
import { User, Mail, Phone, Car, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import API from "@/lib/api";

// Type for vehicle
interface Vehicle {
  _id?: string;
  licensePlate: string;
  capacity: number;
  imageVehicle?: string;
}

export default function PersonInfoPage() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [registeredVehicles, setRegisteredVehicles] = useState<Vehicle[]>([]);
  const [editingPhone, setEditingPhone] = useState(false);
  const [tempPhone, setTempPhone] = useState("");
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch user + vehicle
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await API.get("/api/v1/users/me");
        const { userName, email, phoneNumber } = userRes.data;
        setUserInfo({ name: userName, email, phone: phoneNumber });
        setTempPhone(phoneNumber);

        const vehiclesRes = await API.get("/api/v1/vehicles/my-vehicles");
        setRegisteredVehicles(vehiclesRes.data.data);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handlePhoneSave = async () => {
    try {
      await API.put("/api/v1/users/me", {
        phoneNumber: tempPhone,
      });
      setUserInfo({ ...userInfo, phone: tempPhone });
      setEditingPhone(false);
      alert("✅ Phone updated!");
    } catch (err) {
      console.error("❌ Update failed", err);
      alert("Update failed!");
    }
  };

  return (
    <>
  <Header />
  <main className="min-h-screen mt-20 px-4 py-12 flex flex-col items-center">
    <h1 className="text-2xl md:text-4xl font-bold mb-8">Thông Tin Tài Khoản</h1>

    {/* User Info */}
    <div className="w-full max-w-3xl border rounded-lg shadow-sm p-6 bg-white mb-12">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-lg font-medium">
          <User className="w-5 h-5" />
          Tên: {userInfo.name}
        </div>
        <div className="flex items-center gap-2 text-lg font-medium">
          <Mail className="w-5 h-5" />
          Email: {userInfo.email}
        </div>
        <div className="flex flex-col gap-2">
          <Label className="flex items-center gap-2 text-lg font-medium">
            <Phone className="w-5 h-5" />
            Số Điện Thoại:
          </Label>
          {editingPhone ? (
            <div className="flex gap-2">
              <Input
                value={tempPhone}
                onChange={(e) => setTempPhone(e.target.value)}
                className="w-full"
              />
              <Button
                className="bg-black text-white hover:bg-gray-900"
                onClick={handlePhoneSave}
              >
                Lưu
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>{userInfo.phone}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingPhone(true)}
                className="flex gap-1 items-center"
              >
                <Pencil className="w-4 h-4" /> Sửa
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Vehicle Info */}
    <div className="w-full max-w-3xl flex flex-col gap-4 mb-8">
      <h2 className="text-xl md:text-2xl font-bold">
        Xe Đã Đăng Ký ({registeredVehicles.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {registeredVehicles.map((v) => (
          <div
            key={v._id}
            className="border rounded-lg shadow-sm p-6 bg-white flex flex-col gap-2"
          >
            {/* ✅ Hình ảnh xe */}
            {v.imageVehicle ? (
              <img
                src={v.imageVehicle}
                alt="Xe"
                className="w-full h-40 object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-md text-gray-400">
                <Car className="w-10 h-10" />
              </div>
            )}

            <h3 className="flex gap-2 items-center font-semibold mt-2">
              <Car className="w-4 h-4" /> Biển Số: {v.licensePlate}
            </h3>
            <p>
              <strong>Dung Tích:</strong> {v.capacity}
            </p>

            <QRCode
              value={`${baseURL}/addvehicle/${v._id}`}
              size={100}
              className="mt-2"
            />
          </div>
        ))}
      </div>

      <Link href="/addVehicle">
        <Button className="flex gap-2 items-center mt-4 bg-black text-white hover:bg-gray-900">
          <Plus className="w-4 h-4" /> Đăng Ký Xe Mới
        </Button>
      </Link>
    </div>
  </main>
  <Footer />
</>
  );
}
