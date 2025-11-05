import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { usePassportStore } from "@/store/passportStore";
import { useToast } from "@/contexts/ToastContext";
import FileUpload from "@/components/common/FileUpload";
import DocumentPreview from "@/components/common/DocumentPreview";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  AlertCircle,
  Eye,
  Info,
} from "lucide-react";

const DocumentUploadStep = ({ onComplete, currentStep }) => {
  const { user } = useAuthStore();
  const { uploadVerification, passport, fetchPlayerPassport } =
    usePassportStore();
  const { toast } = useToast();
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  useEffect(() => {
    if (passport?.verifications) {
      const docs = passport.verifications.map((doc) => ({
        ...doc,
        typeInfo: documentTypes.find((dt) => dt.value === doc.document_type),
      }));
      setUploadedDocuments(docs);
    }
  }, [passport?.verifications]);

  const documentTypes = [
    {
      value: "passport",
      label: "Passport or ID Card",
      description: "Government-issued photo identification",
      help: "Ensure all details are clearly visible and not expired",
    },
    {
      value: "club_letter",
      label: "Club Registration Letter",
      description: "Official letter from your football club",
      help: "Must include club letterhead and registration details",
    },
    {
      value: "consent",
      label: "Parental Consent Form",
      description: "Required for players under 18 years old",
      help: "Signed by parent/guardian with contact information",
    },
  ];

  const handleDocumentUpload = async (result) => {
    const fileResult = result[0];
    if (!fileResult.success || !selectedDocumentType) {
      toast({
        title: "Upload failed",
        description: fileResult.error || "Please select document type",
        variant: "destructive",
      });
      return;
    }

    // Validate file type (PDF only)
    if (!fileResult.type.includes("pdf")) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF files only",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      await uploadVerification(user.id, {
        document_type: selectedDocumentType,
        file_url: fileResult.url,
      });

      // Refresh passport data
      await fetchPlayerPassport(user.id);

      toast({
        title: "Success",
        description: "Document uploaded for verification",
        variant: "success",
      });

      // Reset selection
      setSelectedDocumentType("");

      // Automatically proceed to next step since any document is sufficient
      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    } catch (error) {
      console.error("Failed to upload document:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getDocumentStatus = (documentType) => {
    if (!passport?.verifications) return null;
    const doc = passport.verifications.find(
      (v) => v.document_type === documentType
    );
    return doc ? doc.status : null;
  };

  const hasAnyDocument = () => {
    return uploadedDocuments.some(
      (doc) => doc.file_url && doc.file_url.trim() !== ""
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <FileText className="w-5 h-5 text-[#B0AFAF]" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            Under Review
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-[#343434] text-[#B0AFAF] border-[#343434]">
            Not Uploaded
          </Badge>
        );
    }
  };

  const handlePreviewDocument = (document) => {
    setPreviewDocument({
      url: document.file_url,
      name: document.typeInfo?.label || document.document_type,
      status: document.status,
    });
  };

  return (
    <Card className="bg-[#262626] border-[#343434]">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Document Preview Section */}
          {previewDocument && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white">Document Preview</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewDocument(null)}
                  className="text-[#B0AFAF] hover:text-white"
                >
                  Close Preview
                </Button>
              </div>
              <DocumentPreview
                documentUrl={previewDocument.url}
                documentName={previewDocument.name}
                onClose={() => setPreviewDocument(null)}
              />
            </div>
          )}

          {/* Information Banner */}
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-white text-sm mb-1">
                  Document Upload Instructions
                </h4>
                <p className="text-blue-300 text-sm">
                  Upload any one of the following document types to proceed with
                  verification. Choose the document that best verifies your
                  player identity.
                </p>
              </div>
            </div>
          </div>

          {/* Upload New Document */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Upload Document</h4>

            {/* Document Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">
                Choose Document Type
              </label>
              <Select
                value={selectedDocumentType}
                onValueChange={setSelectedDocumentType}
                disabled={uploading}
              >
                <SelectTrigger className="bg-[#1A1A1A] border-[#343434] text-white h-12">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent className="bg-[#262626] border-[#343434] text-white">
                  {documentTypes.map((docType) => {
                    const status = getDocumentStatus(docType.value);
                    const isApproved = status === "approved";

                    return (
                      <SelectItem
                        key={docType.value}
                        value={docType.value}
                        className="focus:bg-[#343434] focus:text-primary py-3"
                        disabled={isApproved}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <div className="font-medium">{docType.label}</div>
                            <div className="text-sm text-[#B0AFAF]">
                              {docType.description}
                            </div>
                          </div>
                          {isApproved && (
                            <CheckCircle className="w-4 h-4 text-green-400 ml-2" />
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* File Upload - PDF Only */}
            {selectedDocumentType && (
              <div className="space-y-3">
                <FileUpload
                  onUpload={handleDocumentUpload}
                  accept=".pdf,application/pdf"
                  maxSize={10 * 1024 * 1024} // 10MB
                  folder="verifications"
                  uploading={uploading}
                  uploadText="Upload PDF Document"
                  className="border-2 border-dashed border-[#343434] hover:border-primary/50 rounded-xl p-6"
                  multiple={false}
                >
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center border-2 border-[#343434] mx-auto">
                      <FileText className="w-8 h-8 text-[#B0AFAF]" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        Upload PDF Document
                      </p>
                      <p className="text-sm text-[#B0AFAF] mt-1">
                        PDF files only (Max 10MB)
                      </p>
                    </div>
                  </div>
                </FileUpload>

                {/* Upload Requirements */}
                <div className="bg-[#1A1A1A] border border-[#343434] rounded-lg p-4">
                  <h5 className="font-medium text-white text-sm mb-2">
                    Upload Requirements:
                  </h5>
                  <ul className="text-xs text-[#B0AFAF] space-y-1">
                    <li>• File must be in PDF format</li>
                    <li>• Maximum file size: 10MB</li>
                    <li>• Ensure document is clear and readable</li>
                    <li>• All required information must be visible</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Available Document Types */}
          <div className="bg-[#1A1A1A] border border-[#343434] rounded-xl p-4">
            <h4 className="font-semibold text-white mb-3">
              Available Document Types
            </h4>
            <ul className="space-y-3">
              {documentTypes.map((docType) => {
                const status = getDocumentStatus(docType.value);

                return (
                  <li
                    key={docType.value}
                    className="flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">
                          {docType.label}
                        </span>
                      </div>
                      <p className="text-sm text-[#B0AFAF] mt-1">
                        {docType.description}
                      </p>
                      <p className="text-xs text-[#B0AFAF] mt-1">
                        {docType.help}
                      </p>
                    </div>
                    <div className="ml-4">{getStatusIcon(status)}</div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Uploaded Documents List */}
          {uploadedDocuments.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Uploaded Documents</h4>
              <div className="grid gap-3 md:grid-cols-2">
                {uploadedDocuments.map((doc) => (
                  <div
                    key={doc.verification_id}
                    className="flex items-center justify-between p-4 border rounded-xl bg-[#1A1A1A] border-[#343434]"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          doc.status === "approved"
                            ? "bg-green-500/20"
                            : doc.status === "pending"
                            ? "bg-yellow-500/20"
                            : "bg-red-500/20"
                        }`}
                      >
                        {getStatusIcon(doc.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-white text-sm truncate">
                            {doc.typeInfo?.label || doc.document_type}
                          </h4>
                          {getStatusBadge(doc.status)}
                        </div>
                        <p className="text-xs text-[#B0AFAF] truncate">
                          Uploaded{" "}
                          {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreviewDocument(doc)}
                        className="bg-[#343434] border-[#343434] text-white hover:bg-[#4A4A4A] h-8 w-8 p-0"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(doc.file_url, "_blank")}
                        className="bg-[#343434] border-[#343434] text-white hover:bg-[#4A4A4A] h-8 w-8 p-0"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Status */}
          <div className="flex items-center justify-between p-4 bg-[#1A1A1A] border border-[#343434] rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-[#B0AFAF]">
                Verification Progress
              </span>
              {hasAnyDocument() && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Document Uploaded
                </Badge>
              )}
            </div>
            <Badge
              className={
                hasAnyDocument()
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
              }
            >
              {hasAnyDocument() ? "Ready for Review" : "Upload Document"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUploadStep;
