"use client";
import { Parking } from "./types";

interface ParkingCardProps {
  parking: Parking;
  onSelect: (parking: Parking) => void;
  onNavigate: () => void;
}

export const ParkingCard = ({ parking, onSelect, onNavigate }: ParkingCardProps) => (
  <div
    className="border border-gray-300 p-3 rounded shadow-sm bg-white cursor-pointer hover:shadow-md transition-shadow"
    onClick={() => onSelect(parking)}
  >
    <img
      src={parking.avtImage || "/default-parking.jpg"}
      alt={parking.name}
      className="w-full h-24 object-cover mb-2 rounded"
    />
    <h3 className="font-semibold text-gray-800">{parking.name}</h3>
    <p className="text-sm text-gray-600">Địa chỉ: {parking.address}</p>
    <p className="text-sm text-gray-600">
      Giá: {parking.pricePerHour.toLocaleString()} VNĐ/giờ
    </p>
    <p className="text-sm">
      Trạng thái:{" "}
      <span className={parking.isActive ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
        {parking.isActive ? "Còn trống" : "Hết chỗ"}
      </span>
    </p>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onNavigate();
      }}
      className="mt-2 w-full bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
    >
      Chỉ đường
    </button>
  </div>
);