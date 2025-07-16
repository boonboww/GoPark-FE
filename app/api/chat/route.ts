import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1]?.content || "";

  // ✅ Gửi truy vấn tới BE để lấy dữ liệu liên quan từ MongoDB
  let dbInfo = "";
  try {
    const res = await fetch("http://localhost:5000/api/chatbot/chat-query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        district: extractDistrict(lastMessage),
        payment: extractPayment(lastMessage),
      }),
    });

    const parkings = await res.json();

    if (parkings.length) {
      dbInfo += `🔍 Tìm thấy ${parkings.length} bãi đậu xe theo yêu cầu:\n\n`;

      dbInfo += parkings
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((p: any) => {
          const hours = "06:00 – 22:00";
          const image = p.avtImage || p.image?.[0] || "Không có ảnh";
          return `📍 ${p.name}
Địa chỉ: ${p.address}
Thanh toán: ${p.allowedPaymentMethods.join(", ")}
Giờ hoạt động: ${hours}
Ảnh: ${image}
`;
        })
        .join("\n");
    } else {
      dbInfo = `❌ Không tìm thấy bãi đậu xe phù hợp với yêu cầu.`;
    }
  } catch (err) {
    console.error("❌ Lỗi khi gọi API BE:", err);
    dbInfo = "⚠️ Lỗi hệ thống khi truy vấn dữ liệu bãi đậu xe.";
  }

  const fullMessages = [
    {
      role: "system",
      content: `
Bạn là trợ lý AI của GoPark – nền tảng đặt chỗ bãi đậu xe tại Việt Nam.
Hãy trả lời chuyên nghiệp, dễ hiểu, ngắn gọn.
Nếu có dữ liệu hệ thống từ GoPark (bên dưới), hãy ưu tiên sử dụng nó để trả lời:
- Đây là hệ thống bãi đậu xe tại Việt Nam, bao gồm tên, địa chỉ, giờ hoạt động, phương thức thanh toán.
- Hệ thống này là hệ thống dành cho chủ bãi đỗ xe có thể đăng ký bãi đỗ của mình trên hệ thống.
- Khách hàng có thể tìm kím bãi đỗ xe đó trên hệ thống để  đậu xe.
Các bước hoạt động như sau:
+ Đối với chủ bãi. vào phần đăng ký bãi, chọn đăng ky- nhập thông tin bãi- xác nhận- đợi thông báo
+ Đối với khách hàng. ở trang chủ vào phần đăng ký xe - đăng ký xe của mình - xác nhận - trở về trang chủ - tìm kiếm thành phố - chọn thành phố trên bản đồ - bấm đặt - sau đó thanh toán - xem ve - bạn có thể xem chi chi tiết vé ở phần booking
${dbInfo}
`,
    }, 
    ...messages,
  ];

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: fullMessages,
      }),
    });

    if (!response.ok) {
      console.error("❌ OpenRouter API ERROR:", response.status, await response.text());
      return NextResponse.json({ error: "OpenRouter API error" }, { status: 500 });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message;
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("❌ Unexpected API call error:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}

// 📌 Tách các hàm xử lý từ message để tái sử dụng
function extractDistrict(message: string): string | undefined {
  const match = message.match(/(quận|huyện|thành phố)\s?[^\s\d]*/i);
  return match ? match[0] : undefined;
}

function extractPayment(message: string): "momo" | "pay-at-parking" | undefined {
  const lower = message.toLowerCase();
  if (lower.includes("momo")) return "momo";
  if (lower.includes("trả tại chỗ")) return "pay-at-parking";
  return undefined;
}
