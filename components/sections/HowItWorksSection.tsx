"use client";

import Link from "next/link";
import {
  FaCar,
  FaSearch,
  FaMoneyCheckAlt,
  FaPlusCircle,
  FaRegSmile,
} from "react-icons/fa";
import { ChevronRight } from "lucide-react";
import { motion, easeOut } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef } from "react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easeOut
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut
    }
  }
};

function AnimatedSection({ children, className = "" }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedItem({ children, variants = itemVariants, className = "" }) {
  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
}

export default function HowItWorksSection() {
  return (
    <section className="relative py-20 px-6 text-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj4KICA8ZyBmaWxsPSJub25lIiBzdHJva2U9IiMxNzkwZTYiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMiI+CiAgICA8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxNSIgLz4KICAgIDxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjI1IiAvPgogIDwvZz4KPC9zdmc+')] opacity-30"></div>
      
      <div className="container mx-auto relative z-10">
        <AnimatedSection className="mb-16">
          <AnimatedItem className="mb-2 flex items-center justify-center gap-2 text-blue-600 font-medium">
            <div className="w-6 h-px bg-blue-600"></div>
            <span>GIẢI PHÁP ĐỖ XE</span>
            <div className="w-6 h-px bg-blue-600"></div>
          </AnimatedItem>
          
          <AnimatedItem>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Cách thức hoạt động
            </h2>
          </AnimatedItem>
          
          <AnimatedItem>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-16 leading-relaxed">
              Dù bạn đang tìm chỗ đậu xe hay muốn quảng bá không gian đậu xe của mình,
              GoPark làm mọi thứ trở nên đơn giản và tiện lợi.
            </p>
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* For Drivers */}
          <AnimatedItem variants={cardVariants}>
            <motion.div 
              whileHover={{ y: -5 }}
              className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
              
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaCar className="text-2xl text-blue-600" />
              </div>
              
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                Dành Cho Tài Xế
              </h3>
              
              <div className="flex flex-col gap-6 mb-8 text-left">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mt-1">
                    <FaSearch className="text-lg text-blue-600" />
                  </div>
                  <span className="text-gray-700">
                    Tìm kiếm các chỗ đậu xe gần đó với bản đồ trực quan
                  </span>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mt-1">
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">Đ</span>
                    </div>
                  </div>
                  <span className="text-gray-700">
                    Đặt chỗ đậu xe trực tuyến nhanh chóng, chỉ với vài thao tác
                  </span>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mt-1">
                    <FaRegSmile className="text-lg text-blue-600" />
                  </div>
                  <span className="text-gray-700">
                    Đậu xe dễ dàng, không căng thẳng với hướng dẫn chi tiết
                  </span>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Link
                  href="#map"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors duration-300 group/btn"
                >
                  Tìm chỗ đậu xe
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </AnimatedItem>

          {/* For Parking Owners */}
          <AnimatedItem variants={cardVariants}>
            <motion.div 
              whileHover={{ y: -5 }}
              className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-400"></div>
              
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-cyan-100 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaMoneyCheckAlt className="text-2xl text-cyan-600" />
              </div>
              
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                Dành Cho Chủ Bãi Đậu Xe
              </h3>
              
              <div className="flex flex-col gap-6 mb-8 text-left">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center mt-1">
                    <FaPlusCircle className="text-lg text-cyan-600" />
                  </div>
                  <span className="text-gray-700">
                    Đăng ký các chỗ đậu xe của bạn chỉ trong vài phút
                  </span>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center mt-1">
                    <div className="w-5 h-5 rounded-full bg-cyan-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">Q</span>
                    </div>
                  </div>
                  <span className="text-gray-700">
                    Quản lý đặt chỗ và thu nhập dễ dàng với bảng điều khiển trực quan
                  </span>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center mt-1">
                    <FaRegSmile className="text-lg text-cyan-600" />
                  </div>
                  <span className="text-gray-700">
                    Thu hút nhiều khách hàng hơn và tối ưu hóa doanh thu
                  </span>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Link
                  href="#promotion"
                  className="inline-flex items-center justify-center gap-2 bg-cyan-600 text-white px-6 py-3 rounded-full font-medium hover:bg-cyan-700 transition-colors duration-300 group/btn"
                >
                  Tham gia ngay
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </AnimatedItem>
        </AnimatedSection>
      </div>
    </section>
  );
}