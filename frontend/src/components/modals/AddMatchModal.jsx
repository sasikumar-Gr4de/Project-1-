import React, { useState } from "react";
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

const AddMatchModal = ({ isOpen, onClose, onSave, clubs }) => {
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

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.home_club_id === formData.away_club_id) {
      alert("Home and away clubs cannot be the same");
      return;
    }

    onSave({
      ...formData,
      score_home: formData.score_home ? parseInt(formData.score_home) : null,
      score_away: formData.score_away ? parseInt(formData.score_away) : null,
      duration_minutes: formData.duration_minutes
        ? parseInt(formData.duration_minutes)
        : null,
    });
    onClose();
  };

  const handleVideoUpload = async (files) => {
    const file = files[0];
    setUploadedVideo(file);

    // Simulate AWS upload
    const awsService = await import("@/services/aws.service");
    const result = await awsService.uploadFile(file, "match-videos/");

    if (result.success) {
      setFormData((prev) => ({ ...prev, video_url: result.url }));
    }
  };

  const matchStatuses = ["scheduled", "ongoing", "completed", "postponed"];
  const qaStatuses = ["pending", "approved", "rejected"];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <CardHeader className="shrink-0 border-b">
          <CardTitle>Add New Match</CardTitle>
        </CardHeader>

        {/* Scrollable Body */}
        <CardContent className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Home Club *</label>
                <Select
                  value={formData.home_club_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, home_club_id: value }))
                  }
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
                <label className="text-sm font-medium">Away Club *</label>
                <Select
                  value={formData.away_club_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, away_club_id: value }))
                  }
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
                <label className="text-sm font-medium">Match Date *</label>
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
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Match Status</label>
                <Select
                  value={formData.match_status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, match_status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {matchStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
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
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select QA status" />
                  </SelectTrigger>
                  <SelectContent>
                    {qaStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Match Video (Optional)
              </label>
              <VideoUpload onUpload={handleVideoUpload} />
              {uploadedVideo && (
                <p className="text-sm text-muted-foreground">
                  Selected: {uploadedVideo.name}
                </p>
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
              />
            </div>
          </form>
        </CardContent>

        {/* Fixed Footer */}
        <div className="shrink-0 border-t p-6">
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90"
            >
              Save Match
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AddMatchModal;
