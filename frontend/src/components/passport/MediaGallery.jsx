// frontend/src/components/passport/MediaGallery.jsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  Image,
  Link as LinkIcon,
  Plus,
  Play,
  ExternalLink,
} from "lucide-react";

const MediaGallery = ({ media }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);

  const getMediaIcon = (type) => {
    switch (type) {
      case "video":
        return <Video className="w-5 h-5" />;
      case "image":
        return <Image className="w-5 h-5" />;
      case "link":
        return <LinkIcon className="w-5 h-5" />;
      default:
        return <LinkIcon className="w-5 h-5" />;
    }
  };

  const getMediaColor = (type) => {
    switch (type) {
      case "video":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "image":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "link":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-[var(--surface-2)] text-(--muted-text) border-(--surface-2)";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleMediaClick = (mediaItem) => {
    if (mediaItem.media_type === "link") {
      window.open(mediaItem.url, "_blank");
    } else {
      setSelectedMedia(mediaItem);
    }
  };

  if (!media || media.length === 0) {
    return (
      <Card className="bg-(--surface-1) border-(--surface-2)">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center">
            <Image className="w-5 h-5 mr-2 text-primary" />
            Media & Highlights
          </CardTitle>
          <CardDescription className="text-(--muted-text)">
            Your match highlights and media will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Image className="w-16 h-16 text-(--muted-text) mx-auto mb-4 opacity-50" />
            <p className="text-(--muted-text) text-lg">No media available</p>
            <p className="text-sm text-(--muted-text) mt-2">
              Match highlights and media will be added by your coaches
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-(--surface-1) border-(--surface-2)">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-white flex items-center">
                <Image className="w-5 h-5 mr-2 text-primary" />
                Media & Highlights
              </CardTitle>
              <CardDescription className="text-(--muted-text)">
                Match highlights, photos, and external media
              </CardDescription>
            </div>
            <Button className="bg-linear-to-r from-primary to-(--accent-2) text-(--ink) hover:from-(--accent-2) hover:to-primary font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Add Media
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {media.map((item, index) => (
              <div
                key={item.media_id}
                className="group cursor-pointer"
                onClick={() => handleMediaClick(item)}
              >
                <div className="border-2 border-(--surface-2) rounded-xl bg-(--surface-0) overflow-hidden hover:border-primary/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/10">
                  {/* Media Thumbnail */}
                  <div className="aspect-video bg-(--surface-1) relative overflow-hidden">
                    {item.media_type === "video" ? (
                      <>
                        <div className="w-full h-full bg-linear-to-br from-(--surface-0) to-(--surface-1) flex items-center justify-center">
                          <Video className="w-12 h-12 text-(--muted-text) opacity-50" />
                        </div>
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center shadow-lg">
                            <Play className="w-6 h-6 text-(--ink) ml-1" />
                          </div>
                        </div>
                      </>
                    ) : item.media_type === "image" ? (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-(--surface-0) to-(--surface-1) flex items-center justify-center">
                        <ExternalLink className="w-12 h-12 text-(--muted-text) opacity-50" />
                      </div>
                    )}

                    {/* Media Type Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className={getMediaColor(item.media_type)}>
                        <div className="flex items-center space-x-1">
                          {getMediaIcon(item.media_type)}
                          <span className="text-xs">
                            {item.media_type.toUpperCase()}
                          </span>
                        </div>
                      </Badge>
                    </div>
                  </div>

                  {/* Media Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-white group-hover:text-primary transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-(--muted-text) mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-(--muted-text)">
                        {formatDate(item.created_at)}
                      </span>
                      {item.media_type === "link" && (
                        <ExternalLink className="w-3 h-3 text-(--muted-text)" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Media Summary */}
          <div className="mt-6 pt-6 border-t border-(--surface-2)">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">
                  {media.filter((m) => m.media_type === "video").length}
                </div>
                <div className="text-sm text-(--muted-text)">Videos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {media.filter((m) => m.media_type === "image").length}
                </div>
                <div className="text-sm text-(--muted-text)">Images</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {media.filter((m) => m.media_type === "link").length}
                </div>
                <div className="text-sm text-(--muted-text)">Links</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-(--surface-0) rounded-2xl border border-(--surface-2) max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-(--surface-2) flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {selectedMedia.title}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedMedia(null)}
                className="text-(--muted-text) hover:text-foreground"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>
            <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
              {selectedMedia.media_type === "video" ? (
                <video
                  src={selectedMedia.url}
                  controls
                  className="w-full rounded-lg"
                />
              ) : selectedMedia.media_type === "image" ? (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title}
                  className="w-full rounded-lg"
                />
              ) : (
                <div className="text-center py-12">
                  <ExternalLink className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-white text-lg mb-4">External Link</p>
                  <Button
                    onClick={() => window.open(selectedMedia.url, "_blank")}
                    className="bg-linear-to-r from-primary to-(--accent-2) text-(--ink) hover:from-(--accent-2) hover:to-primary font-semibold"
                  >
                    Open Link
                  </Button>
                </div>
              )}
              {selectedMedia.description && (
                <p className="text-(--muted-text) mt-4">
                  {selectedMedia.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MediaGallery;
