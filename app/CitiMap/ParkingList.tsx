"use client";
// import { LocateFixed, Loader2 } from "lucide-react";
import { ParkingCard } from "./ParkingCard";
import { Parking } from "./types";

interface ParkingListProps {
  city: string;
  parkings: Parking[];
  isLocating: boolean;
  onFindNearby: () => void;
  onSelectParking: (parking: Parking) => void;
  onNavigateToParking: (lat: number, lon: number) => void;
}

export const ParkingList = ({
  city,
  parkings,
  // isLocating,
  // onFindNearby,
  onSelectParking,
  onNavigateToParking,
}: ParkingListProps) => (
  <>
    <h2 className="text-lg font-semibold text-gray-800 mb-4">
      Parking lots in {city}
    </h2>

    {/* <button
      onClick={onFindNearby}
      disabled={isLocating}
      className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mb-4 flex items-center justify-center gap-2"
    >
      {isLocating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LocateFixed className="w-4 h-4" />
      )}
      Find nearby parking
    </button> */}

    {parkings.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        No suitable parking spots found.
      </div>
    ) : (
      <div className="mt-4 space-y-4">
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
  </>
);
