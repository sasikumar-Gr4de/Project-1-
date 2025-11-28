import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef(null);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying || media.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % media.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, media.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Helper functions (simplified)
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
    url.includes("youtube.com") || url.includes("youtu.be");
  const isImageUrl = (url) =>
    url && /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);

  const MediaThumbnail = ({ item, compact = true }) => {
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
            {/* Play icon for videos */}
            {item.media_type === "video" && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/70 rounded-full p-2">
                  <Play className="w-4 h-4 text-white fill-white" />
                </div>
              </div>
            )}
            {/* Badges */}
            <div className="absolute top-1 left-1">
              {isYouTube && (
                <span className="bg-red-600 text-white text-[10px] px-1 py-0.5 rounded font-semibold">
                  YT
                </span>
              )}
              {item.media_type === "image" && !isYouTube && (
                <span className="bg-blue-600 text-white text-[10px] px-1 py-0.5 rounded font-semibold">
                  IMG
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-(--surface-3)">
            {item.media_type === "video" ? (
              <Play className="w-6 h-6 text-primary/60" />
            ) : (
              <Image className="w-6 h-6 text-primary/60" />
            )}
          </div>
        )}
      </div>
    );
  };

  if (media.length === 1) {
    const item = media[0];
    return (
      <Card className="bg-(--surface-1) border-(--surface-2) hover:border-primary/30 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-white text-sm">
            <Image className="w-4 h-4 text-primary" />
            <span>Media Highlight</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <MediaThumbnail item={item} />
            <div>
              <h4 className="text-white font-medium text-sm mb-1">
                {item.title}
              </h4>
              <p className="text-placeholder text-xs line-clamp-2 mb-2">
                {item.description}
              </p>
              <div className="flex items-center justify-between text-xs text-placeholder">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => window.open(item.url, "_blank")}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Carousel for multiple items
  return (
    <Card className="bg-(--surface-1) border-(--surface-2) hover:border-primary/30 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-white text-sm">
            <Image className="w-4 h-4 text-primary" />
            <span>Media Highlights ({media.length})</span>
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={prevSlide}
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={nextSlide}
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Main Carousel Item */}
          <div ref={carouselRef} className="relative">
            <MediaThumbnail item={media[currentIndex]} />

            {/* Navigation dots */}
            {media.length > 1 && (
              <div className="flex justify-center space-x-1 mt-2">
                {media.map((_, index) => (
                  <button
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === currentIndex ? "bg-primary" : "bg-(--surface-3)"
                    }`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Current Item Details */}
          <div>
            <h4 className="text-white font-medium text-sm mb-1">
              {media[currentIndex].title}
            </h4>
            <p className="text-placeholder text-xs line-clamp-2 mb-2">
              {media[currentIndex].description}
            </p>
            <div className="flex items-center justify-between text-xs text-placeholder">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {new Date(
                    media[currentIndex].created_at
                  ).toLocaleDateString()}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => window.open(media[currentIndex].url, "_blank")}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                View
              </Button>
            </div>
          </div>

          {/* Thumbnail strip for quick navigation */}
          {media.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-1">
              {media.map((item, index) => (
                <button
                  key={item.media_id}
                  className={`shrink-0 w-16 aspect-video rounded border transition-all ${
                    index === currentIndex
                      ? "border-primary ring-1 ring-primary"
                      : "border-(--surface-3) opacity-60 hover:opacity-100"
                  }`}
                  onClick={() => goToSlide(index)}
                >
                  <MediaThumbnail item={item} compact />
                </button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaGallery;
