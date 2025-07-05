"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Menu, X, LocateFixed, Loader2 } from "lucide-react";
import { MapComponent } from "@/app/CitiMap/MapComponent";
import { ParkingDetail } from "@/app/CitiMap/ParkingDetail";
import { ParkingList } from "@/app/CitiMap/ParkingList";
import { 
  Parking, 
  API_BASE_URL, 
  DEFAULT_RADIUS_KM,
} from "./types";

export default function CitiMap() {
  const searchParams = useSearchParams();
  const city = searchParams.get("city")?.toLowerCase() || "";
  const arriving = searchParams.get("arriving") ? new Date(searchParams.get("arriving")!) : null;
  const leaving = searchParams.get("leaving") ? new Date(searchParams.get("leaving")!) : null;

  const [map, setMap] = useState<L.Map | null>(null);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [selectedParking, setSelectedParking] = useState<Parking | null>(null);
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [filteredParkings, setFilteredParkings] = useState<Parking[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);

  // Fetch parkings data
  useEffect(() => {
    if (!city) return;

    const fetchParkings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/search/city?location=${city}`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const response = await res.json();
        const validParkings = response.data.filter(
          (p: Parking) => p.location?.coordinates?.length === 2
        );

        setParkings(validParkings);
        setFilteredParkings(validParkings);

        if (validParkings.length === 0) {
          toast.info("Không tìm thấy bãi đỗ nào ở thành phố này");
        }
      } catch (error) {
        console.error("Error fetching parking lots:", error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu bãi đỗ");
      } finally {
        setLoading(false);
      }
    };

    fetchParkings();
  }, [city]);

  // Find nearby parkings
  const findNearbyParkings = useCallback(async () => {
    if (!navigator.geolocation) {
      toast.warning("Trình duyệt không hỗ trợ định vị");
      return;
    }

    setIsLocating(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const { latitude, longitude } = position.coords;
      setUserCoords([latitude, longitude]);
      
      // Center map
      map?.setView([latitude, longitude], 14);

      // Filter parkings within radius
      const nearby = parkings.filter((p) => {
        const dist = getDistanceFromLatLonInKm(
          latitude,
          longitude,
          p.location.coordinates[1],
          p.location.coordinates[0]
        );
        return dist <= DEFAULT_RADIUS_KM;
      });

      setFilteredParkings(nearby);
      setSelectedParking(null);

      if (nearby.length === 0) {
        toast.info("Không có bãi đỗ nào trong bán kính 3km");
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể lấy vị trí. Vui lòng bật GPS.");
    } finally {
      setIsLocating(false);
    }
  }, [map, parkings]);

  // Calculate distance between coordinates
  const getDistanceFromLatLonInKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg: number) => deg * (Math.PI / 180);

  // Navigate to parking using Google Maps
  const navigateToParking = useCallback((lat: number, lon: number) => {
    if (!userCoords) {
      toast.warning("Vui lòng định vị vị trí của bạn trước");
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userCoords[0]},${userCoords[1]}&destination=${lat},${lon}&travelmode=driving`;
    window.open(url, "_blank");
  }, [userCoords]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
          <span className="text-lg font-medium">Đang tải dữ liệu bãi đỗ...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Side Panel */}
      {isPanelOpen && (
        <div className="fixed top-0 left-0 w-full sm:w-96 h-full z-[1000] bg-white bg-opacity-95 backdrop-blur-sm p-4 border-r border-gray-200 shadow-lg overflow-y-auto">
          <button
            onClick={() => setIsPanelOpen(false)}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
            aria-label="Close panel"
          >
            <X className="w-6 h-6" />
          </button>

          {selectedParking ? (
            <ParkingDetail 
              parking={selectedParking}
              arriving={arriving}
              leaving={leaving}
              onBack={() => setSelectedParking(null)}
              onNavigate={() => navigateToParking(
                selectedParking.location.coordinates[1],
                selectedParking.location.coordinates[0]
              )}
            />
          ) : (
            <ParkingList 
              city={city}
              parkings={filteredParkings}
              isLocating={isLocating}
              onFindNearby={findNearbyParkings}
              onSelectParking={setSelectedParking}
              onNavigateToParking={navigateToParking}
            />
          )}
        </div>
      )}

      {/* Map */}
      <div className="w-full h-full relative">
        {!isPanelOpen && (
          <button
            onClick={() => setIsPanelOpen(true)}
            className="absolute top-4 left-4 z-[1000] bg-white p-2 rounded-md shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Open panel"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        )}

        <button
          onClick={findNearbyParkings}
          className="absolute top-4 right-4 z-[1000] bg-white p-2 rounded-md shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Locate me"
          disabled={isLocating}
        >
          {isLocating ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <LocateFixed className="w-6 h-6 text-blue-500" />
          )}
        </button>

        <MapComponent 
          parkings={filteredParkings}
          city={city}
          onMapInit={setMap}
          onMarkerClick={setSelectedParking}
        />
      </div>
    </div>
  );
}