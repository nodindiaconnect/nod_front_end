import Cookies from "js-cookie"

// Reads the user object saved during login/account creation
export const getCurrentUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem("userData") || "null")
    if (user && !user.token) {
      const fallbackToken = Cookies.get("token") || localStorage.getItem("token")
      if (fallbackToken) user.token = fallbackToken
    }
    return user
  } catch {
    return null
  }
}

// True if there's a stored user and an auth token exists
export const isAuthenticated = () => {
  const user = getCurrentUser()
  const token = user?.token || Cookies.get("token") || localStorage.getItem("token")
  return !!(user && token)
}

export const logoutUser = () => {
  localStorage.removeItem("userData")
  localStorage.removeItem("token")
  Cookies.remove("token")
}