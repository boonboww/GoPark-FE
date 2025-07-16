"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "Làm thế nào để đặt chỗ đỗ xe?",
    answer:
      "Bạn có thể đặt chỗ bằng cách chọn bãi đỗ mong muốn, chọn gói dịch vụ, nhập thông tin phương tiện và thực hiện thanh toán trực tuyến.",
  },
  {
    question: "Làm thế nào để hủy đặt chỗ?",
    answer:
      "Vào trang Đặt chỗ của tôi, chọn đặt chỗ đang hoạt động và nhấn nút Hủy. Hệ thống sẽ xử lý việc hủy và hoàn tiền nếu áp dụng.",
  },
  {
    question: "Phương thức thanh toán nào được chấp nhận?",
    answer:
      "Chúng tôi chấp nhận thanh toán qua thẻ ATM nội địa, Visa/MasterCard, ví điện tử và mã VietQR.",
  },
  {
    question: "Tôi phải làm gì nếu phương tiện gặp sự cố trong bãi đỗ?",
    answer:
      "Vui lòng liên hệ đường dây nóng bên dưới hoặc trò chuyện với Trợ lý AI của chúng tôi để được hỗ trợ ngay lập tức và kết nối với nhân viên tại chỗ.",
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const router = useRouter();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleChatAI = () => {
    router.push("/help/chatAI");
  };

  return (
    <>
      <Header />

      <main className="min-h-screen mt-20 px-4 py-12 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Trung tâm hỗ trợ</h1>

        <div className="w-full max-w-3xl flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left text-lg font-medium"
              >
                <span>{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              {openIndex === index && (
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-12">
          <Button
            variant="default"
            className="flex gap-2 items-center bg-black text-white hover:bg-gray-900 cursor-pointer"
            onClick={() => alert("📞 Gọi đường dây nóng: +84 800 123 456")}
          >
            <Phone className="w-4 h-4" /> Liên hệ hỗ trợ
          </Button>
          <Button
            variant="outline"
            className="flex gap-2 items-center cursor-pointer"
            onClick={handleChatAI}
          >
            <MessageSquare className="w-4 h-4" /> Trò chuyện với AI
          </Button>
        </div>
      </main>

      <Footer />
    </>
  );
}