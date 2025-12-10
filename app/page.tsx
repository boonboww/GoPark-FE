"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import MapSection from "@/components/MapSection";
// import PromotionSection from "@/components/PromotionSection";
import ContactSection from "@/components/ContactSection";
// import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import WavyDivider from "@/components/WavyDivider";
import PublicOnlyGuard from "@/components/PublicOnlyGuard";
import HowItWorkUserSection from "@/components/HowItWorkUserSection";
import HowItWorkOwnerSection from "@/components/HowItWorkOwnerSection";
import VideoSection from "@/components/VideoSection";

export default function Home() {
  return (
    <PublicOnlyGuard>
      <div className="flex flex-col min-h-screen relative">
        {/* Fixed Map Background - Always stays at the back */}
        <div className="fixed inset-0 z-0">
          <MapSection />
        </div>

        {/* Scrollable Content Layer */}
        <div className="relative z-10">
          {/* Header & Hero - Wrapped to ensure they cover the map */}
          <div className="bg-white">
            <Header isHomepage />
            <HeroSection />
          </div>

          {/* Upper Content Sections - White background covers the map */}
          <div className="bg-white pb-20">
            <WavyDivider targetId="video" />
            <section id="video" className="scroll-mt-20">
              <VideoSection />
            </section>

            {/* <WavyDivider targetId="how" />
            <section id="how" className="scroll-mt-20">
              <HowItWorksSection />
            </section> */}

            <WavyDivider targetId="how-user" />
            <section id="how-user" className="scroll-mt-20">
              <HowItWorkUserSection />
            </section>

            <WavyDivider targetId="how-owner" />
            <section id="how-owner" className="scroll-mt-20">
              <HowItWorkOwnerSection />
            </section>
          </div>

          {/* Transparent Window - Reveals the fixed MapSection behind */}
          <div className="h-screen w-full pointer-events-none"></div>

          {/* Lower Content Sections - White background covers the map again */}
          <div className="bg-white pt-20">
            {/* <WavyDivider targetId="promotion" />
            <section id="promotion" className="scroll-mt-20">
              <PromotionSection />
            </section> */}

            <WavyDivider targetId="test" />
            <section id="test" className="scroll-mt-20">
              <TestimonialsSection />
            </section>

            <WavyDivider targetId="contact" />
            <section id="contact" className="scroll-mt-20">
              <ContactSection />
            </section>
            
            <Footer />
          </div>
        </div>
      </div>
    </PublicOnlyGuard>
  );
}
