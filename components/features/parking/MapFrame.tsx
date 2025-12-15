"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

export default function MapFrame({ lat, lon, name }: { lat: number; lon: number; name: string }) {
  return (
    <div className="relative z-0 h-full w-full">
      <MapContainer
      center={[lat, lon]}
      zoom={17}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "100%" }}
      dragging={true}
      doubleClickZoom={true}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lon]} icon={markerIcon}>
        <Popup>
          <div className="text-sm font-semibold">{name}</div>
        </Popup>
      </Marker>
    </MapContainer>
    </div>
  );
}