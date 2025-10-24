import React, { Component } from "react";
import FileUpload from "@/components/common/FileUpload";

const ServerFileUpload = () => {
  const onUploadHandler = (results) => {
    console.log(results);
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
