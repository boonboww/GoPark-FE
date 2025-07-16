"use client";

import { useEffect, useRef, useState } from "react";
import { Moon, Sun, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Có bãi đậu xe gần đây không?",
  "Làm sao để đặt chỗ trước?",
  "Tôi có thể thanh toán bằng momo không?",
  "Bãi đậu xe mở cửa lúc mấy giờ?",
  "Phí gửi xe ban đêm là bao nhiêu?",
];

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [visible, setVisible] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (visible) setTimeout(() => inputRef.current?.focus(), 200);
  }, [visible]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    const newUserMessage: Message = { role: "user", content };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setInput("");
    setShowSuggestions(false);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      const reply: Message = {
        role: "assistant",
        content: data?.reply?.content || "Không có phản hồi.",
      };
      setMessages([...newMessages, reply]);
    } catch {
      const errorMsg: Message = {
        role: "assistant",
        content: "❌ Lỗi khi gửi tin nhắn. Vui lòng thử lại.",
      };
      setMessages([...newMessages, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {visible && (
        <div
          className={`fixed bottom-20 right-0 left-0 mx-auto w-[95%] max-w-md z-50 shadow-2xl rounded-2xl border ${
            isDarkMode
              ? "bg-[#0a0f0a] text-white border-[#1f1f1f]"
              : "bg-white text-black border-gray-200"
          }`}
          style={{ maxHeight: "calc(100vh - 120px)" }}
        >
          <Card className="rounded-2xl overflow-hidden h-full">
            <CardHeader
              className={`p-3 flex justify-between items-center ${
                isDarkMode
                  ? "bg-[#1a1f1a] text-[#00A859]"
                  : "bg-[#00A859] text-white"
              }`}
            >
              <h2 className="font-semibold text-base">GoPark AI</h2>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsDarkMode((prev) => !prev)}
                  className={`${isDarkMode ? "text-[#00A859]" : "text-white"} h-8 w-8`}
                >
                  {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setVisible(false)}
                  className={`${isDarkMode ? "text-[#00A859]" : "text-white"} h-8 w-8`}
                >
                  <X size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className={`p-3 ${isDarkMode ? "bg-[#0a0f0a]" : "bg-gray-50"}`}>
              {/* Gợi ý */}
              <div className="mb-2 flex flex-wrap gap-1">
                {showSuggestions
                  ? SUGGESTIONS.map((sugg, idx) => (
                      <button
                        key={idx}
                        className={`text-xs rounded-full px-2 py-1 border ${
                          isDarkMode
                            ? "border-[#00A859] text-[#00A859] hover:bg-[#003d28]"
                            : "border-gray-300 text-black hover:bg-[#d8f3e1]"
                        } transition`}
                        onClick={() => sendMessage(sugg)}
                      >
                        {sugg}
                      </button>
                    ))
                  : (
                    <button
                      onClick={() => setShowSuggestions(true)}
                      className={`text-xs underline ${
                        isDarkMode ? "text-white hover:text-[#00A859]" : "text-[#00A859]"
                      }`}
                    >
                      + Hiện gợi ý
                    </button>
                  )}
              </div>

              {/* Tin nhắn */}
              <ScrollArea className="h-[200px] px-1 py-1 mb-2 rounded-md">
                <div className="flex flex-col gap-1">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`text-xs px-3 py-1.5 rounded-xl whitespace-pre-line shadow-sm transition-all duration-200 max-w-[85%] ${
                        msg.role === "user"
                          ? "self-end bg-[#00A859] text-white"
                          : isDarkMode
                          ? "self-start bg-[#1f2b1f] text-white"
                          : "self-start bg-[#f0f0f0] text-black"
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}
                  {isLoading && (
                    <div
                      className={`self-start px-3 py-1.5 rounded-xl font-bold animate-blink w-fit ${
                        isDarkMode
                          ? "bg-[#1f2b1f] text-[#00A859]"
                          : "bg-gray-200 text-[#00A859]"
                      }`}
                    >
                      ...
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="flex gap-1 items-end">
                <Textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập câu hỏi..."
                  className={`resize-none max-h-20 text-xs border rounded-lg px-2 py-1 flex-1 ${
                    isDarkMode
                      ? "bg-[#0a0f0a] text-white border-[#444] focus:ring-[#00A859]"
                      : "bg-white text-black border-gray-300 focus:ring-[#00A859]"
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                />
                <Button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="bg-[#00A859] hover:bg-[#007d42] text-white rounded-lg px-3 py-1 text-xs h-8"
                >
                  Gửi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Nút mở chat */}
      <Button
        onClick={() => setVisible(true)}
        className="fixed bottom-4 right-4 z-40 w-12 h-12 rounded-full shadow-lg bg-black hover:bg-[#007d42] text-green-600 flex items-center justify-center transition-all duration-200 hover:scale-110"
      >
        <Bot className="w-6 h-6" />
      </Button>

      {/* Hiệu ứng chấm nhấp nháy */}
      <style jsx>{`
        @keyframes blink {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </>
  );
}