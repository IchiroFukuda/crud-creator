
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";

interface DropZoneProps {
  onDrop: (acceptedFiles: File[]) => void;
}

export const DropZone = ({ onDrop }: DropZoneProps) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: {
      'image/*': [],
      'audio/*': [],
      'video/*': [],
      'application/pdf': [],
    }
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "file-drop-zone",
        isDragActive && "drag-active"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center text-center">
        <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium">Drop files here or click to upload</p>
        <p className="text-sm text-muted-foreground mt-2">
          Supports images, audio, video, and PDF files
        </p>
      </div>
    </div>
  );
};
