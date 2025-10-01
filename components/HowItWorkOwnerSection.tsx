"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, easeOut } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ChevronRight, Building2, DollarSign, ParkingCircle, UserCheck } from "lucide-react";

const steps = [
  {
    title: "Đăng ký tài khoản Owner",
    detail: "Tạo tài khoản chủ bãi đỗ xe để bắt đầu quản lý và khai thác bãi đỗ trên hệ thống GoPark. Nhận quyền truy cập vào các tính năng quản lý chuyên nghiệp.",
    badge: "Bước 1",
    icon: UserCheck,
  },
  {
    title: "Tạo bãi đỗ",
    detail: "Thêm thông tin bãi đỗ xe của bạn: tên, địa chỉ, số lượng chỗ, giá cả... Bãi đỗ sẽ được duyệt và hiển thị cho khách hàng tìm kiếm.",
    badge: "Bước 2",
    icon: ParkingCircle,
  },
  {
    title: "Quản lý bãi đỗ",
    detail: "Theo dõi tình trạng chỗ trống, kiểm soát lượt xe ra vào, cập nhật thông tin bãi đỗ, tối ưu hiệu suất kinh doanh mọi lúc mọi nơi.",
    badge: "Bước 3",
    icon: Building2,
  },
  {
    title: "Quản lý giao dịch",
    detail: "Xem lịch sử giao dịch, doanh thu, xuất hóa đơn, quản lý thanh toán và các hoạt động tài chính liên quan đến bãi đỗ xe.",
    badge: "Bước 4",
    icon: DollarSign,
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

export default function HowItWorkOwnerSection() {
  const [active, setActive] = useState(0);
  const router = useRouter();

  return (
    <section className="relative w-full py-16 md:py-24 bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj4KICA8ZyBmaWxsPSJub25lIiBzdHJva2U9IiMxNzkwZTYiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMiI+CiAgICA8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxNSIgLz4KICAgIDxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjI1IiAvPgogIDwvZz4KPC9zdmc+')] opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <AnimatedItem className="mb-2 flex items-center justify-center gap-2 text-blue-600 font-medium">
            <div className="w-6 h-px bg-blue-600"></div>
            <span>DÀNH CHO CHỦ BÃI ĐỖ</span>
            <div className="w-6 h-px bg-blue-600"></div>
          </AnimatedItem>
          
          <AnimatedItem>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Trở thành đối tác của <span className="text-blue-600">GoPark</span>
            </h2>
          </AnimatedItem>
          
          <AnimatedItem>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              Khai thác tối đa tiềm năng bãi đỗ xe của bạn với hệ thống quản lý thông minh và kết nối với hàng nghìn tài xế mỗi ngày
            </p>
          </AnimatedItem>
        </AnimatedSection>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Bên trái: các bước */}
          <AnimatedSection className="lg:w-2/5">
            <div className="flex flex-col gap-4">
              {steps.map((step, idx) => {
                const IconComponent = step.icon;
                return (
                  <AnimatedItem key={idx} variants={itemVariants}>
                    <motion.button
                      whileHover={{ x: 5 }}
                      onClick={() => setActive(idx)}
                      className={`group flex items-center gap-4 w-full p-5 rounded-2xl border transition-all duration-300 shadow-md
                        ${active === idx 
                          ? "bg-gradient-to-r from-blue-600 to-cyan-500 border-blue-500 text-white shadow-lg" 
                          : "bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-200"}`}
                      type="button"
                    >
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                        ${active === idx ? "bg-white/20" : "bg-blue-100"}`}>
                        <IconComponent className={`w-6 h-6 ${active === idx ? "text-white" : "text-blue-600"}`} />
                      </div>
                      <div className="text-left">
                        <span className={`block text-sm font-medium mb-1 ${active === idx ? "text-blue-100" : "text-blue-600"}`}>
                          {step.badge}
                        </span>
                        <span className={`font-semibold ${active === idx ? "text-white" : "text-gray-900"}`}>
                          {step.title}
                        </span>
                      </div>
                    </motion.button>
                  </AnimatedItem>
                );
              })}
            </div>
          </AnimatedSection>

          {/* Bên phải: nội dung chi tiết */}
          <AnimatedSection className="lg:w-3/5">
            <motion.div 
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 overflow-hidden"
            >
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-5 rounded-full -translate-y-16 translate-x-16"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    {(() => {
                      const IconComponent = steps[active].icon;
                      return <IconComponent className="w-6 h-6 text-blue-600" />;
                    })()}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{steps[active].title}</h3>
                </div>
                
                <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                  {steps[active].detail}
                </p>
                
                <div className="bg-blue-50 rounded-xl p-4 mb-8">
                  <h4 className="font-semibold text-blue-800 mb-2">Lợi ích khi tham gia:</h4>
                  <ul className="text-blue-700 list-disc list-inside space-y-1">
                    <li>Tăng tỷ lệ lấp đầy bãi đỗ lên đến 80%</li>
                    <li>Quản lý từ xa mọi lúc, mọi nơi</li>
                    <li>Hệ thống thanh toán tự động, minh bạch</li>
                    <li>Hỗ trợ kỹ thuật 24/7</li>
                  </ul>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/account/createOwner')}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors duration-300 group/btn"
                >
                  Đăng ký trở thành đối tác
                  <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>

        {/* Stats section */}
        <AnimatedSection className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <AnimatedItem className="text-center p-6 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">80%</div>
            <div className="text-gray-600">Tỷ lệ lấp đầy bãi đỗ</div>
          </AnimatedItem>
          
          <AnimatedItem className="text-center p-6 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">2,000+</div>
            <div className="text-gray-600">Chủ bãi đỗ tin dùng</div>
          </AnimatedItem>
          
          <AnimatedItem className="text-center p-6 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">30%</div>
            <div className="text-gray-600">Tăng doanh thu trung bình</div>
          </AnimatedItem>
          
          <AnimatedItem className="text-center p-6 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600">Hỗ trợ kỹ thuật</div>
          </AnimatedItem>
        </AnimatedSection>
      </div>
    </section>
  );
}