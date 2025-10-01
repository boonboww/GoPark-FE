"use client";

import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRememberLogin } from '@/components/RememberLoginProvider';
import { useLogout } from '@/lib/logout';

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  clearRememberedLogin?: boolean;
  redirectTo?: string;
  className?: string;
  children?: React.ReactNode;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = "outline",
  size = "default",
  clearRememberedLogin = false,
  redirectTo = "/account/login",
  className = "",
  children
}) => {
  const { clearLogin } = useRememberLogin();
  const { logout } = useLogout();

  const handleLogout = async () => {
    try {
      // Xóa remembered login nếu được yêu cầu
      if (clearRememberedLogin) {
        clearLogin();
      }

      // Thực hiện logout
      await logout({
        redirectTo,
        clearRememberedLogin
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={`flex items-center gap-2 ${className}`}
    >
      <LogOut className="w-4 h-4" />
      {children || "Đăng xuất"}
    </Button>
  );
};

export default LogoutButton;
