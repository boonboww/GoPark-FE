/* eslint-disable @typescript-eslint/no-unused-vars */

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
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
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
  const [parkingLotPrice, setParkingLotPrice] = useState<number>(20000); // Giá mặc định

  useEffect(() => {
    const fetchUserAndSlots = async () => {
      try {
        setLoading(true);
        const storedUserId = localStorage.getItem("userId");
        setUserId(storedUserId);

        // Lấy thông tin parking lot để có giá thật
        const parkingLotResponse = await API.get(`/api/v1/parkinglots/${parkingLotId}`);
        const parkingLotData = parkingLotResponse.data?.data;
        if (parkingLotData?.pricePerHour) {
          setParkingLotPrice(parkingLotData.pricePerHour);
        }

        const userResponse = await API.get("/api/v1/users/me");
        setName(userResponse.data.userName || "");

        const vehiclesResponse = await API.get("/api/v1/vehicles/my-vehicles");
        setVehicles(vehiclesResponse.data.data || []);

        const slotsResponse = await getParkingSlotsByLotId(parkingLotId);
        const rawSlots = slotsResponse.data?.data?.data;
        if (Array.isArray(rawSlots)) {
          // Sắp xếp các slot theo số của slotNumber (loại bỏ ký tự đầu)
          const sortedSlots = rawSlots.sort((a, b) => 
            parseInt(a.slotNumber.replace(/^\D+/g, '')) - parseInt(b.slotNumber.replace(/^\D+/g, ''))
          );
          setSpots(sortedSlots);
          if (sortedSlots.length > 0) {
            setSelectedZone(sortedSlots[0].zone || "");
          }
        } else {
          setSpots([]);
          setError("Không tìm thấy danh sách vị trí đỗ.");
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
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
        // Sắp xếp các slot theo số của slotNumber (loại bỏ ký tự đầu)
        const sortedSpots = availableSpots.sort((a, b) => 
          parseInt(a.slotNumber.replace(/^\D+/g, '')) - parseInt(b.slotNumber.replace(/^\D+/g, ''))
        );
        setSpots(sortedSpots);
        if (sortedSpots.length > 0) {
          setSelectedZone(sortedSpots[0].zone || "");
        } else {
          setSelectedZone("");
          setError("Không tìm thấy slot trống cho khoảng thời gian này.");
        }
      } else {
        setSpots([]);
        setError("Không tìm thấy slot trống cho khoảng thời gian này.");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      const minDiffMs = 10 * 60 * 1000; // 10 minutes in milliseconds

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

  const zones = Array.from(
    new Set(Array.isArray(spots) ? spots.map((spot) => spot.zone) : [])
  );
  const currentZoneSpots = Array.isArray(spots)
    ? spots.filter((spot) => spot.zone === selectedZone && spot.status === "available")
    : [];
  const selectedSpot = Array.isArray(spots)
    ? spots.find((s) => s._id === selectedSpotId) || null
    : null;

  const calculateFee = () => {
    if (!startTime || !endTime || !selectedSpotId || timeError) return "0 VNĐ";
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) return "0 VNĐ";
    const hours = diffMs / (1000 * 60 * 60);
    // Sử dụng giá thật từ parking lot thay vì từ slot
    const pricePerHour = parkingLotPrice;
    const fee = Math.ceil(hours * pricePerHour);
    return `${fee.toLocaleString("vi-VN")} VNĐ`;
  };

  const calculateFeeValue = () => {
    if (!startTime || !endTime || !selectedSpotId || timeError) return 0;
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) return 0;
    const hours = diffMs / (1000 * 60 * 60);
    // Sử dụng giá thật từ parking lot thay vì từ slot
    const pricePerHour = parkingLotPrice;
    return Math.ceil(hours * pricePerHour);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    if (newStartTime) {
      setStartTime(newStartTime);
      setEndTime("");
      setTimeError(null);
      setSelectedSpotId(null);
      const start = new Date(newStartTime);
      if (isNaN(start.getTime())) {
        setTimeError("Thời gian bắt đầu không hợp lệ!");
      }
    } else {
      setStartTime("");
      setTimeError(null);
      setSelectedSpotId(null);
    }
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value;
    if (newEndTime && startTime) {
      setEndTime(newEndTime);
      setSelectedSpotId(null);
      const start = new Date(startTime);
      const end = new Date(newEndTime);
      const diffMs = end.getTime() - start.getTime();
      const minDiffMs = 10 * 60 * 1000; // 10 minutes in milliseconds
      if (isNaN(end.getTime())) {
        setTimeError("Thời gian kết thúc không hợp lệ!");
      } else if (diffMs <= minDiffMs) {
        setTimeError(
          "Thời gian kết thúc phải lớn hơn thời gian bắt đầu ít nhất 10 phút!"
        );
      } else {
        setTimeError(null);
      }
    } else {
      setEndTime("");
      setTimeError(null);
      setSelectedSpotId(null);
    }
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

    try {
      const response = await getAvailableSlotsByDate(parkingLotId, startTime, endTime);
      const availableSpots = response.data.data.data;
      const isSpotAvailable = availableSpots.some(
        (spot: Spot) => spot._id === selectedSpotId && spot.status === "available"
      );
      if (!isSpotAvailable) {
        alert("Slot này đã được đặt bởi người dùng khác. Vui lòng chọn slot khác.");
        fetchAvailableSlotsByDate(startTime, endTime);
        setSelectedSpotId(null);
        return;
      }
      console.log("Start Time:", startTime);
      console.log("End Time:", endTime);
      setModalOpen(true);
    } catch (err) {
      alert("Lỗi khi kiểm tra slot. Vui lòng thử lại.");
    }
  };

  const handleConfirm = () => {
    API.get("/api/v1/users/me")
      .then((userResponse) => {
        setName(userResponse.data.userName || "");
      })
      .catch((error) => {
        setName("");
      });

    setVehicle(vehicles[0]?.licensePlate || "");
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
          <Clock className="w-4 h-4" /> Thời gian bắt đầu
        </Label>
        <Input
          type="datetime-local"
          value={startTime}
          min={new Date().toISOString().slice(0, 16)}
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
              ? new Date(new Date(startTime).getTime() + 10 * 60 * 1000)
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
        {currentZoneSpots.length === 0 && startTime && endTime && !timeError ? (
          <p className="text-red-600 text-sm mt-1">
            Không có slot nào khả dụng trong khoảng thời gian này.
          </p>
        ) : (
          <div className="grid grid-cols-8 gap-2 mt-2">
            {currentZoneSpots
              .sort((a, b) => parseInt(a.slotNumber.replace(/^\D+/g, '')) - parseInt(b.slotNumber.replace(/^\D+/g, '')))
              .map((spot) => {
                const selected =
                  selectedSpotId === spot._id ? "ring-2 ring-black" : "";
                return (
                  <button
                    key={spot._id}
                    disabled={spot.status !== "available"}
                    onClick={() => {
                      if (spot.status !== "available") {
                        alert(
                          "Slot này đã được đặt. Vui lòng chọn slot khác."
                        );
                        return;
                      }
                      setSelectedSpotId(spot._id);
                    }}
                    className={`text-xs text-white flex items-center justify-center h-8 rounded ${
                      spot.status === "available" ? "bg-green-400 cursor-pointer" : "bg-red-400 cursor-not-allowed"
                    } ${selected}`}
                  >
                    {spot.slotNumber}
                  </button>
                );
              })}
          </div>
        )}
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
        className="bg-black text-white hover:bg-gray-900 mt-4 cursor-pointer"
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
            startTime: startTime,
            endTime: endTime,
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