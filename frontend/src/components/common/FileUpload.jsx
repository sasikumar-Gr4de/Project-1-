import React, { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import fileService from "../../../services/file.service";

const FileUpload = ({
  onUpload,
  accept = "*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
  label = "Choose file",
  uploadText = "Upload files",
  folder = "", // 'player-avatars/', 'team-marks/', 'match-videos/'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

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
    handleFiles(files);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
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

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Use direct S3 upload for better performance
      const uploadPromises = files.map(async (file) => {
        const result = await fileService.uploadFileDirect(file, folder);

        if (result.success) {
          return {
            success: true,
            url: result.fileUrl,
            key: result.key,
            fileName: result.fileName,
            type: file.type,
            size: file.size,
          };
        } else {
          return {
            success: false,
            error: result.error,
            fileName: file.name,
          };
        }
      });

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const results = await Promise.all(uploadPromises);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Call the parent's onUpload callback with all results
      if (onUpload) {
        onUpload(results);
      }

      // Reset after successful upload
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card
      className={`border-2 border-dashed transition-colors ${
        isDragging
          ? "border-primary bg-primary/10"
          : "border-muted hover:border-primary"
      }`}
    >
      <CardContent className="p-6">
        <div
          className="flex flex-col items-center justify-center space-y-4"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <svg
              className="w-12 h-12 mx-auto text-muted-foreground"
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
            <p className="mt-2 text-sm text-muted-foreground">
              Drag and drop files here, or click to select
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Maximum file size: {maxSize / 1024 / 1024}MB
            </p>
            {folder && (
              <p className="text-xs text-primary mt-1">Folder: {folder}</p>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("file-input").click()}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : label}
          </Button>

          <input
            id="file-input"
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />

          {isUploading && (
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
