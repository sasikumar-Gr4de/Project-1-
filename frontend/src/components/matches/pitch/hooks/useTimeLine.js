import { useState, useEffect, useRef, useCallback } from "react";

export const useTimeline = (
  formationHistory,
  setFormations,
  setLineups,
  setSubstitutes
) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playbackIntervalRef = useRef(null);

  // Playback control
  useEffect(() => {
    if (isPlaying) {
      playbackIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= 90) {
            setIsPlaying(false);
            return 90;
          }
          return prev + 1;
        });
      }, 500);
    } else {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    }

    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, [isPlaying]);

  // Jump to specific time in match
  const handleTimeJump = useCallback(
    (time) => {
      setCurrentTime(time);
      setIsPlaying(false);

      const snapshot = formationHistory
        .filter((item) => item.time <= time)
        .sort((a, b) => b.time - a.time)[0];

      if (snapshot) {
        setFormations(snapshot.formations);
        setLineups(snapshot.lineups);
        setSubstitutes(snapshot.substitutes);
      }
    },
    [formationHistory, setFormations, setLineups, setSubstitutes]
  );

  return {
    currentTime,
    setCurrentTime,
    isPlaying,
    setIsPlaying,
    handleTimeJump,
  };
};
