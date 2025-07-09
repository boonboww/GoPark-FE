"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LocationSuggestion {
  id: string;
  name: string;
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// City mapping dictionary
const cityNameMap: Record<string, string> = {
  'đà nẵng': 'Da Nang',
  'hồ chí minh': 'Ho Chi Minh',
  'hà nội': 'Ha Noi',
  'biên hòa': 'Bien Hoa',
  'nha trang': 'Nha Trang',
  'huế': 'Hue',
  'cần thơ': 'Can Tho',
  'vũng tàu': 'Vung Tau',
  'hải phòng': 'Hai Phong',
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
  // Remove prefixes like 'city of', 'province of'
  return cityName
    .replace(/^(thành phố|tp\.?|tp\s|thanh pho|city of|province of)\s*/i, '')
    .trim();
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

  const allLocations: LocationSuggestion[] = [
    { id: "nearby", name: "Near me" },
    { id: "hcm", name: "Ho Chi Minh" },
    { id: "hn", name: "Ha Noi" },
    { id: "dn", name: "Da Nang" },
    { id: "bh", name: "Bien Hoa" },
    { id: "nt", name: "Nha Trang" },
    { id: "hue", name: "Hue" },
    { id: "ct", name: "Can Tho" },
  ];

  const getCityFromCoordinates = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=vi`
      );
      const data = await res.json();
      
      return data?.address?.city || 
             data?.address?.town || 
             data?.address?.state ||
             data?.address?.county;
    } catch (error) {
      console.error("Error getting city info:", error);
      return null;
    }
  };

  const normalizeCityName = (cityName: string): string => {
    const cleanedName = cleanCityName(cityName);
    const normalized = removeVietnameseTones(cleanedName);
    return cityNameMap[normalized] || 
           normalized.split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
  };

  const handleNearbyLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    toast.message("Detecting your location...");

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 60000,
          enableHighAccuracy: true
        });
      });

      const { latitude, longitude } = position.coords;
      const cityName = await getCityFromCoordinates(latitude, longitude);

      if (!cityName) {
        toast.error("Could not determine city from your location.");
        return;
      }

      const normalizedName = normalizeCityName(cityName);

      setSelectedLocation({
        id: "current",
        name: normalizedName
      });

      toast.success(`Location detected: ${normalizedName}`);

    } catch (error) {
      console.error("Location error:", error);
      toast.error("Failed to get location. Please try again or select manually.");
    }
  };

  const handleSelectLocation = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;

    if (selectedId === "nearby") {
      await handleNearbyLocation();
    } else {
      const loc = allLocations.find((loc) => loc.id === selectedId) || null;
      setSelectedLocation(loc);
    }
  };

  const handleFindParking = async () => {
    if (!selectedLocation) {
      toast.warning("Please select a city");
      return;
    }

    setIsSearching(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/search/city?location=${encodeURIComponent(selectedLocation.name)}`
      );

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();

      if (data.data?.length > 0) {
        router.push(
          `/CitiMap?city=${encodeURIComponent(selectedLocation.name)}&arriving=${encodeURIComponent(
            arriving.toISOString()
          )}&leaving=${encodeURIComponent(leaving.toISOString())}`
        );
      } else {
        toast.info(`No parking found in ${selectedLocation.name}`);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section className="relative z-10 flex flex-col items-center justify-center h-3/4 text-center px-4 sm:px-6 md:px-8">
      <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-md mb-4">
        Smart Parking – Fast, Easy & Reliable
      </h1>
      <p className="text-lg md:text-xl text-white drop-shadow-sm mb-8 max-w-2xl">
        Reserve safe parking nationwide - with just a few clicks
      </p>

      <div className="bg-white/95 p-6 rounded-2xl w-full max-w-md transform hover:scale-105 transition-transform duration-300">
        <select
          value={selectedLocation?.id || ""}
          onChange={handleSelectLocation}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg text-base font-bold text-gray-700 focus:ring-2 focus:ring-blue-400"
        >
          <option value="" disabled>
            Select a city...
          </option>
          {allLocations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      {selectedLocation && (
        <div className="mt-8 bg-white/95 p-6 rounded-2xl w-full max-w-md transform hover:scale-105 transition-transform duration-300">
          <div className="mb-4">
            <h2 className="text-sm font-medium text-gray-600">
              {selectedLocation.id === "current" ? "Current location" : "Selected"}
            </h2>
            <p className="text-xl font-semibold text-blue-600">
              {selectedLocation.name}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Arrival date
              </label>
              <DatePicker
                selected={arriving}
                onChange={(date: Date | null) => {
                  if (date) setArriving(date);
                }}
                dateFormat="dd/MM/yyyy"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 text-sm"
              />

              <label className="text-sm font-medium text-gray-600 block mt-3 mb-1">
                Arrival time
              </label>
              <DatePicker
                selected={arriving}
                onChange={(time: Date | null) => {
                  if (!time) return;
                  const newTime = new Date(arriving);
                  newTime.setHours(time.getHours());
                  newTime.setMinutes(time.getMinutes());
                  setArriving(newTime);
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="HH:mm"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Departure date
              </label>
              <DatePicker
                selected={leaving}
                onChange={(date: Date | null) => {
                  if (date) setLeaving(date);
                }}
                dateFormat="dd/MM/yyyy"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 text-sm"
              />

              <label className="text-sm font-medium text-gray-600 block mt-3 mb-1">
                Departure time
              </label>
              <DatePicker
                selected={leaving}
                onChange={(time: Date | null) => {
                  if (!time) return;
                  const newTime = new Date(leaving);
                  newTime.setHours(time.getHours());
                  newTime.setMinutes(time.getMinutes());
                  setLeaving(newTime);
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="HH:mm"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>
          </div>

          <Button
            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
            onClick={handleFindParking}
            disabled={isSearching}
          >
            {isSearching ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </span>
            ) : (
              "Find Parking"
            )}
          </Button>
        </div>
      )}
    </section>
  );
}