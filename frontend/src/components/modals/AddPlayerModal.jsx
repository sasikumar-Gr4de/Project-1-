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
import FileUpload from "@/components/common/FileUpload";

const AddPlayerModal = ({ isOpen, onClose, onSave, clubs }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    position: "",
    height_cm: "",
    weight_kg: "",
    current_club: "",
    nationality: "",
    status: "Active",
    jersey_number: "",
    avatar_url: "",
  });
  const [uploadedFile, setUploadedFile] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      height_cm: parseFloat(formData.height_cm),
      weight_kg: parseFloat(formData.weight_kg),
      jersey_number: parseInt(formData.jersey_number),
      avatar_url: uploadedFile ? uploadedFile.name : "",
    });
    onClose();
  };

  const handleFileUpload = async (files) => {
    const file = files[0];
    setUploadedFile(file);

    // Simulate AWS upload
    const awsService = await import("@/services/aws.service");
    const result = await awsService.uploadFile(file, "player-avatars/");

    if (result.success) {
      setFormData((prev) => ({ ...prev, avatar_url: result.url }));
    }
  };

  const positions = ["Goalkeeper", "Defender", "Midfielder", "Forward"];
  const statuses = ["Active", "Injured", "Suspended", "Inactive"];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Add New Player</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name *</label>
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
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Position</label>
                <Select
                  value={formData.position}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, position: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Current Club</label>
                <Select
                  value={formData.current_club}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, current_club: value }))
                  }
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
                  placeholder="Enter height"
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
                  placeholder="Enter weight"
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
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
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
                Player Avatar (Optional)
              </label>
              <FileUpload
                onUpload={handleFileUpload}
                accept="image/*"
                maxSize={2 * 1024 * 1024}
                label="Upload Avatar"
              />
              {uploadedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {uploadedFile.name}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Save Player
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPlayerModal;
