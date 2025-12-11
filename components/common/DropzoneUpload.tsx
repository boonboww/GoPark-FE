"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileWithPath, FileRejection } from "react-dropzone";
import { UploadCloud } from "lucide-react";

interface DropzoneUploadProps {
  onFilesAccepted: (files: FileWithPath[]) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
}

export function DropzoneUpload({
  onFilesAccepted,
  accept = { 'image/*': ['.jpeg', '.jpg', '.png'] },
  multiple = false,
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024, // 5MB
  className = "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors",
}: DropzoneUploadProps) {
  const [rejections, setRejections] = useState<FileRejection[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[], fileRejections: FileRejection[]) => {
      setRejections(fileRejections);
      if (fileRejections.length === 0) {
        onFilesAccepted(acceptedFiles);
      }
    },
    [onFilesAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxFiles,
    maxSize,
  });

  const getErrorMessages = () => {
    const messages: string[] = [];
    rejections.forEach(({ errors }) => {
      errors.forEach((error) => {
        if (error.code === 'file-too-large') {
          messages.push(`File exceeds the maximum size of ${maxSize / (1024 * 1024)}MB`);
        } else if (error.code === 'file-invalid-type') {
          messages.push('Invalid file type');
        } else if (error.code === 'too-many-files') {
          messages.push(`Only up to ${maxFiles} file(s) allowed`);
        } else {
          messages.push(error.message);
        }
      });
    });
    return messages;
  };

  return (
    <div className="space-y-3">
      <div {...getRootProps()} className={className}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <UploadCloud className="h-10 w-10 text-gray-400" />
          {isDragActive ? (
            <p className="text-sm text-gray-600">Drop the file here...</p>
          ) : (
            <p className="text-sm text-gray-600">
              Drag & drop a file or click to select
            </p>
          )}
          <p className="text-xs text-gray-500">
            Accepted formats: {Object.values(accept).flat().join(', ')}
          </p>
        </div>
      </div>

      {rejections.length > 0 && (
        <div className="space-y-1">
          {getErrorMessages().map((message, index) => (
            <p key={index} className="text-sm text-red-500">
              {message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
