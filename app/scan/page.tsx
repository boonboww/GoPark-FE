"use client";
import { useRef, useState, useEffect } from "react";

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [plate, setPlate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [useRear, setUseRear] = useState(true); // 🔄 camera sau mặc định

  // 📌 API base url
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  // 🚀 Hàm mở camera
  const startCamera = async () => {
    try {
      const facingMode = useRear ? "environment" : "user";
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Không mở được camera:", err);
      setError("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  // 🎬 Mở camera khi load và khi đổi camera
  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [useRear]);

  // 📸 Capture từ camera
  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsLoading(true);
    setError("");

    try {
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        const formData = new FormData();
        formData.append("file", blob, "capture.jpg");

        const res = await fetch(`${API_BASE_URL}/api/v1/plate/scan`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.success) {
          setPlate(data.plate);
        } else {
          setError(data.error || "Không đọc được biển số");
        }

        setIsLoading(false);
      }, "image/jpeg");
    } catch {
      setError("Lỗi khi xử lý ảnh");
      setIsLoading(false);
    }
  };

  // 📤 Upload ảnh từ máy
  const uploadAndScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);

      const res = await fetch(`${API_BASE_URL}/api/v1/plate/scan`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setPlate(data.plate);
      } else {
        setError(data.error || "Không đọc được biển số");
      }
    } catch {
      setError("Lỗi khi tải lên ảnh");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-2xl font-bold">Quét Biển Số Xe</h1>

      {/* Camera */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded shadow w-full max-w-md"
      />
      <canvas ref={canvasRef} width={640} height={480} hidden />

      {/* Nút chuyển đổi camera */}
      <button
        onClick={() => setUseRear(!useRear)}
        className="px-4 py-2 bg-gray-600 text-white rounded shadow"
      >
        🔄 Đổi sang camera {useRear ? "trước" : "sau"}
      </button>

      {/* Capture */}
      <button
        onClick={captureAndScan}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded shadow disabled:bg-gray-400"
      >
        {isLoading ? "🔄 Đang xử lý..." : "📸 Chụp & Quét biển số"}
      </button>

      {/* Upload */}
      <div className="flex flex-col items-center">
        <p className="mb-2">Hoặc tải ảnh lên</p>
        <input
          type="file"
          accept="image/*"
          onChange={uploadAndScan}
          disabled={isLoading}
          className="mt-2"
        />
      </div>

      {/* Loading */}
      {isLoading && <div className="text-blue-600">🔄 Đang xử lý ảnh...</div>}

      {/* Error */}
      {error && (
        <div className="text-red-600 bg-red-100 p-3 rounded">
          ❌ {error}
        </div>
      )}

      {/* Result */}
      {plate && (
        <div className="mt-4 p-4 bg-green-100 rounded-lg">
          <h2 className="text-lg font-semibold">✅ Nhận dạng thành công</h2>
          <p className="text-xl font-mono bg-white p-2 rounded mt-2">
            Biển số: {plate}
          </p>
        </div>
      )}
    </div>
  );
}
