"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Phone,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Search,
  HelpCircle,
  BookOpen,
  Users,
  Clock,
  Mail,
  MapPin,
  Car,
  CreditCard,
  ArrowRight,
  UserCheck,
  Building2,
  QrCode,
  CheckCircle,
  DollarSign,
  BarChart3,
  Settings,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const faqs = [
  {
    category: "Đặt chỗ",
    icon: Car,
    questions: [
      {
        question: "Làm thế nào để đặt chỗ đỗ xe?",
        answer:
          "Bạn có thể đặt chỗ bằng cách chọn bãi đỗ mong muốn, chọn gói dịch vụ, nhập thông tin phương tiện và thực hiện thanh toán trực tuyến. Hệ thống sẽ gửi mã QR xác nhận qua email.",
      },
      {
        question: "Tôi có thể đặt chỗ trước bao lâu?",
        answer:
          "Bạn có thể đặt chỗ trước tối đa 30 ngày. Đối với đặt chỗ theo tháng, bạn có thể đặt trước 90 ngày.",
      },
      {
        question: "Có thể đặt nhiều chỗ cùng lúc không?",
        answer:
          "Có, bạn có thể đặt nhiều chỗ đỗ cho các phương tiện khác nhau trong cùng một giao dịch.",
      },
    ],
  },
  {
    category: "Thanh toán",
    icon: CreditCard,
    questions: [
      {
        question: "Phương thức thanh toán nào được chấp nhận?",
        answer:
          "Chúng tôi chấp nhận thanh toán qua thẻ ATM nội địa, Visa/MasterCard, ví điện tử (MoMo, ZaloPay), VietQR và thanh toán tại chỗ.",
      },
      {
        question: "Tôi có được hoàn tiền khi hủy đặt chỗ?",
        answer:
          "Có, bạn sẽ được hoàn tiền 100% nếu hủy trước 2 giờ. Hủy trong vòng 2 giờ sẽ bị trừ 20% phí xử lý.",
      },
      {
        question: "Khi nào tiền sẽ được hoàn lại?",
        answer:
          "Tiền hoàn lại sẽ được xử lý trong vòng 3-5 ngày làm việc tùy thuộc vào phương thức thanh toán ban đầu.",
      },
    ],
  },
  {
    category: "Hỗ trợ",
    icon: Users,
    questions: [
      {
        question: "Làm thế nào để hủy đặt chỗ?",
        answer:
          "Vào trang 'Đặt chỗ của tôi', chọn đặt chỗ đang hoạt động và nhấn nút 'Hủy'. Hệ thống sẽ xử lý việc hủy và hoàn tiền nếu áp dụng.",
      },
      {
        question: "Tôi phải làm gì nếu phương tiện gặp sự cố trong bãi đỗ?",
        answer:
          "Vui lòng liên hệ đường dây nóng bên dưới hoặc trò chuyện với Trợ lý AI của chúng tôi để được hỗ trợ ngay lập tức và kết nối với nhân viên tại chỗ.",
      },
      {
        question: "Tôi quên mật khẩu, làm sao để đặt lại?",
        answer:
          "Tại trang đăng nhập, nhấn 'Quên mật khẩu', nhập email đã đăng ký. Chúng tôi sẽ gửi link đặt lại mật khẩu qua email.",
      },
    ],
  },
];

const quickActions = [
  {
    title: "Tìm bãi đỗ",
    description: "Tìm kiếm bãi đỗ xe gần bạn",
    icon: MapPin,
    action: "/",
  },
  {
    title: "Đặt chỗ của tôi",
    description: "Xem và quản lý đặt chỗ",
    icon: BookOpen,
    action: "/myBooking",
  },
  {
    title: "Trò chuyện với AI",
    description: "Hỗ trợ 24/7 với chatbot",
    icon: MessageSquare,
    action: "/help/chatAI",
  },
  {
    title: "Liên hệ hotline",
    description: "Gọi ngay: +84 800 123 456",
    icon: Phone,
    action: "tel:+84800123456",
  },
];

// Workflow cho khách hàng
const customerWorkflow = [
  {
    step: 1,
    title: "Tìm kiếm bãi đỗ",
    description: "Nhập địa điểm mong muốn và thời gian cần đỗ xe",
    icon: Search,
    details: [
      "Sử dụng bản đồ để tìm bãi đỗ gần nhất",
      "Xem giá cả và đánh giá từ người dùng khác",
      "Kiểm tra tình trạng còn chỗ trống",
    ],
  },
  {
    step: 2,
    title: "Chọn gói dịch vụ",
    description: "Lựa chọn gói phù hợp: theo giờ, theo ngày hoặc theo tháng",
    icon: Clock,
    details: [
      "Theo giờ: Linh hoạt, phù hợp đỗ xe ngắn hạn",
      "Theo ngày: Tiết kiệm cho việc đỗ xe cả ngày",
      "Theo tháng: Ưu đãi lớn cho khách hàng thường xuyên",
    ],
  },
  {
    step: 3,
    title: "Nhập thông tin",
    description: "Cung cấp thông tin phương tiện và thời gian",
    icon: Car,
    details: [
      "Biển số xe (bắt buộc)",
      "Loại phương tiện (ô tô, xe máy)",
      "Thời gian bắt đầu và kết thúc",
    ],
  },
  {
    step: 4,
    title: "Thanh toán",
    description: "Chọn phương thức thanh toán phù hợp",
    icon: CreditCard,
    details: [
      "Thanh toán online: ATM, Visa/MasterCard, ví điện tử",
      "Thanh toán tại chỗ: Tiền mặt hoặc quẹt thẻ",
      "VietQR: Quét mã thanh toán nhanh chóng",
    ],
  },
  {
    step: 5,
    title: "Nhận mã QR",
    description: "Lưu mã QR để vào/ra bãi đỗ",
    icon: QrCode,
    details: [
      "Mã QR được gửi qua email và SMS",
      "Hiển thị trong ứng dụng phần 'Đặt chỗ của tôi'",
      "Quét mã tại cổng vào/ra bãi đỗ",
    ],
  },
  {
    step: 6,
    title: "Hoàn tất",
    description: "Check-in thành công và sử dụng dịch vụ",
    icon: CheckCircle,
    details: [
      "Quét mã QR tại cổng vào",
      "Đỗ xe tại vị trí được chỉ định",
      "Quét mã QR tại cổng ra khi rời bãi",
    ],
  },
];

// Workflow cho chủ bãi đỗ
const ownerWorkflow = [
  {
    step: 1,
    title: "Đăng ký tài khoản",
    description: "Tạo tài khoản chủ bãi đỗ với thông tin doanh nghiệp",
    icon: UserCheck,
    details: [
      "Cung cấp giấy phép kinh doanh",
      "Xác thực thông tin pháp lý",
      "Thiết lập thông tin liên hệ",
    ],
  },
  {
    step: 2,
    title: "Thêm bãi đỗ",
    description: "Đăng ký thông tin bãi đỗ xe của bạn",
    icon: Building2,
    details: [
      "Nhập địa chỉ và tọa độ chính xác",
      "Upload hình ảnh bãi đỗ",
      "Mô tả dịch vụ và tiện ích",
    ],
  },
  {
    step: 3,
    title: "Cấu hình chỗ đỗ",
    description: "Thiết lập số lượng và loại chỗ đỗ",
    icon: Settings,
    details: [
      "Tạo các khu vực đỗ xe (A, B, C...)",
      "Đánh số thứ tự cho từng chỗ đỗ",
      "Phân loại theo loại xe (ô tô, xe máy)",
    ],
  },
  {
    step: 4,
    title: "Đặt giá dịch vụ",
    description: "Thiết lập bảng giá linh hoạt cho các gói dịch vụ",
    icon: DollarSign,
    details: [
      "Giá theo giờ, ngày, tháng",
      "Chính sách giảm giá và khuyến mãi",
      "Phí phạt quá giờ quy định",
    ],
  },
  {
    step: 5,
    title: "Quản lý đặt chỗ",
    description: "Theo dõi và xử lý các đặt chỗ từ khách hàng",
    icon: BookOpen,
    details: [
      "Xem danh sách đặt chỗ theo thời gian thực",
      "Xác nhận hoặc từ chối đặt chỗ",
      "Quản lý check-in/check-out",
    ],
  },
  {
    step: 6,
    title: "Báo cáo doanh thu",
    description: "Xem thống kê và báo cáo kinh doanh chi tiết",
    icon: BarChart3,
    details: [
      "Doanh thu theo ngày, tuần, tháng",
      "Tỷ lệ lấp đầy bãi đỗ",
      "Phân tích khách hàng và xu hướng",
    ],
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [workflowTab, setWorkflowTab] = useState<"customer" | "owner">(
    "customer"
  );
  const router = useRouter();

  const toggleFAQ = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  const handleQuickAction = (action: string) => {
    if (action.startsWith("tel:")) {
      window.location.href = action;
    } else {
      router.push(action);
    }
  };

  const filteredFAQs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <>
      <Header />

      <main className="min-h-screen mt-20 px-4 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Trung tâm hỗ trợ
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-8">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Tìm câu trả lời nhanh chóng
            hoặc liên hệ trực tiếp với đội ngũ hỗ trợ.
          </p>

          {/* Search Box */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Tìm kiếm câu hỏi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Hành động nhanh
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => handleQuickAction(action.action)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2">{action.title}</h3>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Workflow Demo Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <PlayCircle className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold">Mô phỏng hoạt động</h2>
            </div>
            <p className="text-gray-600">
              Tìm hiểu cách sử dụng GoPark qua các bước đơn giản
            </p>
          </div>

          {/* Workflow Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1 rounded-lg inline-flex">
              <button
                onClick={() => setWorkflowTab("customer")}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  workflowTab === "customer"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <UserCheck className="w-4 h-4 inline mr-2" />
                Dành cho khách hàng
              </button>
              <button
                onClick={() => setWorkflowTab("owner")}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  workflowTab === "owner"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Building2 className="w-4 h-4 inline mr-2" />
                Dành cho chủ bãi
              </button>
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(workflowTab === "customer"
              ? customerWorkflow
              : ownerWorkflow
            ).map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Card
                  key={index}
                  className="relative overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    {/* Step Number */}
                    <div className="absolute top-4 right-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>

                    {/* Icon */}
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {step.description}
                    </p>

                    {/* Details */}
                    <ul className="space-y-1">
                      {step.details.map((detail, detailIndex) => (
                        <li
                          key={detailIndex}
                          className="flex items-start text-xs text-gray-500"
                        >
                          <ArrowRight className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Call to Action for Workflow */}
          <div className="text-center mt-8">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 inline-block">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">
                  {workflowTab === "customer"
                    ? "Sẵn sàng tìm chỗ đỗ xe?"
                    : "Muốn trở thành đối tác?"}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {workflowTab === "customer"
                    ? "Bắt đầu tìm kiếm bãi đỗ xe phù hợp ngay bây giờ!"
                    : "Đăng ký để quản lý bãi đỗ xe của bạn với GoPark!"}
                </p>
                <Button
                  onClick={() =>
                    router.push(workflowTab === "customer" ? "/" : "/owner")
                  }
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {workflowTab === "customer"
                    ? "Tìm bãi đỗ ngay"
                    : "Đăng ký làm đối tác"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8 text-center">
            Câu hỏi thường gặp
          </h2>

          {filteredFAQs.length === 0 ? (
            <Card className="p-8 text-center">
              <CardContent>
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Không tìm thấy kết quả
                </h3>
                <p className="text-gray-600">
                  Thử tìm kiếm với từ khóa khác hoặc liên hệ hỗ trợ trực tiếp.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {filteredFAQs.map((category, categoryIndex) => {
                const IconComponent = category.icon;
                return (
                  <div key={categoryIndex} className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {category.category}
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {category.questions.map((faq, questionIndex) => {
                        const key = `${categoryIndex}-${questionIndex}`;
                        const isOpen = openIndex === key;

                        return (
                          <Card
                            key={questionIndex}
                            className="border border-gray-200 hover:border-gray-300 transition-colors"
                          >
                            <CardContent className="p-0">
                              <button
                                onClick={() =>
                                  toggleFAQ(categoryIndex, questionIndex)
                                }
                                className="w-full flex justify-between items-center text-left p-4 hover:bg-gray-50 transition-colors"
                              >
                                <span className="font-medium text-gray-900">
                                  {faq.question}
                                </span>
                                {isOpen ? (
                                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2" />
                                )}
                              </button>
                              {isOpen && (
                                <div className="px-4 pb-4">
                                  <p className="text-gray-600 leading-relaxed">
                                    {faq.answer}
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold mb-4">Vẫn cần hỗ trợ?</h3>
              <p className="text-gray-600 mb-6">
                Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn. Liên hệ
                ngay để được hỗ trợ tốt nhất!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-5 h-5" />
                  <span>Hỗ trợ 24/7</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-5 h-5" />
                  <span>support@gopark.vn</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-5 h-5" />
                  <span>+84 800 123 456</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                <Button
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => (window.location.href = "tel:+84800123456")}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Gọi ngay
                </Button>
                <Button
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  onClick={() => router.push("/help/chatAI")}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat với AI
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
}
