"use client";
import { useRouter } from "next/navigation";
import { MapPin, Navigation, Info, Wallet, CheckCircle2, XCircle } from "lucide-react";
import { Parking } from "./types";

interface ParkingCardProps {
  parking: Parking;
  onSelect: (parking: Parking) => void;
  onNavigate: () => void;
}

export const ParkingCard = ({ parking, onSelect, onNavigate }: ParkingCardProps) => {
  const router = useRouter();

  return (
    <div
      className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white cursor-pointer hover:shadow-md transition-all hover:border-blue-200"
      onClick={() => onSelect(parking)}
    >
      <div className="relative">
        <img
          src={parking.avtImage || "/bg.jpg"}
          alt={parking.name}
          className="w-full h-32 object-cover mb-3 rounded-lg"
        />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center text-xs font-medium shadow-sm">
          {parking.isActive ? (
            <CheckCircle2 className="w-3 h-3 text-green-600 mr-1" />
          ) : (
            <XCircle className="w-3 h-3 text-red-600 mr-1" />
          )}
          {parking.isActive ? "Còn chỗ" : "Hết chỗ"}
        </div>
      </div>

      <div className="space-y-1.5">
        <h3 className="font-semibold text-gray-800 flex items-start">
          <MapPin className="w-4 h-4 text-red-500 mt-0.5 mr-1.5 flex-shrink-0" />
          <span className="line-clamp-1">{parking.name}</span>
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-2">{parking.address}</p>
        
        <div className="flex items-center text-sm text-gray-700">
          <Wallet className="w-4 h-4 text-gray-500 mr-1.5" />
          <span>
            {parking.pricePerHour != null ? 
              `${parking.pricePerHour.toLocaleString()} VND/giờ` : 
              "Giá: Không có"}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate();
          }}
          className="flex items-center justify-center bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Navigation className="w-4 h-4 mr-1.5" />
          Chỉ đường
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/detailParking/${parking._id}`);
          }}
          className="flex items-center justify-center bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          <Info className="w-4 h-4 mr-1.5" />
          Chi tiết
        </button>
      </div>
    </div>
  );
};