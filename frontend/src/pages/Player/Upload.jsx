import React, { useState } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VideoUpload from "@/components/common/VideoUpload";
import FileUpload from "@/components/common/FileUpload";
import {
  Video,
  FileText,
  Calendar,
  CheckCircle,
  AlertCircle,
  Shirt,
  MapPin,
  Palette,
} from "lucide-react";

const Upload = () => {
  const { fetchDashboard } = useUserStore();
  const [uploadData, setUploadData] = useState({
    match_date: "",
    jersey_number: "",
    position: "",
    jersey_color: "",
    opponent_jersey_color: "",
    notes: "",
  });
  const [files, setFiles] = useState({
    video: null,
    gps: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);

  const handleInputChange = (field, value) => {
    setUploadData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (type, result) => {
    if (result[0]?.success) {
      setFiles((prev) => ({ ...prev, [type]: result[0].url }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files.video || !uploadData.match_date) {
      alert("Please provide video file and match date");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("user_id", "current");
      formData.append("match_date", uploadData.match_date);
      formData.append("jersey_number", uploadData.jersey_number || "");
      formData.append("position", uploadData.position || "");
      formData.append("jersey_color", uploadData.jersey_color || "");
      formData.append(
        "opponent_jersey_color",
        uploadData.opponent_jersey_color || ""
      );
      formData.append("notes", uploadData.notes || "");
      formData.append("video_url", files.video);
      if (files.gps) {
        formData.append("gps_url", files.gps);
      }

      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);
      setUploadProgress(100);

      if (response.ok) {
        const result = await response.json();
        setUploadResult({ success: true, data: result.data });

        // Reset form
        setUploadData({
          match_date: "",
          jersey_number: "",
          position: "",
          jersey_color: "",
          opponent_jersey_color: "",
          notes: "",
        });
        setFiles({ video: null, gps: null });

        // Refresh dashboard data
        setTimeout(() => {
          fetchDashboard();
        }, 1000);
      } else {
        const error = await response.json();
        setUploadResult({ success: false, error: error.message });
      }
    } catch (error) {
      setUploadResult({ success: false, error: error.message });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  // Check all required fields

  const canSubmit =
    files.video &&
    uploadData.match_date &&
    uploadData.jersey_number &&
    uploadData.jersey_color &&
    uploadData.opponent_jersey_color;
  uploadData.position && !isUploading;

  // Position options
  const positionOptions = [
    "Goalkeeper",
    "Center Back",
    "Full Back",
    "Defensive Midfielder",
    "Central Midfielder",
    "Attacking Midfielder",
    "Winger",
    "Forward",
    "Striker",
  ];

  // Jersey color options
  const jerseyColors = [
    "Red",
    "Blue",
    "White",
    "Black",
    "Green",
    "Yellow",
    "Orange",
    "Purple",
    "Pink",
    "Gray",
    "Navy",
    "Royal Blue",
    "Sky Blue",
    "Maroon",
    "Burgundy",
    "Teal",
    "Gold",
    "Silver",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            Upload Match Data
          </h1>
          <p className="text-[#B0AFAF] text-lg mt-2 font-['Orbitron']">
            Upload your match video and GPS data for performance analysis
          </p>
        </div>
      </div>

      {/* Upload Result */}
      {uploadResult && (
        <Card
          className={
            uploadResult.success
              ? "border-green-500/20 bg-green-500/10"
              : "border-red-500/20 bg-red-500/10"
          }
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              {uploadResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              <div>
                <p
                  className={
                    uploadResult.success ? "text-green-400" : "text-red-400"
                  }
                >
                  {uploadResult.success
                    ? "Data uploaded successfully! Your report is being processed."
                    : `Upload failed: ${uploadResult.error}`}
                </p>
                {uploadResult.success && uploadResult.data?.queue_item && (
                  <Badge className="mt-1 bg-green-500/20 text-green-400 border-green-500/30 font-['Inter']">
                    Queue ID: {uploadResult.data.queue_item.id}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <Card className="bg-[#262626] border-[#343434]">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white font-['Inter']">
                  Processing upload...
                </span>
                <span className="text-sm text-[#B0AFAF] font-['Inter']">
                  {uploadProgress}%
                </span>
              </div>
              <Progress
                value={uploadProgress}
                className="w-full bg-[#343434]"
              />
              <p className="text-xs text-[#B0AFAF] font-['Inter']">
                Please don't close this window while your data is being
                processed.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - File Uploads */}
        <div className="space-y-6">
          {/* Video Upload */}
          <Card className="bg-[#262626] border-[#343434] hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white font-['Inter']">
                <Video className="w-5 h-5 text-primary" />
                <span>Match Video</span>
              </CardTitle>
              <CardDescription className="text-[#B0AFAF] font-['Inter']">
                Upload your match video footage (MP4, MOV, AVI up to 100MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VideoUpload
                onUpload={(result) => handleFileUpload("video", result)}
                maxSize={100 * 1024 * 1024}
                folder="match-videos"
                label="Select video file"
                uploadText="Upload video"
              />
            </CardContent>
          </Card>

          {/* GPS Data Upload */}
          <Card className="bg-[#262626] border-[#343434] hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white font-['Inter']">
                <FileText className="w-5 h-5 text-primary" />
                <span>GPS Data (Optional)</span>
              </CardTitle>
              <CardDescription className="text-[#B0AFAF] font-['Inter']">
                Upload GPS tracking data in CSV or JSON format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                onUpload={(result) => handleFileUpload("gps", result)}
                accept=".csv,.json"
                maxSize={10 * 1024 * 1024}
                folder="gps-data"
                label="Select GPS file"
                uploadText="Upload GPS data"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Match Details */}
        <div className="space-y-6">
          <Card className="bg-[#262626] border-[#343434] hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white font-['Inter']">
                Match Details
              </CardTitle>
              <CardDescription className="text-[#B0AFAF] font-['Inter']">
                Provide information about the match and your participation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Match Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white font-['Inter']">
                  Match Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-[#B0AFAF]" />
                  <Input
                    type="date"
                    value={uploadData.match_date}
                    onChange={(e) =>
                      handleInputChange("match_date", e.target.value)
                    }
                    className="pl-10 h-11 bg-[#1A1A1A] border-[#343434] text-white placeholder:text-[#B0AFAF] focus:border-primary font-['Inter']"
                    required
                  />
                </div>
              </div>

              {/* Jersey Number and Position */}
              <div className="grid grid-cols-2 gap-4">
                {/* Jersey Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white font-['Inter']">
                    Jersey Number
                  </label>
                  <div className="relative">
                    <Shirt className="absolute left-3 top-3 h-4 w-4 text-[#B0AFAF]" />
                    <Input
                      type="number"
                      min="1"
                      max="99"
                      placeholder="e.g., 7"
                      value={uploadData.jersey_number}
                      onChange={(e) =>
                        handleInputChange("jersey_number", e.target.value)
                      }
                      className="pl-10 h-11 bg-[#1A1A1A] border-[#343434] text-white placeholder:text-[#B0AFAF] focus:border-primary font-['Inter']"
                    />
                  </div>
                </div>
              </div>

              {/* Jersey Colors */}
              <div className="grid grid-cols-3 gap-4">
                {/* Position */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white font-['Inter']">
                    Position
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2 h-4 w-4 text-[#B0AFAF] z-10" />
                    <Select
                      value={uploadData.position}
                      onValueChange={(value) =>
                        handleInputChange("position", value)
                      }
                    >
                      <SelectTrigger className="pl-10 h-11 bg-[#1A1A1A] border-[#343434] text-white focus:border-primary font-['Inter']">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#262626] border-[#343434] text-white font-['Inter']">
                        {positionOptions.map((position) => (
                          <SelectItem
                            key={position}
                            value={position}
                            className="font-['Inter']"
                          >
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Your Jersey Color */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white font-['Inter']">
                    Your Jersey Color
                  </label>
                  <div className="relative">
                    <Palette className="absolute left-3 top-2 h-4 w-4 text-[#B0AFAF] z-10" />
                    <Select
                      value={uploadData.jersey_color}
                      onValueChange={(value) =>
                        handleInputChange("jersey_color", value)
                      }
                    >
                      <SelectTrigger className="pl-10 h-11 bg-[#1A1A1A] border-[#343434] text-white focus:border-primary font-['Inter']">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#262626] border-[#343434] text-white font-['Inter'] max-h-60">
                        {jerseyColors.map((color) => (
                          <SelectItem
                            key={color}
                            value={color}
                            className="font-['Inter']"
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-4 h-4 rounded border border-[#343434]"
                                style={{
                                  backgroundColor: color.toLowerCase(),
                                  borderColor:
                                    color.toLowerCase() === "white"
                                      ? "#343434"
                                      : "transparent",
                                }}
                              />
                              <span>{color}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Opponent Jersey Color */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white font-['Inter']">
                    Opponent Jersey Color
                  </label>
                  <div className="relative">
                    <Palette className="absolute left-3 top-2 h-4 w-4 text-[#B0AFAF] z-10" />
                    <Select
                      value={uploadData.opponent_jersey_color}
                      onValueChange={(value) =>
                        handleInputChange("opponent_jersey_color", value)
                      }
                    >
                      <SelectTrigger className="pl-10 h-11 bg-[#1A1A1A] border-[#343434] text-white focus:border-primary font-['Inter']">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#262626] border-[#343434] text-white font-['Inter'] max-h-60">
                        {jerseyColors.map((color) => (
                          <SelectItem
                            key={color}
                            value={color}
                            className="font-['Inter']"
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-4 h-4 rounded border border-[#343434]"
                                style={{
                                  backgroundColor: color.toLowerCase(),
                                  borderColor:
                                    color.toLowerCase() === "white"
                                      ? "#343434"
                                      : "transparent",
                                }}
                              />
                              <span>{color}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white font-['Inter']">
                  Additional Notes
                </label>
                <Textarea
                  placeholder="Any additional context about the match, conditions, specific moments to analyze, or tactical information..."
                  value={uploadData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={4}
                  className="bg-[#1A1A1A] border-[#343434] text-white placeholder:text-[#B0AFAF] focus:border-primary font-['Inter']"
                />
              </div>

              {/* Requirements */}
              <div className="rounded-lg bg-[#1A1A1A] p-4 space-y-2 border border-[#343434]">
                <h4 className="text-sm font-medium text-white font-['Inter']">
                  Upload Requirements
                </h4>
                <ul className="text-sm text-[#B0AFAF] space-y-1 font-['Inter']">
                  <li>• Video must be clear and show full gameplay</li>
                  <li>• Minimum video length: 15 minutes</li>
                  <li>• Maximum video size: 100MB</li>
                  <li>
                    • GPS data should include position and movement metrics
                  </li>
                  <li>
                    • Jersey colors help with player identification in video
                    analysis
                  </li>
                  <li>• Processing typically takes 10-30 minutes</li>
                </ul>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!canSubmit}
                className="w-full h-11 bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold disabled:bg-[#343434] disabled:text-[#B0AFAF] transition-all duration-300 font-['Inter']"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0F0F0E] mr-2"></div>
                    Processing...
                  </>
                ) : (
                  "Submit for Analysis"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Upload Status */}
          <Card className="bg-[#262626] border-[#343434] hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white font-['Inter']">
                Upload Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white font-['Inter']">
                  Video File
                </span>
                {files.video ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-['Inter']">
                    Uploaded
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-[#343434] text-[#B0AFAF] border-[#343434] font-['Inter']"
                  >
                    Required
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white font-['Inter']">
                  GPS Data
                </span>
                {files.gps ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-['Inter']">
                    Uploaded
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-[#343434] text-[#B0AFAF] border-[#343434] font-['Inter']"
                  >
                    Optional
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white font-['Inter']">
                  Match Details
                </span>
                {uploadData.match_date ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-['Inter']">
                    Complete
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-[#343434] text-[#B0AFAF] border-[#343434] font-['Inter']"
                  >
                    Required
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white font-['Inter']">
                  Player Info
                </span>
                {uploadData.jersey_number || uploadData.position ? (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-['Inter']">
                    Added
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-[#343434] text-[#B0AFAF] border-[#343434] font-['Inter']"
                  >
                    Optional
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default Upload;
