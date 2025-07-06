import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GoPark - Smart Parking Booking",
  description:
    "Book your parking spot easily with GoPark - smart, fast, and reliable parking solutions.",
  keywords: [
    "GoPark",
    "parking",
    "smart parking",
    "booking",
    "đặt chỗ xe",
    "bãi đỗ xe",
  ],
  
  openGraph: {
    title: "GoPark - Smart Parking Booking",
    description: "Find and reserve your parking spot in seconds with GoPark.",
    url: "https://go-park-fe.vercel.app",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
