"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Building2, DollarSign, CreditCard } from "lucide-react";
import { createParkingLot } from "@/lib/parkingLot.api";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  onCreated: () => void;
}

export default function AddParkingLotDialog({ open, onOpenChange, onCreated }: Props) {
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
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    setIsLoading(true);
    try {
      const payload = {
        ...newParkingLot,
        address: `${street}, ${district}, ${city}`,
        image: imageUrl ? [imageUrl] : [],
        zones: zoneValues,
        allowedPaymentMethods: paymentMethods,
        location: {
          type: "Point",
          coordinates: [Number(longitude), Number(latitude)] as [number, number],
        },
      };
      await createParkingLot(payload);
      toast.success("Tạo bãi đỗ thành công");
      onCreated();
      onOpenChange(false);
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
    } catch (error) {
      toast.error("Lỗi khi tạo bãi đỗ");
      console.error("Error creating parking lot:", error);
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
        <Button className="w-full md:w-auto hover:bg-green-50 cursor-pointer hover:text-green-700 hover:border-green-300 transition-colors" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          <span className="font-medium">Thêm bãi đậu xe</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] rounded-lg">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-lg font-semibold">Tạo bãi đậu xe mới</DialogTitle>
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
              onChange={(e) => setNewParkingLot({ ...newParkingLot, name: e.target.value })}
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
              <CreditCard className="w-4 h-4 text-green-600" />
              Phương thức thanh toán
            </Label>
            <div className="flex gap-4 flex-wrap">
              {[
                { value: "prepaid", label: "Trả trước" },
                { value: "pay-at-parking", label: "Trả tại bãi" }
              ].map((method) => (
                <label key={method.value} className="flex items-center gap-2 cursor-pointer">
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
                    count: zoneValues[i]?.count || 10 
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
            <div key={`zone-${index}`} className="md:col-span-2 border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Khu vực {z.zone}</h4>
                <span className="text-sm text-gray-500">Tổng: {z.count} chỗ</span>
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
                      updated[index].count = Math.max(1, Number(e.target.value));
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
                      {z.zone}{slotIndex + 1}
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
              value={newParkingLot.pricePerHour}
              onChange={(e) =>
                setNewParkingLot({ ...newParkingLot, pricePerHour: Number(e.target.value) })
              }
              placeholder="Nhập giá theo VND (VD: 15000)"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <Label className="text-sm font-medium">Mô tả</Label>
            <textarea
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 min-h-[80px] resize-none"
              value={newParkingLot.description}
              onChange={(e) =>
                setNewParkingLot({ ...newParkingLot, description: e.target.value })
              }
              placeholder="Nhập mô tả bãi đỗ (tùy chọn): vị trí, tiện ích, quy định..."
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <Label className="text-sm font-medium">URL hình ảnh đại diện</Label>
            <Input
              className="rounded-md"
              value={newParkingLot.avtImage}
              onChange={(e) =>
                setNewParkingLot({ ...newParkingLot, avtImage: e.target.value })
              }
              placeholder="Dán URL hình ảnh đại diện (tùy chọn)"
            />
            {newParkingLot.avtImage && (
              <div className="mt-2 border rounded-md overflow-hidden">
                <img
                  src={newParkingLot.avtImage}
                  alt="Xem trước hình ảnh đại diện"
                  className="w-full h-40 object-cover"
                />
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-1">
            <Label className="text-sm font-medium">URL hình ảnh</Label>
            <Input
              className="rounded-md"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Dán URL hình ảnh tại đây"
            />
            {imageUrl && (
              <div className="mt-2 border rounded-md overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Xem trước hình ảnh"
                  className="w-full h-40 object-cover"
                />
              </div>
            )}
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
                disabled={isLoading || !newParkingLot.name.trim() || !street.trim() || !city.trim() || paymentMethods.length === 0}
              >
                {isLoading ? "Đang tạo..." : "Tạo bãi đậu xe"}
              </Button>
            </div>
            {paymentMethods.length === 0 && (
              <p className="text-red-500 text-xs mt-2">Vui lòng chọn ít nhất một phương thức thanh toán</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}