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
   
      <div className="text-2xl font-bold cursor-pointer" onClick={() => router.push("/")}>
        <img src="/logo.png" alt="GoPark Logo" className="h-10" />
      </div>
      
      {!isLoggedIn && (
        <div className="flex gap-3">
          <Button  onClick={() => {
              router.push("/account/login");
            }}variant="ghost">Sign in</Button>
          <Button
            onClick={() => {
              router.push("/account/signup");
            }}
          >
            Sign up
          </Button>
        </div>
      )}
      {isLoggedIn && (
        <Button
          onClick={() => {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            router.push("/account/login");
          }}
        >
          Logout
        </Button>
      )}
    </header>
  );
};

export default Header;


