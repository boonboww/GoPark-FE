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
import { Edit3, MapPin, Building2, Trash2, Camera, X } from "lucide-react";
import { updateParkingLot } from "@/lib/parkingLot.api";
import type { ParkingLot } from "@/app/owner/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "@/lib/api";

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
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]); // ảnh bãi
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // avatar mới

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
      };

      await updateParkingLot(selectedLot._id, payload);
      toast.success("✅ Cập nhật bãi đỗ thành công");

      setNewFiles([]);
      setAvatarFile(null);
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      toast.error("❌ Lỗi khi cập nhật bãi đỗ");
      console.error("Error updating parking lot:", error);
    } finally {
      setIsLoading(false);
    }
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
                onClick={() => onDelete(selectedLot._id)}
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa bãi đậu xe
              </Button>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
