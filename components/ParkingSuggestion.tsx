"use client";


import Image from "next/image";
import Link from "next/link";
import { MapPin, DollarSign, LocateFixed, ChevronLeft, ChevronRight, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { KeenSliderInstance, useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

type ParkingLot = {
  _id: string;
  name: string;
  address: string;  
  price?: string;
  image?: string[];
  avtImage?: string;
};

const DEFAULT_RADIUS_KM = 3;


export default function ParkingSuggestion() {
  const [allLots, setAllLots] = useState<ParkingLot[]>([]);
  const [lots, setLots] = useState<ParkingLot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationTried, setLocationTried] = useState(false);
  const [showNearby, setShowNearby] = useState(false);
  // Phân trang thủ công cho chế độ xem tất cả
  const [page, setPage] = useState(0);
  const perPage = 4;
  // keen-slider chỉ dùng cho chế độ Gần bạn
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 4, spacing: 24 },
    loop: false,
    mode: "free",
  });
  // Ref để force remount slider container
  const [sliderKey, setSliderKey] = useState(0);

  // Lấy toàn bộ bãi đỗ khi load trang
  useEffect(() => {
    const fetchAllLots = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/v1/parkinglots/public/all`);
        if (!res.ok) throw new Error("Không thể tải danh sách bãi đỗ");
        const data = await res.json();
        setAllLots(data.data || []);
        setLots(data.data || []);
      } catch (err: any) {
        setError(err.message || "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };
    fetchAllLots();
  }, []);

  // Lấy bãi đỗ gần vị trí user khi nhấn nút
  const fetchNearbyLots = () => {
    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ định vị.");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
          const res = await fetch(
            `${apiUrl}/api/v1/search/nearby/lat/${lat}/lng/${lng}/radius/${DEFAULT_RADIUS_KM}`
          );
          if (!res.ok) throw new Error("Không thể tải dữ liệu bãi đỗ gần bạn");
          const data = await res.json();
          setLots(data.data || []);
          setShowNearby(true);
          setPage(0);
        } catch (err: any) {
          setError(err.message || "Có lỗi xảy ra");
        } finally {
          setLoading(false);
          setLocationTried(true);
        }
      },
      (err) => {
        setError("Không thể lấy vị trí hiện tại. Vui lòng cho phép truy cập vị trí.");
        setLoading(false);
        setLocationTried(true);
      }
    );
  };

  // Nút để chuyển về xem toàn bộ bãi đỗ
  const handleShowAll = () => {
    setShowNearby(false);
    setLots(allLots);
    setPage(0);
    setSliderKey(k => k + 1); // force remount slider container
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold flex-1">
          {showNearby ? "Các bãi đỗ gần bạn" : "Tất cả bãi đỗ"}
        </h2>
        {!showNearby ? (
          <Button
            className="flex items-center gap-1 cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
            onClick={fetchNearbyLots}
          >
            <LocateFixed className="w-5 h-5" /> Gần bạn
          </Button>
        ) : (
          <Button
            variant="secondary"
            className="flex items-center gap-1 cursor-pointer bg-gray-200 text-gray-800 hover:bg-gray-300"
            onClick={handleShowAll}
          >
            <List className="w-5 h-5" /> Hiện tất cả
          </Button>
        )}
      </div>
      {loading && <div>Đang tải...</div>}
      {error && (
        <div className="text-red-500 mb-4 flex flex-col gap-2">
          <span>{error}</span>
          {locationTried && showNearby && (
            <Button
              className="flex items-center gap-1 cursor-pointer bg-blue-600 text-white hover:bg-blue-700 w-max"
              onClick={fetchNearbyLots}
            >
              <LocateFixed className="w-5 h-5" /> Bật định vị / Thử lại
            </Button>
          )}
        </div>
      )}
      <div className="relative">
        {!showNearby ? (
          <div className="flex flex-row gap-4 px-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            style={{WebkitOverflowScrolling: 'touch'}}>
            {lots.slice(page * perPage, page * perPage + perPage).map((s) => {
              let img: string = "/bg.jpg";
              if (Array.isArray(s.image) && typeof s.image[0] === "string" && s.image[0].trim()) {
                img = s.image[0];
              } else if (typeof s.avtImage === "string" && s.avtImage.trim()) {
                img = s.avtImage;
              }
              if (typeof img !== "string" || !img.trim()) {
                img = "/bg.jpg";
              }
              return (
                <div
                  className="flex-shrink-0 flex justify-center items-stretch"
                  style={{width: '90vw', maxWidth: 260, minWidth: 220, height: 320}}
                  key={s._id}
                >
                  <Link href={`/detailParking/${s._id}`} className="block w-full h-full cursor-pointer">
                    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer bg-white flex flex-col h-full" style={{height: '100%'}}>
                      <div className="w-full h-40 relative">
                        <img
                          src={img}
                          alt={s.name || "Bãi đỗ"}
                          className="object-cover w-full h-full rounded-t-lg"
                          style={{objectFit: 'cover'}}
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        {/* Tên bãi đỗ */}
                        <div className="min-h-[28px] flex items-center">
                          <h3 className="font-medium text-base truncate w-full text-ellipsis">{s.name}</h3>
                        </div>
                        {/* Địa chỉ */}
                        <div className="min-h-[36px] flex items-center">
                          <MapPin className="w-4 h-4 flex-shrink-0 mr-1" />
                          <span className="text-sm text-gray-600 w-full break-words whitespace-pre-line">{s.address}</span>
                        </div>
                        {/* Giá */}
                        <div className="min-h-[28px] flex items-center">
                          <DollarSign className="w-4 h-4 flex-shrink-0 mr-1" />
                          <span className="text-sm text-gray-600">{s.price || "Liên hệ"}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div ref={sliderRef} key={sliderKey} className="keen-slider flex items-stretch px-2">
            {lots.map((s, idx) => {
              let img: string = "/bg.jpg";
              if (Array.isArray(s.image) && typeof s.image[0] === "string" && s.image[0].trim()) {
                img = s.image[0];
              } else if (typeof s.avtImage === "string" && s.avtImage.trim()) {
                img = s.avtImage;
              }
              if (typeof img !== "string" || !img.trim()) {
                img = "/bg.jpg";
              }
              return (
                <div className="keen-slider__slide flex justify-center items-stretch px-2" key={s._id}>
                  <Link href={`/detailParking/${s._id}`} className="block w-full max-w-xs h-full">
                    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer bg-white flex flex-col h-full">
                      <div className="w-full h-40 relative">
                        <img
                          src={img}
                          alt={s.name || "Bãi đỗ"}
                          className="object-cover w-full h-full rounded-t-lg"
                          style={{objectFit: 'cover'}}
                        />
                      </div>
                      <div className="p-4 flex flex-col gap-2 flex-1">
                        <h3 className="font-medium text-base">{s.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" /> {s.address}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <DollarSign className="w-4 h-4" /> {s.price || "Liên hệ"}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
        {/* Nút phân trang thủ công: luôn hiển thị, vừa có thể bấm vừa có thể vuốt ngang trên mobile */}
        {!showNearby && lots.length > perPage && (
          <div className="flex justify-center gap-4 mt-4">
            <Button
              variant="secondary"
              className="cursor-pointer bg-yellow-400 text-black hover:bg-yellow-500 flex items-center gap-1"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="w-5 h-5" /> Trước
            </Button>
            <Button
              variant="default"
              className="cursor-pointer bg-green-800 text-white hover:bg-blue-700 flex items-center gap-1"
              onClick={() => setPage((p) => (p + 1 < Math.ceil(lots.length / perPage) ? p + 1 : p))}
              disabled={page + 1 >= Math.ceil(lots.length / perPage)}
            >
              Tiếp <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
        {/* Nút keen-slider cho chế độ gần bạn giữ nguyên */}
        {showNearby && lots.length > 4 && (
          <div className="flex justify-center gap-4 mt-4">
            <Button
              variant="secondary"
              className="cursor-pointer bg-yellow-400 text-black hover:bg-yellow-500 flex items-center gap-1"
              onClick={() => slider.current && slider.current.track.details && slider.current.prev()}
              disabled={!slider.current || !slider.current.track.details}
            >
              <ChevronLeft className="w-5 h-5" /> Trước
            </Button>
            <Button
              variant="default"
              className="cursor-pointer bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1"
              onClick={() => slider.current && slider.current.track.details && slider.current.next()}
              disabled={!slider.current || !slider.current.track.details}
            >
              Sau <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}