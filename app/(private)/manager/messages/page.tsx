"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Send, AlertCircle, MessageCircle } from "lucide-react";

interface Message {
  id: number;
  senderRole: "admin" | "manager";
  senderName: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export default function ManagerMessages() {
  const userName = localStorage.getItem("userName") || "Manager";
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      senderRole: "manager",
      senderName: userName,
      message:
        "Hi, we're having some issues with player registration. Many teams are reporting errors when trying to upload documents. Can you help?",
      timestamp: "Dec 19, 2024 14:32",
      isRead: true,
    },
    {
      id: 2,
      senderRole: "admin",
      senderName: "Admin",
      message:
        "I'll investigate this immediately. In the meantime, ask teams to try a different browser. This usually resolves upload issues.",
      timestamp: "Dec 19, 2024 14:45",
      isRead: true,
    },
    {
      id: 3,
      senderRole: "manager",
      senderName: userName,
      message:
        "Thanks for the quick response! That fixed the issue for most teams. We're good to proceed with the tournament setup.",
      timestamp: "Dec 19, 2024 15:10",
      isRead: true,
    },
    {
      id: 4,
      senderRole: "admin",
      senderName: "Admin",
      message:
        "Great! Please finalize the fixture schedule ASAP and ensure all teams have their match dates confirmed.",
      timestamp: "Dec 19, 2024 15:25",
      isRead: true,
    },
    {
      id: 5,
      senderRole: "manager",
      senderName: userName,
      message:
        "Will do! The schedule will be finalized by tomorrow morning. All teams have been notified.",
      timestamp: "Dec 19, 2024 15:40",
      isRead: true,
    },
  ]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Math.max(...messages.map((m) => m.id), 0) + 1,
      senderRole: "manager",
      senderName: userName,
      message: newMessage,
      timestamp: new Date().toLocaleString(),
      isRead: true,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const markAsRead = (id: number) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
    );
  };

  return (
    <Layout role="manager" userName={userName}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground mt-2">
          Communicate with the system administrator
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900 text-sm">Need Help?</p>
          <p className="text-sm text-blue-800 mt-1">
            Use this messaging system to report issues, request support, or
            communicate important updates about your tournament.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-border overflow-hidden flex flex-col h-auto md:h-[calc(100vh-350px)] min-h-96">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                System Administrator
              </h2>
              <p className="text-sm text-muted-foreground">
                Always available for support
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => {
            if (!message.isRead) markAsRead(message.id);

            return (
              <div
                key={message.id}
                className={`flex ${
                  message.senderRole === "manager"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.senderRole === "manager"
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none"
                  }`}
                >
                  {message.senderRole === "admin" && (
                    <p className="text-xs font-semibold mb-1 opacity-75">
                      System Administrator
                    </p>
                  )}
                  <p className="text-sm">{message.message}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.senderRole === "manager"
                        ? "text-blue-100"
                        : "text-muted-foreground"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input */}
        <div className="px-6 py-4 border-t border-border bg-muted">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Type your message or report an issue..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="rounded-lg h-10"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-primary hover:bg-blue-600 text-white rounded-lg h-10 gap-2 px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter or click Send to send your message
          </p>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-border p-4">
          <h3 className="font-semibold text-foreground mb-2 text-sm">
            Report Issues
          </h3>
          <p className="text-xs text-muted-foreground">
            Tell us about any technical problems or system errors you encounter
          </p>
        </div>
        <div className="bg-white rounded-lg border border-border p-4">
          <h3 className="font-semibold text-foreground mb-2 text-sm">
            Request Support
          </h3>
          <p className="text-xs text-muted-foreground">
            Ask for help with tournament setup, registration, or any other
            questions
          </p>
        </div>
        <div className="bg-white rounded-lg border border-border p-4">
          <h3 className="font-semibold text-foreground mb-2 text-sm">
            Share Updates
          </h3>
          <p className="text-xs text-muted-foreground">
            Communicate important tournament milestones and status updates
          </p>
        </div>
      </div>
    </Layout>
  );
}
