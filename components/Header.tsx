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
  Map,
  ShieldCheck,
  Bell,
} from "lucide-react";

interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isAvatarClicked, setIsAvatarClicked] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const avatarRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      const now = new Date();
      const timeString = now.toLocaleString();
      setNotifications([
        {
          id: 1,
          message: "You signed in to Go Park",
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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    // Khi mở ra, đánh dấu tất cả là đã đọc (nhưng không xoá)
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const MenuLinks = () => (
    <>
      <button
        onClick={() => router.push("/addVehicle")}
        className="flex items-center cursor-pointer gap-2 hover:text-blue-600"
      >
        <PlusCircle size={16} /> Add Vehicle
      </button>
      <button
        onClick={() => router.push("/myBooking")}
        className="flex items-center cursor-pointer gap-2 hover:text-blue-600"
      >
        <CalendarCheck size={16} /> Bookings
      </button>
      <button
        onClick={() => router.push("/help")}
        className="flex items-center cursor-pointer gap-2 hover:text-blue-600"
      >
        <HelpCircle size={16} /> Help
      </button>
      <button
        onClick={() => router.push("/policyUser")}
        className="flex items-center cursor-pointer gap-2 hover:text-blue-600"
      >
        <ShieldCheck size={16} /> Policy
      </button>
    </>
  );

  return (
    <header className="w-full fixed z-[100] left-0 top-0 px-6 py-4 flex justify-between items-center bg-white shadow">
      {/* Logo */}
      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={() => router.push("/")}
      >
        <img src="/logo.png" alt="GoPark Logo" className="h-10" />
      </div>

      {/* Not logged in */}
      {!isLoggedIn && (
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => router.push("/account/login")}>
            Sign in
          </Button>
          <Button onClick={() => router.push("/account/signup")}>
            Sign up
          </Button>
        </div>
      )}

      {/* Logged in */}
      {isLoggedIn && (
        <div className="flex items-center  gap-4 relative">
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <MenuLinks />
          </div>

          {/* Always visible icons */}
          <button
            onClick={() => router.push("/map")}
            className="flex items-center cursor-pointer hover:text-blue-600"
          >
            <Map size={20} />
          </button>

          <div ref={notificationRef} className="relative">
            <button
              onClick={handleNotificationClick}
              className="relative hover:text-blue-600 cursor-pointer"
            >
              <Bell size={20} />
              {unreadCount > 0 && !isNotificationOpen && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-2 z-50">
                <div className="flex justify-between items-center px-4 py-2 border-b">
                  <span className="font-semibold">Notifications</span>
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-blue-600 cursor-pointer hover:underline"
                  >
                    Mark all as read
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <div className="px-4 py-4 text-gray-500 text-sm">
                    No notifications
                  </div>
                ) : (
                  notifications.map((note) => (
                    <div
                      key={note.id}
                      className="px-4 py-3 hover:bg-gray-50 border-b last:border-b-0"
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
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover border cursor-pointer"
              onClick={handleAvatarClick}
            />

            {isAvatarMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                <button
                  onClick={() => {
                    router.push("/personInfo");
                    setIsAvatarMenuOpen(false);
                    setIsAvatarClicked(false);
                  }}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer w-full text-left"
                >
                  <User size={16} className="mr-2" /> Personal Info
                </button>
                <button
                  onClick={() => {
                    router.push("/settingUser");
                    setIsAvatarMenuOpen(false);
                    setIsAvatarClicked(false);
                  }}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer w-full text-left"
                >
                  <Settings size={16} className="mr-2" /> Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left cursor-pointer text-red-600"
                >
                  <LogOut size={16} className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      )}

      {/* Mobile menu */}
      {isMobileMenuOpen && isLoggedIn && (
        <div className="absolute top-full right-0 w-full bg-white shadow-md flex flex-col items-start p-4 gap-4 md:hidden">
          <MenuLinks />
        </div>
      )}
    </header>
  );
}
  