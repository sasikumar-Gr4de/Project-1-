import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar as CalendarIcon, Trophy, Users } from "lucide-react";
import {
  TOURNAMENT_OPTIONS,
  MATCH_STATUS_OPTIONS,
} from "../../utils/constants";

const MatchForm = ({ isOpen, onClose, onSave, match, teams = [] }) => {
  const [formData, setFormData] = useState({
    team_a_id: "",
    team_b_id: "",
    tournament_name: "",
    match_day: "",
    match_date: "",
    status: "upcoming",
    team_a_score: 0,
    team_b_score: 0,
  });

  useEffect(() => {
    if (match) {
      setFormData({
        team_a_id: match.team_a_id || "",
        team_b_id: match.team_b_id || "",
        tournament_name: match.tournament_name || "",
        match_day: match.match_day || "",
        match_date: match.match_date || "",
        status: match.status || "upcoming",
        team_a_score: match.team_a_score || 0,
        team_b_score: match.team_b_score || 0,
      });
    } else {
      setFormData({
        team_a_id: "",
        team_b_id: "",
        tournament_name: "",
        match_day: "",
        match_date: "",
        status: "upcoming",
        team_a_score: 0,
        team_b_score: 0,
      });
    }
  }, [match, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get team names for display
    const teamA = teams.find((t) => t.id === parseInt(formData.team_a_id));
    const teamB = teams.find((t) => t.id === parseInt(formData.team_b_id));

    const matchData = {
      ...formData,
      team_a_name: teamA?.name || "",
      team_b_name: teamB?.name || "",
      team_a_logo: teamA?.team_mark || "",
      team_b_logo: teamB?.team_mark || "",
    };

    onSave(matchData);
  };

  const teamOptions = teams.map((team) => ({
    value: team.id.toString(),
    label: team.name,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            {match ? "Edit Match" : "Create New Match"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Team A Selection */}
          <div className="space-y-2">
            <Label htmlFor="team-a-select">Team A (Home) *</Label>
            <Select
              value={formData.team_a_id}
              onValueChange={(value) => handleInputChange("team_a_id", value)}
            >
              <SelectTrigger
                id="team-a-select"
                className="bg-gray-700 border-gray-600"
              >
                <SelectValue placeholder="Select home team" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 text-white">
                {teamOptions.map((team) => (
                  <SelectItem key={team.value} value={team.value}>
                    {team.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Team B Selection */}
          <div className="space-y-2">
            <Label htmlFor="team-b-select">Team B (Away) *</Label>
            <Select
              value={formData.team_b_id}
              onValueChange={(value) => handleInputChange("team_b_id", value)}
            >
              <SelectTrigger
                id="team-b-select"
                className="bg-gray-700 border-gray-600"
              >
                <SelectValue placeholder="Select away team" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 text-white">
                {teamOptions
                  .filter((team) => team.value !== formData.team_a_id)
                  .map((team) => (
                    <SelectItem key={team.value} value={team.value}>
                      {team.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tournament */}
          <div className="space-y-2">
            <Label htmlFor="tournament-select">Tournament *</Label>
            <Select
              value={formData.tournament_name}
              onValueChange={(value) =>
                handleInputChange("tournament_name", value)
              }
            >
              <SelectTrigger
                id="tournament-select"
                className="bg-gray-700 border-gray-600"
              >
                <SelectValue placeholder="Select tournament" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {TOURNAMENT_OPTIONS.map((tournament) => (
                  <SelectItem key={tournament.value} value={tournament.value}>
                    {tournament.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Match Day */}
          <div className="space-y-2">
            <Label htmlFor="match-day">Match Day *</Label>
            <Input
              id="match-day"
              type="number"
              min="1"
              value={formData.match_day}
              onChange={(e) => handleInputChange("match_day", e.target.value)}
              placeholder="Enter match day number"
              className="bg-gray-700 border-gray-600"
              required
            />
          </div>

          {/* Match Date */}
          <div className="space-y-2">
            <Label htmlFor="match-date">Match Date & Time *</Label>
            <Input
              id="match-date"
              type="datetime-local"
              value={formData.match_date}
              onChange={(e) => handleInputChange("match_date", e.target.value)}
              className="bg-gray-700 border-gray-600"
              required
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status-select">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger
                id="status-select"
                className="bg-gray-700 border-gray-600"
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 text-white">
                {MATCH_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Scores (only for completed matches) */}
          {(formData.status === "completed" || formData.status === "live") && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-700/30 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="team-a-score">Team A Score</Label>
                <Input
                  id="team-a-score"
                  type="number"
                  min="0"
                  value={formData.team_a_score}
                  onChange={(e) =>
                    handleInputChange(
                      "team_a_score",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-b-score">Team B Score</Label>
                <Input
                  id="team-b-score"
                  type="number"
                  min="0"
                  value={formData.team_b_score}
                  onChange={(e) =>
                    handleInputChange(
                      "team_b_score",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="bg-gray-700 border-gray-600"
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {match ? "Update Match" : "Create Match"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MatchForm;
