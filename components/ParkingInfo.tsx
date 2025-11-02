"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
const MapFrame = dynamic(() => import("./MapFrame"), { ssr: false });
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
  image: string[]; // danh sách ảnh (url supabase)
  avtImage?: string;
  allowedPaymentMethods: string[];
  zones: { zone: string; count: number }[];
  location: {
    type: string;
    coordinates: [number, number];
  };
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [sliderRef, slider] = useKeenSlider(
    {
      loop: true,
    },
    [
      // plugins / events
      (sliderInstance) => {
        sliderInstance.on("created", () => setCurrentSlide(sliderInstance.track.details.rel));
        sliderInstance.on("slideChanged", () => setCurrentSlide(sliderInstance.track.details.rel));
      },
    ]
  );

  const [spots, setSpots] = useState<Spot[]>([]);
  const [parkingLot, setParkingLot] = useState<ParkingLot | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 📌 Lấy thông tin bãi đỗ
        const parkingLotResponse = await getParkingLotById(parkingLotId);
        setParkingLot(parkingLotResponse.data.data || null);

        // 📌 Lấy danh sách slot
        const slotsResponse = await getParkingSlotsByLotId(parkingLotId);
        setSpots(slotsResponse.data.data?.data || []);

        // 📌 Lấy thông tin user hiện tại
        const userResponse = await API.get("/api/v1/users/me");
        setUser({
          userName: userResponse.data.userName,
          email: userResponse.data.email,
          phoneNumber: userResponse.data.phoneNumber,
        });

        // 📌 Nếu parkingLot trả về parkingOwner là object hoặc id, fetch owner
        // Note: parkingLotResponse may include the lot directly under data or data.parkingLot
        const lotData = parkingLotResponse.data.data?.parkingLot || parkingLotResponse.data.data || parkingLotResponse.data;
        const parkingOwner = lotData?.parkingOwner;
        if (parkingOwner) {
          // nếu parkingOwner là object đã populate
          if (typeof parkingOwner === "object" && parkingOwner.userName) {
            setOwner({
              userName: parkingOwner.userName,
              email: parkingOwner.email,
              phoneNumber: parkingOwner.phoneNumber,
            });
          } else if (typeof parkingOwner === "string") {
            try {
              const ownerRes = await API.get(`/api/v1/users/${parkingOwner}`);
              setOwner({
                userName: ownerRes.data.userName,
                email: ownerRes.data.email,
                phoneNumber: ownerRes.data.phoneNumber,
              });
            } catch (err) {
              // ignore owner fetch error and leave owner null
              console.debug("Không lấy được thông tin owner:", err);
            }
          }
        }

        setLoading(false);
      } catch (error: any) {
        console.error("Lỗi khi lấy dữ liệu:", error.response?.data || error.message);
        setError("Không thể tải thông tin bãi đỗ, vị trí đỗ hoặc thông tin người dùng. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchData();
  }, [parkingLotId]);

  // keyboard handlers for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev - 1 + (parkingLot?.image?.length || 0)) % (parkingLot?.image?.length || 1));
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev + 1) % (parkingLot?.image?.length || 1));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxOpen, parkingLot]);

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
      {/* Slider ảnh */}
      <div className="relative w-full rounded-xl overflow-hidden">
        <div
          ref={sliderRef}
          className="keen-slider rounded-xl"
          // attach change handler when slider is available
        >
          {parkingLot.image && parkingLot.image.length > 0 ? (
            parkingLot.image.map((url, i) => (
              <div className="keen-slider__slide" key={i}>
                <Image
                  src={url}
                  alt={`Hình ảnh bãi đỗ ${i + 1}`}
                  width={1200}
                  height={600}
                  className="w-full h-64 md:h-96 object-cover cursor-zoom-in"
                  onClick={() => {
                    setLightboxIndex(i);
                    setLightboxOpen(true);
                  }}
                />
              </div>
            ))
          ) : (
            <div className="keen-slider__slide">
              <Image
                src="/b1. jpg"
                alt="Ảnh mặc định bãi đỗ"
                width={1200}
                height={600}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}
        </div>

        {/* Dots */}
        {parkingLot.image && parkingLot.image.length > 0 && (
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-3">
            <div className="bg-black/40 px-3 py-1 rounded-full flex items-center gap-2">
              {parkingLot.image.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => slider.current?.moveToIdx(idx)}
                  className={`w-3 h-3 md:w-3 md:h-3 rounded-full transition-colors duration-150 ${
                    currentSlide === idx ? 'bg-white' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Nút điều hướng slider */}
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
        <strong>Khu vực:</strong> {zones.join(", ")} — Tổng: {spots.length} vị trí
      </div>

      <div className="text-sm text-gray-600">
        <strong>Giá:</strong>{" "}
        {parkingLot && typeof (parkingLot as any).pricePerHour === "number"
          ? (parkingLot as any).pricePerHour.toLocaleString("vi-VN") + " VNĐ/giờ"
          : "Chưa có thông tin giá"}
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <CheckCircle className="w-4 h-4 text-green-600" />{" "}
        {parkingLot.description || "Không có mô tả"}
      </div>

      {/* Thông tin chủ bãi (ưu tiên) hoặc user hiện tại */}
      <div className="flex flex-col gap-2 mt-4 text-sm text-gray-600">
        <h2 className="text-base font-semibold">Thông tin chủ bãi</h2>
        {owner ? (
          <>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" /> {owner.userName || "Không có tên"}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> {owner.phoneNumber || "Không có số điện thoại"}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> {owner.email || "Không có email"}
            </div>
          </>
        ) : user ? (
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

      {/* Map hiển thị vị trí bãi đỗ */}
      {parkingLot && parkingLot.location && (
        <div className="w-full h-64 mt-6 rounded-lg overflow-hidden shadow">
          <MapFrame
            lat={parkingLot.location.coordinates[1]}
            lon={parkingLot.location.coordinates[0]}
            name={parkingLot.name}
          />
        </div>
      )}

      {/* Lightbox modal */}
      {lightboxOpen && parkingLot.image && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-[95%] max-h-[95%]" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-white bg-black/40 p-2 rounded-full"
              onClick={() => setLightboxOpen(false)}
            >
              ✕
            </button>

            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black/40 p-2 rounded-full"
              onClick={() => setLightboxIndex((prev) => (prev - 1 + parkingLot.image.length) % parkingLot.image.length)}
            >
              ‹
            </button>

            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black/40 p-2 rounded-full"
              onClick={() => setLightboxIndex((prev) => (prev + 1) % parkingLot.image.length)}
            >
              ›
            </button>

            <div className="flex items-center justify-center">
              <img
                src={parkingLot.image[lightboxIndex]}
                alt={`Hình lớn ${lightboxIndex + 1}`}
                className="max-h-[80vh] max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
