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
import { calculateAge } from "@/utils/helper.utils";
import VerificationBadge from "@/components/passport/VerificationBadge";
import Verification from "@/pages/Player/Verification";

const IdentityCard = ({ identity, passport, verifications, player }) => {
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
          {/* <VerificationBadge isVerified={isVerified} /> */}
        </div>

        {/* Detailed Verification Status */}
        {/* <div className="flex items-center space-x-4 mt-2">
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
        </div> */}
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
                <div className="flex items-center space-x-4">
                  <h3 className="text-xl font-bold text-white ">
                    {identity.first_name} {identity.last_name}{" "}
                  </h3>
                  <VerificationBadge isVerified={isVerified} />
                </div>
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

            <div className="grid grid-cols-2 gap-4  ">
              <div className="grid grid-cols-2 border-border gap-4 ">
                <div className="flex items-center space-x-2 bg-(--surface-0) rounded-2xl p-3">
                  <Ruler className="w-6 h-6 text-black bg-primary rounded p-1" />
                  <div className="flex-2">
                    <p className="text-sm text-placeholder font-bold">Height</p>

                    <p className="text-primary font-medium font-['Orbitron'] text-right">
                      {identity.height_cm}cm
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 bg-(--surface-0) rounded-2xl p-3">
                  <Scale className="w-6 h-6 text-black bg-primary rounded p-1" />
                  <div className="flex-2">
                    <p className="text-sm text-placeholder font-bold">Weight</p>
                    <p className="text-primary font-medium font-['Orbitron'] text-right">
                      {identity.weight_kg}kg
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 bg-(--surface-0) rounded-2xl p-3">
                  <Footprints className="w-6 h-6 text-black bg-primary rounded p-1 " />
                  <div className="flex-2">
                    <p className="text-sm text-placeholder font-bold">
                      Preferred Foot
                    </p>
                    <p className="text-primary  font-medium capitalize font-['Orbitron'] text-right">
                      {identity.preferred_foot}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 bg-(--surface-0) rounded-2xl p-3">
                  <Target className="w-6 h-6 text-black bg-primary rounded p-1" />
                  <div>
                    <p className="text-sm text-placeholder font-bold">
                      Positions
                    </p>
                    <p className="text-primary font-medium">
                      {identity.positions?.join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              {identity.guardian_name && (
                <div className="border-l border-placeholder p-4">
                  <div className="bg-(--surface-0) rounded-2xl p-4">
                    <h4 className="text-sm font-medium text-placeholder mb-2">
                      Guardian Information
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <p className="text-placeholder text-sm">Name</p>
                        <p className="text-white">{identity.guardian_name}</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <div>
                          <p className="text-placeholder text-sm">Email</p>
                          <p className="text-white">
                            {identity.guardian_email}
                          </p>
                        </div>
                        <div>
                          <p className="text-placeholder text-sm">Phone</p>
                          <p className="text-white">
                            {identity.guardian_phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

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
