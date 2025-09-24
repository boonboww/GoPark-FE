"use client";

import { Vehicle } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, X, Camera } from "lucide-react";
import { useState } from "react";
import API from "@/lib/api";

export default function EditVehicleForm({
  vehicle,
  onClose,
  onSave,
}: {
  vehicle: Vehicle;
  onClose: () => void;
  onSave: (v: Vehicle) => void;
}) {
  const [edited, setEdited] = useState<Vehicle>(vehicle);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(vehicle.imageVehicle || "");
  const [loading, setLoading] = useState(false);

  // handle chọn file và preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let imageUrl = edited.imageVehicle || "";

      // nếu chọn file mới thì upload
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "vehicle");
        formData.append("userId", vehicle._id); // BE dùng ID vehicle để up

        const uploadRes = await API.post("/api/v1/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadRes.data.url;
      }

      // lưu cập nhật
      const updatedVehicle = { ...edited, imageVehicle: imageUrl };
      onSave(updatedVehicle);
    } catch (err) {
      console.error("Upload image failed:", err);
      alert("❌ Lỗi khi cập nhật hình ảnh.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-md space-y-4">
        <h2 className="text-lg font-bold">Chỉnh sửa phương tiện</h2>

        <div>
          <Label>Biển số xe</Label>
          <Input
            value={edited.licensePlate}
            onChange={(e) =>
              setEdited({ ...edited, licensePlate: e.target.value })
            }
          />
        </div>

        <div>
          <Label>Sức chứa</Label>
          <Input
            type="number"
            value={edited.capacity}
            onChange={(e) =>
              setEdited({ ...edited, capacity: Number(e.target.value) })
            }
          />
        </div>

        <div>
          <Label>Ảnh phương tiện</Label>
          <div className="flex items-center gap-2">
            <label
              htmlFor="vehicle-image"
              className="cursor-pointer text-blue-600 flex items-center gap-1"
            >
              <Camera className="w-5 h-5" /> Chọn ảnh
            </label>
            <input
              id="vehicle-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          {preview && (
            <img
              src={preview}
              alt="Vehicle Preview"
              className="mt-2 w-full h-32 object-cover rounded-md border"
            />
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex gap-1"
            disabled={loading}
          >
            <X className="w-4 h-4" /> Hủy
          </Button>
          <Button onClick={handleSave} className="flex gap-1" disabled={loading}>
            <Save className="w-4 h-4" />
            {loading ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </div>
    </div>
  );
}
