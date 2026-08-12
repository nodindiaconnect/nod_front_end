// import { Navigate, Outlet } from "react-router-dom"
// import { isAuthenticated } from "../utils/auth"

// // Wrap around <Route> for pages like /login.
// // Pass `restricted` to bounce already-logged-in users straight to their dashboard.
// export default function PublicRoute({ restricted = false }) {
//   if (restricted && isAuthenticated()) {
//     return <Navigate to="/dashboard" replace />
//   }

//   return <Outlet />
// }



import { Navigate, Outlet } from "react-router-dom"
import { isAuthenticated } from "../utils/auth"

// Wrap around <Route> for pages like /login.
// Pass `restricted` to bounce already-logged-in users away (e.g. off the signin page).
export default function PublicRoute({ restricted = false }) {
  if (restricted && isAuthenticated()) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

