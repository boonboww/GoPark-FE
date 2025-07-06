"use client";
import dynamic from "next/dynamic";

const CitiMap = dynamic(() => import("./CitiMapClient"), { ssr: false });

export default function Page() {
  return <CitiMap />;
}