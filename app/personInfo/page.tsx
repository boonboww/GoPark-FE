"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import QRCode from "react-qr-code";
import {
  User,
  Mail,
  Phone,
  Car,
  Pencil,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function PersonInfoPage() {
  const [userInfo, setUserInfo] = useState({
    name: "Nguyen Van A",
    email: "nguyenvana@example.com",
    phone: "0123456789",
  });

  const [registeredVehicles] = useState([
    {
      id: 1,
      plate: "43A-12345",
      document: "123456789",
    },
    {
      id: 2,
      plate: "43B-67890",
      document: "987654321",
    },
  ]);

  const [editingPhone, setEditingPhone] = useState(false);
  const [tempPhone, setTempPhone] = useState(userInfo.phone);

  const handlePhoneSave = () => {
    setUserInfo({ ...userInfo, phone: tempPhone });
    setEditingPhone(false);
    alert("✅ Phone updated!");
  };

  return (
    <>
      <Header />

      <main className="min-h-screen mt-20 px-4 py-12 flex flex-col items-center">
        <h1 className="text-2xl md:text-4xl font-bold mb-8">
          My Account Info
        </h1>

        {/* User Info */}
        <div className="w-full max-w-3xl border rounded-lg shadow-sm p-6 bg-white mb-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-lg font-medium">
              <User className="w-5 h-5" />
              Name: {userInfo.name}
            </div>
            <div className="flex items-center gap-2 text-lg font-medium">
              <Mail className="w-5 h-5" />
              Email: {userInfo.email}
            </div>
            <div className="flex flex-col gap-2">
              <Label className="flex items-center gap-2 text-lg font-medium">
                <Phone className="w-5 h-5" />
                Phone:
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
                    Save
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
                    <Pencil className="w-4 h-4" /> Edit
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="w-full max-w-3xl flex flex-col gap-4 mb-8">
          <h2 className="text-xl md:text-2xl font-bold">
            Registered Vehicles ({registeredVehicles.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {registeredVehicles.map((v) => (
              <div
                key={v.id}
                className="border rounded-lg shadow-sm p-6 bg-white flex flex-col gap-2"
              >
                <h3 className="flex gap-2 items-center font-semibold">
                  <Car className="w-4 h-4" /> Plate: {v.plate}
                </h3>
                <p>
                  <strong>Document:</strong> {v.document}
                </p>
                <QRCode
                  value={`http://localhost:3000/vehicle/${v.id}`}
                  size={100}
                  className="mt-2"
                />
              </div>
            ))}
          </div>

          <Link href="/addVehicle">
            <Button className="flex gap-2 items-center mt-4 bg-black text-white hover:bg-gray-900">
              <Plus className="w-4 h-4" /> Register New Vehicle
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
