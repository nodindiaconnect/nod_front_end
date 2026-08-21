import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  MessageSquare,
  Send,
  Users,
  User,
  Search,
  Check,
  CheckCheck,
  Paperclip,
  Circle,
  ArrowLeft,
  Briefcase,
  Clock,
  Shield,
  Smile,
  MoreVertical,
} from "lucide-react";
import { toast } from "react-toastify";
import { getCurrentUser } from "../../../utils/auth";
import {
  useGetMyChatsQuery,
  useGetProjectChatsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
  useStartChatMutation,
} from "../../../ApiSliceComponent/chatApiSlice";
import { useSocketChat } from "../../../utils/socketService";

export default function ChatWorkspace({
  projectId = null,
  initialChatId = null,
  initialRecipientId = null,
  initialRecipientName = null,
  initialBidId = null,
  isEmbedded = false,
}) {
  const currentUser = getCurrentUser() || {};
  const currentUserId = currentUser.id || currentUser.userId;

  const [activeChatId, setActiveChatId] = useState(initialChatId);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatFilter, setChatFilter] = useState("ALL"); // ALL | TEAM | DIRECT
  const [messageText, setMessageText] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const [mobileShowChat, setMobileShowChat] = useState(!!initialChatId || !!initialRecipientId);

  const messagesEndRef = useRef(null);
  const composerInputRef = useRef(null);

  // Queries
  const {
    data: myChatsRes,
    isLoading: loadingMyChats,
    refetch: refetchMyChats,
  } = useGetMyChatsQuery(undefined, {
    skip: !!projectId,
    pollingInterval: 30000,
  });

  const {
    data: projectChatsRes,
    isLoading: loadingProjectChats,
    refetch: refetchProjectChats,
  } = useGetProjectChatsQuery(projectId, {
    skip: !projectId,
    pollingInterval: 30000,
  });

  const allChats = useMemo(() => {
    const raw = projectId ? projectChatsRes?.data || [] : myChatsRes?.data || [];
    return Array.isArray(raw) ? raw : [];
  }, [projectId, projectChatsRes, myChatsRes]);

  // Mutations
  const [sendMessageMutation] = useSendMessageMutation();
  const [markAsReadMutation] = useMarkAsReadMutation();
  const [startChatMutation] = useStartChatMutation();

  // Selected Active Chat
  const activeChat = useMemo(() => {
    return allChats.find((c) => c.id === activeChatId) || null;
  }, [allChats, activeChatId]);

  // Fetch initial REST message history for active chat
  const { data: messagesRes, isLoading: loadingMessages } = useGetMessagesQuery(
    { chatId: activeChatId, limit: 100 },
    { skip: !activeChatId }
  );

  // Synchronize REST messages into local reactive state
  useEffect(() => {
    if (messagesRes?.data?.messages) {
      setLocalMessages(messagesRes.data.messages);
    } else if (Array.isArray(messagesRes?.data)) {
      setLocalMessages(messagesRes.data);
    }
  }, [messagesRes]);

  // Real-time socket handlers
  const handleMessageReceived = (msg) => {
    if (!msg) return;
    setLocalMessages((prev) => {
      // Prevent duplicate
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg];
    });

    if (activeChatId && msg.chatId === activeChatId && msg.senderId !== currentUserId) {
      emitMarkRead(msg.id);
      markAsReadMutation({ chatId: activeChatId, messageId: msg.id });
    }
    refetchMyChats();
  };

  const handleMessageDelivered = (data) => {
    setLocalMessages((prev) =>
      prev.map((m) =>
        m.id === data.messageId ? { ...m, deliveredAt: data.deliveredAt || new Date() } : m
      )
    );
  };

  const handleMessageRead = (data) => {
    setLocalMessages((prev) =>
      prev.map((m) => {
        if (!data.messageId || m.id === data.messageId) {
          return { ...m, isRead: true, readAt: data.readAt || new Date() };
        }
        return m;
      })
    );
  };

  // Socket.IO hook
  const {
    isConnected,
    typingUsers,
    onlineUsers,
    emitSendMessage,
    emitMarkRead,
    emitTyping,
    emitStopTyping,
  } = useSocketChat({
    chatId: activeChatId,
    projectId: projectId || activeChat?.projectId,
    onMessageReceived: handleMessageReceived,
    onMessageDelivered: handleMessageDelivered,
    onMessageRead: handleMessageRead,
  });

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages, typingUsers]);

  // If initialRecipientId was passed (e.g. from Bids -> Chat or Team -> Chat), start or select chat
  useEffect(() => {
    if (initialRecipientId && projectId) {
      const existing = allChats.find(
        (c) =>
          c.type === "DIRECT" &&
          c.participants?.some((p) => p.userId === initialRecipientId)
      );

      if (existing) {
        setActiveChatId(existing.id);
        setMobileShowChat(true);
      } else {
        // Create new direct chat
        startChatMutation({
          projectId,
          professionalId: initialRecipientId,
          recipientId: initialRecipientId,
          bidId: initialBidId,
          type: "DIRECT",
        })
          .unwrap()
          .then((res) => {
            if (res.data?.id) {
              setActiveChatId(res.data.id);
              setMobileShowChat(true);
            }
          })
          .catch((err) => {
            console.error("Failed to start chat:", err);
          });
      }
    }
  }, [initialRecipientId, projectId, allChats]);

  // Set default active chat if none selected
  useEffect(() => {
    if (!activeChatId && allChats.length > 0 && !initialRecipientId) {
      setActiveChatId(allChats[0].id);
    }
  }, [allChats, activeChatId, initialRecipientId]);

  // Mark active chat as read upon opening
  useEffect(() => {
    if (activeChatId) {
      emitMarkRead();
      markAsReadMutation({ chatId: activeChatId });
    }
  }, [activeChatId]);

  // Send message
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const text = messageText.trim();
    if (!text || !activeChatId) return;

    setMessageText("");
    emitStopTyping();

    // Optimistic message
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      chatId: activeChatId,
      senderId: currentUserId,
      text,
      attachments: [],
      createdAt: new Date().toISOString(),
      sender: {
        id: currentUserId,
        name: currentUser.name || "You",
        profile: currentUser.profile || null,
      },
    };

    setLocalMessages((prev) => [...prev, optimisticMsg]);

    // Send via socket with REST fallback
    emitSendMessage(text, [], async (ack) => {
      if (ack?.success && ack.data) {
        setLocalMessages((prev) =>
          prev.map((m) => (m.id === tempId ? ack.data : m))
        );
      } else {
        // Fallback to REST API
        try {
          const res = await sendMessageMutation({
            chatId: activeChatId,
            text,
            attachments: [],
          }).unwrap();
          if (res?.data) {
            setLocalMessages((prev) =>
              prev.map((m) => (m.id === tempId ? res.data : m))
            );
          }
        } catch (err) {
          toast.error("Failed to send message");
          setLocalMessages((prev) => prev.filter((m) => m.id !== tempId));
        }
      }
    });

    composerInputRef.current?.focus();
  };

  // Helper to get chat display details
  const getChatMetadata = (chat) => {
    if (!chat) return {};
    const isTeam = chat.type === "PROJECT_TEAM";
    const otherParticipants = (chat.participants || []).filter(
      (p) => p.userId !== currentUserId
    );
    const primaryOther = otherParticipants[0]?.user || {};

    const title = isTeam
      ? chat.title || `${chat.project?.title || "Project"} Team`
      : primaryOther.name || chat.title || "Direct Chat";

    const subtitle = isTeam
      ? `${chat.participants?.length || 0} members`
      : primaryOther.role
      ? String(primaryOther.role).replace(/_/g, " ")
      : chat.project?.title || "Pre-Award Negotiation";

    const isOnline = isTeam
      ? otherParticipants.some((p) => onlineUsers.has(p.userId))
      : onlineUsers.has(primaryOther.id);

    return {
      title,
      subtitle,
      isTeam,
      isOnline,
      profile: primaryOther.profile,
      projectTitle: chat.project?.title,
    };
  };

  // Filter conversations
  const filteredChats = allChats.filter((chat) => {
    const meta = getChatMetadata(chat);
    const matchesSearch =
      meta.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meta.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (chatFilter === "TEAM") return meta.isTeam;
    if (chatFilter === "DIRECT") return !meta.isTeam;
    return true;
  });

  const activeMeta = getChatMetadata(activeChat);

  return (
    <div
      className={`bg-white rounded-lg border border-border overflow-hidden shadow-sm flex flex-col ${
        isEmbedded ? "h-[680px]" : "h-[calc(100vh-140px)] min-h-[550px]"
      }`}
    >
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Conversations List */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-surface transition-all ${
            mobileShowChat ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Sidebar Top Search & Filter */}
          <div className="p-4 border-b border-border bg-[var(--background-secondary)]/50 space-y-3">
            <div className="flex items-center justify-between">
              <h3
                className="font-bold text-heading text-base"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Messages
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-muted">
                <Circle
                  size={8}
                  className={isConnected ? "text-emerald-500 fill-emerald-500" : "text-amber-500 fill-amber-500"}
                />
                <span>{isConnected ? "Live" : "Connecting..."}</span>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-2.5 text-muted" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-xs pl-9 pr-3 py-2 rounded-md border border-border focus:outline-none focus:border-primary transition"
              />
            </div>

            {/* Chat Type Filter */}
            <div className="flex gap-1 bg-black/5 p-0.5 rounded-md text-[11px]">
              {["ALL", "DIRECT", "TEAM"].map((f) => (
                <button
                  key={f}
                  onClick={() => setChatFilter(f)}
                  className={`flex-1 py-1 rounded font-semibold uppercase tracking-wider transition ${
                    chatFilter === f
                      ? "bg-white text-heading shadow-xs"
                      : "text-muted hover:text-heading"
                  }`}
                >
                  {f === "ALL" ? "All" : f === "DIRECT" ? "Direct" : "Team"}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations List Scrollable */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/60">
            {loadingMyChats || loadingProjectChats ? (
              <div className="p-8 text-center text-xs text-muted">Loading conversations...</div>
            ) : filteredChats.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare size={32} className="mx-auto text-muted opacity-30 mb-2" />
                <p className="text-xs text-muted">No conversations found</p>
              </div>
            ) : (
              filteredChats.map((chat) => {
                const meta = getChatMetadata(chat);
                const isSelected = chat.id === activeChatId;
                const lastMsg = chat.messages?.[chat.messages.length - 1] || chat.lastMessage;

                return (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setActiveChatId(chat.id);
                      setMobileShowChat(true);
                    }}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[var(--primary)]/10 border-l-4 border-l-[var(--primary)]"
                        : "hover:bg-[var(--background-secondary)]/50"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm overflow-hidden border border-border ${
                          meta.isTeam
                            ? "bg-[var(--gold)]/20 text-[var(--primary)]"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {meta.isTeam ? (
                          <Users size={18} />
                        ) : meta.profile ? (
                          <img
                            src={meta.profile}
                            alt={meta.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{meta.title?.charAt(0) || "U"}</span>
                        )}
                      </div>

                      {meta.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    {/* Chat Item Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-semibold text-heading text-xs truncate max-w-[140px] sm:max-w-[170px]">
                          {meta.title}
                        </h4>
                        {lastMsg && (
                          <span className="text-[10px] text-muted whitespace-nowrap">
                            {new Date(lastMsg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-1">
                        <p className="text-[11px] text-muted truncate max-w-[180px]">
                          {lastMsg ? lastMsg.text || "Attachment" : meta.subtitle}
                        </p>

                        {meta.isTeam && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-[var(--gold)]/20 text-[var(--primary)]">
                            Team
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Main Panel: Active Chat Messages & Composer */}
        <div
          className={`flex-1 flex flex-col bg-surface transition-all ${
            !mobileShowChat ? "hidden md:flex" : "flex"
          }`}
        >
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-border bg-[var(--background-secondary)] flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setMobileShowChat(false)}
                    className="md:hidden p-1 rounded-md text-muted hover:text-heading"
                  >
                    <ArrowLeft size={18} />
                  </button>

                  {/* Header Avatar */}
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm overflow-hidden flex-shrink-0 border border-border">
                    {activeMeta.isTeam ? (
                      <Users size={18} />
                    ) : activeMeta.profile ? (
                      <img
                        src={activeMeta.profile}
                        alt={activeMeta.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{activeMeta.title?.charAt(0) || "U"}</span>
                    )}
                  </div>

                  {/* Header Titles */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-heading text-sm truncate">
                        {activeMeta.title}
                      </h3>
                      {activeMeta.isTeam && (
                        <span className="text-[10px] px-2 py-0.2 rounded-full font-semibold bg-[var(--gold)] text-black">
                          Team Chat
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted truncate">
                      {activeMeta.projectTitle && (
                        <span className="font-medium text-heading/80">
                          Project: {activeMeta.projectTitle}
                        </span>
                      )}
                      <span>•</span>
                      <span className={activeMeta.isOnline ? "text-emerald-600 font-medium" : "text-muted"}>
                        {activeMeta.isOnline ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--background)]">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full text-xs text-muted">
                    Loading messages...
                  </div>
                ) : localMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted">
                    <MessageSquare size={36} className="opacity-20 mb-2" />
                    <p className="text-xs font-semibold text-heading">Start the conversation</p>
                    <p className="text-[11px] text-muted max-w-xs mt-1">
                      Discuss project details, questions, deadlines, and milestone deliverables.
                    </p>
                  </div>
                ) : (
                  localMessages.map((msg, index) => {
                    const isMine = msg.senderId === currentUserId;
                    const senderName = msg.sender?.name || (isMine ? "You" : "Specialist");

                    return (
                      <div
                        key={msg.id || index}
                        className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                      >
                        {/* Group Sender Name in Team Chat */}
                        {activeMeta.isTeam && !isMine && (
                          <span className="text-[10px] font-semibold text-muted mb-1 px-1">
                            {senderName}
                          </span>
                        )}

                        <div
                          className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                            isMine
                              ? "bg-[var(--primary)] text-white rounded-br-xs"
                              : "bg-[var(--background-secondary)] text-heading rounded-bl-xs border border-border/60"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                          {/* Message Time and Delivery Checks */}
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                              isMine ? "text-white/70" : "text-muted"
                            }`}
                          >
                            <span>
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {isMine && (
                              <span>
                                {msg.isRead ? (
                                  <CheckCheck size={13} className="text-[var(--gold)]" />
                                ) : msg.deliveredAt ? (
                                  <CheckCheck size={13} className="text-white/70" />
                                ) : (
                                  <Check size={13} />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Typing Indicator Display */}
                {typingUsers.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted italic px-2 py-1">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span>
                      {typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"} typing...
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer */}
              <div className="p-3 border-t border-border bg-white">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-2 bg-[var(--background-secondary)] p-1.5 rounded-xl border border-border focus-within:border-[var(--primary)] transition"
                >
                  <textarea
                    ref={composerInputRef}
                    rows={1}
                    value={messageText}
                    onChange={(e) => {
                      setMessageText(e.target.value);
                      emitTyping();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your message... (Enter to send)"
                    className="flex-1 bg-transparent text-xs text-heading px-3 py-1.5 resize-none focus:outline-none max-h-24 overflow-y-auto"
                  />

                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="p-2 rounded-lg bg-[var(--primary)] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--primary-hover)] transition shadow-xs flex-shrink-0"
                  >
                    <Send size={15} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            /* No Chat Selected Placeholder */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <MessageSquare size={48} className="text-muted opacity-20 mb-3" />
              <h3
                className="text-lg font-bold text-heading"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Select a Conversation
              </h3>
              <p className="text-xs text-muted max-w-xs mt-1">
                Choose a project team chat or professional negotiation from the sidebar to view messages.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
