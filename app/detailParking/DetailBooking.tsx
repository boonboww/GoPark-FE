"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type BookingInfo = {
  name: string;
  vehicle: string;
  zone: string;
  spot: string;
  startTime: string;
  endTime: string;
  paymentMethod: string;
  estimatedFee: string;
};

type DetailBookingModalProps = {
  open: boolean;
  onClose: () => void;
  bookingInfo: BookingInfo | null;
};

export default function DetailBookingModal({
  open,
  onClose,
  bookingInfo,
}: DetailBookingModalProps) {
  if (!bookingInfo) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <p><strong>Name:</strong> {bookingInfo.name}</p>
          <p><strong>Vehicle:</strong> {bookingInfo.vehicle}</p>
          <p><strong>Zone:</strong> {bookingInfo.zone}</p>
          <p><strong>Spot:</strong> {bookingInfo.spot}</p>
          <p><strong>Start Time:</strong> {bookingInfo.startTime}</p>
          <p><strong>End Time:</strong> {bookingInfo.endTime}</p>
          <p><strong>Payment:</strong> {bookingInfo.paymentMethod}</p>
          <p><strong>Fee:</strong> {bookingInfo.estimatedFee}</p>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="bg-black text-white">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
