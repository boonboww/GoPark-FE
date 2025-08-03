"use client";

import OwnerSidebar from "@/components/OwnerSidebar";
import { Suspense } from "react";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <OwnerSidebar />
      <main className="flex-1 lg:ml-72 ml-0 transition-all duration-300">
        <div className="p-6 pt-20 lg:pt-6">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          }>
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
