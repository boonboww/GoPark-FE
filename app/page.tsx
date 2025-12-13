"use client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import MapSection from "@/components/sections/MapSection";
// import PromotionSection from "@/components/sections/PromotionSection";
import ContactSection from "@/components/sections/ContactSection";
// import HowItWorksSection from "@/components/sections/HowItWorksSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import WavyDivider from "@/components/common/WavyDivider";
import PublicOnlyGuard from "@/components/features/auth/PublicOnlyGuard";
import HowItWorkUserSection from "@/components/sections/HowItWorkUserSection";
import HowItWorkOwnerSection from "@/components/sections/HowItWorkOwnerSection";
import VideoSection from "@/components/sections/VideoSection";

export default function Home() {
  return (
    <PublicOnlyGuard>
      <div className="flex flex-col min-h-screen relative">
        {/* Fixed Map Background - Always stays at the back */}
        <div className="fixed inset-0 z-0">
          <MapSection />
        </div>

        {/* Scrollable Content Layer */}
        <div className="relative z-10 pointer-events-none">
          {/* Header & Hero - Wrapped to ensure they cover the map */}
          <div className="bg-white pointer-events-auto">
            <Header isHomepage />
            <HeroSection />
          </div>

          {/* Upper Content Sections - White background covers the map */}
          <div className="bg-white pb-20 pointer-events-auto">
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
          <div className="h-screen w-full"></div>

          {/* Lower Content Sections - White background covers the map again */}
          <div className="bg-white pt-20 pointer-events-auto">
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
