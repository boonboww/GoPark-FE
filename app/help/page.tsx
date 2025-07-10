"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "How do I make a parking reservation?",
    answer:
      "You can reserve a spot by selecting your desired parking lot, choosing a plan, entering your vehicle details, and making an online payment.",
  },
  {
    question: "How can I cancel my booking?",
    answer:
      "Go to the My Booking page, select your active booking, and click the Cancel button. The system will process the cancellation and refund if applicable.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept payments via local ATM cards, Visa/MasterCard, e-wallets, and VietQR codes.",
  },
  {
    question: "What should I do if my vehicle has an issue inside the parking lot?",
    answer:
      "Please contact our hotline below or chat with our AI Assistant for immediate support and connection to on-site help.",
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const router = useRouter();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleChatAI = () => {
    router.push("/help/chatAI");
  };

  return (
    <>
      <Header />

      <main className="min-h-screen mt-20 px-4 py-12 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Help Center</h1>

        <div className="w-full max-w-3xl flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left text-lg font-medium"
              >
                <span>{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              {openIndex === index && (
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-12">
          <Button
            variant="default"
            className="flex gap-2 items-center bg-black text-white hover:bg-gray-900 cursor-pointer"
            onClick={() => alert("📞 Call our hotline: +1 800 123 456")}
          >
            <Phone className="w-4 h-4" /> Contact Support
          </Button>
          <Button
            variant="outline"
            className="flex gap-2 items-center cursor-pointer"
            onClick={handleChatAI}
          >
            <MessageSquare className="w-4 h-4" /> Chat with AI
          </Button>
        </div>
      </main>

      <Footer />
    </>
  );
}
