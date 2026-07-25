import { NavLink } from "react-router-dom"
import { Menu, X, UserRound } from "lucide-react"
import logo from "../../assets/logo.png"
import { NAV_CONFIG, ROLE_NAMES } from "./roleNavConfig"
import { useNavigate } from "react-router-dom";

export default function Sidebar({ role, collapsed, onToggle }) {
  const navItems = NAV_CONFIG[role] || []
  const roleLabel = ROLE_NAMES[role] || "Account"

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    // remove any other auth data if you store it
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
                `flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors duration-200 ${collapsed ? "justify-center" : ""
                } ${!isActive ? "hover:bg-[var(--background-secondary)]" : ""}`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? "rgba(212,175,55,0.12)" : "transparent",
                color: isActive ? "var(--gold)" : "var(--text)",
                fontWeight: isActive ? 600 : 400,
              })}
              title={collapsed ? item.label : undefined}
            >
              {Icon && <Icon size={18} strokeWidth={1.75} className="shrink-0" />}
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}