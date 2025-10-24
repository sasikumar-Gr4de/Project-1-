import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import VideoUpload from "@/components/common/VideoUpload";
import { X } from "lucide-react";

const AddMatchModal = ({ isOpen, onClose, onSave, match, clubs }) => {
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    home_club_id: "",
    away_club_id: "",
    match_date: "",
    venue: "",
    competition: "",
    match_status: "scheduled",
    score_home: "",
    score_away: "",
    duration_minutes: "",
    video_url: "",
    qa_status: "pending",
    notes: "",
  });
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);

  useEffect(() => {
    if (match) {
      // Format date for datetime-local input
      const matchDate = match.match_date
        ? new Date(match.match_date)
        : new Date();
      const formattedDate = matchDate.toISOString().slice(0, 16);

      setFormData({
        home_club_id: match.home_club_id || "",
        away_club_id: match.away_club_id || "",
        match_date: formattedDate,
        venue: match.venue || "",
        competition: match.competition || "",
        match_status: match.match_status || "scheduled",
        score_home: match.score_home?.toString() || "",
        score_away: match.score_away?.toString() || "",
        duration_minutes: match.duration_minutes?.toString() || "",
        video_url: match.video_url || "",
        qa_status: match.qa_status || "pending",
        notes: match.notes || "",
      });
    } else {
      setFormData({
        home_club_id: "",
        away_club_id: "",
        match_date: new Date().toISOString().slice(0, 16),
        venue: "",
        competition: "",
        match_status: "scheduled",
        score_home: "",
        score_away: "",
        duration_minutes: "",
        video_url: "",
        qa_status: "pending",
        notes: "",
      });
    }
  }, [match]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.home_club_id === formData.away_club_id) {
      alert("Home and away clubs cannot be the same");
      return;
    }

    setIsSending(true);

    try {
      const submitData = {
        ...formData,
        score_home: formData.score_home ? parseInt(formData.score_home) : null,
        score_away: formData.score_away ? parseInt(formData.score_away) : null,
        duration_minutes: formData.duration_minutes
          ? parseInt(formData.duration_minutes)
          : null,
      };

      if (match) {
        submitData.match_id = match.match_id;
      }

      await onSave(submitData);
      onClose();
    } catch (error) {
      console.error("Error saving match:", error);
      alert("Failed to save match. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleVideoUpload = async (results) => {
    const result = results[0];
    if (result.success) {
      window.alert(result.url);
      setFormData((prev) => ({
        ...prev,
        video_url: result.url || "",
      }));
    } else {
      // If upload failed, clear the video_url
      setFormData((prev) => ({
        ...prev,
        video_url: "",
      }));
      alert(`Video upload failed: ${result.error}`);
    }
  };

  const handleRemoveVideo = () => {
    setUploadedVideo(null);
    setFormData((prev) => ({ ...prev, video_url: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const matchStatuses = ["scheduled", "ongoing", "completed", "postponed"];
  const qaStatuses = ["pending", "approved", "rejected"];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <CardHeader className="shrink-0 border-b">
          <CardTitle className="flex items-center justify-between">
            <span>{match ? "Edit Match" : "Add New Match"}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
              disabled={isSending || isUploadingVideo}
            >
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>

        {/* Scrollable Body */}
        <CardContent className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Home Club <span className="text-destructive">*</span>
                </label>
                <Select
                  value={formData.home_club_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, home_club_id: value }))
                  }
                  disabled={isSending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select home club" />
                  </SelectTrigger>
                  <SelectContent>
                    {clubs.map((club) => (
                      <SelectItem key={club.club_id} value={club.club_id}>
                        {club.club_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Away Club <span className="text-destructive">*</span>
                </label>
                <Select
                  value={formData.away_club_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, away_club_id: value }))
                  }
                  disabled={isSending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select away club" />
                  </SelectTrigger>
                  <SelectContent>
                    {clubs.map((club) => (
                      <SelectItem key={club.club_id} value={club.club_id}>
                        {club.club_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Match Date <span className="text-destructive">*</span>
                </label>
                <Input
                  type="datetime-local"
                  required
                  value={formData.match_date}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      match_date: e.target.value,
                    }))
                  }
                  disabled={isSending}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Venue</label>
                <Input
                  value={formData.venue}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, venue: e.target.value }))
                  }
                  placeholder="Enter venue"
                  disabled={isSending}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Competition</label>
                <Input
                  value={formData.competition}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      competition: e.target.value,
                    }))
                  }
                  placeholder="e.g., La Liga Juvenil"
                  disabled={isSending}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Match Status</label>
                <Select
                  value={formData.match_status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, match_status: value }))
                  }
                  disabled={isSending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {matchStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.match_status === "completed" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Home Score</label>
                    <Input
                      type="number"
                      value={formData.score_home}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          score_home: e.target.value,
                        }))
                      }
                      placeholder="Home score"
                      disabled={isSending}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Away Score</label>
                    <Input
                      type="number"
                      value={formData.score_away}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          score_away: e.target.value,
                        }))
                      }
                      placeholder="Away score"
                      disabled={isSending}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Duration (minutes)
                    </label>
                    <Input
                      type="number"
                      value={formData.duration_minutes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          duration_minutes: e.target.value,
                        }))
                      }
                      placeholder="e.g., 90"
                      disabled={isSending}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">QA Status</label>
                <Select
                  value={formData.qa_status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, qa_status: value }))
                  }
                  disabled={isSending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select QA status" />
                  </SelectTrigger>
                  <SelectContent>
                    {qaStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Video Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Match Video (Optional)
                </label>
                {formData.video_url && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(formData.video_url, "_blank")}
                    disabled={isSending}
                  >
                    View Current Video
                  </Button>
                )}
              </div>

              <VideoUpload
                onUpload={handleVideoUpload}
                disabled={isSending || isUploadingVideo}
              />

              {isUploadingVideo && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading video...</span>
                    <span>{videoUploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${videoUploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {uploadedVideo && (
                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-medium">VID</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {uploadedVideo.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Size: {(uploadedVideo.size / 1024 / 1024).toFixed(2)}MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveVideo}
                    disabled={isUploadingVideo}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Additional comments or observations"
                rows={3}
                disabled={isSending}
              />
            </div>
          </form>
        </CardContent>

        {/* Fixed Footer */}
        <div className="shrink-0 border-t p-6">
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSending || isUploadingVideo}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90"
              disabled={isSending || isUploadingVideo}
            >
              {isSending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{match ? "Updating..." : "Creating..."}</span>
                </div>
              ) : match ? (
                "Update Match"
              ) : (
                "Save Match"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AddMatchModal;
