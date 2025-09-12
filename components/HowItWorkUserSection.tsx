"use client";
import { useState } from "react";
import { ArrowUp, ChevronRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const steps = [
  {
    title: "Đăng ký xe",
    number: 1,
    image: "/bienso.png", 
    short: "Thêm phương tiện của bạn vào hệ thống.",
    detail: "Đăng ký xe bằng cách nhập biển số, loại xe và thông tin liên quan. Bạn có thể quản lý nhiều xe trong tài khoản.",
    badge: "Biển số: 51A-12345",
  },
  {
    title: "Tìm kiếm bãi đỗ xe",
    number: 2,
    image: "/bg.jpg",
    short: "Tìm bãi đỗ xe gần bạn hoặc theo nhu cầu.",
    detail: "Sử dụng bản đồ hoặc chức năng tìm kiếm để chọn bãi đỗ xe phù hợp vị trí, giá cả và thời gian mong muốn.",
    badge: "Bãi A, Bãi B, ...",
  },
  {
    title: "Đặt chỗ",
    number: 3,
    image: "/",
    short: "Chọn thời gian và đặt chỗ trước.",
    detail: "Chọn thời gian đỗ xe, xác nhận thông tin và đặt chỗ. Bạn sẽ nhận được xác nhận đặt chỗ qua app hoặc email.",
    badge: "Đặt chỗ thành công",
  },
  {
    title: "Checkin tại bãi",
    number: 4,
    image: "/",
    short: "Đến bãi, quét mã hoặc xác nhận checkin.",
    detail: "Khi đến bãi đỗ, sử dụng app để quét mã QR hoặc xác nhận checkin với bảo vệ để bắt đầu thời gian đỗ xe.",
    badge: "Checkin QR",
  },
];

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
      ease: "easeOut" as const
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
      ease: "easeOut" as const
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

export default function HowItWorkUserSection() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const scrollToTop = () => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative w-full py-16 md:py-24 bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden" id="how">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj4KICA8ZyBmaWxsPSJub25lIiBzdHJva2U9IiMxNzkwZTYiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMiI+CiAgICA8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxNSIgLz4KICAgIDxjaXJjbLUgY3g9IjMwIiBjeT0iMzAiIHI9IjI1IiAvPgogIDwvZz4KPC9zdmc+')] opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Left content - CỐ ĐỊNH và không bị ảnh hưởng bởi hover */}
          <div className="lg:w-2/5 lg:sticky lg:top-24 lg:self-start flex-shrink-0">
            <AnimatedSection>
              <AnimatedItem className="mb-2 flex items-center gap-2 text-blue-600 font-medium">
                <div className="w-6 h-px bg-blue-600"></div>
                <span>HƯỚNG DẪN SỬ DỤNG</span>
              </AnimatedItem>
              
              <AnimatedItem>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                  Trải nghiệm đỗ xe <span className="text-blue-600">thông minh</span>
                </h2>
              </AnimatedItem>
              
              <AnimatedItem>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  GoPark giúp bạn chủ động tìm và đặt chỗ đỗ xe mọi lúc, mọi nơi. 
                  Đặt chỗ nhanh chóng, thanh toán tiện lợi, an tâm đỗ xe với vài bước đơn giản.
                </p>
              </AnimatedItem>
              
              <AnimatedItem>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={scrollToTop}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 transition-colors duration-300 group"
                  >
                    <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                    Lên đầu trang
                  </button>
                  
                  <a
                    href="#app-download"
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-colors duration-300 group"
                  >
                    Tải ứng dụng
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </AnimatedItem>
            </AnimatedSection>
          </div>

          {/* Steps - Phần bên phải có thể thay đổi khi hover */}
          <div className="lg:w-3/5">
            <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 gap-5 min-h-[520px]">
              {steps.map((step, idx) => (
                <AnimatedItem key={step.number} variants={cardVariants}>
                  <motion.div
                    onMouseEnter={() => setActiveStep(idx)}
                    onMouseLeave={() => setActiveStep(null)}
                    layout
                    whileHover={{
                      y: -8,
                      width: '105%',
                      height: '340px',
                      zIndex: 2,
                      boxShadow: "0 8px 32px 0 rgba(32,124,229,0.15)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`relative p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden min-h-[260px] md:min-h-[300px] flex flex-col justify-between
                      ${activeStep === idx ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}
                    style={{ minWidth: 0 }}
                  >
                    {/* Step number */}
                    <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-700 font-bold text-lg">{step.number}</span>
                    </div>
                    
                    {/* Icon/Image */}
                    <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-5">
                      {step.image ? (
                        <img
                          src={step.image}
                          alt={step.title}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <CheckCircle className="w-8 h-8 text-blue-600" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                    
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                        {step.badge}
                      </span>
                    </div>
                    
                    <motion.p 
                      initial={{ opacity: 0.8 }}
                      animate={{ opacity: activeStep === idx ? 1 : 0.8 }}
                      className="text-gray-600 transition-all duration-300 min-h-[48px]"
                    >
                      {activeStep === idx ? step.detail : step.short}
                    </motion.p>
                    
                    {/* Hover effect line */}
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: activeStep === idx ? "100%" : 0 }}
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
                    ></motion.div>
                  </motion.div>
                </AnimatedItem>
              ))}
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}