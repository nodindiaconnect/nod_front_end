import { NavLink } from "react-router-dom"
import { Menu, X, UserRound } from "lucide-react"
import logo from "../../assets/logo.png"
import { NAV_CONFIG, ROLE_NAMES } from "./roleNavConfig"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { chatApiSlice, useGetMyChatsQuery } from "../../ApiSliceComponent/chatApiSlice";
import { useGlobalChatNotifications } from "../../utils/socketService";

export default function Sidebar({ role, collapsed, onToggle }) {
  const navItems = NAV_CONFIG[role] || []
  const roleLabel = ROLE_NAMES[role] || "Account"

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: myChatsRes, refetch: refetchChats } = useGetMyChatsQuery(undefined, {
    pollingInterval: 30000,
  });

  const handleGlobalNewMessage = useCallback((data) => {
    const message = data.message || data;
    const chatId = data.chatId || message?.chatId;
    if (!chatId) return;

    // Optimistically update RTK Query cache so badge increments instantly
    dispatch(
      chatApiSlice.util.updateQueryData("getMyChats", undefined, (draft) => {
        if (!draft || !Array.isArray(draft.data)) return;
        const targetChat = draft.data.find((c) => c.id === chatId);
        if (targetChat) {
          targetChat.unreadCount = (targetChat.unreadCount || 0) + 1;
          targetChat.updatedAt = new Date().toISOString();
          if (message) {
            targetChat.messages = [message];
          }
        }
      })
    );

    // Sync with backend source of truth
    refetchChats();
  }, [dispatch, refetchChats]);

  const handleGlobalUnreadUpdate = useCallback(() => {
    refetchChats();
  }, [refetchChats]);

  // Connect & listen to WebSocket notifications globally on dashboard
  useGlobalChatNotifications({
    onNewMessage: handleGlobalNewMessage,
    onUnreadUpdate: handleGlobalUnreadUpdate,
  });

  const totalUnreadCount = (Array.isArray(myChatsRes?.data) ? myChatsRes.data : []).reduce(
    (acc, c) => acc + (c.unreadCount || 0),
    0
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/Signin", { replace: true });
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 flex flex-col border-r transition-all duration-300 ${collapsed ? "w-16" : "w-64"
        }`}
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
    >
      {/* Logo + hamburger */}
      <div
        className="flex items-center gap-3 px-5 h-20 border-b shrink-0"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="w-9 h-9 rounded-full border flex items-center justify-center shrink-0"
          style={{ borderColor: "var(--gold)", backgroundColor: "rgba(212,175,55,0.08)" }}
        >
          <img src={logo} alt="Logo" className="w-9 h-9 rounded-full object-cover" />
        </div>

        {!collapsed && (
          <div className="leading-tight overflow-hidden flex-1">
            <p className="text-sm font-semibold tracking-wide truncate" style={{ color: "var(--heading)" }}>
              Night Owl
            </p>
            <p className="text-[9px] tracking-[0.25em] uppercase truncate" style={{ color: "var(--muted)" }}>
              Designers
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`w-9 h-9 shrink-0 rounded-sm flex items-center justify-center transition-colors ] ${collapsed ? "mx-auto" : ""
            }`}
          style={{ color: "var(--muted)" }}
        >
          {collapsed ? <Menu size={20} strokeWidth={1.75} /> : <X size={18} strokeWidth={1.75} />}
        </button>
      </div>

      {/* Role badge — icon only when collapsed, icon + text when open */}
      <div className={`px-5 pt-5 pb-2 flex ${collapsed ? "justify-center px-0" : ""}`}>
        <span
          className={`inline-flex items-center gap-1.5 rounded-sm text-[10px] uppercase tracking-[0.2em] ${collapsed ? "w-9 h-9 justify-center p-0" : "px-3 py-1"
            }`}
          style={{ backgroundColor: "rgba(212,175,55,0.1)", color: "var(--gold)" }}
          title={collapsed ? roleLabel : undefined}
        >
          <UserRound size={collapsed ? 16 : 12} strokeWidth={2} />
          {!collapsed && roleLabel}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isMessages = item.label === "Messages" || item.path?.includes("/messages");

          // Handle logout button separately
          if (item.action === "logout") {
            return (
              <button
                key={item.label}
                onClick={handleLogout}
                className={`flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors duration-200 ${collapsed ? "justify-center" : ""}`}
                style={{ color: "var(--text)" }}
                title={collapsed ? item.label : undefined}
              >
                {Icon && <Icon size={18} strokeWidth={1.75} className="shrink-0" />}
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          }

          // Regular NavLink for other items
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors duration-200 relative ${collapsed ? "justify-center" : ""
                } ${!isActive ? "hover:bg-[var(--background-secondary)]" : ""}`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? "rgba(212,175,55,0.12)" : "transparent",
                color: isActive ? "var(--gold)" : "var(--text)",
                fontWeight: isActive ? 600 : 400,
              })}
              title={collapsed ? item.label : undefined}
            >
              <div className="relative flex items-center justify-center shrink-0">
                {Icon && <Icon size={18} strokeWidth={1.75} />}
                {isMessages && totalUnreadCount > 0 && collapsed && (
                  <span className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 rounded-full text-[9.5px] font-bold bg-[#D4AF37] text-black flex items-center justify-center shadow-xs">
                    {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
                  </span>
                )}
              </div>
              {!collapsed && <span className="truncate flex-1">{item.label}</span>}
              {!collapsed && isMessages && totalUnreadCount > 0 && (
                <span className="ml-auto px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-[#D4AF37] text-black shadow-xs">
                  {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}