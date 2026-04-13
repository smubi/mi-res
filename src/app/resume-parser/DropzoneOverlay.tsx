"use client";

import { useState, useEffect } from "react";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

export const DropzoneOverlay = ({ onDrop }: { onDrop: (file: File) => void }) => {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      // Only stop dragging if we leave the window
      if (e.relatedTarget === null) {
        setIsDragging(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer?.files[0];
      if (file && file.type === "application/pdf") {
        onDrop(file);
      }
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, [onDrop]);

  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-sky-500/90 backdrop-blur-sm transition-all">
      <div className="flex flex-col items-center gap-4 text-white">
        <div className="rounded-full bg-white/20 p-8 ring-4 ring-white/30">
          <CloudArrowUpIcon className="h-16 w-16 animate-bounce" />
        </div>
        <h2 className="text-3xl font-bold">Drop your resume here</h2>
        <p className="text-lg opacity-80">We'll handle the rest</p>
      </div>
    </div>
  );
};