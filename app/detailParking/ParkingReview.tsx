"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ChevronDown, ChevronUp, Filter, ImageIcon, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

type Review = {
  id: number;
  name: string;
  comment: string;
  stars: number;
  image?: string;
  avatar: string;
  ownerReply?: string;
};

const allReviews: Review[] = [
  {
    id: 1,
    name: "John Doe",
    comment: "Bãi đỗ tuyệt vời, dễ tìm và an toàn.",
    stars: 5,
    image: "/bg.jpg",
    avatar: "/avt.png",
    ownerReply: "Cảm ơn bạn rất nhiều vì phản hồi! Hy vọng sẽ gặp lại bạn.",
  },
  {
    id: 2,
    name: "Jane Smith",
    comment: "Gần sân bay, rất tiện lợi!",
    stars: 4,
    image: "/bg.jpg",
    avatar: "/avt.png",
  },
  {
    id: 3,
    name: "David Brown",
    comment: "Dịch vụ tốt nhưng hơi đông vào giờ cao điểm.",
    stars: 3,
    avatar: "/avt.png",
    ownerReply: "Chúng tôi đánh giá cao ý kiến của bạn và sẽ cố gắng quản lý giờ cao điểm tốt hơn.",
  },
  {
    id: 4,
    name: "Emma White",
    comment: "Không hài lòng, nhân viên không hỗ trợ tốt.",
    stars: 2,
    image: "/bg.jpg",
    avatar: "/avt.png",
  },
  {
    id: 5,
    name: "Oliver Black",
    comment: "Trải nghiệm tệ, xe của tôi bị trầy xước.",
    stars: 1,
    avatar: "/avt.png",
    ownerReply: "Chúng tôi thành thật xin lỗi và đang điều tra vấn đề này ngay lập tức.",
  },
];

export default function ParkingReview() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [onlyImages, setOnlyImages] = useState(false);
  const [expanded, setExpanded] = useState(false);

  let filtered = allReviews;

  if (selectedStars) {
    filtered = filtered.filter((r) => r.stars === selectedStars);
  }

  if (onlyImages) {
    filtered = filtered.filter((r) => !!r.image);
  }

  const visible = filtered;

  return (
    <section className="w-full">
      <h2 className="text-lg font-semibold mb-4">Đánh giá khách hàng</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilter(!showFilter)}
          className="flex gap-1 items-center"
        >
          <Filter className="w-4 h-4" /> Lọc theo số sao
        </Button>

        <Button
          variant={onlyImages ? "default" : "outline"}
          size="sm"
          onClick={() => setOnlyImages(!onlyImages)}
          className="flex gap-1 items-center"
        >
          <ImageIcon className="w-4 h-4" /> Hiển thị có hình ảnh
        </Button>
      </div>

      {showFilter && (
        <div className="mb-4">
          <select
            value={selectedStars ?? ""}
            onChange={(e) =>
              setSelectedStars(
                e.target.value ? parseInt(e.target.value) : null
              )
            }
            className="border rounded-md px-3 py-2 w-40"
          >
            <option value="">Tất cả sao</option>
            {[5, 4, 3, 2, 1].map((star) => (
              <option key={star} value={star}>
                {star} Sao
              </option>
            ))}
          </select>
        </div>
      )}

      <div
        className={`flex flex-col gap-4 transition-all ${
          expanded ? "" : "max-h-96 overflow-y-auto"
        } border rounded-md p-4`}
      >
        {visible.map((r) => (
          <div
            key={r.id}
            className="flex flex-col gap-2 border rounded-md shadow-sm p-4 bg-white"
          >
            <div className="flex items-start gap-3">
              <Image
                src={r.avatar || "/avatars/default.jpg"}
                alt={r.name}
                width={40}
                height={40}
                className="rounded-full object-cover w-10 h-10"
              />

              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" /> {r.stars} Sao
                </div>
                <p className="text-sm text-gray-800 mt-1">{r.comment}</p>
                <p className="text-xs text-gray-500 italic mt-1">— {r.name}</p>
                {r.image && (
                  <Image
                    src={r.image}
                    alt={`Đánh giá ${r.id}`}
                    width={400}
                    height={300}
                    className="mt-2 rounded-md object-cover w-full md:w-1/2"
                  />
                )}
              </div>
            </div>

            {r.ownerReply && (
              <div className="flex items-start gap-3 pl-12 mt-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100">
                  <MessageSquare className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="border border-yellow-200 bg-yellow-50 p-3 rounded-md w-full">
                  <p className="text-sm text-yellow-800 font-medium mb-1">
                    Phản hồi của chủ bãi:
                  </p>
                  <p className="text-sm text-yellow-800">{r.ownerReply}</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-gray-500 text-sm">Không tìm thấy đánh giá.</p>
        )}
      </div>

      {filtered.length > 3 && (
        <Button
          variant="ghost"
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex gap-1 items-center"
        >
          {expanded ? (
            <>
              Thu gọn <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Xem thêm <ChevronDown className="w-4 h-4" />
            </>
          )}
        </Button>
      )}
    </section>
  );
}