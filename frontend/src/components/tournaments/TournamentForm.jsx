import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORGANIZER_OPTIONS, MATCH_STATUS_OPTIONS } from "@/utils/constants";

const TournamentForm = ({ isOpen, onClose, onSave, tournament }) => {
  const [formData, setFormData] = useState({
    name: "",
    organizer: "",
    location: "",
    season: "",
    start_date: "",
    end_date: "",
    description: "",
    status: "upcoming",
  });

  useEffect(() => {
    if (tournament) {
      setFormData({
        name: tournament.name || "",
        organizer: tournament.organizer || "",
        location: tournament.location || "",
        season: tournament.season || "",
        start_date: tournament.start_date || "",
        end_date: tournament.end_date || "",
        description: tournament.description || "",
        status: tournament.status || "upcoming",
      });
    } else {
      setFormData({
        name: "",
        organizer: "",
        location: "",
        season: "",
        start_date: "",
        end_date: "",
        description: "",
        status: "upcoming",
      });
    }
  }, [tournament]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const currentYear = new Date().getFullYear();
  const seasonOptions = [
    `${currentYear - 1}/${currentYear}`,
    `${currentYear}/${currentYear + 1}`,
    `${currentYear + 1}/${currentYear + 2}`,
    `${currentYear.toString()}`,
    `${(currentYear + 1).toString()}`,
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {tournament ? "Edit Tournament" : "Create New Tournament"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tournament Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Tournament Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter tournament name"
                className="bg-gray-700 border-gray-600"
                required
              />
            </div>

            {/* Organizer */}
            <div className="space-y-2">
              <Label htmlFor="organizer">Organizer</Label>
              <Select
                value={formData.organizer}
                onValueChange={(value) => handleChange("organizer", value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
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
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Enter location"
                className="bg-gray-700 border-gray-600"
                required
              />
            </div>

            {/* Season */}
            <div className="space-y-2">
              <Label htmlFor="season">Season</Label>
              <Select
                value={formData.season}
                onValueChange={(value) => handleChange("season", value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600 text-white">
                  {seasonOptions.map((season) => (
                    <SelectItem key={season} value={season}>
                      {season}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange("start_date", e.target.value)}
                className="bg-gray-700 border-gray-600"
                required
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange("end_date", e.target.value)}
                className="bg-gray-700 border-gray-600"
                required
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600">
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

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter tournament description"
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {tournament ? "Update Tournament" : "Create Tournament"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TournamentForm;
