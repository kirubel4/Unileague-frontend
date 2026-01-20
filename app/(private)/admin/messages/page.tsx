"use client";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import {
  Send,
  Search,
  MessageCircle,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ApiResponse, fetcher, getCookie } from "@/lib/utils";
import useSWR from "swr";
import { formatDistanceToNow, format } from "date-fns";
import { mapNotificationsToMessages } from "../../manager/messages/util";
interface Manager {
  id: number;
  name: string;
  tournament: string;
  tournamentId?: number;
  email?: string;
  lastMessage?: string;
  unreadCount: number;
}
export default function AdminMessages() {
  const userName = getCookie("uName") || "Admin";
  const [selectedManager, setSelectedManager] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const { data: conversationsData, mutate: mutateConversations } = useSWR(
    "/api/protected/admin/messages",
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 10000,
    },
  );
  const { data: messagesData, mutate: mutateMessages } = useSWR(
    selectedManager
      ? `/api/protected/admin/messages/indiv?id=${selectedManager}`
      : null,
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 10000,
    },
  );
  const managers: Manager[] | [] =
    conversationsData?.data?.map(
      (conv: {
        senderId: string;
        senderName: string;
        tournamentName: string;
        lastMessage: string;
        lastMessageAt: Date;
      }) => ({
        id: conv.senderId,
        name: conv.senderName,
        tournament: conv.tournamentName,
        email: conv.senderId,
        lastMessage: conv.lastMessage,
        unreadCount: 0,
      }),
    ) || [];

  const data = mapNotificationsToMessages(
    messagesData?.data,
    selectedManager.toString(),
  );
  const sortedMessages = [...(data || [])].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  const selectedManagerData = managers.find((m) => m.id === selectedManager);
  const filteredManagers = managers?.filter(
    (m) =>
      m?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m?.tournament.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending || !selectedManager) return;

    setIsSending(true);
    const messageText = newMessage.trim();

    try {
      const response = await fetch(`/api/protected/admin/messages/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          managerId: selectedManager,
        }),
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        setNewMessage("");
        await Promise.all([mutateMessages(), mutateConversations()]);
        setIsSending(false);
      } else {
        console.error("Failed to send message:", result.message);
        setIsSending(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsSending(false);
    } finally {
      setIsSending(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      console.log("hii");
      await fetch(`/api/protected/admin/messages/mark?id=${messageId}`, {
        method: "POST",
      });
      mutateMessages();
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours < 24) {
        return formatDistanceToNow(date, { addSuffix: true });
      } else if (diffHours < 48) {
        return `Yesterday ${format(date, "HH:mm")}`;
      } else {
        return format(date, "MMM d, HH:mm");
      }
    } catch {
      return timestamp;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Layout role="super_admin" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Support Messages</h1>
        <p className="text-muted-foreground mt-2">
          Communicate with tournament managers and respond to support requests
        </p>
      </div>

      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-4">
        <Button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          variant="outline"
          className="w-full justify-between"
        >
          {selectedManagerData ? (
            <>
              <span>{selectedManagerData.name}</span>
              {isMobileMenuOpen ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </>
          ) : (
            "Select Manager"
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Managers List */}
        <div
          className={`
          ${isMobileMenuOpen ? "flex" : "hidden"}
          lg:flex lg:col-span-1 bg-white rounded-lg border border-border overflow-hidden flex-col
          ${
            isMobileMenuOpen
              ? "absolute inset-x-4 top-32 bottom-4 z-50 lg:relative lg:inset-auto"
              : ""
          }
        `}
        >
          {/* Header with Search */}
          <div className="p-4 border-b border-border bg-linear-to-r from-gray-50 to-white">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search managers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg h-10 pl-9"
              />
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              {filteredManagers.length} manager
              {filteredManagers.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Managers List */}
          <div className="flex-1 overflow-y-auto">
            {filteredManagers.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No managers found</p>
              </div>
            ) : (
              filteredManagers.map((manager) => {
                const isSelected = selectedManager === manager.id;

                return (
                  <button
                    key={manager.id}
                    onClick={() => {
                      setSelectedManager(manager.id);
                      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                    }}
                    className={`
                      w-full px-4 py-3 border-b border-border text-left transition-all
                      hover:bg-accent/50 active:bg-accent
                      ${
                        isSelected
                          ? "bg-primary/10 border-l-2 border-l-primary"
                          : ""
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {getInitials(manager.name)}
                        </div>
                        {manager.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                            {manager.unreadCount}
                          </div>
                        )}
                      </div>

                      {/* Manager Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-foreground text-sm truncate">
                            {manager.name}
                          </p>
                          {manager.lastMessage && (
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatTime(manager.lastMessage)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {manager.tournament}
                        </p>
                        {manager.email && (
                          <p className="text-xs text-muted-foreground truncate">
                            {manager.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Close mobile menu button */}
          {isMobileMenuOpen && (
            <div className="p-4 border-t border-border lg:hidden">
              <Button
                onClick={() => setIsMobileMenuOpen(false)}
                variant="outline"
                className="w-full"
              >
                Close
              </Button>
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 bg-white rounded-lg border border-border overflow-hidden flex flex-col">
          {selectedManagerData ? (
            <>
              {/* Chat Header */}
              <div className="px-4 md:px-6 py-4 border-b border-border bg-linear-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {getInitials(selectedManagerData.name)}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        {selectedManagerData.name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                          {selectedManagerData.tournament}
                        </p>
                        {selectedManagerData.email && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <p className="text-sm text-muted-foreground">
                              {selectedManagerData.email}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <Button
                      onClick={() => setIsMobileMenuOpen(true)}
                      variant="outline"
                      size="sm"
                      className="lg:hidden"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Back to list
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-linear-to-b from-gray-50/50 to-white">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                      <p className="text-muted-foreground">
                        Loading messages...
                      </p>
                    </div>
                  </div>
                ) : sortedMessages?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <div className="w-20 h-20 bg-linear-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mb-6">
                      <MessageCircle className="w-10 h-10 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      No messages yet
                    </h3>
                    <p className="text-gray-600 max-w-md mb-6">
                      Start a conversation with {selectedManagerData.name}. They
                      might need help with {selectedManagerData.tournament}.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedMessages?.map((message, index) => {
                      const isAdmin = message.senderRole === "admin";
                      const showDateHeader =
                        index === 0 ||
                        new Date(message.timestamp).toDateString() !==
                          new Date(data[index - 1]?.timestamp).toDateString();

                      // Mark as read if not already
                      if (!message.isRead && !isAdmin) {
                        setTimeout(() => markAsRead(message.id), 600);
                      }

                      return (
                        <div key={message.id}>
                          {/* Date Separator */}
                          {showDateHeader && (
                            <div className="flex items-center justify-center my-6">
                              <div className="h-px bg-gray-200 flex-1"></div>
                              <span className="mx-4 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                EEEE, MMMM d, yyyy
                              </span>
                              <div className="h-px bg-gray-200 flex-1"></div>
                            </div>
                          )}

                          {/* Message */}
                          <div
                            className={`flex ${
                              isAdmin ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div className="max-w-[80%] md:max-w-[70%]">
                              <div
                                className={`px-4 py-3 rounded-2xl ${
                                  isAdmin
                                    ? "bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-br-none"
                                    : "bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none"
                                }`}
                              >
                                {!isAdmin && (
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium text-gray-700">
                                      {message.senderName}
                                    </span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span className="text-xs text-gray-500">
                                      Manager
                                    </span>
                                  </div>
                                )}
                                <p className="text-sm md:text-base leading-relaxed">
                                  {message.message}
                                </p>
                                <div
                                  className={`flex items-center gap-2 mt-2 ${
                                    isAdmin ? "justify-end" : "justify-start"
                                  }`}
                                >
                                  <Clock className="w-3 h-3" />
                                  <span
                                    className={`text-xs ${
                                      isAdmin
                                        ? "text-blue-100"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {formatTime(message.timestamp)}
                                  </span>
                                  {!message.isRead && !isAdmin && (
                                    <span className="text-xs text-red-500">
                                      • Unread
                                    </span>
                                  )}
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
              <div className="px-4 md:px-6 py-4 border-t border-border bg-white">
                <div className="space-y-3">
                  {isSending && (
                    <div className="flex items-center gap-2 text-sm text-blue-600 animate-pulse">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending message...</span>
                    </div>
                  )}

                  <div className="relative flex items-center">
                    <Input
                      type="text"
                      placeholder={`Reply to ${selectedManagerData.name}...`}
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
                      maxLength={500}
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
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Select a Manager
              </h3>
              <p className="text-gray-500 max-w-md">
                Choose a manager from the list to view and send messages
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
