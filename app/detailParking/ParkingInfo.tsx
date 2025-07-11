"use client";

import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
// import ParkingMap from "./ParkingMap";
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
import { useState } from "react";

export default function ParkingInfo() {
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
  });

  const [selectedZone, setSelectedZone] = useState<"A" | "B" | "C">("A");

  const zones = ["A", "B", "C"];
  const spotsPerZone = 30;

  const spots = Array.from({ length: spotsPerZone }, (_, i) => ({
    id: `${selectedZone}${i + 1}`,
    status:
      i % 10 === 0
        ? "occupied"
        : i % 7 === 0
        ? "booked"
        : "available",
  }));

  return (
    <section className="flex flex-col gap-8">
      {/* === SLIDER === */}
      <div className="relative w-full rounded-xl overflow-hidden">
        <div ref={sliderRef} className="keen-slider rounded-xl">
          {[...Array(5)].map((_, i) => (
            <div className="keen-slider__slide" key={i}>
              <Image
                src={`/b1.jpg`}
                alt={`Parking Image ${i + 1}`}
                width={1200}
                height={600}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          ))}
        </div>

        {/* Prev/Next */}
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

      {/* === Info === */}
      <h1 className="text-2xl font-bold">DTU Smart Parking Lot</h1>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <MapPin className="w-4 h-4" /> 123 DTU Street, Da Nang City
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Clock className="w-4 h-4" /> Open: 24/7
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Star className="w-4 h-4 text-yellow-500" /> 4.8 / 5.0
      </div>

      <div className="text-sm text-gray-600">
        <strong>Zones:</strong> A, B, C — Total: 150 spots
      </div>

      <div className="text-sm text-gray-600">
        <strong>Price:</strong> $1.5/hour
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <CheckCircle className="w-4 h-4 text-green-600" /> Near Airport,
        University, Mall
      </div>

      {/* === Contact Info === */}
      <div className="flex flex-col gap-2 mt-4 text-sm text-gray-600">
        <h2 className="text-base font-semibold">Owner Contact</h2>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" /> Mr. John Parking
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" /> +84 912 345 678
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4" /> john.parking@example.com
        </div>
      </div>

      {/* === ZONE SELECTOR === */}
      <div className="mt-6">
        <label className="text-sm font-medium block mb-2">
          Select Zone:
        </label>
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value as "A" | "B" | "C")}
          className="border px-3 py-2 rounded-md"
        >
          {zones.map((zone) => (
            <option key={zone} value={zone}>
              Zone {zone}
            </option>
          ))}
        </select>
      </div>

      {/* === SPOT GRID === */}
      <div className="grid grid-cols-6 gap-2 mt-4">
        {spots.map((spot) => (
          <div
            key={spot.id}
            className={`w-12 h-12 flex items-center justify-center rounded-md text-xs font-medium text-white ${
              spot.status === "occupied"
                ? "bg-red-600"
                : spot.status === "booked"
                ? "bg-yellow-500"
                : "bg-green-600"
            }`}
          >
            {spot.id}
          </div>
        ))}
      </div>

      {/* === LEGEND === */}
      <div className="flex gap-4 mt-4 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-600 rounded"></div> Occupied
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div> Booked
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-600 rounded"></div> Available
        </div>
      </div>

      {/* === MAP === */}
      <div className="w-full h-64 bg-gray-200 mt-6 rounded-lg flex items-center justify-center">
        {/* <ParkingMap/> */}
      </div>
    </section>
  );
}
