"use client";
import { useSearchParams } from "next/navigation";
import { ResetTable } from "@/components/ResetTable";

export default function Page() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ResetTable />
      </div>
    </div>
  );
}
