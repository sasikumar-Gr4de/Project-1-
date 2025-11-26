import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const VerificationIntegration = ({ verifications, passportStatus }) => {
  const isVerified = passportStatus === "verified";
  const pendingVerifications =
    verifications?.filter((v) => v.status === "pending") || [];
  const approvedVerifications =
    verifications?.filter((v) => v.status === "approved") || [];

  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          color: "green",
          icon: CheckCircle,
          label: "Verified",
          bgColor: "bg-green-500/20",
          textColor: "text-green-400",
          borderColor: "border-green-500/30",
        };
      case "pending":
        return {
          color: "yellow",
          icon: Clock,
          label: "Pending",
          bgColor: "bg-yellow-500/20",
          textColor: "text-yellow-400",
          borderColor: "border-yellow-500/30",
        };
      default:
        return {
          color: "gray",
          icon: AlertCircle,
          label: "Required",
          bgColor: "bg-[#343434]",
          textColor: "text-placeholder",
          borderColor: "border-[#343434]",
        };
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Shield className="w-5 h-5 text-primary" />
          <span>Verification Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-xl border border-border">
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isVerified
                  ? "bg-green-500/20 border-2 border-green-500/30"
                  : "bg-yellow-500/20 border-2 border-yellow-500/30"
              }`}
            >
              {isVerified ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <Clock className="w-6 h-6 text-yellow-400" />
              )}
            </div>
            <div>
              <h3 className="text-white font-semibold">
                {isVerified ? "Passport Verified" : "Verification Required"}
              </h3>
              <p className="text-placeholder text-sm">
                {isVerified
                  ? "Your passport is fully verified and active"
                  : "Complete verification to access all features"}
              </p>
            </div>
          </div>
          <Badge
            className={
              isVerified
                ? "bg-green-500/20 text-green-400 border-green-500/30"
                : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
            }
          >
            {isVerified ? "Verified" : "In Progress"}
          </Badge>
        </div>

        {/* Verification Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white">Identity Verification</span>
            <Badge
              {...getStatusConfig(
                verifications?.some(
                  (v) => v.verification_badge === "identity_verified"
                )
                  ? "approved"
                  : "pending"
              )}
            >
              {verifications?.some(
                (v) => v.verification_badge === "identity_verified"
              )
                ? "Verified"
                : "Pending"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white">Club Verification</span>
            <Badge
              {...getStatusConfig(
                verifications?.some(
                  (v) => v.verification_badge === "club_verified"
                )
                  ? "approved"
                  : "pending"
              )}
            >
              {verifications?.some(
                (v) => v.verification_badge === "club_verified"
              )
                ? "Verified"
                : "Pending"}
            </Badge>
          </div>
        </div>

        {/* Action Button */}
        <Button
          asChild
          className="w-full bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold"
        >
          <Link to="/verification">
            {isVerified ? "View Verification Details" : "Complete Verification"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default VerificationIntegration;
