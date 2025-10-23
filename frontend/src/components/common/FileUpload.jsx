import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import fileService from "@/services/file.service";

const FileUpload = ({
  onUpload,
  accept = "*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
  label = "Choose file",
  uploadText = "Upload files",
  folder = "",
  showProgress = true,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
    handleFiles(files);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    handleFiles(files);
  }, []);

  const handleFiles = async (files) => {
    if (files.length === 0) return;

    // Validate file sizes
    const oversizedFiles = files.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      alert(`Some files exceed the maximum size of ${maxSize / 1024 / 1024}MB`);
      return;
    }

    // Validate file types if accept is specified
    if (accept !== "*") {
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      const invalidFiles = files.filter((file) => {
        return !acceptedTypes.some((type) => {
          if (type.startsWith(".")) {
            // File extension check
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          } else {
            // MIME type check
            return file.type.match(new RegExp(type.replace("*", ".*")));
          }
        });
      });

      if (invalidFiles.length > 0) {
        alert(`Some files are not of the accepted type: ${accept}`);
        return;
      }
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Use the progress callback for real progress tracking
      const progressCallback = (progress) => {
        setUploadProgress(progress);
      };

      let results;

      if (files.length === 1) {
        // Single file upload with progress
        const result = await fileService.uploadFileDirect(
          files[0],
          folder,
          progressCallback
        );
        results = [result];
      } else {
        // Multiple files upload
        results = await fileService.uploadMultipleFiles(
          files,
          folder,
          progressCallback
        );
      }

      // Ensure progress shows 100% at completion
      setUploadProgress(100);

      // Call the parent's onUpload callback with all results
      if (onUpload) {
        onUpload(results);
      }

      // Reset after successful upload
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setSelectedFiles([]);
        // Clear file input
        const fileInput = document.getElementById("file-input");
        if (fileInput) fileInput.value = "";
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleCancelUpload = () => {
    // Note: This would need proper abort controller implementation
    // for actual upload cancellation
    setIsUploading(false);
    setUploadProgress(0);
    setSelectedFiles([]);
  };

  return (
    <Card
      className={`border-2 border-dashed transition-colors ${
        isDragging
          ? "border-primary bg-primary/10"
          : disabled
          ? "border-gray-300 bg-gray-100 cursor-not-allowed"
          : "border-muted hover:border-primary"
      }`}
    >
      <CardContent className="p-6">
        <div
          className="flex flex-col items-center justify-center space-y-4"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={disabled ? undefined : handleDrop}
        >
          <div className="text-center">
            <svg
              className={`w-12 h-12 mx-auto ${
                disabled ? "text-gray-400" : "text-muted-foreground"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              />
            </svg>
            <p
              className={`mt-2 text-sm ${
                disabled ? "text-gray-500" : "text-muted-foreground"
              }`}
            >
              {disabled
                ? "Upload disabled"
                : "Drag and drop files here, or click to select"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Maximum file size: {maxSize / 1024 / 1024}MB
              {accept !== "*" && ` • Accepted: ${accept}`}
            </p>
            {folder && (
              <p className="text-xs text-primary mt-1">Folder: {folder}</p>
            )}
          </div>

          {selectedFiles.length > 0 && !isUploading && (
            <div className="text-sm text-center">
              <p className="text-muted-foreground">
                {selectedFiles.length} file(s) selected
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedFiles.map((file) => file.name).join(", ")}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("file-input").click()}
              disabled={isUploading || disabled}
            >
              {isUploading ? "Uploading..." : label}
            </Button>

            {isUploading && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelUpload}
                disabled={!isUploading}
              >
                Cancel
              </Button>
            )}
          </div>

          <input
            id="file-input"
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading || disabled}
          />

          {isUploading && showProgress && (
            <div className="w-full space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-center text-muted-foreground">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
