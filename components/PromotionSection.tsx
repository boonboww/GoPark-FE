"use client";

import { FaArrowRight, FaChartLine, FaUsers, FaShieldAlt, FaCoins } from "react-icons/fa";
import { motion, easeOut } from "framer-motion";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";

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

export default function PromotionSection() {
  const router = useRouter();

  const benefits = [
    {
      icon: <FaChartLine className="text-2xl" />,
      title: "Tăng doanh thu",
      description: "Tối ưu hóa tỷ lệ lấp đầy bãi đỗ và tăng doanh thu lên đến 40%"
    },
    {
      icon: <FaUsers className="text-2xl" />,
      title: "Tiếp cận khách hàng",
      description: "Kết nối với hàng nghìn tài xế đang tìm chỗ đỗ mỗi ngày"
    },
    {
      icon: <FaShieldAlt className="text-2xl" />,
      title: "Bảo mật tuyệt đối",
      description: "Hệ thống thanh toán an toàn và bảo mật thông tin kinh doanh"
    },
    {
      icon: <FaCoins className="text-2xl" />,
      title: "Chi phí hợp lý",
      description: "Chiết khấu ưu đãi chỉ từ 5% và không phí ẩn"
    }
  ];

  return (
    <section className="relative py-20 px-6 text-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj4KICA8ZyBmaWxsPSJub25lIiBzdHJva2U9IiMxNzkwZTYiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMiI+CiAgICA8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxNSIgLz4KICAgIDxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjI1IiAvPgogIDwvZz4KPC9zdmc+')] opacity-30"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-float"></div>
      <div className="absolute top-40 right-15 w-16 h-16 bg-cyan-300 rounded-full opacity-20 animate-float delay-1000"></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-blue-400 rounded-full opacity-20 animate-float delay-2000"></div>

      <div className="container mx-auto relative z-10">
        <AnimatedSection className="mb-16">
          <AnimatedItem className="mb-2 flex items-center justify-center gap-2 text-blue-600 font-medium">
            <div className="w-6 h-px bg-blue-600"></div>
            <span>ĐỐI TÁC KINH DOANH</span>
            <div className="w-6 h-px bg-blue-600"></div>
          </AnimatedItem>
          
          <AnimatedItem>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              <span className="text-blue-600">Mở rộng kinh doanh</span> cùng GoPark
            </h2>
          </AnimatedItem>
          
          <AnimatedItem>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              Biến không gian đỗ xe của bạn thành nguồn thu nhập ổn định và gia nhập mạng lưới bãi đỗ uy tín hàng đầu Việt Nam
            </p>
          </AnimatedItem>
        </AnimatedSection>

        {/* Interactive tooltip */}
        <AnimatedSection className="mb-16">
          <AnimatedItem>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-8 rounded-2xl shadow-2xl max-w-2xl mx-auto"
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-600 rotate-45"></div>
              <p className="text-xl font-medium mb-2">Bạn là chủ bãi đỗ xe?</p>
              <p className="text-blue-100">
                Khai thác tối đa tiềm năng kinh doanh và tiếp cận hàng nghìn khách hàng tiềm năng
              </p>
            </motion.div>
          </AnimatedItem>
        </AnimatedSection>

        {/* Benefits grid */}
        <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
          {benefits.map((benefit, index) => (
            <AnimatedItem key={index}>
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-full"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </motion.div>
            </AnimatedItem>
          ))}
        </AnimatedSection>

        {/* Stats section */}
        <AnimatedSection className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
          <AnimatedItem className="text-center p-6 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              <CountUp end={2000} duration={2} separator="," />+
            </div>
            <div className="text-gray-600">Đối tác</div>
          </AnimatedItem>
          
          <AnimatedItem className="text-center p-6 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              <CountUp end={40} duration={2} />%
            </div>
            <div className="text-gray-600">Tăng doanh thu</div>
          </AnimatedItem>
          
          <AnimatedItem className="text-center p-6 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              <CountUp end={24} duration={2} />/7
            </div>
            <div className="text-gray-600">Hỗ trợ</div>
          </AnimatedItem>
          
          <AnimatedItem className="text-center p-6 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              <CountUp end={5} duration={2} />%
            </div>
            <div className="text-gray-600">Chiết khấu</div>
          </AnimatedItem>
        </AnimatedSection>

        {/* Satellite image with animation */}
        <AnimatedSection className="mb-12">
          <AnimatedItem>
            <motion.div
              whileHover={{ rotate: 5 }}
              className="relative inline-block"
            >
              <img
                src="https://en.parkopedia.co.uk/public/images/satellite.png"
                alt="Vệ tinh kết nối"
                className="w-40 h-auto drop-shadow-2xl"
              />
              {/* Signal waves */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="absolute w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
                <div className="absolute w-20 h-20 border-2 border-blue-300 rounded-full opacity-0 animate-radar"></div>
                <div className="absolute w-40 h-40 border-2 border-blue-200 rounded-full opacity-0 animate-radar delay-1000"></div>
              </div>
            </motion.div>
          </AnimatedItem>
        </AnimatedSection>

        {/* CTA Button */}
        <AnimatedItem>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/business")}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Đăng ký đối tác ngay</span>
            <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
            
            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700">
              <div className="w-8 h-full bg-white/20"></div>
            </div>
          </motion.button>
        </AnimatedItem>

        {/* Additional info */}
        <AnimatedItem className="mt-8">
          <p className="text-gray-600 text-sm">
            Quy trình đăng ký đơn giản • Hỗ trợ thiết lập miễn phí • Không ràng buộc hợp đồng dài hạn
          </p>
        </AnimatedItem>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes radar {
          0% { transform: scale(0.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-radar {
          animation: radar 2s ease-out infinite;
        }
      `}</style>
    </section>
  );
}