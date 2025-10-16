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
import { Users, Upload, X, Building, Trophy, User } from "lucide-react";
import { TOURNAMENT_OPTIONS, ORGANIZER_OPTIONS } from "../../utils/constants";

const TeamForm = ({ isOpen, onClose, onSave, team }) => {
  const [formData, setFormData] = useState({
    name: "",
    admin_name: "",
    tournament: "",
    organizer: "",
    location: "",
    team_mark: "",
    status: "active",
  });
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || "",
        admin_name: team.admin_name || "",
        tournament: team.tournament || "",
        organizer: team.organizer || "",
        location: team.location || "",
        team_mark: team.team_mark || "",
        status: team.status || "active",
      });
      setPreviewImage(team.team_mark || "");
    } else {
      setFormData({
        name: "",
        admin_name: "",
        tournament: "",
        organizer: "",
        location: "",
        team_mark: "",
        status: "active",
      });
      setPreviewImage("");
    }
  }, [team, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        setFormData((prev) => ({ ...prev, team_mark: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage("");
    setFormData((prev) => ({ ...prev, team_mark: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            {team ? "Edit Team" : "Create New Team"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Team Logo Upload */}
          <div className="space-y-3">
            <Label htmlFor="team-mark-upload">Team Logo</Label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                {previewImage ? (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Team logo preview"
                      className="h-16 w-16 rounded-full object-cover border-2 border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-700 border-2 border-dashed border-gray-600 flex items-center justify-center">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="team-mark-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Label
                  htmlFor="team-mark-upload"
                  className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-600 rounded-md text-sm bg-gray-700 hover:bg-gray-600 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Label>
              </div>
            </div>
          </div>

          {/* Team Name */}
          <div className="space-y-2">
            <Label htmlFor="team-name">Team Name *</Label>
            <Input
              id="team-name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter team name"
              className="bg-gray-700 border-gray-600"
              required
            />
          </div>

          {/* Admin Name */}
          <div className="space-y-2">
            <Label htmlFor="admin-name">Team Admin *</Label>
            <Input
              id="admin-name"
              value={formData.admin_name}
              onChange={(e) => handleInputChange("admin_name", e.target.value)}
              placeholder="Enter admin name"
              className="bg-gray-700 border-gray-600"
              required
            />
          </div>

          {/* Tournament */}
          <div className="space-y-2">
            <Label htmlFor="tournament-select">Tournament *</Label>
            <Select
              value={formData.tournament}
              onValueChange={(value) => handleInputChange("tournament", value)}
            >
              <SelectTrigger
                id="tournament-select"
                className="bg-gray-700 border-gray-600"
              >
                <SelectValue placeholder="Select tournament" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600  text-white">
                {TOURNAMENT_OPTIONS.map((tournament) => (
                  <SelectItem key={tournament.value} value={tournament.value}>
                    {tournament.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Organizer */}
          <div className="space-y-2">
            <Label htmlFor="organizer-select">Organizer *</Label>
            <Select
              value={formData.organizer}
              onValueChange={(value) => handleInputChange("organizer", value)}
            >
              <SelectTrigger
                id="organizer-select"
                className="bg-gray-700 border-gray-600 text-white"
              >
                <SelectValue placeholder="Select organizer" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 text-white">
                {ORGANIZER_OPTIONS.map((organizer) => (
                  <SelectItem key={organizer.value} value={organizer.value}>
                    {organizer.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="team-location">Location</Label>
            <Input
              id="team-location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Enter team location"
              className="bg-gray-700 border-gray-600"
            />
          </div>

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
              {team ? "Update Team" : "Create Team"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TeamForm;
