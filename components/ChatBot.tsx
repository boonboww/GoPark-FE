"use client";

import { useEffect, useRef, useState } from "react";
import { Moon, Sun, X, Bot, Trash2, Mic, MicOff, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

interface UserInfo {
  role: string;
  name: string;
}

// Gợi ý theo role khác nhau
const ROLE_SUGGESTIONS = {
  guest: [
    "Có bãi đậu xe gần đây không?",
    "Làm sao để đặt chỗ trước?",
    "Tôi có thể thanh toán bằng momo không?",
    "Bãi đậu xe mở cửa lúc mấy giờ?",
    "Phí gửi xe ban đêm là bao nhiêu?",
  ],
  user: [
    "Xem lịch sử booking của tôi",
    "Tìm bãi xe gần nhất",
    "Thông tin xe đã đăng ký",
    "Hóa đơn chưa thanh toán",
    "Cách sử dụng vé đậu xe",
  ],
  parking_owner: [
    "Thống kê doanh thu tháng này",
    "Có bao nhiêu booking hôm nay?",
    "Cách tăng lượt đặt chỗ",
    "Cập nhật giá bãi xe",
    "Quản lý slot trống",
  ],
  admin: [
    "Thống kê tổng quan hệ thống",
    "Số lượng user mới hôm nay",
    "Doanh thu toàn platform",
    "Bãi xe hoạt động nhiều nhất",
    "Xử lý khiếu nại",
  ]
};

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [visible, setVisible] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState(false);
  
  // Voice recognition states
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'vi-VN';

        recognitionRef.current.onstart = () => {
          setIsListening(true);
        };

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(prev => prev + transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  // Focus input khi mở chat
  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [visible]);

  // Auto scroll khi có tin nhắn mới
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Lấy thông tin user từ localStorage/sessionStorage (nếu có)
  useEffect(() => {
    checkUserAuth();
    
    // Listen for storage changes (khi user login/logout)
    const handleStorageChange = () => {
      console.log("🔄 Storage changed, checking auth again...");
      checkUserAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userAuthChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userAuthChanged', handleStorageChange);
    };
  }, []);

  // Refresh user auth khi mở chat
  useEffect(() => {
    if (visible) {
      checkUserAuth();
    }
  }, [visible]);

  const checkUserAuth = async () => {
    try {
      console.log("🔍 Checking user auth...");
      
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (token) {
        // Nếu có token, gọi API để lấy thông tin user từ server
        console.log("🔑 Token found, fetching user info from server...");
        
        try {
          const response = await fetch("http://localhost:5000/api/chatbot/user-info", {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            console.log("📡 Server response:", data);
            
            if (data.status === 'success' && data.data?.user) {
              const user = data.data.user;
              const userId = user._id || user.id;
              
              setCurrentUserId(userId.toString());
              setUserInfo({
                role: user.role || 'user',
                name: user.userName || user.name || 'User'
              });
              
              console.log("✅ User authenticated from server:", {
                id: userId,
                role: user.role,
                name: user.userName || user.name
              });
              return; // Thành công, không cần fallback
            }
          }
          
          console.log("⚠️ Server auth failed, trying localStorage fallback...");
        } catch (serverError) {
          console.error("❌ Server auth error:", serverError);
          console.log("⚠️ Falling back to localStorage...");
        }
      }
      
      // Fallback: check localStorage (nếu server auth thất bại)
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
      
      // ✅ NEW: Nếu không có user object, tạo từ các field riêng lẻ
      if (!userData || userData === 'undefined' || userData === 'null') {
        const role = localStorage.getItem('role') || sessionStorage.getItem('role');
        const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
        
        if (role && userId) {
          console.log("📝 Creating user object from separate fields");
          setCurrentUserId(userId.toString());
          setUserInfo({
            role: role,
            name: 'User' // Default name vì không có userName trong storage
          });
          console.log("✅ User from separate storage fields:", { id: userId, role });
          return;
        }
      } else {
        // Parse user object như cũ
        console.log("📄 Raw userData from storage:", userData);
        const user = JSON.parse(userData);
        console.log("👤 Parsed user object:", user);
        
        // Handle MongoDB format với $oid
        let userId = null;
        if (user._id) {
          if (typeof user._id === 'string') {
            userId = user._id;
          } else if (user._id.$oid) {
            userId = user._id.$oid;
          }
        } else if (user.id) {
          userId = user.id;
        }
        
        if (userId) {
          setCurrentUserId(userId.toString());
          setUserInfo({
            role: user.role || 'user',
            name: user.userName || user.name || 'User'
          });
          console.log("✅ User from localStorage:", {
            id: userId,
            role: user.role,
            name: user.userName || user.name
          });
          return;
        }
      }
      
      // Nếu không có gì cả, set guest
      setCurrentUserId(null);
      setUserInfo({ role: 'guest', name: 'Khách vãng lai' });
      console.log("👤 Guest user detected");
      
    } catch (error) {
      console.error("❌ Lỗi kiểm tra auth:", error);
      setCurrentUserId(null);
      setUserInfo({ role: 'guest', name: 'Khách vãng lai' });
    }
  };

  // Voice recognition functions
  const startListening = () => {
    if (!recognitionRef.current || !speechSupported || isListening) return;
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
      setIsListening(false);
    }
  };

  // Gửi tin nhắn tới backend
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const newUserMessage: Message = { 
      role: "user", 
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setInput("");
    setShowSuggestions(false);
    setIsLoading(true);
    setConnectionError(false);

    try {
      const response = await fetch("http://localhost:5000/api/chatbot/ai-chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
          message: content.trim(),
          userId: currentUserId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status === 'success' && data.data?.reply) {
        const aiReply: Message = {
          role: "assistant",
          content: data.data.reply.content,
          timestamp: data.timestamp
        };

        if (data.data.userInfo && !userInfo) {
          setUserInfo(data.data.userInfo);
        }

        setMessages([...newMessages, aiReply]);
      } else {
        throw new Error(data.message || "Không nhận được phản hồi từ AI");
      }

    } catch (error) {
      console.error("❌ Lỗi gửi tin nhắn:", error);
      setConnectionError(true);

      const errorMsg: Message = {
        role: "assistant",
        content: `❌ ${error instanceof Error ? error.message : 'Lỗi kết nối'}.\n\nVui lòng kiểm tra:\n• Server có chạy trên port 5000?\n• Kết nối mạng ổn định?`,
        timestamp: new Date().toISOString()
      };
      setMessages([...newMessages, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Lấy gợi ý phù hợp với role
  const getCurrentSuggestions = () => {
    const role = userInfo?.role || 'guest';
    return ROLE_SUGGESTIONS[role as keyof typeof ROLE_SUGGESTIONS] || ROLE_SUGGESTIONS.guest;
  };

  // Xóa lịch sử chat
  const clearChatHistory = async () => {
    if (!currentUserId) {
      setMessages([]);
      console.log("🗑️ Đã xóa lịch sử chat local");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/chatbot/chat-history/${currentUserId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setMessages([]);
        console.log("🗑️ Đã xóa lịch sử chat từ server");
      } else {
        setMessages([]);
      }
    } catch (error) {
      setMessages([]);
    }
  };

  const toggleChat = () => setVisible(prev => !prev);

  return (
    <>
      {/* Khung chat */}
      {visible && (
        <div
          className={`fixed bottom-20 right-2 sm:right-4 w-[96%] max-w-sm z-50 shadow-2xl rounded-xl border backdrop-blur-sm ${
            isDarkMode
              ? "bg-gray-900/95 text-white border-gray-700"
              : "bg-white/95 text-black border-gray-200"
          }`}
        >
          <Card className="rounded-xl overflow-hidden bg-transparent border-none shadow-none">
            <CardHeader
              className={`p-3 flex justify-between items-center rounded-t-xl ${
                isDarkMode
                  ? "bg-gray-800/90 text-[#00A859]"
                  : "bg-[#00A859] text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleChat}
                  className="font-semibold text-base hover:opacity-80 transition-opacity"
                >
                  GoPark AI
                </button>
                
                {/* Badge hiển thị role user */}
                {userInfo && (
                  <Badge 
                    variant={userInfo.role === 'guest' ? "outline" : "secondary"} 
                    className={`text-xs px-2 py-1 ${
                      isDarkMode 
                        ? "bg-gray-700 text-[#00A859] border-[#00A859]" 
                        : "bg-white/90 text-gray-700 border-gray-300"
                    }`}
                  >
                    {userInfo.role === 'guest' && '👤'}
                    {userInfo.role === 'user' && '🧑‍💼'}
                    {userInfo.role === 'parking_owner' && '🏢'}
                    {userInfo.role === 'admin' && '👨‍💼'}
                    {' ' + (userInfo.name.length > 10 ? userInfo.name.substring(0, 10) + '...' : userInfo.name)}
                  </Badge>
                )}
              </div>

              <div className="flex gap-1">
                {/* Nút xóa lịch sử */}
                {messages.length > 0 && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={clearChatHistory}
                    className={`h-8 w-8 hover:bg-white/20 ${
                      isDarkMode ? "text-[#00A859]" : "text-white"
                    }`}
                    title="Xóa lịch sử chat"
                  >
                    <Trash2 size={14} />
                  </Button>
                )}

                {/* Toggle dark mode */}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsDarkMode(prev => !prev)}
                  className={`h-8 w-8 hover:bg-white/20 ${
                    isDarkMode ? "text-[#00A859]" : "text-white"
                  }`}
                >
                  {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                </Button>

                {/* Đóng chat */}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={toggleChat}
                  className={`h-8 w-8 hover:bg-white/20 ${
                    isDarkMode ? "text-[#00A859]" : "text-white"
                  }`}
                >
                  <X size={16} />
                </Button>
              </div>
            </CardHeader>

            <CardContent className={`p-3 ${isDarkMode ? "bg-gray-900/90" : "bg-gray-50/90"}`}>
              {/* Hiển thị lỗi kết nối */}
              {connectionError && (
                <div className="mb-2 p-2 bg-red-100 border border-red-300 rounded-md text-red-700 text-xs">
                  ⚠️ Lỗi kết nối server. Kiểm tra backend có chạy không?
                </div>
              )}

              {/* Gợi ý */}
              <div className="mb-2 flex flex-wrap gap-1.5">
                {showSuggestions ? (
                  getCurrentSuggestions().map((sugg, idx) => (
                    <button
                      key={idx}
                      className={`text-xs rounded-full px-2.5 py-1 border transition-all hover:scale-105 ${
                        isDarkMode
                          ? "border-[#00A859] text-[#00A859] hover:bg-[#00A859]/10"
                          : "border-gray-300 text-gray-700 hover:bg-[#00A859]/10 hover:border-[#00A859]"
                      }`}
                      onClick={() => sendMessage(sugg)}
                    >
                      {sugg}
                    </button>
                  ))
                ) : (
                  <button
                    onClick={() => setShowSuggestions(true)}
                    className={`text-xs underline hover:no-underline transition-all ${
                      isDarkMode
                        ? "text-[#00A859] hover:text-white"
                        : "text-[#00A859] hover:text-gray-700"
                    }`}
                  >
                    + Hiện gợi ý ({userInfo?.role || 'guest'})
                  </button>
                )}
              </div>

              {/* Tin nhắn */}
              <ScrollArea className="h-[180px] px-1 py-1 mb-2 rounded-md">
                <div className="flex flex-col gap-1.5">
                  {/* Welcome message */}
                  {messages.length === 0 && !isLoading && (
                    <div className={`text-center text-xs p-4 rounded-lg ${
                      isDarkMode ? "text-gray-300 bg-gray-800/50" : "text-gray-600 bg-gray-100/80"
                    }`}>
                      👋 Xin chào{userInfo?.name ? ` ${userInfo.name}` : ''}!<br />
                      Tôi là trợ lý AI của GoPark.{' '}
                      {userInfo?.role === 'guest' 
                        ? 'Hãy hỏi tôi về bãi đậu xe nhé!'
                        : 'Tôi có thể giúp gì cho bạn?'
                      }
                    </div>
                  )}

                  {/* Messages */}
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`text-xs sm:text-sm px-3 py-2 rounded-2xl whitespace-pre-line shadow-sm transition-all duration-200 max-w-[85%] ${
                        msg.role === "user"
                          ? "self-end bg-[#00A859] text-white"
                          : isDarkMode
                          ? "self-start bg-gray-700/80 text-white"
                          : "self-start bg-white/90 text-gray-800 shadow-md"
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {isLoading && (
                    <div
                      className={`self-start px-3 py-2 rounded-2xl font-medium animate-pulse w-fit ${
                        isDarkMode
                          ? "bg-gray-700/80 text-[#00A859]"
                          : "bg-white/90 text-[#00A859] shadow-md"
                      }`}
                    >
                      🤖 Đang suy nghĩ...
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>

              {/* Input với Voice Recognition */}
              <div className="flex gap-2 items-end">
                <div className="flex-1 relative">
                  <Textarea
                    ref={inputRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Nhập câu hỏi hoặc nhấn mic... (${userInfo?.role || 'guest'})`}
                    className={`resize-none max-h-20 text-xs border rounded-xl px-3 py-2 pr-12 min-h-[40px] transition-all focus:ring-2 focus:ring-[#00A859] ${
                      isDarkMode
                        ? "bg-gray-800/80 text-white border-gray-600 placeholder:text-gray-400"
                        : "bg-white text-gray-900 border-gray-300 placeholder:text-gray-500"
                    } ${isListening ? 'ring-2 ring-red-400' : ''}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(input);
                      }
                    }}
                  />
                  
                  {/* Mic button inside input */}
                  {speechSupported && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={isListening ? stopListening : startListening}
                      disabled={isLoading}
                      className={`absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full transition-all ${
                        isListening 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : isDarkMode
                            ? 'text-gray-400 hover:text-[#00A859] hover:bg-gray-700'
                            : 'text-gray-500 hover:text-[#00A859] hover:bg-gray-100'
                      }`}
                      title={isListening ? "Đang nghe... (nhấn để dừng)" : "Nhấn để nói"}
                    >
                      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                    </Button>
                  )}
                </div>

                {/* Send button */}
                <Button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="bg-[#00A859] hover:bg-[#007d42] text-white rounded-xl px-4 py-2 h-10 text-sm disabled:opacity-50 transition-all hover:scale-105 shadow-lg"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send size={16} />
                  )}
                </Button>
              </div>

              {/* Voice status indicator */}
              {isListening && (
                <div className="mt-1 text-xs text-center">
                  <span className="inline-flex items-center gap-1 text-red-500">
                    🎤 Đang nghe... Hãy nói rõ ràng
                  </span>
                </div>
              )}

              {!speechSupported && (
                <div className="mt-1 text-xs text-center text-gray-500">
                  Trình duyệt không hỗ trợ nhận diện giọng nói
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Nút mở chat */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={toggleChat}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl bg-gradient-to-r from-gray-900 to-black hover:from-[#007d42] hover:to-[#00A859] text-[#00A859] hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 relative border-2 border-[#00A859]"
        >
          <Bot className="w-6 h-6 sm:w-7 sm:h-7" />

          {/* Role indicator */}
          {userInfo && userInfo.role !== 'guest' && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#00A859] rounded-full flex items-center justify-center text-[8px] shadow-lg border-2 border-white">
              {userInfo.role === 'user' ? '👤' :
               userInfo.role === 'parking_owner' ? '🏢' : '👨‍💼'}
            </div>
          )}

          {/* Connection error indicator */}
          {connectionError && (
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
          )}

          {/* Listening indicator */}
          {isListening && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg">
              <div className="w-full h-full rounded-full bg-red-400 animate-ping"></div>
            </div>
          )}
        </Button>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}
