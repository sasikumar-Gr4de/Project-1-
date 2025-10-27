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
  const [playerType, setPlayerType] = useState("html5");
  const [isSeeking, setIsSeeking] = useState(false);

  // Refs for cleanup
  const timeIntervalRef = useRef(null);
  const youtubePlayerRef = useRef(null);

  // Check if URL is YouTube
  const isYouTubeUrl =
    videoUrl?.includes("youtube.com") || videoUrl?.includes("youtu.be");

  // Extract YouTube video ID
  const getYouTubeVideoId = (url) => {
    if (!url) return null;

    // Handle youtu.be short URLs
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return id || null;
    }

    // Handle youtube.com URLs
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

  // Cleanup function
  const cleanup = () => {
    // Clear intervals
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
      timeIntervalRef.current = null;
    }

    // Destroy YouTube player
    if (youtubePlayerRef.current) {
      try {
        youtubePlayerRef.current.destroy();
      } catch (e) {
        console.warn("Error destroying YouTube player:", e);
      }
      youtubePlayerRef.current = null;
    }

    // Reset states
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(true);
    setError(null);
  };

  // Determine player type and initialize
  useEffect(() => {
    // Cleanup previous instance
    cleanup();

    if (!videoUrl) {
      setError("No video URL provided");
      setIsLoading(false);
      return;
    }

    if (isYouTubeUrl && youtubeVideoId) {
      // Use YouTube player for YouTube URLs
      setPlayerType("youtube");
      initializeYouTubePlayer();
    } else {
      // Use HTML5 player for other video URLs
      setPlayerType("html5");
      setIsLoading(false); // HTML5 will set loading to false when metadata loads
    }

    return () => {
      cleanup();
    };
  }, [videoUrl, youtubeVideoId]);

  // YouTube Player Initialization
  const initializeYouTubePlayer = () => {
    setIsLoading(true);

    // Load YouTube IFrame API if not already loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Create YouTube player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      if (!youtubeIframeRef.current || !youtubeVideoId) return;

      try {
        const player = new window.YT.Player(youtubeIframeRef.current, {
          videoId: youtubeVideoId,
          playerVars: {
            playsinline: 1,
            controls: 0, // Hide YouTube's native controls
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            enablejsapi: 1,
          },
          events: {
            onReady: (event) => {
              setIsLoading(false);
              setDuration(event.target.getDuration());
              setError(null);

              // Start time update interval
              timeIntervalRef.current = setInterval(() => {
                if (player && player.getCurrentTime) {
                  try {
                    const time = player.getCurrentTime();
                    setCurrentTime(time);
                  } catch (e) {
                    console.warn("Error getting current time:", e);
                  }
                }
              }, 100);
            },
            onStateChange: (event) => {
              switch (event.data) {
                case window.YT.PlayerState.PLAYING:
                  setIsPlaying(true);
                  setIsLoading(false);
                  break;
                case window.YT.PlayerState.PAUSED:
                  setIsPlaying(false);
                  break;
                case window.YT.PlayerState.ENDED:
                  setIsPlaying(false);
                  setCurrentTime(0);
                  break;
                case window.YT.PlayerState.BUFFERING:
                  setIsLoading(true);
                  break;
                case window.YT.PlayerState.CUED:
                  setIsLoading(false);
                  break;
              }
            },
            onError: (event) => {
              console.error("YouTube player error:", event.data);
              setError("Failed to load YouTube video. Please check the URL.");
              setIsLoading(false);
            },
          },
        });

        youtubePlayerRef.current = player;
      } catch (error) {
        console.error("YouTube Player creation error:", error);
        setError("Failed to initialize YouTube player");
        setIsLoading(false);
      }
    };

    // If API is already loaded, initialize immediately
    if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady();
    }
  };

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

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleCanPlayThrough = () => {
      setIsLoading(false);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplaythrough", handleCanPlayThrough);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [playerType, isSeeking]);

  // Event handlers for both video types
  const togglePlay = () => {
    if (playerType === "youtube") {
      const player = youtubePlayerRef.current;
      if (player) {
        if (isPlaying) {
          player.pauseVideo();
        } else {
          player.playVideo();
        }
      }
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((err) => {
          setError("Failed to play video");
          console.error("Play error:", err);
        });
      }
    }
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekEnd = () => {
    setIsSeeking(false);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);

    if (playerType === "html5" && videoRef.current) {
      videoRef.current.currentTime = newTime;
    } else if (playerType === "youtube") {
      const player = youtubePlayerRef.current;
      if (player) {
        player.seekTo(newTime, true);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);

    if (playerType === "html5" && videoRef.current) {
      videoRef.current.volume = newVolume;
    } else if (playerType === "youtube") {
      const player = youtubePlayerRef.current;
      if (player) {
        player.setVolume(newVolume * 100);
      }
    }
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (playerType === "html5" && videoRef.current) {
      videoRef.current.muted = !isMuted;
    } else if (playerType === "youtube") {
      const player = youtubePlayerRef.current;
      if (player) {
        if (isMuted) {
          player.unMute();
        } else {
          player.mute();
        }
      }
    }
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;

    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const changePlaybackRate = (rate) => {
    if (playerType === "html5" && videoRef.current) {
      videoRef.current.playbackRate = rate;
    } else if (playerType === "youtube") {
      const player = youtubePlayerRef.current;
      if (player) {
        player.setPlaybackRate(rate);
      }
    }
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  const restartVideo = () => {
    if (playerType === "html5" && videoRef.current) {
      videoRef.current.currentTime = 0;
    } else if (playerType === "youtube") {
      const player = youtubePlayerRef.current;
      if (player) {
        player.seekTo(0, true);
      }
    }
    setCurrentTime(0);
  };

  const openInNewTab = () => {
    window.open(videoUrl, "_blank", "noopener,noreferrer");
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
      {/* Video Element - HTML5 (only for non-YouTube URLs) */}
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

      {/* YouTube IFrame (only for YouTube URLs) */}
      {playerType === "youtube" && (
        <div
          ref={youtubeIframeRef}
          className="w-full aspect-video"
          onClick={togglePlay}
        />
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <span className="ml-3 text-white">Loading video...</span>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        } ${isLoading ? "pointer-events-none" : ""}`}
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          {playerType !== "youtube" && (
            <h3 className="text-white font-semibold truncate max-w-[70%]">
              {title}
            </h3>
          )}

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

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-white hover:bg-white/20"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Center Play Button */}
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

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
          {/* Progress Bar */}
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
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Play/Pause */}
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

              {/* Volume Control */}
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
            </div>

            <div className="flex items-center space-x-2">
              {/* Restart */}
              <Button
                variant="ghost"
                size="sm"
                onClick={restartVideo}
                className="text-white hover:bg-white/20"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              {/* Download Button - Only for HTML5 videos */}
              {playerType === "html5" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = videoUrl;
                    link.download = title || "video";
                    link.click();
                  }}
                  className="text-white hover:bg-white/20"
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

        {/* Settings Menu */}
        {showSettings && (
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

      {/* YouTube Indicator */}
      {playerType === "youtube" && (
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          YouTube
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
