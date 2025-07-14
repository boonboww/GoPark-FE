"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS: string[] = [
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
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async (content: string) => {
    const newUserMessage: Message = { role: "user", content };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setInput("");
    setShowSuggestions(false);

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      const errorMsg: Message = {
        role: "assistant",
        content: "❌ Lỗi khi gửi tin nhắn. Vui lòng thử lại.",
      };
      setMessages([...newMessages, errorMsg]);
    }
  };

  const toggleChat = () => setVisible(!visible);
  const toggleSuggestions = () => setShowSuggestions(!showSuggestions);

  return (
    <>
      {visible && (
        <div className="fixed bottom-24 right-6 w-[92%] max-w-[400px] z-50 shadow-xl rounded-2xl bg-white border border-gray-200">
          <Card className="rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex justify-between items-center">
              <h2 className="font-semibold text-lg">GoPark Assistant</h2>
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleChat}
                className="text-white hover:bg-blue-700"
              >
                <X className="w-6 h-6" />
              </Button>
            </CardHeader>
            <CardContent className="p-4 bg-gray-50">
              {/* Gợi ý */}
              {showSuggestions && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {SUGGESTIONS.map((sugg, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="text-xs border-gray-300 hover:bg-blue-100 hover:border-blue-400 transition-all rounded-full px-3 py-1"
                      onClick={() => sendMessage(sugg)}
                    >
                      {sugg}
                    </Button>
                  ))}
                </div>
              )}
              {!showSuggestions && (
                <Button
                  variant="link"
                  className="text-xs text-blue-600 hover:text-blue-800 mb-2"
                  onClick={toggleSuggestions}
                >
                  + Hiện gợi ý
                </Button>
              )}

              {/* Tin nhắn */}
              <ScrollArea
                className="h-[200px] rounded-md px-1 py-1 mb-3 bg-white"
                ref={scrollRef}
              >
                <div className="flex flex-col gap-2">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`text-sm px-4 py-2 rounded-2xl shadow-sm whitespace-pre-line ${
                        msg.role === "user"
                          ? "bg-blue-500 text-white self-end max-w-[80%]"
                          : "bg-gray-200 text-gray-800 self-start max-w-[80%]"
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="flex gap-2 items-end">
                <Textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập câu hỏi..."
                  className="resize-none flex-1 text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-xl px-3 py-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (input.trim()) sendMessage(input.trim());
                    }
                  }}
                />
                <Button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-2 text-sm"
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
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-xl bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
      >
        <MessageCircle className="w-12 h-12" />
      </Button>
    </>
  );
}
