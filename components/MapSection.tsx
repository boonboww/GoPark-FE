"use client";

import CountUp from "react-countup";
import { FaMapMarkedAlt, FaCity, FaParking, FaSearch } from "react-icons/fa";
import { motion, easeOut } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ChevronRight } from "lucide-react";

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
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
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

export default function MapSection() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative py-20 px-6 text-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj4KICA8ZyBmaWxsPSJub25lIiBzdHJva2U9IiMxNzkwZTYiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMiI+CiAgICA8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxNSIgLz4KICAgIDxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjI1IiAvPgogIDwvZz4KPC9zdmc+')] opacity-30"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

      <div className="container mx-auto relative z-10">
        <AnimatedSection className="mb-16">
          <AnimatedItem className="mb-2 flex items-center justify-center gap-2 text-blue-600 font-medium">
            <div className="w-6 h-px bg-blue-600"></div>
            <span>MẠNG LƯỚI ĐẬU XE</span>
            <div className="w-6 h-px bg-blue-600"></div>
          </AnimatedItem>
          
          <AnimatedItem>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Hệ thống bãi đỗ xe <span className="text-blue-600">toàn quốc</span>
            </h2>
          </AnimatedItem>
          
          <AnimatedItem>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              Chúng tôi kết nối hàng nghìn chỗ đậu xe an toàn trên khắp Việt Nam, mang lại sự tiện lợi và công nghệ gần gũi hơn với tài xế mỗi ngày.
            </p>
          </AnimatedItem>
        </AnimatedSection>

        {/* Map Image */}
        <AnimatedSection className="mb-16">
          <AnimatedItem>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative w-full max-w-4xl mx-auto rounded-2xl shadow-2xl overflow-hidden border-4 border-white group"
            >
              <img
                src="https://en.parkopedia.co.uk/public/images/map-with-markers.png"
                alt="Bản đồ hệ thống bãi đỗ xe GoPark trên toàn quốc"
                className="w-full h-auto transform transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Map overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Floating search button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-6 right-6 flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-full font-medium shadow-lg hover:bg-blue-700 transition-colors duration-300"
              >
                <FaSearch className="w-4 h-4" />
                Tìm bãi đỗ
              </motion.button>
            </motion.div>
          </AnimatedItem>
        </AnimatedSection>

        {/* Statistics */}
        <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <AnimatedItem>
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <FaMapMarkedAlt className="text-2xl text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                <CountUp end={23} duration={2} />
              </div>
              <div className="text-gray-700 font-medium">Tỉnh Thành</div>
            </motion.div>
          </AnimatedItem>

          <AnimatedItem>
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center mb-4">
                <FaCity className="text-2xl text-cyan-600" />
              </div>
              <div className="text-4xl font-bold text-cyan-600 mb-2">
                <CountUp end={65} duration={2.5} />
              </div>
              <div className="text-gray-700 font-medium">Thành Phố</div>
            </motion.div>
          </AnimatedItem>

          <AnimatedItem>
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <FaParking className="text-2xl text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                <CountUp start={5000} end={50200} duration={4} separator="," />
              </div>
              <div className="text-gray-700 font-medium">Chỗ Đậu Xe</div>
            </motion.div>
          </AnimatedItem>
        </AnimatedSection>

        {/* Features */}
        <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          <AnimatedItem>
            <div className="text-center p-5 bg-white rounded-2xl shadow-md border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">24/7</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Hoạt động liên tục</h3>
              <p className="text-gray-600 text-sm">Hỗ trợ đặt chỗ mọi lúc, mọi nơi</p>
            </div>
          </AnimatedItem>

          <AnimatedItem>
            <div className="text-center p-5 bg-white rounded-2xl shadow-md border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Xác thực an toàn</h3>
              <p className="text-gray-600 text-sm">Bãi đỗ kiểm duyệt chất lượng</p>
            </div>
          </AnimatedItem>

          <AnimatedItem>
            <div className="text-center p-5 bg-white rounded-2xl shadow-md border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">₫</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Giá cả minh bạch</h3>
              <p className="text-gray-600 text-sm">Không phát sinh chi phí ẩn</p>
            </div>
          </AnimatedItem>

          <AnimatedItem>
            <div className="text-center p-5 bg-white rounded-2xl shadow-md border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">⏱</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Tiết kiệm thời gian</h3>
              <p className="text-gray-600 text-sm">Đặt chỗ nhanh trong 30 giây</p>
            </div>
          </AnimatedItem>
        </AnimatedSection>

        {/* CTA Button */}
        <AnimatedItem>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:bg-blue-700 transition-colors duration-300 group/btn"
          >
            Khám phá bản đồ
            <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
          </motion.button>
        </AnimatedItem>
      </div>
    </section>
  );
}