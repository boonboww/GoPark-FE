"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface LogoutConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
}: LogoutConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden gap-0 pointer-events-auto">
        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <LogOut className="w-6 h-6 text-red-600" />
          </div>
          
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-bold text-center">Đăng xuất</DialogTitle>
          </DialogHeader>
          
          <DialogDescription className="text-center text-gray-500 mb-6">
            Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
          </DialogDescription>

          <div className="flex gap-3 w-full">
            <Button 
              variant="outline" 
              className="flex-1 cursor-pointer" 
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              className="flex-1 bg-red-600 hover:bg-red-700 cursor-pointer" 
              onClick={onConfirm}
            >
              Đăng xuất
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
