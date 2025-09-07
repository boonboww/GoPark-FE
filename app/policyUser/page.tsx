"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ShieldCheck,
  Handshake,
  MessageSquarePlus,
  ChevronDown,
  ChevronUp,
  Phone,
  Download,
  SendHorizonal,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Lock,
  Users,
  Scale,
  Star,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export default function PolicyUserPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  const togglePolicy = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSendFeedback = () => {
    if (!feedback.trim()) return;
    alert(`✅ Cảm ơn bạn đã gửi phản hồi:\n"${feedback}"`);
    setFeedback("");
  };

  const policyCategories = [
    {
      id: "user-rights",
      title: "Quyền lợi người dùng",
      subtitle: "Những gì GoPark cam kết với bạn",
      icon: ShieldCheck,
      color: "bg-blue-500",
      items: [
        {
          title: "An toàn & Bảo mật",
          description: "Bảo vệ phương tiện và thông tin cá nhân",
          details: [
            "Hệ thống camera giám sát 24/7 tại tất cả bãi đỗ",
            "Bảo hiểm thiệt hại cho xe trong thời gian đỗ",
            "Mã hóa SSL cho tất cả giao dịch thanh toán",
            "Không chia sẻ thông tin cá nhân với bên thứ ba"
          ]
        },
        {
          title: "Hỗ trợ khách hàng",
          description: "Dịch vụ chăm sóc khách hàng chuyên nghiệp",
          details: [
            "Hotline 24/7: +84 800 123 456",
            "Chat trực tuyến với AI và nhân viên",
            "Thời gian phản hồi tối đa 2 giờ",
            "Hỗ trợ đa ngôn ngữ (Việt, Anh)"
          ]
        },
        {
          title: "Chính sách hoàn tiền",
          description: "Điều kiện và quy trình hoàn tiền rõ ràng",
          details: [
            "Hoàn 100% nếu hủy trước 2 giờ",
            "Hoàn 50% nếu hủy trong vòng 30 phút đến 2 giờ",
            "Hoàn tiền tự động trong 3-5 ngày làm việc",
            "Không phí hủy cho trường hợp bất khả kháng"
          ]
        }
      ]
    },
    {
      id: "user-responsibilities", 
      title: "Nghĩa vụ người dùng",
      subtitle: "Trách nhiệm khi sử dụng dịch vụ GoPark",
      icon: Handshake,
      color: "bg-green-500",
      items: [
        {
          title: "Tuân thủ quy định",
          description: "Chấp hành nội quy và hướng dẫn",
          details: [
            "Đỗ xe đúng vị trí đã đặt",
            "Tuân thủ giới hạn thời gian đăng ký",
            "Không để lại rác hoặc gây ô nhiễm",
            "Tôn trọng nhân viên và khách hàng khác"
          ]
        },
        {
          title: "Thông tin chính xác",
          description: "Cung cấp thông tin đúng và đầy đủ",
          details: [
            "Biển số xe phải chính xác 100%",
            "Thông tin liên hệ phải cập nhật",
            "Thanh toán bằng phương thức hợp pháp",
            "Báo cáo ngay khi có thay đổi thông tin"
          ]
        },
        {
          title: "Sử dụng có trách nhiệm",
          description: "Giữ gìn tài sản chung và môi trường",
          details: [
            "Không gây thiệt hại cơ sở vật chất",
            "Tắt máy và khóa xe cẩn thận",
            "Không để đồ quý giá trong xe",
            "Báo cáo sự cố ngay khi phát hiện"
          ]
        }
      ]
    },
    {
      id: "privacy-terms",
      title: "Bảo mật & Điều khoản",
      subtitle: "Chính sách xử lý và điều khoản sử dụng",
      icon: Lock,
      color: "bg-purple-500",
      items: [
        {
          title: "Thu thập thông tin",
          description: "Loại dữ liệu chúng tôi thu thập",
          details: [
            "Thông tin cá nhân: Họ tên, SĐT, email",
            "Thông tin xe: Biển số, loại xe, màu sắc", 
            "Lịch sử giao dịch và sử dụng dịch vụ",
            "Dữ liệu vị trí khi sử dụng ứng dụng"
          ]
        },
        {
          title: "Sử dụng thông tin",
          description: "Mục đích sử dụng dữ liệu cá nhân",
          details: [
            "Cung cấp và cải thiện dịch vụ",
            "Xử lý thanh toán và giao dịch",
            "Gửi thông báo quan trọng về dịch vụ",
            "Phân tích để nâng cao trải nghiệm"
          ]
        },
        {
          title: "Bảo vệ dữ liệu",
          description: "Cam kết bảo mật thông tin khách hàng",
          details: [
            "Mã hóa dữ liệu end-to-end",
            "Lưu trữ trên server bảo mật tại Việt Nam",
            "Tuân thủ quy định GDPR và luật Việt Nam",
            "Kiểm tra bảo mật định kỳ hàng tháng"
          ]
        }
      ]
    }
  ];

  const quickStats = [
    { icon: Users, label: "Người dùng", value: "50,000+", color: "text-blue-600" },
    { icon: ShieldCheck, label: "Bãi đỗ an toàn", value: "99.9%", color: "text-green-600" },
    { icon: Star, label: "Đánh giá", value: "4.8/5", color: "text-yellow-600" },
    { icon: CheckCircle, label: "Độ tin cậy", value: "100%", color: "text-purple-600" }
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen mt-20 px-4 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Scale className="w-12 h-12 text-blue-600 mr-4" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Chính sách người dùng
              </h1>
              <p className="text-lg text-gray-600">
                Quyền lợi và trách nhiệm khi sử dụng dịch vụ GoPark
              </p>
            </div>
          </div>

          {/* Version & Last Updated */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Badge variant="outline" className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              Phiên bản 2.0
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Cập nhật: Tháng 8, 2025
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {quickStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="p-4">
                  <CardContent className="text-center p-0">
                    <IconComponent className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Policy Categories */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {policyCategories.map((category, categoryIndex) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.id} className="h-fit">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">{category.title}</CardTitle>
                    <p className="text-gray-600">{category.subtitle}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {category.items.map((item, itemIndex) => {
                      const isOpen = openIndex === parseInt(`${categoryIndex}${itemIndex}`);
                      return (
                        <div key={itemIndex} className="border rounded-lg">
                          <button
                            onClick={() => togglePolicy(parseInt(`${categoryIndex}${itemIndex}`))}
                            className="w-full flex justify-between items-start text-left p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2 cursor-pointer" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2 cursor-pointer" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-4">
                              <ul className="space-y-2">
                                {item.details.map((detail, detailIndex) => (
                                  <li key={detailIndex} className="flex items-start text-sm text-gray-700">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>{detail}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Contact & Feedback Section */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feedback Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquarePlus className="w-5 h-5 text-blue-600" />
                  Góp ý & Phản hồi
                </CardTitle>
                <p className="text-gray-600">Chia sẻ ý kiến để giúp chúng tôi cải thiện dịch vụ</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Textarea
                    rows={4}
                    placeholder="Viết phản hồi của bạn tại đây..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="resize-none"
                  />
                  <Button
                    onClick={handleSendFeedback}
                    className="w-full mt-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow cursor-pointer"
                    disabled={!feedback.trim()}
                  >
                    <SendHorizonal className="w-4 h-4 mr-2 cursor-pointer" /> Gửi phản hồi
                  </Button>
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-green-600" />
                    Hỗ trợ khách hàng
                  </CardTitle>
                  <p className="text-gray-600 mb-3">Liên hệ ngay khi cần hỗ trợ</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium">Hotline 24/7</div>
                        <div className="text-sm text-gray-600">+84 800 123 456</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MessageSquarePlus className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Chat support</div>
                        <div className="text-sm text-gray-600">support@gopark.vn</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-orange-600" />
                      <div>
                        <div className="font-medium">Thời gian phản hồi</div>
                        <div className="text-sm text-gray-600">Tối đa 2 giờ</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    <Button
                      onClick={() => window.location.href = 'tel:+84800123456'}
                      className="w-full bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                    >
                      <Phone className="w-4 h-4 mr-2 cursor-pointer" />
                      Gọi ngay
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full cursor-pointer"
                      onClick={() => window.open('/policy.pdf', '_blank')}
                    >
                      <Download className="w-4 h-4 mr-2 cursor-pointer" />
                      Tải chính sách PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Important Notice */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Lưu ý quan trọng</h3>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    Chính sách này có hiệu lực từ ngày 1 tháng 8 năm 2025. Việc tiếp tục sử dụng dịch vụ GoPark 
                    sau ngày này được xem như bạn đã đồng ý với các điều khoản được cập nhật. 
                    Chúng tôi khuyến khích bạn đọc kỹ và liên hệ nếu có thắc mắc.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
}