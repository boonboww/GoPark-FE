"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Star,
  ChevronDown,
  ChevronUp,
  Filter,
  ImageIcon,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const allReviews = [
  {
    id: 1,
    name: "John Doe",
    comment: "Great parking spot, easy to find and secure.",
    stars: 5,
    image: "/bg.jpg",
    avatar: "/avt.png",
    ownerReply: "Thank you so much for your feedback! Hope to see you again.",
  },
  {
    id: 2,
    name: "Jane Smith",
    comment: "Close to the airport, super convenient!",
    stars: 4,
    image: "/bg.jpg",
    avatar: "/avt.png",
  },
  {
    id: 3,
    name: "David Brown",
    comment: "Good service but a bit crowded at peak times.",
    stars: 3,
    avatar: "/avt.png",
    ownerReply: "We appreciate your comment and will try to manage peak times better.",
  },
  {
    id: 4,
    name: "Emma White",
    comment: "Not satisfied, the staff was not helpful.",
    stars: 2,
    image: "/bg.jpg",
    avatar: "/avt.png",
  },
  {
    id: 5,
    name: "Oliver Black",
    comment: "Terrible experience, my car got scratched.",
    stars: 1,
    avatar: "/avt.png",
    ownerReply: "We sincerely apologize and are investigating this issue immediately.",
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
      <h2 className="text-lg font-semibold mb-4">Customer Reviews</h2>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2  mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilter(!showFilter)}
          className="flex gap-1 items-center"
        >
          <Filter className="w-4 h-4" /> Filter by Stars
        </Button>

        <Button
          variant={onlyImages ? "default" : "outline"}
          size="sm"
          onClick={() => setOnlyImages(!onlyImages)}
          className="flex gap-1 items-center"
        >
          <ImageIcon className="w-4 h-4" /> Show with Images
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
            <option value="">All Stars</option>
            {[5, 4, 3, 2, 1].map((star) => (
              <option key={star} value={star}>
                {star} Star{star > 1 && "s"}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Scroll Container */}
      <div
        className={`flex flex-col gap-4 transition-all ${
          expanded ? "" : "max-h-96 overflow-y-auto"
        } border rounded-md p-4`}
      >
        {visible.map((r) => (
          <div
            key={r.id}
            className="flex flex-col gap-2 bg-gray-300 border rounded-md shadow-sm p-4 bg-white"
          >
            {/* User Review */}
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
                  <Star className="w-4 h-4 text-yellow-500" /> {r.stars} Stars
                </div>
                <p className="text-sm text-gray-800 mt-1">{r.comment}</p>
                <p className="text-xs text-gray-500 italic mt-1">— {r.name}</p>
                {r.image && (
                  <Image
                    src={r.image}
                    alt={`Review ${r.id}`}
                    width={400}
                    height={300}
                    className="mt-2 rounded-md object-cover w-full md:w-1/2"
                  />
                )}
              </div>
            </div>

            {/* Owner Reply */}
            {r.ownerReply && (
              <div className="flex items-start gap-3 pl-12 mt-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100">
                  <MessageSquare className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="border border-yellow-200 bg-yellow-50 p-3 rounded-md w-full">
                  <p className="text-sm text-yellow-800 font-medium mb-1">
                    Owner Reply:
                  </p>
                  <p className="text-sm text-yellow-800">{r.ownerReply}</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-gray-500 text-sm">No reviews found.</p>
        )}
      </div>

      {/* Show More Button */}
      {filtered.length > 3 && (
        <Button
          variant="ghost"
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex gap-1 items-center"
        >
          {expanded ? (
            <>
              Collapse <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Show More <ChevronDown className="w-4 h-4" />
            </>
          )}
        </Button>
      )}
    </section>
  );
}
