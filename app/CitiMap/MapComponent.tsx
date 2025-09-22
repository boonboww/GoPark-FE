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
    if (typeof window !== "undefined" && window.L && window.L.Routing && window.L.Routing.Control) {
      if ("defaultErrorHandler" in window.L.Routing.Control.prototype.options) {
        (window.L.Routing.Control.prototype.options as any).defaultErrorHandler = function() {};
      }
    }
    if (typeof window === "undefined") return;

    // Kiểm tra tồn tại phần tử map trước khi khởi tạo
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    // Nếu chỉ có một bãi đỗ, tập trung vào vị trí bãi đó
    let center = userCoords || CITY_CENTERS[city] || [10.762622, 106.660172];
    if (parkings.length === 1 && parkings[0]?.location?.coordinates) {
      const [lon, lat] = parkings[0].location.coordinates;
      center = [lat, lon];
    }
    let mapInstance: L.Map | null = null;
    try {
      mapInstance = L.map(mapElement).setView(center, parkings.length === 1 ? 17 : 13);
    } catch (e) {
      return;
    }

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
        .bindPopup("Vị trí hiện tại của bạn");
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
          <span class="text-gray-600">Địa chỉ: ${p.address}</span><br>
          <span class="text-gray-600">Giá: ${
            p.pricePerHour != null ? p.pricePerHour.toLocaleString() : "Không có"
          } VND/giờ</span><br>
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
          L.latLng(userCoords[0], userCoords[1]), // lat, lon
          L.latLng(nearestParkingCoords[0], nearestParkingCoords[1]), // lat, lon
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
        // Thông báo rõ ràng cho người dùng
        if (typeof window !== "undefined" && window['toast']) {
          window['toast'].error("Không tìm được đường đi giữa vị trí của bạn và bãi đỗ!");
        }
        // Không log lỗi ra console nữa
      });
    }

    return () => {
      if (routingControl) try { routingControl.remove(); } catch(e) {}
      if (userMarker) try { userMarker.remove(); } catch(e) {}
      parkingMarkers.forEach((m) => { try { m.remove(); } catch(e) {} });
      if (mapInstance) try { mapInstance.remove(); } catch(e) {};
    };
  }, [parkings, city, userCoords, nearestParkingCoords, parkingIcon, userIcon, onMapInit, onMarkerClick]);

  return <div id="map" className="w-full h-full" />;
};

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });