"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AiOutlineArrowLeft,
  AiOutlineCamera,
  AiOutlineUpload,
  AiOutlineScan,
  AiOutlineClose,
  AiOutlineCheckCircle,
  AiOutlineLoading3Quarters,
  AiOutlinePicture,
} from "react-icons/ai";
import { Button } from "@/components/ui/button";

export default function LicensePlateScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const router = useRouter();

  const [plate, setPlate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [useRear, setUseRear] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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

  // 📝 Scan ảnh
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
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-4 sm:p-8">
      {/* Back button fixed */}
      <div className="absolute top-4 left-4 z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/owner/parking")}
          className="flex items-center gap-2 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <AiOutlineArrowLeft className="text-xl" />
          <span className="hidden sm:inline">Quay lại</span>
        </Button>
      </div>

      <div className="max-w-3xl mx-auto pt-12 flex flex-col items-center animate-fadeIn">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <AiOutlineCamera className="text-blue-600" />
          Quét Biển Số Xe
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-2xl">
          Nhanh chóng nhận diện biển số xe bằng camera hoặc tải ảnh từ thiết bị
        </p>

        {/* Camera preview */}
        {showCamera && (
          <div className="w-full relative rounded-2xl shadow-lg overflow-hidden border border-gray-300 dark:border-gray-700 mb-4 bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto object-cover"
            />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={() => setShowCamera(false)}
              className="absolute top-2 right-2 z-10"
              aria-label="Đóng camera"
            >
              <AiOutlineClose />
            </Button>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mb-2">
          <Button
            type="button"
            onClick={() => setShowCamera(true)}
            variant="default"
            className="flex-1 flex items-center gap-2"
          >
            <AiOutlineCamera />
            Chụp bằng Camera
          </Button>
          <label className="flex-1">
            <Button
              asChild
              type="button"
              variant="secondary"
              className="w-full flex items-center gap-2 cursor-pointer"
            >
              <span>
                <AiOutlineUpload /> Tải ảnh lên
              </span>
            </Button>
            <input type="file" accept="image/*" onChange={uploadAndPreview} className="hidden" />
          </label>
        </div>

        {/* Capture & Scan */}
        {showCamera && (
          <Button
            type="button"
            onClick={captureAndPreview}
            variant="outline"
            className="w-full flex items-center gap-2 mb-2"
          >
            <AiOutlinePicture /> Chụp & Xem trước
          </Button>
        )}

        {selectedFile && (
          <Button
            type="button"
            onClick={handleScanClick}
            disabled={isLoading}
            variant="default"
            className="w-full flex items-center gap-2 mb-2"
          >
            {isLoading ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              <AiOutlineScan />
            )}
            {isLoading ? "Đang xử lý..." : "Quét biển số"}
          </Button>
        )}

        {/* Preview ảnh */}
        {previewUrl && (
          <div className="w-full mt-4 p-3 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-sm bg-white dark:bg-gray-800">
            <p className="text-gray-800 dark:text-gray-200 mb-2 font-semibold text-center flex items-center gap-1 justify-center">
              <AiOutlinePicture /> Ảnh xem trước:
            </p>
            <img src={previewUrl} alt="Preview" className="w-full h-auto rounded-xl border border-gray-200 dark:border-gray-600" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/40 p-3 rounded-xl w-full text-center mt-4 flex items-center gap-2 justify-center">
            <AiOutlineClose className="text-lg" /> {error}
          </div>
        )}

        {/* Result */}
        {plate && (
          <div className="w-full p-5 bg-green-50 dark:bg-green-900/40 rounded-2xl shadow flex flex-col items-center space-y-3 mt-4">
            <h2 className="text-lg font-semibold text-green-800 dark:text-green-300 flex items-center gap-2">
              <AiOutlineCheckCircle className="text-green-600 dark:text-green-400" /> Nhận dạng thành công
            </h2>
            <p className="text-2xl font-mono bg-white dark:bg-gray-700 p-3 rounded-lg shadow w-full text-center border border-green-200 dark:border-green-600">
              {plate}
            </p>
          </div>
        )}

        <canvas ref={canvasRef} hidden />
      </div>
    </div>
  );
}
