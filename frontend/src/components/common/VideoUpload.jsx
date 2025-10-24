import React from "react";
import FileUpload from "@/components/common/FileUpload";

const VideoUpload = ({
  onUpload,
  maxSize = 100 * 1024 * 1024, // 100MB default for videos
  folder = "videos",
  showProgress = true,
  disabled = false,
  existingUrl = "",
  previewOnly = false,
  multiple = false,
  label = "Select video",
  uploadText = "Upload video",
}) => {
  return (
    <FileUpload
      onUpload={onUpload}
      accept="video/*"
      maxSize={maxSize}
      folder={folder}
      showProgress={showProgress}
      disabled={disabled}
      existingUrl={existingUrl}
      previewOnly={previewOnly}
      multiple={multiple}
      label={label}
      uploadText={uploadText}
    />
  );
};

export default VideoUpload;
