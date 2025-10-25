// src/components/chat/ChatbotButton.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ChatbotButton = ({ onClick, unreadCount }) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
      size="icon"
      aria-label="Open chatbot"
    >
      {/* Chat icon */}
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>

      {/* Unread count badge */}
      {unreadCount > 0 && (
        <Badge
          className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 animate-pulse"
          variant="destructive"
        >
          {unreadCount}
        </Badge>
      )}
    </Button>
  );
};

export default ChatbotButton;
