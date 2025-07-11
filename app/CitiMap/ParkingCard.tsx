"use client";
import { Parking } from "./types";

interface ParkingCardProps {
  parking: Parking;
  onSelect: (parking: Parking) => void;
  onNavigate: () => void;
}

export const ParkingCard = ({
  parking,
  onSelect,
  onNavigate,
}: ParkingCardProps) => (
  <div
    className="border border-gray-300 p-3 rounded shadow-sm bg-white cursor-pointer hover:shadow-md transition-shadow"
    onClick={() => onSelect(parking)}
  >
    <img
      src={parking.avtImage || "/bg.jpg"}
      alt={parking.name}
      className="w-full h-24 object-cover mb-2 rounded"
    />
    <h3 className="font-semibold text-gray-800">{parking.name}</h3>
    <p className="text-sm text-gray-600">Address: {parking.address}</p>
    <p className="text-sm text-gray-600">
      Price:{" "}
      {parking.pricePerHour != null
        ? parking.pricePerHour.toLocaleString()
        : "N/A"}{" "}
      VND/hour
    </p>
    <p className="text-sm">
      Status:{" "}
      <span
        className={
          parking.isActive
            ? "text-green-600 font-bold"
            : "text-red-600 font-bold"
        }
      >
        {parking.isActive ? "Available" : "Full"}
      </span>
    </p>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onNavigate();
      }}
      className="mt-2 w-full bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
    >
      Get Directions
    </button>
  </div>
);
