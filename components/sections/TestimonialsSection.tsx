"use client";

import { FaQuoteLeft } from "react-icons/fa";
import { motion, easeOut } from "framer-motion";
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

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      content: "Việc tìm chỗ đỗ xe chưa bao giờ dễ dàng đến thế! Tôi có thể đặt chỗ trực tuyến và tiết kiệm rất nhiều thời gian. Ứng dụng thân thiện và dễ sử dụng.",
      author: "Trần Minh",
      location: "Hà Nội",
      role: "Tài xế",
      rating: 5
    },
    {
      id: 2,
      content: "Tôi kiếm thêm thu nhập bằng cách chia sẻ chỗ đỗ xe không sử dụng. Đội ngũ hỗ trợ cũng rất tuyệt vời và luôn sẵn sàng giúp đỡ.",
      author: "Lê Hòa",
      location: "Đà Nẵng",
      role: "Chủ bãi đỗ",
      rating: 4
    },
    {
      id: 3,
      content: "Rất tiện lợi, an toàn và đáng khuyên dùng cho các thành phố đông đúc. Tôi không còn lo lắng về việc tìm chỗ đỗ xe mỗi khi ra đường.",
      author: "Nguyễn Bảo",
      location: "TP. Hồ Chí Minh",
      role: "Tài xế",
      rating: 5
    }
  ];

  // Render star ratings
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="relative py-20 px-6 text-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj4KICA8ZyBmaWxsPSJub25lIiBzdHJva2U9IiMxNzkwZTYiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMiI+CiAgICA8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxNSIgLz4KICAgIDxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjI1IiAvPgogIDwvZz4KPC9zdmc+')] opacity-30"></div>
      
      <div className="container mx-auto relative z-10">
        <AnimatedSection>
          <AnimatedItem className="mb-2 flex items-center justify-center gap-2 text-blue-600 font-medium">
            <div className="w-6 h-px bg-blue-600"></div>
            <span>ĐÁNH GIÁ TỪ NGƯỜI DÙNG</span>
            <div className="w-6 h-px bg-blue-600"></div>
          </AnimatedItem>
          
          <AnimatedItem>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Khách hàng nói gì về <span className="text-blue-600">GoPark</span>
            </h2>
          </AnimatedItem>
          
          <AnimatedItem>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-16 leading-relaxed">
              Chúng tôi tự hào được tin tưởng bởi hàng nghìn tài xế và chủ bãi đỗ xe trên khắp Việt Nam
            </p>
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <AnimatedItem key={testimonial.id}>
              <motion.div 
                whileHover={{ y: -5 }}
                className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group overflow-hidden"
              >
                {/* Decorative quote icon */}
                <div className="absolute top-6 right-6 text-blue-100 text-5xl transform rotate-12">
                  <FaQuoteLeft />
                </div>
                
                {/* Rating stars */}
                <div className="flex justify-center mb-4">
                  <div className="flex space-x-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
                
                {/* Testimonial content */}
                <p className="text-gray-700 mb-6 leading-relaxed text-left relative z-10">
                  "{testimonial.content}"
                </p>
                
                {/* Author info */}
                <div className="text-left border-t border-gray-100 pt-4">
                  <p className="text-blue-600 font-semibold">{testimonial.author}</p>
                  <p className="text-gray-600 text-sm">
                    {testimonial.role} • {testimonial.location}
                  </p>
                </div>
                
                {/* Hover effect line */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 w-0 group-hover:w-full"></div>
              </motion.div>
            </AnimatedItem>
          ))}
        </AnimatedSection>

        {/* Stats section */}
        <AnimatedSection className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <AnimatedItem className="text-center p-6 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">50,000+</div>
            <div className="text-gray-600">Người dùng hài lòng</div>
          </AnimatedItem>
          
          <AnimatedItem className="text-center p-6 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">4.8/5</div>
            <div className="text-gray-600">Đánh giá trung bình</div>
          </AnimatedItem>
          
          <AnimatedItem className="text-center p-6 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">5,000+</div>
            <div className="text-gray-600">Bãi đỗ xe</div>
          </AnimatedItem>
          
          <AnimatedItem className="text-center p-6 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600">Hỗ trợ khách hàng</div>
          </AnimatedItem>
        </AnimatedSection>
      </div>
    </section>
  );
}