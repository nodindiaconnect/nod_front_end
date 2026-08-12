import { useState, useEffect, useRef } from "react";
import { Menu, X, LayoutDashboard, User, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button/button";
import logo from "../assets/logo.png";

// Clears all client-side auth state (same behaviour as Karrivo's navbar)
const clearAllData = () => {
  localStorage.clear();
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0].trim();
    document.cookie = `${name}=; path=/; max-age=0`;
  });
  sessionStorage.clear();
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  const navLinks = [
    { label: "DESIGNS", target: "projects" },
    { label: "SERVICES", target: "services" },
    // { label: "PORTFOLIO", target: "/portfolios", route: true },
    { label: "ABOUT", target: "/about", route: true },
    { label: "CONTACT", target: "/contact", route: true },
    { label: "SUPPLIERS", target: "/supplier-products", route: true },
  ];

  // --- Real auth state, read straight from localStorage ---
  const getUserData = () => {
    try {
      return JSON.parse(localStorage.getItem("userData") || "null");
    } catch {
      return null;
    }
  };

  const userData = getUserData();
  const isLoggedIn = !!userData?.token;

  const getInitials = () =>
    userData?.name
      ? userData.name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase()
      : "U";

  const initials = getInitials();

  // Track which section is currently in view and "bookmark" it as active
  useEffect(() => {
    const sectionIds = navLinks
      .filter((link) => !link.route)
      .map((link) => link.target);
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -50% 0px", // triggers when section is roughly centered
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setActiveSection(targetId);

    const element = document.getElementById(targetId);

    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const goDashboard = () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate("/dashboard");
  };

  const goProfile = () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate("/profile");
  };

  const handleLogout = () => {
    clearAllData();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    setTimeout(() => {
      window.location.href = "/Signin";
    }, 100);
  };

  return (
    <header className="absolute top-0 md:top-5 left-0 w-full z-50">
      <div className="mx-auto w-full md:max-w-7xl px-0 sm:px-4 lg:px-6">
        <div
          className="
            mx-auto
            w-full
            md:w-fit
            bg-[#1b130f]/90
            backdrop-blur-xl
            border-b
            md:border
            border-white/10
            rounded-none
            md:rounded-2xl
            shadow-2xl
          "
        >
          <div className="flex items-center justify-between h-16 lg:h-[64px] px-4 sm:px-5 lg:px-6">

            {/* Logo */}
            <div
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src={logo}
                alt="Night Owl Designers"
                className="w-8 h-8 rounded-full object-cover"
              />

              <h2 className="font-heading text-base lg:text-lg text-white whitespace-nowrap">
                Night Owl{" "}
                <span className="text-[var(--gold)]">
                  Designers
                </span>
              </h2>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4 lg:gap-5 xl:gap-6 mx-6">
              {navLinks.map((link) => {
                const isActive = link.route
                  ? location.pathname === link.target
                  : activeSection === link.target;

                if (link.route) {
                  return (
                    <Link
                      key={link.label}
                      to={link.target}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`relative text-sm transition duration-300 pb-1 ${isActive ? "text-white" : "text-gray-300 hover:text-white"
                        }`}
                    >
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="active-nav-underline"
                          className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-[var(--gold)] rounded-full"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                }

                return (
                  <a
                    key={link.label}
                    href={`#${link.target}`}
                    onClick={(e) => handleNavClick(e, link.target)}
                    className={`relative text-sm transition duration-300 pb-1 ${isActive ? "text-white" : "text-gray-300 hover:text-white"
                      }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="active-nav-underline"
                        className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-[var(--gold)] rounded-full"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Desktop Buttons / User Menu */}
            <div className="hidden md:flex items-center gap-2 relative" ref={userMenuRef}>
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="
                      flex items-center gap-2
                      pl-2 pr-3 py-1.5
                      rounded-full
                      border border-white/10
                      bg-white/5
                      hover:bg-white/10
                      transition
                    "
                  >
                    <span
                      className="
                        w-7 h-7 rounded-full
                        flex items-center justify-center
                        bg-[var(--gold)] text-[#1b130f]
                        text-xs font-semibold
                      "
                    >
                      {initials}
                    </span>
                    <span className="text-sm text-white max-w-[120px] truncate">
                      {userData?.name || "Account"}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-gray-300 transition-transform ${userMenuOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        className="
                          absolute right-0 top-[calc(100%+10px)]
                          w-64
                          bg-[#1b130f]/95
                          backdrop-blur-xl
                          border border-white/10
                          rounded-xl
                          shadow-2xl
                          overflow-hidden
                          z-50
                        "
                      >
                        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                          <span
                            className="
                              w-9 h-9 rounded-full
                              flex items-center justify-center
                              bg-[var(--gold)] text-[#1b130f]
                              text-sm font-semibold
                              shrink-0
                            "
                          >
                            {initials}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {userData?.name || "User"}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {userData?.email}
                            </p>
                          </div>
                        </div>

                        <div className="py-2">
                          <button
                            onClick={goDashboard}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-200 hover:bg-white/5 hover:text-[var(--gold)] transition text-left"
                          >
                            <LayoutDashboard size={16} />
                            My Dashboard
                          </button>

                        </div>

                        <div className="border-t border-white/10 py-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 transition w-full"
                          >
                            <LogOut size={16} />
                            Log out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <a href="/Signin">
                  <Button
                    variant="gold"
                    size="sm"
                    className="rounded-sm px-4"
                  >
                    SIGN IN
                  </Button>
                </a>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="md:hidden bg-[#1b130f]/95 backdrop-blur-xl border-t border-white/10"
              >
                <div className="flex flex-col px-5 py-5">

                  {isLoggedIn && (
                    <div className="flex items-center gap-3 pb-4 mb-2 border-b border-white/10">
                      <span
                        className="
                          w-10 h-10 rounded-full
                          flex items-center justify-center
                          bg-[var(--gold)] text-[#1b130f]
                          text-sm font-semibold
                          shrink-0
                        "
                      >
                        {initials}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {userData?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {userData?.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {navLinks.map((link) => {
                    const isActive = link.route
                      ? location.pathname === link.target
                      : activeSection === link.target;

                    if (link.route) {
                      return (
                        <Link
                          key={link.label}
                          to={link.target}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`py-4 border-b border-white/10 transition flex items-center justify-between ${isActive ? "text-[var(--gold)]" : "text-white hover:text-[var(--gold)]"
                            }`}
                        >
                          {link.label}
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
                          )}
                        </Link>
                      );
                    }

                    return (
                      <a
                        key={link.label}
                        href={`#${link.target}`}
                        onClick={(e) => handleNavClick(e, link.target)}
                        className={`py-4 border-b border-white/10 transition flex items-center justify-between ${isActive ? "text-[var(--gold)]" : "text-white hover:text-[var(--gold)]"
                          }`}
                      >
                        {link.label}
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
                        )}
                      </a>
                    );
                  })}

                  {isLoggedIn ? (
                    <div className="flex flex-col gap-1 mt-4">
                      <button
                        onClick={goDashboard}
                        className="flex items-center gap-3 py-3 text-white hover:text-[var(--gold)] transition text-left"
                      >
                        <LayoutDashboard size={18} />
                        My Dashboard
                      </button>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 py-3 text-red-400 transition text-left"
                      >
                        <LogOut size={18} />
                        Log out
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 mt-6">
                      <a href="/Signin">
                        <Button
                          variant="outline"
                          fullWidth
                          className="rounded-full"
                        >
                          SIGN IN
                        </Button>
                      </a>

                      <a href="/signup">
                        <Button
                          variant="gold"
                          fullWidth
                          className="rounded-full"
                        >
                          Contact
                        </Button>
                      </a>
                    </div>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </header>
  );
}