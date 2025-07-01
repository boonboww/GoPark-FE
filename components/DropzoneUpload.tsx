// components/DropzoneUpload.tsx
"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface DropzoneUploadProps {
  onFilesAccepted: (files: File[]) => void;
}

export function DropzoneUpload({ onFilesAccepted }: DropzoneUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesAccepted(acceptedFiles);
  }, [onFilesAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className="border border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the image here ...</p>
      ) : (
        <p>Drag and drop an image here, or click to select one</p>
      )}
    </div>
  );
}
