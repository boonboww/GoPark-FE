// ✅ Full ParkingLotManagement with zone object input (zone & count), edit/delete support
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { ParkingLot } from "@/app/owner/types";
import {
  fetchMyParkingLots,
  createParkingLot,
  updateParkingLot,
  deleteParkingLot,
} from "@/lib/parkingLot.api";

export default function ParkingLotManagement() {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [selectedLotId, setSelectedLotId] = useState<string>("");
  const [newLotDialogOpen, setNewLotDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [zoneCount, setZoneCount] = useState<number>(1);
  const [zoneValues, setZoneValues] = useState<
    { zone: string; count: number }[]
  >([{ zone: "", count: 0 }]);

  const [newParkingLot, setNewParkingLot] = useState({
    name: "",
    address: "",
    pricePerHour: 0,
    image: [],
    zones: [],
  });

  const [streetAddress, setStreetAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");

  const selectedLot = parkingLots.find((lot) => lot._id === selectedLotId);

  const loadParkingLots = async () => {
    const res = await fetchMyParkingLots();
    setParkingLots(res.data.data);
    if (res.data.data.length > 0) {
      setSelectedLotId(res.data.data[0]._id);
    }
  };

  useEffect(() => {
    loadParkingLots();
  }, []);

  useEffect(() => {
    if (selectedLot?.address) {
      const parts = selectedLot.address.split(",").map((s) => s.trim());
      setStreetAddress(parts[0] || "");
      setDistrict(parts[1] || "");
      setCity(parts[2] || "");
    }
  }, [selectedLot]);

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = Number(e.target.value);
    setZoneCount(count);
    setZoneValues(Array(count).fill({ zone: "", count: 0 }));
  };

  const handleAddParkingLot = async () => {
    const payload = {
      ...newParkingLot,
      address: `${streetAddress}, ${district}, ${city}`,
      image: imageUrl ? [imageUrl] : [],
      zones: zoneValues,
    };

    await createParkingLot(payload);
    await loadParkingLots();
    setNewLotDialogOpen(false);
    setNewParkingLot({
      name: "",
      address: "",
      pricePerHour: 0,
      image: [],
      zones: [],
    });
    setImageUrl("");
    setStreetAddress("");
    setDistrict("");
    setCity("");
    setZoneCount(1);
    setZoneValues([{ zone: "", count: 0 }]);
  };

  const handleUpdateParkingLot = async () => {
    if (!selectedLotId) return;
    const updated = parkingLots.find((lot) => lot._id === selectedLotId);
    if (!updated) return;

    const payload = {
      ...updated,
      address: `${streetAddress}, ${district}, ${city}`,
    };

    await updateParkingLot(selectedLotId, payload);
    await loadParkingLots();
  };

  const handleDeleteParkingLot = async (id: string) => {
    await deleteParkingLot(id);
    await loadParkingLots();
  };

  return (
    <Card className="shadow-xl rounded-2xl p-4 bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Quản Lý Bãi Đậu Xe</CardTitle>
        <CardDescription className="text-gray-500">
          Thêm, sửa và quản lý các bãi đậu xe của bạn
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <Dialog open={newLotDialogOpen} onOpenChange={setNewLotDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                + Thêm Bãi Đậu Xe Mới
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] rounded-2xl">
              <DialogHeader>
                <DialogTitle>Tạo Bãi Đậu Xe Mới</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 max-h-[80vh] overflow-y-auto pr-2">
                <div className="md:col-span-2">
                  <Label>Tên</Label>
                  <Input
                    className="rounded-xl"
                    value={newParkingLot.name}
                    onChange={(e) =>
                      setNewParkingLot({
                        ...newParkingLot,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Địa Chỉ Đường</Label>
                  <Input
                    className="rounded-xl"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Quận/Huyện</Label>
                  <Input
                    className="rounded-xl"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Thành Phố</Label>
                  <Input
                    className="rounded-xl"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Số Khu Vực</Label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={zoneCount}
                    onChange={handleZoneChange}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                {zoneValues.map((z, index) => (
                  <div
                    className="grid grid-cols-2 gap-2 md:col-span-2"
                    key={index}
                  >
                    <div>
                      <Label>Tên Khu Vực</Label>
                      <Input
                        value={z.zone}
                        onChange={(e) => {
                          const updated = [...zoneValues];
                          updated[index].zone = e.target.value;
                          setZoneValues(updated);
                        }}
                        placeholder="A"
                      />
                    </div>
                    <div>
                      <Label>Số Chỗ Đậu</Label>
                      <Input
                        type="number"
                        value={z.count}
                        onChange={(e) => {
                          const updated = [...zoneValues];
                          updated[index].count = Number(e.target.value);
                          setZoneValues(updated);
                        }}
                        placeholder="10"
                      />
                    </div>
                  </div>
                ))}
                <div className="md:col-span-2">
                  <Label>Giá mỗi giờ (VND)</Label>
                  <Input
                    type="number"
                    className="rounded-xl"
                    value={newParkingLot.pricePerHour}
                    onChange={(e) =>
                      setNewParkingLot({
                        ...newParkingLot,
                        pricePerHour: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>URL Hình Ảnh</Label>
                  <Input
                    className="rounded-xl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="xem trước"
                      className="rounded-xl border shadow w-full max-h-[200px] object-contain mt-2"
                    />
                  )}
                </div>
                <div className="md:col-span-2">
                  <Button
                    className="w-full rounded-xl"
                    onClick={handleAddParkingLot}
                  >
                    Tạo
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="w-full md:w-64">
            <Label>Chọn Bãi Đậu Xe</Label>
            <Select value={selectedLotId} onValueChange={setSelectedLotId}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Chọn bãi đậu xe" />
              </SelectTrigger>
              <SelectContent>
                {parkingLots.map((lot) => (
                  <SelectItem key={lot._id} value={lot._id}>
                    {lot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedLot && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border">
            <h3 className="text-lg font-semibold col-span-full">
              📝 Sửa Bãi Đậu Xe
            </h3>
            <Label>Tên</Label>
            <Input
              className="rounded-xl"
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
            <Label>Địa Chỉ Đường</Label>
            <Input
              className="rounded-xl"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
            />
            <Label>Quận/Huyện</Label>
            <Input
              className="rounded-xl"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
            <Label>Thành Phố</Label>
            <Input
              className="rounded-xl"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Label>Khu Vực</Label>
            <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4">
              {(selectedLot.zones ?? []).map((zoneObj, index) => (
                <div key={index} className="grid grid-cols-2 gap-2">
                  <Input
                    value={zoneObj.zone}
                    onChange={(e) => {
                      const updatedZones = [...(selectedLot.zones ?? [])];
                      updatedZones[index].zone = e.target.value;
                      setParkingLots((prev) =>
                        prev.map((lot) =>
                          lot._id === selectedLot._id
                            ? { ...lot, zones: updatedZones }
                            : lot
                        )
                      );
                    }}
                    placeholder="Tên khu vực"
                  />
                  <Input
                    type="number"
                    value={zoneObj.count}
                    onChange={(e) => {
                      const updatedZones = [...(selectedLot.zones ?? [])];
                      updatedZones[index].count = Number(e.target.value);
                      setParkingLots((prev) =>
                        prev.map((lot) =>
                          lot._id === selectedLot._id
                            ? { ...lot, zones: updatedZones }
                            : lot
                        )
                      );
                    }}
                    placeholder="Số chỗ"
                  />
                </div>
              ))}
            </div>
            <Label>Giá mỗi giờ (VND)</Label>
            <Input
              type="number"
              className="rounded-xl"
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
            <Label>URL Hình Ảnh</Label>
            <Input
              className="rounded-xl col-span-full"
              value={selectedLot.image?.[0] || ""}
              onChange={(e) =>
                setParkingLots((prev) =>
                  prev.map((lot) =>
                    lot._id === selectedLot._id
                      ? { ...lot, image: [e.target.value] }
                      : lot
                  )
                )
              }
            />
            {selectedLot.image?.[0] && (
              <img
                src={selectedLot.image[0]}
                alt="bãi đậu xe"
                className="rounded-xl border shadow-md w-full h-48 object-cover col-span-full"
              />
            )}
            <div className="flex gap-4 col-span-full pt-4">
              <Button
                className="rounded-xl px-6 py-2"
                onClick={handleUpdateParkingLot}
              >
                Lưu Thay Đổi
              </Button>
              <Button
                variant="destructive"
                className="rounded-xl px-6 py-2"
                onClick={() => handleDeleteParkingLot(selectedLot._id)}
              >
                Xóa Bãi Đậu Xe
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
