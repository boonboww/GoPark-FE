"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PaymentForm from "./PaymentForm";
import QrPayment from "./QrPayment";
import SuccessView from "./SuccessView";
import { Loader2 } from "lucide-react";

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

export default function PaymentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const booking = localStorage.getItem('currentBooking');
    if (booking) {
      try {
        const parsed = JSON.parse(booking) as BookingInfo;
        if (parsed?.name && parsed.vehicle && parsed.zone) {
          setBookingInfo(parsed);
          return;
        }
      } catch (e) {
        console.error("Invalid booking data", e);
      }
    }
    router.push('/');
  }, [router]);

  const formatDateTime = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const ticket = {
        ...bookingInfo,
        ticketId: `TKT-${Math.floor(Math.random() * 1000000)}`,
        paymentStatus: 'paid',
        paymentTime: new Date().toISOString()
      };
      localStorage.setItem('parkingTicket', JSON.stringify(ticket));
      setCurrentStep(3);
      setIsProcessing(false);
    }, 2000);
  };

  if (!bookingInfo) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {currentStep === 1 && (
          <PaymentForm
            bookingInfo={bookingInfo}
            isProcessing={isProcessing}
            onPayment={handlePayment}
            onQrPayment={() => setCurrentStep(2)}
            formatDateTime={formatDateTime}
          />
        )}
        {currentStep === 2 && (
          <QrPayment
            onBack={() => setCurrentStep(1)}
            onComplete={handlePayment}
            bookingInfo={bookingInfo}
          />
        )}
        {currentStep === 3 && bookingInfo && (
          <SuccessView />
        )}
      </div>
    </div>
  );
}