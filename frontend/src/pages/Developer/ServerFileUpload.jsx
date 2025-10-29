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
          onUpload={onUploadHandler}
        />
      </div>
    </div>
  );
};

export default ServerFileUpload;
