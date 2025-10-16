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
import { Users, Upload, X, Calendar } from "lucide-react";
import { ALL_POSITIONS } from "../../utils/constants";

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
      // Simulate upload process
      setIsUploading(true);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData((prev) => ({
          ...prev,
          profile_picture: reader.result, // In real app, upload to server and get URL
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
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {player ? "Edit Player" : "Add New Player"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Profile Picture Section */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">
                  Profile Picture
                </h3>

                <div className="flex flex-col items-center space-y-4">
                  {/* Profile Picture Preview */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="h-12 w-12 text-white" />
                      )}
                    </div>

                    {previewImage && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    )}
                  </div>

                  {/* Upload Button */}
                  <div>
                    <input
                      type="file"
                      id="profile_picture"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Label htmlFor="profile_picture">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 cursor-pointer"
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          "Uploading..."
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            {previewImage ? "Change Photo" : "Upload Photo"}
                          </>
                        )}
                      </Button>
                    </Label>
                  </div>

                  <p className="text-xs text-gray-400 text-center">
                    Recommended: Square image, 300x300px or larger
                  </p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <Label
                          htmlFor="date_of_birth"
                          className="text-gray-300"
                        >
                          Date of Birth
                        </Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                          <Input
                            id="date_of_birth"
                            type="date"
                            value={formData.date_of_birth}
                            onChange={(e) =>
                              handleChange("date_of_birth", e.target.value)
                            }
                            className="bg-gray-700 border-gray-600 text-white mt-1 pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="nationality" className="text-gray-300">
                          Nationality
                        </Label>
                        <Input
                          id="nationality"
                          value={formData.nationality}
                          onChange={(e) =>
                            handleChange("nationality", e.target.value)
                          }
                          className="bg-gray-700 border-gray-600 text-white mt-1"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="current_club" className="text-gray-300">
                        Current Club
                      </Label>
                      <Input
                        id="current_club"
                        value={formData.current_club}
                        onChange={(e) =>
                          handleChange("current_club", e.target.value)
                        }
                        className="bg-gray-700 border-gray-600 text-white mt-1"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Physical & Position */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">
                    Physical & Position
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="primary_position"
                          className="text-gray-300"
                        >
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
                        <Label htmlFor="status" className="text-gray-300">
                          Status
                        </Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) =>
                            handleChange("status", value)
                          }
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-1">
                            <SelectValue />
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
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="height_cm" className="text-gray-300">
                          Height (cm)
                        </Label>
                        <Input
                          id="height_cm"
                          type="number"
                          min="100"
                          max="250"
                          value={formData.height_cm}
                          onChange={(e) =>
                            handleChange("height_cm", e.target.value)
                          }
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
                          min="30"
                          max="150"
                          value={formData.weight_kg}
                          onChange={(e) =>
                            handleChange("weight_kg", e.target.value)
                          }
                          className="bg-gray-700 border-gray-600 text-white mt-1"
                          required
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="preferred_foot"
                          className="text-gray-300"
                        >
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 sm:order-1 order-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white sm:order-2 order-1"
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
