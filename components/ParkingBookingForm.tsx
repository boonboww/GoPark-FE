"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import DetailBookingModal from "./DetailBookingModal";
import { useState, useEffect } from "react";
import { getParkingSlotsByLotId, createBookingOnline } from "@/lib/api";
import { Car, MapPin, LayoutGrid, Clock, CreditCard, DollarSign } from "lucide-react";

type Spot = {
  _id: string;
  slotNumber: string;
  status: "available" | "booked" | "reserved";
  zone: string;
  pricePerHour: number;
};

type BookingInfo = {
  name: string;
  vehicle: string;
  zone: string;
  spot: string;
  startTime: string;
  endTime: string;
  paymentMethod: "pay-at-parking" | "prepaid";
  estimatedFee: string;
  parkingSlotId: string;
  bookingType: "date" | "hours" | "month";
};

type ParkingBookingFormProps = {
  parkingLotId: string;
  allowedPaymentMethods: string[];
};

export default function ParkingBookingForm({ parkingLotId, allowedPaymentMethods }: ParkingBookingFormProps) {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"pay-at-parking" | "prepaid">("pay-at-parking");
  const [bookingType, setBookingType] = useState<"date" | "hours" | "month">("hours");
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);

    getParkingSlotsByLotId(parkingLotId)
      .then((response) => {
        const rawSlots = response.data?.data?.data;
        setSpots(rawSlots || []);
        if (rawSlots?.length > 0) {
          setSelectedZone(rawSlots[0].zone);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách vị trí đỗ:", error.response?.data || error.message);
        setError("Không thể tải danh sách vị trí đỗ. Vui lòng thử lại sau.");
        setLoading(false);
      });
  }, [parkingLotId]);

  const zones = Array.from(new Set(spots.map((spot) => spot.zone)));
  const currentZoneSpots = spots.filter((spot) => spot.zone === selectedZone);

  const calculateFee = () => {
    if (!startTime || !endTime || !selectedSpot) return "0 VNĐ";
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) return "0 VNĐ";
    const hours = diffMs / (1000 * 60 * 60);
    const pricePerHour = spots.find((s) => s._id === selectedSpot)?.pricePerHour || 20000;
    return `${Math.ceil(hours * pricePerHour).toLocaleString("vi-VN")} VNĐ`;
  };

  const handleConfirm = async () => {
    if (!userId || !selectedSpot || !startTime || !endTime || !vehicle) {
      alert("Vui lòng điền đầy đủ thông tin và chọn vị trí đỗ.");
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) {
      alert("Thời gian kết thúc phải sau thời gian bắt đầu.");
      return;
    }

    const hours = diffMs / (1000 * 60 * 60);
    const pricePerHour = spots.find((s) => s._id === selectedSpot)?.pricePerHour || 20000;
    const totalPrice = Math.ceil(hours * pricePerHour);

    const payload = {
      userId,
      parkingSlotId: selectedSpot as string,
      vehicleNumber: vehicle,
      startTime,
      endTime,
      paymentMethod,
      bookingType,
      totalPrice,
    };

    console.log("📦 Payload gửi về BE:", payload);

    try {
      const response = await createBookingOnline(payload);
      if (response.data.status === "success") {
        alert("Đặt chỗ thành công!");
        setModalOpen(false);
      }
    } catch (error) {
      console.error("❌ Lỗi khi tạo đặt chỗ:", error.response?.data || error.message);
      alert("Đã có lỗi xảy ra khi đặt chỗ.");
    }
  };

  const handleSubmit = () => {
    if (!name || !vehicle || !selectedZone || !selectedSpot || !startTime || !endTime || !paymentMethod) {
      alert("Vui lòng điền đầy đủ thông tin và chọn vị trí đỗ.");
      return;
    }

    if (!userId) {
      setError("Vui lòng đăng nhập để đặt chỗ.");
      return;
    }

    const info: BookingInfo = {
      name,
      vehicle,
      zone: selectedZone,
      spot: currentZoneSpots.find((s) => s._id === selectedSpot)?.slotNumber || "",
      startTime,
      endTime,
      paymentMethod,
      estimatedFee: calculateFee(),
      parkingSlotId: selectedSpot as string,
      bookingType,
    };

    setBookingInfo(info);
    setModalOpen(true);
  };

  if (error) {
    return (
      <div className="border rounded-lg shadow-sm p-6 flex flex-col gap-4 bg-white">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="border rounded-lg shadow-sm p-6 flex flex-col gap-4 bg-white">
        <p className="text-gray-600">Đang tải...</p>
      </div>
    );
  }

  return (
    <aside className="border rounded-lg shadow-sm p-6 flex flex-col gap-4 bg-white">
      <h2 className="text-lg font-semibold mb-2">Đặt chỗ đỗ xe</h2>

      <div>
        <Label>Tên</Label>
        <Input placeholder="Nhập tên của bạn" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <Car className="w-4 h-4" /> Phương tiện
        </Label>
        <Input
          placeholder="Số phương tiện (ví dụ: 43A-12345)"
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
          required
        />
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <MapPin className="w-4 h-4" /> Khu vực
        </Label>
        <select
          className="w-full border px-3 py-2 rounded-md cursor-pointer"
          value={selectedZone}
          onChange={(e) => {
            setSelectedZone(e.target.value);
            setSelectedSpot(null);
          }}
        >
          {zones.map((zone) => (
            <option key={zone} value={zone}>
              Khu vực {zone}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <LayoutGrid className="w-4 h-4" /> Chọn vị trí
        </Label>
        <div className="grid grid-cols-8 gap-2 mt-2">
          {currentZoneSpots.map((spot) => {
            let color = "";
            if (spot.status === "available") color = "bg-green-400";
            else if (spot.status === "reserved") color = "bg-yellow-400";
            else if (spot.status === "booked") color = "bg-red-400";

            const selected = selectedSpot === spot._id ? "ring-2 ring-black" : "";

            return (
              <button
                key={spot._id}
                disabled={spot.status === "booked"}
                onClick={() => setSelectedSpot(spot._id)}
                className={`text-xs text-white flex items-center justify-center h-8 rounded ${color} ${selected} disabled:opacity-50 cursor-pointer`}
              >
                {spot.slotNumber}
              </button>
            );
          })}
        </div>

        <div className="mt-2 flex gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 bg-green-400 inline-block rounded" /> Trống
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 bg-yellow-400 inline-block rounded" /> Đặt trước
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 bg-red-400 inline-block rounded" /> Đã đặt
          </span>
        </div>
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <Clock className="w-4 h-4" /> Thời gian bắt đầu
        </Label>
        <Input type="datetime-local" className="cursor-pointer" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <Clock className="w-4 h-4" /> Thời gian kết thúc
        </Label>
        <Input type="datetime-local" className="cursor-pointer" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <DollarSign className="w-4 h-4" /> Phí dự kiến
        </Label>
        <Input value={calculateFee()} disabled />
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <CreditCard className="w-4 h-4" /> Phương thức thanh toán
        </Label>
        <select
          className="w-full border px-3 py-2 rounded-md cursor-pointer"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as "pay-at-parking" | "prepaid")}
        >
          {allowedPaymentMethods.map((method) => (
            <option key={method} value={method}>
              {method === "prepaid" ? "Thanh toán trước" : "Thanh toán tại bãi"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <Clock className="w-4 h-4" /> Loại đặt chỗ
        </Label>
        <select
          className="w-full border px-3 py-2 rounded-md cursor-pointer"
          value={bookingType}
          onChange={(e) => setBookingType(e.target.value as "date" | "hours" | "month")}
        >
          <option value="hours">Theo giờ</option>
          <option value="date">Theo ngày</option>
          <option value="month">Theo tháng</option>
        </select>
      </div>

      <Button className="bg-black text-white hover:bg-gray-900 mt-4" onClick={handleSubmit}>
        Xác nhận đặt chỗ
      </Button>

      <DetailBookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        bookingInfo={bookingInfo}
        onConfirm={handleConfirm}
      />
    </aside>
  );
}