import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Calendar,
  MapPin,
  Building,
  Shirt,
  Award,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

const PassportHeader = ({ passport, player }) => {
  const { identity, passport: passportData, verificationBadge } = passport;

  const getVerificationIcon = () => {
    switch (verificationBadge?.status) {
      case "verified":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getVerificationColor = () => {
    switch (verificationBadge?.status) {
      case "verified":
        return "bg-linear-to-r from-green-500 to-emerald-600 text-white";
      case "pending":
        return "bg-linear-to-r from-yellow-500 to-amber-600 text-white";
      case "rejected":
        return "bg-linear-to-r from-red-500 to-rose-600 text-white";
      default:
        return "bg-[var(--surface-2)] text-(--muted-text)";
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return "--";
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

  return (
    <Card className="bg-(--surface-1) border-(--surface-2) hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-6">
          {/* Headshot */}
          <div className="shrink-0">
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl border-4 border-primary/20 bg-(--surface-0) overflow-hidden shadow-lg">
              {identity?.headshot_url ? (
                <img
                  src={identity.headshot_url}
                  alt={`${identity.first_name} ${identity.last_name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-primary to-(--accent-2) flex items-center justify-center">
                  <User className="w-12 h-12 text-(--ink)" />
                </div>
              )}
            </div>
          </div>

          {/* Player Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-3 lg:space-y-0">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl lg:text-3xl font-bold text-white font-['Orbitron']">
                    {identity?.first_name} {identity?.last_name}
                  </h1>
                  <Badge className={getVerificationColor()}>
                    <div className="flex items-center space-x-1">
                      {getVerificationIcon()}
                      <span className="text-xs font-semibold">
                        {verificationBadge?.label || "Unverified"}
                      </span>
                    </div>
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-(--muted-text)">
                  {/* Age */}
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{calculateAge(identity?.dob)} years</span>
                  </div>

                  {/* Nationality */}
                  {identity?.nationality && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{identity.nationality}</span>
                    </div>
                  )}

                  {/* Club */}
                  {passportData?.current_club && (
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-primary" />
                      <span>{passportData.current_club}</span>
                    </div>
                  )}

                  {/* Shirt Number */}
                  {passportData?.shirt_number && (
                    <div className="flex items-center space-x-2">
                      <Shirt className="w-4 h-4 text-primary" />
                      <span>#{passportData.shirt_number}</span>
                    </div>
                  )}
                </div>

                {/* Positions */}
                {identity?.positions?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {identity.positions.map((position, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold"
                      >
                        {position}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Season Info */}
              <div className="bg-(--surface-0) border border-(--surface-2) rounded-xl p-3 min-w-48">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-(--muted-text)">Season</span>
                    <span className="text-white font-semibold text-sm">
                      {passportData?.season || "2024-25"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-(--muted-text)">
                      Squad Level
                    </span>
                    <span className="text-white font-semibold text-sm">
                      {passportData?.squad_level || "Senior"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-(--muted-text)">
                      Preferred Foot
                    </span>
                    <span className="text-white font-semibold text-sm capitalize">
                      {identity?.preferred_foot || "Right"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Physical Attributes */}
            {(identity?.height_cm || identity?.weight_kg) && (
              <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-(--surface-2)">
                {identity.height_cm && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {identity.height_cm}cm
                    </div>
                    <div className="text-xs text-(--muted-text)">Height</div>
                  </div>
                )}
                {identity.weight_kg && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {identity.weight_kg}kg
                    </div>
                    <div className="text-xs text-(--muted-text)">Weight</div>
                  </div>
                )}
                {identity.height_cm && identity.weight_kg && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {(
                        identity.weight_kg /
                        (identity.height_cm / 100) ** 2
                      ).toFixed(1)}
                    </div>
                    <div className="text-xs text-(--muted-text)">BMI</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PassportHeader;
