import React, { useState } from "react";
import { uploadAPI } from "../../services/base.api";
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
  Upload,
  Video,
  FileText,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const Upload = () => {
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
      formData.append("user_id", "current"); // Will be set by backend from token
      formData.append("match_date", uploadData.match_date);
      formData.append("notes", uploadData.notes || "");

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

      const response = await uploadAPI.uploadData(formData);
      clearInterval(interval);
      setUploadProgress(100);

      if (response.success) {
        setUploadResult({ success: true, data: response.data });
        // Reset form
        setUploadData({ match_date: "", notes: "" });
        setFiles({ video: null, gps: null });
      } else {
        setUploadResult({ success: false, error: response.message });
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
        <h1 className="text-3xl font-bold">Upload Match Data</h1>
        <p className="text-muted-foreground">
          Upload your video and GPS data for performance analysis
        </p>
      </div>

      {/* Upload Result */}
      {uploadResult && (
        <Card
          className={
            uploadResult.success
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              {uploadResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <div>
                <p
                  className={
                    uploadResult.success ? "text-green-800" : "text-red-800"
                  }
                >
                  {uploadResult.success
                    ? "Data uploaded successfully! Your report is being processed."
                    : `Upload failed: ${uploadResult.error}`}
                </p>
                {uploadResult.success && uploadResult.data?.queue_item && (
                  <Badge
                    variant="outline"
                    className="mt-1 bg-green-100 text-green-800"
                  >
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
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Processing upload...
                </span>
                <span className="text-sm text-muted-foreground">
                  {uploadProgress}%
                </span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Video className="w-5 h-5" />
                <span>Match Video</span>
              </CardTitle>
              <CardDescription>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>GPS Data (Optional)</span>
              </CardTitle>
              <CardDescription>
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
          <Card>
            <CardHeader>
              <CardTitle>Match Details</CardTitle>
              <CardDescription>
                Provide information about the match
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Match Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Match Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={uploadData.match_date}
                    onChange={(e) =>
                      handleInputChange("match_date", e.target.value)
                    }
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Notes</label>
                <Textarea
                  placeholder="Any additional context about the match, conditions, or specific moments to analyze..."
                  value={uploadData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={4}
                />
              </div>

              {/* Requirements */}
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <h4 className="text-sm font-medium">Upload Requirements</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
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
                className="w-full h-11"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Submit for Analysis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Upload Status */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Video File</span>
                {files.video ? (
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    Uploaded
                  </Badge>
                ) : (
                  <Badge variant="outline">Pending</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">GPS Data</span>
                {files.gps ? (
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    Uploaded
                  </Badge>
                ) : (
                  <Badge variant="outline">Optional</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Match Details</span>
                {uploadData.match_date ? (
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    Complete
                  </Badge>
                ) : (
                  <Badge variant="outline">Required</Badge>
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
