"use client";
import { useState, useEffect } from "react";
import { ArrowUp, ChevronRight, Car, MapPin, Calendar, QrCode, Play, Pause } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

const steps = [
  {
    title: "Đăng ký xe",
    number: 1,
    image: "/bienso.png", 
    short: "Thêm phương tiện vào hệ thống",
    detail: "Đăng ký xe bằng cách nhập biển số, loại xe và thông tin liên quan. Bạn có thể quản lý nhiều xe trong tài khoản.",
    badge: "Biển số: 51A-12345",
    icon: Car,
    color: "from-blue-500 to-cyan-400"
  },
  {
    title: "Tìm kiếm bãi đỗ xe",
    number: 2,
    image: "/bg.jpg",
    short: "Tìm bãi đỗ gần bạn",
    detail: "Sử dụng bản đồ hoặc chức năng tìm kiếm để chọn bãi đỗ xe phù hợp vị trí, giá cả và thời gian mong muốn.",
    badge: "Bãi A, Bãi B, ...",
    icon: MapPin,
    color: "from-cyan-500 to-blue-400"
  },
  {
    title: "Đặt chỗ",
    number: 3,
    image: "/book.png",
    short: "Chọn thời gian đặt chỗ",
    detail: "Chọn thời gian đỗ xe, xác nhận thông tin và đặt chỗ. Bạn sẽ nhận được xác nhận đặt chỗ qua app hoặc email.",
    badge: "Đặt chỗ thành công",
    icon: Calendar,
    color: "from-blue-600 to-cyan-500"
  },
  {
    title: "Checkin tại bãi",
    number: 4,
    image: "/checkin.png",
    short: "Quét mã checkin",
    detail: "Khi đến bãi đỗ, sử dụng app để quét mã QR hoặc xác nhận checkin với bảo vệ để bắt đầu thời gian đỗ xe.",
    badge: "Checkin QR",
    icon: QrCode,
    color: "from-cyan-600 to-blue-500"
  }
];

// Animation variants với easing mượt mà hơn
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.3
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
};

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
}

function AnimatedSection({ children, className = "" }: AnimatedSectionProps) {
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

interface AnimatedItemProps {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
}

function AnimatedItem({ children, variants = itemVariants, className = "" }: AnimatedItemProps) {
  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
}

export default function HowItWorkUserSection() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const scrollToTop = () => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Auto rotate through steps với hiệu ứng mượt mà hơn
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoPlay) {
      interval = setInterval(() => {
        setIsTransitioning(true);
        
        // Hiệu ứng chuyển tiếp mượt mà
        setTimeout(() => {
          setActiveStep(prev => (prev === steps.length - 1 ? 0 : prev + 1));
          setIsTransitioning(false);
        }, 500); // Thời gian chờ để hiệu ứng hoàn thành
      }, 4000); // Tăng thời gian mỗi bước lên 4 giây
    }
    
    return () => clearInterval(interval);
  }, [autoPlay]);

  const handleStepClick = (index: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveStep(index);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <section className="relative py-20 px-6 bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden" id="how">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy533My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj4KICA8ZyBmaWxsPSJub25lIiBzdHJva2U9IiMxNzkwZTYiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMiI+CiAgICA8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxNSIgLz4KICAgIDxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjI1IiAvPgogIDwvZz4KPC9zdmc+')] opacity-30"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-float-slow"></div>
      <div className="absolute top-40 right-15 w-16 h-16 bg-cyan-300 rounded-full opacity-20 animate-float-slow delay-1500"></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-blue-400 rounded-full opacity-20 animate-float-slow delay-3000"></div>

      <div className="container mx-auto relative z-10">
        <AnimatedSection className="text-center mb-16">
          <AnimatedItem className="mb-2 flex items-center justify-center gap-2 text-blue-600 font-medium">
            <div className="w-6 h-px bg-blue-600"></div>
            <span>HÀNH TRÌNH ĐỖ XE THÔNG MINH</span>
            <div className="w-6 h-px bg-blue-600"></div>
          </AnimatedItem>
          
          <AnimatedItem>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Khám phá <span className="text-blue-600">4 bước đơn giản</span>
            </h2>
          </AnimatedItem>
          
          <AnimatedItem>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              Trải nghiệm đỗ xe không còn là nỗi lo với GoPark. Từ đăng ký xe đến checkin tại bãi đỗ, 
              mọi thứ đều trở nên dễ dàng và thú vị
            </p>
          </AnimatedItem>

          {/* Auto-play control */}
          <AnimatedItem className="flex justify-center items-center gap-3">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors duration-300"
              disabled={isTransitioning}
            >
              {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {autoPlay ? "Tạm dừng" : "Tự động chạy"}
            </button>
          </AnimatedItem>
          <AnimatedItem className="mt-6">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              <ArrowUp className="w-4 h-4" />
              Quay lại đầu trang
            </button>
          </AnimatedItem>
        </AnimatedSection>

        {/* Interactive Journey Map */}
        <div className="relative max-w-6xl mx-auto mb-16">
          {/* Progress Bar với animation mượt hơn */}
          <div className="relative h-2 bg-gray-200 rounded-full mb-12 mx-8">
            <motion.div
              className="absolute h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
              animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            {/* Step Indicators */}
            {steps.map((step, index) => (
              <motion.button
                key={step.number}
                onClick={() => handleStepClick(index)}
                className={`absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeStep === index
                    ? "bg-blue-600 text-white"
                    : activeStep > index
                    ? "bg-blue-500 text-white"
                    : "bg-white border-2 border-gray-300 text-gray-400"
                }`}
                style={{ left: `${(index / (steps.length - 1)) * 100}%` }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                disabled={isTransitioning}
              >
                {index + 1}
              </motion.button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Visual Display với transition mượt hơn */}
            <AnimatedItem className="lg:sticky lg:top-24">
              <motion.div
                className="relative h-96 rounded-2xl overflow-hidden shadow-xl bg-blue-100"
              >
                {steps.map((step, index) => (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ 
                      opacity: activeStep === index ? 1 : 0,
                      scale: activeStep === index ? 1 : 0.95
                    }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <div 
                      className="w-full h-full bg-cover bg-center"
                      style={{
                        backgroundImage: step.image ? `url(${step.image})` : 'none',
                        backgroundColor: step.image ? 'transparent' : '#e0f2fe'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                      <p className="text-blue-100">{step.badge}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatedItem>

            {/* Step Content với animation mượt hơn */}
            <AnimatedItem>
              <div className="space-y-6">
                {steps.map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <motion.div
                      key={step.number}
                      initial={{ opacity: 0.5, x: 20, scale: 0.98 }}
                      animate={{ 
                        opacity: activeStep === index ? 1 : 0.6,
                        x: activeStep === index ? 0 : 20,
                        scale: activeStep === index ? 1 : 0.98
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                        activeStep === index
                          ? "bg-white border-blue-500 shadow-lg"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                      onClick={() => handleStepClick(index)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start gap-4">
                        <motion.div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center flex-shrink-0`}
                          animate={{ 
                            scale: activeStep === index ? 1.1 : 1
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <IconComponent className="w-6 h-6 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="text-gray-600 text-sm"
                          >
                            {activeStep === index ? step.detail : step.short}
                          </motion.p>
                          {activeStep === index && (
                            <motion.span
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="inline-block mt-3 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                            >
                              {step.badge}
                            </motion.span>
                          )}
                        </div>
                        <motion.div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            activeStep === index
                              ? "bg-blue-500 border-blue-500 text-white"
                              : "border-gray-300"
                          }`}
                          animate={{ 
                            scale: activeStep === index ? 1.2 : 1
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          {index + 1}
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatedItem>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}