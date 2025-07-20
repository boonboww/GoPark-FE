"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import DetailBookingModal from "./DetailBookingModal";
import { useState, useEffect } from "react";
import { getParkingSlotsByLotId, getAvailableSlotsByDate } from "@/lib/api";
import API from "@/lib/api";
import {
  Car,
  MapPin,
  LayoutGrid,
  Clock,
  CreditCard,
  DollarSign,
} from "lucide-react";

type Spot = {
  _id: string;
  slotNumber: string;
  status: "available" | "booked" | "reserved";
  zone: string;
  pricePerHour: number;
};

type Vehicle = {
  _id?: string;
  licensePlate: string;
  capacity: number;
  imageVehicle?: string;
};

type ParkingBookingFormProps = {
  parkingLotId: string;
  allowedPaymentMethods: string[];
};

export default function ParkingBookingForm({
  parkingLotId,
  allowedPaymentMethods,
}: ParkingBookingFormProps) {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [vehicle, setVehicle] = useState<string>("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]); // State cho danh sách xe
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "pay-at-parking" | "prepaid"
  >("pay-at-parking");
  const [bookingType, setBookingType] = useState<"date" | "hours" | "month">(
    "hours"
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeError, setTimeError] = useState<string | null>(null);

  // Lấy thông tin người dùng và xe
  useEffect(() => {
    const fetchUserAndSlots = async () => {
      try {
        setLoading(true);

        // Lấy userId từ localStorage
        const storedUserId = localStorage.getItem("userId");
        setUserId(storedUserId);

        // Lấy thông tin người dùng
        const userResponse = await API.get("/api/v1/users/me");
        setName(userResponse.data.userName || "");

        // Lấy danh sách xe
        const vehiclesResponse = await API.get("/api/v1/vehicles/my-vehicles");
        setVehicles(vehiclesResponse.data.data || []);

        // Lấy danh sách slot
        const slotsResponse = await getParkingSlotsByLotId(parkingLotId);
        const rawSlots = slotsResponse.data?.data?.data;
        setSpots(rawSlots || []);
        if (rawSlots?.length > 0) {
          setSelectedZone(rawSlots[0].zone);
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Lỗi khi lấy dữ liệu:", error.response?.data || error.message);
        setError("Không thể tải thông tin người dùng, xe hoặc danh sách vị trí đỗ.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndSlots();
  }, [parkingLotId]);

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
      console.error(
        "Lỗi khi lấy slot trống:",
        err.response?.data || err.message
      );
      setError("Không thể tải danh sách slot trống. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startTime && endTime) {
      const now = new Date();
      const start = new Date(startTime + ":00Z");
      const end = new Date(endTime + ":00Z");
      const bufferMinutes = 5;
      if (start <= new Date(now.getTime() + bufferMinutes * 60 * 1000)) {
        setTimeError(`Thời gian bắt đầu phải sau thời gian hiện tại ít nhất ${bufferMinutes} phút!`);
        setSpots([]);
      } else if (end <= start) {
        setTimeError("Thời gian kết thúc phải sau thời gian bắt đầu!");
        setSpots([]);
      } else {
        setTimeError(null);
        fetchAvailableSlotsByDate(start.toISOString(), end.toISOString());
      }
    } else {
      setTimeError(null);
    }
  }, [startTime, endTime, parkingLotId]);

  const zones = Array.from(new Set(spots.map((spot) => spot.zone)));
  const currentZoneSpots = spots.filter((spot) => spot.zone === selectedZone);
  const selectedSpot = spots.find((s) => s._id === selectedSpotId) || null;

  const calculateFee = () => {
    if (!startTime || !endTime || !selectedSpotId || timeError) return "0 VNĐ";
    const start = new Date(startTime + ":00Z");
    const end = new Date(endTime + ":00Z");
    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) return "0 VNĐ";
    const hours = diffMs / (1000 * 60 * 60);
    const pricePerHour = selectedSpot?.pricePerHour || 20000;
    const fee = Math.ceil(hours * pricePerHour);
    return `${fee.toLocaleString("vi-VN")} VNĐ`;
  };

  const calculateFeeValue = () => {
    if (!startTime || !endTime || !selectedSpotId || timeError) return 0;
    const start = new Date(startTime + ":00Z");
    const end = new Date(endTime + ":00Z");
    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) return 0;
    const hours = diffMs / (1000 * 60 * 60);
    const pricePerHour = selectedSpot?.pricePerHour || 20000;
    return Math.ceil(hours * pricePerHour);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    setEndTime("");
    setTimeError(null);
    const start = new Date(newStartTime + ":00Z");
    const now = new Date();
    const bufferMinutes = 5;
    if (start <= new Date(now.getTime() + bufferMinutes * 60 * 1000)) {
      setTimeError(`Thời gian bắt đầu phải sau thời gian hiện tại ít nhất ${bufferMinutes} phút!`);
    }
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value;
    setEndTime(newEndTime);
    if (startTime) {
      const start = new Date(startTime + ":00Z");
      const end = new Date(newEndTime + ":00Z");
      if (end <= start) {
        setTimeError("Thời gian kết thúc phải sau thời gian bắt đầu!");
      } else {
        setTimeError(null);
      }
    }
  };

  const handleSubmit = () => {
    if (
      !name ||
      !vehicle ||
      !selectedZone ||
      !selectedSpot ||
      !startTime ||
      !endTime ||
      !paymentMethod ||
      timeError
    ) {
      alert(
        "Vui lòng điền đầy đủ thông tin, chọn vị trí đỗ và đảm bảo thời gian hợp lệ."
      );
      return;
    }

    if (!userId) {
      setError("Vui lòng đăng nhập để đặt chỗ.");
      return;
    }

    setModalOpen(true);
  };

  const handleConfirm = () => {
    // Gọi lại API để lấy tên người dùng sau khi xác nhận
    API.get("/api/v1/users/me")
      .then((userResponse) => {
        setName(userResponse.data.userName || "");
      })
      .catch((error) => {
        console.error("Lỗi khi lấy tên người dùng:", error.response?.data || error.message);
        setName("");
      });

    setVehicle(vehicles[0]?.licensePlate || ""); // Reset về xe đầu tiên hoặc rỗng
    setStartTime("");
    setEndTime("");
    setSelectedSpotId(null);
    setSelectedZone(zones[0] || "");
    setPaymentMethod("pay-at-parking");
    setBookingType("hours");
    setModalOpen(false);
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
        <Input
          placeholder="Nhập tên của bạn"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <Car className="w-4 h-4" /> Phương tiện
        </Label>
        <select
          className="w-full border px-3 py-2 rounded-md"
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
        >
          <option value="">Chọn phương tiện</option>
          {vehicles.map((v) => (
            <option key={v._id} value={v.licensePlate}>
              {v.licensePlate}
            </option>
          ))}
        </select>
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
          <Clock className="w-4 h-4" /> Thời gian bắt đầu
        </Label>
        <Input
          type="datetime-local"
          value={startTime}
          min={new Date(new Date().getTime() + 5 * 60 * 1000)
            .toISOString()
            .slice(0, 16)}
          onChange={handleStartTimeChange}
        />
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <Clock className="w-4 h-4" /> Thời gian kết thúc
        </Label>
        <Input
          type="datetime-local"
          value={endTime}
          min={
            startTime
              ? new Date(new Date(startTime).getTime() + 60000)
                  .toISOString()
                  .slice(0, 16)
              : undefined
          }
          onChange={handleEndTimeChange}
        />
        {timeError && <p className="text-red-600 text-sm mt-1">{timeError}</p>}
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <LayoutGrid className="w-4 h-4" /> Chọn vị trí
        </Label>
        <div className="grid grid-cols-8 gap-2 mt-2">
          {currentZoneSpots.map((spot) => {
            const selected =
              selectedSpotId === spot._id ? "ring-2 ring-black" : "";
            return (
              <button
                key={spot._id}
                disabled={spot.status === "booked"}
                onClick={() => setSelectedSpotId(spot._id)}
                className={`text-xs text-white flex items-center justify-center h-8
                rounded bg-green-400 ${selected}`}
              >
                {spot.slotNumber}
              </button>
            );
          })}
        </div>
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
          onChange={(e) =>
            setPaymentMethod(e.target.value as "pay-at-parking" | "prepaid")
          }
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
          onChange={(e) =>
            setBookingType(e.target.value as "date" | "hours" | "month")
          }
        >
          <option value="hours">Theo giờ</option>
          <option value="date">Theo ngày</option>
          <option value="month">Theo tháng</option>
        </select>
      </div>

      <Button
        className="bg-black text-white hover:bg-gray-900 mt-4"
        onClick={handleSubmit}
        disabled={!!timeError}
      >
        Xác nhận đặt chỗ
      </Button>

      {selectedSpot && (
        <DetailBookingModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedSlot={{
            _id: selectedSpot._id,
            slotNumber: selectedSpot.slotNumber,
          }}
          bookingMeta={{
            name,
            vehicle,
            zone: selectedZone,
            startTime,
            endTime,
            paymentMethod,
            estimatedFee: calculateFeeValue().toString(),
            bookingType,
          }}
          onConfirm={handleConfirm}
        />
      )}
    </aside>
  );
}