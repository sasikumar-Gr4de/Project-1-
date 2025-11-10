import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Shield,
  Award,
  Calendar,
  MapPin,
  TrendingUp,
  Star,
  Zap,
  Target,
  Activity,
  CheckCircle,
  Clock,
} from "lucide-react";
import api from "@/services/base.api";

const PublicPassport = () => {
  const { token } = useParams();
  const [passportData, setPassportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPublicPassport();
  }, [token]);

  const loadPublicPassport = async () => {
    try {
      const response = await api.get(`/v1/player/passport/public/${token}`);
      if (response.data.success) {
        setPassportData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load public passport:", error);
      setError("Share link not found or expired");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0F0F0E]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F0F0E] flex items-center justify-center">
        <Card className="bg-[#262626] border-[#343434] max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <Shield className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Link Not Available
            </h2>
            <p className="text-[#B0AFAF]">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    identity,
    passport: passportInfo,
    verifications,
    metrics,
    tempo_data,
    share_info,
  } = passportData || {};

  return (
    <div className="min-h-screen bg-[#0F0F0E] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent mb-4">
            Player Profile
          </h1>
          <p className="text-[#B0AFAF] text-lg">
            Public performance profile shared by the player
          </p>
        </div>

        {/* Verification Badges */}
        <div className="flex justify-center space-x-4 mb-6">
          {verifications?.some(
            (v) => v.verification_badge === "identity_verified"
          ) && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <CheckCircle className="w-4 h-4 mr-2" />
              Identity Verified
            </Badge>
          )}
          {verifications?.some(
            (v) => v.verification_badge === "club_verified"
          ) && (
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <CheckCircle className="w-4 h-4 mr-2" />
              Club Verified
            </Badge>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Identity Information */}
          <Card className="bg-[#262626] border-[#343434]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <User className="w-5 h-5 text-primary" />
                <span>Player Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {identity ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    {identity.headshot_url && (
                      <img
                        src={identity.headshot_url}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {identity.first_name} {identity.last_name}
                      </h3>
                      <p className="text-[#B0AFAF]">
                        Age {identity.age} • {identity.nationality}
                      </p>
                      <p className="text-[#B0AFAF]">
                        {identity.height_cm}cm • {identity.weight_kg}kg •{" "}
                        {identity.preferred_foot}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="text-[#B0AFAF]">Positions:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {identity.positions?.map((position, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-white border-[#343434]"
                        >
                          {position}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-[#B0AFAF]">
                  Player information not available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Club Information */}
          <Card className="bg-[#262626] border-[#343434]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Club Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {passportInfo ? (
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {passportInfo.current_club}
                    </h3>
                    <p className="text-[#B0AFAF]">
                      {passportInfo.squad_level} • Season {passportInfo.season}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[#B0AFAF]">Shirt Number:</span>
                      <p className="text-white">#{passportInfo.shirt_number}</p>
                    </div>
                    <div>
                      <span className="text-[#B0AFAF]">Status:</span>
                      <p className="text-white">Active Player</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-[#B0AFAF]">Club information not available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <Card className="bg-[#262626] border-[#343434] mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Performance Overview</span>
            </CardTitle>
            <CardDescription className="text-[#B0AFAF]">
              Recent performance metrics and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            {metrics && metrics.length > 0 ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {metrics[0]?.gr4de_score || "N/A"}
                    </div>
                    <p className="text-[#B0AFAF]">Latest GR4DE Score</p>
                  </div>
                  <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {metrics.length}
                    </div>
                    <p className="text-[#B0AFAF]">Matches Analyzed</p>
                  </div>
                  <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {Math.max(...metrics.map((m) => m.gr4de_score || 0))}
                    </div>
                    <p className="text-[#B0AFAF]">Highest Score</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-white font-medium">
                    Recent Performances
                  </h4>
                  {metrics.slice(0, 3).map((metric, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-lg"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <Award className="w-5 h-5 text-primary" />
                          <span className="text-white font-semibold">
                            GR4DE Score: {metric.gr4de_score}
                          </span>
                        </div>
                        <p className="text-[#B0AFAF] text-sm">
                          {metric.competition} •{" "}
                          {new Date(metric.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-[#B0AFAFAF]">Performance data not available</p>
            )}
          </CardContent>
        </Card>

        {/* Tempo Analysis Preview */}
        {tempo_data && tempo_data.length > 0 && (
          <Card className="bg-[#262626] border-[#343434] mt-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Zap className="w-5 h-5 text-primary" />
                <span>Tempo Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {tempo_data.slice(0, 3).map((tempo, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-[#1A1A1A] rounded-lg"
                  >
                    <div className="text-2xl font-bold text-primary mb-2">
                      {tempo.tempo_index}
                    </div>
                    <p className="text-[#B0AFAF] text-sm">Tempo Index</p>
                    <p className="text-[#B0AFAF] text-xs">
                      {new Date(tempo.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-[#B0AFAF] text-sm mt-4 text-center">
                Advanced tempo metrics available in full profile
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-[#B0AFAF]">
          <p className="text-sm">
            Profile shared via GR4DE Platform • Expires{" "}
            {share_info?.expires_at
              ? new Date(share_info.expires_at).toLocaleDateString()
              : "N/A"}
          </p>
          <p className="text-xs mt-2">
            For full access to advanced analytics and complete profile, contact
            the player directly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicPassport;
