"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CITY_CENTERS } from "@/app/CitiMap/types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface LocationSuggestion {
  id: string;
  name: string;
}

const cityNameMap: Record<string, string> = {
  "da nang": "Đà Nẵng",
  "ho chi minh": "Hồ Chí Minh",
  "ha noi": "Hà Nội",
  "bien hoa": "Biên Hòa",
  "nha trang": "Nha Trang",
  "hue": "Huế",
  "can tho": "Cần Thơ",
  "vung tau": "Vũng Tàu",
  "hai phong": "Hải Phòng",
};

function removeVietnameseTones(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

function cleanCityName(cityName: string): string {
  return cityName
    .replace(/^(thành phố|tp\.?|tp\s|thanh pho|city of|province of)\s*/i, "")
    .trim();
}

function normalizeCityName(cityName: string): string {
  const cleaned = removeVietnameseTones(cleanCityName(cityName));
  return cityNameMap[cleaned] || cityName;
}

export default function HeroSection() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
  const [arriving, setArriving] = useState<Date>(new Date());
  const [leaving, setLeaving] = useState<Date>(() => {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    return date;
  });
  const [isSearching, setIsSearching] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);

  const allLocations: LocationSuggestion[] = [
    { id: "nearby", name: "Near me" },
    { id: "hcm", name: "Hồ Chí Minh" },
    { id: "hn", name: "Hà Nội" },
    { id: "dn", name: "Đà Nẵng" },
    { id: "bh", name: "Biên Hòa" },
    { id: "nt", name: "Nha Trang" },
    { id: "hue", name: "Huế" },
    { id: "ct", name: "Cần Thơ" },
    { id: "vt", name: "Vũng Tàu" },
    { id: "hp", name: "Hải Phòng" },
  ];

  const getCityFromCoordinates = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=vi`
      );
      const data = await res.json();
      return (
        data?.address?.city ||
        data?.address?.town ||
        data?.address?.state ||
        data?.address?.county
      );
    } catch (error) {
      console.error("Error getting city info:", error);
      return null;
    }
  };

  const handleNearbyLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Trình duyệt không hỗ trợ định vị.");
      return;
    }

    toast.message("Đang xác định vị trí của bạn...");

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 60000,
          enableHighAccuracy: true,
        });
      });

      const { latitude, longitude } = position.coords;
      setUserCoords({ lat: latitude, lon: longitude });

      const cityName = await getCityFromCoordinates(latitude, longitude);
      if (!cityName) {
        toast.error("Không thể xác định thành phố từ vị trí của bạn.");
        return;
      }

      const normalized = normalizeCityName(cityName);
      setSelectedLocation({ id: "current", name: normalized });
      toast.success(`Đã xác định vị trí: ${normalized}`);
    } catch (error) {
      console.error("Lỗi định vị:", error);
      toast.error("Không thể lấy vị trí. Vui lòng thử lại hoặc chọn thủ công.");
    }
  };

  const handleSelectLocation = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    if (selectedId === "nearby") {
      await handleNearbyLocation();
    } else {
      const loc = allLocations.find((loc) => loc.id === selectedId) || null;
      setSelectedLocation(loc);
      setUserCoords(null);
    }
  };

  const handleFindParking = async () => {
    if (!selectedLocation) {
      toast.warning("Vui lòng chọn thành phố");
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/search/city?location=${encodeURIComponent(
          selectedLocation.name
        )}`
      );

      if (!res.ok) throw new Error(`Lỗi HTTP! Status: ${res.status}`);

      const data = await res.json();

      if (!Array.isArray(data.data) || data.data.length === 0) {
        await toast.info(`Không có bãi đỗ xe ở ${selectedLocation.name}`);
        return;
      }

      const queryParams = new URLSearchParams({
        city: selectedLocation.name,
        arriving: arriving.toISOString(),
        leaving: leaving.toISOString(),
        isNearby: selectedLocation.id === "current" ? "true" : "false",
        ...(selectedLocation.id === "current"
          ? {
              userLat: userCoords?.lat.toString() || "",
              userLon: userCoords?.lon.toString() || "",
            }
          : CITY_CENTERS[selectedLocation.name]
          ? {
              userLat: CITY_CENTERS[selectedLocation.name][0].toString(),
              userLon: CITY_CENTERS[selectedLocation.name][1].toString(),
            }
          : {}),
      });

      router.push(`/CitiMap?${queryParams.toString()}`);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      toast.error("Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[65vh] md:min-h-[70vh] text-center px-4 sm:px-6 md:px-8 pt-24 pb-12">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source
            src="https://s3.amazonaws.com/random-static.parkwhiz/videos/home-header-3.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/50 z-0" />
      </div>

      {/* Nội dung chính */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl w-full max-w-md shadow-md ring-1 ring-white/20 mb-4 mx-auto">
          <select
            value={selectedLocation?.id || ""}
            onChange={handleSelectLocation}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg text-base font-bold text-gray-800 focus:ring-2 focus:ring-blue-400"
          >
            <option value="" disabled>
              Chọn thành phố...
            </option>
            {allLocations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {selectedLocation && (
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl w-full max-w-md shadow-md ring-1 ring-white/20 mx-auto">
            <div className="mb-4">
              <h2 className="text-sm font-medium text-gray-800">
                {selectedLocation.id === "current" ? "Vị trí hiện tại" : "Đã chọn"}
              </h2>
              <p className="text-xl font-bold text-blue-800">
                {selectedLocation.name}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-800 block mb-1">
                  Ngày đến
                </label>
                <DatePicker
                  selected={arriving}
                  onChange={(date: Date | null) => date && setArriving(date)}
                  dateFormat="dd/MM/yyyy"
                  className="w-full border px-3 py-2 rounded-lg text-sm"
                />
                <label className="text-sm font-medium text-gray-800 block mt-3 mb-1">
                  Giờ đến
                </label>
                <DatePicker
                  selected={arriving}
                  onChange={(time: Date | null) => {
                    if (!time) return;
                    const newTime = new Date(arriving);
                    newTime.setHours(time.getHours(), time.getMinutes());
                    setArriving(newTime);
                  }}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Giờ"
                  dateFormat="HH:mm"
                  className="w-full border px-3 py-2 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800 block mb-1">
                  Ngày rời
                </label>
                <DatePicker
                  selected={leaving}
                  onChange={(date: Date | null) => date && setLeaving(date)}
                  dateFormat="dd/MM/yyyy"
                  className="w-full border px-3 py-2 rounded-lg text-sm"
                />
                <label className="text-sm font-medium text-gray-800 block mt-3 mb-1">
                  Giờ rời
                </label>
                <DatePicker
                  selected={leaving}
                  onChange={(time: Date | null) => {
                    if (!time) return;
                    const newTime = new Date(leaving);
                    newTime.setHours(time.getHours(), time.getMinutes());
                    setLeaving(newTime);
                  }}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Giờ"
                  dateFormat="HH:mm"
                  className="w-full border px-3 py-2 rounded-lg text-sm"
                />
              </div>
            </div>

            <Button
              className="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-colors"
              onClick={handleFindParking}
              disabled={isSearching}
            >
              {isSearching ? "Đang Tìm..." : "Tìm Chỗ Đậu Xe"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}