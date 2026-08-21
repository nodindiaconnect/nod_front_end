import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { useEffect, useRef, useState, useCallback } from "react";

let socket = null;

const getChatServerUrl = () => {
  if (import.meta.env.VITE_API_CHAT_URL) {
    return import.meta.env.VITE_API_CHAT_URL;
  }
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
  return apiBase.replace(/\/api\/?$/, "");
};

/**
 * Get or create singleton authenticated socket connection
 */
export const getSocket = () => {
  const token = Cookies.get("token") || "";

  if (!token) {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    return null;
  }

  if (socket && socket.connected) {
    return socket;
  }

  if (!socket) {
    const serverUrl = getChatServerUrl();
    console.log("[SocketService] Connecting to:", serverUrl);

    socket = io(serverUrl, {
      auth: { token },
      query: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
      timeout: 20000,
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("[SocketService] Connected successfully with ID:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.warn("[SocketService] Connection error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("[SocketService] Disconnected:", reason);
    });
  }

  return socket;
};

/**
 * Disconnect socket on logout
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("[SocketService] Disconnected and destroyed socket instance");
  }
};

/**
 * React hook to manage real-time Socket.IO chat connection
 */
export function useSocketChat({
  chatId = null,
  projectId = null,
  onMessageReceived = null,
  onMessageDelivered = null,
  onMessageRead = null,
} = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Map()); // userId -> name
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const s = getSocket();
    if (!s) return;

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    setIsConnected(s.connected);

    s.on("connect", handleConnect);
    s.on("disconnect", handleDisconnect);

    // Join room for this chat / project
    if (chatId || projectId) {
      s.emit("join_project", { chatId, projectId }, (ack) => {
        if (ack?.success) {
          console.log(`[useSocketChat] Joined room for chat:${chatId || "none"} project:${projectId || "none"}`);
        }
      });
    }

    // Message receipt
    const handleReceiveMessage = (data) => {
      if (!data) return;
      const incomingChatId = data.chatId || data.message?.chatId;
      if (!chatId || incomingChatId === chatId) {
        if (onMessageReceived) onMessageReceived(data.message || data);

        // Send delivery receipt back
        if (data.message?.id) {
          s.emit("message_delivered", {
            messageId: data.message.id,
            chatId: incomingChatId,
          });
        }
      }
    };

    // Delivery confirmation
    const handleDelivered = (data) => {
      if (onMessageDelivered) onMessageDelivered(data);
    };

    // Read confirmation
    const handleRead = (data) => {
      if (onMessageRead) onMessageRead(data);
    };

    // Typing start
    const handleTypingStart = (data) => {
      if (data?.chatId === chatId && data?.userId) {
        setTypingUsers((prev) => {
          const next = new Map(prev);
          next.set(data.userId, data.name || "Someone");
          return next;
        });
      }
    };

    // Typing stop
    const handleTypingStop = (data) => {
      if (data?.chatId === chatId && data?.userId) {
        setTypingUsers((prev) => {
          const next = new Map(prev);
          next.delete(data.userId);
          return next;
        });
      }
    };

    // User online status
    const handleUserOnline = (data) => {
      if (data?.userId) {
        setOnlineUsers((prev) => new Set([...prev, data.userId]));
      }
    };

    const handleUserOffline = (data) => {
      if (data?.userId) {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          next.delete(data.userId);
          return next;
        });
      }
    };

    s.on("receive_message", handleReceiveMessage);
    s.on("message_delivered", handleDelivered);
    s.on("message_read", handleRead);
    s.on("typing_start", handleTypingStart);
    s.on("typing_stop", handleTypingStop);
    s.on("user_online", handleUserOnline);
    s.on("user_offline", handleUserOffline);

    return () => {
      if (chatId || projectId) {
        s.emit("leave_project", { chatId, projectId });
      }
      s.off("connect", handleConnect);
      s.off("disconnect", handleDisconnect);
      s.off("receive_message", handleReceiveMessage);
      s.off("message_delivered", handleDelivered);
      s.off("message_read", handleRead);
      s.off("typing_start", handleTypingStart);
      s.off("typing_stop", handleTypingStop);
      s.off("user_online", handleUserOnline);
      s.off("user_offline", handleUserOffline);
    };
  }, [chatId, projectId, onMessageReceived, onMessageDelivered, onMessageRead]);

  // Emitters
  const emitSendMessage = useCallback(
    (text, attachments = [], callback) => {
      const s = getSocket();
      if (!s || !chatId) {
        if (callback) callback({ success: false, error: "Socket not connected" });
        return;
      }

      s.emit("send_message", { chatId, text, attachments }, (res) => {
        if (callback) callback(res);
      });
    },
    [chatId]
  );

  const emitMarkRead = useCallback(
    (messageId = null) => {
      const s = getSocket();
      if (!s || !chatId) return;
      s.emit("message_read", { chatId, messageId });
    },
    [chatId]
  );

  const emitTyping = useCallback(() => {
    const s = getSocket();
    if (!s || !chatId) return;

    s.emit("typing_start", { chatId });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      s.emit("typing_stop", { chatId });
    }, 2500);
  }, [chatId]);

  const emitStopTyping = useCallback(() => {
    const s = getSocket();
    if (!s || !chatId) return;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    s.emit("typing_stop", { chatId });
  }, [chatId]);

  return {
    isConnected,
    typingUsers: Array.from(typingUsers.values()),
    onlineUsers,
    emitSendMessage,
    emitMarkRead,
    emitTyping,
    emitStopTyping,
  };
}
