"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
  const [zoneValues, setZoneValues] = useState([{ zone: "", count: 0 }]);
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
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
      setZoneValues([{ zone: "", count: 0 }]);
      setStreet("");
      setDistrict("");
      setCity("");
      setImageUrl("");
      setPaymentMethods([]);
      setLatitude("");
      setLongitude("");
    } catch (error) {
      toast.error("Lỗi khi tạo bãi đỗ");
      console.error("Error creating parking lot:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handlePaymentMethodChange = (method: string) => {
  //   setPaymentMethods((prev) =>
  //     prev.includes(method)
  //       ? prev.filter((m) => m !== method)
  //       : [...prev, method]
  //   );
  // };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto" variant="outline">
          <span className="font-medium">+ Thêm bãi đậu xe</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] rounded-lg">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-lg font-semibold">Tạo bãi đậu xe mới</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 max-h-[70vh] overflow-y-auto">
          <div className="md:col-span-2 space-y-1">
            <Label className="text-sm font-medium">Tên bãi đậu xe</Label>
            <Input
              className="rounded-md"
              value={newParkingLot.name}
              onChange={(e) => setNewParkingLot({ ...newParkingLot, name: e.target.value })}
              placeholder="Nhập tên bãi đậu xe"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-medium">Đường</Label>
            <Input
              className="rounded-md"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Tên đường"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-medium">Quận/Huyện</Label>
            <Input
              className="rounded-md"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="Tên quận/huyện"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <Label className="text-sm font-medium">Thành phố</Label>
            <Input
              className="rounded-md"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Tên thành phố"
            />
          </div>

          {/* <div className="space-y-1">
            <Label className="text-sm font-medium">Kinh độ (Longitude)</Label>
            <Input
              className="rounded-md"
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="Nhập kinh độ (VD: 106.6297)"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-medium">Vĩ độ (Latitude)</Label>
            <Input
              className="rounded-md"
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="Nhập vĩ độ (VD: 10.8231)"
            />
          </div> */}

          {/* <div className="md:col-span-2 space-y-1">
            <Label className="text-sm font-medium">Phương thức thanh toán</Label>
            <div className="flex gap-4">
              {["Tiền mặt", "Thẻ ngân hàng", "Ví điện tử"].map((method) => (
                <label key={method} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={paymentMethods.includes(method)}
                    onChange={() => handlePaymentMethodChange(method)}
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
          </div> */}

          <div className="md:col-span-2 space-y-1">
            <Label className="text-sm font-medium">Số khu vực</Label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              value={zoneCount}
              onChange={(e) => {
                const count = Number(e.target.value);
                setZoneCount(count);
                setZoneValues(Array(count).fill({ zone: "", count: 0 }));
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
            <div key={index} className="grid grid-cols-2 gap-3 md:col-span-2">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Tên khu vực {index + 1}</Label>
                <Input
                  className="rounded-md"
                  value={z.zone}
                  onChange={(e) => {
                    const updated = [...zoneValues];
                    updated[index].zone = e.target.value;
                    setZoneValues(updated);
                  }}
                  placeholder="Ví dụ: A, B, C..."
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">Số chỗ đậu</Label>
                <Input
                  className="rounded-md"
                  type="number"
                  value={z.count}
                  onChange={(e) => {
                    const updated = [...zoneValues];
                    updated[index].count = Number(e.target.value);
                    setZoneValues(updated);
                  }}
                  placeholder="Số lượng"
                />
              </div>
            </div>
          ))}

          <div className="md:col-span-2 space-y-1">
            <Label className="text-sm font-medium">Giá mỗi giờ (VND)</Label>
            <Input
              className="rounded-md"
              type="number"
              value={newParkingLot.pricePerHour}
              onChange={(e) =>
                setNewParkingLot({ ...newParkingLot, pricePerHour: Number(e.target.value) })
              }
              placeholder="Nhập giá theo VND"
            />
          </div>

          {/* <div className="md:col-span-2 space-y-1">
            <Label className="text-sm font-medium">Mô tả</Label>
            <Input
              className="rounded-md"
              value={newParkingLot.description}
              onChange={(e) =>
                setNewParkingLot({ ...newParkingLot, description: e.target.value })
              }
              placeholder="Nhập mô tả bãi đỗ (tùy chọn)"
            />
          </div> */}

          {/* <div className="md:col-span-2 space-y-1">
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
          </div> */}

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

          <div className="md:col-span-2 pt-2">
            <Button className="w-full rounded-md" onClick={handleAdd} disabled={isLoading}>
              Tạo bãi đậu xe
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}