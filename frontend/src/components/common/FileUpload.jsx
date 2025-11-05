import React, { useCallback, useState, useRef } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { X, Upload, Image, File, Video, FileText } from "lucide-react";
import uploadService from "../../services/upload.service";

const FileUpload = ({
  onUpload,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB default for images
  multiple = false,
  label = "Choose file",
  uploadText = "Upload files",
  folder = "club-marks",
  showProgress = true,
  disabled = false,
  existingUrl = "",
  previewOnly = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(existingUrl || "");
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (previewOnly) return;

      const files = Array.from(e.dataTransfer.files);
      handleFileSelection(files);
    },
    [previewOnly]
  );

  const handleFileSelect = useCallback(
    (e) => {
      if (previewOnly) return;
      const files = Array.from(e.target.files);
      handleFileSelection(files);
    },
    [previewOnly]
  );

  const handleFileSelection = (files) => {
    if (files.length === 0) return;

    // Validate file sizes
    const oversizedFiles = files.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      alert(`Some files exceed the maximum size of ${maxSize / 1024 / 1024}MB`);
      return;
    }

    // Validate file types
    const acceptedTypes = accept.split(",").map((type) => type.trim());
    window.alert(acceptedTypes);
    const invalidFiles = files.filter((file) => {
      return !acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          // Handle file extensions like .pdf, .doc, .mp4
          return file.name
            .toLowerCase()
            .endsWith(type.toLowerCase().replace(".", ""));
        } else if (type.includes("*")) {
          // Handle wildcard types like image/*, video/*, application/*
          const [category] = type.split("/*");
          return file.type.startsWith(category);
        } else {
          // Handle specific MIME types
          return file.type === type;
        }
      });
    });

    if (invalidFiles.length > 0) {
      alert(`Please select valid file types: ${accept}`);
      return;
    }

    setSelectedFiles(files);

    // Create preview for images and videos
    if (files[0]) {
      if (files[0].type.startsWith("image/")) {
        const objectUrl = URL.createObjectURL(files[0]);
        setPreviewUrl(objectUrl);
      } else if (files[0].type.startsWith("video/")) {
        const objectUrl = URL.createObjectURL(files[0]);
        setPreviewUrl(objectUrl);
      }
      // For other file types, we don't create object URLs as they can't be previewed
    }

    // Auto-upload if files are selected
    handleUpload(files);
  };

  const handleUpload = async (files = selectedFiles) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      debugger;
      // Prepare files with required metadata
      const filesWithMetadata = files.map((file) => ({
        file,
        fileName: file.name,
        fileType: file.type,
      }));

      const results = await uploadService.uploadMultipleFiles(
        filesWithMetadata,
        folder,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      if (onUpload) {
        onUpload(results);
      }

      // Store the uploaded URL for preview
      if (results[0]?.success && results[0]?.url) {
        setPreviewUrl(results[0].url);
      }

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        if (results[0]?.success) {
          setSelectedFiles([]);
        }
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFiles([]);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onUpload) {
      onUpload([{ success: true, url: "" }]); // Send empty URL to clear
    }
  };

  const handleCancelUpload = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setSelectedFiles([]);
    setPreviewUrl(existingUrl || ""); // Revert to existing URL
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) {
      return <Image className="w-8 h-8 text-blue-500" />;
    }
    if (fileType.startsWith("video/")) {
      return <Video className="w-8 h-8 text-red-500" />;
    }
    if (fileType.includes("pdf")) {
      return <FileText className="w-8 h-8 text-red-500" />;
    }
    if (fileType.includes("word") || fileType.includes("document")) {
      return <FileText className="w-8 h-8 text-blue-500" />;
    }
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const getFileTypeDisplay = (fileType) => {
    if (fileType.startsWith("image/")) return "Image";
    if (fileType.startsWith("video/")) return "Video";
    if (fileType.includes("pdf")) return "PDF Document";
    if (fileType.includes("word") || fileType.includes("document"))
      return "Word Document";
    if (fileType.includes("spreadsheet") || fileType.includes("excel"))
      return "Spreadsheet";
    return "File";
  };

  return (
    <div className="space-y-4">
      {/* Preview Section */}
      {(previewUrl || selectedFiles.length > 0) && (
        <Card className="border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {previewUrl && selectedFiles[0]?.type.startsWith("image/") ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                ) : previewUrl &&
                  selectedFiles[0]?.type.startsWith("video/") ? (
                  <video
                    src={previewUrl}
                    className="w-16 h-16 object-cover rounded-lg border"
                    muted
                  />
                ) : (
                  getFileIcon(selectedFiles[0]?.type || "image/*")
                )}
                <div>
                  <p className="font-medium text-sm">
                    {selectedFiles[0]?.name || "Existing file"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getFileTypeDisplay(selectedFiles[0]?.type || "")}
                    {selectedFiles[0]?.size && (
                      <>
                        {" "}
                        • {(selectedFiles[0]?.size / 1024 / 1024).toFixed(2)}MB
                      </>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {previewUrl ? (
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View file
                      </a>
                    ) : (
                      "No file selected"
                    )}
                  </p>
                </div>
              </div>

              {!previewOnly && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                  disabled={isUploading}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Area */}
      {!previewOnly && (
        <Card
          className={`border-2 border-dashed transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : disabled
              ? "border-gray-300 bg-gray-100 cursor-not-allowed"
              : "border-muted-foreground/25 hover:border-primary"
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
                <Upload
                  className={`w-10 h-10 mx-auto ${
                    disabled ? "text-gray-400" : "text-muted-foreground"
                  }`}
                />
                <p
                  className={`mt-2 text-sm ${
                    disabled ? "text-gray-500" : "text-muted-foreground"
                  }`}
                >
                  {disabled
                    ? "Upload disabled"
                    : "Drag and drop your file here, or click to browse"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports: {accept} • Max size: {maxSize / 1024 / 1024}MB
                </p>
              </div>

              {selectedFiles.length > 0 && !isUploading && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Ready to upload: {selectedFiles[0]?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Type: {getFileTypeDisplay(selectedFiles[0]?.type)} • Size:{" "}
                    {(selectedFiles[0]?.size / 1024 / 1024).toFixed(2)}MB
                  </p>
                </div>
              )}

              <div className="flex gap-2 flex-col sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || disabled}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {selectedFiles.length > 0 ? "Change File" : label}
                </Button>

                {selectedFiles.length > 0 && !isUploading && (
                  <Button
                    type="button"
                    onClick={() => handleUpload()}
                    disabled={isUploading}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {uploadText}
                  </Button>
                )}

                {isUploading && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelUpload}
                  >
                    Cancel
                  </Button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading || disabled}
              />

              {isUploading && showProgress && (
                <div className="w-full space-y-2 max-w-xs">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-xs text-center text-muted-foreground">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing URL Display (Read-only) */}
      {previewOnly && existingUrl && (
        <div className="text-center p-4 border rounded-lg bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Current file:{" "}
            <a
              href={existingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              View attached file
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
