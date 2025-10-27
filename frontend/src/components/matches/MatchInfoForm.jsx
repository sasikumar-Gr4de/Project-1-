// src/components/matches/MatchInfoForm.jsx
import { useState, useEffect } from "react";
import { Calendar, MapPin, Trophy, Clock, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MatchInfoForm = ({
  matchData,
  homeClub,
  awayClub,
  isEditing,
  onSave,
  saving = false,
}) => {
  const [formData, setFormData] = useState({
    venue: matchData.venue || "",
    competition: matchData.competition || "",
    match_date: matchData.match_date || "",
    duration_minutes: matchData.duration_minutes || 90,
  });

  // Update form data when matchData changes
  useEffect(() => {
    setFormData({
      venue: matchData.venue || "",
      competition: matchData.competition || "",
      match_date: matchData.match_date || "",
      duration_minutes: matchData.duration_minutes || 90,
    });
  }, [matchData]);

  const handleSave = () => {
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    // Reset form data to original match data
    setFormData({
      venue: matchData.venue || "",
      competition: matchData.competition || "",
      match_date: matchData.match_date || "",
      duration_minutes: matchData.duration_minutes || 90,
    });
    onSave(matchData); // This will trigger the parent to exit edit mode
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-medium">Teams</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {homeClub?.club_name} vs {awayClub?.club_name}
            </div>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">Venue</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {matchData.venue || "Not specified"}
            </div>
          </div>
        </div>

        <div className="p-4 border border-border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-medium">Match Details</span>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>
              Date:{" "}
              {matchData.match_date
                ? new Date(matchData.match_date).toLocaleDateString()
                : "Not specified"}
            </div>
            <div>Competition: {matchData.competition || "Not specified"}</div>
            <div>Duration: {matchData.duration_minutes || 90} minutes</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="venue">Venue</Label>
          <Input
            id="venue"
            value={formData.venue}
            onChange={(e) => handleChange("venue", e.target.value)}
            placeholder="Enter match venue"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="competition">Competition</Label>
          <Input
            id="competition"
            value={formData.competition}
            onChange={(e) => handleChange("competition", e.target.value)}
            placeholder="Enter competition name"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="match_date">Match Date</Label>
          <Input
            id="match_date"
            type="date"
            value={formData.match_date}
            onChange={(e) => handleChange("match_date", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration_minutes">Duration (minutes)</Label>
          <Input
            id="duration_minutes"
            type="number"
            min="1"
            max="180"
            value={formData.duration_minutes}
            onChange={(e) =>
              handleChange("duration_minutes", parseInt(e.target.value) || 90)
            }
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={handleCancel} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default MatchInfoForm;
