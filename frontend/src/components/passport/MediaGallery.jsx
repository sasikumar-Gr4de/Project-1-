import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Image, ExternalLink, Calendar } from "lucide-react";

const MediaGallery = ({ media }) => {
  if (!media || media.length === 0) {
    return null;
  }

  return (
    <Card className="bg-(--surface-1) border-(--surface-2) hover:border-primary/30 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Image className="w-5 h-5 text-primary" />
          <span>Media & Highlights</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {media.slice(0, 4).map((item) => (
            <div
              key={item.media_id}
              className="bg-[#1A1A1A] rounded-xl border border-border overflow-hidden"
            >
              <div className="aspect-video bg-[#262626] relative flex items-center justify-center">
                {item.media_type === "video" ? (
                  <>
                    <Play className="w-12 h-12 text-primary/60" />
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                      <Button
                        size="sm"
                        className="bg-primary/80 hover:bg-primary text-white"
                        onClick={() => window.open(item.url, "_blank")}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Play
                      </Button>
                    </div>
                  </>
                ) : (
                  <Image className="w-12 h-12 text-primary/60" />
                )}
              </div>
              <div className="p-4">
                <h4 className="text-white font-medium mb-1">{item.title}</h4>
                <p className="text-placeholder text-sm mb-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between text-xs text-placeholder">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaGallery;
