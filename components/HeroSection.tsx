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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
    { id: "hcm", name: "Ho Chi Minh" },
    { id: "hn", name: "Ha Noi" },
    { id: "dn", name: "Da Nang" },
    { id: "bh", name: "Bien Hoa" },
    { id: "nt", name: "Nha Trang" },
    { id: "hue", name: "Hue" },
    { id: "ct", name: "Can Tho" },
  ];

  const handleSelectLocation = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    const loc = allLocations.find((loc) => loc.id === selectedId) || null;
    setSelectedLocation(loc);
  };

  const handleFindParking = async () => {
    if (!selectedLocation) {
      toast.warning("Please select a city");
      return;
    }

    setIsSearching(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/search/city?location=${selectedLocation.name}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.data && data.data.length > 0) {
        router.push(
          `/CitiMap?city=${encodeURIComponent(selectedLocation.name)}&arriving=${encodeURIComponent(
            arriving.toISOString()
          )}&leaving=${encodeURIComponent(leaving.toISOString())}`
        );
      } else {
        toast.info("No parking spots found in this city");
      }
    } catch (error) {
      console.error("Error fetching parking lots:", error);
      toast.error("An error occurred while searching for parking spots. Please try again later");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section className="relative z-10 flex flex-col items-center justify-center h-3/4 text-center px-4 sm:px-6 md:px-8">
      {/* Introduction text */}
      <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-md mb-4">
        Smart Parking – Fast, Easy & Reliable
      </h1>
      <p className="text-lg md:text-xl text-white drop-shadow-sm mb-8 max-w-2xl">
        Reserve safe parking nationwide — easily with just a few clicks
      </p>

      {/* Search Form */}
      <div className="bg-white/95 p-6 md:p-6 rounded-2xl w-full max-w-md transform hover:scale-105 transition-transform duration-300">
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
        <div className="mt-8 md:mt-8 bg-white/95 p-2 sm:p-4 md:p-6 rounded-2xl w-full max-w-xs sm:max-w-sm md:max-w-md transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-4 md:mb-4">
            Selected: <span className="text-blue-600">{selectedLocation.name}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 md:gap-4">
            <div>
              <label className="text-xs sm:text-sm md:text-sm font-medium text-gray-600 block mb-1">
                Arrival Date
              </label>
              <DatePicker
                selected={arriving}
                onChange={(date: Date | null) => {
                  if (!date) return;
                  const newDate = new Date(date);
                  newDate.setHours(arriving.getHours());
                  newDate.setMinutes(arriving.getMinutes());
                  setArriving(newDate);
                }}
                dateFormat="dd/MM/yyyy"
                className="w-full border border-gray-300 px-2 sm:px-3 md:px-3 py-1 sm:py-2 md:py-2 rounded-lg focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm md:text-sm"
              />

              <label className="text-xs sm:text-sm md:text-sm font-medium text-gray-600 block mt-2 sm:mt-4 md:mt-4 mb-1">
                Arrival Time
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
                className="w-full border border-gray-300 px-2 sm:px-3 md:px-3 py-1 sm:py-2 md:py-2 rounded-lg focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm md:text-sm"
              />
            </div>

            <div className="hidden md:block">
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Departure Date
              </label>
              <DatePicker
                selected={leaving}
                onChange={(date: Date | null) => {
                  if (!date) return;
                  const newDate = new Date(date);
                  newDate.setHours(leaving.getHours());
                  newDate.setMinutes(leaving.getMinutes());
                  setLeaving(newDate);
                }}
                dateFormat="dd/MM/yyyy"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              />

              <label className="text-sm font-medium text-gray-600 block mt-4 mb-1">
                Departure Time
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
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="md:hidden">
              <label className="text-xs sm:text-sm font-medium text-gray-600 block mb-1">
                Departure Date
              </label>
              <DatePicker
                selected={leaving}
                onChange={(date: Date | null) => {
                  if (!date) return;
                  const newDate = new Date(date);
                  newDate.setHours(leaving.getHours());
                  newDate.setMinutes(leaving.getMinutes());
                  setLeaving(newDate);
                }}
                dateFormat="dd/MM/yyyy"
                className="w-full border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 rounded-lg focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm"
              />

              <label className="text-xs sm:text-sm font-medium text-gray-600 block mt-2 sm:mt-4 mb-1">
                Departure Time
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
                className="w-full border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 rounded-lg focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm"
              />
            </div>
          </div>

          <Button
            className="mt-4 sm:mt-6 md:mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 sm:py-3 md:py-3 rounded-lg transition-all duration-300"
            onClick={handleFindParking}
            disabled={isSearching}
          >
            {isSearching ? "Searching..." : "Find Parking"}
          </Button>
        </div>
      )}
    </section>
  );
}