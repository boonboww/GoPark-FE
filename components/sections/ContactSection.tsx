"use client";

import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane, FaHeadset } from "react-icons/fa";
import { motion, easeOut } from "framer-motion";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useInView } from "react-intersection-observer";

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

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = {
      access_key: "b19fe6de-12a8-4d61-b749-e617b5b2b5cd",
      name: formData.name,
      email: formData.email,
      message: formData.message,
    };

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Tin nhắn đã được gửi thành công!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error("Gửi tin nhắn thất bại. Vui lòng thử lại.");
      }
    } catch {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: <FaEnvelope className="text-2xl" />,
      title: "Email",
      value: "info@gopark.vn",
      description: "Chúng tôi sẽ phản hồi trong vòng 24h",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <FaPhoneAlt className="text-2xl" />,
      title: "Điện thoại",
      value: "+84 123 456 789",
      description: "Thứ 2 - Thứ 6, 8:00 - 18:00",
      color: "bg-cyan-100 text-cyan-600"
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl" />,
      title: "Văn phòng",
      value: "Hà Nội, Việt Nam",
      description: "Đến thăm chúng tôi tại văn phòng",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <FaHeadset className="text-2xl" />,
      title: "Hỗ trợ",
      value: "support@gopark.vn",
      description: "Hỗ trợ kỹ thuật 24/7",
      color: "bg-cyan-100 text-cyan-600"
    }
  ];

  return (
    <section className="relative py-20 px-6 bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj4KICA8ZyBmaWxsPSJub25lIiBzdHJva2U9IiMxNzkwZTYiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMiI+CiAgICA8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxNSIgLz4KICAgIDxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjI1IiAvPgogIDwvZz4KPC9zdmc+')] opacity-30"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-float"></div>
      <div className="absolute top-40 right-15 w-16 h-16 bg-cyan-300 rounded-full opacity-20 animate-float delay-1000"></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-blue-400 rounded-full opacity-20 animate-float delay-2000"></div>

      <div className="container mx-auto relative z-10">
        <AnimatedSection className="text-center mb-16">
          <AnimatedItem className="mb-2 flex items-center justify-center gap-2 text-blue-600 font-medium">
            <div className="w-6 h-px bg-blue-600"></div>
            <span>LIÊN HỆ</span>
            <div className="w-6 h-px bg-blue-600"></div>
          </AnimatedItem>
          
          <AnimatedItem>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Kết nối với <span className="text-blue-600">GoPark</span>
            </h2>
          </AnimatedItem>
          
          <AnimatedItem>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi để được tư vấn và giải đáp mọi thắc mắc.
            </p>
          </AnimatedItem>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <AnimatedSection className="space-y-8">
            {contactMethods.map((method, index) => (
              <AnimatedItem key={index}>
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-6 p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
                >
                  <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${method.color}`}>
                    {method.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{method.title}</h3>
                    <p className="text-gray-700 font-medium mb-1">{method.value}</p>
                    <p className="text-gray-600 text-sm">{method.description}</p>
                  </div>
                </motion.div>
              </AnimatedItem>
            ))}

            {/* Additional info */}
            <AnimatedItem>
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-2">Thời gian làm việc</h3>
                <p className="text-blue-700">Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                <p className="text-blue-700">Thứ 7: 8:00 - 12:00</p>
                <p className="text-blue-700 text-sm mt-2">Hỗ trợ kỹ thuật khẩn cấp: 24/7</p>
              </div>
            </AnimatedItem>
          </AnimatedSection>

          {/* Contact Form */}
          <AnimatedSection>
            <AnimatedItem>
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Gửi tin nhắn cho chúng tôi</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nhập họ và tên của bạn"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Nhập địa chỉ email của bạn"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Tin nhắn *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Nhập tin nhắn của bạn..."
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 px-6 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        Gửi tin nhắn
                        <FaPaperPlane className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </form>

                <p className="text-gray-500 text-sm mt-4">
                  * Thông tin bắt buộc. Chúng tôi cam kết bảo mật thông tin của bạn.
                </p>
              </motion.div>
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