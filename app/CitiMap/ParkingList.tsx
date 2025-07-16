"use client";
import { useRouter } from "next/navigation";
import { LocateFixed, Loader2, ChevronLeft, MapPin, Home } from "lucide-react";
import { ParkingCard } from "./ParkingCard";
import { Parking } from "./types";

interface ParkingListProps {
  city: string;
  parkings: Parking[];
  isLocating: boolean;
  isNearby: boolean;
  onFindNearby: () => void;
  onSelectParking: (parking: Parking) => void;
  onNavigateToParking: (lat: number, lon: number) => void;
}

export const ParkingList = ({
  parkings,
  isLocating,
  isNearby,
  onFindNearby,
  onSelectParking,
  onNavigateToParking,
}: ParkingListProps) => {
  const router = useRouter();

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Improved back button with home icon */}
      <div className="flex justify-between items-start mb-6">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          <span className="flex items-center gap-1 text-sm">
            <Home className="w-4 h-4" />
            Trang chủ
          </span>
        </button>
      </div>

      {/* Find nearby parking button */}
      {isNearby && (
        <button
          onClick={onFindNearby}
          disabled={isLocating}
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-6 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
        >
          {isLocating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <LocateFixed className="w-5 h-5" />
          )}
          Tìm bãi đỗ xe gần đây
        </button>
      )}

      {/* Parking list or empty state */}
      {parkings.length === 0 ? (
        <div className="text-center py-12 text-gray-500 flex flex-col items-center">
          <MapPin className="w-10 h-10 text-gray-400 mb-2" />
          <p className="text-lg">Không tìm thấy bãi đỗ xe</p>
          <p className="text-sm mt-1">Hãy thử điều chỉnh tiêu chí tìm kiếm</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
          {parkings.map((p) => (
            <ParkingCard
              key={p._id}
              parking={p}
              onSelect={onSelectParking}
              onNavigate={() =>
                onNavigateToParking(
                  p.location.coordinates[1],
                  p.location.coordinates[0]
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};