import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  MessageSquare,
  Send,
  Users,
  User,
  X,
  Search,
  Check,
  CheckCheck,
  Circle,
  ArrowLeft,
  Smile,
  SlidersHorizontal,
  FileText,
  Download,
  ShieldCheck,
  MapPin,
  Star,
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

const ROLE_NAMES = {
  0: "Admin",
  1: "Client",
  2: "Designer",
  3: "Architect",
  4: "Contractor",
  5: "Material Supplier",
  ADMIN: "Admin",
  CLIENT: "Client",
  DESIGNER: "Designer",
  INTERIOR_DESIGNER: "Designer",
  ARCHITECT: "Architect",
  CONTRACTOR: "Contractor",
  MATERIAL_SUPPLIER: "Material Supplier",
};

// URL and external link patterns to prevent sharing links in chat
const LINK_PATTERNS = [
  /https?:\/\/[^\s]+/i,
  /www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s]*/i,
  /\b[a-zA-Z0-9][-a-zA-Z0-9]*\.(?:com|in|org|net|co|io|ai|app|biz|info|xyz|site|online|tech|store|dev|me|club|live|link|pro|top|vip|us|uk|ca|au|de|fr|jp|ru|cn|tv|cc|to|space|fun|cloud|gov|edu)(?:\/[^\s]*)?\b/i,
  /\b(?:bit\.ly|tinyurl\.com|t\.co|goo\.gl|ow\.ly|is\.gd|buff\.ly|adf\.ly|bitly\.com)\b/i,
  /(?:https?|ftp)\s*:\s*\/\s*\//i,
  /[a-zA-Z0-9-]+\s*\.\s*(?:com|in|org|net|co|io|ai|app|xyz|site|online|tech|dev)\b/i,
];

const containsLink = (str) => {
  if (!str || typeof str !== "string") return false;
  return LINK_PATTERNS.some((pattern) => pattern.test(str));
};

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
  const [chatFilter, setChatFilter] = useState("ALL"); // ALL | DIRECT | TEAM
  const [messageText, setMessageText] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const [mobileShowChat, setMobileShowChat] = useState(!!initialChatId || !!initialRecipientId);
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);

  const messagesEndRef = useRef(null);
  const composerInputRef = useRef(null);
  const isCreatingChatRef = useRef(false);

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

  const isQueryLoading = projectId ? loadingProjectChats : loadingMyChats;

  // Deduplicate chats so multiple historical duplicate rooms never render twice
  const allChats = useMemo(() => {
    const raw = projectId ? projectChatsRes?.data || [] : myChatsRes?.data || [];
    if (!Array.isArray(raw)) return [];

    const seen = new Set();
    const unique = [];
    for (const c of raw) {
      let key;
      if (c.type === "DIRECT") {
        const other = (c.participants || []).find((p) => p.userId !== currentUserId);
        const otherId = other ? other.userId : c.id;
        key = `${c.projectId}_DIRECT_${otherId}`;
      } else {
        key = `${c.projectId}_${c.type}`;
      }

      if (!seen.has(key)) {
        seen.add(key);
        unique.push(c);
      }
    }
    return unique;
  }, [projectId, projectChatsRes, myChatsRes, currentUserId]);

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
      // 1. If exact real ID already exists, ignore duplicate
      if (prev.some((m) => m.id === msg.id)) return prev;

      // 2. If optimistic message with matching tempId exists, replace it
      if (msg.tempId && prev.some((m) => m.id === msg.tempId)) {
        return prev.map((m) => (m.id === msg.tempId ? msg : m));
      }

      // 3. Fallback optimistic match (same senderId and text within temporary message)
      const optIndex = prev.findIndex(
        (m) =>
          String(m.id).startsWith("temp-") &&
          m.senderId === msg.senderId &&
          m.text === msg.text
      );
      if (optIndex !== -1) {
        const copy = [...prev];
        copy[optIndex] = msg;
        return copy;
      }

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
  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom(localMessages.length <= 1 ? "auto" : "smooth");
  }, [localMessages, typingUsers]);

  // If initialRecipientId was passed, start or select chat cleanly once loaded
  useEffect(() => {
    if (initialRecipientId && projectId && !isQueryLoading) {
      const existing = allChats.find(
        (c) =>
          c.type === "DIRECT" &&
          c.participants?.some((p) => p.userId === initialRecipientId)
      );

      if (existing) {
        setActiveChatId(existing.id);
        setMobileShowChat(true);
      } else if (!isCreatingChatRef.current) {
        isCreatingChatRef.current = true;
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
          })
          .finally(() => {
            isCreatingChatRef.current = false;
          });
      }
    }
  }, [initialRecipientId, projectId, isQueryLoading, allChats]);

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

    // Disallow sharing links/URLs in chat
    if (containsLink(text)) {
      toast.error("Sharing website links or external URLs is not allowed in chat.");
      return;
    }

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
    emitSendMessage(
      text,
      [],
      async (ack) => {
        if (ack?.success && ack.data) {
          const realMsg = ack.data;
          setLocalMessages((prev) => {
            const hasReal = prev.some((m) => m.id === realMsg.id);
            if (hasReal) {
              return prev.filter((m) => m.id !== tempId);
            }
            return prev.map((m) => (m.id === tempId ? realMsg : m));
          });
        } else {
          const socketError = ack?.error;
          // If socket returned a validation error, do not retry REST, directly notify user and rollback
          if (socketError) {
            toast.error(socketError);
            setLocalMessages((prev) => prev.filter((m) => m.id !== tempId));
            return;
          }

          // Fallback to REST API
          try {
            const res = await sendMessageMutation({
              chatId: activeChatId,
              text,
              attachments: [],
            }).unwrap();
            if (res?.data) {
              const realMsg = res.data;
              setLocalMessages((prev) => {
                const hasReal = prev.some((m) => m.id === realMsg.id);
                if (hasReal) {
                  return prev.filter((m) => m.id !== tempId);
                }
                return prev.map((m) => (m.id === tempId ? realMsg : m));
              });
            }
          } catch (err) {
            const errMsg =
              err?.data?.message || err?.message || "Failed to send message";
            toast.error(errMsg);
            setLocalMessages((prev) => prev.filter((m) => m.id !== tempId));
          }
        }
      },
      tempId
    );

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

    const roleName =
      primaryOther.role != null
        ? ROLE_NAMES[primaryOther.role] || String(primaryOther.role).replace(/_/g, " ")
        : null;

    const title = isTeam
      ? chat.title || `${chat.project?.title || "Project"} Team`
      : primaryOther.name || chat.title || "Direct Chat";

    const subtitle = isTeam
      ? `${chat.participants?.length || 0} members`
      : roleName || chat.project?.title || "Professional Chat";

    const isOnline = isTeam
      ? otherParticipants.some((p) => onlineUsers.has(p.userId))
      : onlineUsers.has(primaryOther.id);

    const profileImageUrl =
      primaryOther.profileImageUrl ||
      (typeof primaryOther.profile === "string" &&
      (primaryOther.profile.startsWith("http") || primaryOther.profile.startsWith("/uploads"))
        ? primaryOther.profile
        : null);

    const profileObj =
      typeof primaryOther.profile === "object" && primaryOther.profile !== null
        ? primaryOther.profile
        : null;

    const initials = (title || "U")
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return {
      title,
      subtitle,
      roleName,
      isTeam,
      isOnline,
      profileImageUrl,
      profile: profileObj,
      user: primaryOther,
      projectTitle: chat.project?.title,
      initials,
      unreadCount: chat.unreadCount || 0,
    };
  };

  const isAttachmentMessage = (msg) =>
    Array.isArray(msg.attachments) && msg.attachments.length > 0;

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return "";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  // Filter conversations
  const filteredChats = allChats.filter((chat) => {
    const meta = getChatMetadata(chat);
    const matchesSearch =
      meta.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meta.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (meta.roleName && meta.roleName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (chatFilter === "TEAM") return meta.isTeam;
    if (chatFilter === "DIRECT") return !meta.isTeam;
    return true;
  });

  const directChats = filteredChats.filter((c) => !getChatMetadata(c).isTeam);
  const teamChats = filteredChats.filter((c) => getChatMetadata(c).isTeam);

  const activeMeta = getChatMetadata(activeChat);

  // Group messages by day for the "Today" style divider
  const messageGroups = useMemo(() => {
    const groups = [];
    let lastLabel = null;
    for (const msg of localMessages) {
      const d = new Date(msg.createdAt);
      const today = new Date();
      const isToday = d.toDateString() === today.toDateString();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const isYesterday = d.toDateString() === yesterday.toDateString();
      const label = isToday
        ? "Today"
        : isYesterday
        ? "Yesterday"
        : d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });

      if (label !== lastLabel) {
        groups.push({ type: "divider", label, key: `divider-${groups.length}` });
        lastLabel = label;
      }
      groups.push({ type: "message", msg });
    }
    return groups;
  }, [localMessages]);

  function ChatListRow({ chat }) {
    const meta = getChatMetadata(chat);
    const isSelected = chat.id === activeChatId;
    const lastMsg = chat.messages?.[chat.messages.length - 1] || chat.lastMessage;
    const isLastMsgMine = lastMsg?.senderId === currentUserId;

    return (
      <div
        onClick={() => {
          setActiveChatId(chat.id);
          setMobileShowChat(true);
        }}
        className={`px-3.5 py-3 flex items-center gap-3 cursor-pointer transition-all border-l-[3px] ${
          isSelected
            ? "bg-[var(--background-secondary)] border-l-[var(--gold)]"
            : "border-l-transparent hover:bg-black/[0.02]"
        }`}
      >
        {/* Avatar with Online Ring */}
        <div className="relative flex-shrink-0">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center font-semibold text-sm overflow-hidden border border-border"
            style={{ backgroundColor: "var(--background-secondary)", color: "var(--heading)" }}
          >
            {meta.isTeam ? (
              <Users size={18} style={{ color: "var(--primary)" }} />
            ) : meta.profileImageUrl ? (
              <img
                src={meta.profileImageUrl}
                alt={meta.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <span>{meta.initials}</span>
            )}
          </div>
          {meta.isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          )}
        </div>

        {/* Chat Item Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-semibold text-heading text-sm truncate">{meta.title}</h4>
            {lastMsg && (
              <span className="text-[11px] text-muted whitespace-nowrap flex-shrink-0">
                {new Date(lastMsg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <p className="text-[12.5px] text-muted truncate flex items-center gap-1">
              {isLastMsgMine && (
                <span className="inline-flex shrink-0">
                  {lastMsg.isRead ? (
                    <CheckCheck size={14} className="text-[var(--gold)]" />
                  ) : (
                    <Check size={14} className="text-muted" />
                  )}
                </span>
              )}
              <span className="truncate">{lastMsg ? lastMsg.text || "Attachment" : meta.subtitle}</span>
            </p>
            {meta.unreadCount > 0 && (
              <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-[#D4AF37] text-black text-[11px] font-bold flex items-center justify-center shadow-xs">
                {meta.unreadCount > 99 ? "99+" : meta.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  const totalWorkspaceUnread = allChats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const unreadDirectCount = directChats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const unreadTeamCount = teamChats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <div
      className={`bg-white rounded-2xl border border-border overflow-hidden shadow-sm flex flex-col ${
        isEmbedded ? "h-[680px]" : "h-[calc(100vh-140px)] min-h-[550px]"
      }`}
    >
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Conversations List */}
        <div
          className={`w-full md:w-80 lg:w-[350px] border-r border-border flex flex-col bg-white transition-all ${
            mobileShowChat ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Sidebar Top Search & Filter */}
          <div className="p-3.5 border-b border-border space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3
                  className="font-bold text-heading text-lg"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Messages
                </h3>
                {totalWorkspaceUnread > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-[#D4AF37] text-black shadow-xs">
                    {totalWorkspaceUnread} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[12px] text-muted">
                <Circle
                  size={8}
                  className={isConnected ? "text-emerald-500 fill-emerald-500" : "text-amber-500 fill-amber-500"}
                />
                <span>{isConnected ? "Live" : "Connecting..."}</span>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--background-secondary)] text-sm pl-9 pr-7 py-2 rounded-lg border border-transparent focus:border-[var(--gold)] focus:bg-white focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-heading"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() =>
                  setChatFilter((f) => (f === "ALL" ? "DIRECT" : f === "DIRECT" ? "TEAM" : "ALL"))
                }
                className={`p-2 rounded-lg border transition flex-shrink-0 cursor-pointer ${
                  chatFilter !== "ALL"
                    ? "bg-[var(--gold)] text-black border-[var(--gold)]"
                    : "border-border text-muted hover:text-heading hover:bg-black/[0.02]"
                }`}
                title={`Filter: ${chatFilter}`}
              >
                <SlidersHorizontal size={15} />
              </button>
            </div>

            {/* Quick Filter Pills */}
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setChatFilter("ALL")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  chatFilter === "ALL"
                    ? "bg-[var(--heading)] text-white"
                    : "bg-[var(--background-secondary)] text-muted hover:text-heading"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setChatFilter("DIRECT")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition flex items-center gap-1 ${
                  chatFilter === "DIRECT"
                    ? "bg-[var(--heading)] text-white"
                    : "bg-[var(--background-secondary)] text-muted hover:text-heading"
                }`}
              >
                Direct {unreadDirectCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />}
              </button>
              <button
                type="button"
                onClick={() => setChatFilter("TEAM")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition flex items-center gap-1 ${
                  chatFilter === "TEAM"
                    ? "bg-[var(--heading)] text-white"
                    : "bg-[var(--background-secondary)] text-muted hover:text-heading"
                }`}
              >
                Teams {unreadTeamCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />}
              </button>
            </div>
          </div>

          {/* Conversations List Scrollable */}
          <div className="flex-1 overflow-y-auto chat-scrollbar divide-y divide-border/40">
            {loadingMyChats || loadingProjectChats ? (
              <div className="p-8 text-center text-xs text-muted">Loading conversations...</div>
            ) : filteredChats.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare size={32} className="mx-auto text-muted opacity-30 mb-2" />
                <p className="text-xs text-muted">No conversations found</p>
              </div>
            ) : (
              <>
                {(chatFilter === "ALL" || chatFilter === "DIRECT") && directChats.length > 0 && (
                  <div>
                    <div className="px-3.5 pt-2.5 pb-1 flex items-center justify-between bg-black/[0.01]">
                      <span className="text-[10.5px] font-bold tracking-wider text-muted uppercase">
                        Direct Messages ({directChats.length})
                      </span>
                      {unreadDirectCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#D4AF37] text-black font-bold">
                          {unreadDirectCount} new
                        </span>
                      )}
                    </div>
                    <div>
                      {directChats.map((chat) => (
                        <ChatListRow key={chat.id} chat={chat} />
                      ))}
                    </div>
                  </div>
                )}

                {(chatFilter === "ALL" || chatFilter === "TEAM") && teamChats.length > 0 && (
                  <div>
                    <div className="px-3.5 pt-3 pb-1 flex items-center justify-between bg-black/[0.01]">
                      <span className="text-[10.5px] font-bold tracking-wider text-muted uppercase">
                        Project Teams ({teamChats.length})
                      </span>
                      {unreadTeamCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#D4AF37] text-black font-bold">
                          {unreadTeamCount} new
                        </span>
                      )}
                    </div>
                    <div>
                      {teamChats.map((chat) => (
                        <ChatListRow key={chat.id} chat={chat} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Main Panel: Active Chat Messages & Composer */}
        <div
          className={`flex-1 flex flex-col bg-[#FDFCFB] dark:bg-[var(--surface)] transition-all ${
            !mobileShowChat ? "hidden md:flex" : "flex"
          }`}
        >
          {activeChat ? (
            <>
              {/* WhatsApp-Style Chat Header */}
              <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-white dark:bg-[var(--surface)] shrink-0 shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setMobileShowChat(false)}
                    className="md:hidden p-1.5 rounded-md text-muted hover:text-heading hover:bg-black/[0.04]"
                  >
                    <ArrowLeft size={18} />
                  </button>

                  {/* Header Avatar */}
                  <div
                    onClick={() => !activeMeta.isTeam && setShowDetailsDrawer((v) => !v)}
                    className={`relative flex-shrink-0 ${!activeMeta.isTeam ? "cursor-pointer" : ""}`}
                    title={!activeMeta.isTeam ? "Click to view professional details" : undefined}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm overflow-hidden border border-border"
                      style={{ backgroundColor: "var(--background-secondary)", color: "var(--heading)" }}
                    >
                      {activeMeta.isTeam ? (
                        <Users size={18} style={{ color: "var(--primary)" }} />
                      ) : activeMeta.profileImageUrl ? (
                        <img
                          src={activeMeta.profileImageUrl}
                          alt={activeMeta.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <span>{activeMeta.initials}</span>
                      )}
                    </div>
                    {activeMeta.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  {/* Header Titles */}
                  <div
                    onClick={() => !activeMeta.isTeam && setShowDetailsDrawer((v) => !v)}
                    className={`min-w-0 ${!activeMeta.isTeam ? "cursor-pointer" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-heading text-[14.5px] truncate">
                        {activeMeta.title}
                      </h3>
                      {activeMeta.isTeam && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[var(--gold)] text-black">
                          Team Chat
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] text-muted truncate">
                      <span className={activeMeta.isOnline ? "text-emerald-600 font-medium" : "text-muted"}>
                        {activeMeta.isOnline ? "Online" : "Offline"}
                      </span>
                      {activeMeta.roleName && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-heading">{activeMeta.roleName}</span>
                        </>
                      )}
                      {activeMeta.profile?.experience > 0 && (
                        <>
                          <span>•</span>
                          <span>{activeMeta.profile.experience} yrs exp</span>
                        </>
                      )}
                      {activeMeta.projectTitle && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[200px]">{activeMeta.projectTitle}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-1 text-muted flex-shrink-0">
                  {!activeMeta.isTeam && (
                    <button
                      onClick={() => setShowDetailsDrawer((v) => !v)}
                      className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                        showDetailsDrawer
                          ? "bg-[#D4AF37] text-black shadow-xs"
                          : "hover:bg-black/[0.04] hover:text-heading bg-[var(--background-secondary)] text-heading"
                      }`}
                      title="Toggle Professional Profile Details"
                    >
                      <User size={15} />
                      <span className="hidden sm:inline">Profile</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Chat Body + Professional Details Drawer */}
              <div className="flex-1 flex overflow-hidden">
                {/* Messages Stream */}
                <div
                  className="flex-1 overflow-y-auto chat-scrollbar px-4 py-4 space-y-3"
                  style={{ backgroundColor: "var(--background-secondary)" }}
                >
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full text-xs text-muted">
                      Loading messages...
                    </div>
                  ) : localMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted">
                      <MessageSquare size={36} className="opacity-20 mb-2" />
                      <p className="text-xs font-semibold text-heading">Start the conversation</p>
                      <p className="text-[11px] text-muted max-w-xs mt-1">
                        Discuss project details, requirements, quotations, and milestone deliverables.
                      </p>
                    </div>
                  ) : (
                    messageGroups.map((item) => {
                      if (item.type === "divider") {
                        return (
                          <div key={item.key} className="flex items-center justify-center my-2">
                            <span className="text-[11px] font-medium px-3.5 py-1 rounded-full bg-white/90 dark:bg-[var(--surface)] text-[var(--muted)] shadow-xs border border-border/60 uppercase tracking-wide">
                              {item.label}
                            </span>
                          </div>
                        );
                      }

                      const msg = item.msg;
                      const isMine = msg.senderId === currentUserId;
                      const senderName = msg.sender?.name || (isMine ? "You" : activeMeta.title);

                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMine ? "justify-end" : "justify-start"} w-full`}
                        >
                          <div
                            className={`max-w-[85%] sm:max-w-[65%] rounded-2xl px-3.5 py-2 shadow-xs transition-all ${
                              isMine
                                ? "bg-[#FDF7E7] dark:bg-[#342D24] text-[var(--heading)] border border-[#EADBBD]/80 rounded-tr-xs"
                                : "bg-white dark:bg-[var(--surface)] text-[var(--heading)] border border-border/80 rounded-tl-xs"
                            }`}
                          >
                            {/* In Project Teams, show sender name for incoming message */}
                            {activeMeta.isTeam && !isMine && (
                              <p className="text-[11px] font-bold text-[var(--primary)] mb-0.5">
                                {senderName}
                              </p>
                            )}

                            {isAttachmentMessage(msg) ? (
                              <div className="space-y-2">
                                {msg.text && (
                                  <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap break-words">
                                    {msg.text}
                                  </p>
                                )}
                                {msg.attachments.map((att, i) => (
                                  <a
                                    key={i}
                                    href={att.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2.5 rounded-xl border border-border bg-white dark:bg-[var(--background-secondary)] p-2 hover:shadow-xs transition-shadow min-w-[200px]"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                                      {att.type || "FILE"}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="text-xs font-semibold text-heading truncate">
                                        {att.name || "Attachment"}
                                      </div>
                                      <div className="text-[10px] text-muted">{formatFileSize(att.size)}</div>
                                    </div>
                                    <Download size={15} className="text-muted flex-shrink-0" />
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap break-words">
                                {msg.text}
                              </p>
                            )}

                            {/* Message Timestamp and Delivery Status */}
                            <div className="flex items-center justify-end gap-1 mt-1 text-[10.5px] text-muted select-none">
                              <span>
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              {isMine && (
                                <span className="inline-flex items-center ml-0.5">
                                  {msg.isRead ? (
                                    <CheckCheck size={13} className="text-[#D4AF37]" />
                                  ) : msg.deliveredAt ? (
                                    <CheckCheck size={13} className="text-muted" />
                                  ) : (
                                    <Check size={13} className="text-muted" />
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
                    <div className="flex items-center gap-2 text-xs text-muted italic px-2 py-1 bg-white/70 rounded-full w-fit shadow-xs">
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

                {/* Professional Details Side Drawer */}
                {showDetailsDrawer && !activeMeta.isTeam && (
                  <div className="w-80 max-w-sm border-l border-border bg-white p-4.5 flex flex-col overflow-y-auto chat-scrollbar overflow-x-hidden space-y-4 flex-shrink-0 animate-in slide-in-from-right-4 duration-200 shadow-sm">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                      <h4 className="font-bold text-heading text-xs uppercase tracking-wider">
                        Professional Profile
                      </h4>
                      <button
                        onClick={() => setShowDetailsDrawer(false)}
                        className="p-1 rounded-md text-muted hover:text-heading hover:bg-black/[0.04]"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="flex flex-col items-center text-center pb-3 border-b border-border">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg overflow-hidden mb-2 border-2 border-[var(--gold)] shadow-xs"
                        style={{ backgroundColor: "var(--background-secondary)", color: "var(--heading)" }}
                      >
                        {activeMeta.profileImageUrl ? (
                          <img
                            src={activeMeta.profileImageUrl}
                            alt={activeMeta.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <span>{activeMeta.initials}</span>
                        )}
                      </div>
                      <h4 className="font-bold text-heading text-base">{activeMeta.title}</h4>
                      {activeMeta.roleName && (
                        <span className="mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#D4AF37] text-black">
                          {activeMeta.roleName}
                        </span>
                      )}
                    </div>

                    {/* Role-Specific Profile Schema Info */}
                    {activeMeta.profile ? (
                      <div className="space-y-3 text-xs">
                        {activeMeta.profile.bio && (
                          <div>
                            <span className="font-semibold text-heading block mb-0.5">About</span>
                            <p className="text-muted leading-relaxed whitespace-pre-wrap break-words overflow-hidden" style={{ overflowWrap: "anywhere" }}>
                              {activeMeta.profile.bio}
                            </p>
                          </div>
                        )}

                        {activeMeta.profile.specialization && (
                          <div>
                            <span className="font-semibold text-heading block mb-1">Specialization</span>
                            <div className="flex flex-wrap gap-1">
                              {String(activeMeta.profile.specialization)
                                .split(",")
                                .map((s, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 rounded-md bg-[var(--background-secondary)] text-heading font-medium text-[11px]"
                                  >
                                    {s.trim()}
                                  </span>
                                ))}
                            </div>
                          </div>
                        )}

                        {activeMeta.profile.experience != null && (
                          <div className="flex justify-between py-1.5 border-b border-border/50">
                            <span className="text-muted">Experience</span>
                            <span className="font-semibold text-heading">
                              {activeMeta.profile.experience} years
                            </span>
                          </div>
                        )}

                        {activeMeta.profile.licenseNumber && (
                          <div className="py-1.5 border-b border-border/50">
                            <span className="text-muted block mb-0.5">License / Reg. No.</span>
                            <span className="font-semibold text-heading font-mono text-[11px] break-all block">
                              {activeMeta.profile.licenseNumber}
                            </span>
                          </div>
                        )}

                        {Array.isArray(activeMeta.profile.serviceCities) && activeMeta.profile.serviceCities.length > 0 && (
                          <div>
                            <span className="font-semibold text-heading block mb-1">Service Locations</span>
                            <div className="flex flex-wrap gap-1">
                              {activeMeta.profile.serviceCities.map((city, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-md bg-black/[0.03] text-muted text-[11px] flex items-center gap-1"
                                >
                                  <MapPin size={10} /> {city}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {activeMeta.profile.rating != null && (
                          <div className="flex justify-between py-1.5 border-b border-border/50">
                            <span className="text-muted">Rating & Reviews</span>
                            <span className="font-semibold text-heading text-amber-600 flex items-center gap-1">
                              <Star size={12} className="fill-amber-500 text-amber-500" />
                              {activeMeta.profile.rating} ({activeMeta.profile.totalReviews || 0} reviews)
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted text-center italic py-2">
                        Professional verified profile loaded from schema.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Message Composer (Bottom Bar) */}
              <div className="px-4 py-3 border-t border-border bg-white dark:bg-[var(--surface)] shrink-0">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-2"
                >
                  <div className="flex-1 flex items-center gap-2 rounded-full bg-[var(--background-secondary)] px-4 py-1.5 focus-within:ring-2 focus-within:ring-[var(--gold)]/30 focus-within:bg-white transition border border-transparent focus-within:border-[var(--gold)]">
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
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent text-sm text-heading py-1 resize-none focus:outline-none max-h-24 overflow-y-auto chat-scrollbar"
                    />
                    <button
                      type="button"
                      className="text-muted hover:text-heading transition flex-shrink-0"
                      title="Insert emoji"
                    >
                      <Smile size={18} />
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="w-9 h-9 rounded-full text-white disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center flex-shrink-0 shadow-xs"
                    style={{ backgroundColor: "var(--heading)" }}
                    title="Send message"
                  >
                    <Send size={15} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            /* No Chat Selected Placeholder */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-[var(--surface)]">
              <div className="w-16 h-16 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-3">
                <MessageSquare size={28} className="text-[var(--gold)]" />
              </div>
              <h3
                className="text-lg font-bold text-heading"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Select a Conversation
              </h3>
              <p className="text-xs text-muted max-w-xs mt-1 leading-relaxed">
                Choose a project team chat or professional negotiation from the sidebar to view and send messages.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}