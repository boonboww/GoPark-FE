"use client";

import { Vehicle } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, X, Camera, AlertTriangle } from "lucide-react";
import { useState } from "react";
import API from "@/lib/api";
import { useToast } from "@/components/providers/ToastProvider";

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
  const [licensePlateError, setLicensePlateError] = useState<string>("");
  const [capacityError, setCapacityError] = useState<string>("");
  const toast = useToast();

  // Validate biển số xe theo format Việt Nam
  const validateLicensePlate = (plate: string): boolean => {
    if (!plate || plate.trim() === "") {
      setLicensePlateError("Biển số xe không được để trống");
      return false;
    }

    // Format mới và cũ cho ô tô
    const carFormat = /^[0-9]{2}[A-Z]{1}[-\s]?[0-9]{4,5}$/i;

    // Format cho xe máy
    const motorbikeFormat =
      /^[0-9]{2}[A-Z]{1}[-\s]?[0-9]{2}[-\s]?[0-9]{3}\.[0-9]{2}$/i;

    const trimmedPlate = plate.trim().toUpperCase();

    if (!carFormat.test(trimmedPlate) && !motorbikeFormat.test(trimmedPlate)) {
      setLicensePlateError(
        "Biển số không đúng định dạng. VD: 30A-12345, 51B-12345, 29C-123.45"
      );
      return false;
    }

    setLicensePlateError("");
    return true;
  };

  // Validate sức chứa
  const validateCapacity = (capacity: number): boolean => {
    if (!capacity || capacity < 1) {
      setCapacityError("Sức chứa phải lớn hơn 0");
      return false;
    }
    if (capacity > 50) {
      setCapacityError("Sức chứa không được vượt quá 50");
      return false;
    }
    setCapacityError("");
    return true;
  };

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
    // Kiểm tra token
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }

    // Validate tất cả các trường
    const isLicensePlateValid = validateLicensePlate(edited.licensePlate);
    const isCapacityValid = validateCapacity(edited.capacity);

    if (!isLicensePlateValid || !isCapacityValid) {
      toast.error("Vui lòng kiểm tra lại các trường thông tin!");
      return;
    }

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
      const updatedVehicle = {
        ...edited,
        licensePlate: edited.licensePlate.toUpperCase().trim(),
        imageVehicle: imageUrl,
      };

      // Gọi callback để lưu (sẽ call API PUT)
      onSave(updatedVehicle);
    } catch (err: any) {
      console.error("Upload image failed:", err);

      // Xử lý lỗi 401
      if (err.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return;
      }

      toast.error("Lỗi khi cập nhật phương tiện.");
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel với xác nhận nếu có thay đổi
  const handleCancel = () => {
    const hasChanges =
      edited.licensePlate !== vehicle.licensePlate ||
      edited.capacity !== vehicle.capacity ||
      file !== null;

    if (hasChanges) {
      const confirmed = window.confirm(
        "Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn hủy?"
      );
      if (!confirmed) return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-md space-y-4">
        <h2 className="text-lg font-bold">Chỉnh sửa phương tiện</h2>

        <div>
          <Label>
            Biển số xe <span className="text-red-500">*</span>
          </Label>
          <Input
            value={edited.licensePlate}
            onChange={(e) => {
              setEdited({ ...edited, licensePlate: e.target.value });
              setLicensePlateError("");
            }}
            onBlur={() => validateLicensePlate(edited.licensePlate)}
            placeholder="VD: 30A-12345"
            className={licensePlateError ? "border-red-500" : ""}
          />
          {licensePlateError && (
            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {licensePlateError}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Format: XX[A-Z]-XXXXX hoặc XX[A-Z]-XX-XXX.XX
          </p>
        </div>

        <div>
          <Label>
            Sức chứa <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            min="1"
            max="50"
            value={edited.capacity}
            onChange={(e) => {
              setEdited({ ...edited, capacity: Number(e.target.value) });
              setCapacityError("");
            }}
            onBlur={() => validateCapacity(edited.capacity)}
            placeholder="VD: 4"
            className={capacityError ? "border-red-500" : ""}
          />
          {capacityError && (
            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {capacityError}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">Số chỗ ngồi (1-50)</p>
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
            onClick={handleCancel}
            variant="outline"
            className="flex gap-1"
            disabled={loading}
          >
            <X className="w-4 h-4" /> Hủy
          </Button>
          <Button
            onClick={handleSave}
            className="flex gap-1"
            disabled={loading}
          >
            <Save className="w-4 h-4" />
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </div>
    </div>
  );
}
