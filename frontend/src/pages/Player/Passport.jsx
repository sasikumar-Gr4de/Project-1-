import React, { useState, useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Shield,
  Award,
  Calendar,
  MapPin,
  TrendingUp,
  Download,
  Share2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Zap,
  Target,
  Activity,
} from "lucide-react";
import api from "@/services/base.api";

const Passport = () => {
  const { user } = useUserStore();
  const [passportData, setPassportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [shareLink, setShareLink] = useState(null);

  useEffect(() => {
    loadPassportData();
  }, []);

  const loadPassportData = async () => {
    try {
      const response = await api.get("/v1/player/passport");
      if (response.data.success) {
        setPassportData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load passport data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await api.put("/v1/player/passport", formData);
      if (response.data.success) {
        await loadPassportData();
        setEditing(false);
      }
    } catch (error) {
      console.error("Failed to save passport:", error);
    }
  };

  const createShareLink = async () => {
    try {
      const response = await api.post("/v1/player/passport/share/create");
      if (response.data.success) {
        setShareLink(response.data.data);
      }
    } catch (error) {
      console.error("Failed to create share link:", error);
    }
  };

  const revokeShareLink = async () => {
    if (!shareLink) return;
    try {
      await api.post("/v1/player/passport/share/revoke", {
        share_token: shareLink.share_token,
      });
      setShareLink(null);
    } catch (error) {
      console.error("Failed to revoke share link:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const {
    player,
    identity,
    passport: passportInfo,
    verifications,
    reports,
    metrics,
    tempo_data,
  } = passportData || {};
  const tier = player?.tier || "free";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            Player Passport
          </h1>
          <p className="text-[#B0AFAF] text-lg mt-2 font-['Orbitron']">
            Your comprehensive football profile and performance analytics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-primary border-primary">
            {tier.toUpperCase()} Plan
          </Badge>
          {editing ? (
            <div className="flex space-x-2">
              <Button onClick={handleSave} size="sm">
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditing(false)}
                size="sm"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setEditing(true)} size="sm">
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Verification Status */}
      <Card className="bg-[#262626] border-[#343434]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Shield className="w-5 h-5 text-primary" />
            <span>Verification Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {verifications?.some(
                (v) => v.verification_badge === "identity_verified"
              ) ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Clock className="w-5 h-5 text-yellow-500" />
              )}
              <span className="text-white">Identity Verified</span>
            </div>
            <div className="flex items-center space-x-2">
              {verifications?.some(
                (v) => v.verification_badge === "club_verified"
              ) ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Clock className="w-5 h-5 text-yellow-500" />
              )}
              <span className="text-white">Club Verified</span>
            </div>
            <Badge
              variant={
                player?.passport_status === "verified" ? "default" : "secondary"
              }
              className={
                player?.passport_status === "verified" ? "bg-green-500" : ""
              }
            >
              {player?.passport_status || "Draft"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Identity Information */}
        <Card className="bg-[#262626] border-[#343434]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <User className="w-5 h-5 text-primary" />
              <span>Identity Information</span>
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
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {identity.first_name} {identity.last_name}
                    </h3>
                    <p className="text-[#B0AFAF]">
                      {identity.nationality} • {identity.height_cm}cm •{" "}
                      {identity.weight_kg}kg
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[#B0AFAF]">Preferred Foot:</span>
                    <p className="text-white">{identity.preferred_foot}</p>
                  </div>
                  <div>
                    <span className="text-[#B0AFAF]">Positions:</span>
                    <p className="text-white">
                      {identity.positions?.join(", ") || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[#B0AFAF]">
                Identity information not provided
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
                    <p className="text-white">Active</p>
                  </div>
                </div>
                {passportInfo.notes && (
                  <div>
                    <span className="text-[#B0AFAF]">Notes:</span>
                    <p className="text-white">{passportInfo.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-[#B0AFAF]">Club information not provided</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      {(tier === "basic" || tier === "pro") && (
        <Card className="bg-[#262626] border-[#343434]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Performance Metrics</span>
            </CardTitle>
            <CardDescription className="text-[#B0AFAF]">
              Your latest GR4DE scores and performance data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {metrics && metrics.length > 0 ? (
              <div className="space-y-4">
                {metrics
                  .slice(0, tier === "basic" ? 3 : 10)
                  .map((metric, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg"
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
                      {tier === "pro" && metric.benchmarks && (
                        <Badge variant="outline">
                          {Math.round(metric.benchmarks.percentile_rank || 0)}th
                          Percentile
                        </Badge>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-[#B0AFAF]">No performance data available</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tempo Analysis */}
      {tier === "pro" && tempo_data && tempo_data.length > 0 && (
        <Card className="bg-[#262626] border-[#343434]">
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
          </CardContent>
        </Card>
      )}

      {/* Reports */}
      {reports && reports.length > 0 && (
        <Card className="bg-[#262626] border-[#343434]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Download className="w-5 h-5 text-primary" />
              <span>Analysis Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reports.slice(0, 5).map((report) => (
                <div
                  key={report.report_id}
                  className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">
                      {report.report_type}
                    </p>
                    <p className="text-[#B0AFAF] text-sm">
                      {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {report.pdf_url && (
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Share Profile */}
      <Card className="bg-[#262626] border-[#343434]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Share2 className="w-5 h-5 text-primary" />
            <span>Share Profile</span>
          </CardTitle>
          <CardDescription className="text-[#B0AFAF]">
            Create a public link to share your profile with coaches and clubs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {shareLink ? (
            <div className="space-y-4">
              <div className="p-4 bg-[#1A1A1A] rounded-lg">
                <p className="text-white mb-2">Public Profile Link:</p>
                <div className="flex items-center space-x-2">
                  <Input
                    value={shareLink.share_url}
                    readOnly
                    className="bg-[#343434] border-[#343434] text-white"
                  />
                  <Button
                    size="sm"
                    onClick={() =>
                      navigator.clipboard.writeText(shareLink.share_url)
                    }
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-[#B0AFAF] text-sm mt-2">
                  Expires: {new Date(shareLink.expires_at).toLocaleDateString()}
                </p>
              </div>
              <Button variant="destructive" size="sm" onClick={revokeShareLink}>
                Revoke Link
              </Button>
            </div>
          ) : (
            <Button onClick={createShareLink}>
              <Share2 className="w-4 h-4 mr-2" />
              Create Share Link
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Passport;
