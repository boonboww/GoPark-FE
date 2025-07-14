"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";

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
  const router = useRouter();

  if (!bookingInfo) return null;

  const handlePayment = () => {
    // Save booking info to localStorage before navigating
    localStorage.setItem('currentBooking', JSON.stringify(bookingInfo));
    router.push('/payment');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name:</span>
            <span className="font-medium">{bookingInfo.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Vehicle:</span>
            <span className="font-medium">{bookingInfo.vehicle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Zone:</span>
            <span className="font-medium">{bookingInfo.zone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Spot:</span>
            <span className="font-medium">{bookingInfo.spot}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Start Time:</span>
            <span className="font-medium">{bookingInfo.startTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">End Time:</span>
            <span className="font-medium">{bookingInfo.endTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Method:</span>
            <span className="font-medium">{bookingInfo.paymentMethod}</span>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <span className="text-muted-foreground font-semibold">Estimated Fee:</span>
            <span className="font-bold text-primary">{bookingInfo.estimatedFee}</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            onClick={handlePayment} 
            className="gap-2 bg-green-800 hover:bg-blue-900 cursor-pointer text-white me-3"
          >
            <CreditCard className="w-4 h-4" />
            Proceed to Payment
          </Button>
          <Button 
            onClick={onClose} 
            variant="outline"
            className="text-gray-700 hover:bg-red-700 hover:text-white cursor-pointer"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}