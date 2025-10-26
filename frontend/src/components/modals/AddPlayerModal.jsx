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

// Get all football positions
import {
  FOOTBALL_POSITIONS,
  PLAYER_STATUSES,
  PLAYER_FOOT_LIST,
} from "@/utils/constants";
import { capitalize } from "@/utils/helper.utils";

import AvatarUpload from "@/components/common/AvatarUpload";
import { X } from "lucide-react";

const AddPlayerModal = ({ isOpen, onClose, onSave, player, clubs }) => {
  const [isSending, setIsSending] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    position: "",
    height_cm: "",
    weight_kg: "",
    preferred_foot: "",
    current_club: "",
    nationality: "",
    status: "active",
    jersey_number: "",
    avatar_url: "",
  });

  useEffect(() => {
    if (player) {
      setFormData({
        full_name: player.full_name || "",
        date_of_birth: player.date_of_birth || "",
        position: player.position || "",
        height_cm: player.height_cm || "",
        weight_kg: player.weight_kg || "",
        preferred_foot: player.preferred_foot || "",
        current_club: player.current_club || "",
        nationality: player.nationality || "",
        status: player.status || "active",
        jersey_number: player.jersey_number || "",
        avatar_url: player.avatar_url || "",
      });
    } else {
      setFormData({
        full_name: "",
        date_of_birth: "",
        position: "",
        height_cm: "",
        weight_kg: "",
        preferred_foot: "",
        current_club: "",
        nationality: "",
        status: "active",
        jersey_number: "",
        avatar_url: "",
      });
    }
  }, [player]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    window.alert(JSON.stringify(formData));
    if (!formData.full_name.trim()) {
      console.log("Full name is required");
      // toast({
      //   title: "Form Error",
      //   description: "Full name is required",
      //   variant: "destructive",
      // });
      return;
    }
    try {
      const submitData = {
        ...formData,
        height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        jersey_number: formData.jersey_number
          ? parseInt(formData.jersey_number)
          : null,
      };

      if (player) {
        submitData.player_id = player.player_id;
      }

      await onSave(submitData);
      // Clear form data after successful save
      setFormData({
        full_name: "",
        date_of_birth: "",
        position: "",
        preferred_foot: "",
        height_cm: "",
        weight_kg: "",
        current_club: "",
      });

      onClose();
    } catch (error) {
      console.error("Error saving player:", error);
      alert("Failed to save player. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleAvatarUpload = (result) => {
    if (result.success) {
      window.alert(result.url);
      setFormData((prev) => ({
        ...prev,
        avatar_url: result.url || "",
      }));
    } else {
      // If upload failed, clear the avatar_url
      setFormData((prev) => ({
        ...prev,
        avatar_url: "",
      }));
      alert(`Avatar upload failed: ${result.error}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <CardHeader className="shrink-0 border-b">
          <CardTitle className="flex items-center justify-between">
            <span>{player ? "Edit Player" : "Add New Player"}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
              disabled={isSending}
            >
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>

        {/* Scrollable Body */}
        <CardContent className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Player Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <AvatarUpload
                onUpload={handleAvatarUpload}
                existingUrl={formData.avatar_url}
                folder="player-avatars" // Changed from club-avatars to player-avatars
                maxSize={2 * 1024 * 1024} // 2MB
                disabled={isSending}
                size="xl"
              />
              <p className="text-xs text-muted-foreground text-center max-w-md">
                Click the circle to upload a player avatar. Recommended: Square
                image, PNG or JPG, max 2MB.
              </p>
            </div>

            {/* Player Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Player Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        full_name: e.target.value,
                      }))
                    }
                    placeholder="Enter full name"
                    disabled={isSending}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date of Birth</label>
                  <Input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        date_of_birth: e.target.value,
                      }))
                    }
                    disabled={isSending}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Position</label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) => {
                      if (value && value !== "") {
                        setFormData((prev) => ({ ...prev, position: value }));
                      }
                    }}
                    disabled={isSending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {FOOTBALL_POSITIONS.map((position) => (
                        <SelectItem
                          key={position.abbreviation}
                          value={position.abbreviation}
                        >
                          {`${position.abbreviation} (${position.position})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Club</label>
                  <Select
                    value={formData.current_club}
                    onValueChange={(value) => {
                      if (value && value !== "") {
                        setFormData((prev) => ({
                          ...prev,
                          current_club: value,
                        }));
                      }
                    }}
                    disabled={isSending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select club" />
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
                  <label className="text-sm font-medium">Height (cm)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.height_cm}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        height_cm: e.target.value,
                      }))
                    }
                    min={0}
                    placeholder="Enter height"
                    disabled={isSending}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Weight (kg)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.weight_kg}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        weight_kg: e.target.value,
                      }))
                    }
                    min={0}
                    placeholder="Enter weight"
                    disabled={isSending}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Nationality</label>
                  <Input
                    value={formData.nationality}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        nationality: e.target.value,
                      }))
                    }
                    placeholder="Enter nationality"
                    disabled={isSending}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Jersey Number</label>
                  <Input
                    type="number"
                    value={formData.jersey_number}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        jersey_number: e.target.value,
                      }))
                    }
                    placeholder="Enter jersey number"
                    disabled={isSending}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => {
                      if (value && value !== "") {
                        setFormData((prev) => ({ ...prev, status: value }));
                      }
                    }}
                    disabled={isSending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLAYER_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {capitalize(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Preferred Foot</label>
                  <Select
                    value={formData.preferred_foot}
                    onValueChange={(value) => {
                      if (value && value !== "") {
                        setFormData((prev) => ({
                          ...prev,
                          preferred_foot: value,
                        }));
                      }
                    }}
                    disabled={isSending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred_foot" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLAYER_FOOT_LIST.map((preferred_foot) => (
                        <SelectItem key={preferred_foot} value={preferred_foot}>
                          {preferred_foot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90"
              disabled={isSending}
            >
              {isSending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-secondary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>{player ? "Updating..." : "Creating..."}</span>
                </div>
              ) : player ? (
                "Update Player"
              ) : (
                "Save Player"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AddPlayerModal;
