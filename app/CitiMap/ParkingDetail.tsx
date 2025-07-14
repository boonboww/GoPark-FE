"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Clock, Calendar, ParkingSquare, Navigation, Info, Wallet, CheckCircle, XCircle } from "lucide-react";
import { Parking } from "./types";

interface ParkingDetailProps {
  parking: Parking;
  arriving: Date | null;
  leaving: Date | null;
  onBack: () => void;
  onNavigate: () => void;
}

export const ParkingDetail = ({ parking, arriving, leaving, onBack, onNavigate }: ParkingDetailProps) => {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button
        onClick={onBack}
        className="flex items-center mb-6 text-blue-600 hover:text-blue-800 transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to List
      </button>

      <div className="border border-gray-200 p-6 rounded-xl shadow-lg bg-white">
        <div className="relative">
          <img
            src={parking.avtImage || "/bg.jpg"}
            alt={parking.name}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center shadow-sm">
            <ParkingSquare className="w-4 h-4 text-blue-600 mr-1" />
            <span className="text-sm font-medium">Parking Lot</span>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <MapPin className="w-5 h-5 text-red-500 mr-2" />
          {parking.name}
        </h3>

        <div className="space-y-3 text-gray-700">
          <div className="flex items-start">
            <MapPin className="w-4 h-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm"><span className="font-medium">Address:</span> {parking.address}</p>
          </div>

          <div className="flex items-start">
            <Wallet className="w-4 h-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm">
              <span className="font-medium">Price:</span>{" "}
              {parking.pricePerHour != null ? parking.pricePerHour.toLocaleString() : "N/A"} VND/hour
            </p>
          </div>

          <div className="flex items-center">
            {parking.isActive ? (
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500 mr-2" />
            )}
            <p className="text-sm">
              <span className="font-medium">Status:</span>{" "}
              <span className={parking.isActive ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                {parking.isActive ? "Available" : "Full"}
              </span>
            </p>
          </div>

          {parking.description && (
            <div className="flex items-start">
              <Info className="w-4 h-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm">
                <span className="font-medium">Description:</span> {parking.description}
              </p>
            </div>
          )}

          {parking.zones?.length > 0 && (
            <div className="flex items-start">
              <ParkingSquare className="w-4 h-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm">
                <span className="font-medium">Zones:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {parking.zones.map((zone) => (
                    <span 
                      key={zone._id} 
                      className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs flex items-center"
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-1.5"></span>
                      {zone.zone}: {zone.count} slots
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {arriving && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-gray-500 mr-2" />
              <p className="text-sm">
                <span className="font-medium">Arrival:</span>{" "}
                {arriving.toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" })}
              </p>
            </div>
          )}

          {leaving && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-gray-500 mr-2" />
              <p className="text-sm">
                <span className="font-medium">Departure:</span>{" "}
                {leaving.toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" })}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-3">
          <button
            onClick={onNavigate}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center"
          >
            <Navigation className="w-5 h-5 mr-2" />
            Get Directions
          </button>

          <button
            onClick={() => router.push(`/detailParking?id=${parking._id}`)}
            className="w-full bg-indigo-100 text-indigo-700 py-2.5 rounded-lg hover:bg-indigo-200 transition-colors flex items-center justify-center"
          >
            <Info className="w-5 h-5 mr-2" />
            View More Details
          </button>
        </div>
      </div>
    </div>
  );
};