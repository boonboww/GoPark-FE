"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Play, Users, Clock, Star, Calendar, X, MapPin, Car, CreditCard, Smartphone } from "lucide-react";
import { useState } from "react";

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
      ease: "easeOut" as const
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
  variants?: any;
  className?: string;
}

function AnimatedItem({ children, variants = itemVariants, className = "" }: AnimatedItemProps) {
  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
}

export default function VideoSection() {
  const videoId = "-reZoBtwg8M";
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoStats = [
    { icon: <Users className="w-5 h-5" />, label: "Lượt xem", value: "50K+" },
    { icon: <Star className="w-5 h-5" />, label: "Đánh giá", value: "4.8/5" },
    { icon: <Clock className="w-5 h-5" />, label: "Thời lượng", value: "3:15" },
    { icon: <Calendar className="w-5 h-5" />, label: "Đăng tải", value: "2024" }
  ];

  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Định vị thông minh",
      description: "Tìm bãi đỗ gần bạn nhất với công nghệ GPS chính xác"
    },
    {
      icon: <Car className="w-6 h-6" />,
      title: "Đặt chỗ nhanh chóng",
      description: "Giữ chỗ trước chỉ với vài thao tác đơn giản"
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Thanh toán an toàn",
      description: "Hệ thống bảo mật đa lớp, hỗ trợ nhiều phương thức"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Ứng dụng di động",
      description: "Trải nghiệm mượt mà với Website"
    }
  ];

  const openVideo = () => setIsVideoOpen(true);
  const closeVideo = () => setIsVideoOpen(false);

  return (
    <section className="relative py-20 px-6 bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden">
      {/* Background pattern với vân mờ */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj4KICA8ZyBmaWxsPSJub25lIiBzdHJva2U9IiMxNzkwZTYiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMiI+CiAgICA8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxNSIgLz4KICAgIDxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjI1IiAvPgogIDwvZz4KPC9zdmc+')] opacity-30"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-float"></div>
      <div className="absolute top-40 right-15 w-16 h-16 bg-cyan-300 rounded-full opacity-20 animate-float delay-1000"></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-blue-400 rounded-full opacity-20 animate-float delay-2000"></div>

      {/* Video Modal */}
      {isVideoOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeVideo}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideo}
              className="absolute top-4 right-4 z-10 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="Giới thiệu GoPark - Hệ thống đỗ xe thông minh"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="container mx-auto relative z-10">
        <AnimatedSection>
          <AnimatedItem className="mb-2 flex items-center justify-center gap-2 text-blue-600 font-medium">
            <div className="w-6 h-px bg-blue-600"></div>
            <span>GIỚI THIỆU VIDEO</span>
            <div className="w-6 h-px bg-blue-600"></div>
          </AnimatedItem>
          
          <AnimatedItem>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 text-center">
              Khám phá <span className="text-blue-600">GoPark</span> qua video
            </h2>
          </AnimatedItem>
          
          <AnimatedItem>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed text-center">
              GoPark - Giải pháp đỗ xe thông minh hàng đầu Việt Nam, kết nối hàng nghìn bãi đỗ xe 
              và mang lại trải nghiệm đỗ xe dễ dàng, tiện lợi cho mọi tài xế
            </p>
          </AnimatedItem>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
          {/* Video Player */}
          <AnimatedSection className="lg:col-span-1">
            <AnimatedItem>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group cursor-pointer"
                onClick={openVideo}
              >
                {/* Video thumbnail with play button overlay */}
                <div className="relative aspect-video">
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt="Video giới thiệu GoPark - Hệ thống đỗ xe thông minh"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity group-hover:bg-black/40">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Play className="w-8 h-8 text-white ml-1" />
                    </motion.div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Play className="w-6 h-6 text-blue-600 ml-1" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">GoPark Introduction</h3>
                      <p className="text-sm text-gray-600">Hướng dẫn sử dụng toàn diện</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {videoStats.map((stat, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="text-blue-600">{stat.icon}</div>
                        <div>
                          <div className="font-semibold text-gray-900">{stat.value}</div>
                          <div className="text-gray-600">{stat.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatedItem>
          </AnimatedSection>

          {/* Content */}
          <AnimatedSection className="lg:col-span-1">
            <AnimatedItem>
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900">
                  GoPark - Đỗ xe thông minh, Cuộc sống thông minh
                </h3>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  GoPark là nền tảng kết nối tài xế với các bãi đỗ xe thông minh trên toàn quốc. 
                  Với công nghệ hiện đại và giao diện thân thiện, chúng tôi mang đến giải pháp 
                  đỗ xe tối ưu cho người dân Việt Nam.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <div className="text-blue-600">
                          {feature.icon}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{feature.title}</h4>
                        <p className="text-gray-600 text-xs">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-blue-100 rounded-xl p-4 mt-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Video hướng dẫn bao gồm:</h4>
                  <ul className="text-blue-700 text-sm space-y-1 list-disc list-inside">
                    <li>Cách đăng ký tài khoản và thêm phương tiện</li>
                    <li>Hướng dẫn tìm kiếm và đặt chỗ bãi đỗ</li>
                    <li>Quy trình thanh toán và nhận vé điện tử</li>
                    <li>Cách sử dụng tính năng định vị thông minh</li>
                  </ul>
                </div>

              </div>
            </AnimatedItem>
          </AnimatedSection>
        </div>

     
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}