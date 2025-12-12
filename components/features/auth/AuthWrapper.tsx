"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-50">
      {/* Soft Blue Animated Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* Main subtle gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" />

        {/* Animated fluid shapes */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-100/50 rounded-full blur-[120px] mix-blend-multiply animate-blob" />
        <div className="absolute top-[-20%] right-[-20%] w-[70%] h-[70%] bg-sky-100/50 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-[70%] h-[70%] bg-indigo-100/50 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-4000" />
      </div>

      {/* Very faint noise texture for premium feel */}
      <div className="absolute inset-0 opacity-[0.015] bg-[url('/noise.png')] pointer-events-none" />

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/50 backdrop-blur-sm border border-white/60 hover:bg-white text-slate-600 hover:text-slate-900 transition-all shadow-sm"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="sr-only">Back to Home</span>
        </Button>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl px-4 flex justify-center items-center">
        {children}
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 20s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animation-delay-2000 {
          animation-delay: 5s;
        }
        .animation-delay-4000 {
          animation-delay: 10s;
        }
      `}</style>
    </div>
  );
}
