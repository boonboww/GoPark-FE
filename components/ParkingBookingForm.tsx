"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import DetailBookingModal from "./DetailBookingModal";
import { useState, useEffect } from "react";
import { getParkingSlotsByLotId, createBookingOnline, getAvailableSlotsByDate } from "@/lib/api";
import { Car, MapPin, LayoutGrid, Clock, CreditCard, DollarSign } from "lucide-react";

type Spot = {
  _id: string;
  slotNumber: string;
  status: "available" | "booked" | "reserved";
  zone: string;
  pricePerHour: number;
};

type ParkingBookingFormProps = {
  parkingLotId: string;
  allowedPaymentMethods: string[];
};

export default function ParkingBookingForm({ parkingLotId, allowedPaymentMethods }: ParkingBookingFormProps) {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"pay-at-parking" | "prepaid">("pay-at-parking");
  const [bookingType, setBookingType] = useState<"date" | "hours" | "month">("hours");
  const [modalOpen, setModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableSlotsByDate = async (start: string, end: string) => {
    try {
      setLoading(true);
      const response = await getAvailableSlotsByDate(parkingLotId, start, end);
      if (response.data.status === "success") {
        setSpots(response.data.data || []);
        if (response.data.data?.length > 0) {
          setSelectedZone(response.data.data[0].zone);
        }
      } else {
        setError("Không thể tải danh sách slot trống.");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Lỗi khi lấy slot trống:", err.response?.data || err.message);
      setError("Không thể tải danh sách slot trống. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (startTime && endTime) {
      const formattedStartTime = new Date(startTime).toISOString();
      const formattedEndTime = new Date(endTime).toISOString();
      fetchAvailableSlotsByDate(formattedStartTime, formattedEndTime);
    }
  }, [startTime, endTime, parkingLotId]);

  const zones = Array.from(new Set(spots.map((spot) => spot.zone)));
  const currentZoneSpots = spots.filter((spot) => spot.zone === selectedZone);
  const selectedSpot = spots.find((s) => s._id === selectedSpotId) || null;

  const calculateFee = () => {
    if (!startTime || !endTime || !selectedSpotId) return "0 VNĐ";
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) return "0 VNĐ";
    const hours = diffMs / (1000 * 60 * 60);
    const pricePerHour = selectedSpot?.pricePerHour || 20000;
    return `${Math.ceil(hours * pricePerHour).toLocaleString("vi-VN")} VNĐ`;
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

    setModalOpen(true);
  };

  const handleConfirm = async (bookingInfo: {
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
  }) => {
    if (!userId) return;

    const start = new Date(bookingInfo.startTime);
    const end = new Date(bookingInfo.endTime);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const pricePerHour = spots.find((s) => s._id === bookingInfo.parkingSlotId)?.pricePerHour || 20000;
    const totalPrice = Math.ceil(hours * pricePerHour);

    const payload = {
      userId,
      parkingSlotId: bookingInfo.parkingSlotId,
      vehicleNumber: bookingInfo.vehicle,
      startTime: bookingInfo.startTime,
      endTime: bookingInfo.endTime,
      paymentMethod: bookingInfo.paymentMethod,
      bookingType: bookingInfo.bookingType,
      totalPrice,
    };

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

  if (error) {
    return (
      <div className="border rounded-lg shadow-sm p-6 bg-white text-red-600">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="border rounded-lg shadow-sm p-6 bg-white text-gray-600">
        Đang tải...
      </div>
    );
  }

  return (
    <aside className="border rounded-lg shadow-sm p-6 flex flex-col gap-4 bg-white">
      <h2 className="text-lg font-semibold mb-2">Đặt chỗ đỗ xe</h2>

      <div>
        <Label>Tên</Label>
        <Input placeholder="Nhập tên của bạn" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <Car className="w-4 h-4" /> Phương tiện
        </Label>
        <Input placeholder="Số phương tiện (VD: 43A-12345)" value={vehicle} onChange={(e) => setVehicle(e.target.value)} />
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <MapPin className="w-4 h-4" /> Khu vực
        </Label>
        <select
          className="w-full border px-3 py-2 rounded-md"
          value={selectedZone}
          onChange={(e) => {
            setSelectedZone(e.target.value);
            setSelectedSpotId(null);
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
            const color =
              spot.status === "available"
                ? "bg-green-400"
                : spot.status === "reserved"
                ? "bg-yellow-400"
                : "bg-red-400";

            const selected = selectedSpotId === spot._id ? "ring-2 ring-black" : "";

            return (
              <button
                key={spot._id}
                disabled={spot.status === "booked"}
                onClick={() => setSelectedSpotId(spot._id)}
                className={`text-xs text-white flex items-center justify-center h-8 rounded ${color} ${selected} disabled:opacity-50`}
              >
                {spot.slotNumber}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <Clock className="w-4 h-4" /> Thời gian bắt đầu
        </Label>
        <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <Clock className="w-4 h-4" /> Thời gian kết thúc
        </Label>
        <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
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
          className="w-full border px-3 py-2 rounded-md"
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
        <Label>Loại đặt chỗ</Label>
        <select
          className="w-full border px-3 py-2 rounded-md"
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

      {selectedSpot && (
        <DetailBookingModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedSlot={{ _id: selectedSpot._id, slotNumber: selectedSpot.slotNumber }}
          bookingMeta={{
            name,
            vehicle,
            zone: selectedZone,
            startTime,
            endTime,
            paymentMethod,
            estimatedFee: calculateFee(),
            bookingType,
          }}
          onConfirm={handleConfirm}
        />
      )}
    </aside>
  );
}