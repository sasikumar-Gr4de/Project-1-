import React from "react";
import FileUpload from "@/components/common/FileUpload";

const VideoUpload = ({ onUpload, maxSize = 100 * 1024 * 1024 }) => {
  return (
    <FileUpload
      onUpload={onUpload}
      accept="video/*"
      maxSize={maxSize}
      label="Select video"
      uploadText="Upload video"
    />
  );
};

export default VideoUpload;
