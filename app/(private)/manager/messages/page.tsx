"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { Send, AlertCircle, MessageCircle, Clock, Loader2 } from "lucide-react";
import { ApiResponse, fetcher, getCookie } from "@/lib/utils";
import useSWR from "swr";
import { mapNotificationsToMessages, Message } from "./util";

export default function ManagerMessages() {
  const userName = getCookie("uName") || "Manager";
  const mid = getCookie("mid") || "Manager";
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    error,
    mutate: mutateMessage,
  } = useSWR("/api/protected/manager/message", fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 10000,
  });

  const messages: Message[] = mapNotificationsToMessages(data?.data, mid);

  // Sort messages by timestamp (oldest first, newest last)
  const sortedMessages = [...(messages || [])].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const messageText = newMessage.trim();
    setNewMessage("");

    const data = {
      message: messageText,
    };

    try {
      const res = await fetch("/api/protected/manager/message/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const response: ApiResponse = await res.json();
      if (!response.success) {
        console.error("Failed to send message:", response.message);
        // Re-add message if failed
        setNewMessage(messageText);
      } else {
        // Refresh messages after successful send
        await mutateMessage();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Re-add message if error
      setNewMessage(messageText);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // If yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return (
        "Yesterday " +
        date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }

    // If this week
    const daysDiff = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // Otherwise show date and time
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout role="manager" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {!isLoading && sortedMessages.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>
                Last message:{" "}
                {formatTime(
                  sortedMessages[sortedMessages.length - 1].timestamp
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-blue-900">Support Channel</p>
                {isLoading && (
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Updating...
                  </div>
                )}
              </div>
              <p className="text-sm text-blue-800 mt-1">
                Use this messaging system to report issues, request support, or
                communicate important updates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-320px)] min-h-[500px]">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4  border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  System Administrator
                </h2>
                <p className="text-sm text-gray-600">
                  Support Team • 24/7 Response
                </p>
              </div>
            </div>
            {sortedMessages.length > 0 && (
              <div className="hidden md:block">
                <span className="text-sm text-gray-500">
                  {sortedMessages.length} message
                  {sortedMessages.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-gray-50/50 to-white">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Loading messages</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Fetching your conversation...
                  </p>
                </div>
              </div>
            </div>
          ) : sortedMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                No messages yet
              </h3>
              <p className="text-gray-600 max-w-md mb-6">
                Start a conversation with the support team. They're here to help
                with any questions, issues, or requests you may have about the
                tournament system.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                  Quick Response
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                  24/7 Support
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                  Expert Help
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedMessages.map((message, index) => {
                const isManager = message.senderRole === "manager";
                const showDateHeader =
                  index === 0 ||
                  new Date(message.timestamp).toDateString() !==
                    new Date(
                      sortedMessages[index - 1].timestamp
                    ).toDateString();

                return (
                  <div key={message.id}>
                    {/* Date Separator */}
                    {showDateHeader && (
                      <div className="flex items-center justify-center my-6">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <span className="mx-4 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {new Date(message.timestamp).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                        <div className="h-px bg-gray-200 flex-1"></div>
                      </div>
                    )}

                    {/* Message */}
                    <div
                      className={`flex ${
                        isManager ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div className="max-w-[80%] md:max-w-[70%]">
                        <div
                          className={`px-4 py-3 rounded-2xl ${
                            isManager
                              ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none"
                              : "bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none"
                          }`}
                        >
                          {!isManager && (
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-gray-700">
                                Support Team
                              </span>
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span className="text-xs text-gray-500">
                                Staff
                              </span>
                            </div>
                          )}
                          <p className="text-sm md:text-base leading-relaxed">
                            {message.message}
                          </p>
                          <div
                            className={`flex items-center gap-2 mt-2 ${
                              isManager ? "justify-end" : "justify-start"
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            <span
                              className={`text-xs ${
                                isManager ? "text-blue-100" : "text-gray-500"
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="px-4 md:px-6 py-4 border-t border-gray-200 bg-white">
          <div className="space-y-3">
            {/* Sending Indicator */}
            {isSending && (
              <div className="flex items-center gap-2 text-sm text-blue-600 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending message...</span>
              </div>
            )}

            <div className="border-t border-border  px-4 py-3">
              <div className="relative flex items-center">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isSending}
                  className="h-12 rounded-full pr-14 pl-4 bg-white focus-visible:ring-2 focus-visible:ring-primary"
                />

                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending}
                  className={`
        absolute right-2 flex items-center justify-center
        w-9 h-9 rounded-full
        transition-all
        ${
          !newMessage.trim() || isSending
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-primary text-white hover:bg-primary/90"
        }
      `}
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Press{" "}
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">
                  Enter
                </kbd>{" "}
                to send
              </p>
              <p className="text-xs text-gray-500">
                {newMessage.length}/500 characters
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
