"use client";

import OwnerSidebar from "@/components/OwnerSidebar";
import { useState } from "react";
import { Suspense } from "react";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Sidebar: overlay on mobile, relative on desktop */}
      <div className={`fixed z-40 lg:static lg:z-auto transition-all duration-300 ${isCollapsed ? 'w-16 min-w-[56px]' : 'w-72'} ${isCollapsed ? 'lg:w-16' : 'lg:w-72'} h-screen lg:h-auto flex-shrink-0`}>
        <OwnerSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>
      {/* Main content: flex-1 on desktop, full width on mobile */}
      <main className="w-full lg:flex-1 transition-all duration-300">
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
