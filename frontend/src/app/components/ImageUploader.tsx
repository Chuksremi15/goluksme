// Create a new file: src/components/ImageUploader.tsx
import { Button } from "@heroui/react";
import { FC, useRef, useState } from "react";
import { CircularProgressBar } from "./CircularProgressBar";
import {
  getStorage,
  sRef,
  uploadBytesResumable,
  getDownloadURL,
} from "../../config/firebase";
import { FormikErrors } from "formik";

interface ImageUploaderProps {
  // uploadProgress: number;
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) =>
    | Promise<void>
    | Promise<
        FormikErrors<{
          title: string;
          description: string;
          imgUrl: string;
          target: string;
        }>
      >;
}

export const ImageUploader: FC<ImageUploaderProps> = ({ setFieldValue }) => {
  const [file, setFile] = useState<File | null>(null);
  const [, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [, setUploadedImageUrl] = useState<string>("");
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleImageClear = () => {
    setFile(null);
    setPreviewUrl("");
    setIsPreviewVisible(false);
    setUploadProgress(0);
    setFieldValue("imgUrl", "");
  };

  const handleFileChange = (file: File) => {
    setFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsPreviewVisible(true);
    setError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];

    if (file) {
      if (file.type.startsWith("image/")) {
        handleFileChange(file);
      } else {
        setError("Please select an Image file (png or jpeg)");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];

    if (selected) {
      if (selected.type.startsWith("image/")) {
        handleFileChange(selected);
      } else {
        setError("Please select an Image file (png or jpeg)");
      }
    }
  };

  const uploadToFirebase = async (file: File) => {
    if (!file) return;

    try {
      setIsLoading(true);
      // Create a storage reference
      const storage = getStorage();
      const storageRef = sRef(storage, `images/${Date.now()}-${file.name}`);

      // Start upload task
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Monitor upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          setError("Failed to upload image");
          setIsLoading(false);
        },
        async () => {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploadedImageUrl(downloadURL);

          setFieldValue("imgUrl", downloadURL);
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Error during upload:", error);
      setError("Failed to upload image");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative pt-3">
      <div className="flex gap-x-2">
        <div className="relative ">
          <img
            className={`w-[240px] h-[140px] object-cover rounded-lg mb-2 ${isPreviewVisible ? "" : "hidden"}`}
            alt="Preview"
            src={previewUrl}
            onLoad={() => setIsPreviewVisible(true)}
          />
          {isPreviewVisible && (
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
          )}
        </div>
        {/* Upload Progress Bar */}
        <div className="mt-4">
          {isPreviewVisible && (
            <div className="relative flex flex-col items-center justify-center gap-y-4">
              <div className="relative h-[60px] w-[60px]">
                <CircularProgressBar
                  percentage={uploadProgress}
                  size={65}
                  strokeWidth={8}
                  color="text-[#41A072]"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center  text-sm">
                  {Math.round(uploadProgress)}%
                </div>
              </div>

              <Button
                className=" bg-white text-black flex font-medium justify-center items-center text-sm border px-6 w-[100px] font-body rounded-full border-gray-400 max-w-[150px] hover:bg-gray-200 cursor-pointer transition-all duration-500"
                onPress={() => {
                  file && uploadToFirebase(file);
                }}
                isLoading={isLoading}
                disabled={isLoading}
              >
                Upload
              </Button>
            </div>
          )}
        </div>
      </div>

      {!isPreviewVisible && (
        <>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="imageUpload"
            ref={inputFileRef}
            onChange={handleInputChange}
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
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 4MB</p>
            </div>
          </label>
        </>
      )}
    </div>
  );
};
