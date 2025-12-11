"use client";

import OwnerSidebar from "@/components/layout/OwnerSidebar";
import { Suspense } from "react";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex min-w-0">
      <OwnerSidebar />
      <main className="flex-1 min-w-0 relative">
        <div
          id="owner-main-content"
          className="p-6 pt-16 lg:pt-6 transition-all duration-300"
          style={{
            paddingLeft:
              typeof window !== "undefined" &&
              window.innerWidth < 1024 &&
              document.body.classList.contains("sidebar-mobile-open")
                ? "18rem"
                : undefined,
          }}
        >
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            }
          >
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
