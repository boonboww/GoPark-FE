"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Bot,
  User,
  SendHorizonal,
  Image as ImageIcon,
  X,
  Sun,
  Moon,
} from "lucide-react";

import Header from "@/components/Header";

export default function ChatAI() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      type: "text",
      content: "Hello! I am Go Park AI. How can I help you?",
    },
  ]);
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!input.trim() && !imagePreview) return;

    const newMsgs = [...messages];
    if (input.trim()) {
      newMsgs.push({ sender: "user", type: "text", content: input });
    }
    if (imagePreview) {
      newMsgs.push({ sender: "user", type: "image", content: imagePreview });
    }
    newMsgs.push({
      sender: "ai",
      type: "text",
      content: "Thank you! I received the information. How can I assist you further?",
    });

    setMessages(newMsgs);
    setInput("");
    setImagePreview(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* GIỮ Header gốc */}
      <Header />

      {/* Chat Container */}
      <div
        className={`flex flex-col flex-1 ${
          darkMode ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        {/* Chat Header */}
        <div
          className={`flex items-center gap-4 px-4 py-3 border-b ${
            darkMode ? "border-green-500" : "border-green-700"
          }`}
        >
          <Image src="/logo.png" alt="AI Logo" width={40} height={40} />
          <h1
            className={`text-lg font-semibold ${
              darkMode ? "text-green-400" : "text-green-700"
            }`}
          >
            Gwouth AI Parking Assistant
          </h1>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="ml-auto p-2 rounded-full border border-green-500 hover:bg-green-600 transition"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-300" />
            ) : (
              <Moon className="w-5 h-5 text-green-700" />
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
                className={`flex items-start max-w-xs md:max-w-md p-3 rounded-2xl ${
                  msg.sender === "user"
                    ? `${
                        darkMode
                          ? "bg-green-600 text-white"
                          : "bg-green-500 text-white"
                      } rounded-br-none`
                    : `${
                        darkMode
                          ? "bg-gray-800 text-green-300"
                          : "bg-gray-200 text-green-800"
                      } rounded-bl-none`
                }`}
              >
                {msg.sender === "ai" && (
                  <Bot
                    className={`w-5 h-5 mr-2 ${
                      darkMode ? "text-green-400" : "text-green-700"
                    }`}
                  />
                )}
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
                {msg.sender === "user" && msg.type === "text" && (
                  <User className="w-5 h-5 ml-2 text-white" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div
          className={`border-t px-4 py-3 flex flex-col gap-2 ${
            darkMode ? "border-green-500" : "border-green-700"
          }`}
        >
          {imagePreview && (
            <div className="relative inline-block w-32">
              <Image
                src={imagePreview}
                alt="Preview"
                width={128}
                height={128}
                className="rounded-lg"
              />
              <X
                className="absolute top-1 right-1 w-5 h-5 bg-black text-white rounded-full cursor-pointer"
                onClick={() => setImagePreview(null)}
              />
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 rounded-full border ${
                darkMode
                  ? "border-green-400 hover:bg-green-600"
                  : "border-green-700 hover:bg-green-700"
              } transition`}
            >
              <ImageIcon
                className={`w-5 h-5 ${
                  darkMode ? "text-green-400" : "text-green-700"
                }`}
              />
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
              placeholder="Nhập tin nhắn..."
              className={`flex-1 p-2 rounded-full outline-none ${
                darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
              }`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              onClick={handleSend}
              className={`p-2 rounded-full transition ${
                darkMode
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              <SendHorizonal className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
