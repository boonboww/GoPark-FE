"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bot, SendHorizonal, Sun, Moon, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import MapSection from "@/components/MapSection";
import PromotionSection from "@/components/PromotionSection";
import ContactSection from "@/components/ContactSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import WavyDivider from "@/components/WavyDivider";

export default function Home() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChatClick = () => {
    if (isMobile) {
      router.push("/help/chatAI");
    } else {
      setIsChatOpen(!isChatOpen);
    }
  };

  return (
    <div className="flex flex-col">
      <Header />

      <div
        className="relative w-full h-[500px] md:h-[600px] bg-cover bg-center mt-16 md:mt-0"
        style={{ backgroundImage: "url('/b1.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <HeroSection />
      </div>

      <WavyDivider targetId="how" />
      <section id="how">
        <HowItWorksSection />
      </section>

      <WavyDivider targetId="map" />
      <section id="map">
        <MapSection />
      </section>

      <WavyDivider targetId="promotion" />
      <section id="promotion">
        <PromotionSection />
      </section>

      <WavyDivider targetId="test" />
      <section id="test">
        <TestimonialsSection />
      </section>

      <WavyDivider targetId="contact" />
      <section id="contact">
        <ContactSection />
      </section>

      <Footer />

      <button
        onClick={handleChatClick}
        className="fixed bottom-6 right-6 bg-black hover:bg-gray-800 p-4 rounded-full shadow-lg z-50 flex items-center justify-center"
      >
        <Bot className="w-6 h-6 text-green-500" />
      </button>

      {isChatOpen && !isMobile && <ChatAIBox />}
    </div>
  );
}

function ChatAIBox() {
  const [messages, setMessages] = useState([
    { sender: "ai", type: "text", content: "Hello! I'm GoPark AI. How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim() && !imagePreview) return;

    const newMsgs = [...messages];
    if (input.trim()) {
      newMsgs.push({ sender: "user", type: "text", content: input });
    }
    if (imagePreview) {
      newMsgs.push({ sender: "user", type: "image", content: imagePreview });
    }

    newMsgs.push({ sender: "ai", type: "text", content: "..." });
    setMessages(newMsgs);
    setInput("");
    setImagePreview(null);

    setTimeout(() => {
      setMessages((prev) => {
        const temp = [...prev];
        temp[temp.length - 1] = {
          sender: "ai",
          type: "text",
          content: "Thank you! I received your message. How can I assist you further?",
        };
        return temp;
      });
    }, 3000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed bottom-20 right-6 w-80 h-[500px] bg-white rounded-lg shadow-lg flex flex-col z-50">
      <div className="flex items-center justify-between px-4 py-3  bg-green-600 text-white">
        <div className="flex items-center gap-2 ">
          <Bot size={20} /> Gwouth AI
        </div>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div
        className={`flex-1 overflow-y-auto p-4 ${
          darkMode ? "bg-black text-white" : "bg-gray-100 text-black"
        }`}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className="flex items-end gap-2 max-w-[70%]">
              {msg.sender === "ai" && (
                <Image src="/logo.png" alt="AI" width={24} height={24} className="rounded-full" />
              )}
              <div
                className={`p-2 rounded-xl ${
                  msg.sender === "user"
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-gray-300 text-black rounded-bl-none"
                }`}
              >
                {msg.type === "text" && <span>{msg.content}</span>}
                {msg.type === "image" && (
                  <Image
                    src={msg.content}
                    alt="Uploaded"
                    width={200}
                    height={200}
                    className="rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 border-t p-2 bg-white">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 border rounded-full hover:bg-gray-200"
        >
          <ImageIcon size={18} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <input
          type="text"
          placeholder="input your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-full"
        />
        <button
          onClick={handleSend}
          className="p-2 bg-green-600 text-white rounded-full"
        >
          <SendHorizonal size={18} />
        </button>
      </div>
    </div>
  );
}
