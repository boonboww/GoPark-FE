"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Edit3, MapPin, Building2, Trash2 } from "lucide-react";
import { updateParkingLot } from "@/lib/parkingLot.api";
import type { ParkingLot } from "@/app/owner/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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

  useEffect(() => {
    if (selectedLot?.address) {
      const [s, d, c] = selectedLot.address.split(",").map((s) => s.trim());
      setStreet(s || "");
      setDistrict(d || "");
      setCity(c || "");
    }
  }, [selectedLot]);

  const handleUpdate = async () => {
    if (!selectedLot) return;
    setIsLoading(true);
    try {
      const payload = {
        ...selectedLot,
        address: `${street}, ${district}, ${city}`,
      };
      await updateParkingLot(selectedLot._id, payload);
      toast.success("Cập nhật bãi đỗ thành công");
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      toast.error("Lỗi khi cập nhật bãi đỗ");
      console.error("Error updating parking lot:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors" variant="outline" disabled={!selectedLot}>
          <Edit3 className="w-4 h-4 mr-2" />
          <span className="font-medium">Sửa & Xóa</span>
        </Button>
      </DialogTrigger>
      {selectedLot && (
        <DialogContent className="sm:max-w-[650px] rounded-lg">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-lg font-semibold">Chỉnh sửa bãi đậu xe</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 max-h-[70vh] overflow-y-auto">
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
                      lot._id === selectedLot._id ? { ...lot, name: e.target.value } : lot
                    )
                  )
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Đường
              </Label>
              <Input 
                className="rounded-md"
                value={street} 
                onChange={(e) => setStreet(e.target.value)} 
              />
            </div>
            
            <div className="space-y-1">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Quận/Huyện
              </Label>
              <Input 
                className="rounded-md"
                value={district} 
                onChange={(e) => setDistrict(e.target.value)} 
              />
            </div>
            
            <div className="md:col-span-2 space-y-1">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Thành phố
              </Label>
              <Input 
                className="rounded-md"
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <Label className="text-sm font-medium">Khu vực</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(selectedLot.zones ?? []).map((zoneObj, index) => (
                  <div key={index} className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Tên khu</Label>
                      <Input
                        className="rounded-md text-sm"
                        value={zoneObj.zone}
                        onChange={(e) => {
                          const updatedZones = [...(selectedLot.zones ?? [])];
                          updatedZones[index].zone = e.target.value;
                          setParkingLots((prev) =>
                            prev.map((lot) =>
                              lot._id === selectedLot._id ? { ...lot, zones: updatedZones } : lot
                            )
                          );
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Số chỗ</Label>
                      <Input
                        className="rounded-md text-sm"
                        type="number"
                        value={zoneObj.count}
                        onChange={(e) => {
                          const updatedZones = [...(selectedLot.zones ?? [])];
                          updatedZones[index].count = Number(e.target.value);
                          setParkingLots((prev) =>
                            prev.map((lot) =>
                              lot._id === selectedLot._id ? { ...lot, zones: updatedZones } : lot
                            )
                          );
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 space-y-1">
              <Label className="text-sm font-medium">Giá mỗi giờ (VND)</Label>
              <Input
                className="rounded-md"
                type="number"
                value={selectedLot.pricePerHour ?? 0}
                onChange={(e) =>
                  setParkingLots((prev) =>
                    prev.map((lot) =>
                      lot._id === selectedLot._id
                        ? { ...lot, pricePerHour: Number(e.target.value) }
                        : lot
                    )
                  )
                }
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <Label className="text-sm font-medium">URL hình ảnh</Label>
              <Input
                className="rounded-md"
                value={selectedLot.image?.[0] || ""}
                onChange={(e) =>
                  setParkingLots((prev) =>
                    prev.map((lot) =>
                      lot._id === selectedLot._id ? { ...lot, image: [e.target.value] } : lot
                    )
                  )
                }
              />
              {selectedLot.image?.[0] && (
                <div className="mt-2 border rounded-md overflow-hidden">
                  <img
                    src={selectedLot.image[0]}
                    alt="Bãi đậu xe"
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}
            </div>

            <div className="md:col-span-2 pt-2 space-y-2">
              <Button className="w-full rounded-md hover:bg-blue-600 transition-colors" onClick={handleUpdate} disabled={isLoading}>
                <Edit3 className="w-4 h-4 mr-2" />
                Lưu thay đổi
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