import { useCallback } from "react";

export const useFormationHistory = (
  currentTime,
  formations,
  lineups,
  substitutes,
  setFormationHistory
) => {
  // Save current formation state to history
  const saveFormationSnapshot = useCallback(() => {
    const snapshot = {
      time: currentTime,
      formations: { ...formations },
      lineups: JSON.parse(JSON.stringify(lineups)),
      substitutes: JSON.parse(JSON.stringify(substitutes)),
    };

    setFormationHistory((prev) => {
      const existingIndex = prev.findIndex((item) => item.time === currentTime);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = snapshot;
        return updated;
      }
      return [...prev, snapshot].sort((a, b) => a.time - b.time);
    });
  }, [currentTime, formations, lineups, substitutes, setFormationHistory]);

  return {
    saveFormationSnapshot,
  };
};
