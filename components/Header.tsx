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
  Home,
  MapPin,
  CalendarCheck,
} from "lucide-react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isAvatarClicked, setIsAvatarClicked] = useState(false);

  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAvatarClick = () => {
    if (isAvatarMenuOpen && isAvatarClicked) {
      // Đang mở vì click → click lần nữa để đóng
      setIsAvatarMenuOpen(false);
      setIsAvatarClicked(false);
    } else {
      // Chưa mở hoặc mở bằng hover → click để mở cố định
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

  const MenuLinks = () => (
    <>
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 hover:text-blue-600"
      >
        <Home size={16} /> Home
      </button>
      <button
        onClick={() => router.push("/find-parking")}
        className="flex items-center gap-2 hover:text-blue-600"
      >
        <MapPin size={16} /> Find Parking
      </button>
      <button
        onClick={() => router.push("/my-bookings")}
        className="flex items-center gap-2 hover:text-blue-600"
      >
        <CalendarCheck size={16} /> My Bookings
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

      {/* Chưa đăng nhập */}
      {!isLoggedIn && (
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => router.push("/account/login")}>
            Sign in
          </Button>
          <Button onClick={() => router.push("/account/signup")}>Sign up</Button>
        </div>
      )}

      {/* Đã đăng nhập */}
      {isLoggedIn && (
        <div className="flex items-center gap-4 relative">
          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <MenuLinks />
          </div>

          {/* Avatar + Dropdown */}
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
                    router.push("/profile");
                    setIsAvatarMenuOpen(false);
                    setIsAvatarClicked(false);
                  }}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                >
                  <User size={16} className="mr-2" /> Personal Info
                </button>
                <button
                  onClick={() => {
                    router.push("/settings");
                    setIsAvatarMenuOpen(false);
                    setIsAvatarClicked(false);
                  }}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                >
                  <Settings size={16} className="mr-2" /> Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                >
                  <LogOut size={16} className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
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
  