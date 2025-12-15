"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icon
const icon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Sovereignty Marker Icon
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

function LocationPicker({ position, onLocationSelect }: { position: [number, number], onLocationSelect: (lat: number, lng: number) => void }) {
  const map = useMap();
  
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position, map]);

  return <Marker position={position} icon={icon} />;
}

interface ParkingLocationPickerProps {
  lat: number;
  lng: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

export default function ParkingLocationPicker({ lat, lng, onLocationSelect }: ParkingLocationPickerProps) {
  return (
    <div className="h-[300px] w-full rounded-md overflow-hidden border z-0 relative">
      <MapContainer 
        center={[lat, lng]} 
        zoom={15} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
        <LocationPicker position={[lat, lng]} onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
}
