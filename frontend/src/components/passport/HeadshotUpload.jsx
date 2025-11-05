import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { usePassportStore } from "@/store/passportStore";
import { useToast } from "@/contexts/ToastContext";
import FileUpload from "@/components/common/FileUpload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, CheckCircle, Upload, RotateCcw } from "lucide-react";

const HeadshotUpload = ({ onComplete, currentHeadshot }) => {
  const { user } = useAuthStore();
  const { uploadHeadshot, passport } = usePassportStore();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(
    currentHeadshot || passport?.identity?.headshot_url || null
  );

  const handleHeadshotUpload = async (result) => {
    result = result[0];

    if (!result.success) {
      toast({
        title: "Upload failed",
        description: result.error || "Failed to upload headshot",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Use the new uploadHeadshot method
      await uploadHeadshot(user.id, result.url);

      setPreviewUrl(result.url);

      toast({
        title: "Success",
        description: "Headshot uploaded successfully",
        variant: "success",
      });

      // Notify parent component of completion
      if (onComplete) {
        onComplete(result.url);
      }
    } catch (error) {
      console.error("Failed to update headshot:", error);
      toast({
        title: "Error",
        description: "Failed to save headshot",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveHeadshot = async () => {
    try {
      await uploadHeadshot(user.id, null);
      setPreviewUrl(null);
      toast({
        title: "Success",
        description: "Headshot removed",
        variant: "success",
      });
      if (onComplete) {
        onComplete(null);
      }
    } catch (error) {
      console.error("Failed to remove headshot:", error);
      toast({
        title: "Error",
        description: "Failed to remove headshot",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-[#262626] border-[#343434]">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center">
          <User className="w-5 h-5 mr-2 text-primary" />
          Player Headshot
        </CardTitle>
        <CardDescription className="text-[#B0AFAF]">
          Upload a clear, recent photo for your player profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Requirements */}
          <div className="bg-[#1A1A1A] border border-[#343434] rounded-xl p-4">
            <h4 className="font-semibold text-white mb-3">
              Photo Requirements
            </h4>
            <ul className="space-y-2 text-sm text-[#B0AFAF]">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Recent photo (taken within last 6 months)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Clear front view of face and shoulders</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Plain background preferred</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No hats or sunglasses</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Good lighting and focus</span>
              </li>
            </ul>
          </div>

          {/* Current Headshot Preview */}
          {previewUrl && (
            <div className="text-center">
              <h4 className="font-semibold text-white mb-4">
                Current Headshot
              </h4>
              <div className="relative flex items-center justify-center mx-auto">
                <img
                  src={previewUrl}
                  alt="Player headshot"
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-primary/20 shadow-lg"
                />
                <Badge className="absolute -top-2 -right-2 bg-green-500/20 text-green-400 border-green-500/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Uploaded
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveHeadshot}
                className="mt-3 bg-[#343434] border-[#343434] text-white hover:bg-[#4A4A4A]"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
            </div>
          )}

          {/* Upload Component */}
          {!previewUrl && (
            <FileUpload
              onUpload={handleHeadshotUpload}
              acceptedTypes={["image/jpeg", "image/png", "image/jpg"]}
              maxSize={5 * 1024 * 1024} // 5MB
              folder="headshots"
              uploading={uploading}
              uploadText="Upload Headshot"
              className="border-2 border-dashed border-[#343434] hover:border-primary/50 rounded-xl p-8"
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center border-2 border-[#343434] mx-auto">
                  <User className="w-8 h-8 text-[#B0AFAF]" />
                </div>
                <div>
                  <p className="text-white font-medium">
                    Upload Player Headshot
                  </p>
                  <p className="text-sm text-[#B0AFAF] mt-1">
                    JPG or PNG (Max 5MB)
                  </p>
                </div>
              </div>
            </FileUpload>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HeadshotUpload;
