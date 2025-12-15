"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Edit3, MapPin, Building2, Trash2, Camera, X, DollarSign, CreditCard } from "lucide-react";
import { updateParkingLot } from "@/lib/parkingLot.api";
import type { ParkingLot } from "@/app/owner/types";
import { useEffect, useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import API from "@/lib/api";
import dynamic from "next/dynamic";

const ParkingLocationPicker = dynamic(
  () => import("./ParkingLocationPicker"),
  { ssr: false }
);

interface Props {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  selectedLot?: ParkingLot;
  onUpdate: () => void;
  onDelete: (id: string) => void;
  setParkingLots: React.Dispatch<React.SetStateAction<ParkingLot[]>>;
}

export default function EditParkingLotDialog({
  open,
  onOpenChange,
  selectedLot,
  onUpdate,
  onDelete,
  setParkingLots,
}: Props) {
  const toast = useToast();
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]); // ảnh bãi
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // avatar mới
  
  // New states for missing fields
  const [pricePerHour, setPricePerHour] = useState(0);
  const [description, setDescription] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [zoneCount, setZoneCount] = useState(1);
  const [zoneValues, setZoneValues] = useState<{ zone: string; count: number }[]>([]);

  useEffect(() => {
    if (selectedLot?.address) {
      const [s, d, c] = selectedLot.address.split(",").map((s) => s.trim());
      setStreet(s || "");
      setDistrict(d || "");
      setCity(c || "");
    }
    setImages(selectedLot?.image || []);
    setNewFiles([]);
    setAvatarFile(null);
    
    // Initialize new fields
    if (selectedLot) {
      setPricePerHour(selectedLot.pricePerHour || 0);
      setDescription(selectedLot.description || "");
      setPaymentMethods(selectedLot.allowedPaymentMethods || []);
      
      if (selectedLot.location?.coordinates) {
        setLongitude(selectedLot.location.coordinates[0]?.toString() || "");
        setLatitude(selectedLot.location.coordinates[1]?.toString() || "");
      }
      
      if (selectedLot.zones && selectedLot.zones.length > 0) {
        setZoneValues(selectedLot.zones);
        setZoneCount(selectedLot.zones.length);
      } else {
        setZoneValues([{ zone: "A", count: 10 }]);
        setZoneCount(1);
      }
    }
  }, [selectedLot]);

  // chọn nhiều ảnh bãi
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setNewFiles((prev) => [...prev, ...files]);
  };

  // xóa preview ảnh bãi
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    const removedUrl = images[index];
    setNewFiles((prev) => prev.filter((file) => !removedUrl.includes(file.name)));
  };

  const handleUpdate = async () => {
    if (!selectedLot) return;

    // Validation
    if (!selectedLot.name.trim()) {
      toast.error("Vui lòng nhập tên bãi đỗ xe");
      return;
    }
    if (!street.trim() || !district.trim() || !city.trim()) {
      toast.error("Vui lòng nhập đầy đủ địa chỉ (Đường, Quận/Huyện, Thành phố)");
      return;
    }
    if (!latitude || !longitude) {
      toast.error("Vui lòng nhập hoặc chọn tọa độ bãi đỗ xe");
      return;
    }
    if (pricePerHour < 0) {
      toast.error("Vui lòng nhập giá tiền hợp lệ (>= 0)");
      return;
    }
    if (paymentMethods.length === 0) {
      toast.error("Vui lòng chọn ít nhất một phương thức thanh toán");
      return;
    }
    if (zoneValues.length === 0) {
      toast.error("Vui lòng thêm ít nhất một khu vực đỗ xe");
      return;
    }

    setIsLoading(true);

    try {
      // --- Upload ảnh bãi mới ---
      let finalImages: string[] = [...images];
      if (newFiles.length > 0) {
        const formData = new FormData();
        newFiles.forEach((file) => formData.append("files", file));
        formData.append("type", "parkinglotImages");
        formData.append("userId", selectedLot._id);

        const uploadRes = await API.post("/api/v1/upload/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const uploadedUrls: string[] = uploadRes.data.urls;
        finalImages = [
          ...images.filter((img) => !img.startsWith("data:")), // giữ ảnh cũ (link Supabase)
          ...uploadedUrls,
        ];
      }

      // --- Upload avatar mới ---
      let avatarUrl = selectedLot.avtImage || "";
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        formData.append("type", "parkinglotAvatar");
        formData.append("userId", selectedLot._id);

        const uploadRes = await API.post("/api/v1/upload/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        avatarUrl = uploadRes.data.url;
      }

      // --- Payload gửi update ---
      const payload = {
        ...selectedLot,
        address: `${street}, ${district}, ${city}`,
        image: finalImages,
        avtImage: avatarUrl,
        pricePerHour,
        description,
        allowedPaymentMethods: paymentMethods,
        zones: zoneValues,
        location: {
          type: "Point",
          coordinates: [Number(longitude), Number(latitude)] as [number, number],
        },
      };

      await updateParkingLot(selectedLot._id, payload);
      toast.success("✅ Cập nhật bãi đỗ thành công!");

      setNewFiles([]);
      setAvatarFile(null);
      onUpdate();
      onOpenChange(false);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Lỗi khi cập nhật bãi đỗ";
      toast.error(`❌ ${errorMessage}`);
      console.error("Error updating parking lot:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedLot) return;
    
    // Confirm dialog
    if (!window.confirm("Bạn có chắc chắn muốn xóa bãi đỗ xe này? Hành động này không thể hoàn tác.")) {
      return;
    }

    setIsLoading(true);
    try {
      await onDelete(selectedLot._id);
      toast.success("✅ Xóa bãi đỗ xe thành công!");
      onOpenChange(false);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Lỗi khi xóa bãi đỗ";
      toast.error(`❌ ${errorMessage}`);
      console.error("Error deleting parking lot:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="w-full md:w-auto cursor-pointer hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors"
          variant="outline"
          disabled={!selectedLot}
        >
          <Edit3 className="w-4 h-4 mr-2" />
          <span className="font-medium">Sửa & Xóa</span>
        </Button>
      </DialogTrigger>

      {selectedLot && (
        <DialogContent className="sm:max-w-[750px] rounded-lg">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-lg font-semibold">
              Chỉnh sửa bãi đậu xe
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 max-h-[70vh] overflow-y-auto">
            {/* Tên bãi */}
            <div className="md:col-span-2 space-y-1">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Tên bãi đậu xe
              </Label>
              <Input
                className="rounded-md"
                value={selectedLot.name}
                onChange={(e) =>
                  setParkingLots((prev) =>
                    prev.map((lot) =>
                      lot._id === selectedLot._id
                        ? { ...lot, name: e.target.value }
                        : lot
                    )
                  )
                }
              />
            </div>

            {/* Địa chỉ */}
            <div className="space-y-1">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Đường
              </Label>
              <Input value={street} onChange={(e) => setStreet(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Quận/Huyện
              </Label>
              <Input value={district} onChange={(e) => setDistrict(e.target.value)} />
            </div>
            <div className="md:col-span-2 space-y-1">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Thành phố
              </Label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} />
            </div>

            {/* Location Inputs */}
            <div className="space-y-1">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Kinh độ (Longitude)
              </Label>
              <Input
                className="rounded-md"
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Nhập kinh độ"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Vĩ độ (Latitude)
              </Label>
              <Input
                className="rounded-md"
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Nhập vĩ độ"
              />
            </div>

            {/* Map Picker */}
            <div className="md:col-span-2 space-y-1">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Chọn vị trí trên bản đồ
              </Label>
              <ParkingLocationPicker
                lat={parseFloat(latitude) || 21.028511}
                lng={parseFloat(longitude) || 105.854444}
                onLocationSelect={(lat, lng) => {
                  setLatitude(lat.toString());
                  setLongitude(lng.toString());
                }}
              />
            </div>

            {/* Payment Methods */}
            <div className="md:col-span-2 space-y-1">
              <Label className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                Phương thức thanh toán
              </Label>
              <div className="flex gap-4 flex-wrap">
                {[
                  { value: "prepaid", label: "Trả trước" },
                  { value: "pay-at-parking", label: "Trả tại bãi" },
                ].map((method) => (
                  <label
                    key={method.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={paymentMethods.includes(method.value)}
                      onChange={() => handlePaymentMethodChange(method.value)}
                      className="rounded"
                    />
                    <span className="text-sm">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Zones */}
            <div className="md:col-span-2 space-y-1">
              <Label className="text-sm font-medium">Số khu vực</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                value={zoneCount}
                onChange={(e) => {
                  const count = Number(e.target.value);
                  setZoneCount(count);
                  const newZones = [];
                  for (let i = 0; i < count; i++) {
                    const zoneName = String.fromCharCode(65 + i);
                    newZones.push({
                      zone: zoneName,
                      count: zoneValues[i]?.count || 10,
                    });
                  }
                  setZoneValues(newZones);
                }}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} khu vực
                  </option>
                ))}
              </select>
            </div>

            {zoneValues.map((z, index) => (
              <div
                key={`zone-${index}`}
                className="md:col-span-2 border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Khu vực {z.zone}</h4>
                  <span className="text-sm text-gray-500">
                    Tổng: {z.count} chỗ
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Tên khu vực</Label>
                    <Input
                      className="rounded-md bg-gray-50"
                      value={z.zone}
                      disabled
                      placeholder="Tên khu tự động"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Số chỗ đậu</Label>
                    <Input
                      className="rounded-md"
                      type="number"
                      min="1"
                      max="100"
                      value={z.count}
                      onChange={(e) => {
                        const updated = [...zoneValues];
                        updated[index].count = Math.max(
                          1,
                          Number(e.target.value)
                        );
                        setZoneValues(updated);
                      }}
                      placeholder="Số lượng"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Price */}
            <div className="md:col-span-2 space-y-1">
              <Label className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                Giá mỗi giờ (VND)
              </Label>
              <Input
                className="rounded-md"
                type="number"
                min="0"
                step="1000"
                value={pricePerHour === 0 ? "" : pricePerHour}
                onChange={(e) => {
                  let val = e.target.value;
                  if (val.startsWith("-")) return;
                  if (val === "") {
                    setPricePerHour(0);
                    return;
                  }
                  if (val.length > 1 && val.startsWith("0") && !val.includes(".")) {
                    val = val.replace(/^0+/, "");
                    if (val === "") val = "0";
                  }
                  const numVal = Number(val);
                  if (numVal >= 0) {
                    setPricePerHour(numVal);
                  }
                }}
                placeholder="Nhập giá theo VND"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-1">
              <Label className="text-sm font-medium">Mô tả</Label>
              <textarea
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 min-h-[80px] resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả bãi đỗ..."
              />
            </div>

            {/* Avatar bãi */}
            <div className="md:col-span-2 space-y-2">
              <Label className="text-sm font-medium">Ảnh đại diện bãi</Label>
              <label htmlFor="parkinglot-avatar" className="flex items-center gap-2 cursor-pointer text-blue-600">
                <Camera className="w-5 h-5" />
                Chọn ảnh
              </label>
              <input
                id="parkinglot-avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setAvatarFile(file);
                }}
              />

              {avatarFile ? (
                <img
                  src={URL.createObjectURL(avatarFile)}
                  alt="Avatar bãi"
                  className="w-32 h-32 object-cover rounded-md mt-2"
                />
              ) : selectedLot.avtImage ? (
                <img
                  src={selectedLot.avtImage}
                  alt="Avatar bãi"
                  className="w-32 h-32 object-cover rounded-md mt-2"
                />
              ) : null}
            </div>

            {/* Ảnh bãi */}
            <div className="md:col-span-2 space-y-2">
              <Label className="text-sm font-medium">Ảnh bãi đỗ xe</Label>
              <label htmlFor="parkinglot-image" className="flex items-center gap-2 cursor-pointer text-blue-600">
                <Camera className="w-5 h-5" />
                Chọn ảnh
              </label>
              <input
                id="parkinglot-image"
                type="file"
                accept="image/*"
                className="hidden"
                multiple
                onChange={handleImageChange}
              />

              {/* preview */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {images.map((img, i) => (
                  <div key={i} className="relative border rounded-md overflow-hidden group">
                    <img src={img} alt={`Bãi đậu ${i}`} className="w-full h-32 object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Nút */}
            <div className="md:col-span-2 pt-2 space-y-2">
              <Button
                className="w-full rounded-md hover:bg-blue-600 transition-colors"
                onClick={handleUpdate}
                disabled={isLoading}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
              <Button
                variant="destructive"
                className="w-full rounded-md hover:bg-red-600 transition-colors"
                onClick={handleDelete}
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isLoading ? "Đang xóa..." : "Xóa bãi đậu xe"}
              </Button>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
