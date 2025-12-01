"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks";

const ScrollToTop = () => {
  const isChatOpen = useAppSelector((state) => state.chat.isChatOpen);
  const [isVisible, setIsVisible] = useState(false);

  // Theo dõi scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      // Hiển thị nút khi scroll xuống > 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Thêm event listener với throttle để tối ưu performance
    let timeoutId: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(toggleVisibility, 10);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Hàm scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Ẩn nút khi chat đang mở hoặc khi không cần hiển thị
  if (!isVisible || isChatOpen) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`
        scroll-to-top
        fixed bottom-24 right-4 z-50 
        bg-green-600 hover:bg-green-700 active:bg-green-800
        text-white p-3 rounded-full shadow-lg 
        transition-all duration-300 ease-in-out 
        transform hover:scale-110 active:scale-95
        focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50
        group
      `}
      aria-label="Scroll to top"
      title="Lên đầu trang"
    >
      <ChevronUp className="w-6 h-6 group-hover:animate-pulse transition-all duration-200" />

      {/* Hiệu ứng nhấp nháy ring */}
      <div
        className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping pointer-events-none"
        style={{ animationDuration: "2.5s" }}
      />
    </button>
  );
};

export default ScrollToTop;
