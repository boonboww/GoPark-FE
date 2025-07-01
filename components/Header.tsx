// components/Header.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Header = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <header className="w-full px-6 py-4 flex justify-between items-center bg-white shadow">
      <div className="text-2xl font-bold text-blue-600">GoPark</div>
      {!isLoggedIn && (
        <div className="flex gap-3">
          <Button variant="ghost">Sign in</Button>
          <Button>Sign up</Button>
        </div>
      )}
      {isLoggedIn && (
        <button
          onClick={() => {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            router.push("/account/login");
          }}
          className="hover:text-gray-600 transition-colors"
        >
          Logout
        </button>
      )}
    </header>
  );
};

export default Header;

// Bạn có thể thêm file FavoritesSheet.tsx và ShoppingBagSheet.tsx nếu cần, mình sẽ tiếp tục gửi.
