// 3️⃣ MapComponent.tsx
"use client";
import { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
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

    // User marker
    let userMarker: L.Marker | null = null;
    if (userCoords) {
      userMarker = L.marker(userCoords, { icon: userIcon })
        .addTo(mapInstance)
        .bindPopup("Your current location");
    }

    // Parking markers
    const parkingMarkers: L.Marker[] = [];
    parkings.forEach((p) => {
      const [lon, lat] = p.location.coordinates;
      const marker = L.marker([lat, lon], { icon: parkingIcon }).addTo(mapInstance);

      const popupContent = `
        <div class="text-sm max-w-xs">
          <img src="${p.avtImage || "/default-parking.jpg"}" alt="${p.name}" 
              class="w-full h-24 object-cover mb-2 rounded-md">
          <strong class="text-base">${p.name}</strong><br>
          <span class="text-gray-600">Address: ${p.address}</span><br>
          <span class="text-gray-600">Price: ${
            p.pricePerHour != null ? p.pricePerHour.toLocaleString() : "N/A"
          } VND/hour</span><br>
          <a href="/detailParking?id=${p._id}" class="text-blue-600 hover:underline text-sm mt-1 inline-block">Xem chi tiết</a>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on("popupopen", () => onMarkerClick(p));
      parkingMarkers.push(marker);
    });

    // Routing
    let routingControl: L.Routing.Control | null = null;
    if (userCoords && nearestParkingCoords) {
      routingControl = L.Routing.control({
        waypoints: [
          L.latLng(userCoords[0], userCoords[1]),
          L.latLng(nearestParkingCoords[0], nearestParkingCoords[1]),
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: false,
        show: false,
        lineOptions: {
          styles: [{ color: "blue", weight: 4, opacity: 0.8 }],
        },
        createMarker: () => null,
      }).addTo(mapInstance);

      routingControl.on("routesfound", (e) => {
        const route = e.routes[0];
        if (route) {
          mapInstance.fitBounds(route.bounds, { padding: [50, 50] });
        }
      });

      routingControl.on("routingerror", (err) => {
        console.error("Routing error:", err);
      });
    }

    return () => {
      if (routingControl) routingControl.remove();
      if (userMarker) userMarker.remove();
      parkingMarkers.forEach((m) => m.remove());
      mapInstance.remove();
    };
  }, [parkings, city, userCoords, nearestParkingCoords, parkingIcon, userIcon, onMapInit, onMarkerClick]);

  return <div id="map" className="w-full h-full" />;
};

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });