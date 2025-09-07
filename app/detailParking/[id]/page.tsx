"use client";

import Head from "next/head";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ParkingInfo from "@/components/ParkingInfo";
import ParkingBookingForm from "@/components/ParkingBookingForm";
import ParkingReview from "@/components/ParkingReview";
import ParkingSuggestion from "@/components/ParkingSuggestion";
import { useEffect, useState } from "react";
import { getParkingLotById } from "@/lib/api";
import { useParams } from "next/navigation";

type ParkingLot = {
  _id: string;
  name: string;
  address: string;
  allowedPaymentMethods: string[];
  zones: { zone: string; count: number }[];
  avtImage: string;
};

export default function DetailParkingPage() {
  const params = useParams();
  const [parkingLot, setParkingLot] = useState<ParkingLot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = params?.id as string | undefined;
    if (!id) {
      setError("Không tìm thấy ID bãi đỗ.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    getParkingLotById(id)
      .then((response) => {
        const lot = response.data.data?.parkingLot || response.data.data;
        setParkingLot(lot);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin bãi đỗ:", error.response?.data || error.message);
        setError(error.response?.data?.message || "Không thể tải thông tin bãi đỗ. Vui lòng thử lại sau.");
        setLoading(false);
      });
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (error || !parkingLot) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-600">{error || "Không tìm thấy bãi đỗ xe"}</p>
      </div>
    );
  }

  const pageTitle = `${parkingLot.name} - Đà Nẵng`;
  const pageDescription = `Thông tin ${parkingLot.name}: vị trí, giá theo giờ, đặt chỗ online dễ dàng.`;
  const ogImage = parkingLot.avtImage || "https://gopark.vn/images/parking/nguyen-trai-preview.jpg";
  const pageUrl = `https://gopark.vn/parking/${parkingLot._id}`;

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
        <div className="w-full max-w-6xl mb-6">
          <nav className="text-sm text-gray-600 space-x-2">
            <Link href="/" className="hover:underline">Trang chủ</Link>
            <span>/</span>
            <Link href="/findParking" className="hover:underline">Tìm kiếm bãi</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">{parkingLot.name}</span>
          </nav>
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 flex flex-col gap-8">
            <ParkingInfo parkingLotId={parkingLot._id} />
            <ParkingReview />
          </div>
          <ParkingBookingForm
            parkingLotId={parkingLot._id}
            allowedPaymentMethods={parkingLot.allowedPaymentMethods}
          />
        </div>

        <div className="w-full max-w-6xl mt-12">
          <ParkingSuggestion />
        </div>
      </main>

      <Footer />
    </>
  );
}
