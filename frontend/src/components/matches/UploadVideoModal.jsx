import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Video, X } from "lucide-react";

const UploadVideoModal = ({ isOpen, onClose, onUpload, match }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    setPreviewUrl("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (videoFile) {
      onUpload(match.id, videoFile);
      onClose();
      setVideoFile(null);
      setPreviewUrl("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Video className="h-5 w-5 mr-2" />
            Upload Match Video
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-sm text-gray-400">
            Upload video for {match?.team_a_name} vs {match?.team_b_name}
          </div>

          {/* Video Upload */}
          <div className="space-y-3">
            <Label htmlFor="video-upload">Match Video</Label>
            {previewUrl ? (
              <div className="relative">
                <video
                  src={previewUrl}
                  controls
                  className="w-full h-48 bg-black rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <Label
                  htmlFor="video-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-600 rounded-md text-sm bg-gray-700 hover:bg-gray-600 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select Video File
                </Label>
                <input
                  type="file"
                  id="video-upload"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <p className="text-xs text-gray-400 mt-2">
                  MP4, MOV, AVI up to 100MB
                </p>
              </div>
            )}
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
            <Button
              type="submit"
              disabled={!videoFile}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Video
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadVideoModal;
