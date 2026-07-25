import { Navigate, Outlet, useLocation } from "react-router-dom"
import { isAuthenticated } from "../utils/auth"

// Wrap around any <Route> that should only be reachable when logged in.
// Remembers where the user was headed so login can send them back.
export default function PrivateRoute() {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to="/Signin" replace state={{ from: location }} />
  }

  return <Outlet />
}