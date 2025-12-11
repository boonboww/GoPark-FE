"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PublicOnlyGuardProps {
  children: React.ReactNode;
}

export default function PublicOnlyGuard({ children }: PublicOnlyGuardProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const r = localStorage.getItem("role");
      setRole(r);
      if (r === "admin") {
        router.replace("/admin");
      } else if (r === "owner") {
        router.replace("/owner");
      }
    }
  }, [router]);

  if (!isMounted) return null;
  if (role === "admin" || role === "owner") return null;
  return <>{children}</>;
}
