import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileUpload from "@/components/common/FileUpload";

const AddClubModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    club_name: "",
    location: "",
    founded_year: "",
    mark_url: "",
  });
  const [uploadedFile, setUploadedFile] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      founded_year: parseInt(formData.founded_year),
      mark_url: uploadedFile ? uploadedFile.name : "",
    });
    onClose();
  };

  const handleFileUpload = async (files) => {
    // In a real app, you would upload to AWS S3 here
    const file = files[0];
    setUploadedFile(file);

    // Simulate AWS upload
    const awsService = await import("@/services/aws.service");
    const result = await awsService.uploadFile(file, "team-marks/");

    if (result.success) {
      setFormData((prev) => ({ ...prev, mark_url: result.url }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Add New Club</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Club Name *</label>
                <Input
                  required
                  value={formData.club_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      club_name: e.target.value,
                    }))
                  }
                  placeholder="Enter club name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="Enter location"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Founded Year</label>
                <Input
                  type="number"
                  value={formData.founded_year}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      founded_year: e.target.value,
                    }))
                  }
                  placeholder="Enter founded year"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Club Mark (Optional)
              </label>
              <FileUpload
                onUpload={handleFileUpload}
                accept="image/*"
                maxSize={2 * 1024 * 1024}
                label="Upload Club Mark"
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
                Save Club
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddClubModal;
