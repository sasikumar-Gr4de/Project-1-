import React, { Component } from "react";
import FileUpload from "@/components/common/FileUpload";

const ServerFileUpload = () => {
  const onUploadHandler = (results) => {
    const result = results[0];
    const { url } = result;
    window.alert(`Uploded Url : ${url}`);
  };
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-6xl m-6">
        <FileUpload
          accept="image/*"
          folder="server"
          // maxSize={100 * 1024 * 1024}
          // multiple={false}
          uploadText="Upload to Server"
          onUpload={onUploadHandler}
        />
      </div>
      <div className="container mx-auto max-w-6xl m-6">
        <FileUpload
          accept="video/*"
          folder="server"
          maxSize={100 * 1024 * 1024}
          // multiple={false}
          uploadText="Upload to Server"
          onUpload={onUploadHandler}
        />
      </div>
    </div>
  );
};

export default ServerFileUpload;
