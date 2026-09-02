  import { useState, useEffect } from "react"
  import { Navigate, Outlet, useLocation } from "react-router-dom"
  import Sidebar from "./Sidebar"
  import Header from "./Header"
  import { getStoredUser } from "./roleNavConfig"
  import { getSocket } from "../../utils/socketService"
  import "../../theme.css"

  const PAGE_TITLES = {
    "/dashboard": "Overview",
    "/dashboard/projects": "Projects",
    "/dashboard/find": "Find a Pro",
    "/dashboard/messages": "Messages",
    "/dashboard/payments": "Payments",
    "/dashboard/portfolio": "Portfolio",
    "/dashboard/proposals": "Proposals",
    "/dashboard/documents": "License & Documents",
    "/dashboard/earnings": "Earnings",
    "/dashboard/settings": "Settings",
  }

  export default function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false)
    const location = useLocation()
    const user = getStoredUser()

    useEffect(() => {
      if (user) {
        getSocket();
      }
    }, [user]);

    // Belt-and-suspenders: PrivateRoute already blocks unauthenticated access,
    // but this keeps DashboardLayout safe if it's ever rendered on its own.
    if (!user) {
      return <Navigate to="/Signin" replace />
    }

    const title = PAGE_TITLES[location.pathname] || "Dashboard"

    return (
      <div className="min-h-screen w-full" style={{ backgroundColor: "var(--background)" }}>
        <Sidebar role={user.role} collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        <Header user={user} sidebarCollapsed={collapsed} title={title} />
        <main className={`pt-20 min-h-screen transition-all duration-300 ${collapsed ? "pl-[76px]" : "pl-64"}`}>
          <div className="p-2">
            <Outlet context={{ user }} />
          </div>
        </main>
      </div>
    )
  }

