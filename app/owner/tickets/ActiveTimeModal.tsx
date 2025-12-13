"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Clock, MapPin, Car } from "lucide-react";
import type { Ticket as TicketType } from "@/app/owner/types";

type ActiveTimeModalProps = {
  open: boolean;
  onClose: () => void;
  ticket: TicketType | null;
};

// Tính toán màu dot dựa trên % thời gian còn lại
function getProgressColor(percentRemaining: number): {
  dotColor: string;
  barColor: string;
  bgColor: string;
} {
  if (percentRemaining > 50) {
    return {
      dotColor: "bg-green-500",
      barColor: "bg-green-500",
      bgColor: "bg-green-100",
    };
  } else if (percentRemaining > 25) {
    return {
      dotColor: "bg-yellow-500",
      barColor: "bg-yellow-500",
      bgColor: "bg-yellow-100",
    };
  } else if (percentRemaining > 10) {
    return {
      dotColor: "bg-orange-500",
      barColor: "bg-orange-500",
      bgColor: "bg-orange-100",
    };
  } else {
    return {
      dotColor: "bg-red-500",
      barColor: "bg-red-500",
      bgColor: "bg-red-100",
    };
  }
}

// Format thời gian còn lại thành "Xh Yp Zs" với đếm ngược
function formatRemainingTime(ms: number): string {
  if (ms <= 0) return "Hết giờ";

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}p ${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}p ${seconds}s`;
  }
  return `${seconds}s`;
}

// Format thời gian thành HH:mm
function formatTime(dateString?: string): string {
  if (!dateString) return "--:--";
  const date = new Date(dateString);
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ActiveTimeModal({
  open,
  onClose,
  ticket,
}: ActiveTimeModalProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second for real-time progress
  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [open]);

  if (!ticket) return null;

  const startTime = ticket.bookingId?.startTime
    ? new Date(ticket.bookingId.startTime)
    : null;
  const endTime = ticket.bookingId?.endTime
    ? new Date(ticket.bookingId.endTime)
    : ticket.expiryDate
    ? new Date(ticket.expiryDate)
    : null;

  // Tính toán progress
  let percentRemaining = 100;
  let remainingMs = 0;
  let progressPercent = 0;

  if (startTime && endTime) {
    const totalDuration = endTime.getTime() - startTime.getTime();
    const elapsed = currentTime.getTime() - startTime.getTime();
    remainingMs = endTime.getTime() - currentTime.getTime();

    if (totalDuration > 0) {
      progressPercent = Math.min(
        100,
        Math.max(0, (elapsed / totalDuration) * 100)
      );
      percentRemaining = Math.max(0, 100 - progressPercent);
    }
  }

  const colors = getProgressColor(percentRemaining);
  const ticketId = ticket._id.substring(ticket._id.length - 6);
  const vehicleNumber = ticket.vehicleNumber || "N/A";
  const location = ticket.bookingId?.parkingSlotId
    ? `${ticket.bookingId.parkingSlotId.zone}-${ticket.bookingId.parkingSlotId.slotNumber}`
    : "N/A";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className={`${colors.bgColor} px-6 py-4 border-b`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`inline-block w-3 h-3 rounded-full ${colors.dotColor} animate-pulse`}
              />
              <DialogTitle className="text-lg font-semibold text-gray-800">
                Thời gian đỗ xe
              </DialogTitle>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">Vé #{ticketId}</p>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Vehicle & Location Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Car className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Biển số:</span>
              <span className="font-semibold text-gray-800">
                {vehicleNumber}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Vị trí:</span>
              <span className="font-semibold text-gray-800">{location}</span>
            </div>
          </div>

          {/* Time Display */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Bắt đầu</p>
                <p className="text-lg font-semibold text-gray-700">
                  {formatTime(ticket.bookingId?.startTime)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Còn lại</p>
                <p
                  className={`text-xl font-bold ${colors.dotColor.replace(
                    "bg-",
                    "text-"
                  )}`}
                >
                  {formatRemainingTime(remainingMs)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Kết thúc</p>
                <p className="text-lg font-semibold text-gray-700">
                  {formatTime(ticket.bookingId?.endTime || ticket.expiryDate)}
                </p>
              </div>
            </div>

            {/* YouTube-style Progress Bar - chạy từ phải qua trái */}
            <div className="relative">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${colors.barColor} transition-all duration-1000 ease-linear rounded-full`}
                  style={{ width: `${percentRemaining}%` }}
                />
              </div>
              {/* Progress Marker (YouTube style dot) */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 ${colors.barColor} rounded-full border-2 border-white shadow-md transition-all duration-1000 ease-linear`}
                style={{
                  left: `calc(${Math.max(percentRemaining, 2)}% - 8px)`,
                }}
              />
            </div>

            {/* Percentage Display */}
            <div className="text-center mt-4">
              <span
                className={`text-2xl font-bold ${colors.dotColor.replace(
                  "bg-",
                  "text-"
                )}`}
              >
                {Math.round(percentRemaining)}%
              </span>
              <p className="text-xs text-gray-500 mt-1">thời gian còn lại</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t bg-gray-50">
          <Button
            onClick={onClose}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Export helper function for use in table (colored dot indicator)
export function getTimeIndicatorColor(ticket: TicketType): string {
  if (ticket.status !== "active") return "";

  const startTime = ticket.bookingId?.startTime
    ? new Date(ticket.bookingId.startTime)
    : null;
  const endTime = ticket.bookingId?.endTime
    ? new Date(ticket.bookingId.endTime)
    : ticket.expiryDate
    ? new Date(ticket.expiryDate)
    : null;

  if (!startTime || !endTime) return "bg-green-500";

  const now = new Date();
  const totalDuration = endTime.getTime() - startTime.getTime();
  const elapsed = now.getTime() - startTime.getTime();
  const percentRemaining = Math.max(0, 100 - (elapsed / totalDuration) * 100);

  if (percentRemaining > 50) return "bg-green-500";
  if (percentRemaining > 25) return "bg-yellow-500";
  if (percentRemaining > 10) return "bg-orange-500";
  return "bg-red-500";
}
