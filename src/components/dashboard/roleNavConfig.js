

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

// Role codes match the backend enum: 1=Client, 2=Designer, 3=Architect, 4=Contractor
export const ROLE_NAMES = {
  1: "Client",
  2: "Designer",
  3: "Architect",
  4: "Contractor",
  5: "Material Supplier",
}

export const NAV_CONFIG = {
  1: [ // Client
    { label: "Dashboard", path: "/dashboard", icon: Home, end: true },
    { label: "My Projects", path: "/dashboard/projects", icon: FolderKanban },
    { label: "Quotations", path: "/dashboard/find", icon: Search },
    { label: "Chat", path: "/dashboard/messages", icon: MessageSquare },
    { label: "Payments", path: "/dashboard/payments", icon: CreditCard },
    { label: "Reviews", path: "/dashboard/reviews", icon: Star },
    { label: "Logout", action: "logout", icon: LogOut },

  ],
  2: [ // Designer
    { label: "Dashboard", path: "/dashboard", icon: Home, end: true },
    { label: "Browse Projects", path: "/dashboard/browse-projects", icon: Image },
    // { label: "Portfolio", path: "/dashboard/portfolio", icon: Image },
    // { label: "Proposals", path: "/dashboard/proposals", icon: FileSignature },
    { label: "Active Projects", path: "/dashboard/projects", icon: FolderKanban },
    { label: "Messages", path: "/dashboard/messages", icon: MessageSquare },
    { label: "Earnings", path: "/dashboard/earnings", icon: Wallet },
    { label: "Reviews", path: "/dashboard/reviews", icon: Star },
    { label: "Logout", action: "logout", icon: LogOut },

  ],
  3: [ // Architect
    { label: "Dashboard", path: "/dashboard", icon: Home, end: true },
    { label: "Browse Projects", path: "/dashboard/browse-projects", icon: Image },
    // { label: "Portfolio", path: "/dashboard/portfolio", icon: Image },
    // { label: "Proposals", path: "/dashboard/proposals", icon: FileSignature },
    { label: "Active Projects", path: "/dashboard/projects", icon: FolderKanban },
    { label: "Messages", path: "/dashboard/messages", icon: MessageSquare },
    { label: "Earnings", path: "/dashboard/earnings", icon: Wallet },
    { label: "Reviews", path: "/dashboard/reviews", icon: Star },
    { label: "Logout", action: "logout", icon: LogOut },

  ],
  4: [ // Contractor
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

  5: [ // Material Supplier
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


