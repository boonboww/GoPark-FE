"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export default function FailPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center animate-[fadeIn_0.4s_ease]">
        {/* Icon */}
        <div className="mx-auto bg-red-100 text-red-600 w-20 h-20 flex items-center justify-center rounded-full mb-5 shadow-inner">
          <AlertTriangle size={46} strokeWidth={1.4} />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-red-600 mb-3">
          Thanh toán thất bại
        </h1>

        <p className="text-gray-700 leading-relaxed mb-6">
          Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên
          hệ bộ phận hỗ trợ để được giúp đỡ.
        </p>

        {/* Action */}
        <button
          className="w-full bg-black text-white py-3 rounded-xl font-semibold text-lg hover:bg-gray-900 transition"
          onClick={() => router.replace("/")}
        >
          Quay về trang chủ
        </button>

        {/* Support note */}
        <p className="text-sm text-gray-500 mt-4">
          Nếu bạn đã bị trừ tiền, hệ thống sẽ tự động đối soát trong vòng{" "}
          <strong>5–10 phút</strong>.
        </p>
      </div>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
