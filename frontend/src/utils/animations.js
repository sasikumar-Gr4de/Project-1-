export const animations = {
  // Player movement animations
  playerMove: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },

  // Timeline animations
  timeline: {
    slideIn: {
      initial: { x: -50, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      transition: { duration: 0.3 },
    },
    pulse: {
      animate: {
        scale: [1, 1.05, 1],
        transition: { duration: 0.5, repeat: Infinity },
      },
    },
  },

  // Formation change animations
  formationChange: {
    stagger: {
      animate: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    fadeInUp: {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.4 },
    },
  },
};

// GSAP animations for complex sequences
export const gsapAnimations = {
  playerSwap: (fromElement, toElement) => {
    return gsap
      .timeline()
      .to(fromElement, { scale: 0.8, opacity: 0.7, duration: 0.2 })
      .to(toElement, { scale: 1.1, duration: 0.2 }, "-=0.1")
      .to([fromElement, toElement], {
        scale: 1,
        opacity: 1,
        duration: 0.3,
      });
  },

  timelineProgress: (element, progress) => {
    gsap.to(element, {
      width: `${progress}%`,
      duration: 0.5,
      ease: "power2.out",
    });
  },
};
