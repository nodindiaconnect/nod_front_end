import { createContext, useContext, useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("nod_theme");
      if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
      }
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    } catch {
      // fallback
    }
    return "dark"; // Default to premium dark mode for Night Owl Designers
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
    try {
      localStorage.setItem("nod_theme", theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setTheme = (newTheme) => {
    if (newTheme === "dark" || newTheme === "light") {
      setThemeState(newTheme);
    }
  };

  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeToggle({ className = "", size = "md", showLabel = false }) {
  const { isDark, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-9 h-9",
    lg: "w-10 h-10",
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`relative inline-flex items-center justify-center rounded-full border transition-all duration-300 cursor-pointer ${
        isDark
          ? "bg-[#1f2633] border-[#323d50] text-[#f4d068] hover:bg-[#283244] hover:border-[#dfb23b] shadow-[0_0_12px_rgba(223,178,59,0.2)]"
          : "bg-[#f4efe8] border-[#e0d6ca] text-[#4a3428] hover:bg-[#ebe2d4] hover:border-[#c69234] shadow-sm"
      } ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      <span className="relative flex items-center justify-center">
        {isDark ? (
          <Sun
            size={iconSizes[size] || 18}
            className="transition-transform duration-300 rotate-0 hover:rotate-45"
            strokeWidth={2.2}
          />
        ) : (
          <Moon
            size={iconSizes[size] || 18}
            className="transition-transform duration-300 -rotate-12 hover:rotate-0"
            strokeWidth={2.2}
          />
        )}
      </span>
      {showLabel && (
        <span className="ml-2 text-xs font-semibold uppercase tracking-wider">
          {isDark ? "Light" : "Dark"}
        </span>
      )}
    </button>
  );
}

export default ThemeContext;
