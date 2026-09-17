import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { disconnectSocket } from "../../utils/socketService";
import { ROLE_NAMES } from "./roleNavConfig";

export default function Header({
  user,
  sidebarCollapsed,
  title = "Dashboard",
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const roleLabel = ROLE_NAMES[user?.role] || "Account";
  const displayName = user?.name || user?.username || "there";
  const initials = displayName.slice(0, 2).toUpperCase();

  // Auto close menu after 10 seconds
  useEffect(() => {
    if (!menuOpen) return;

    const timer = setTimeout(() => {
      setMenuOpen(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, [menuOpen]);

  const handleLogout = () => {
    disconnectSocket();
    Cookies.remove("token");
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/Signin");
  };

  return (
    <header
      className={`fixed top-0 right-0 z-10 flex items-center justify-between h-20 px-6 border-b transition-all duration-300 ${
        sidebarCollapsed ? "left-[76px]" : "left-64"
      }`}
      style={{
        backgroundColor: "var(--background)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex flex-col justify-center">
        <h1
          className="text-xl font-light leading-tight"
          style={{
            color: "var(--heading)",
            fontFamily: "var(--font-heading)",
          }}
        >
          {title}
        </h1>

        <p
          className="text-[11px] uppercase tracking-[0.2em] leading-tight"
          style={{
            color: "var(--muted)",
          }}
        >
          {roleLabel} Dashboard
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{
                backgroundColor: "var(--gold)",
                color: "var(--primary)",
              }}
            >
               {initials}
            </div>
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 border shadow-lg py-2 z-30 rounded-tl-md rounded-br-md"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <p
                className="px-4 py-2 text-sm truncate"
                style={{ color: "var(--heading)" }}
              >
                {displayName}
              </p>

              <div
                className="h-px"
                style={{ backgroundColor: "var(--border)" }}
              />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm hover:bg-black/5"
                style={{ color: "#c0392b" }}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}