"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CITY_CENTERS } from "@/app/CitiMap/types";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock } from "lucide-react";
import LottieBox from "@/components/common/LottieBox";

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
  hue: "Huế",
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
  const [selectedLocation, setSelectedLocation] =
    useState<LocationSuggestion | null>(null);
  const [arriving, setArriving] = useState<Date>(new Date());
  const [leaving, setLeaving] = useState<Date>(() => {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    return date;
  });
  const [isSearching, setIsSearching] = useState(false);
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

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
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            maximumAge: 60000,
            enableHighAccuracy: true,
          });
        }
      );

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

  const handleSelectLocation = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
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
      <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col items-center lg:items-start w-full">
          {/* Heading with motion */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white text-center lg:text-left mb-8 w-full"
          >
            <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg leading-tight text-white mb-4">
              Đặt Chỗ Đậu Xe Dễ Dàng, Mọi Lúc Mọi Nơi
            </h1>

            <p className="text-lg md:text-xl font-medium text-white/90 drop-shadow-sm max-w-2xl mx-auto lg:mx-0">
              Khám phá bãi đỗ xe gần bạn và đặt trước chỉ trong vài giây!
            </p>
          </motion.div>

          {/* Booking Form Container */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl w-full max-w-md shadow-md ring-1 ring-white/20 mx-auto lg:mx-0 transition-all duration-300">
            {/* Location Selector */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-800 block mb-1">
                Bạn muốn đỗ xe ở đâu?
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <select
                  value={selectedLocation?.id || ""}
                  onChange={handleSelectLocation}
                  className="w-full border border-gray-400 px-3 py-2 pl-10 rounded-lg text-base font-bold text-gray-800 focus:ring-2 focus:ring-blue-400 appearance-none"
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
            </div>

            {/* Time selection and button - Only show if location selected */}
            {selectedLocation && (
              <motion.div
                initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  transitionEnd: { overflow: "visible" },
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="pt-2 border-t border-gray-200/50 mt-2">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* Arriving */}
                    <div>
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1">
                        Đến lúc
                      </label>
                      <div className="flex flex-col gap-2">
                        <div className="relative">
                          <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 z-10" />
                          <DatePicker
                            selected={arriving}
                            onChange={(date: Date | null) =>
                              date && setArriving(date)
                            }
                            dateFormat="dd/MM/yyyy"
                            popperPlacement="top-start"
                            className="w-full bg-white border border-gray-400 px-2 py-1.5 pl-9 rounded text-sm font-medium text-gray-700 focus:ring-1 focus:ring-blue-500 outline-none"
                          />
                        </div>
                        <div className="relative">
                          <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 z-10" />
                          <DatePicker
                            selected={arriving}
                            onChange={(time: Date | null) => {
                              if (!time) return;
                              const newTime = new Date(arriving);
                              newTime.setHours(
                                time.getHours(),
                                time.getMinutes()
                              );
                              setArriving(newTime);
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Giờ"
                            dateFormat="HH:mm"
                            popperPlacement="top-start"
                            className="w-full bg-white border border-gray-400 px-2 py-1.5 pl-9 rounded text-sm font-medium text-gray-700 focus:ring-1 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Leaving */}
                    <div>
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1">
                        Rời lúc
                      </label>
                      <div className="flex flex-col gap-2">
                        <div className="relative">
                          <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 z-10" />
                          <DatePicker
                            selected={leaving}
                            onChange={(date: Date | null) =>
                              date && setLeaving(date)
                            }
                            dateFormat="dd/MM/yyyy"
                            popperPlacement="top-start"
                            className="w-full bg-white border border-gray-400 px-2 py-1.5 pl-9 rounded text-sm font-medium text-gray-700 focus:ring-1 focus:ring-blue-500 outline-none"
                          />
                        </div>
                        <div className="relative">
                          <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 z-10" />
                          <DatePicker
                            selected={leaving}
                            onChange={(time: Date | null) => {
                              if (!time) return;
                              const newTime = new Date(leaving);
                              newTime.setHours(
                                time.getHours(),
                                time.getMinutes()
                              );
                              setLeaving(newTime);
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Giờ"
                            dateFormat="HH:mm"
                            popperPlacement="top-start"
                            className="w-full bg-white border border-gray-400 px-2 py-1.5 pl-9 rounded text-sm font-medium text-gray-700 focus:ring-1 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-2.5 rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform active:scale-[0.98] cursor-pointer"
                    onClick={handleFindParking}
                    disabled={isSearching}
                  >
                    {isSearching ? "Đang Tìm..." : "Tìm Chỗ Đậu Xe Ngay"}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column: 3D Box */}
        <div className="hidden lg:block h-[600px] w-full relative">
          <LottieBox cityId={selectedLocation?.id} />
        </div>
      </div>
    </section>
  );
}
