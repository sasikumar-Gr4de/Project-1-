// components/passport/VerificationStatus.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const VerificationStatus = ({ verificationStatus, verifications }) => {
  console.log("Verification Status:", verificationStatus);
  const getStatusBadge = (status) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-(--surface-2) text-(--muted-text) border-(--surface-2)">
            <AlertCircle className="w-3 h-3 mr-1" />
            Not Started
          </Badge>
        );
    }
  };

  const getDocumentTypeLabel = (type) => {
    switch (type) {
      case "passport":
        return "Passport";
      case "club_letter":
        return "Club Letter";
      case "consent":
        return "Consent Form";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Verification Status */}
      <Card className="bg-(--surface-1) border-(--surface-2)">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-(--muted-text)">Overall Status</p>
              <div className="flex items-center space-x-3 mt-2">
                {getStatusBadge(verificationStatus?.status || "not_started")}
                <span className="text-white text-lg font-semibold">
                  {verificationStatus?.status === "verified"
                    ? "Fully Verified"
                    : verificationStatus?.status === "pending"
                    ? "Under Review"
                    : verificationStatus?.status === "rejected"
                    ? "Verification Required"
                    : "Not Verified"}
                </span>
              </div>
            </div>

            {(!verificationStatus ||
              verificationStatus?.status !== "verified") && (
              <Button asChild>
                <Link to="/verification">Start Verification</Link>
              </Button>
            )}
          </div>

          {verificationStatus?.verificationProgress && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {verificationStatus.verificationProgress.identity}%
                </div>
                <p className="text-(--muted-text) text-sm">Identity</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {verificationStatus.verificationProgress.documents}%
                </div>
                <p className="text-(--muted-text) text-sm">Documents</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {verificationStatus.verificationProgress.approval}%
                </div>
                <p className="text-(--muted-text) text-sm">Approval</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Verification Status */}
      <Card className="bg-(--surface-1) border-(--surface-2)">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Document Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {verifications && verifications.length > 0 ? (
              verifications.map((doc) => (
                <div
                  key={doc.verification_id}
                  className="flex items-center justify-between p-3 bg-(--surface-2) rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-4 h-4 text-(--muted-text)" />
                    <div>
                      <p className="text-white font-medium">
                        {getDocumentTypeLabel(doc.document_type)}
                      </p>
                      <p className="text-(--muted-text) text-sm">
                        Uploaded {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(doc.status)}
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <FileText className="w-12 h-12 text-(--muted-text) mx-auto mb-3 opacity-50" />
                <p className="text-(--muted-text)">
                  No documents uploaded yet.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationStatus;
