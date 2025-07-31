"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu as MenuIcon,
  X,
  User,
  Settings,
  LogOut,
  PlusCircle,
  CalendarCheck,
  HelpCircle,
  // Map,
  ShieldCheck,
  Bell,
  Search,
} from "lucide-react";

interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
}

export default function Header({
  isHomepage = false,
}: {
  isHomepage?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isAvatarClicked, setIsAvatarClicked] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showHeader, setShowHeader] = useState(true);

  const lastScrollY = useRef(0);
  const avatarRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      const now = new Date();
      const timeString = now.toLocaleString("vi-VN");
      setNotifications([
        {
          id: 1,
          message: "Bạn đã đăng nhập vào Go Park",
          time: timeString,
          read: false,
        },
      ]);
    }
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setIsAvatarMenuOpen(false);
        setIsAvatarClicked(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (isHomepage) {
        // Ẩn nếu cuộn xuống, chỉ hiện lại khi lên gần top
        if (currentScrollY < 80) {
          setShowHeader(true);
        } else {
          setShowHeader(false);
        }
      } else {
        if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
          setShowHeader(false); // scroll down
        } else {
          setShowHeader(true); // scroll up
        }
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomepage]);

  const handleAvatarClick = () => {
    if (isAvatarMenuOpen && isAvatarClicked) {
      setIsAvatarMenuOpen(false);
      setIsAvatarClicked(false);
    } else {
      setIsAvatarMenuOpen(true);
      setIsAvatarClicked(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAvatarMenuOpen(false);
    setIsAvatarClicked(false);
    router.push("/account/login");
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMobileMenuNavigation = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const DesktopMenuLinks = () => (
    <>
      <button
        onClick={() => router.push("/findParking")}
        className={`flex items-center cursor-pointer gap-2 ${
          isHomepage
            ? "text-white hover:text-white/80"
            : "text-gray-800 hover:text-blue-600"
        }`}
      >
        <Search size={16} /> Tìm kiếm
      </button>
      <button
        onClick={() => router.push("/myBooking")}
        className={`flex items-center cursor-pointer gap-2 ${
          isHomepage
            ? "text-white hover:text-white/80"
            : "text-gray-800 hover:text-blue-600"
        }`}
      >
        <CalendarCheck size={16} /> Đặt chỗ
      </button>
      <button
        onClick={() => router.push("/help")}
        className={`flex items-center cursor-pointer gap-2 ${
          isHomepage
            ? "text-white hover:text-white/80"
            : "text-gray-800 hover:text-blue-600"
        }`}
      >
        <HelpCircle size={16} /> Trợ giúp
      </button>
      <button
        onClick={() => router.push("/policyUser")}
        className={`flex items-center cursor-pointer gap-2 ${
          isHomepage
            ? "text-white hover:text-white/80"
            : "text-gray-800 hover:text-blue-600"
        }`}
      >
        <ShieldCheck size={16} /> Chính sách
      </button>
    </>
  );

  const MobileMenuLinks = () => (
    <>
      <button
        onClick={() => handleMobileMenuNavigation("/findParking")}
        className="flex items-center cursor-pointer gap-2 text-gray-800 hover:text-blue-600 w-full text-left py-2"
      >
        <Search size={16} /> Tìm kiếm
      </button>
      <button
        onClick={() => handleMobileMenuNavigation("/addVehicle")}
        className="flex items-center cursor-pointer gap-2 text-gray-800 hover:text-blue-600 w-full text-left py-2"
      >
        <PlusCircle size={16} /> Thêm phương tiện
      </button>
      <button
        onClick={() => handleMobileMenuNavigation("/myBooking")}
        className="flex items-center cursor-pointer gap-2 text-gray-800 hover:text-blue-600 w-full text-left py-2"
      >
        <CalendarCheck size={16} /> Đặt chỗ
      </button>
      <button
        onClick={() => handleMobileMenuNavigation("/help")}
        className="flex items-center cursor-pointer gap-2 text-gray-800 hover:text-blue-600 w-full text-left py-2"
      >
        <HelpCircle size={16} /> Trợ giúp
      </button>
      <button
        onClick={() => handleMobileMenuNavigation("/policyUser")}
        className="flex items-center cursor-pointer gap-2 text-gray-800 hover:text-blue-600 w-full text-left py-2"
      >
        <ShieldCheck size={16} /> Chính sách
      </button>
    </>
  );

  return (
    <header
      className={`w-full fixed z-[100] left-0 top-0 transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      } px-4 sm:px-6 py-4 flex justify-between items-center ${
        isHomepage
          ? "bg-transparent text-white"
          : "bg-white shadow text-gray-800"
      }`}
    >
      {/* Logo */}
      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={() => router.push("/")}
      >
        <img
          src="/logo.png"
          alt="GoPark Logo"
          className={`h-8 sm:h-10 ${
            isHomepage ? "filter brightness-0 invert" : ""
          }`}
        />
      </div>

      {!isLoggedIn ? (
        <div className="flex gap-3">
          <Button
            variant="ghost"
            className={`text-white hover:bg-white/20 ${
              !isHomepage && "text-blue-600 hover:text-blue-700"
            }`}
            onClick={() => router.push("/account/login")}
          >
            Đăng nhập
          </Button>
          <Button
            variant={isHomepage ? "ghost" : "default"}
            className={
              isHomepage
                ? "text-white hover:bg-white/20"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }
            onClick={() => router.push("/account/signup")}
          >
            Đăng ký
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3 sm:gap-4 relative">
          <div
            className={`hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium ${
              isHomepage ? "text-white" : "text-gray-800"
            }`}
          >
            <DesktopMenuLinks />
          </div>

          {/* <button
            onClick={() => router.push("/map")}
            className={`flex items-center cursor-pointer ${
              isHomepage
                ? "text-white hover:text-white/80"
                : "text-gray-800 hover:text-blue-600"
            }`}
          >
            <Map size={20} />
          </button> */}

          {/* Notification */}
          <div ref={notificationRef} className="relative">
            <button
              onClick={handleNotificationClick}
              className={`relative cursor-pointer ${
                isHomepage
                  ? "text-white hover:text-white/80"
                  : "text-gray-800 hover:text-blue-600"
              }`}
            >
              <Bell size={20} />
              {unreadCount > 0 && !isNotificationOpen && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-md shadow-lg py-2 z-50 bg-white text-gray-800">
                <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
                  <span className="font-semibold">Thông báo</span>
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-blue-500 cursor-pointer hover:underline"
                  >
                    Đánh dấu tất cả là đã đọc
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <div className="px-4 py-4 text-gray-500 text-sm">
                    Không có thông báo
                  </div>
                ) : (
                  notifications.map((note) => (
                    <div
                      key={note.id}
                      className={`px-4 py-3 hover:bg-gray-100 border-b border-gray-200 last:border-b-0 ${
                        !note.read ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="text-sm">{note.message}</div>
                      <div className="text-xs text-gray-500">{note.time}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Avatar */}
          <div
            ref={avatarRef}
            className="relative"
            onMouseEnter={() => {
              if (window.innerWidth >= 768 && !isAvatarClicked)
                setIsAvatarMenuOpen(true);
            }}
            onMouseLeave={() => {
              if (window.innerWidth >= 768 && !isAvatarClicked)
                setIsAvatarMenuOpen(false);
            }}
          >
            <img
              src="/avt.png"
              alt="Ảnh đại diện"
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border cursor-pointer ${
                isHomepage ? "border-white" : "border-gray-300"
              }`}
              onClick={handleAvatarClick}
            />

            {isAvatarMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 text-gray-800">
                <button
                  onClick={() => {
                    router.push("/personInfo");
                    setIsAvatarMenuOpen(false);
                    setIsAvatarClicked(false);
                  }}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer w-full text-left text-sm sm:text-base"
                >
                  <User size={16} className="mr-2" /> Thông tin cá nhân
                </button>
                <button
                  onClick={() => {
                    router.push("/settingUser");
                    setIsAvatarMenuOpen(false);
                    setIsAvatarClicked(false);
                  }}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer w-full text-left text-sm sm:text-base"
                >
                  <Settings size={16} className="mr-2" /> Cài đặt
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left cursor-pointer text-red-600 text-sm sm:text-base"
                >
                  <LogOut size={16} className="mr-2" /> Đăng xuất
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X
                size={24}
                className={isHomepage ? "text-white" : "text-gray-800"}
              />
            ) : (
              <MenuIcon
                size={24}
                className={isHomepage ? "text-white" : "text-gray-800"}
              />
            )}
          </button>
        </div>
      )}

      {isMobileMenuOpen && isLoggedIn && (
        <div
          ref={mobileMenuRef}
          className="absolute top-full left-0 w-full shadow-md flex flex-col items-start p-4 gap-2 md:hidden bg-white text-gray-800"
        >
          <MobileMenuLinks />
        </div>
      )}
    </header>
  );
}
