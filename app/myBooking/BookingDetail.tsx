"use client";

import { X } from "lucide-react";
import QRCode from "react-qr-code";
import { Booking } from "./types";

export default function BookingDetail({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) {
  const qrUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  }/booking/${booking.id}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        <img
          src={booking.image}
          alt={booking.parkingName}
          className="w-full h-48 object-cover rounded mb-4"
        />
        <h2 className="text-xl font-semibold mb-2">{booking.parkingName}</h2>
        <p className="text-sm mb-1">
          <strong>Address:</strong> {booking.location}
        </p>
        <p className="text-sm mb-1">
          <strong>Time:</strong> {booking.time}
        </p>
        <p className="text-sm mb-1">
          <strong>Package:</strong> {booking.package}
        </p>
        <p className="text-sm mb-1">
          <strong>Fee Estimate:</strong> {booking.feeEstimate}
        </p>
        <p className="text-sm mb-1">
          <strong>Plate Number:</strong> {booking.plateNumber}
        </p>
        <p className="text-sm mb-1">
          <strong>Spot Number:</strong> {booking.spotNumber}
        </p>
        <p className="text-sm mb-4">
          <strong>Zone:</strong> {booking.zone}
        </p>

        <div className="flex flex-col items-center">
          <QRCode value={qrUrl} size={128} />
          <p className="text-xs mt-2 break-all text-center">{qrUrl}</p>
        </div>
      </div>
    </div>
  );
}
