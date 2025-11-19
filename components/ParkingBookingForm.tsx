/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";
import qs from "qs";

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
  const router = useRouter();

  const [spots, setSpots] = useState<Spot[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [vehicle, setVehicle] = useState<string>("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "pay-at-parking" | "prepaid"
  >("pay-at-parking");
  const [bookingType, setBookingType] = useState<"date" | "hours" | "month">(
    "hours"
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeError, setTimeError] = useState<string | null>(null);
  const [parkingLotPrice, setParkingLotPrice] = useState<number>(20000);

  useEffect(() => {
    const fetchUserAndSlots = async () => {
      try {
        setLoading(true);
        const storedUserId = localStorage.getItem("userId");
        setUserId(storedUserId);

        const parkingLotResponse = await API.get(
          `/api/v1/parkinglots/${parkingLotId}`
        );
        const parkingLotData = parkingLotResponse.data?.data;
        if (parkingLotData?.pricePerHour)
          setParkingLotPrice(parkingLotData.pricePerHour);

        const userResponse = await API.get("/api/v1/users/me");
        setName(userResponse.data.userName || "");

        const vehiclesResponse = await API.get("/api/v1/vehicles/my-vehicles");
        setVehicles(vehiclesResponse.data.data || []);

        const slotsResponse = await getParkingSlotsByLotId(parkingLotId);
        const rawSlots = slotsResponse.data?.data?.data;
        if (Array.isArray(rawSlots)) {
          const sortedSlots = rawSlots.sort(
            (a, b) =>
              parseInt(a.slotNumber.replace(/^\D+/g, "")) -
              parseInt(b.slotNumber.replace(/^\D+/g, ""))
          );
          setSpots(sortedSlots);
          if (sortedSlots.length > 0)
            setSelectedZone(sortedSlots[0].zone || "");
        } else {
          setSpots([]);
          setError("Không tìm thấy danh sách vị trí đỗ.");
        }
      } catch (err: any) {
        setError(
          "Không thể tải thông tin người dùng, xe hoặc danh sách vị trí đỗ."
        );
        setSpots([]);
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
      if (
        response.data.status === "success" &&
        Array.isArray(response.data.data?.data)
      ) {
        const availableSpots = response.data.data.data.filter(
          (spot: Spot) => spot.status === "available"
        );
        const sortedSpots = availableSpots.sort(
          (a, b) =>
            parseInt(a.slotNumber.replace(/^\D+/g, "")) -
            parseInt(b.slotNumber.replace(/^\D+/g, ""))
        );
        setSpots(sortedSpots);
        if (sortedSpots.length > 0) setSelectedZone(sortedSpots[0].zone || "");
        else setError("Không tìm thấy slot trống cho khoảng thời gian này.");
      } else {
        setSpots([]);
        setError("Không tìm thấy slot trống cho khoảng thời gian này.");
      }
    } catch (err: any) {
      setSpots([]);
      setError("Không thể tải danh sách slot trống. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const diffMs = end.getTime() - start.getTime();
      const minDiffMs = 10 * 60 * 1000;

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        setTimeError("Thời gian bắt đầu hoặc kết thúc không hợp lệ!");
        setSpots([]);
      } else if (diffMs <= minDiffMs) {
        setTimeError(
          "Thời gian kết thúc phải lớn hơn thời gian bắt đầu ít nhất 10 phút!"
        );
        setSpots([]);
      } else {
        setTimeError(null);
        fetchAvailableSlotsByDate(start.toISOString(), end.toISOString());
      }
    } else {
      setTimeError(null);
      setSpots([]);
    }
  }, [startTime, endTime, parkingLotId]);

  const zones = Array.from(new Set(spots.map((spot) => spot.zone)));
  const currentZoneSpots = spots.filter(
    (spot) => spot.zone === selectedZone && spot.status === "available"
  );
  const selectedSpot = spots.find((s) => s._id === selectedSpotId) || null;

  const calculateFeeValue = () => {
    if (!startTime || !endTime || !selectedSpotId || timeError) return 0;
    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return Math.ceil(hours * parkingLotPrice);
  };

  const handleSubmit = async () => {
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

    const selectedVehicle = vehicles.find((v) => v.licensePlate === vehicle);
    if (!selectedVehicle) {
      alert("Vui lòng chọn phương tiện hợp lệ");
      return;
    }

    const bookingData = {
      userId,
      userName: name, // gửi tên người dùng
      slotNumber: selectedSpot.slotNumber, // gửi tên slot
      parkingSlotId: selectedSpotId,
      vehicleId: selectedVehicle._id,
      vehicleNumber: vehicle,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      bookingType,
      paymentMethod,
      totalPrice: calculateFeeValue().toString(),
    };

    const queryString = qs.stringify(bookingData);
    router.push(`/payment?${queryString}`);
  };

  if (error)
    return (
      <div className="border rounded-lg shadow-sm p-6 bg-white text-red-600">
        {error}
      </div>
    );
  if (loading)
    return (
      <div className="border rounded-lg shadow-sm p-6 bg-white text-gray-600">
        Đang tải...
      </div>
    );

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
          <Clock className="w-4 h-4" /> Thời gian bắt đầu
        </Label>
        <Input
          type="datetime-local"
          value={startTime}
          min={new Date().toISOString().slice(0, 16)}
          onChange={(e) => setStartTime(e.target.value)}
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
              ? new Date(new Date(startTime).getTime() + 10 * 60 * 1000)
                  .toISOString()
                  .slice(0, 16)
              : undefined
          }
          onChange={(e) => setEndTime(e.target.value)}
        />
        {timeError && <p className="text-red-600 text-sm mt-1">{timeError}</p>}
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
            const selected =
              selectedSpotId === spot._id ? "ring-2 ring-black" : "";
            return (
              <button
                key={spot._id}
                disabled={spot.status !== "available"}
                onClick={() => setSelectedSpotId(spot._id)}
                className={`text-xs text-white flex items-center justify-center h-8 rounded ${
                  spot.status === "available"
                    ? "bg-green-400 cursor-pointer"
                    : "bg-red-400 cursor-not-allowed"
                } ${selected}`}
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
        <Input
          value={`${calculateFeeValue().toLocaleString("vi-VN")} VNĐ`}
          disabled
        />
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
        className="bg-black text-white hover:bg-gray-900 mt-4 cursor-pointer"
        onClick={handleSubmit}
        disabled={!!timeError}
      >
        Xác nhận đặt chỗ
      </Button>
    </aside>
  );
}
