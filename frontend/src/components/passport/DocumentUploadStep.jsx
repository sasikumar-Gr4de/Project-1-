import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { usePassportStore } from "@/store/passportStore";
import { useToast } from "@/contexts/ToastContext";
import FileUpload from "@/components/common/FileUpload";
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
} from "lucide-react";

const DocumentUploadStep = ({ onComplete, currentStep }) => {
  const { user } = useAuthStore();
  const { uploadVerification, passport, fetchPlayerPassport } =
    usePassportStore();
  const { toast } = useToast();
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [uploading, setUploading] = useState(false);

  const documentTypes = [
    {
      value: "passport",
      label: "Passport or ID Card",
      description: "Government-issued photo identification",
      required: true,
      help: "Ensure all details are clearly visible and not expired",
    },
    {
      value: "club_letter",
      label: "Club Registration Letter",
      description: "Official letter from your football club",
      required: true,
      help: "Must include club letterhead and registration details",
    },
    {
      value: "consent",
      label: "Parental Consent Form",
      description: "Required for players under 18 years old",
      required: false,
      help: "Signed by parent/guardian with contact information",
    },
  ];

  const handleDocumentUpload = async (result) => {
    result = result[0];
    if (!result.success || !selectedDocumentType) {
      toast({
        title: "Upload failed",
        description: result.error || "Please select document type",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      await uploadVerification(user.id, {
        document_type: selectedDocumentType,
        file_url: result.url,
        // hash_sha256 would be generated on the backend
      });

      // Refresh passport data to get updated verifications
      await fetchPlayerPassport(user.id);

      toast({
        title: "Success",
        description: "Document uploaded for verification",
        variant: "success",
      });

      // Reset selection
      setSelectedDocumentType("");

      // Notify parent if all required docs are uploaded
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Failed to upload document:", error);
      toast({
        title: "Error",
        description: "Failed to upload document",
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

  const getUploadedDocuments = () => {
    if (!passport?.verifications) return [];

    return passport.verifications.map((doc) => ({
      ...doc,
      typeInfo: documentTypes.find((dt) => dt.value === doc.document_type),
    }));
  };

  const uploadedDocuments = getUploadedDocuments();
  const requiredDocsUploaded = documentTypes
    .filter((doc) => doc.required)
    .every((doc) => getDocumentStatus(doc.value));

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

  return (
    <Card className="bg-[#262626] border-[#343434]">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center">
          <FileText className="w-5 h-5 mr-2 text-primary" />
          Identity Documents
        </CardTitle>
        <CardDescription className="text-[#B0AFAF]">
          Upload required documents for player verification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Document Requirements */}
          <div className="bg-[#1A1A1A] border border-[#343434] rounded-xl p-4">
            <h4 className="font-semibold text-white mb-3">
              Document Requirements
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
                        {docType.required && (
                          <Badge
                            variant="outline"
                            className="bg-red-500/10 text-red-400 border-red-500/20 text-xs"
                          >
                            Required
                          </Badge>
                        )}
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

          {/* Upload New Document */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Upload New Document</h4>

            {/* Document Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">
                Document Type
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
                  {documentTypes.map((docType) => (
                    <SelectItem
                      key={docType.value}
                      value={docType.value}
                      className="focus:bg-[#343434] focus:text-primary py-3"
                      disabled={getDocumentStatus(docType.value) === "approved"}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="font-medium">{docType.label}</div>
                          <div className="text-sm text-[#B0AFAF]">
                            {docType.description}
                          </div>
                        </div>
                        {getDocumentStatus(docType.value) === "approved" && (
                          <CheckCircle className="w-4 h-4 text-green-400 ml-2" />
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            {selectedDocumentType && (
              <FileUpload
                onUpload={handleDocumentUpload}
                accept="application/pdf,image/jpeg,image/png"
                maxSize={100 * 1024 * 1024} // 10MB
                folder="verifications"
                uploading={uploading}
                uploadText="Upload Document"
                className="border-2 border-dashed border-[#343434] hover:border-primary/50 rounded-xl p-6"
              ></FileUpload>
            )}
          </div>

          {/* Uploaded Documents List */}
          {uploadedDocuments.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Uploaded Documents</h4>
              <div className="space-y-3">
                {uploadedDocuments.map((doc) => (
                  <div
                    key={doc.verification_id}
                    className="flex items-center justify-between p-4 border rounded-xl bg-[#1A1A1A] border-[#343434]"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          doc.status === "approved"
                            ? "bg-green-500/20"
                            : doc.status === "pending"
                            ? "bg-yellow-500/20"
                            : "bg-red-500/20"
                        }`}
                      >
                        {getStatusIcon(doc.status)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold text-white">
                            {doc.typeInfo?.label || doc.document_type}
                          </h4>
                          {getStatusBadge(doc.status)}
                        </div>
                        <p className="text-sm text-[#B0AFAF] mt-1">
                          Uploaded{" "}
                          {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(doc.file_url, "_blank")}
                      className="bg-[#343434] border-[#343434] text-white hover:bg-[#4A4A4A]"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Overall Status */}
          <div className="flex items-center justify-between p-3 bg-[#1A1A1A] border border-[#343434] rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-[#B0AFAF]">
                Verification Progress
              </span>
              {requiredDocsUploaded && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  All Required Docs Uploaded
                </Badge>
              )}
            </div>
            <Badge
              className={
                requiredDocsUploaded
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
              }
            >
              {requiredDocsUploaded ? "Ready for Review" : "Documents Pending"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUploadStep;
