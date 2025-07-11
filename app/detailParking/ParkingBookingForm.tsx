"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import DetailBookingModal from "./DetailBooking";
import { useState } from "react";
import {
  Car,
  MapPin,
  LayoutGrid,
  Clock,
  CreditCard,
  DollarSign,
} from "lucide-react";

type SpotStatus = "available" | "reserved" | "occupied";

type Zone = {
  name: string;
  spots: {
    id: string;
    status: SpotStatus;
  }[];
};

type BookingInfo = {
  name: string;
  vehicle: string;
  zone: string;
  spot: string;
  startTime: string;
  endTime: string;
  paymentMethod: string;
  estimatedFee: string;
};

export default function ParkingBookingForm({
  zones = [
    {
      name: "A",
      spots: Array.from({ length: 40 }, (_, i) => ({
        id: `A${i + 1}`,
        status:
          i % 10 === 0 ? "occupied" : i % 5 === 0 ? "reserved" : "available",
      })),
    },
    {
      name: "B",
      spots: Array.from({ length: 20 }, (_, i) => ({
        id: `B${i + 1}`,
        status: "available",
      })),
    },
  ],
}: {
  zones?: Zone[];
}) {
  const [selectedZone, setSelectedZone] = useState<string>(zones[0].name);
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [vehicle, setVehicle] = useState("Car 1 - 43A-12345");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  const [modalOpen, setModalOpen] = useState(false);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);

  const currentZone = zones.find((z) => z.name === selectedZone);

  const handleSubmit = () => {
    if (
      !name ||
      !vehicle ||
      !selectedZone ||
      !selectedSpot ||
      !startTime ||
      !endTime ||
      !paymentMethod
    ) {
      alert("Please fill in all fields and select a spot.");
      return;
    }

    const info: BookingInfo = {
      name,
      vehicle,
      zone: selectedZone,
      spot: selectedSpot!,
      startTime,
      endTime,
      paymentMethod,
      estimatedFee: "$3.50",
    };

    setBookingInfo(info);
    setModalOpen(true);
  };

  return (
    <aside className="border rounded-lg shadow-sm p-6 flex flex-col gap-4 bg-white">
      <h2 className="text-lg font-semibold mb-2">Book Your Spot</h2>

      <div>
        <Label>Name</Label>
        <Input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <Car className="w-4 h-4" /> Vehicle
        </Label>
        <select
          className="w-full border px-3 py-2 rounded-md cursor-pointer"
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
        >
          <option>Car 1 - 43A-12345</option>
          <option>Car 2 - 43B1-67890</option>
        </select>
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <MapPin className="w-4 h-4" /> Zone
        </Label>
        <select
          className="w-full border px-3 py-2 rounded-md cursor-pointer"
          value={selectedZone}
          onChange={(e) => {
            setSelectedZone(e.target.value);
            setSelectedSpot(null);
          }}
        >
          {zones.map((zone) => (
            <option key={zone.name} value={zone.name}>
              Zone {zone.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <LayoutGrid className="w-4 h-4" /> Select Spot
        </Label>
        <div className="grid grid-cols-8 gap-2 mt-2">
          {currentZone?.spots.map((spot) => {
            let color = "";
            if (spot.status === "available") color = "bg-green-400";
            else if (spot.status === "reserved") color = "bg-yellow-400";
            else if (spot.status === "occupied") color = "bg-red-400";

            const selected =
              selectedSpot === spot.id ? "ring-2 ring-black" : "";

            return (
              <button
                key={spot.id}
                disabled={spot.status === "occupied"}
                onClick={() => setSelectedSpot(spot.id)}
                className={`text-xs text-white flex items-center justify-center h-8 rounded ${color} ${selected} disabled:opacity-50 cursor-pointer`}
              >
                {spot.id}
              </button>
            );
          })}
        </div>

        <div className="mt-2 flex gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 bg-green-400 inline-block rounded" />{" "}
            Available
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 bg-yellow-400 inline-block rounded" />{" "}
            Reserved
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 bg-red-400 inline-block rounded" /> Occupied
          </span>
        </div>
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <Clock className="w-4 h-4" /> Start Time
        </Label>
        <Input
          type="datetime-local"
          className="cursor-pointer"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <Clock className="w-4 h-4" /> End Time
        </Label>
        <Input
          type="datetime-local"
          className="cursor-pointer"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <DollarSign className="w-4 h-4" /> Estimated Fee
        </Label>
        <Input placeholder="$3.50" disabled />
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <CreditCard className="w-4 h-4" /> Payment Method
        </Label>
        <select
          className="w-full border px-3 py-2 rounded-md cursor-pointer"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option>💳 Credit Card</option>
          <option>📱 VietQR</option>
          <option>💵 Cash</option>
        </select>
      </div>

      <Button
        className="bg-black text-white hover:bg-gray-900 mt-4"
        onClick={handleSubmit}
      >
        Confirm Booking
      </Button>

      <DetailBookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        bookingInfo={bookingInfo}
      />
    </aside>
  );
}
