import { useState } from "react";
import { Calendar, MapPin, Trophy, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MatchInfoForm = ({
  matchData,
  homeClub,
  awayClub,
  isEditing,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    venue: matchData.venue || "",
    competition: matchData.competition || "",
    match_date: matchData.match_date || "",
    duration_minutes: matchData.duration_minutes || 90,
  });

  const handleSave = () => {
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
              {matchData.venue}
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
              Date: {new Date(matchData.match_date).toLocaleDateString()}
            </div>
            <div>Competition: {matchData.competition}</div>
            <div>Duration: {matchData.duration_minutes} minutes</div>
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
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="competition">Competition</Label>
          <Input
            id="competition"
            value={formData.competition}
            onChange={(e) => handleChange("competition", e.target.value)}
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
            value={formData.duration_minutes}
            onChange={(e) =>
              handleChange("duration_minutes", parseInt(e.target.value))
            }
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={() => onSave(matchData)}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};

export default MatchInfoForm;
