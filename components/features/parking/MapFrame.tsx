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

const sovereigntyIcon = L.divIcon({
  className: "custom-sovereignty-icon",
  html: `
    <div class="flex flex-col items-center justify-center" style="width: 400px; transform: translateX(-50%);">
      <img src="/vn.png" alt="Vietnam Flag" class="w-16 h-10 object-cover shadow-md mb-2 animate-bounce" style="animation-duration: 3s;" />
      <span class="text-red-600 font-bold text-base md:text-lg uppercase text-center drop-shadow-md bg-white/90 px-3 py-1 rounded-full border-2 border-red-600 shadow-lg animate-pulse">
        Hoàng Sa - Trường Sa là của Việt Nam
      </span>
    </div>
  `,
  iconSize: [0, 0],
  iconAnchor: [0, 40],
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
      <Marker 
        position={[16.357171574838386, 112.13422725639053]} 
        icon={sovereigntyIcon} 
        interactive={false} 
        zIndexOffset={1000}
      />
      <Marker 
        position={[10.291870785189131, 114.27515383485546]} 
        icon={sovereigntyIcon} 
        interactive={false} 
        zIndexOffset={1000}
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