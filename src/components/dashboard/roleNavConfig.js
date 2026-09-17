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
  User,
  Star,
} from "lucide-react"

// Role normalization to map backend codes/variants to standard keys
export const normalizeRole = (role) => {
  if (!role && role !== 0) return ""
  const r = String(role).trim()
  if (r === "1" || r.toLowerCase() === "client") return "Client"
  if (
    r === "2" ||
    r.toLowerCase() === "designer" ||
    r.toLowerCase() === "interiordesigner" ||
    r.toLowerCase() === "interior_designer" ||
    r.toLowerCase() === "interior designer"
  ) {
    return "Designer"
  }
  if (r === "3" || r.toLowerCase() === "architect") return "Architect"
  if (r === "4" || r.toLowerCase() === "contractor") return "Contractor"
  if (
    r === "5" ||
    r.toLowerCase() === "materialsupplier" ||
    r.toLowerCase() === "material_supplier" ||
    r.toLowerCase() === "material supplier" ||
    r.toLowerCase() === "supplier"
  ) {
    return "MaterialSupplier"
  }
  return r
}

export const ROLE_NAMES = {
  Client: "Client",
  Designer: "Designer",
  DESIGNER: "Designer",
  INTERIOR_DESIGNER: "Designer",
  Architect: "Architect",
  Contractor: "Contractor",
  MaterialSupplier: "Material Supplier",
}

export const NAV_CONFIG = {
  Client: [
    { label: "Dashboard", path: "/dashboard", icon: Home, end: true },
    { label: "My Projects", path: "/dashboard/projects", icon: FolderKanban },
    { label: "Find Specialists", path: "/dashboard/find", icon: Search },
    { label: "Chat", path: "/dashboard/messages", icon: MessageSquare },
    { label: "Payments & Escrow", path: "/dashboard/payments", icon: CreditCard },
    { label: "Reviews", path: "/dashboard/reviews", icon: Star },
    { label: "Settings", path: "/dashboard/settings", icon: Settings },
    { label: "Logout", action: "logout", icon: LogOut },
  ],
  Designer: [
    { label: "Dashboard", path: "/dashboard", icon: Home, end: true },
    { label: "Browse Projects", path: "/dashboard/browse-projects", icon: Image },
    { label: "Portfolio & Posts", path: "/dashboard/posts", icon: FileSignature },
    { label: "Active Projects", path: "/dashboard/projects", icon: FolderKanban },
    { label: "Messages", path: "/dashboard/messages", icon: MessageSquare },
    { label: "Earnings", path: "/dashboard/earnings", icon: Wallet },
    { label: "My Profile", path: "/dashboard/myprofile", icon: User },
    { label: "Reviews", path: "/dashboard/reviews", icon: Star },
    { label: "Settings", path: "/dashboard/settings", icon: Settings },
    { label: "Logout", action: "logout", icon: LogOut },
  ],
  Architect: [
    { label: "Dashboard", path: "/dashboard", icon: Home, end: true },
    { label: "Browse Projects", path: "/dashboard/browse-projects", icon: Image },
    { label: "Portfolio & Posts", path: "/dashboard/posts", icon: FileSignature },
    { label: "Active Projects", path: "/dashboard/projects", icon: FolderKanban },
    { label: "Messages", path: "/dashboard/messages", icon: MessageSquare },
    { label: "Earnings", path: "/dashboard/earnings", icon: Wallet },
    { label: "My Profile", path: "/dashboard/myprofile", icon: User },
    { label: "Reviews", path: "/dashboard/reviews", icon: Star },
    { label: "Settings", path: "/dashboard/settings", icon: Settings },
    { label: "Logout", action: "logout", icon: LogOut },
  ],
  Contractor: [
    { label: "Dashboard", path: "/dashboard", icon: Home, end: true },
    { label: "Browse Projects", path: "/dashboard/browse-projects", icon: Image },
    { label: "Portfolio & Posts", path: "/dashboard/posts", icon: FileSignature },
    { label: "Active Jobs", path: "/dashboard/projects", icon: Wrench },
    { label: "Bids & Quotes", path: "/dashboard/proposals", icon: FileSignature },
    { label: "Messages", path: "/dashboard/messages", icon: MessageSquare },
    { label: "Earnings", path: "/dashboard/earnings", icon: Wallet },
    { label: "My Profile", path: "/dashboard/myprofile", icon: User },
    { label: "Reviews", path: "/dashboard/reviews", icon: Star },
    { label: "Settings", path: "/dashboard/settings", icon: Settings },
    { label: "Logout", action: "logout", icon: LogOut },
  ],
  MaterialSupplier: [
    { label: "Dashboard", path: "/dashboard", icon: Home, end: true },
    { label: "Products & Portfolio", path: "/dashboard/products", icon: Image },
    { label: "Upload Product", path: "/dashboard/products/create", icon: FileText },
    { label: "Messages", path: "/dashboard/messages", icon: MessageSquare },
    { label: "My Profile", path: "/dashboard/myprofile", icon: User },
    { label: "Settings", path: "/dashboard/settings", icon: Settings },
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