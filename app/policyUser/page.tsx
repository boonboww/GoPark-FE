"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ShieldCheck,
  Handshake,
  MessageSquarePlus,
  ChevronDown,
  ChevronUp,
  Phone,
  Download,
  SendHorizonal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PolicyUserPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  const togglePolicy = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSendFeedback = () => {
    if (!feedback.trim()) return;
    alert(`✅ Thank you for your feedback:\n"${feedback}"`);
    setFeedback("");
  };

  const policies = [
    {
      title: "Parking Lot > Users",
      icon: ShieldCheck,
      details: [
        "Ensure safety and security for all parked vehicles.",
        "Provide 24/7 support for any vehicle issues inside the lot.",
        "Offer refunds for cancellations that meet the policy terms.",
        "Guarantee privacy and protect user data.",
        "Offer extra services: maintenance, car wash, EV charging.",
      ],
    },
    {
      title: "Users > Parking Lot",
      icon: Handshake,
      details: [
        "Book and pay with correct vehicle information.",
        "Follow parking rules and staff instructions.",
        "Do not misuse reserved spaces or cause damage.",
        "Respect other users and common spaces.",
        "Provide honest feedback for continuous improvement.",
      ],
    },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen mt-20 px-4 py-12 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-black">
          Parking Lot User Policies
        </h1>

        <div className="w-full max-w-3xl flex flex-col gap-4">
          {policies.map((policy, index) => (
            <div
              key={index}
              className="border border-black rounded-lg p-4 bg-white shadow-sm"
            >
              <button
                onClick={() => togglePolicy(index)}
                className="w-full flex justify-between items-center text-left text-lg font-medium"
              >
                <span className="flex items-center gap-2">
                  <policy.icon className="w-5 h-5 text-black" />
                  {policy.title}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              {openIndex === index && (
                <ul className="mt-3 list-disc ml-6 text-gray-700 space-y-1">
                  {policy.details.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Góp ý */}
        <div className="w-full max-w-3xl mt-12 p-4 border border-black rounded-lg bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquarePlus className="w-5 h-5 text-black" />
            <h2 className="text-lg font-semibold">Your Feedback</h2>
          </div>
          <textarea
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none"
            placeholder="Write your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <Button
            onClick={handleSendFeedback}
            className="mt-3 bg-black text-white hover:bg-gray-900 flex gap-2 items-center"
          >
            <SendHorizonal className="w-4 h-4" />
            Submit Feedback
          </Button>
        </div>

        {/* Hotline + PDF */}
        <div className="w-full max-w-3xl mt-8 flex flex-col md:flex-row gap-4">
          <Button
            onClick={() => alert("📞 Hotline: +1 800 123 456")}
            className="flex gap-2 items-center bg-black text-white hover:bg-gray-900"
          >
            <Phone className="w-4 h-4" /> Hotline Support
          </Button>

          <a
            href="/policy.pdf"
            download
            className="flex gap-2 items-center justify-center border border-black px-4 py-2 rounded hover:bg-black hover:text-white transition"
          >
            <Download className="w-4 h-4" /> Download Policy PDF
          </a>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Version 1.0 — Last updated July 2025
        </p>
      </main>

      <Footer />
    </>
  );
}
