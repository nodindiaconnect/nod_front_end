import { Navigate, useLocation } from "react-router-dom"
import { getStoredUser, normalizeRole } from "../components/dashboard/roleNavConfig"

export default function RoleSwitch({ map }) {
  const location = useLocation()
  const user = getStoredUser()
  const role = normalizeRole(user?.role)
  const Component = map?.[role]

  if (!Component) {
    const isDashboardRoot =
      location.pathname === "/dashboard" || location.pathname === "/dashboard/"
    if (isDashboardRoot) {
      const FallbackComponent = map?.Client || (map ? Object.values(map)[0] : null)
      if (FallbackComponent) return <FallbackComponent />
      return (
        <div className="p-8 text-center text-sm text-[var(--muted)]">
          Dashboard not available for this role.
        </div>
      )
    }
    return <Navigate to="/dashboard" replace />
  }

  return <Component />
}


