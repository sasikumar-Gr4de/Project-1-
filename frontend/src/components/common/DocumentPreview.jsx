import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, X } from "lucide-react";

const DocumentPreview = ({
  documentUrl,
  documentName,
  onClose,
  className = "",
  showDownload = true,
}) => {
  if (!documentUrl) {
    return (
      <Card className={`bg-[#1A1A1A] border-[#343434] ${className}`}>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center text-[#B0AFAF]">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No document available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPdf = documentUrl.toLowerCase().endsWith(".pdf");

  return (
    <Card className={`bg-[#1A1A1A] border-[#343434] relative ${className}`}>
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#343434]">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-white font-medium text-sm truncate">
              {documentName || "Document Preview"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {showDownload && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(documentUrl, "_blank")}
                className="bg-[#343434] border-[#343434] text-white hover:bg-[#4A4A4A] h-8 px-3"
              >
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
            )}
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-[#343434]"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Preview Content */}
        <div className="aspect-video bg-[#262626]">
          {isPdf ? (
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(
                documentUrl
              )}&embedded=true`}
              className="w-full h-full rounded-b-lg"
              title="Document preview"
              frameBorder="0"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-[#B0AFAF]">
                <FileText className="w-16 h-16 mx-auto mb-3 opacity-50" />
                <p>Preview not available for this file type</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(documentUrl, "_blank")}
                  className="mt-3 bg-[#343434] border-[#343434] text-white hover:bg-[#4A4A4A]"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download to View
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentPreview;
