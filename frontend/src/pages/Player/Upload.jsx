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
import VideoUpload from "@/components/common/VideoUpload";
import FileUpload from "@/components/common/FileUpload";
import {
  Video,
  FileText,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const Upload = () => {
  const { fetchDashboard } = useUserStore();
  const [uploadData, setUploadData] = useState({
    match_date: "",
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
        setUploadData({ match_date: "", notes: "" });
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

  const canSubmit = files.video && uploadData.match_date && !isUploading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Upload Match Data</h1>
        <p className="text-[#B0AFAF]">
          Upload your video and GPS data for performance analysis
        </p>
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
                  <Badge className="mt-1 bg-green-500/20 text-green-400 border-green-500/30">
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
        <Card className="bg-[#262626] border-[#404040]">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">
                  Processing upload...
                </span>
                <span className="text-sm text-[#B0AFAF]">
                  {uploadProgress}%
                </span>
              </div>
              <Progress
                value={uploadProgress}
                className="w-full bg-[#404040]"
              />
              <p className="text-xs text-[#B0AFAF]">
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
          <Card className="bg-[#262626] border-[#404040]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Video className="w-5 h-5 text-primary" />
                <span>Match Video</span>
              </CardTitle>
              <CardDescription className="text-[#B0AFAF]">
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
          <Card className="bg-[#262626] border-[#404040]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <FileText className="w-5 h-5 text-primary" />
                <span>GPS Data (Optional)</span>
              </CardTitle>
              <CardDescription className="text-[#B0AFAF]">
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
          <Card className="bg-[#262626] border-[#404040]">
            <CardHeader>
              <CardTitle className="text-white">Match Details</CardTitle>
              <CardDescription className="text-[#B0AFAF]">
                Provide information about the match
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Match Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
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
                    className="pl-10 h-11 bg-[#1A1A1A] border-[#404040] text-white placeholder:text-[#B0AFAF]"
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Additional Notes
                </label>
                <Textarea
                  placeholder="Any additional context about the match, conditions, or specific moments to analyze..."
                  value={uploadData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={4}
                  className="bg-[#1A1A1A] border-[#404040] text-white placeholder:text-[#B0AFAF]"
                />
              </div>

              {/* Requirements */}
              <div className="rounded-lg bg-[#1A1A1A] p-4 space-y-2 border border-[#404040]">
                <h4 className="text-sm font-medium text-white">
                  Upload Requirements
                </h4>
                <ul className="text-sm text-[#B0AFAF] space-y-1">
                  <li>• Video must be clear and show full gameplay</li>
                  <li>• Minimum video length: 15 minutes</li>
                  <li>• Maximum video size: 100MB</li>
                  <li>
                    • GPS data should include position and movement metrics
                  </li>
                  <li>• Processing typically takes 10-30 minutes</li>
                </ul>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!canSubmit}
                className="w-full h-11 bg-primary text-black hover:bg-[#A8E55C] disabled:bg-[#404040] disabled:text-[#B0AFAF]"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Processing...
                  </>
                ) : (
                  "Submit for Analysis"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Upload Status */}
          <Card className="bg-[#262626] border-[#404040]">
            <CardHeader>
              <CardTitle className="text-white">Upload Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Video File</span>
                {files.video ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Uploaded
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-[#404040] text-[#B0AFAF] border-[#404040]"
                  >
                    Pending
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">GPS Data</span>
                {files.gps ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Uploaded
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-[#404040] text-[#B0AFAF] border-[#404040]"
                  >
                    Optional
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Match Details</span>
                {uploadData.match_date ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Complete
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-[#404040] text-[#B0AFAF] border-[#404040]"
                  >
                    Required
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
