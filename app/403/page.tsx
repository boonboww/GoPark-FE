"use client";

import { motion } from "framer-motion";
import { Car, ShieldBan } from "lucide-react"; // icon từ shadcn (lucide-react)

export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black px-4">
      {/* Icon Car + Ban */}
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 15 }}
        className="relative mb-6"
      >
        <div className="p-6 bg-red-100 dark:bg-red-900/40 rounded-full shadow-lg flex items-center justify-center">
          <Car className="w-16 h-16 text-[#00A859] dark:text-green-400" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute -bottom-4 right-0 bg-white dark:bg-black rounded-full p-2 shadow-lg"
        >
          <ShieldBan className="w-10 h-10 text-red-600 dark:text-red-500" />
        </motion.div>
      </motion.div>

      {/* Error Code */}
      <motion.h1
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-7xl font-extrabold text-red-600 dark:text-red-500 mb-4 drop-shadow"
      >
        403
      </motion.h1>

      {/* Title */}
      <motion.h2
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2 text-center"
      >
    
         Bạn không được phép vào bãi đỗ này
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md"
      >
        Vui lòng đăng nhập bằng tài khoản hợp lệ để tiếp tục sử dụng <span className="font-bold text-[#00A859]">GOPARK</span>.
      </motion.p>

      {/* Button */}
      <motion.a
        href="/account/login"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="px-6 py-3 bg-[#00A859] text-white rounded-2xl shadow-md hover:bg-green-700 dark:hover:bg-green-500 transition text-lg font-medium"
      >
         Quay lại đăng nhập
      </motion.a>
    </div>
  );
}
