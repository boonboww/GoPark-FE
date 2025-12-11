"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Bot,
  User,
  SendHorizonal,
  Image as ImageIcon,
  X,
  Sun,
  Moon,
  Loader2,
} from "lucide-react";
import Header from "@/components/layout/Header";

export default function ChatAI() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      type: "text",
      content:
        "Hello! I'm GoPark AI. I can help you with parking information, directions, and more. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [thinking, setThinking] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!input.trim() && !imagePreview) return;

    const newMsgs = [...messages];
    if (input.trim()) {
      newMsgs.push({ sender: "user", type: "text", content: input });
    }
    if (imagePreview) {
      newMsgs.push({ sender: "user", type: "image", content: imagePreview });
    }

    setMessages(newMsgs);
    setInput("");
    setImagePreview(null);

    // AI thinking indicator
    setThinking(true);
    setMessages((prev) => [
      ...prev,
      { sender: "ai", type: "text", content: "thinking" },
    ]);

    // Simulate AI response after delay
    setTimeout(() => {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          sender: "ai",
          type: "text",
          content: getAIResponse(input, imagePreview !== null),
        };
        return updated;
      });
      setThinking(false);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5s
  };

  const getAIResponse = (userInput: string, hasImage: boolean): string => {
    if (hasImage) {
      return "Thanks for sharing the image. I can see the parking situation. What specific information do you need about this?";
    }

    const lowerInput = userInput.toLowerCase();
    if (lowerInput.includes("parking") || lowerInput.includes("spot")) {
      return "I can help you find available parking spots. Would you like to search by location or see nearby parking options?";
    } else if (lowerInput.includes("price") || lowerInput.includes("fee")) {
      return "Parking fees vary by location. Downtown areas typically charge $3-5 per hour, while suburban areas may be $1-2 per hour. Would you like specific pricing for a location?";
    } else if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
      return "Hello there! How can I assist with your parking needs today?";
    }

    return "I'm happy to help with parking-related questions. Could you provide more details about what you need?";
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        inputRef.current?.focus();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className={`flex flex-col min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Header />

      {/* Chat Container */}
      <div className="flex flex-col mt-16 flex-1 max-w-4xl w-full mx-auto">
        {/* Chat Header */}
        <div
          className={`flex items-center gap-3 px-4 py-3 sticky top-16 z-10 ${
            darkMode
              ? "bg-gray-900 border-b border-gray-700"
              : "bg-white border-b border-gray-200"
          }`}
        >
          <div
            className={`p-2 rounded-full ${
              darkMode ? "bg-green-600" : "bg-green-100"
            }`}
          >
            <Bot
              className={`w-5 h-5 ${
                darkMode ? "text-white" : "text-green-700"
              }`}
            />
          </div>
          <h1
            className={`text-lg font-semibold ${
              darkMode ? "text-green-400" : "text-green-700"
            }`}
          >
            GoPark AI Assistant
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`ml-auto p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300"
            } transition`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start gap-3 max-w-[90%] md:max-w-[80%] ${
                  msg.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {msg.sender === "ai" && (
                  <div
                    className={`flex-shrink-0 mt-1 ${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl ${
                    msg.sender === "user"
                      ? darkMode
                        ? "bg-green-600 text-white rounded-br-none"
                        : "bg-green-500 text-white rounded-br-none"
                      : darkMode
                      ? "bg-gray-800 text-gray-100 rounded-bl-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.type === "text" && msg.content === "thinking" ? (
                    <div className="flex space-x-1">
                      {[1, 2, 3].map((dot) => (
                        <div
                          key={dot}
                          className={`w-2 h-2 rounded-full ${
                            darkMode ? "bg-green-400" : "bg-green-600"
                          } animate-bounce`}
                          style={{ animationDelay: `${dot * 0.2}s` }}
                        />
                      ))}
                    </div>
                  ) : msg.type === "text" ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="relative">
                      <Image
                        src={msg.content}
                        alt="Uploaded"
                        width={256}
                        height={256}
                        className="rounded-lg max-w-full h-auto max-h-64 object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Fixed at bottom */}
        <div
          className={`sticky bottom-0 p-4 ${
            darkMode
              ? "bg-gray-900 border-t border-gray-700"
              : "bg-white border-t border-gray-200"
          }`}
        >
          {imagePreview && (
            <div className="relative mb-3 inline-block">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-300">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setImagePreview(null)}
                  className={`absolute top-1 right-1 p-1 rounded-full ${
                    darkMode ? "bg-gray-800" : "bg-gray-100"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-end gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 rounded-full ${
                darkMode
                  ? "text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                  : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"
              } transition`}
              aria-label="Attach image"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your message..."
                className={`w-full p-3 pr-12 rounded-full outline-none ${
                  darkMode
                    ? "bg-gray-800 text-white placeholder-gray-400"
                    : "bg-gray-100 text-black placeholder-gray-500"
                }`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={thinking}
              />
              {thinking && (
                <div className="absolute right-4 top-3.5">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              )}
            </div>

            <button
              onClick={handleSend}
              disabled={thinking || (!input.trim() && !imagePreview)}
              className={`p-3 rounded-full ${
                darkMode
                  ? "bg-green-600 hover:bg-green-700 disabled:bg-gray-700"
                  : "bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white"
              } transition`}
              aria-label="Send message"
            >
              <SendHorizonal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
