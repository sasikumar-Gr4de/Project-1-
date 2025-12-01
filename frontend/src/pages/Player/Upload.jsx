import { useState, useEffect } from "react";
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
  MapPin,
  Palette,
  Clock,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useDataStore } from "@/store/dataStore";
import { FOOTBALL_POSITIONS, JERSEY_COLORS } from "@/utils/constants";

const Upload = () => {
  // const { fetchDashboard } = useUserStore();
  const { toast } = useToast();
  const [uploadData, setUploadData] = useState({
    match_date: "",
    jersey_number: "",
    position: "",
    jersey_color: "",
    opponent_jersey_color: "",
    notes: "",
    competition: "",
    opponent: "",
    location: "",
    minutes: "",
  });
  const [files, setFiles] = useState({
    video: null,
    gps: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [queueId, setQueueId] = useState(null);
  // const [queueStatus, setQueueStatus] = useState(null);
  // const [pollingInterval, setPollingInterval] = useState(null);

  const { uploadPlayerData } = useDataStore();

  const handleInputChange = (field, value) => {
    setUploadData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (type, result) => {
    if (result[0]?.success) {
      setFiles((prev) => ({ ...prev, [type]: result[0].url }));
    }
  };

  // Poll queue status
  // const pollQueueStatus = async (id) => {
  //   try {
  //     const response = await api.get(`/queue/v1/queue/${id}/status`);
  //     const status = response.data.data;

  //     setQueueStatus(status);

  //     if (status.status === "completed") {
  //       // Stop polling and show success
  //       if (pollingInterval) {
  //         clearInterval(pollingInterval);
  //         setPollingInterval(null);
  //       }

  //       toast({
  //         title: "Success",
  //         description: "Your report is ready!",
  //         variant: "success",
  //       });
  //       fetchDashboard(); // Refresh dashboard

  //       // Reset form after success
  //       setUploadData({
  //         match_date: "",
  //         jersey_number: "",
  //         position: "",
  //         jersey_color: "",
  //         opponent_jersey_color: "",
  //         notes: "",
  //         competition: "",
  //         opponent: "",
  //         location: "",
  //         minutes: "",
  //       });
  //       setFiles({ video: null, gps: null });
  //       setQueueId(null);
  //       setQueueStatus(null);
  //     } else if (status.status === "failed") {
  //       // Stop polling and show error
  //       if (pollingInterval) {
  //         clearInterval(pollingInterval);
  //         setPollingInterval(null);
  //       }

  //       toast({
  //         title: "Error",
  //         description: "Analysis failed. Please try again.",
  //         variant: "error",
  //       });

  //       setQueueId(null);
  //       setQueueStatus(null);
  //     }
  //   } catch (error) {
  //     console.error("Error polling queue status:", error);
  //   }
  // };

  // Start polling when queueId is set
  // useEffect(() => {
  //   if (queueId && !pollingInterval) {
  //     // Poll immediately, then every 10 seconds
  //     pollQueueStatus(queueId);
  //     const interval = setInterval(() => pollQueueStatus(queueId), 10000);
  //     setPollingInterval(interval);
  //   }

  //   return () => {
  //     if (pollingInterval) {
  //       clearInterval(pollingInterval);
  //       setPollingInterval(null);
  //     }
  //   };
  // }, [queueId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !files.video ||
      !uploadData.match_date ||
      !uploadData.jersey_number ||
      !uploadData.position ||
      !uploadData.jersey_color ||
      !uploadData.opponent_jersey_color
    ) {
      toast({
        title: "Error",
        description: "Please provide video file and required fields",
        variant: "error",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadPayload = {
        video_url: files.video,
        gps_url: files.gps || undefined,
        match_date: uploadData.match_date,
        upload_source: "gr4de",
        metadata: {
          competition: uploadData.competition || undefined,
          opponent: uploadData.opponent || undefined,
          location: uploadData.location || undefined,
          minutes: uploadData.minutes
            ? parseInt(uploadData.minutes)
            : undefined,
          notes: uploadData.notes || undefined, // Note singular in backend
          postion: uploadData.position || undefined, // Typo in backend
          jersey_number: uploadData.jersey_number || undefined, // Keep as number
          jersey_color: uploadData.jersey_color || undefined, // Keep as is
          opponent_jersey_color: uploadData.opponent_jersey_color || undefined, // Keep as is
        },
      };

      const response = await uploadPlayerData(uploadPayload);

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

      clearInterval(interval);
      setUploadProgress(100);

      if (response.data.success) {
        const { queue_id } = response.data.data;
        setQueueId(queue_id);

        toast({
          title: "Success",
          description: "Upload successful! Processing your data...",
          variant: "success",
        });

        // Reset form fields but keep queue tracking
        setUploadData({
          match_date: "",
          position: "",
          jersey_number: "",
          jersey_color: "",
          opponent_jersey_color: "",
          notes: "",
          competition: "",
          opponent: "",
          location: "",
          minutes: "",
        });
        setFiles({ video: null, gps: null });
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Upload failed",
          variant: "error",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: response.data.message || "Upload failed",
        variant: "error",
      });
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
    uploadData.opponent_jersey_color &&
    uploadData.position &&
    !isUploading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            Upload Match Data
          </h1>
          <p className="text-(--muted-text) text-lg mt-2 font-['Orbitron']">
            Upload your match video and GPS data for performance analysis
          </p>
        </div>
      </div>

      {/* Queue Status */}
      {/* {queueId && queueStatus && (
        <Card className="border-blue-500/20 bg-blue-500/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-blue-400">
                  Processing your data... ({queueStatus.status})
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    Queue ID: {queueId}
                  </Badge>
                  {queueStatus.logs && (
                    <span className="text-xs text-(--muted-text)">
                      {queueStatus.logs}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )} */}

      {/* Upload Progress */}
      {isUploading && (
        <Card className="bg-(--surface-1) border-(--surface-2)">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white ">
                  Processing upload...
                </span>
                <span className="text-sm text-(--muted-text) ">
                  {uploadProgress}%
                </span>
              </div>
              <Progress
                value={uploadProgress}
                className="w-full bg-(--surface-2)"
              />
              <p className="text-xs text-(--muted-text) ">
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
          <Card className="bg-(--surface-1) border-(--surface-2) hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white ">
                <Video className="w-5 h-5 text-primary" />
                <span>Match Video</span>
              </CardTitle>
              <CardDescription className="text-(--muted-text) ">
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
          <Card className="bg-(--surface-1) border-(--surface-2) hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white ">
                <FileText className="w-5 h-5 text-primary" />
                <span>GPS Data (Optional)</span>
              </CardTitle>
              <CardDescription className="text-(--muted-text) ">
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
          {/* Upload Status */}
          <Card className="bg-(--surface-1) border-(--surface-2) hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white ">Upload Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white ">Video File</span>
                {files.video ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 ">
                    Uploaded
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-(--surface-2) text-(--muted-text) border-(--surface-2) "
                  >
                    Required
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white ">GPS Data</span>
                {files.gps ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 ">
                    Uploaded
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-(--surface-2) text-(--muted-text) border-(--surface-2) "
                  >
                    Optional
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white ">Match Details</span>
                {uploadData.match_date ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 ">
                    Complete
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-(--surface-2) text-(--muted-text) border-(--surface-2) "
                  >
                    Required
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white ">Player Info</span>
                {uploadData.jersey_number && uploadData.position ? (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 ">
                    Added
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-(--surface-2) text-(--muted-text) border-(--surface-2) "
                  >
                    Optional
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Match Details */}
        <div className="space-y-6">
          <Card className="bg-(--surface-1) border-(--surface-2) hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white ">Match Details</CardTitle>
              <CardDescription className="text-(--muted-text) ">
                Provide information about the match and your participation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Match Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white ">
                  Match Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-(--muted-text)" />
                  <Input
                    type="date"
                    value={uploadData.match_date}
                    onChange={(e) =>
                      handleInputChange("match_date", e.target.value)
                    }
                    className="pl-10 h-11 bg-(--surface-0) border-(--surface-2) text-white placeholder:text-(--muted-text) focus:border-primary "
                    required
                  />
                </div>
              </div>

              {/* Competition */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white ">
                  Competition
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Premier League"
                  value={uploadData.competition}
                  onChange={(e) =>
                    handleInputChange("competition", e.target.value)
                  }
                  className="h-11 bg-(--surface-0) border-(--surface-2) text-white placeholder:text-(--muted-text) focus:border-primary "
                />
              </div>

              {/* Opponent */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white ">
                  Opponent
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Manchester City"
                  value={uploadData.opponent}
                  onChange={(e) =>
                    handleInputChange("opponent", e.target.value)
                  }
                  className="h-11 bg-(--surface-0) border-(--surface-2) text-white placeholder:text-(--muted-text) focus:border-primary "
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white ">
                  Location
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Home, Away, Neutral"
                  value={uploadData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="h-11 bg-(--surface-0) border-(--surface-2) text-white placeholder:text-(--muted-text) focus:border-primary "
                />
              </div>

              {/* Minutes Played */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white ">
                  Minutes Played
                </label>
                <Input
                  type="number"
                  min="1"
                  max="120"
                  placeholder="e.g., 90"
                  value={uploadData.minutes}
                  onChange={(e) => handleInputChange("minutes", e.target.value)}
                  className="h-11 bg-(--surface-0) border-(--surface-2) text-white placeholder:text-(--muted-text) focus:border-primary "
                />
              </div>

              {/* Jersey Number and Position */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Position - Full width on mobile */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Position *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-(--muted-text) z-10" />
                    <Select
                      value={uploadData.position}
                      onValueChange={(value) =>
                        handleInputChange("position", value)
                      }
                    >
                      <SelectTrigger className="pl-10 h-11 bg-(--surface-0) border-(--surface-2) text-white focus:border-primary w-full">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent className="bg-(--surface-1) border-(--surface-2) text-white w-full">
                        {FOOTBALL_POSITIONS.map((position) => (
                          <SelectItem
                            key={position}
                            value={position}
                            className="w-full"
                          >
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Jersey Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white ">
                    Jersey Number
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., 7"
                    value={uploadData.jersey_number}
                    onChange={(e) =>
                      handleInputChange("jersey_number", e.target.value)
                    }
                    className="h-11 bg-(--surface-0) border-(--surface-2) text-white placeholder:text-(--muted-text) focus:border-primary "
                  />
                </div>
              </div>

              {/* Jersey Colors - Side by side on larger screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Your Jersey Color */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Your Jersey Color *
                  </label>
                  <div className="relative">
                    <Palette className="absolute left-3 top-3 h-4 w-4 text-(--muted-text) z-10" />
                    <Select
                      value={uploadData.jersey_color}
                      onValueChange={(value) =>
                        handleInputChange("jersey_color", value)
                      }
                    >
                      <SelectTrigger className="pl-10 h-11 bg-(--surface-0) border-(--surface-2) text-white focus:border-primary w-full">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent className="bg-(--surface-1) border-(--surface-2) text-white max-h-60 w-full">
                        {JERSEY_COLORS.map((color) => (
                          <SelectItem
                            key={color}
                            value={color}
                            className="w-full"
                          >
                            <div className="flex items-center space-x-2 w-full">
                              <div
                                className="w-4 h-4 rounded border border-(--surface-2) shrink-0"
                                style={{
                                  backgroundColor: color.toLowerCase(),
                                  borderColor:
                                    color.toLowerCase() === "white"
                                      ? "var(--surface-2)"
                                      : "transparent",
                                }}
                              />
                              <span className="truncate">{color}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Opponent Jersey Color */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Opponent Jersey Color *
                  </label>
                  <div className="relative">
                    <Palette className="absolute left-3 top-3 h-4 w-4 text-(--muted-text) z-10" />
                    <Select
                      value={uploadData.opponent_jersey_color}
                      onValueChange={(value) =>
                        handleInputChange("opponent_jersey_color", value)
                      }
                    >
                      <SelectTrigger className="pl-10 h-11 bg-(--surface-0) border-(--surface-2) text-white focus:border-primary w-full">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent className="bg-(--surface-1) border-(--surface-2) text-white max-h-60 w-full">
                        {JERSEY_COLORS.map((color) => (
                          <SelectItem
                            key={color}
                            value={color}
                            className="w-full"
                          >
                            <div className="flex items-center space-x-2 w-full">
                              <div
                                className="w-4 h-4 rounded border border-(--surface-2) shrink-0"
                                style={{
                                  backgroundColor: color.toLowerCase(),
                                  borderColor:
                                    color.toLowerCase() === "white"
                                      ? "var(--surface-2)"
                                      : "transparent",
                                }}
                              />
                              <span className="truncate">{color}</span>
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
                <label className="text-sm font-medium text-white ">
                  Additional Notes (Optional)
                </label>
                <Textarea
                  placeholder="Any additional context about the match, conditions, specific moments to analyze, or tactical information..."
                  value={uploadData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={4}
                  className="bg-(--surface-0) border-(--surface-2) text-white placeholder:text-(--muted-text) focus:border-primary "
                />
              </div>

              {/* Requirements */}
              <div className="rounded-lg bg-(--surface-0) p-4 space-y-2 border border-(--surface-2)">
                <h4 className="text-sm font-medium text-white ">
                  Upload Requirements
                </h4>
                <ul className="text-sm text-(--muted-text) space-y-1 ">
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
                className="w-full h-11 bg-linear-to-r from-primary to-(--accent-2) text-(--ink) hover:from-(--accent-2) hover:to-primary font-semibold disabled:bg-(--surface-2) disabled:text-(--ink) transition-all duration-300 "
                size="lg"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-(--ink) mr-2"></div>
                    Processing...
                  </>
                ) : (
                  "Submit for Analysis"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default Upload;
