"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Vehicle } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Car, AlertTriangle, Lock } from "lucide-react";
import QRCode from "react-qr-code";
import EditVehicleForm from "./EditVehicleForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ApiError {
  response?: {
    data?: {
      field?: string;
      message?: string;
    };
  };
}

export default function AddVehiclePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, "_id">>({
    licensePlate: "",
    capacity: 4,
    imageVehicle: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [imageError, setImageError] = useState<string>("");

  const MAX_VEHICLES = 3;

  useEffect(() => {
    fetchMyVehicles();
  }, []);

  const fetchMyVehicles = async () => {
    try {
      const res = await API.get<{ data: Vehicle[] }>("/api/v1/vehicles/my-vehicles");
      setVehicles(res.data.data || []);
    } catch (error) {
      console.error(error);
      setMessage("Lỗi: Không thể tải danh sách phương tiện.");
    }
  };

  const handleAddVehicle = async () => {
    if (vehicles.length >= MAX_VEHICLES) {
      setMessage("Lỗi: Bạn chỉ được đăng ký tối đa 3 phương tiện.");
      return;
    }
    if (!newVehicle.licensePlate || !newVehicle.capacity) {
      setMessage("Lỗi: Vui lòng điền biển số và sức chứa.");
      return;
    }

    try {
      let imageUrl = "";
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await API.post("/api/v1/upload?folder=vehicles", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadRes.data.url;
      }

      await API.post("/api/v1/vehicles", { ...newVehicle, imageVehicle: imageUrl });

      setMessage("✅ Thêm phương tiện thành công!");
      setNewVehicle({ licensePlate: "", capacity: 4, imageVehicle: "" });
      setFile(null);
      fetchMyVehicles();
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.data?.field === "licensePlate") {
        setMessage("Lỗi: Biển số này đã được đăng ký.");
        return;
      }
      console.error(error);
      setMessage("Lỗi: Thêm phương tiện thất bại.");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Bạn có chắc chắn muốn xóa phương tiện này?")) return;
    try {
      await API.delete(`/api/v1/vehicles/${id}`);
      fetchMyVehicles();
    } catch (error) {
      console.error(error);
      setMessage("Lỗi: Xóa phương tiện thất bại.");
    }
  };

  const handleUpdate = async (vehicle: Vehicle) => {
    if (!vehicle._id) return;
    try {
      await API.put(`/api/v1/vehicles/${vehicle._id}`, vehicle);
      setEditing(null);
      fetchMyVehicles();
    } catch (error) {
      console.error(error);
      setMessage("Lỗi: Cập nhật phương tiện thất bại.");
    }
  };

  const handleImageError = () => setImageError("Không thể tải hình ảnh.");

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16 space-y-10">
        <h1 className="text-3xl font-bold text-center text-primary">Phương Tiện Của Tôi</h1>

        {/* Form Thêm Vehicle */}
        <section className="bg-white p-6 rounded-xl shadow-md space-y-4 border">
          {vehicles.length >= MAX_VEHICLES && (
            <div className="text-red-600 flex gap-2 items-center">
              <Lock className="w-4 h-4" /> Bạn chỉ được đăng ký tối đa 3 phương tiện.
            </div>
          )}
          <div>
            <Label>Biển số xe</Label>
            <Input
              value={newVehicle.licensePlate}
              onChange={(e) =>
                setNewVehicle({ ...newVehicle, licensePlate: e.target.value })
              }
              placeholder="VD: 43A-12345"
            />
          </div>
          <div>
            <Label>Sức chứa</Label>
            <Input
              type="number"
              value={newVehicle.capacity}
              onChange={(e) =>
                setNewVehicle({ ...newVehicle, capacity: Number(e.target.value) })
              }
              placeholder="VD: 4"
            />
          </div>
          <div>
            <Label>Ảnh phương tiện (tùy chọn)</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
            />
            {imageError && <p className="text-sm text-red-600">{imageError}</p>}
          </div>

          <div className="flex items-center justify-between">
            <Button
              onClick={handleAddVehicle}
              className="flex gap-2 items-center"
              disabled={vehicles.length >= MAX_VEHICLES}
            >
              <Plus className="w-4 h-4" /> Thêm phương tiện
            </Button>
            {message && (
              <div
                className={`flex gap-2 items-center text-sm ${
                  message.startsWith("Lỗi") ? "text-red-600" : "text-green-600"
                }`}
              >
                <AlertTriangle className="w-4 h-4" /> <span>{message}</span>
              </div>
            )}
          </div>
        </section>

        {/* Vehicle Cards */}
        <section className="grid md:grid-cols-2 gap-6">
          {vehicles.map((v) => {
            const vehicleUrl = `http://localhost:3000/vehicle/${v._id}`;
            return (
              <div
                key={v._id}
                className="bg-white rounded-lg shadow-md border p-5 flex flex-col gap-2"
              >
                <div className="flex gap-4 items-start">
                  {v.imageVehicle ? (
                    <img
                      src={v.imageVehicle}
                      alt="Vehicle"
                      className="w-28 h-20 object-cover rounded-md"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-28 h-20 bg-gray-100 flex items-center justify-center rounded-md text-gray-400">
                      <Car className="w-8 h-8" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{v.licensePlate}</p>
                    <p className="text-sm text-gray-500">Sức chứa: {v.capacity} chỗ</p>
                    <div className="mt-2">
                      <QRCode value={vehicleUrl} size={80} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <Button variant="outline" onClick={() => setEditing(v)} className="flex gap-1 items-center">
                    <Pencil className="w-4 h-4" /> Sửa
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(v._id)} className="flex gap-1 items-center">
                    <Trash2 className="w-4 h-4" /> Xóa
                  </Button>
                </div>
              </div>
            );
          })}
          {vehicles.length === 0 && (
            <p className="text-center text-gray-500 text-sm col-span-full">
              Bạn chưa có phương tiện nào đăng ký.
            </p>
          )}
        </section>

        {editing && <EditVehicleForm vehicle={editing} onClose={() => setEditing(null)} onSave={handleUpdate} />}
      </main>
      <Footer />
    </>
  );
}
