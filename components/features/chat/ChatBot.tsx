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
  data?: any;
  buttons?: Array<{
    text: string;
    action: string;
    data?: any;
    primary?: boolean;
  }>;
  quickInfo?: string[];
}

interface UserInfo {
  role: string;
  name: string;
}

// Smart suggestions dựa trên context
const SMART_SUGGESTIONS = {
  guest: [
    "🔍 Tìm bãi xe theo thành phố",
    "💰 Xem bảng giá đỗ xe",
    "🏢 Tìm bãi xe tại Hà Nội",
    "🏖️ Tìm bãi xe tại Đà Nẵng",
    "📍 Bãi xe gần vị trí của tôi",
    "🎯 Bãi xe giá rẻ nhất",
    "⏰ Giờ hoạt động bãi xe",
    "📞 Liên hệ hỗ trợ",
    "📱 Hướng dẫn đăng ký",
  ],

  user: [
    "🎯 Đặt chỗ nhanh 2 giờ",
    "📋 Xem booking của tôi",
    "🚗 Xe của tôi",
    "💳 Hóa đơn chưa thanh toán",
    "📍 Tìm bãi xe gần đây",
    "⚡ Check-in QR code",
    "💰 Tìm bãi giá rẻ",
    "🔄 Gia hạn đặt chỗ",
    "⭐ Đánh giá bãi xe",
    "🗺️ Xem bản đồ bãi xe",
  ],

  parking_owner: [
    "📊 Slot trống hôm nay",
    "💰 Cập nhật giá bãi xe",
    "👥 Booking đang check-in",
    "📈 Doanh thu tuần này",
    "⚙️ Quản lý nhân viên",
    "📱 QR Code bãi xe",
    "📋 Lịch sử đặt chỗ",
    "📊 Thống kê lượt đặt",
    "🔔 Thông báo quan trọng",
  ],

  admin: [
    "🏢 Tất cả bãi xe trong hệ thống",
    "👥 Quản lý người dùng",
    "💰 Doanh thu hệ thống",
    "⚠️ Khiếu nại gần đây",
    "📊 Thống kê tổng quan",
    "🔐 Phân quyền người dùng",
    "📈 Báo cáo hàng tháng",
    "⚙️ Cấu hình hệ thống",
  ],
};

export default function ImprovedChatBot() {
  const API_PREFIX = "http://127.0.0.1:5000/api/v1";
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
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

  // State quản lý vị trí người dùng
  const [userLocation, setUserLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
    city: string | null;
  }>({
    latitude: null,
    longitude: null,
    city: null,
  });
  const [locationPermission, setLocationPermission] = useState<
    "granted" | "denied" | "pending"
  >("pending");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

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
  const getSmartSuggestions = (): string[] => {
    // 1. Lấy gợi ý theo role
    const roleKey = userInfo.role as keyof typeof SMART_SUGGESTIONS;
    let suggestions = SMART_SUGGESTIONS[roleKey] || SMART_SUGGESTIONS.guest;

    // 2. Nếu có location, thêm 1 gợi ý đặc biệt
    if (userLocation.city) {
      suggestions = [
        `📍 Bãi xe tại ${userLocation.city}`,
        ...suggestions.slice(0, 4), // Giữ 4 cái cũ + thêm 1 cái location
      ];
    }

    // 3. Luôn chỉ 5 cái
    return suggestions.slice(0, 5);
  };

  const getContextualSuggestions = (): string[] => {
  const roleKey = userInfo.role as keyof typeof SMART_SUGGESTIONS;
  let suggestions = SMART_SUGGESTIONS[roleKey] || SMART_SUGGESTIONS.guest;
  
  // Thêm gợi ý theo location
  if (userLocation.city) {
    suggestions = [
      `📍 Bãi xe tại ${userLocation.city}`,
      `💰 Giá bãi xe ${userLocation.city}`,
      ...suggestions.filter(s => !s.includes("tại"))
    ];
  }
  
  // Thêm gợi ý theo thời gian trong ngày
  const hour = new Date().getHours();
  if (hour >= 17 && hour <= 20) {
    suggestions = ["🌙 Bãi xe mở cửa đêm", ...suggestions];
  }
  
  // Giới hạn 5-6 gợi ý
  return suggestions.slice(0, 6);
};

  const handleSmartSuggestion = (suggestion: string) => {
    // MAP 1-1 giữa gợi ý và message thực tế
    const suggestionMap: Record<string, string> = {
      // === GUEST ===
      "🔍 Tìm bãi xe theo thành phố": "tìm bãi xe",
      "💰 Xem bảng giá đỗ xe": "bảng giá đỗ xe",
      "🏢 Tìm bãi xe tại Hà Nội": "tìm bãi xe ở Hà Nội",
      "❓ Giờ hoạt động bãi xe": "bãi xe mở cửa mấy giờ",
      "📍 Bãi xe gần tôi": "bãi xe gần đây",

      // === USER ===
      "🎯 Đặt chỗ nhanh 2 giờ": "đặt chỗ 2 giờ",
      "📋 Xem booking của tôi": "booking của tôi",
      "🚗 Xe của tôi": "xe của tôi",
      "💳 Hóa đơn chưa thanh toán": "hóa đơn của tôi",
      "📍 Tìm bãi xe gần đây": "tìm bãi xe gần đây",

      // === OWNER ===
      "📊 Slot trống hôm nay": "slot trống hôm nay",
      "💰 Cập nhật giá bãi xe": "cập nhật giá",
      "👥 Booking đang check-in": "booking đang check-in",
      "📈 Doanh thu tuần này": "doanh thu tuần này",
      "⚙️ Quản lý nhân viên": "quản lý nhân viên",

      // === ADMIN ===
      "🏢 Xem tất cả bãi xe": "tất cả bãi xe",
      "👥 Quản lý người dùng": "danh sách người dùng",
      "💰 Doanh thu hệ thống": "doanh thu hệ thống",
      "⚠️ Khiếu nại gần đây": "khiếu nại gần đây",
      "📊 Thống kê tổng quan": "thống kê tổng quan",

      // === LOCATION-BASED ===
      "📍 Bãi xe tại ${userLocation.city}": `tìm bãi xe ở ${userLocation.city}`,
    };

    // Lấy message tương ứng hoặc dùng chính suggestion
    const message = suggestionMap[suggestion] || suggestion;
    sendMessage(message);
  };

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
  let isMounted = true;
  let checkTimeout: NodeJS.Timeout;

  const checkUserAuth = async () => {
    if (!isMounted) return;

    try {
      console.log("🔍 [AUTH] Checking user authentication...");
      
      // Kiểm tra token
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      if (!token) {
        console.log("❌ [AUTH] No token found");
        setCurrentUserId(null);
        setUserInfo({ role: "guest", name: "Khách vãng lai" });
        return;
      }

      // Kiểm tra format token
      if (token.split('.').length !== 3) {
        console.error("❌ [AUTH] Token format invalid");
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setCurrentUserId(null);
        setUserInfo({ role: "guest", name: "Khách vãng lai" });
        return;
      }

      // Gọi API kiểm tra user
      try {
        const response = await fetch(`${API_URL}/api/v1/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(5000) // Timeout 5 giây
        });

        console.log(`✅ [AUTH] API Response status: ${response.status}`);

        if (response.status === 403 || response.status === 401) {
          // Token hết hạn hoặc không hợp lệ
          console.warn("⚠️ [AUTH] Token expired or invalid");
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          setCurrentUserId(null);
          setUserInfo({ role: "guest", name: "Khách vãng lai" });
          return;
        }

        if (!response.ok) {
          console.error(`❌ [AUTH] API Error: ${response.status}`);
          setCurrentUserId(null);
          setUserInfo({ role: "guest", name: "Khách vãng lai" });
          return;
        }

        const user = await response.json();
        console.log("✅ [AUTH] User data received:", {
          id: user._id || user.id,
          name: user.userName || user.name,
          role: user.role
        });

        // Xác định user ID
        let userId: string | null = null;
        if (user._id) {
          if (typeof user._id === "string") {
            userId = user._id;
          } else if (user._id.$oid) {
            userId = user._id.$oid;
          }
        } else if (user.id) {
          userId = user.id;
        }

        if (!userId) {
          console.error("❌ [AUTH] No valid user ID found");
          setCurrentUserId(null);
          setUserInfo({ role: "guest", name: "Khách vãng lai" });
          return;
        }

        // Xác định role và tên
        let role = user.role || "user";
        let name = user.userName || user.name || "Khách hàng";

        // FIX: Sửa tên "nguyenha"
        if (name.toLowerCase() === "nguyenha" || name === "nguyenha") {
          if (user.email) {
            // Lấy tên từ email (phần trước @)
            const emailName = user.email.split('@')[0];
            name = emailName.charAt(0).toUpperCase() + emailName.slice(1);
          } else {
            name = "Khách hàng";
          }
        }

        // Cập nhật state
        setCurrentUserId(userId);
        setUserInfo({ role, name });

        // Lưu vào storage để lần sau không cần gọi API
        localStorage.setItem("userInfo", JSON.stringify({ 
          userId, 
          role, 
          name,
          timestamp: Date.now()
        }));

        console.log("✅ [AUTH] User info updated:", { userId, role, name });

      } catch (fetchError: any) {
        console.error("❌ [AUTH] Fetch error:", fetchError.message);
        
        // Nếu là lỗi 403/401, clear token
        if (fetchError.message.includes("403") || fetchError.message.includes("401")) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
        }
        
        setCurrentUserId(null);
        setUserInfo({ role: "guest", name: "Khách vãng lai" });
      }

    } catch (error) {
      console.error("❌ [AUTH] Auth check error:", error);
      setCurrentUserId(null);
      setUserInfo({ role: "guest", name: "Khách vãng lai" });
    }
  };

  // Function kiểm tra từ localStorage trước
  const checkFromStorage = () => {
    try {
      // Kiểm tra từ localStorage trước
      const storedUserInfo = localStorage.getItem("userInfo");
      if (storedUserInfo) {
        const { userId, role, name, timestamp } = JSON.parse(storedUserInfo);
        
        // Nếu thông tin còn mới (< 5 phút), dùng luôn
        if (timestamp && (Date.now() - timestamp < 5 * 60 * 1000)) {
          console.log("📦 [AUTH] Using cached user info");
          setCurrentUserId(userId);
          setUserInfo({ role, name });
          return false; // Không cần gọi API
        }
      }
      return true; // Cần gọi API
    } catch (error) {
      return true; // Có lỗi, cần gọi API
    }
  };

  // Lần đầu: check từ storage, nếu cần thì gọi API
  if (checkFromStorage()) {
    checkUserAuth();
  }

  // Chỉ gọi lại khi cần thiết, không gọi liên tục
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible' && visible) {
      // Khi tab trở lại focus và chat đang mở, check auth
      clearTimeout(checkTimeout);
      checkTimeout = setTimeout(() => {
        if (isMounted) checkUserAuth();
      }, 1000);
    }
  };

  // Lắng nghe storage changes (khi login/logout từ tab khác)
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'token' || e.key === 'user') {
      console.log("🔄 [AUTH] Storage changed, re-checking...");
      clearTimeout(checkTimeout);
      checkTimeout = setTimeout(() => {
        if (isMounted) checkUserAuth();
      }, 500);
    }
  };

  // Lắng nghe custom event (khi login thành công)
  const handleAuthEvent = () => {
    console.log("🎯 [AUTH] Auth event received, re-checking...");
    clearTimeout(checkTimeout);
    checkTimeout = setTimeout(() => {
      if (isMounted) checkUserAuth();
    }, 500);
  };

  // Setup event listeners
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('userAuthChanged', handleAuthEvent);

  return () => {
    isMounted = false;
    clearTimeout(checkTimeout);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('userAuthChanged', handleAuthEvent);
  };
}, [visible, API_URL]); // Chỉ phụ thuộc vào visible và API_URL

  // VẪN check khi mở chat (để đảm bảo data mới nhất)
  useEffect(() => {
    if (visible) {
      // Trigger re-check khi mở chat
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const userData =
        localStorage.getItem("user") || sessionStorage.getItem("user");

      if (token && userData) {
        // Chỉ log, không gọi API lại trừ khi cần
        console.log("👀 Chat opened, current auth:", {
          hasToken: !!token,
          hasUserData: !!userData,
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

  const getUserLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      console.log("❌ Trình duyệt không hỗ trợ Geolocation");
      setLocationPermission("denied");
      return;
    }

    setIsGettingLocation(true);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        }
      );

      const { latitude, longitude } = position.coords;

      // Reverse geocoding để lấy tên thành phố
      let cityName = null;
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=vi`
        );
        const data = await response.json();
        cityName =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.county ||
          "Vị trí của bạn";
      } catch (error) {
        console.log("⚠️ Không thể lấy tên thành phố:", error);
        cityName = "Vị trí của bạn";
      }

      setUserLocation({
        latitude,
        longitude,
        city: cityName,
      });

      setLocationPermission("granted");

      // Gửi vị trí lên server để lưu vào session
      try {
        const sessionId = localStorage.getItem("chat_session_id");
        if (sessionId) {
          await fetch(`${API_URL}/api/v1/chatbot/save-location`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sessionId,
              userId: currentUserId,
              latitude,
              longitude,
              city: cityName,
              accuracy: position.coords.accuracy,
            }),
          });
        }
      } catch (error) {
        console.log("⚠️ Không thể lưu vị trí lên server:", error);
      }

      console.log("📍 Đã lấy vị trí:", { latitude, longitude, city: cityName });
    } catch (error: any) {
      console.error("❌ Lỗi lấy vị trí:", error);
      setLocationPermission("denied");

      // Fallback: lấy thành phố từ IP
      try {
        const ipResponse = await fetch("https://ipapi.co/json/");
        const ipData = await ipResponse.json();
        setUserLocation({
          latitude: null,
          longitude: null,
          city: ipData.city || "Hà Nội", // Fallback
        });
      } catch (ipError) {
        setUserLocation({
          latitude: null,
          longitude: null,
          city: "Hà Nội", // Fallback mặc định
        });
      }
    } finally {
      setIsGettingLocation(false);
    }
  }, [API_URL, currentUserId]);

  // Send message đến AI backend
  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // 1. Thêm tin nhắn người dùng
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
      // 2. Lấy hoặc tạo sessionId
      let sessionId = localStorage.getItem("chat_session_id");
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        localStorage.setItem("chat_session_id", sessionId);
      }

      // 3. Gửi request đến API
      console.log(
        "📤 Sending message to:",
        `${API_URL}/api/v1/chatbot/ai-chat`
      );

      const response = await fetch(`${API_URL}/api/v1/chatbot/ai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("token") && {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }),
        },
        body: JSON.stringify({
          message: content.trim(),
          userId: currentUserId,
          sessionId: sessionId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error:", response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("🤖 Chatbot Response:", data);

      if (data.status === "success" && data.data?.reply) {
        const reply = data.data.reply;

        // 4. Xử lý response theo nhiều loại khác nhau
        const processedResponse = await processChatbotResponse(
          reply,
          data.data.meta
        );

        // 5. Thêm tin nhắn AI vào danh sách
        setMessages((prev) => [...prev, processedResponse.message]);

        // 6. Cập nhật context và session
        const newContext = detectContext(processedResponse.content);
        setCurrentContext(newContext);

        if (data.data.meta?.sessionId) {
          localStorage.setItem("chat_session_id", data.data.meta.sessionId);
        }

        // 7. Nếu có action đặc biệt, xử lý thêm
        if (processedResponse.specialAction) {
          await handleSpecialAction(
            processedResponse.specialAction,
            processedResponse.data
          );
        }
      } else {
        throw new Error(data.message || "Không nhận được phản hồi từ AI");
      }
    } catch (error: any) {
      console.error("❌ Error sending message:", error);
      await handleChatError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== HELPER FUNCTIONS ====================

  /**
   * Xử lý response từ chatbot thành message format thống nhất
   */
  const processChatbotResponse = async (reply: any, meta: any) => {
    let replyContent = "";
    let replyType = "text";
    let replyData: any = null;
    let buttons: any[] = [];
    let specialAction: string | null = null;
    let quickInfo: string[] = [];

    // CASE 1: Response là string đơn giản
    if (typeof reply === "string") {
      replyContent = reply;

      // CASE 2: Response là object có cấu trúc
    } else if (reply && typeof reply === "object") {
      // Xác định type của response
      replyType = reply.type || "text";
      replyContent = reply.content || "Tôi không hiểu câu hỏi của bạn.";
      replyData = reply.data || null;
      buttons = reply.buttons || [];
      quickInfo = reply.quickInfo || [];

      // Xử lý riêng cho từng loại response
      switch (replyType) {
        case "nearest_parking_with_map":
          // Thêm thông tin khoảng cách vào content
          if (replyData?.nearestParking) {
            const parking = replyData.nearestParking;

            // Tạo URL map tự động
            const mapUrl = generateMapUrl(parking, replyData.userLocation);

            // Thêm button mở map nếu chưa có
            if (!buttons.some((btn) => btn.action === "open_map")) {
              buttons.push({
                text: "🗺️ Mở bản đồ",
                action: "open_map",
                data: {
                  url: mapUrl,
                  parkingId: parking.id,
                  lat: parking.coordinates?.[1],
                  lon: parking.coordinates?.[0],
                  name: parking.name,
                },
              });
            }

            // Thêm button xem chi tiết
            buttons.push({
              text: "📋 Xem chi tiết bãi xe",
              action: "view_parking_detail",
              data: { parkingId: parking.id },
            });

            specialAction = "show_parking_info";
          }
          break;

        case "nearest_parking_with_map":
          if (replyData?.nearestParking) {
            const parking = replyData.nearestParking;

            // Tạo URL map
            const mapUrl = `/citimap?parkingId=${parking.id}&lat=${parking.coordinates?.[1]}&lon=${parking.coordinates?.[0]}`;

            // Thêm button mở map
            buttons.push({
              text: "🗺️ Mở bản đồ",
              action: "open_map",
              data: { url: mapUrl },
            });
          }
          break;

        case "parking_list":
          if (replyData && Array.isArray(replyData)) {
            // Format danh sách bãi xe đẹp hơn
            replyContent += `\n\n🎯 **Top ${Math.min(
              replyData.length,
              3
            )} bãi xe tốt nhất:**`;
            replyData.slice(0, 3).forEach((lot: any, index: number) => {
              replyContent += `\n${index + 1}. **${lot.name}** - ${
                lot.price
              } - ${lot.available}`;
            });

            if (replyData.length > 3) {
              replyContent += `\n...và ${replyData.length - 3} bãi xe khác`;
            }
          }
          break;

        case "booking_form":
        case "confirm_booking":
          specialAction = "show_booking_form";
          break;

        case "require_login":
          specialAction = "prompt_login";
          break;
      }
    }

    // Format lại content nếu có quickInfo
    if (quickInfo.length > 0) {
      replyContent += "\n\n📊 **Thông tin nhanh:**";
      quickInfo.forEach((info) => {
        replyContent += `\n• ${info}`;
      });
    }

    return {
      message: {
        role: "assistant" as const,
        content: replyContent,
        timestamp: meta?.timestamp || new Date().toISOString(),
        type: replyType,
        data: replyData,
        buttons: buttons,
        quickInfo: quickInfo,
      },
      content: replyContent,
      data: replyData,
      buttons: buttons,
      specialAction: specialAction,
    };
  };

  /**
   * Tạo URL mở bản đồ với thông tin bãi xe
   */
  const generateMapUrl = (parking: any, userLocation: any) => {
    const params = new URLSearchParams();

    // Thông tin bãi xe
    if (parking.id) params.append("parkingId", parking.id);
    if (parking.coordinates?.[1])
      params.append("lat", parking.coordinates[1].toString());
    if (parking.coordinates?.[0])
      params.append("lon", parking.coordinates[0].toString());
    if (parking.name) params.append("name", encodeURIComponent(parking.name));

    // Thông tin vị trí người dùng
    if (userLocation?.lat)
      params.append("userLat", userLocation.lat.toString());
    if (userLocation?.lng)
      params.append("userLng", userLocation.lng.toString());
    if (userLocation?.city)
      params.append("city", encodeURIComponent(userLocation.city));

    return `/citimap?${params.toString()}`;
  };

  /**
   * Xử lý action đặc biệt từ chatbot
   */
  const handleSpecialAction = async (action: string, data: any) => {
    switch (action) {
      case "show_parking_info":
        // Có thể hiển thị thêm thông tin trong UI
        console.log("🏢 Hiển thị thông tin bãi xe:", data);
        break;

      case "prompt_login":
        // Gợi ý đăng nhập
        if (!currentUserId) {
          // Có thể show modal đăng nhập
          console.log("🔒 Yêu cầu đăng nhập");
        }
        break;

      case "show_booking_form":
        // Có thể mở modal booking
        console.log("📋 Mở form booking:", data);
        break;

      case "save_user_location":
        // Lưu vị trí người dùng
        if (data?.latitude && data?.longitude) {
          await saveUserLocationToServer(data);
        }
        break;
    }
  };

  /**
   * Xử lý lỗi chat
   */
  const handleChatError = async (error: any) => {
    setConnectionError(true);
    setCurrentContext("after_error");

    let errorMessage = "❌ **Có lỗi xảy ra**\n\n";

    if (error.message?.includes("Network")) {
      errorMessage += "Mất kết nối mạng. Vui lòng kiểm tra kết nối internet.";
    } else if (
      error.message?.includes("401") ||
      error.message?.includes("403")
    ) {
      errorMessage += "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";
      // Tự động clear session expired
      localStorage.removeItem("chat_session_id");
    } else if (error.message?.includes("500")) {
      errorMessage += "Máy chủ đang bận. Vui lòng thử lại sau.";
    } else {
      errorMessage += error.message || "Đã xảy ra lỗi không xác định";
    }

    errorMessage +=
      "\n\n🔄 **Khắc phục:**\n• F5 để tải lại trang\n• Kiểm tra kết nối mạng\n• Liên hệ hỗ trợ: 1800-1234";

    const errorMsg: Message = {
      role: "assistant",
      content: errorMessage,
      timestamp: new Date().toISOString(),
      type: "error",
      buttons: [
        {
          text: "🔄 Thử lại",
          action: "retry",
          data: { lastMessage: messages[messages.length - 1]?.content },
        },
        {
          text: "📞 Gọi hỗ trợ",
          action: "call_support",
          data: { phone: "18001234" },
        },
      ],
    };

    setMessages((prev) => [...prev, errorMsg]);
  };

  /**
   * Lưu vị trí người dùng lên server
   */
  const saveUserLocationToServer = async (locationData: any) => {
    try {
      const sessionId = localStorage.getItem("chat_session_id");
      if (!sessionId) return;

      await fetch(`${API_URL}/api/v1/chatbot/save-location`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          userId: currentUserId,
          ...locationData,
        }),
      });

      console.log("📍 Đã lưu vị trí người dùng");
    } catch (error) {
      console.error("⚠️ Không thể lưu vị trí:", error);
    }
  };

  /**
   * Xử lý khi người dùng click vào button trong chat
   */
  const handleMessageButtonClick = useCallback(
    (action: string, data: any) => {
      switch (action) {
        case "open_citimap":
          // Xây dựng URL bản đồ Đà Nẵng theo cấu trúc bạn cung cấp
          const defaultArriving = new Date().toISOString();
          const defaultLeaving = new Date(
            Date.now() + 60 * 60 * 1000
          ).toISOString(); // +1 giờ
          const mapUrl = `https://gopark.id.vn/CitiMap?city=%C4%90%C3%A0%20N%E1%BA%B5ng&arriving=${encodeURIComponent(
            defaultArriving
          )}&leaving=${encodeURIComponent(
            defaultLeaving
          )}&isNearby=false&userLat=16.054407&userLon=108.202167`;
          window.open(mapUrl, "_blank");
          break;

        case "book_parking":
          // Mở trang chi tiết bãi xe với ID từ data
          if (data?.parkingId) {
            window.open(
              `https://gopark.id.vn/detailParking/${data.parkingId}`,
              "_blank"
            );
          } else {
            console.error("Thiếu parkingId để đặt chỗ");
          }
          break;

        case "view_all_parking":
          // Điều hướng đến trang tìm kiếm
          window.open("https://gopark.id.vn/findParking", "_blank");
          break;

        case "find_parking":
          // Tìm bãi xe và mở bản đồ
          sendMessage("tìm bãi xe");
          setTimeout(() => {
            window.open("https://gopark.id.vn/findParking", "_blank");
          }, 500);
          break;

        case "register":
          // Đăng ký tài khoản
          window.open("https://gopark.id.vn/register", "_blank");
          break;

        case "add_vehicle":
          // Thêm xe
          window.open("https://gopark.id.vn/addVehicle", "_blank");
          break;

        case "login":
          // Đăng nhập
          window.open("https://gopark.id.vn/login", "_blank");
          break;

        case "call_now":
          // Gọi điện trực tiếp
          if (data?.phone === "0387762696") {
            window.location.href = `tel:${data.phone}`;
          }
          break;

        case "send_email":
          // Gửi email
          if (data?.email === "nguyen229396@gmail.com") {
            window.location.href = `mailto:${data.email}`;
          }
          break;

        case "open_facebook":
          // Mở Facebook
          window.open("https://www.facebook.com/taynguyen.ha.9/", "_blank");
          break;

        default:
          // Xử lý mặc định
          console.log("Action chưa được xử lý:", action);
      }
    },
    [sendMessage]
  );

  // Clear chat history
  const clearChatHistory = async () => {
    if (!currentUserId) {
      setMessages([]);
      setCurrentContext("initial");
      localStorage.removeItem("chat_session_id"); // Xóa session
      return;
    }

    try {
      const sessionId = localStorage.getItem("chat_session_id");

      // Gọi API xóa lịch sử
      const response = await fetch(
        `${API_URL}${API_PREFIX}/chatbot/chat-history`, // ← SỬA ĐÂY
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(localStorage.getItem("token") && {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }),
          },
          body: JSON.stringify({
            sessionId: sessionId,
            userId: currentUserId,
          }),
        }
      );

      if (response.ok) {
        setMessages([]);
        setCurrentContext("initial");
        localStorage.removeItem("chat_session_id"); // Xóa session
      } else {
        throw new Error("Failed to clear history");
      }
    } catch (error) {
      console.error("Error clearing chat:", error);
      // Fallback: clear local messages anyway
      setMessages([]);
      setCurrentContext("initial");
      localStorage.removeItem("chat_session_id");
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

  useEffect(() => {
    if (visible && locationPermission === "pending") {
      getUserLocation();
    }
  }, [visible, locationPermission, getUserLocation]);

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
                  {/* Nội dung tin nhắn */}
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>

                  {/* Quick Info (nếu có) */}
                  {msg.quickInfo && msg.quickInfo.length > 0 && (
                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                      {msg.quickInfo.map((info, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs"
                        >
                          <span>•</span>
                          <span>{info}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Buttons (nếu có) */}
                  {msg.buttons && msg.buttons.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.buttons.map((btn, btnIdx) => (
                        <button
                          key={btnIdx}
                          onClick={() =>
                            handleMessageButtonClick(btn.action, btn.data)
                          }
                          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                            btn.primary
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : isDarkMode
                              ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                          }`}
                        >
                          {btn.text}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  {msg.timestamp && (
                    <p className="text-xs opacity-50 mt-2 text-right">
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
            <div className="mb-3 overflow-x-auto pb-2">
              <div className="flex gap-2" style={{ minWidth: "max-content" }}>
                {getSmartSuggestions().map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSmartSuggestion(suggestion)}
                    disabled={isLoading}
                    className="text-xs px-3 py-2 rounded-full bg-[#00A859]/10 text-[#00A859] border border-[#00A859]/30 hover:bg-[#00A859]/20 transition-all disabled:opacity-50 whitespace-nowrap flex-shrink-0"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
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
