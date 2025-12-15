"use client";

import { useState } from "react";
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
import {
  Plus,
  MapPin,
  Building2,
  DollarSign,
  CreditCard,
  Camera,
  X,
  CheckCircle,
} from "lucide-react";
import LoadingModal from "@/components/common/LoadingModal";
import { createParkingLot } from "@/lib/parkingLot.api";
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
  onCreated: () => void;
}

export default function AddParkingLotDialog({
  open,
  onOpenChange,
  onCreated,
}: Props) {
  const toast = useToast();
  const [newParkingLot, setNewParkingLot] = useState({
    name: "",
    address: "",
    pricePerHour: 0,
    image: [] as string[],
    zones: [] as { zone: string; count: number }[],
    allowedPaymentMethods: [] as string[],
    location: {
      type: "Point",
      coordinates: [0, 0] as [number, number],
    },
    description: "",
    isActive: true,
    avtImage: "",
  });
  const [zoneCount, setZoneCount] = useState(1);
  const [zoneValues, setZoneValues] = useState([{ zone: "A", count: 10 }]);
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<string[]>(["prepaid"]);
  const [latitude, setLatitude] = useState("21.028511");
  const [longitude, setLongitude] = useState("105.854444");

  // File upload states
  const [images, setImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Loading modal states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const handleAdd = async () => {
    // Validation
    if (!newParkingLot.name.trim()) {
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
    if (newParkingLot.pricePerHour < 0) {
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
    setLoadingMessage("Đang tạo bãi đỗ xe...");

    try {
      // Tạo parking lot trước (không có ảnh)
      const payload = {
        ...newParkingLot,
        address: `${street}, ${district}, ${city}`,
        image: [], // Để trống, sẽ upload sau
        avtImage: "", // Để trống, sẽ upload sau
        zones: zoneValues,
        allowedPaymentMethods: paymentMethods,
        location: {
          type: "Point",
          coordinates: [Number(longitude), Number(latitude)] as [
            number,
            number
          ],
        },
      };

      const createResult = await createParkingLot(payload);

      // Backend service trả về { newLot }, controller wrap thành:
      // { status: "success", message: "...", data: { newLot } }
      // Axios response: { data: { status: "success", message: "...", data: { newLot } } }

      let createdParkingLotId = null;
      const responseData = createResult.data as any;

      // Thử các cấu trúc có thể có:
      if (responseData?.data?.newLot?._id) {
        // Cấu trúc: { data: { data: { newLot: { _id: ... } } } }
        createdParkingLotId = responseData.data.newLot._id;
      } else if (responseData?.data?._id) {
        // Cấu trúc: { data: { data: { _id: ... } } }
        createdParkingLotId = responseData.data._id;
      } else if (responseData?.newLot?._id) {
        // Cấu trúc: { data: { newLot: { _id: ... } } }
        createdParkingLotId = responseData.newLot._id;
      } else if (responseData?._id) {
        // Cấu trúc: { data: { _id: ... } }
        createdParkingLotId = responseData._id;
      }

      if (!createdParkingLotId) {
        console.error(
          "❌ Cannot extract parking lot ID from response:",
          createResult
        );
        console.error("❌ Response data structure:", responseData);
        throw new Error(
          "Không thể lấy ID của bãi đỗ xe vừa tạo. Vui lòng kiểm tra console để debug."
        );
      }

      console.log(
        "✅ Successfully extracted parking lot ID:",
        createdParkingLotId
      );

      // Upload ảnh bãi đỗ xe (nếu có)
      let finalImages: string[] = [];
      if (newFiles.length > 0) {
        try {
          setLoadingMessage("Đang upload ảnh bãi đỗ xe...");
          console.log("🔄 Uploading parking lot images...");
          const formData = new FormData();
          newFiles.forEach((file) => formData.append("files", file));
          formData.append("type", "parkinglotImages");
          formData.append("userId", createdParkingLotId);

          const uploadRes = await API.post("/api/v1/upload/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          console.log("📤 Upload response:", uploadRes.data);
          finalImages = uploadRes.data.urls || [];
          console.log("✅ Uploaded parking lot images:", finalImages);
          console.log("📊 Number of uploaded images:", finalImages.length);
        } catch (uploadError: any) {
          console.error("❌ Lỗi upload ảnh bãi:", uploadError);
          toast.error(
            `Không thể upload ảnh bãi đỗ xe: ${
              uploadError.response?.data?.error || uploadError.message
            }`
          );
        }
      }

      // Upload ảnh đại diện (nếu có)
      let avatarUrl = "";
      if (avatarFile) {
        try {
          setLoadingMessage("Đang upload ảnh đại diện...");
          console.log("🔄 Uploading parking lot avatar...");
          const formData = new FormData();
          formData.append("file", avatarFile);
          formData.append("type", "parkinglotAvatar");
          formData.append("userId", createdParkingLotId);

          const uploadRes = await API.post("/api/v1/upload/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          console.log("📤 Avatar upload response:", uploadRes.data);
          avatarUrl = uploadRes.data.url || "";
          console.log("✅ Uploaded parking lot avatar:", avatarUrl);
          console.log("🔍 Avatar URL exists:", !!avatarUrl);
        } catch (uploadError: any) {
          console.error("❌ Lỗi upload avatar:", uploadError);
          toast.error(
            `Không thể upload ảnh đại diện: ${
              uploadError.response?.data?.error || uploadError.message
            }`
          );
        }
      }

      // Cập nhật parking lot với ảnh đã upload (nếu có)
      if (finalImages.length > 0 || avatarUrl) {
        try {
          setLoadingMessage("Đang cập nhật thông tin bãi đỗ xe...");
          console.log("🔄 Updating parking lot with images...");

          const updatePayload = {
            ...(finalImages.length > 0 && { image: finalImages }),
            ...(avatarUrl && { avtImage: avatarUrl }),
          };

          console.log("📦 Update payload:", updatePayload);
          console.log("🆔 Parking lot ID:", createdParkingLotId);

          const updateRes = await API.patch(
            `/api/v1/parkinglots/${createdParkingLotId}`,
            updatePayload
          );

          console.log("✅ Update response:", updateRes.data);
          console.log("✅ Updated parking lot with images successfully");
        } catch (updateError: any) {
          console.error("❌ Lỗi cập nhật ảnh:", updateError);
          console.error("❌ Update error details:", updateError.response?.data);
          toast.error(
            `Bãi đỗ được tạo nhưng không thể cập nhật ảnh: ${
              updateError.response?.data?.error || updateError.message
            }`
          );
        }
      } else {
        console.log("ℹ️ No images to update - skipping patch request");
      }

      // Hoàn thành và hiển thị success modal
      setLoadingMessage("Đã hoàn thành!");

      // Delay ngắn để user thấy message hoàn thành
      await new Promise((resolve) => setTimeout(resolve, 500));

      setIsLoading(false);

      const hasUploadedImages = finalImages.length > 0 || avatarUrl;
      const message = hasUploadedImages
        ? "Tạo bãi đỗ xe và upload ảnh thành công!"
        : "Tạo bãi đỗ xe thành công!";

      setSuccessMessage(message);
      setShowSuccessModal(true);

      // Callback
      onCreated();

      console.log("🎉 Parking lot creation completed successfully!");
    } catch (error: any) {
      console.error("❌ Error creating parking lot:", error);

      // Hiển thị lỗi chi tiết
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Lỗi không xác định khi tạo bãi đỗ";

      toast.error(`❌ ${errorMessage}`);
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

  // Handle multiple parking lot images
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

  // Remove parking lot image preview
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    const removedUrl = images[index];
    setNewFiles((prev) =>
      prev.filter((file) => !removedUrl.includes(file.name))
    );
  };

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle success modal close
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onOpenChange(false);

    // Reset tất cả states về trạng thái ban đầu
    setNewParkingLot({
      name: "",
      address: "",
      pricePerHour: 0,
      image: [],
      zones: [],
      allowedPaymentMethods: [],
      location: { type: "Point", coordinates: [0, 0] },
      description: "",
      isActive: true,
      avtImage: "",
    });
    setZoneCount(1);
    setZoneValues([{ zone: "A", count: 10 }]);
    setStreet("");
    setDistrict("");
    setCity("");
    setImageUrl("");
    setPaymentMethods(["prepaid"]);
    setLatitude("21.028511");
    setLongitude("105.854444");
    setImages([]);
    setNewFiles([]);
    setAvatarFile(null);
    setAvatarPreview("");
    setLoadingMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="w-full md:w-auto hover:bg-green-50 cursor-pointer hover:text-green-700 hover:border-green-300 transition-colors"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span className="font-medium">Thêm bãi đậu xe</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] rounded-lg">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-lg font-semibold">
            Tạo bãi đậu xe mới
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 max-h-[70vh] overflow-y-auto">
          <div className="md:col-span-2 space-y-1">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4 text-green-600" />
              Tên bãi đậu xe
            </Label>
            <Input
              className="rounded-md"
              value={newParkingLot.name}
              onChange={(e) =>
                setNewParkingLot({ ...newParkingLot, name: e.target.value })
              }
              placeholder="Nhập tên bãi đậu xe"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" />
              Đường
            </Label>
            <Input
              className="rounded-md"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Tên đường"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" />
              Quận/Huyện
            </Label>
            <Input
              className="rounded-md"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="Tên quận/huyện"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <Label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" />
              Thành phố
            </Label>
            <Input
              className="rounded-md"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Tên thành phố"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" />
              Kinh độ (Longitude)
            </Label>
            <Input
              className="rounded-md"
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="Nhập kinh độ (VD: 105.854444)"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" />
              Vĩ độ (Latitude)
            </Label>
            <Input
              className="rounded-md"
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="Nhập vĩ độ (VD: 21.028511)"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <Label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" />
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

          <div className="md:col-span-2 space-y-1">
            <Label className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-green-600" />
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

          <div className="md:col-span-2 space-y-1">
            <Label className="text-sm font-medium">Số khu vực</Label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              value={zoneCount}
              onChange={(e) => {
                const count = Number(e.target.value);
                setZoneCount(count);
                // Tạo zones mới với tên tự động (A, B, C...) để tránh trùng lặp
                const newZones = [];
                for (let i = 0; i < count; i++) {
                  const zoneName = String.fromCharCode(65 + i); // A, B, C...
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

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Các vị trí trong khu {z.zone}:
                </Label>
                <div className="grid grid-cols-5 gap-1 max-h-20 overflow-y-auto">
                  {Array.from({ length: z.count }, (_, slotIndex) => (
                    <div
                      key={`${z.zone}-${slotIndex + 1}`}
                      className="bg-blue-50 border border-blue-200 rounded px-2 py-1 text-xs text-center text-blue-700 font-medium"
                    >
                      {z.zone}
                      {slotIndex + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="md:col-span-2 space-y-1">
            <Label className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Giá mỗi giờ (VND)
            </Label>
            <Input
              className="rounded-md"
              type="number"
              min="0"
              step="1000"
              value={
                newParkingLot.pricePerHour === 0
                  ? ""
                  : newParkingLot.pricePerHour
              }
              onChange={(e) => {
                let val = e.target.value;

                // Ngăn chặn nhập số âm
                if (val.startsWith("-")) {
                  return;
                }

                // Nếu giá trị rỗng, set về 0
                if (val === "") {
                  setNewParkingLot({ ...newParkingLot, pricePerHour: 0 });
                  return;
                }

                // Loại bỏ số 0 ở đầu nếu có (trừ trường hợp "0")
                if (
                  val.length > 1 &&
                  val.startsWith("0") &&
                  !val.includes(".")
                ) {
                  val = val.replace(/^0+/, "");
                  if (val === "") val = "0";
                }

                const numVal = Number(val);
                // Chỉ accept số không âm
                if (numVal >= 0) {
                  setNewParkingLot({ ...newParkingLot, pricePerHour: numVal });
                }
              }}
              onKeyDown={(e) => {
                // Ngăn chặn nhập dấu trừ
                if (e.key === "-" || e.key === "e" || e.key === "E") {
                  e.preventDefault();
                }
              }}
              placeholder="Nhập giá theo VND (VD: 15000)"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <Label className="text-sm font-medium">Mô tả</Label>
            <textarea
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 min-h-[80px] resize-none"
              value={newParkingLot.description}
              onChange={(e) =>
                setNewParkingLot({
                  ...newParkingLot,
                  description: e.target.value,
                })
              }
              placeholder="Nhập mô tả bãi đỗ (tùy chọn): vị trí, tiện ích, quy định..."
            />
          </div>

          {/* Avatar bãi */}
          <div className="md:col-span-2 space-y-2">
            <Label className="text-sm font-medium">Ảnh đại diện bãi</Label>
            <label
              htmlFor="parkinglot-avatar"
              className="flex items-center gap-2 cursor-pointer text-green-600"
            >
              <Camera className="w-5 h-5" />
              Chọn ảnh đại diện
            </label>
            <input
              id="parkinglot-avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />

            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar bãi"
                className="w-32 h-32 object-cover rounded-md mt-2"
              />
            )}
          </div>

          {/* Ảnh bãi */}
          <div className="md:col-span-2 space-y-2">
            <Label className="text-sm font-medium">Ảnh bãi đỗ xe</Label>
            <label
              htmlFor="parkinglot-image"
              className="flex items-center gap-2 cursor-pointer text-green-600"
            >
              <Camera className="w-5 h-5" />
              Chọn ảnh bãi (có thể chọn nhiều)
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
                <div
                  key={i}
                  className="relative border rounded-md overflow-hidden group"
                >
                  <img
                    src={img}
                    alt={`Bãi đậu ${i}`}
                    className="w-full h-32 object-cover"
                  />
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

          <div className="md:col-span-2 pt-4 border-t">
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-md"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button
                className="flex-1 rounded-md bg-blue-600 hover:bg-blue-700"
                onClick={handleAdd}
                disabled={
                  isLoading ||
                  !newParkingLot.name.trim() ||
                  !street.trim() ||
                  !city.trim() ||
                  paymentMethods.length === 0
                }
              >
                {isLoading ? "Đang tạo..." : "Tạo bãi đậu xe"}
              </Button>
            </div>
            {paymentMethods.length === 0 && (
              <p className="text-red-500 text-xs mt-2">
                Vui lòng chọn ít nhất một phương thức thanh toán
              </p>
            )}
          </div>
        </div>
      </DialogContent>

      {/* Loading Modal */}
      <Dialog open={isLoading} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-md rounded-lg"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle className="sr-only">Đang xử lý</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            {/* Loading Spinner */}
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>

            {/* Loading Message */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Đang xử lý...
            </h3>

            <p className="text-gray-600 text-sm">{loadingMessage}</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={handleSuccessModalClose}>
        <DialogContent className="sm:max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle className="sr-only">Thông báo thành công</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
            {/* Icon thành công */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            {/* Tiêu đề */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Thành công!
            </h3>

            {/* Thông báo */}
            <p className="text-gray-600 mb-6">{successMessage}</p>

            {/* Nút đóng */}
            <Button
              onClick={handleSuccessModalClose}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              Hoàn thành
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
