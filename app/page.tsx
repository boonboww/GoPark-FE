"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MapSection from "@/components/MapSection";
import PromotionSection from "@/components/PromotionSection";
import WavyDivider from "@/components/WavyDivider";

export default function Home() {
  return (
    <div className="flex flex-col ">
      <Header />
      <section id="hero">
        <HeroSection />
      </section>

      <WavyDivider targetId="map" />

      <section id="map">
        <MapSection />
      </section>

      <WavyDivider targetId="promotion" />

      <section id="promotion">
        <PromotionSection />
      </section>

      <Footer />
    </div>
  );
}
