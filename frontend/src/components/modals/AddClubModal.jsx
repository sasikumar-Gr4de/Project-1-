import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileUpload from "@/components/common/FileUpload";
import { X } from "lucide-react";

const AddClubModal = ({ isOpen, onClose, onSave, club }) => {
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    club_name: "",
    location: "",
    founded_year: "",
    mark_url: "",
  });

  useEffect(() => {
    setFormData({
      club_name: club?.club_name || "",
      location: club?.location || "",
      founded_year: club?.founded_year || "",
      mark_url: club?.mark_url || "",
    });
  }, [club]);

  const [uploadedFile, setUploadedFile] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    const clubData = {
      ...club,
      ...formData,
      founded_year: parseInt(formData.founded_year),
      mark_url: uploadedFile ? uploadedFile.name : "",
    };
    await onSave(clubData);
    setIsSending(false);
    onClose();
  };

  const handleFileUpload = async (results) => {
    results.forEach((result) => {
      if (result.success) {
        console.log("Uploaded:", result.url);
        setUploadedFile(result.url);
        // Save to your database
      } else {
        console.error("Failed:", result.error);
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <CardHeader className="shrink-0 border-b bg-card">
          <CardTitle className="flex items-center justify-between">
            <span>{club ? "Edit Club" : "Add New Club"}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>

        {/* Scrollable Body */}
        <CardContent className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Club Name <span className="text-destructive">*</span>
                  </label>
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
                    disabled={isSending}
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
                    disabled={isSending}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Founded Year</label>
                  <Input
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    value={formData.founded_year}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        founded_year: e.target.value,
                      }))
                    }
                    placeholder="Enter founded year"
                    disabled={isSending}
                  />
                </div>
              </div>
            </div>

            {/* Club Mark Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Club Mark</h3>
              <div className="space-y-2">
                {/* <label className="text-sm font-medium">Club Logo/Mark</label> */}
                <FileUpload
                  onUpload={handleFileUpload}
                  accept="image/*"
                  maxSize={5 * 1024 * 1024} // 5MB
                  folder="club-marks"
                  label="Select club mark"
                  uploadText="Upload mark"
                  existingUrl={formData.mark_url}
                  disabled={isSending}
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: Square image, PNG or JPG, max 5MB
                </p>
              </div>
            </div>
          </form>
        </CardContent>

        {/* Fixed Footer */}
        <div className="shrink-0 border-t p-6">
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90"
            >
              {isSending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-secondary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Save Club...</span>
                </div>
              ) : (
                "Save Club"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AddClubModal;
