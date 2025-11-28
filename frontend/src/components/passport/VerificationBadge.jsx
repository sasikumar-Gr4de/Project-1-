import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

const VerificationBadge = ({ isVerified = false }) => {
  return (
    <div className="flex items-center space-x-2">
      {isVerified ? (
        <CheckCircle className="w-5 h-5 text-green-400" />
      ) : (
        <Clock className="w-5 h-5 text-yellow-400" />
      )}
      <Badge
        className={
          isVerified
            ? "bg-green-500/20 text-green-400 border-green-500/30"
            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
        }
      >
        {isVerified ? "Verified" : "Pending"}
      </Badge>
      {!isVerified && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => (window.location.href = "/verification")}
          className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30"
        >
          <Shield className="w-4 h-4 mr-2" />
          Verify
        </Button>
      )}
    </div>
  );
};

export default VerificationBadge;
