import { motion } from "framer-motion";

export const animations = {
  // Page transitions
  page: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  },

  // Player movements
  player: {
    move: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 },
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    swap: {
      animate: {
        scale: [1, 1.2, 1],
        transition: { duration: 0.4 },
      },
    },
    select: {
      animate: {
        scale: [1, 1.1, 1],
        rotate: [0, -5, 5, 0],
        transition: { duration: 0.5 },
      },
    },
  },

  // Timeline animations
  timeline: {
    progress: {
      animate: {
        transition: { duration: 0.5, ease: "easeOut" },
      },
    },
    marker: {
      hover: {
        scale: 1.2,
        transition: { type: "spring", stiffness: 400 },
      },
    },
    pulse: {
      animate: {
        scale: [1, 1.05, 1],
        transition: { duration: 0.5, repeat: Infinity },
      },
    },
  },

  // Formation changes
  formation: {
    stagger: {
      animate: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    item: {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.4 },
    },
  },

  // Tooltip animations
  tooltip: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.2 },
  },

  // Button animations
  button: {
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: {
      scale: 0.95,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  },

  // Card animations
  card: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  },

  // Fade animations
  fade: {
    in: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 },
    },
    inUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.4 },
    },
    inDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
      transition: { duration: 0.4 },
    },
  },

  // Slide animations
  slide: {
    inLeft: {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 },
      transition: { duration: 0.4 },
    },
    inRight: {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 50 },
      transition: { duration: 0.4 },
    },
  },

  // Scale animations
  scale: {
    in: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
      transition: { duration: 0.3 },
    },
    bounce: {
      initial: { opacity: 0, scale: 0.3 },
      animate: {
        opacity: 1,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 15,
        },
      },
      exit: { opacity: 0, scale: 0.3 },
    },
  },

  // Special animations for football pitch
  pitch: {
    playerEnter: {
      initial: { scale: 0, opacity: 0, rotate: -180 },
      animate: { scale: 1, opacity: 1, rotate: 0 },
      exit: { scale: 0, opacity: 0, rotate: 180 },
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    formationChange: {
      animate: {
        transition: {
          staggerChildren: 0.05,
        },
      },
    },
    goalCelebration: {
      animate: {
        scale: [1, 1.3, 1],
        rotate: [0, 10, -10, 0],
        transition: {
          duration: 0.8,
          times: [0, 0.3, 0.6, 1],
        },
      },
    },
  },
};

// Reusable animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4 },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.4 },
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: { duration: 0.4 },
};

export const fadeInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
  transition: { duration: 0.4 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.3 },
};

export const bounceIn = {
  initial: { opacity: 0, scale: 0.3 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  },
  exit: { opacity: 0, scale: 0.3 },
};

// Stagger animations for multiple elements
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerFast = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const staggerSlow = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Reusable motion components
export const MotionDiv = motion.div;
export const MotionSpan = motion.span;
export const MotionButton = motion.button;

// Helper functions for complex animations
export const createPulseAnimation = (color = "rgba(59, 130, 246, 0.5)") => ({
  animate: {
    boxShadow: [
      `0 0 0 0 ${color}`,
      `0 0 0 10px ${color}00`,
      `0 0 0 0 ${color}`,
    ],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: "loop",
  },
});

export const createFloatAnimation = (distance = 5) => ({
  animate: {
    y: [0, -distance, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
});

export const createShakeAnimation = (intensity = 5) => ({
  animate: {
    x: [0, -intensity, intensity, -intensity, intensity, 0],
    transition: {
      duration: 0.5,
    },
  },
});

// Animation presets for common use cases
export const animationPresets = {
  // For player selection
  playerSelected: {
    scale: 1.1,
    rotate: [0, -2, 2, 0],
    transition: { duration: 0.3 },
  },

  // For timeline progress
  timelineProgress: {
    transition: { duration: 0.5, ease: "easeOut" },
  },

  // For formation changes
  formationStagger: {
    transition: {
      staggerChildren: 0.1,
    },
  },

  // For goal celebrations
  goalCelebration: {
    scale: [1, 1.2, 1],
    rotate: [0, 5, -5, 0],
    transition: { duration: 0.6 },
  },
};

export default animations;
