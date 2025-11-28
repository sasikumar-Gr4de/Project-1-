import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Play,
  Image,
  ExternalLink,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const MediaGallery = ({ media }) => {
  if (!media || media.length === 0) {
    return null;
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  // Helper functions
  const getYouTubeThumbnail = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    const videoId = match ? match[1] : null;
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
      : null;
  };

  const isYouTubeUrl = (url) =>
    url?.includes("youtube.com") || url?.includes("youtu.be");
  const isImageUrl = (url) =>
    url && /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);

  const MediaThumbnail = ({ item, compact = false }) => {
    const [imageError, setImageError] = useState(false);
    const isYouTube = isYouTubeUrl(item.url);
    const youTubeThumbnail = isYouTube ? getYouTubeThumbnail(item.url) : null;
    const isImage = item.media_type === "image" || isImageUrl(item.url);
    const thumbnailUrl = isYouTube
      ? youTubeThumbnail
      : isImage
      ? item.url
      : null;

    return (
      <div
        className="aspect-video bg-(--surface-2) rounded-lg relative overflow-hidden cursor-pointer group"
        onClick={() => window.open(item.url, "_blank")}
      >
        {thumbnailUrl && !imageError ? (
          <>
            <img
              src={thumbnailUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
              loading="lazy"
            />
            {/* Play icon overlay for videos */}
            {item.media_type === "video" && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/80 rounded-full p-3 transform group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
              </div>
            )}
            {/* Type badge */}
            <div className="absolute top-2 left-2">
              {isYouTube && (
                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-medium">
                  YouTube
                </span>
              )}
              {item.media_type === "image" && !isYouTube && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">
                  Image
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-(--surface-3) text-placeholder">
            {item.media_type === "video" ? (
              <>
                <Play className="w-8 h-8 mb-2" />
                <span className="text-sm">Video</span>
              </>
            ) : (
              <>
                <Image className="w-8 h-8 mb-2" />
                <span className="text-sm">Media</span>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="bg-(--surface-1) border-(--surface-2) hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Portfolio</h3>
            <p className="text-placeholder text-sm mt-1">
              {media.length} {media.length === 1 ? "item" : "items"}
            </p>
          </div>
          {media.length > 1 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 border-(--surface-3) hover:bg-(--surface-2)"
                onClick={prevSlide}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 border-(--surface-3) hover:bg-(--surface-2)"
                onClick={nextSlide}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Main Media Display */}
          <div className="space-y-4">
            <MediaThumbnail item={media[currentIndex]} />

            {/* Navigation Dots */}
            {media.length > 1 && (
              <div className="flex justify-center space-x-2">
                {media.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "bg-primary"
                        : "bg-(--surface-3) hover:bg-primary/60"
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-semibold text-lg mb-2">
                {media[currentIndex].title}
              </h4>
              <p className="text-placeholder text-sm leading-relaxed">
                {media[currentIndex].description}
              </p>
            </div>

            <div className="flex items-center justify-between text-sm text-placeholder">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(
                      media[currentIndex].created_at
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="capitalize">
                    {media[currentIndex].media_type}
                  </span>
                </div>
              </div>

              {/* <Button
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-white"
                onClick={() => window.open(media[currentIndex].url, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Project
              </Button> */}
            </div>

            {/* Thumbnail Strip */}
            {media.length > 1 && (
              <div className="pt-4 border-t border-(--surface-3)">
                <p className="text-placeholder text-sm mb-3">
                  More from portfolio
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {media.map((item, index) => (
                    <button
                      key={item.media_id}
                      className={`relative rounded-md overflow-hidden transition-all ${
                        index === currentIndex
                          ? "ring-2 ring-primary"
                          : "opacity-70 hover:opacity-100 hover:scale-105"
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    >
                      <MediaThumbnail item={item} compact />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Single Item Footer */}
        {media.length === 1 && (
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-(--surface-3)">
            <div className="flex items-center space-x-4 text-sm text-placeholder">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(media[0].created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="capitalize">{media[0].media_type}</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary hover:text-white"
              onClick={() => window.open(media[0].url, "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Project
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MediaGallery;
