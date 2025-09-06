"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface RoleGuardProps {
  allowedRole: string;
  children: React.ReactNode;
}

export default function RoleGuard({ allowedRole, children }: RoleGuardProps) {
  const router = useRouter();

  useEffect(() => {
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
    if (role !== allowedRole) {
      router.replace("/403");
    }
  }, [allowedRole, router]);

  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
  if (role !== allowedRole) {
    // Không render gì cả khi chưa đúng role
    return null;
  }
  return <>{children}</>;
}
