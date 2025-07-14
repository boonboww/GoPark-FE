"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Printer } from "lucide-react";

type TicketInfo = {
  ticketId: string;
  name: string;
  vehicle: string;
  zone: string;
  spot: string;
  startTime: string;
  endTime: string;
  paymentMethod: string;
  estimatedFee: string;
  paymentStatus: string;
  paymentTime: string;
};

export default function TicketPage() {
  const [ticket, setTicket] = useState<TicketInfo | null>(null);
  const router = useRouter();

  useEffect(() => {
    const ticketData = localStorage.getItem('parkingTicket');
    if (ticketData) {
      setTicket(JSON.parse(ticketData));
    } else {
      router.push('/');
    }
  }, [router]);

  if (!ticket) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-12">
      <div className="border-2 border-dashed border-black p-4 rounded-md">
        <h1 className="text-2xl font-bold text-center mb-4">PARKING TICKET</h1>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="font-semibold">Ticket ID:</span>
            <span>{ticket.ticketId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Customer name:</span>
            <span>{ticket.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">License plate:</span>
            <span>{ticket.vehicle.split('-')[1].trim()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Location:</span>
            <span>{ticket.zone}-{ticket.spot}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Time:</span>
            <span>{new Date(ticket.startTime).toLocaleString()} - {new Date(ticket.endTime).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Fee:</span>
            <span>{ticket.estimatedFee}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Status:</span>
            <span className="text-green-600">Paid</span>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 mt-6">
          <p>Scan QR code at the gate to enter/exit the parking lot</p>
          <div className="bg-gray-200 h-32 w-32 mx-auto my-4 flex items-center justify-center">
            [QR Code]
          </div>
          <p>Thank you!</p>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <Button 
          onClick={() => window.print()}
          variant="outline"
          className="flex-1 gap-2"
        >
          <Printer className="w-4 h-4" /> Print Ticket
        </Button>
        <Button 
          onClick={() => router.push('/')}
          className="flex-1 bg-black hover:bg-gray-800"
        >
          Done
        </Button>
      </div>
    </div>
  );
}