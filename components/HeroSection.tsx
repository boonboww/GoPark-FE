"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import debounce from "lodash.debounce";
import { toast } from "sonner";

interface LocationSuggestion {
  id: string;
  name: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function HeroSection() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [arriving, setArriving] = useState<Date>(new Date());
  const [leaving, setLeaving] = useState<Date>(() => {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    return date;
  });
  const [isSearching, setIsSearching] = useState(false);

  const allLocations: LocationSuggestion[] = useMemo(() => [
    { id: "hcm", name: "Hồ Chí Minh" },
    { id: "hn", name: "Hà Nội" },
    { id: "dn", name: "Đà Nẵng" },
    { id: "bh", name: "Biên Hòa" },
    { id: "nt", name: "Nha Trang" },
    { id: "hue", name: "Huế" },
    { id: "ct", name: "Cần Thơ" },
  ], []);

  const handleLocationSearch = useCallback(
    debounce((value: string) => {
      if (value.length > 0) {
        const filtered = allLocations.filter((loc) =>
          loc.name.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered);
      } else {
        setSuggestions([]);
      }
    }, 300),
    [allLocations]
  );

  const handleLocationChange = (value: string) => {
    setLocation(value);
    handleLocationSearch(value);
  };

  const handleSelectLocation = (loc: LocationSuggestion) => {
    setSelectedLocation(loc);
    setLocation(loc.name);
    setSuggestions([]);
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
    <section className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
      {/* Giới thiệu chữ */}
      <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-md mb-4">
        Smart Parking – Fast, Easy & Reliable
      </h1>
      <p className="text-white text-lg md:text-xl mb-8 drop-shadow-sm max-w-2xl">
        Reserve safe parking nationwide — easily with just a few clicks
      </p>

      {/* Form Tìm kiếm */}
      <div className="bg-white/95 p-6 rounded-2xl w-full max-w-md transform hover:scale-105 transition-transform duration-300">
        <div className="relative">
          <Input
            placeholder="Search by city..."
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="font-bold text-base placeholder:font-bold placeholder:text-base w-full"
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border w-full mt-2 rounded-lg shadow-lg max-h-60 overflow-auto">
              {suggestions.map((sug) => (
                <li
                  key={sug.id}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  onClick={() => handleSelectLocation(sug)}
                >
                  {sug.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {selectedLocation && (
        <div className="mt-8 bg-white/95 p-6 rounded-2xl w-full max-w-md transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Selected: <span className="text-blue-600">{selectedLocation.name}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">
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
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              />

              <label className="text-sm font-medium text-gray-600 block mt-4 mb-1">
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
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
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
          </div>

          <Button
            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
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
