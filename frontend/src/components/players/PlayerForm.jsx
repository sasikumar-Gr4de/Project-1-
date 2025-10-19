// components/players/PlayerForm.jsx - Fixed accessibility issues
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Upload, X, Calendar } from "lucide-react";
import { ALL_POSITIONS } from "@/utils/constants";

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
    profile_picture: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const feet = ["Right", "Left"];
  const statuses = [
    { value: "active", label: "Active" },
    { value: "injured", label: "Injured" },
    { value: "suspended", label: "Suspended" },
    { value: "inactive", label: "Inactive" },
  ];

  // Generate unique IDs for each form field to prevent conflicts
  const fieldIds = {
    name: `player-name-${player?.id || "new"}`,
    date_of_birth: `player-dob-${player?.id || "new"}`,
    nationality: `player-nationality-${player?.id || "new"}`,
    current_club: `player-club-${player?.id || "new"}`,
    primary_position: `player-position-${player?.id || "new"}`,
    status: `player-status-${player?.id || "new"}`,
    height_cm: `player-height-${player?.id || "new"}`,
    weight_kg: `player-weight-${player?.id || "new"}`,
    preferred_foot: `player-foot-${player?.id || "new"}`,
    profile_picture: `player-photo-${player?.id || "new"}`,
  };

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
        profile_picture: player.profile_picture || null,
      });
      setPreviewImage(player.profile_picture || null);
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
        profile_picture: null,
      });
      setPreviewImage(null);
    }
  }, [player, isOpen]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData((prev) => ({
          ...prev,
          profile_picture: reader.result,
        }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setFormData((prev) => ({
      ...prev,
      profile_picture: null,
    }));
  };

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
      <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-4xl max-w-[95vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-gray-800 z-10 pb-4 border-b border-gray-700">
          <DialogTitle className="text-xl">
            {player ? "Edit Player" : "Add New Player"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          {/* Mobile First - Stack everything vertically on small screens */}
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Profile Picture Section - Always full width on mobile, then becomes sidebar on desktop */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">
                  Profile Picture
                </h3>

                <div className="flex flex-col items-center space-y-4 p-4 bg-gray-700/30 rounded-lg">
                  {/* Profile Picture Preview */}
                  <div className="relative">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden border-2 border-gray-600">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                      )}
                    </div>
                    {previewImage && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors border-2 border-gray-800"
                      >
                        <X className="h-3 w-3  text-white" />
                      </button>
                    )}
                  </div>

                  {/* Upload Button - FIXED: Proper label association */}
                  <div className="text-center">
                    <input
                      type="file"
                      id={fieldIds.profile_picture}
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Label
                      htmlFor={fieldIds.profile_picture}
                      className="cursor-pointer"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 w-full sm:w-auto"
                        disabled={isUploading}
                        asChild
                      >
                        <span>
                          {isUploading ? (
                            "Uploading..."
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              {previewImage ? "Change Photo" : "Upload Photo"}
                            </>
                          )}
                        </span>
                      </Button>
                    </Label>
                    <p className="text-xs text-gray-400 mt-2">
                      Square image, 300x300px+
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields - Full width on mobile, 2/3 on desktop */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">
                    Basic Information
                  </h3>

                  <div className="space-y-4">
                    {/* Full Name - Always full width */}
                    <div>
                      <Label
                        htmlFor={fieldIds.name}
                        className="text-gray-300 text-sm font-medium"
                      >
                        Full Name *
                      </Label>
                      <Input
                        id={fieldIds.name}
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white mt-1.5 h-11"
                        placeholder="Enter player's full name"
                        required
                      />
                    </div>

                    {/* Date of Birth and Nationality - Side by side on tablet+ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor={fieldIds.date_of_birth}
                          className="text-gray-300 text-sm font-medium"
                        >
                          Date of Birth *
                        </Label>
                        <div className="relative mt-1.5">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id={fieldIds.date_of_birth}
                            type="date"
                            value={formData.date_of_birth}
                            onChange={(e) =>
                              handleChange("date_of_birth", e.target.value)
                            }
                            className="bg-gray-700 border-gray-600 text-white h-11 pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor={fieldIds.nationality}
                          className="text-gray-300 text-sm font-medium"
                        >
                          Nationality *
                        </Label>
                        <Input
                          id={fieldIds.nationality}
                          value={formData.nationality}
                          onChange={(e) =>
                            handleChange("nationality", e.target.value)
                          }
                          className="bg-gray-700 border-gray-600 text-white mt-1.5 h-11"
                          placeholder="Country"
                          required
                        />
                      </div>
                    </div>

                    {/* Current Club - Always full width */}
                    <div>
                      <Label
                        htmlFor={fieldIds.current_club}
                        className="text-gray-300 text-sm font-medium"
                      >
                        Current Club *
                      </Label>
                      <Input
                        id={fieldIds.current_club}
                        value={formData.current_club}
                        onChange={(e) =>
                          handleChange("current_club", e.target.value)
                        }
                        className="bg-gray-700 border-gray-600 text-white mt-1.5 h-11"
                        placeholder="Club name"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Physical & Position Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">
                    Physical & Position
                  </h3>

                  <div className="space-y-4">
                    {/* Position and Status - Side by side on tablet+ */}
                    <div className="grid grid-cols-4 sm:grid-cols-3 gap-4">
                      <div>
                        <Label
                          htmlFor={fieldIds.primary_position}
                          className="text-gray-300 text-sm font-medium"
                        >
                          Primary Position *
                        </Label>
                        <Select
                          value={formData.primary_position}
                          onValueChange={(value) =>
                            handleChange("primary_position", value)
                          }
                        >
                          <SelectTrigger
                            id={fieldIds.primary_position}
                            className="bg-gray-700 border-gray-600 text-white mt-1.5 h-11"
                          >
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600 text-white max-h-60">
                            {ALL_POSITIONS.map((position) => (
                              <SelectItem
                                key={position.value}
                                value={position.value}
                              >
                                {position.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label
                          htmlFor={fieldIds.status}
                          className="text-gray-300 text-sm font-medium"
                        >
                          Status *
                        </Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) =>
                            handleChange("status", value)
                          }
                        >
                          <SelectTrigger
                            id={fieldIds.status}
                            className="bg-gray-700 border-gray-600 text-white mt-1.5 h-11"
                          >
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600 text-white">
                            {statuses.map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label
                          htmlFor={fieldIds.preferred_foot}
                          className="text-gray-300 text-sm font-medium"
                        >
                          Preferred Foot *
                        </Label>
                        <Select
                          value={formData.preferred_foot}
                          onValueChange={(value) =>
                            handleChange("preferred_foot", value)
                          }
                        >
                          <SelectTrigger
                            id={fieldIds.preferred_foot}
                            className="bg-gray-700 border-gray-600 text-white mt-1.5 h-11"
                          >
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
                    </div>

                    {/* Height, Weight, Foot - Stack on mobile, 3 columns on tablet+ */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label
                          htmlFor={fieldIds.height_cm}
                          className="text-gray-300 text-sm font-medium"
                        >
                          Height (cm) *
                        </Label>
                        <Input
                          id={fieldIds.height_cm}
                          type="number"
                          min="100"
                          max="250"
                          value={formData.height_cm}
                          onChange={(e) =>
                            handleChange("height_cm", e.target.value)
                          }
                          className="bg-gray-700 border-gray-600 text-white mt-1.5 h-11"
                          placeholder="175"
                          required
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor={fieldIds.weight_kg}
                          className="text-gray-300 text-sm font-medium"
                        >
                          Weight (kg) *
                        </Label>
                        <Input
                          id={fieldIds.weight_kg}
                          type="number"
                          min="30"
                          max="150"
                          value={formData.weight_kg}
                          onChange={(e) =>
                            handleChange("weight_kg", e.target.value)
                          }
                          className="bg-gray-700 border-gray-600 text-white mt-1.5 h-11"
                          placeholder="70"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Stack on mobile, side by side on tablet+ */}
          <div className="sticky bottom-0 bg-gray-800 pt-4 border-t border-gray-700 -mx-6 px-6 pb-2">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0 space-y-reverse">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 h-11 sm:h-10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white h-11 sm:h-10"
              >
                {player ? "Update Player" : "Add Player"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerForm;
