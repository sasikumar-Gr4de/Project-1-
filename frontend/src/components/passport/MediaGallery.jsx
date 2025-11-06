// MediaGallery.jsx - Updated with Upwork-style portfolio
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Edit, Video, Image, Link, Play } from "lucide-react";

const MediaGallery = ({
  media = [],
  isEditing = false,
  isOwnProfile = false,
  fullView = false,
}) => {
  const [newMedia, setNewMedia] = useState({
    title: "",
    description: "",
    url: "",
    type: "image",
  });

  const defaultMedia = [
    {
      id: 1,
      title: "Match Winning Goal",
      description: "Last minute goal against rivals",
      url: "https://amzn-gr4de-bucket.s3.eu-north-1.amazonaws.com/server1-1.mp4-1762355253325-xc2jquvnkcm",
      type: "video",
      thumbnail: "/api/placeholder/400/300",
      date: "2024-11-15",
    },
    {
      id: 2,
      title: "Training Session Highlights",
      description: "Technical drills and fitness training",
      url: "/api/placeholder/400/300",
      type: "image",
      thumbnail: "/api/placeholder/400/300",
      date: "2024-11-10",
    },
    {
      id: 3,
      title: "Skills Compilation",
      description: "Best moments from recent matches",
      url: "/api/placeholder/400/300",
      type: "video",
      thumbnail: "/api/placeholder/400/300",
      date: "2024-11-05",
    },
  ];

  const displayMedia = media.length > 0 ? media : defaultMedia;

  const getMediaIcon = (type) => {
    switch (type) {
      case "video":
        return Video;
      case "image":
        return Image;
      case "link":
        return Link;
      default:
        return Image;
    }
  };

  const handleAddMedia = () => {
    if (newMedia.title && newMedia.url) {
      // Add media logic here
      setNewMedia({ title: "", description: "", url: "", type: "image" });
    }
  };

  const handleRemoveMedia = (mediaId) => {
    // Remove media logic here
  };

  if (fullView) {
    return (
      <Card className="bg-[#262626] border-[#343434]">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Media Portfolio</span>
            {isOwnProfile && (
              <Button
                variant="outline"
                className="bg-[#1A1A1A] border-[#343434] text-white hover:bg-[#343434]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Media
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayMedia.map((item) => {
              const MediaIcon = getMediaIcon(item.type);
              return (
                <div
                  key={item.id}
                  className="group relative bg-[#1A1A1A] border border-[#343434] rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300"
                >
                  {/* Media Thumbnail */}
                  <div className="aspect-video relative bg-[#262626] overflow-hidden">
                    <img
                      src={item.thumbnail || item.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {item.type === "video" && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-[#0F0F0E]" />
                        </div>
                      </div>
                    )}

                    {/* Edit Overlay */}
                    {isEditing && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveMedia(item.id)}
                          className="w-8 h-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Media Info */}
                  <div className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <MediaIcon className="w-4 h-4 text-primary" />
                      <h3 className="text-white font-medium text-sm truncate">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                      {item.description}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {displayMedia.length === 0 && (
            <div className="text-center py-12">
              <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">
                No Media Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Showcase your best moments and achievements
              </p>
              {isOwnProfile && (
                <Button className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Media
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#262626] border-[#343434]">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Media Portfolio</span>
          {isOwnProfile && (
            <Button
              variant="outline"
              size="sm"
              className="bg-[#1A1A1A] border-[#343434] text-white hover:bg-[#343434]"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {displayMedia.slice(0, 6).map((item) => {
            const MediaIcon = getMediaIcon(item.type);
            return (
              <div
                key={item.id}
                className="group relative aspect-square bg-[#1A1A1A] border border-[#343434] rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300"
              >
                <img
                  src={item.thumbnail || item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {item.type === "video" && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <div className="flex items-center space-x-1">
                    <MediaIcon className="w-3 h-3 text-primary" />
                    <span className="text-white text-xs truncate">
                      {item.title}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {displayMedia.length === 0 && (
          <div className="text-center py-8">
            <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No media uploaded yet</p>
          </div>
        )}

        {displayMedia.length > 6 && (
          <div className="text-center mt-4">
            <Button variant="outline" size="sm" asChild>
              <a
                href={`?tab=portfolio`}
                className="text-primary hover:text-primary/80"
              >
                View All ({displayMedia.length})
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MediaGallery;
