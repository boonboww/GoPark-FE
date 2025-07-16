"use client";

import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { MapPin, Star, Clock, CheckCircle, ChevronLeft, ChevronRight, Phone, Mail, User } from "lucide-react";
import { useState, useEffect } from "react";
import { getParkingSlotsByLotId } from "@/lib/api";

type Spot = {
  _id: string;
  slotNumber: string;
  status: "available" | "booked" | "reserved";
  zone: string;
  pricePerHour: number;
};

type ParkingInfoProps = {
  parkingLotId: string;
};

export default function ParkingInfo({ parkingLotId }: ParkingInfoProps) {
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
  });
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getParkingSlotsByLotId(parkingLotId)
      .then((response) => {
        console.log("Phản hồi danh sách vị trí đỗ:", response.data); // Debug
        setSpots(response.data.data?.data || []); // Xử lý trường hợp data.data undefined
        if (response.data.data?.data.length > 0) {
          setSelectedZone(response.data.data.data[0].zone);
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-gray-600">Đang tải...</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-8">
      <div className="relative w-full rounded-xl overflow-hidden">
        <div ref={sliderRef} className="keen-slider rounded-xl">
          {[...Array(5)].map((_, i) => (
            <div className="keen-slider__slide" key={i}>
              <Image
                src={`/b1.jpg`}
                alt={`Hình ảnh bãi đỗ ${i + 1}`}
                width={1200}
                height={600}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => slider.current?.prev()}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => slider.current?.next()}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <h1 className="text-2xl font-bold">Bãi đỗ xe An Phú</h1>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <MapPin className="w-4 h-4" /> 81 Dũng Sĩ Thanh Khê, Phường Thanh Khê Tây, Đà Nẵng
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Clock className="w-4 h-4" /> Mở cửa: 24/7
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Star className="w-4 h-4 text-yellow-500" /> 4.8 / 5.0
      </div>

      <div className="text-sm text-gray-600">
        <strong>Khu vực:</strong> {zones.join(", ")} — Tổng: {spots.length} vị trí
      </div>

      <div className="text-sm text-gray-600">
        <strong>Giá:</strong> {spots[0]?.pricePerHour.toLocaleString("vi-VN")} VNĐ/giờ
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <CheckCircle className="w-4 h-4 text-green-600" /> Gần sân bay, trường đại học, trung tâm thương mại
      </div>

      <div className="flex flex-col gap-2 mt-4 text-sm text-gray-600">
        <h2 className="text-base font-semibold">Liên hệ chủ bãi</h2>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" /> Anh John Parking
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" /> +84 912 345 678
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4" /> john.parking@example.com
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm font-medium block mb-2">
          Chọn khu vực:
        </label>
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="border px-3 py-2 rounded-md"
        >
          {zones.map((zone) => (
            <option key={zone} value={zone}>
              Khu vực {zone}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-6 gap-2 mt-4">
        {currentZoneSpots.map((spot) => (
          <div
            key={spot._id}
            className={`w-12 h-12 flex items-center justify-center rounded-md text-xs font-medium text-white ${
              spot.status === "booked"
                ? "bg-red-600"
                : spot.status === "reserved"
                ? "bg-yellow-500"
                : "bg-green-600"
            }`}
          >
            {spot.slotNumber}
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-4 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-600 rounded"></div> Đã đặt
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div> Đặt trước
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-600 rounded"></div> Trống
        </div>
      </div>

      <div className="w-full h-64 bg-gray-200 mt-6 rounded-lg flex items-center justify-center">
        <p>Bản đồ sẽ được hiển thị tại đây</p>
      </div>
    </section>
  );
}