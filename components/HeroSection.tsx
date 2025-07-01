"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const [location, setLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [arriving, setArriving] = useState<Date>(new Date());
  const [leaving, setLeaving] = useState<Date>(
    new Date(new Date().getTime() + 60 * 60 * 1000)
  );

  const allLocations = [
    "Hồ Chí Minh",
    "Hà Nội",
    "Đà Nẵng",
    "Biên Hòa",
    "Nha Trang",
  ];

  const handleLocationChange = (value: string) => {
    setLocation(value);
    if (value.length > 0) {
      const filtered = allLocations.filter((loc) =>
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectLocation = (loc: string) => {
    setSelectedLocation(loc);
    setLocation(loc);
    setSuggestions([]);
  };

  return (
    <section className="relative flex-1 gradient-bg flex flex-col items-center justify-center px-4 py-8 min-h-[70vh]">
      {/* Overlay background */}
      <div className="overlay absolute top-0 left-0 w-full h-full bg-black/40 z-0" />
      <div className="content relative z-10">
        {/* Search Box */}
        <div className="bg-white/95 p-6 rounded-2xl shadow-xl border-2 border-gray-200 w-[360px] transform hover:scale-105 transition-transform duration-300">
          <div className="relative">
            <Input
              placeholder="Where are you going?"
              value={location}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="font-bold text-base placeholder:font-bold placeholder:text-base w-full"
              autoComplete="off"
            />

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border w-full mt-2 rounded-lg shadow-lg">
                {suggestions.map((sug, index) => (
                  <li
                    key={index}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => handleSelectLocation(sug)}
                  >
                    {sug}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Time Selection */}
        {selectedLocation && (
          <div className="mt-8 bg-white/95 p-6 rounded-2xl shadow-xl border-2 border-gray-200 w-[360px] transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Selected: <span className="text-blue-600">{selectedLocation}</span>
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {/* Arriving */}
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Arriving - Date
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
                  dateFormat="yyyy-MM-dd"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                />

                <label className="text-sm font-medium text-gray-600 block mt-4 mb-1">
                  Arriving - Time
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
                  dateFormat="h:mm aa"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Leaving */}
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Leaving - Date
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
                  dateFormat="yyyy-MM-dd"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                />

                <label className="text-sm font-medium text-gray-600 block mt-4 mb-1">
                  Leaving - Time
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
                  dateFormat="h:mm aa"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <Button className="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-300">
              Find Parking
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
