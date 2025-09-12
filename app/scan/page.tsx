"use client";
import { useRef, useState, useEffect } from "react";

export default function LicensePlateScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [plate, setPlate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [useRear, setUseRear] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ;
   // || "http://localhost:5000"

  // 🚀 Start camera
  const startCamera = async () => {
    try {
      const facingMode = useRear ? "environment" : "user";
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Không mở được camera:", err);
      setError("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  useEffect(() => {
    if (showCamera) startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [useRear, showCamera]);

  // 📸 Capture từ camera
  const captureAndPreview = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setSelectedFile(new File([blob], "capture.jpg", { type: "image/jpeg" }));
    }, "image/jpeg");
  };

  // 📝 Scan ảnh (camera hoặc upload)
  const scanImage = async (file: File) => {
    setIsLoading(true);
    setError("");
    setPlate("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${API_BASE_URL}/api/v1/ocr`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setPlate(data.plate || "");
        if (data.previewUrl) setPreviewUrl(data.previewUrl);
      } else {
        setError(data.message || "Không nhận diện được biển số");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi khi xử lý ảnh");
    }

    setIsLoading(false);
  };

  const uploadAndPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const url = URL.createObjectURL(file);

    setPreviewUrl(url);
    setSelectedFile(file);
    setShowCamera(false);
  };

  const handleScanClick = () => {
    if (selectedFile) scanImage(selectedFile);
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-800">📷 Quét Biển Số Xe</h1>

      {/* Camera preview */}
      {showCamera && (
        <div className="w-full relative rounded-lg shadow-lg overflow-hidden border border-gray-300">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto object-cover"
          />
          <button
            onClick={() => setShowCamera(false)}
            className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full shadow hover:bg-red-600"
          >
            ✖
          </button>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 w-full">
        <button
          onClick={() => setShowCamera(true)}
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          📸 Chụp bằng Camera
        </button>
        <label className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg shadow text-center cursor-pointer hover:bg-green-700 transition">
          ⬆️ Tải ảnh lên
          <input type="file" accept="image/*" onChange={uploadAndPreview} className="hidden" />
        </label>
      </div>

      {/* Capture & Scan */}
      {showCamera && (
        <button
          onClick={captureAndPreview}
          className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          📷 Chụp & Xem trước
        </button>
      )}

      {selectedFile && (
        <button
          onClick={handleScanClick}
          disabled={isLoading}
          className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition disabled:bg-gray-400"
        >
          {isLoading ? "🔄 Đang xử lý..." : "🔍 Quét biển số"}
        </button>
      )}

      {/* Preview ảnh */}
      {previewUrl && (
        <div className="w-full mt-4 p-2 border border-gray-300 rounded-lg shadow">
          <p className="text-gray-700 mb-2 font-semibold text-center">Ảnh xem trước:</p>
          <img src={previewUrl} alt="Preview" className="w-full h-auto rounded" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-red-700 bg-red-100 p-3 rounded w-full text-center">{error}</div>
      )}

      {/* Result */}
      {plate && (
        <div className="w-full p-4 bg-green-100 rounded-lg shadow flex flex-col items-center space-y-3">
          <h2 className="text-lg font-semibold text-green-800">✅ Nhận dạng thành công</h2>
          <p className="text-xl font-mono bg-white p-2 rounded shadow w-full text-center">{plate}</p>
        </div>
      )}

      <canvas ref={canvasRef} hidden />
    </div>
  );
}
