import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const ScrollIndicator = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const checkScrollPosition = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Calculate scroll progress (0 to 100)
    const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
    setScrollProgress(progress);

    // Show top arrow when scrolled past 300px
    setShowScrollTop(scrollTop > 300);

    // Show bottom arrow when not at bottom
    setShowScrollBottom(windowHeight + scrollTop < documentHeight - 100);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener("scroll", checkScrollPosition);
    window.addEventListener("resize", checkScrollPosition);

    return () => {
      window.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, []);

  if (!showScrollTop && !showScrollBottom) {
    return null;
  }

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-center space-y-3">
      {/* Progress Circle (Optional) */}
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="rgba(75, 85, 99, 0.3)"
            strokeWidth="2"
          />
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="rgba(59, 130, 246, 0.6)"
            strokeWidth="2"
            strokeDasharray="100"
            strokeDashoffset={100 - scrollProgress}
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Up Arrow */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="p-3 bg-gray-800/60 backdrop-blur-md border border-gray-700/50 rounded-full text-white hover:bg-gray-700/80 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl group"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Down Arrow */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="p-3 bg-gray-800/60 backdrop-blur-md border border-gray-700/50 rounded-full text-white hover:bg-gray-700/80 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl group"
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="h-5 w-5 group-hover:scale-110 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default ScrollIndicator;
