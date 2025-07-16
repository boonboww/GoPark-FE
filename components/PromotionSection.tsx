"use client";

import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function PromotionSection() {
  const router = useRouter();

  return (
    <section className="relative flex flex-col items-center justify-center py-24 px-4 text-center min-h-[70vh] overflow-hidden bg-gradient-to-b from-white to-sky-50">
      {/* Decorative Blur Circles */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative mb-10"
      >
        <div className="bg-sky-400 text-white px-8 py-4 rounded-xl text-base font-medium shadow-lg max-w-md">
          Bạn là nhà điều hành bãi đậu xe? <br />
          Bạn muốn quảng bá bãi đậu xe của mình và tiếp cận khách hàng mới?
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-sky-400" />
      </motion.div>

      {/* Satellite image */}
      <motion.img
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        viewport={{ once: true }}
        src="https://en.parkopedia.co.uk/public/images/satellite.png"
        alt="Vệ Tinh"
        className="w-40 h-auto mb-10 hover:scale-110 transition duration-500"
      />

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
        onClick={() => router.push("/business")}
        className="flex items-center cursor-pointer gap-3 bg-gradient-to-r from-sky-400 to-sky-500 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg hover:scale-105 hover:shadow-xl transition duration-300"
      >
        Tham Gia Với Chúng Tôi <FaArrowRight />
      </motion.button>
    </section>
  );
}