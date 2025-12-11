"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, CheckCircle2, Upload, Database, MapPin } from "lucide-react";

interface LoadingModalProps {
  open: boolean;
  currentStep: 'creating' | 'uploading' | 'updating' | 'completed';
  progress?: number;
}

const LoadingModal = ({ open, currentStep, progress = 0 }: LoadingModalProps) => {
  const getStepInfo = () => {
    switch (currentStep) {
      case 'creating':
        return {
          icon: <MapPin className="w-8 h-8 text-blue-600" />,
          title: "Đang tạo bãi đậu xe...",
          description: "Khởi tạo thông tin bãi đậu xe mới",
          color: "blue"
        };
      case 'uploading':
        return {
          icon: <Upload className="w-8 h-8 text-orange-600" />,
          title: "Đang tải ảnh lên...",
          description: "Upload hình ảnh lên Supabase Storage",
          color: "orange"
        };
      case 'updating':
        return {
          icon: <Database className="w-8 h-8 text-purple-600" />,
          title: "Đang cập nhật dữ liệu...",
          description: "Lưu thông tin ảnh vào cơ sở dữ liệu",
          color: "purple"
        };
      case 'completed':
        return {
          icon: <CheckCircle2 className="w-8 h-8 text-green-600" />,
          title: "Hoàn thành!",
          description: "Bãi đậu xe đã được tạo thành công",
          color: "green"
        };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="sr-only">Loading Progress</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
          {/* Icon với animation */}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 relative ${
            stepInfo.color === 'blue' ? 'bg-blue-100' :
            stepInfo.color === 'orange' ? 'bg-orange-100' :
            stepInfo.color === 'purple' ? 'bg-purple-100' :
            'bg-green-100'
          }`}>
            {currentStep !== 'completed' ? (
              <>
                {stepInfo.icon}
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-gray-300 animate-spin"></div>
              </>
            ) : (
              <div className="animate-bounce">
                {stepInfo.icon}
              </div>
            )}
          </div>
          
          {/* Tiêu đề */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {stepInfo.title}
          </h3>
          
          {/* Mô tả */}
          <p className="text-gray-600 mb-6 text-sm">
            {stepInfo.description}
          </p>
          
          {/* Progress bar */}
          {currentStep !== 'completed' && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ease-out ${
                  stepInfo.color === 'blue' ? 'bg-blue-600' :
                  stepInfo.color === 'orange' ? 'bg-orange-600' :
                  stepInfo.color === 'purple' ? 'bg-purple-600' :
                  'bg-green-600'
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
          
          {/* Dots animation cho loading */}
          {currentStep !== 'completed' && (
            <div className="flex space-x-1">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                stepInfo.color === 'blue' ? 'bg-blue-600' :
                stepInfo.color === 'orange' ? 'bg-orange-600' :
                stepInfo.color === 'purple' ? 'bg-purple-600' :
                'bg-green-600'
              }`}></div>
              <div className={`w-2 h-2 rounded-full animate-pulse delay-100 ${
                stepInfo.color === 'blue' ? 'bg-blue-600' :
                stepInfo.color === 'orange' ? 'bg-orange-600' :
                stepInfo.color === 'purple' ? 'bg-purple-600' :
                'bg-green-600'
              }`}></div>
              <div className={`w-2 h-2 rounded-full animate-pulse delay-200 ${
                stepInfo.color === 'blue' ? 'bg-blue-600' :
                stepInfo.color === 'orange' ? 'bg-orange-600' :
                stepInfo.color === 'purple' ? 'bg-purple-600' :
                'bg-green-600'
              }`}></div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingModal;