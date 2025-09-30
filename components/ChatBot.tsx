"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Moon,
  Sun,
  X,
  Bot,
  Trash2,
  Mic,
  MicOff,
  Send,
  ChevronDown,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  type?: string;
  bookingData?: any;
  action?: string;
}

interface UserInfo {
  role: string;
  name: string;
}

// Smart suggestions dựa trên context
const CONTEXTUAL_SUGGESTIONS = {
  initial_guest: [
    "🔍 Tìm bãi xe gần đây",
    "💰 Giá đỗ xe như thế nào?",
    "📱 Làm sao để đặt chỗ?",
    "🕒 Bãi xe mở cửa lúc mấy giờ?",
    "💳 Có thể thanh toán bằng MoMo không?",
  ],
  initial_user: [
    "📋 Xem lịch sử booking của tôi",
    "🚗 Xe đã đăng ký của tôi",
    "🔍 Tìm bãi xe gần nhất",
    "🧾 Hóa đơn chưa thanh toán",
    "🎫 Cách sử dụng vé đậu xe",
  ],
  initial_owner: [
    "📊 Doanh thu tháng này",
    "📈 Thống kê booking",
    "🏢 Quản lý bãi xe",
    "💰 Cập nhật giá bãi xe",
    "🅿️ Quản lý slot trống",
  ],
  initial_admin: [
    "📊 Thống kê tổng quan hệ thống",
    "👥 Quản lý người dùng",
    "🏢 Quản lý bãi xe",
    "💸 Doanh thu toàn platform",
    "⚠️ Xử lý khiếu nại",
  ],
  after_search: [
    "📅 Đặt chỗ tại bãi này",
    "🔄 Xem bãi xe khác",
    "ℹ️ Thông tin chi tiết",
    "📍 Chỉ đường tới bãi xe",
    "💰 So sánh giá",
  ],
  after_booking: [
    "📋 Xem booking vừa tạo",
    "🔍 Tìm bãi khác",
    "🏠 Về trang chủ",
    "✏️ Chỉnh sửa booking",
    "❌ Hủy booking",
  ],
  after_error: [
    "🔄 Thử lại",
    "💬 Hỏi cách khác",
    "🆘 Liên hệ hỗ trợ",
    "📞 Gọi hotline",
    "🤔 Tìm giải pháp khác",
  ],
  need_auth: [
    "🔑 Hướng dẫn đăng nhập",
    "📝 Đăng ký tài khoản",
    "❓ Quên mật khẩu",
    "📱 Đăng nhập bằng Google",
    "🆓 Lợi ích khi đăng ký",
  ],
};
export default function ImprovedChatBot() {
  // State quản lý tin nhắn và input
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentContext, setCurrentContext] = useState<string>("initial");
  const [connectionError, setConnectionError] = useState(false);

  // State quản lý chiều cao chat container
  const [chatContainerHeight, setChatContainerHeight] = useState("400px");

  // State quản lý thông tin người dùng
  const [userInfo, setUserInfo] = useState<UserInfo>({
    role: "guest",
    name: "",
  });
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // State cho speech recognition và scroll
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Refs cho các phần tử DOM
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Phát hiện context từ response của AI
  const detectContext = useCallback((message: string) => {
    const lower = message.toLowerCase();

    if (lower.includes("đăng nhập") || lower.includes("auth required")) {
      return "need_auth";
    }
    if (lower.includes("tìm thấy") && lower.includes("bãi xe")) {
      return "after_search";
    }
    if (lower.includes("đặt chỗ thành công") || lower.includes("booking")) {
      return "after_booking";
    }
    if (lower.includes("lỗi") || lower.includes("không thể")) {
      return "after_error";
    }

    return "initial";
  }, []);

  // Lấy suggestions dựa trên context hiện tại
  const getCurrentSuggestions = useCallback((): string[] => {
    if (currentContext === "initial") {
      const key =
        `initial_${userInfo.role}` as keyof typeof CONTEXTUAL_SUGGESTIONS;
      return (
        CONTEXTUAL_SUGGESTIONS[key] || CONTEXTUAL_SUGGESTIONS.initial_guest
      );
    }

    const key = currentContext as keyof typeof CONTEXTUAL_SUGGESTIONS;
    return CONTEXTUAL_SUGGESTIONS[key] || CONTEXTUAL_SUGGESTIONS.initial_guest;
  }, [currentContext, userInfo.role]);

  // Khởi tạo speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setSpeechSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "vi-VN";

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => prev + transcript);
        };

        recognitionRef.current.onend = () => setIsListening(false);
        recognitionRef.current.onerror = () => setIsListening(false);
      }
    }
  }, []);

  // Auto scroll với smooth behavior
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages, isLoading]);

  // Check scroll position để hiển thị nút scroll to bottom
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollArea;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    };

    scrollArea.addEventListener("scroll", handleScroll);
    return () => scrollArea.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus input khi mở chat
  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [visible]);

  // Hàm check user authentication - ĐÃ ĐƯỢC SỬA ĐỂ LẤY ĐÚNG ROLE
 // THÊM event listener để detect auth changes
useEffect(() => {
  const checkUserAuth = async () => {
    try {
      console.log("🔍 Checking user auth...");
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      if (token) {
        try {
          const response = await fetch("http://localhost:5000/api/v1/users/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const user = await response.json();
            console.log("📡 Server response:", user);

            if (user._id || user.id) {
              const userId = user._id?.$oid || user._id || user.id;
              
              setCurrentUserId(userId.toString());
              setUserInfo({
                role: user.role || "user",
                name: user.userName || user.name || "User",
              });
              return;
            }
          }
        } catch (serverError) {
          console.error("❌ Server auth error:", serverError);
        }
      }

      // Fallback logic...
      const userData = localStorage.getItem("user") || sessionStorage.getItem("user");

      if (!userData || userData === "undefined" || userData === "null") {
        const role = localStorage.getItem("role") || sessionStorage.getItem("role");
        const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");

        if (role && userId) {
          setCurrentUserId(userId.toString());
          setUserInfo({
            role: role,
            name: "User",
          });
          return;
        }
      } else {
        const user = JSON.parse(userData);
        let userId = null;
        if (user._id) {
          if (typeof user._id === "string") {
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
            role: user.role || "user",
            name: user.userName || user.name || "User",
          });
          return;
        }
      }

      setCurrentUserId(null);
      setUserInfo({ role: "guest", name: "Khách vãng lai" });
    } catch (error) {
      console.error("❌ Lỗi kiểm tra auth:", error);
      setCurrentUserId(null);
      setUserInfo({ role: "guest", name: "Khách vãng lai" });
    }
  };

  // Gọi ngay khi component mount
  checkUserAuth();

  // Listen for storage changes (khi user login/logout) - QUAN TRỌNG
  const handleStorageChange = () => {
    console.log("🔄 Storage changed, checking auth again...");
    checkUserAuth();
  };

  // Listen for custom event (khi app gửi event auth changed)
  const handleAuthChange = () => {
    console.log("🔄 Auth changed event received, checking auth again...");
    checkUserAuth();
  };

  window.addEventListener("storage", handleStorageChange);
  window.addEventListener("userAuthChanged", handleAuthChange); // Custom event

  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener("userAuthChanged", handleAuthChange);
  };
}, []); // Chỉ chạy 1 lần khi mount

// VẪN check khi mở chat (để đảm bảo data mới nhất)
useEffect(() => {
  if (visible) {
    // Trigger re-check khi mở chat
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const userData = localStorage.getItem("user") || sessionStorage.getItem("user");
    
    if (token && userData) {
      // Chỉ log, không gọi API lại trừ khi cần
      console.log("👀 Chat opened, current auth:", { 
        hasToken: !!token, 
        hasUserData: !!userData 
      });
    }
  }
}, [visible]);

 

  // Debug userInfo khi thay đổi
  useEffect(() => {
    console.log("🔄 [USERINFO] Updated:", userInfo);
    console.log("🆔 [USERINFO] Current userId:", currentUserId);
  }, [userInfo, currentUserId]);

  // Voice recognition controls
  const toggleListening = () => {
    if (!recognitionRef.current || !speechSupported) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
      }
    }
  };

  // Send message đến AI backend
  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const newUserMessage: Message = {
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setIsLoading(true);
    setConnectionError(false);

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/chatbot/ai-chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content.trim(),
            userId: currentUserId,
          }),
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      if (data.status === "success" && data.data?.reply) {
        const replyContent =
          typeof data.data.reply === "string"
            ? data.data.reply
            : data.data.reply.content;

        const aiMessage: Message = {
          role: "assistant",
          content: replyContent,
          timestamp: data.timestamp || new Date().toISOString(),
        };

        setMessages((prev) => [...prev, aiMessage]);

        // Cập nhật context dựa trên response
        const newContext = detectContext(replyContent);
        setCurrentContext(newContext);
      } else {
        throw new Error(data.message || "Không nhận được phản hồi từ AI");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setConnectionError(true);
      setCurrentContext("after_error");

      const errorMsg: Message = {
        role: "assistant",
        content:
          "❌ **Lỗi kết nối**\n\nVui lòng kiểm tra:\n• Kết nối mạng\n• Server backend\n• Thử lại sau",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat history
  const clearChatHistory = async () => {
    if (!currentUserId) {
      setMessages([]);
      setCurrentContext("initial");
      return;
    }

    try {
      await fetch(
        `http://localhost:5000/api/v1/chatbot/chat-history/${currentUserId}`,
        {
          method: "DELETE",
        }
      );
      setMessages([]);
      setCurrentContext("initial");
    } catch (error) {
      setMessages([]);
      setCurrentContext("initial");
    }
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };
  // Tính toán chiều cao an toàn cho chat container dựa trên viewport
  useEffect(() => {
    const calculateSafeHeight = () => {
      const windowHeight = window.innerHeight;
      // Để lại khoảng trống cho toggle button và margin
      const maxHeight = windowHeight - 200; // 200px cho button + margin

      if (maxHeight < 300) {
        return "250px"; // Minimum height cho mobile rất nhỏ
      } else if (maxHeight < 400) {
        return "300px"; // Mobile nhỏ
      } else if (maxHeight < 500) {
        return "350px"; // Mobile trung bình
      } else {
        return "400px"; // Desktop/Tablet
      }
    };

    const updateHeight = () => {
      setChatContainerHeight(calculateSafeHeight());
    };

    updateHeight(); // Set initial
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <>
      {/* Chat Window - CHIỀU CAO CỐ ĐỊNH */}
      {visible && (
        <div
          className={`fixed bottom-20 right-2 sm:right-4 w-[96%] max-w-md z-50 shadow-2xl rounded-2xl border backdrop-blur-md transition-all duration-300 flex flex-col ${
            isDarkMode
              ? "bg-gray-900/95 text-white border-gray-700"
              : "bg-white/95 text-black border-gray-200"
          }`}
          style={{
            // TỰ ĐỘNG CO GIÃN theo content, không fix cứng
            maxHeight: "calc(100vh - 120px)", // Đảm bảo không vượt quá viewport
          }}
        >
          {/* Header */}
          <div
            className={`p-3 flex justify-between items-center rounded-t-2xl border-b ${
              isDarkMode
                ? "bg-gray-800/90 border-gray-700"
                : "bg-gradient-to-r from-[#00A859] to-[#007d42] text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-base">GoPark AI</h3>
                <p className="text-xs opacity-80 truncate">
                  {userInfo.role === "guest"
                    ? "Khách vãng lai"
                    : userInfo.role === "user"
                    ? `Người dùng - ${userInfo.name}`
                    : userInfo.role === "parking_owner"
                    ? `Chủ bãi xe - ${userInfo.name}`
                    : userInfo.role === "admin"
                    ? `Quản trị viên - ${userInfo.name}`
                    : `${userInfo.role} - ${userInfo.name}`}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {messages.length > 0 && (
                <button
                  onClick={clearChatHistory}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Xóa lịch sử"
                >
                  <Trash2 size={18} />
                </button>
              )}

              <button
                onClick={() => setIsDarkMode((prev) => !prev)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={() => setVisible(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area - CHIỀU CAO CỐ ĐỊNH */}
          <div
            ref={scrollAreaRef}
            className={`overflow-y-auto p-3 space-y-2 ${
              isDarkMode ? "bg-gray-900/50" : "bg-gray-50/50"
            }`}
            style={{
              // QUAN TRỌNG: Chiều cao tự động, không vượt quá container
              height: chatContainerHeight,
              maxHeight: "calc(100vh - 280px)", // Để chỗ cho header + input + margin
            }}
          >
            {/* Welcome Message */}
            {messages.length === 0 && !isLoading && (
              <div
                className={`text-center p-6 rounded-xl ${
                  isDarkMode ? "bg-gray-800/50" : "bg-white/80"
                }`}
              >
                <Bot className="w-12 h-12 mx-auto mb-3 text-[#00A859]" />
                <p className="font-semibold text-lg mb-2">
                  👋 Xin chào {userInfo.name || "bạn"}!
                </p>
                <p className="text-sm opacity-75">
                  Tôi là trợ lý AI của GoPark. Hãy hỏi tôi về bãi đậu xe nhé!
                </p>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${
                    msg.role === "user"
                      ? "bg-[#00A859] text-white rounded-br-sm"
                      : isDarkMode
                      ? "bg-gray-800 text-white rounded-bl-sm"
                      : "bg-white text-gray-800 rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.timestamp && (
                    <p className="text-xs opacity-50 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div
                  className={`px-4 py-3 rounded-2xl rounded-bl-sm ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex gap-2 items-center">
                    <div
                      className="w-2 h-2 bg-[#00A859] rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-[#00A859] rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-[#00A859] rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Scroll to bottom button */}
          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-32 right-6 p-2 bg-[#00A859] text-white rounded-full shadow-lg hover:bg-[#007d42] transition-all"
            >
              <ChevronDown size={20} />
            </button>
          )}

          {/* Connection Error */}
          {connectionError && (
            <div className="px-4 py-2 bg-red-100 border-t border-red-300 text-red-700 text-xs text-center">
              ⚠️ Lỗi kết nối server
            </div>
          )}

          {/* Smart Suggestions & Input Area */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            {" "}
            {/* THÊM flex-shrink-0 */}
            <div className="flex flex-wrap gap-2 mb-3">
              {getCurrentSuggestions().map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    sendMessage(suggestion.replace(/^[^\s]+\s/, ""))
                  }
                  disabled={isLoading}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all hover:scale-105 disabled:opacity-50 ${
                    isDarkMode
                      ? "border-[#00A859] text-[#00A859] hover:bg-[#00A859]/10"
                      : "border-gray-300 text-gray-700 hover:bg-[#00A859]/10 hover:border-[#00A859]"
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
            {/* Input Area */}
            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập câu hỏi..."
                  disabled={isLoading}
                  className={`w-full resize-none max-h-24 text-sm border rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-[#00A859] focus:outline-none transition-all disabled:opacity-50 ${
                    isDarkMode
                      ? "bg-gray-800 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                  } ${isListening ? "ring-2 ring-red-400" : ""}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  style={{ minHeight: "44px" }}
                />

                {speechSupported && (
                  <button
                    onClick={toggleListening}
                    disabled={isLoading}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all disabled:opacity-50 ${
                      isListening
                        ? "bg-red-500 text-white"
                        : isDarkMode
                        ? "text-gray-400 hover:text-[#00A859] hover:bg-gray-700"
                        : "text-gray-500 hover:text-[#00A859] hover:bg-gray-100"
                    }`}
                  >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                )}
              </div>

              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="bg-[#00A859] hover:bg-[#007d42] text-white rounded-xl px-5 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                style={{ height: "44px" }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
            {isListening && (
              <p className="text-xs text-red-500 text-center mt-2 animate-pulse">
                🎤 Đang nghe...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setVisible((prev) => !prev)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full shadow-2xl bg-gradient-to-r from-[#00A859] to-[#007d42] hover:from-[#007d42] hover:to-[#00A859] text-white transition-all duration-300 hover:scale-110 flex items-center justify-center  group"
      >
        <Bot className="w-7 h-7" />

        {userInfo.role !== "guest" && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs border-2 border-[#00A859]">
            {userInfo.role === "user"
              ? "👤"
              : userInfo.role === "owner"
              ? "🏢"
              : "👨‍💼"}
          </div>
        )}

        {connectionError && (
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </button>
    </>
  );
}
