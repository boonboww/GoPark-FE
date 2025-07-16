"use client";

import { FaQuoteLeft } from "react-icons/fa";

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-6 text-center bg-sky-50">
      <h2 className="text-4xl sm:text-5xl font-bold text-sky-600 mb-4">
        Khách Hàng Nói Gì Về Chúng Tôi
      </h2>
      <p className="text-gray-600 max-w-3xl mx-auto mb-12">
        Chúng tôi được tin tưởng bởi các tài xế và chủ bãi đỗ xe trên khắp Việt Nam.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Testimonial 1 */}
        <div className="bg-white p-8 rounded-2xl shadow-md relative hover:shadow-xl transition">
          <FaQuoteLeft className="text-sky-200 text-5xl absolute -top-4 -left-4" />
          <p className="text-gray-700 mb-6 leading-relaxed">
            "Việc tìm chỗ đỗ xe chưa bao giờ dễ dàng đến thế! Tôi có thể đặt chỗ trực tuyến
            và tiết kiệm rất nhiều thời gian"
          </p>
          <p className="text-sky-500 font-bold">– Trần Minh, Hà Nội</p>
        </div>

        {/* Testimonial 2 */}
        <div className="bg-white p-8 rounded-2xl shadow-md relative hover:shadow-xl transition">
          <FaQuoteLeft className="text-sky-200 text-5xl absolute -top-4 -left-4" />
          <p className="text-gray-700 mb-6 leading-relaxed">
            "Tôi kiếm thêm thu nhập bằng cách chia sẻ chỗ đỗ xe không sử dụng. Đội ngũ hỗ trợ cũng rất tuyệt vời"
          </p>
          <p className="text-sky-500 font-bold">– Lê Hòa, Đà Nẵng</p>
        </div>

        {/* Testimonial 3 */}
        <div className="bg-white p-8 rounded-2xl shadow-md relative hover:shadow-xl transition">
          <FaQuoteLeft className="text-sky-200 text-5xl absolute -top-4 -left-4" />
          <p className="text-gray-700 mb-6 leading-relaxed">
            "Rất tiện lợi, an toàn và rất đáng khuyên dùng cho các thành phố đông đúc."
          </p>
          <p className="text-sky-500 font-bold">
            – Nguyễn Bảo, Thành phố Hồ Chí Minh
          </p>
        </div>
      </div>
    </section>
  );
}