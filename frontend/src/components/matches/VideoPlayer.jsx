import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  RotateCcw,
  Download,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const VideoPlayer = ({ videoUrl, title = "Video Player" }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const youtubeIframeRef = useRef(null);

  // Player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [playerType, setPlayerType] = useState("html5"); // "html5" or "youtube"
  const [isSeeking, setIsSeeking] = useState(false);

  // Check if URL is YouTube
  const isYouTubeUrl =
    videoUrl?.includes("youtube.com") || videoUrl?.includes("youtu.be");

  // Extract YouTube video ID
  const getYouTubeVideoId = (url) => {
    if (!url) return null;

    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const youtubeVideoId = getYouTubeVideoId(videoUrl);

  // Format time helper
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // For YouTube, we'll use a simple iframe with controls and just track time for our timeline
  useEffect(() => {
    if (!isYouTubeUrl || !youtubeVideoId) {
      setPlayerType("html5");
      return;
    }

    setPlayerType("youtube");
    setIsLoading(false);
    // For YouTube, we'll set a default duration (can be updated if needed)
    setDuration(3600); // Default 1 hour
  }, [videoUrl, isYouTubeUrl, youtubeVideoId]);

  // HTML5 Video event listeners
  useEffect(() => {
    if (playerType !== "html5" || !videoRef.current) return;

    const video = videoRef.current;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
      setError(null);
    };

    const handleTimeUpdate = () => {
      if (!isSeeking) {
        setCurrentTime(video.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleError = (e) => {
      console.error("HTML5 video error:", e);
      setError("Failed to load video. Please check the source.");
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);
    video.addEventListener("canplay", handleCanPlay);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
      video.removeEventListener("canplay", handleCanPlay);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [playerType, isSeeking]);

  // For YouTube, we'll simulate time progression for the timeline
  useEffect(() => {
    if (playerType !== "youtube" || !isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const newTime = prev + 1;
        return newTime > duration ? duration : newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [playerType, isPlaying, duration]);

  // Event handlers for HTML5 video
  const togglePlay = () => {
    if (playerType === "youtube") {
      // For YouTube, we just toggle our simulated play state
      setIsPlaying(!isPlaying);
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((err) => {
          setError("Failed to play video");
          console.error("Play error:", err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekEnd = () => {
    setIsSeeking(false);

    // For YouTube, when seeking ends, we open at that timestamp
    if (playerType === "youtube") {
      const timestamp = Math.floor(currentTime);
      const newUrl = `https://www.youtube.com/embed/${youtubeVideoId}?start=${timestamp}&autoplay=1`;
      window.open(newUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);

    if (playerType === "html5" && videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
    // For YouTube, we just update the timeline visually
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);

    if (playerType === "html5" && videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (playerType === "html5" && videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;

    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const changePlaybackRate = (rate) => {
    if (playerType === "html5" && videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  const restartVideo = () => {
    if (playerType === "html5" && videoRef.current) {
      videoRef.current.currentTime = 0;
    }
    setCurrentTime(0);
  };

  const openInNewTab = () => {
    if (playerType === "youtube") {
      window.open(videoUrl, "_blank", "noopener,noreferrer");
    } else {
      window.open(videoUrl, "_blank", "noopener,noreferrer");
    }
  };

  const openYouTubeAtTimestamp = () => {
    if (playerType === "youtube" && youtubeVideoId) {
      const timestamp = Math.floor(currentTime);
      const youtubeUrl = `https://www.youtube.com/embed/${youtubeVideoId}?start=${timestamp}&autoplay=1`;
      window.open(youtubeUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Auto-hide controls
  useEffect(() => {
    if (!showControls || isSeeking) return;

    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showControls, currentTime, isSeeking]);

  // Check if video URL is valid
  const isValidVideo = videoUrl && !error;

  if (!isValidVideo) {
    return (
      <div className="w-full aspect-video bg-card border border-border rounded-lg flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {error ? "Video Error" : "No Video Available"}
            </h3>
            <p className="text-muted-foreground">
              {error || "Please check the video source and try again."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={playerRef}
      className="relative w-full bg-black rounded-lg overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => !isPlaying && setShowControls(false)}
    >
      {/* Video Element - HTML5 */}
      {playerType === "html5" && (
        <video
          ref={videoRef}
          className="w-full aspect-video"
          onClick={togglePlay}
          crossOrigin="anonymous"
          preload="metadata"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* YouTube Preview */}
      {playerType === "youtube" && youtubeVideoId && (
        <div className="w-full aspect-video bg-gray-900 flex items-center justify-center relative">
          <img
            src={`https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`}
            alt="YouTube video thumbnail"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div
                className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-red-700 cursor-pointer"
                onClick={openInNewTab}
              >
                <Play className="h-8 w-8 ml-1 text-white" />
              </div>
              <p className="text-lg font-semibold">YouTube Video</p>
              <p className="text-sm text-gray-300 mt-2">
                Click play to watch on YouTube
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading && playerType === "html5" && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <span className="ml-3 text-white">Loading video...</span>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          <h3 className="text-white font-semibold truncate max-w-[70%]">
            {title}
          </h3>

          <div className="flex items-center space-x-2">
            {/* Open in new tab */}
            <Button
              variant="ghost"
              size="sm"
              onClick={openInNewTab}
              className="text-white hover:bg-white/20"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>

            {playerType === "html5" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:bg-white/20"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Center Play Button - Only for HTML5 */}
        {playerType === "html5" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="lg"
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </Button>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
          {/* Progress Bar - Always show for time selection */}
          <div className="w-full">
            <div className="flex items-center justify-between text-white text-xs mb-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              onMouseDown={handleSeekStart}
              onMouseUp={handleSeekEnd}
              onTouchStart={handleSeekStart}
              onTouchEnd={handleSeekEnd}
              className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary hover:[&::-webkit-slider-thumb]:bg-primary/80"
            />
            <div className="flex justify-between text-white text-xs mt-1">
              <span>Start</span>
              <span>End</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Play/Pause - Only for HTML5 */}
              {playerType === "html5" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              )}

              {/* Volume Control - Only for HTML5 */}
              {playerType === "html5" && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                  />
                </div>
              )}

              {/* Open at selected time - For YouTube */}
              {playerType === "youtube" && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={openYouTubeAtTimestamp}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Open at {formatTime(currentTime)}
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Restart - Only for HTML5 */}
              {playerType === "html5" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={restartVideo}
                  className="text-white hover:bg-white/20"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}

              {/* Download Button - Only for HTML5 videos */}
              {playerType === "html5" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (
                      videoUrl.startsWith("blob:") ||
                      videoUrl.startsWith("/")
                    ) {
                      const link = document.createElement("a");
                      link.href = videoUrl;
                      link.download = title || "video";
                      link.click();
                    }
                  }}
                  className="text-white hover:bg-white/20"
                  disabled={
                    !videoUrl.startsWith("blob:") && !videoUrl.startsWith("/")
                  }
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}

              {/* Fullscreen */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Settings Menu - Only for HTML5 */}
        {showSettings && playerType === "html5" && (
          <div className="absolute bottom-16 right-4 bg-card border border-border rounded-lg p-3 shadow-lg z-10">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Playback Speed
              </h4>
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  onClick={() => changePlaybackRate(rate)}
                  className={`block w-full text-left px-3 py-1 rounded text-sm transition-colors ${
                    playbackRate === rate
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {rate === 1 ? "Normal" : `${rate}x`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* YouTube Disclaimer */}
      {playerType === "youtube" && (
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          YouTube - Use timeline to select start time
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
