// src/components/ui/ImageUploader.tsx

"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UploadCloud, File as FileIcon, X } from "lucide-react";

interface ImageUploaderProps {
  onFileSelect: (file: File | undefined) => void;
  initialFile?: File | null;
}

export const ImageUploader = ({ onFileSelect }: ImageUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | undefined) => {
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    handleFileChange(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onFileSelect(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e.target.files?.[0])}
        className="hidden"
        accept="image/png, image/jpeg, image/gif"
      />
      {!selectedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "mt-1 border-2 border-dashed border-border rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors",
            isDragging && "border-primary bg-muted/50"
          )}
        >
          <div className="text-muted-foreground text-center">
            <UploadCloud className="text-3xl mb-2 mx-auto" />
            <p>Nhấp hoặc kéo thả ảnh vào đây</p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            PNG, JPG, GIF (tối đa 2MB)
          </p>
        </div>
      ) : (
        <div className="mt-2 flex items-start justify-between p-3 border rounded-md bg-muted/50">
          <div className="flex items-start gap-2 min-w-0">
            <FileIcon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <span className="text-sm font-medium break-all">
              {selectedFile.name}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 flex-shrink-0"
            onClick={handleRemoveFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
