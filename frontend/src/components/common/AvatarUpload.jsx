import React, { useCallback, useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Upload, X, User } from "lucide-react";
import uploadService from "../../services/upload.service";

const AvatarUpload = ({
  onUpload,
  existingUrl = "",
  folder = "avatars",
  maxSize = 2 * 1024 * 1024, // 2MB default for avatars
  disabled = false,

  size = "lg", // sm, md, lg, xl
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(existingUrl || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Update preview when existingUrl changes
  useEffect(() => {
    setPreviewUrl(existingUrl || "");
  }, [existingUrl]);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-20 h-20",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12",
  };

  const handleFileSelect = useCallback(
    (e) => {
      if (disabled || isUploading) return;

      const file = e.target.files[0];
      if (!file) return;

      // Validate file size
      if (file.size > maxSize) {
        alert(`File size must be less than ${maxSize / 1024 / 1024}MB`);
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file (JPEG, PNG, etc.)");
        return;
      }

      setSelectedFile(file);

      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Auto-upload the file
      handleUpload(file);
    },
    [disabled, isUploading, maxSize]
  );

  const handleUpload = async (file = selectedFile) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      console.log("Starting avatar upload:", file.name, file.type, file.size);

      const result = await uploadService.uploadFile(
        file,
        folder,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      console.log("Upload result:", result);

      if (result.success && result.url) {
        // Clean up the object URL
        if (previewUrl && previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl(result.url);
        setSelectedFile(null);

        if (onUpload) {
          onUpload(result);
        }
      } else {
        throw new Error(result.error || "Upload failed - no URL returned");
      }
    } catch (error) {
      console.error("Upload failed:", error);

      // More specific error messages
      let errorMessage = "Upload failed";
      if (error.message.includes("400")) {
        errorMessage =
          "Invalid file format or corrupted file. Please try another image.";
      } else if (error.message.includes("403")) {
        errorMessage = "Permission denied. Please contact support.";
      } else if (error.message.includes("413")) {
        errorMessage = "File too large. Please select a smaller image.";
      } else {
        errorMessage = `Upload failed: ${error.message}`;
      }

      alert(errorMessage);

      // Revert to existing URL on failure
      setPreviewUrl(existingUrl || "");
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = async () => {
    if (disabled || isUploading) return;

    // If there's an existing URL from a previous upload, delete it from S3
    if (existingUrl && existingUrl.includes("amazonaws.com")) {
      try {
        // Extract the key from the URL
        const url = new URL(existingUrl);
        const key = url.pathname.substring(1); // Remove leading slash

        await uploadService.deleteFile(key);
        console.log("Deleted old file from S3:", key);
      } catch (error) {
        console.error("Error deleting old file from S3:", error);
        // Don't prevent removal if deletion fails
      }
    }

    // Clean up object URL if it exists
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl("");
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Notify parent that avatar was removed
    if (onUpload) {
      onUpload({ success: true, url: "" });
    }
  };

  const handleContainerClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Preview */}
      <div className="relative">
        <div
          className={`
            ${sizeClasses[size]} 
            rounded-full border-2 border-dashed 
            flex items-center justify-center overflow-hidden
            transition-all duration-200
            ${
              disabled
                ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-80"
                : isUploading
                ? "border-blue-300 bg-blue-50 cursor-not-allowed"
                : "border-muted-foreground/25 hover:border-primary hover:bg-accent/50 cursor-pointer"
            }
          `}
          onClick={handleContainerClick}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Avatar preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className={`${iconSizes[size]} text-muted-foreground`} />
          )}

          {/* Upload Overlay */}
          {!disabled && !isUploading && !previewUrl && (
            <div className="absolute inset-0 bg-black/0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <div className="bg-black/50 rounded-full p-2">
                <Upload className="w-4 h-4 text-white" />
              </div>
            </div>
          )}

          {/* Change Overlay */}
          {!disabled && !isUploading && previewUrl && (
            <div className="absolute inset-0 bg-black/0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <div className="bg-black/50 rounded-full p-2">
                <Upload className="w-4 h-4 text-white" />
              </div>
            </div>
          )}

          {/* Upload Progress Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <Progress
                  value={uploadProgress}
                  className="w-16 h-2 mb-2 bg-white/30"
                />
                <span className="text-xs text-white font-medium">
                  {uploadProgress}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Remove Button */}
        {previewUrl && !disabled && !isUploading && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full shadow-md"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* File Input (Hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Help Text */}
      <div className="text-center space-y-1">
        <p className="text-sm text-muted-foreground">
          {previewUrl ? "Click to change avatar" : "Click to upload avatar"}
        </p>
        <p className="text-xs text-muted-foreground">
          Supports: JPEG, PNG, WebP • Max: {maxSize / 1024 / 1024}MB
        </p>

        {isUploading && (
          <p className="text-xs text-blue-600 font-medium">
            Uploading... {uploadProgress}%
          </p>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;
