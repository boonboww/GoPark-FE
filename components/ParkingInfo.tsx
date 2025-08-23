"use client";

import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import {
  MapPin,
  Star,
  Clock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getParkingSlotsByLotId, getParkingLotById } from "@/lib/api";
import API from "@/lib/api";

type Spot = {
  _id: string;
  slotNumber: string;
  status: "available" | "booked" | "reserved";
  zone: string;
  pricePerHour: number;
};

type ParkingLot = {
  _id: string;
  name: string;
  address: string;
  description: string;
  image: string[];
  avtImage: string;
  allowedPaymentMethods: string[];
  zones: { zone: string; count: number }[];
};

type User = {
  userName: string;
  email: string;
  phoneNumber: string;
};

type ParkingInfoProps = {
  parkingLotId: string;
};

export default function ParkingInfo({ parkingLotId }: ParkingInfoProps) {
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
  });

  const [spots, setSpots] = useState<Spot[]>([]);
  const [parkingLot, setParkingLot] = useState<ParkingLot | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Gọi API để lấy thông tin bãi đỗ xe
        const parkingLotResponse = await getParkingLotById(parkingLotId);
        console.log("Phản hồi thông tin bãi đỗ:", parkingLotResponse.data);
        setParkingLot(parkingLotResponse.data.data || null);

        // Gọi API để lấy danh sách slot
        const slotsResponse = await getParkingSlotsByLotId(parkingLotId);
        console.log("Phản hồi danh sách vị trí đỗ:", slotsResponse.data);
        setSpots(slotsResponse.data.data?.data || []);

        // Gọi API để lấy thông tin người dùng
        const userResponse = await API.get("/api/v1/users/me");
        console.log("Phản hồi thông tin người dùng:", userResponse.data);
        setUser({
          userName: userResponse.data.userName,
          email: userResponse.data.email,
          phoneNumber: userResponse.data.phoneNumber,
        });

        setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(
          "Lỗi khi lấy dữ liệu:",
          error.response?.data || error.message
        );
        setError(
          "Không thể tải thông tin bãi đỗ, vị trí đỗ hoặc thông tin người dùng. Vui lòng thử lại sau."
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [parkingLotId]);

  const zones = Array.from(new Set(spots.map((spot) => spot.zone)));



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

  if (!parkingLot) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-red-600">Không tìm thấy thông tin bãi đỗ.</p>
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

      <h1 className="text-2xl font-bold">{parkingLot.name}</h1>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <MapPin className="w-4 h-4" /> {parkingLot.address}
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Clock className="w-4 h-4" /> Mở cửa: 24/7
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Star className="w-4 h-4 text-yellow-500" /> 4.8 / 5.0
      </div>

      <div className="text-sm text-gray-600">
        <strong>Khu vực:</strong> {zones.join(", ")} — Tổng: {spots.length} vị
        trí
      </div>

      <div className="text-sm text-gray-600">
        <strong>Giá:</strong> {parkingLot && typeof (parkingLot as any).pricePerHour === 'number' ? (parkingLot as any).pricePerHour.toLocaleString('vi-VN') + ' VNĐ/giờ' : 'Chưa có thông tin giá'}
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <CheckCircle className="w-4 h-4 text-green-600" />{" "}
        {parkingLot.description || "Không có mô tả"}
      </div>

      <div className="flex flex-col gap-2 mt-4 text-sm text-gray-600">
        <h2 className="text-base font-semibold">Thông tin người dùng</h2>
        {user ? (
          <>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" /> {user.userName || "Không có tên"}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> {user.phoneNumber || "Không có số điện thoại"}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> {user.email || "Không có email"}
            </div>
          </>
        ) : (
          <div className="text-red-600">Không thể tải thông tin người dùng.</div>
        )}
      </div>

      <div className="w-full h-64 bg-gray-200 mt-6 rounded-lg flex items-center justify-center">
        <p>Bản đồ sẽ được hiển thị tại đây</p>
      </div>
    </section>
  );
}