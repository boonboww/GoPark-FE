"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose: () => void;
}

export default function Toast({ 
  message, 
  type = "success", 
  duration = 3000,
  onClose 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Slide in
    setTimeout(() => setIsVisible(true), 10);

    // Auto dismiss
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-white border-l-4 border-green-500 shadow-lg";
      case "error":
        return "bg-white border-l-4 border-red-500 shadow-lg";
      case "warning":
        return "bg-white border-l-4 border-yellow-500 shadow-lg";
      case "info":
        return "bg-white border-l-4 border-blue-500 shadow-lg";
    }
  };

  return (
    <div
      className={`fixed top-20 right-4 z-[9999] transition-all duration-300 ease-in-out ${
        isVisible && !isExiting
          ? "translate-x-0 opacity-100"
          : "translate-x-[120%] opacity-0"
      }`}
    >
      <div
        className={`${getStyles()} rounded-lg p-4 pr-12 min-w-[300px] max-w-md flex items-start gap-3 relative`}
        style={{
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

        {/* Message */}
        <div className="flex-1">
          <p className="text-gray-800 text-sm font-medium leading-relaxed">
            {message}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Progress bar */}
        <div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-bl-lg"
          style={{
            animation: `shrink ${duration}ms linear forwards`,
          }}
        />
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
