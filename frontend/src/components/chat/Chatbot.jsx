import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import ChatbotButton from "@/components/chat/ChatbotButton";
import ChatbotWindow from "@/components/chat/ChatbotWindow";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast, toasts } = useToast();

  // Load chat history from localStorage
  // useEffect(() => {
  //   const savedChat = localStorage.getItem("chatbot-history");
  //   if (savedChat) {
  //     try {
  //       setMessages(JSON.parse(savedChat));
  //     } catch (error) {
  //       console.error("Error loading chat history:", error);
  //       toast({
  //         title: "Error",
  //         description: "Failed to load chat history",
  //         variant: "destructive",
  //       });
  //     }
  //   }
  // }, [toast]);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem("chatbot-history", JSON.stringify(messages));
  }, [messages]);

  // Update unread count
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const handleSendMessage = async (messageText) => {
    const userMessage = {
      text: messageText,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Mock API call - replace with your actual API endpoint
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          conversationHistory: messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const botMessage = {
        text: data.reply,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);

      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage = {
        text: "Sorry, I encountered an error. Please try again later.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);

      toast({
        title: "Connection Error",
        description: "Failed to send message. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  return (
    <>
      <ChatbotButton onClick={handleToggleChat} unreadCount={unreadCount} />
      <ChatbotWindow
        isOpen={isOpen}
        onClose={handleCloseChat}
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg border max-w-sm animate-in slide-in-from-right-full duration-300 ${
              toast.variant === "destructive"
                ? "bg-destructive text-destructive-foreground border-destructive/50"
                : "bg-background text-foreground border-border"
            }`}
          >
            <div className="font-semibold">{toast.title}</div>
            {toast.description && (
              <div className="text-sm mt-1">{toast.description}</div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Chatbot;
