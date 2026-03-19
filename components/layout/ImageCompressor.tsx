//app/components/layout/ImageCompressor.tsx
"use client";

import { useRef } from "react";
import imageCompression from "browser-image-compression";

type Props = {
  onCompress: (file: File) => void;
  maxSizeKB?: number;
  children: (trigger: () => void) => React.ReactNode;
};

const ImageCompressor = ({ onCompress, maxSizeKB = 200, children }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log(`Original size: ${(file.size / 1024).toFixed(1)}KB`);

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: maxSizeKB / 1024,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        fileType: file.type as "image/jpeg" | "image/png" | "image/webp",
      });

      console.log(`Compressed size: ${(compressed.size / 1024).toFixed(1)}KB`);

      // Return as a proper File (not Blob)
      const compressedFile = new File([compressed], file.name, {
        type: compressed.type,
        lastModified: Date.now(),
      });

      onCompress(compressedFile);
    } catch (err) {
      console.error("Compression failed:", err);
    } finally {
      // Reset so same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />
      {children(() => inputRef.current?.click())}
    </>
  );
};

export default ImageCompressor;