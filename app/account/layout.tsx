import MapControlsScene from "@/components/common/MapControlsScene";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50">
      {/* 3D Map Background - Persisted across routes */}
      <div className="absolute inset-0 w-full h-full z-0">
        <MapControlsScene />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
