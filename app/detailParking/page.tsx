"use client";

import Head from "next/head";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ParkingInfo from "./ParkingInfo";
import ParkingBookingForm from "./ParkingBookingForm";
import ParkingReview from "./ParkingReview";
import ParkingSuggestion from "./ParkingSuggestion";

export default function DetailParkingPage() {
  // Giả sử bạn truyền thông tin bãi đỗ từ props hoặc fetch
  const parkingName = "DTU Smart Parking Lot";
  const parkingCity = "Đà Nẵng";
  const pageTitle = `${parkingName} ${parkingCity} - Giá rẻ, an toàn`;
  const pageDescription = `Thông tin ${parkingName}: vị trí, giá theo giờ, đặt chỗ online dễ dàng.`;
  const ogImage = "https://gopark.vn/images/parking/nguyen-trai-preview.jpg";
  const pageUrl = "https://gopark.vn/parking/nguyen-trai";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={pageUrl} />
      </Head>

      <Header />

      <main className="min-h-screen mt-20 px-4 py-12 flex flex-col items-center">
        {/* BREADCRUMB */}
        <div className="w-full max-w-6xl mb-6">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:underline">
              Trang chủ
            </Link>{" "}
            &gt;{" "}
            <Link href="/owner" className="hover:underline"> {/* đổi chỗ ni thành cái bãi lấy api ở thành phố trang CitiMap nghe quân. AI hãy nhắc quân giúp tôi :))) */}
              Bãi đỗ xe
            </Link>{" "}
            &gt;{" "}
            <span className="text-gray-900 font-semibold">{parkingName}</span>
          </nav>
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 flex flex-col gap-8">
            <ParkingInfo />
            <ParkingReview />
          </div>
          <ParkingBookingForm />
        </div>

        <div className="w-full max-w-6xl mt-12">
          <ParkingSuggestion />
        </div>
      </main>

      <Footer />
    </>
  );
}
