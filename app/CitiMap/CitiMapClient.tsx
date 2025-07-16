"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Menu, X, LocateFixed, Loader2 } from "lucide-react";
import MapComponent from "./MapComponent";
import { ParkingDetail } from "./ParkingDetail";
import { ParkingList } from "./ParkingList";
import { Parking, API_BASE_URL } from "./types";
import L from "leaflet";

const CitiMap = () => {
  const searchParams = useSearchParams();
  const city = searchParams.get("city")?.toLowerCase() || "";
  const arriving = searchParams.get("arriving")
    ? new Date(searchParams.get("arriving")!)
    : null;
  const leaving = searchParams.get("leaving")
    ? new Date(searchParams.get("leaving")!)
    : null;
  const isNearby = searchParams.get("isNearby") === "true";
  const userLat = searchParams.get("userLat");
  const userLon = searchParams.get("userLon");

  const [map, setMap] = useState<L.Map | null>(null);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(
    userLat && userLon ? [parseFloat(userLat), parseFloat(userLon)] : null
  );
  const [userMarker, setUserMarker] = useState<L.Marker | null>(null);
  const [selectedParking, setSelectedParking] = useState<Parking | null>(null);
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [filteredParkings, setFilteredParkings] = useState<Parking[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [nearestParkingCoords, setNearestParkingCoords] = useState<
    [number, number] | null
  >(null);

  useEffect(() => {
    if (!city) return;

    const fetchParkings = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/v1/search/city?location=${city}`
        );
        if (!res.ok) throw new Error(`Lỗi HTTP! status: ${res.status}`);

        const response = await res.json();
        const validParkings = response.data.filter(
          (p: Parking) => p.location?.coordinates?.length === 2
        );

        setParkings(validParkings);
        setFilteredParkings(validParkings);

        if (validParkings.length === 0) {
          toast.info("Không tìm thấy bãi đỗ xe nào trong thành phố này");
        }
      } catch (error) {
        console.error("Lỗi khi tải bãi đỗ xe:", error);
        toast.error(
          "Có lỗi xảy ra khi tải dữ liệu bãi đỗ. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchParkings();
  }, [city]);

  const findNearbyParkings = useCallback(async () => {
    if (!navigator.geolocation) {
      toast.warning("Trình duyệt này không hỗ trợ định vị.");
      return;
    }

    setIsLocating(true);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          });
        }
      );

      const { latitude, longitude } = position.coords;
      setUserCoords([latitude, longitude]);

      if (map) {
        map.setView([latitude, longitude], 15);

        const userIcon = L.icon({
          iconUrl: "/user-location.png",
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        if (userMarker) {
          userMarker.setLatLng([latitude, longitude]).addTo(map);
        } else {
          const newMarker = L.marker([latitude, longitude], {
            icon: userIcon,
          }).addTo(map);
          setUserMarker(newMarker);
        }
      }

      let nearestParking: Parking | null = null;
      let minDistance = Infinity;

      parkings.forEach((p) => {
        const dist = getDistanceFromLatLonInKm(
          latitude,
          longitude,
          p.location.coordinates[1],
          p.location.coordinates[0]
        );
        if (dist < minDistance) {
          minDistance = dist;
          nearestParking = p;
        }
      });

      if (nearestParking) {
        setFilteredParkings([nearestParking]);
        setSelectedParking(nearestParking);
        setNearestParkingCoords([
          nearestParking.location.coordinates[1],
          nearestParking.location.coordinates[0],
        ]);
        if (map) {
          map.setView([
            nearestParking.location.coordinates[1],
            nearestParking.location.coordinates[0],
          ], 15);
        }
        toast.success(
          `Tìm thấy bãi đỗ gần nhất: ${nearestParking.name} (${minDistance.toFixed(
            2
          )} km)`
        );
      } else {
        setFilteredParkings([]);
        setSelectedParking(null);
        setNearestParkingCoords(null);
        toast.info("Không tìm thấy bãi đỗ nào gần vị trí của bạn.");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        "Không thể xác định vị trí. Vui lòng bật dịch vụ định vị."
      );
    } finally {
      setIsLocating(false);
    }
  }, [map, parkings, userMarker]);

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

  const navigateToParking = useCallback(
    (lat: number, lon: number) => {
      if (!userCoords) {
        toast.warning("Vui lòng bật dịch vụ định vị trước");
        return;
      }
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userCoords[0]},${userCoords[1]}&destination=${lat},${lon}&travelmode=driving`;
      window.open(url, "_blank");
    },
    [userCoords]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.body.classList.toggle("panel-open", isPanelOpen);
    document.body.classList.toggle("panel-closed", !isPanelOpen);
  }, [isPanelOpen]);

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
      {isPanelOpen && (
        <div className="fixed top-0 left-0 w-full sm:w-96 h-full z-[1000] bg-white bg-opacity-95 backdrop-blur-sm p-4 border-r border-gray-200 shadow-lg overflow-y-auto">
          <button
            onClick={() => setIsPanelOpen(false)}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
            aria-label="Đóng panel"
          >
            <X className="w-6 h-6" />
          </button>

          {selectedParking ? (
            <ParkingDetail
              parking={selectedParking}
              arriving={arriving}
              leaving={leaving}
              onBack={() => setSelectedParking(null)}
              onNavigate={() =>
                navigateToParking(
                  selectedParking.location.coordinates[1],
                  selectedParking.location.coordinates[0]
                )
              }
            />
          ) : (
            <ParkingList
              city={city}
              parkings={filteredParkings}
              isLocating={isLocating}
              isNearby={isNearby}
              onFindNearby={findNearbyParkings}
              onSelectParking={setSelectedParking}
              onNavigateToParking={navigateToParking}
            />
          )}
        </div>
      )}

      <div className="w-full h-full relative">
        {!isPanelOpen && (
          <>
            <button
              onClick={() => setIsPanelOpen(true)}
              className="absolute top-4 left-4 z-[1000] bg-white p-2 rounded-md shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Mở panel"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            <button
              onClick={findNearbyParkings}
              className="absolute top-4 right-4 z-[1000] bg-white p-2 rounded-md shadow-md hover:bg-gray-100 transition-colors locate-btn"
              aria-label="Định vị tôi"
              disabled={isLocating}
            >
              {isLocating ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <LocateFixed className="w-6 h-6 text-blue-500" />
              )}
            </button>
          </>
        )}

        {filteredParkings.length > 0 ? (
          <MapComponent
            parkings={filteredParkings}
            city={city}
            userCoords={userCoords}
            nearestParkingCoords={nearestParkingCoords}
            onMapInit={setMap}
            onMarkerClick={setSelectedParking}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600 text-lg font-semibold">
            🚫 Không tìm thấy bãi đỗ xe tại {city.charAt(0).toUpperCase() + city.slice(1)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitiMap;