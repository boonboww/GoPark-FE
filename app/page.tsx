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
    <div className="flex flex-col min-h-screen">
      {/* Header với background trong suốt */}
      <Header isHomepage />

      {/* Hero Section với video background */}
      <HeroSection />

      {/* Các section nội dung khác */}
      <div className="space-y-12 md:space-y-24 bg-white">
        <WavyDivider targetId="how" />
        <section id="how" className="scroll-mt-20">
          <HowItWorksSection />
        </section>

        <WavyDivider targetId="map" />
        <section id="map" className="scroll-mt-20">
          <MapSection />
        </section>

        <WavyDivider targetId="promotion" />
        <section id="promotion" className="scroll-mt-20">
          <PromotionSection />
        </section>

        <WavyDivider targetId="test" />
        <section id="test" className="scroll-mt-20">
          <TestimonialsSection />
        </section>

        <WavyDivider targetId="contact" />
        <section id="contact" className="scroll-mt-20">
          <ContactSection />
        </section>
      </div>

      <Footer />
    </div>
  );
}