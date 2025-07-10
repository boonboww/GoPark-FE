"use client";
import { ArrowLeft } from "lucide-react";
import { Parking } from "./types";

interface ParkingDetailProps {
  parking: Parking;
  arriving: Date | null;
  leaving: Date | null;
  onBack: () => void;
  onNavigate: () => void;
}

export const ParkingDetail = ({
  parking,
  arriving,
  leaving,
  onBack,
  onNavigate,
}: ParkingDetailProps) => (
  <div>
    <button
      onClick={onBack}
      className="flex items-center mb-4 text-blue-600 hover:text-blue-800 transition-colors"
    >
      <ArrowLeft className="w-5 h-5 mr-2" /> Back to List
    </button>

    <div className="border border-gray-200 p-6 rounded-xl shadow-lg bg-white">
      <img
        src={parking.avtImage || "/bg.jpg"}
        alt={parking.name}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />

      <h3 className="text-2xl font-bold text-gray-800 mb-3">{parking.name}</h3>

      <div className="space-y-2 text-gray-600">
        <p className="text-sm">
          <span className="font-medium">Address:</span> {parking.address}
        </p>
        <p className="text-sm">
          <span className="font-medium">Price:</span>{" "}
          {parking.pricePerHour != null ? parking.pricePerHour.toLocaleString() : "N/A"} VND/hour
        </p>
        <p className="text-sm">
          <span className="font-medium">Status:</span>{" "}
          <span
            className={
              parking.isActive
                ? "text-green-600 font-bold"
                : "text-red-600 font-bold"
            }
          >
            {parking.isActive ? "Available" : "Full"}
          </span>
        </p>

        {parking.description && (
          <p className="text-sm">
            <span className="font-medium">Description:</span>{" "}
            {parking.description}
          </p>
        )}

        {parking.zones?.length > 0 && (
          <div className="text-sm">
            <span className="font-medium">Zones:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {parking.zones.map((zone) => (
                <span
                  key={zone._id}
                  className="bg-gray-100 px-2 py-1 rounded text-xs"
                >
                  {zone.zone}: {zone.count} slots
                </span>
              ))}
            </div>
          </div>
        )}

        {arriving && (
          <p className="text-sm">
            <span className="font-medium">Arrival Time:</span>{" "}
            {arriving.toLocaleString("en-US", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
        )}

        {leaving && (
          <p className="text-sm">
            <span className="font-medium">Departure Time:</span>{" "}
            {leaving.toLocaleString("en-US", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
        )}
      </div>

      <button
        onClick={onNavigate}
        className="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
      >
        Get Directions
      </button>
    </div>
  </div>
);