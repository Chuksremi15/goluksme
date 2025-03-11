// Create a new file: src/components/ImageUploader.tsx
import { FC } from "react";

interface ImageUploaderProps {
  uploadProgress: number;
}

export const ImageUploader: FC<ImageUploaderProps> = ({ uploadProgress }) => {
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.classList.remove("hidden");
  };

  const handleImageClear = () => {
    const img = document.getElementById("preview") as HTMLImageElement;
    if (img) {
      img.src = "";
      img.classList.add("hidden");
    }
  };

  const handleFileChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.getElementById("preview") as HTMLImageElement;
      if (img && e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <img
          id="preview"
          className="w-full h-auto rounded-lg hidden mb-2"
          alt="Preview"
          onLoad={handleImageLoad}
        />
        <button
          className="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all duration-300 cursor-pointer"
          onClick={handleImageClear}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {/* Upload Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{
              width: `${uploadProgress}%`,
              display: uploadProgress > 0 ? "block" : "none",
            }}
          ></div>
        </div>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <p className="text-sm text-gray-500 mt-1 text-center">
            Uploading... {uploadProgress}%
          </p>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="imageUpload"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileChange(file);
          }
        }}
      />
      <label
        htmlFor="imageUpload"
        className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center py-3">
          <svg
            className="w-10 h-10 mb-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 4MB</p>
        </div>
      </label>
    </div>
  );
};
