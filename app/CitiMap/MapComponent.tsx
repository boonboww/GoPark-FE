"use client";
import { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Parking, CITY_CENTERS } from "./types";

interface MapComponentProps {
  parkings: Parking[];
  city: string;
  userCoords: [number, number] | null;
  nearestParkingCoords: [number, number] | null;
  onMapInit: (map: L.Map) => void;
  onMarkerClick: (parking: Parking) => void;
}

const MapComponent = ({
  parkings,
  city,
  userCoords,
  nearestParkingCoords,
  onMapInit,
  onMarkerClick,
}: MapComponentProps) => {
  const parkingIcon = useMemo(
    () =>
      L.icon({
        iconUrl: "/marker-icon.png",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      }),
    []
  );

  const userIcon = useMemo(
    () =>
      L.icon({
        iconUrl: "/user-location.png",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      }),
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const center = userCoords || CITY_CENTERS[city] || [10.762622, 106.660172];
    const mapInstance = L.map("map").setView(center, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapInstance);

    mapInstance.zoomControl.setPosition("topright");

    const zoomControl = document.querySelector(
      ".leaflet-control-zoom"
    ) as HTMLElement;

    if (zoomControl) {
      zoomControl.style.top = "4rem";
      zoomControl.style.right = "0.7rem";
    }

    onMapInit(mapInstance);

    // Thêm marker vị trí người dùng
    let userMarker: L.Marker | null = null;
    if (userCoords) {
      userMarker = L.marker(userCoords, { icon: userIcon })
        .addTo(mapInstance)
        .bindPopup("Your current location");
    }

    // Thêm marker cho các bãi đỗ xe
    const parkingMarkers: L.Marker[] = [];
    parkings.forEach((p) => {
      const [longitude, latitude] = p.location.coordinates;
      const popupContent = `
        <div class="text-sm max-w-xs">
          <img src="${p.avtImage || "/default-parking.jpg"}" alt="${p.name}" 
              class="w-full h-24 object-cover mb-2 rounded-md">
          <strong class="text-base">${p.name}</strong><br>
          <span class="text-gray-600">Address: ${p.address}</span><br>
          <span class="text-gray-600">Price: ${
            p.pricePerHour != null ? p.pricePerHour.toLocaleString() : "N/A"
          } VND/hour</span>
        </div>
      `;

      const marker = L.marker([latitude, longitude], { icon: parkingIcon })
        .addTo(mapInstance)
        .bindPopup(popupContent);
      marker.on("popupopen", () => onMarkerClick(p));
      parkingMarkers.push(marker);
    });

    // Vẽ đường đi đến bãi gần nhất
    let polyline: L.Polyline | null = null;
    if (userCoords && nearestParkingCoords) {
      polyline = L.polyline([userCoords, nearestParkingCoords], {
        color: "blue",
        weight: 4,
        opacity: 0.7,
      }).addTo(mapInstance);

      // Điều chỉnh bản đồ để hiển thị cả người dùng và bãi đỗ xe
      const bounds = L.latLngBounds([userCoords, nearestParkingCoords]);
      mapInstance.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      if (polyline) polyline.remove();
      if (userMarker) userMarker.remove();
      parkingMarkers.forEach((marker) => marker.remove());
      mapInstance.remove();
    };
  }, [parkings, city, userCoords, nearestParkingCoords, parkingIcon, userIcon, onMapInit, onMarkerClick]);

  return <div id="map" className="w-full h-full"></div>;
};

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });