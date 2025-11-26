import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  MapPin,
  Ruler,
  Scale,
  Footprints,
  Target,
  Eye,
  Download,
  CheckCircle,
  Clock,
  Shield,
} from "lucide-react";

const IdentityCard = ({ identity, passport, verifications, player }) => {
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const isVerified = verifications?.some((v) => v.status === "approved");
  const identityVerified = verifications?.some(
    (v) => v.verification_badge === "identity_verified"
  );
  const clubVerified = verifications?.some(
    (v) => v.verification_badge === "club_verified"
  );

  return (
    <Card className="bg-(--surface-1) border-(--surface-2) hover:border-primary/30 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-white">
            <User className="w-5 h-5 text-primary" />
            <span>Identity Information</span>
          </CardTitle>

          {/* Verification Status Badge */}
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
        </div>

        {/* Detailed Verification Status */}
        <div className="flex items-center space-x-4 mt-2">
          <div className="flex items-center space-x-2">
            {identityVerified ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <Clock className="w-4 h-4 text-yellow-400" />
            )}
            <span className="text-sm text-placeholder">Identity</span>
          </div>
          <div className="flex items-center space-x-2">
            {clubVerified ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <Clock className="w-4 h-4 text-yellow-400" />
            )}
            <span className="text-sm text-placeholder">Club</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {identity ? (
          <>
            <div className="flex items-center space-x-4">
              {identity.headshot_url && (
                <img
                  src={identity.headshot_url}
                  alt="Profile"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-primary/20"
                />
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">
                  {identity.first_name} {identity.last_name}
                </h3>
                <div className="flex items-center space-x-3 mt-1">
                  <Badge
                    variant="outline"
                    className="bg-primary/20 text-primary border-primary/30"
                  >
                    Age: {calculateAge(identity.dob)}
                  </Badge>
                  <span className="text-placeholder">
                    {identity.nationality}
                  </span>
                </div>
                {passport && (
                  <p className="text-placeholder text-sm mt-2">
                    {passport.current_club} • {passport.squad_level} • #
                    {passport.shirt_number}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border">
              <div className="flex items-center space-x-2">
                <Ruler className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm text-placeholder">Height</p>
                  <p className="text-white font-medium">
                    {identity.height_cm}cm
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Scale className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm text-placeholder">Weight</p>
                  <p className="text-white font-medium">
                    {identity.weight_kg}kg
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Footprints className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm text-placeholder">Preferred Foot</p>
                  <p className="text-white font-medium capitalize">
                    {identity.preferred_foot}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm text-placeholder">Positions</p>
                  <p className="text-white font-medium">
                    {identity.positions?.join(", ")}
                  </p>
                </div>
              </div>
            </div>

            {identity.guardian_name && (
              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-placeholder mb-2">
                  Guardian Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-placeholder">Name</p>
                    <p className="text-white">{identity.guardian_name}</p>
                  </div>
                  <div>
                    <p className="text-placeholder">Email</p>
                    <p className="text-white">{identity.guardian_email}</p>
                  </div>
                  <div>
                    <p className="text-placeholder">Phone</p>
                    <p className="text-white">{identity.guardian_phone}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {/* <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-placeholder mb-3">
                Quick Actions
              </h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1 justify-start bg-[#1A1A1A] border-border text-white hover:bg-[#343434]"
                  onClick={() => (window.location.href = "/verification")}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Verification Status
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 justify-start bg-[#1A1A1A] border-border text-white hover:bg-[#343434]"
                  onClick={() => window.print()}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Passport
                </Button>
              </div> */}
            {/* </div> */}
          </>
        ) : (
          <p className="text-placeholder text-center py-8">
            Identity information not provided
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default IdentityCard;
