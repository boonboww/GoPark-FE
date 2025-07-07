"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import MapSection from "@/components/MapSection";
import PromotionSection from "@/components/PromotionSection";
import ContactSection from "@/components/ContactSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import WavyDivider from "@/components/WavyDivider";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Header />

      {/* Hero Section với overlay ngoài, đẩy xuống dưới sidebar */}
      <div
        className="relative w-full h-[500px] md:h-[600px] bg-cover bg-center mt-16 md:mt-0"
        style={{ backgroundImage: "url('/b1.jpg')" }}
      >
        {/* Overlay phủ nền nhưng không phủ nội dung */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Nội dung Hero */}
        <HeroSection />
      </div>

      <WavyDivider targetId="how" />
      <section id="how">
        <HowItWorksSection />
      </section>

      <WavyDivider targetId="map" />
      <section id="map">
        <MapSection />
      </section>

      <WavyDivider targetId="promotion" />
      <section id="promotion">
        <PromotionSection />
      </section>

      <WavyDivider targetId="test" />
      <section id="test">
        <TestimonialsSection />
      </section>

      <WavyDivider targetId="contact" />
      <section id="contact">
        <ContactSection />
      </section>

      <Footer />
    </div>
  );
}