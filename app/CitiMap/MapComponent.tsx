"use client";
import { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Parking, CITY_CENTERS } from "./types";

interface MapComponentProps {
  parkings: Parking[];
  city: string;
  onMapInit: (map: L.Map) => void;
  onMarkerClick: (parking: Parking) => void;
}

const MapComponent = ({
  parkings,
  city,
  onMapInit,
  onMarkerClick,
}: MapComponentProps) => {
  const parkingIcon = useMemo(
    () =>
      L.icon({
        iconUrl: "/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      }),
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const center = CITY_CENTERS[city] || [10.762622, 106.660172];
    const mapInstance = L.map("map").setView(center, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapInstance);

    mapInstance.zoomControl.setPosition("topright");
    onMapInit(mapInstance);

    parkings.forEach((p) => {
      const [longitude, latitude] = p.location.coordinates;
      const popupContent = `
        <div class="text-sm max-w-xs">
          <img src="${p.avtImage || "/default-parking.jpg"}" alt="${p.name}" 
              class="w-full h-24 object-cover mb-2 rounded-md">
          <strong class="text-base">${p.name}</strong><br>
          <span class="text-gray-600">Địa chỉ: ${p.address}</span><br>
          <span class="text-gray-600">Giá: ${p.pricePerHour.toLocaleString()} VNĐ/hour</span>
        </div>
      `;

      const marker = L.marker([latitude, longitude], { icon: parkingIcon })
        .addTo(mapInstance)
        .bindPopup(popupContent);

      marker.on("popupopen", () => onMarkerClick(p));
    });

    return () => {
      mapInstance.remove();
    };
  }, [parkings, city, parkingIcon, onMapInit, onMarkerClick]);

  return <div id="map" className="w-full h-full"></div>;
};

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });
