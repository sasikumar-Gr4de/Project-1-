import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const PlayerForm = ({ isOpen, onClose, onSave, player }) => {
  const [formData, setFormData] = useState({
    name: "",
    date_of_birth: "",
    nationality: "",
    current_club: "",
    primary_position: "",
    height_cm: "",
    weight_kg: "",
    preferred_foot: "Right",
    status: "active",
  });

  const positions = ["Goalkeeper", "Defender", "Midfielder", "Forward"];
  const feet = ["Right", "Left"];
  const statuses = [
    { value: "active", label: "Active" },
    { value: "injured", label: "Injured" },
    { value: "suspended", label: "Suspended" },
    { value: "inactive", label: "Inactive" },
  ];

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name || "",
        date_of_birth: player.date_of_birth || "",
        nationality: player.nationality || "",
        current_club: player.current_club || "",
        primary_position: player.primary_position || "",
        height_cm: player.height_cm || "",
        weight_kg: player.weight_kg || "",
        preferred_foot: player.preferred_foot || "Right",
        status: player.status || "active",
      });
    } else {
      setFormData({
        name: "",
        date_of_birth: "",
        nationality: "",
        current_club: "",
        primary_position: "",
        height_cm: "",
        weight_kg: "",
        preferred_foot: "Right",
        status: "active",
      });
    }
  }, [player, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      height_cm: parseInt(formData.height_cm),
      weight_kg: parseInt(formData.weight_kg),
    });
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>{player ? "Edit Player" : "Add New Player"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">
                Basic Information
              </h3>

              <div>
                <Label htmlFor="name" className="text-gray-300">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="date_of_birth" className="text-gray-300">
                  Date of Birth
                </Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) =>
                    handleChange("date_of_birth", e.target.value)
                  }
                  className="bg-gray-700 border-gray-600 text-white mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="nationality" className="text-gray-300">
                  Nationality
                </Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => handleChange("nationality", e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="current_club" className="text-gray-300">
                  Current Club
                </Label>
                <Input
                  id="current_club"
                  value={formData.current_club}
                  onChange={(e) => handleChange("current_club", e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white mt-1"
                  required
                />
              </div>
            </div>

            {/* Physical & Position */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">
                Physical & Position
              </h3>

              <div>
                <Label htmlFor="primary_position" className="text-gray-300">
                  Primary Position
                </Label>
                <Select
                  value={formData.primary_position}
                  onValueChange={(value) =>
                    handleChange("primary_position", value)
                  }
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-1">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 text-white">
                    {positions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height_cm" className="text-gray-300">
                    Height (cm)
                  </Label>
                  <Input
                    id="height_cm"
                    type="number"
                    value={formData.height_cm}
                    onChange={(e) => handleChange("height_cm", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="weight_kg" className="text-gray-300">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight_kg"
                    type="number"
                    value={formData.weight_kg}
                    onChange={(e) => handleChange("weight_kg", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="preferred_foot" className="text-gray-300">
                  Preferred Foot
                </Label>
                <Select
                  value={formData.preferred_foot}
                  onValueChange={(value) =>
                    handleChange("preferred_foot", value)
                  }
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 text-white">
                    {feet.map((foot) => (
                      <SelectItem key={foot} value={foot}>
                        {foot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status" className="text-gray-300">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 text-white">
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
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
              {player ? "Update Player" : "Add Player"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerForm;
