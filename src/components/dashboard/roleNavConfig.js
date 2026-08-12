import {
  Home,
  FolderKanban,
  Search,
  MessageSquare,
  CreditCard,
  Settings,
  Image,
  FileText,
  Wallet,
  LogOut,
  Wrench,
  FileSignature,
  Bell,
  Star,
} from "lucide-react"

// Role names now come directly from the backend as strings
export const ROLE_NAMES = {
  Client: "Client",
  Designer: "Designer",
  Architect: "Architect",
  Contractor: "Contractor",
  MaterialSupplier: "Material Supplier",
}

export const NAV_CONFIG = {
  Client: [
    { label: "Dashboard", path: "/dashboard", icon: Home, end: true },
    { label: "My Projects", path: "/dashboard/projects", icon: FolderKanban },
    { label: "Quotations", path: "/dashboard/find", icon: Search },
    { label: "Chat", path: "/dashboard/messages", icon: MessageSquare },
    { label: "Payments", path: "/dashboard/payments", icon: CreditCard },
    { label: "Reviews", path: "/dashboard/reviews", icon: Star },
    { label: "Logout", action: "logout", icon: LogOut },
  ],
  Designer: [
    { label: "Dashboard", path: "/dashboard", icon: Home, end: true },
    { label: "Browse Projects", path: "/dashboard/browse-projects", icon: Image },
    { label: "CreatePosts", path: "/dashboard/posts", icon: FileSignature },
    { label: "Active Projects", path: "/dashboard/projects", icon: FolderKanban },
    { label: "Messages", path: "/dashboard/messages", icon: MessageSquare },
    { label: "Earnings", path: "/dashboard/earnings", icon: Wallet },
    { label: "Reviews", path: "/dashboard/reviews", icon: Star },
    { label: "Logout", action: "logout", icon: LogOut },
  ],
  Architect: [
    { label: "Dashboard", path: "/dashboard", icon: Home, end: true },
    { label: "Browse Projects", path: "/dashboard/browse-projects", icon: Image },
    { label: "Active Projects", path: "/dashboard/projects", icon: FolderKanban },
    { label: "Messages", path: "/dashboard/messages", icon: MessageSquare },
    { label: "Earnings", path: "/dashboard/earnings", icon: Wallet },
    { label: "Reviews", path: "/dashboard/reviews", icon: Star },
    { label: "Logout", action: "logout", icon: LogOut },
  ],
  Contractor: [
    { label: "Dashboard", path: "/dashboard", icon: Home, end: true },
    { label: "Browse Projects", path: "/dashboard/browse-projects", icon: Image },
    { label: "Active Jobs", path: "/dashboard/projects", icon: Wrench },
    { label: "Bids & Quotes", path: "/dashboard/proposals", icon: FileSignature },
    { label: "Messages", path: "/dashboard/messages", icon: MessageSquare },
    { label: "Payments", path: "/dashboard/earnings", icon: Wallet },
    { label: "Earnings", path: "/dashboard/earnings", icon: Wallet },
    { label: "Reviews", path: "/dashboard/reviews", icon: Star },
    { label: "Logout", action: "logout", icon: LogOut },
  ],
  MaterialSupplier: [
    { label: "Dashboard", path: "/dashboard", icon: Home, end: true },
    { label: "Products", path: "/dashboard/products", icon: Image },
    { label: "Create Product", path: "/dashboard/products/create", icon: FileText },
    { label: "Logout", action: "logout", icon: LogOut },
  ],
}

// Reads the logged-in user out of localStorage (set during login/account creation)
export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("userData") || "null")
  } catch {
    return null
  }
}