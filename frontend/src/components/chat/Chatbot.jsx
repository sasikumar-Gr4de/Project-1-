import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import ChatbotButton from "./ChatbotButton";
import ChatbotWindow from "./ChatbotWindow";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedChat = localStorage.getItem("chatbot-history");
    if (savedChat) {
      try {
        setMessages(JSON.parse(savedChat));
      } catch (error) {
        console.error("Error loading chat history:", error);
        toast({
          title: "Error",
          description: "Failed to load chat history",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem("chatbot-history", JSON.stringify(messages));
  }, [messages]);

  // Update unread count when window opens/closes
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

      // Increment unread count if window is closed
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
    </>
  );
};

export default Chatbot;
