import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import Button from "../components/Button/button";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();

  const navLinks = [
    { label: "Designs", target: "/designs", route: true },
    { label: "Projects", target: "projects" },
    { label: "Services", target: "services" },
    { label: "About", target: "/about", route: true },
    { label: "Contact", target: "contact" },
    { label: "Supplier Marketplace", target: "/supplier-products", route: true },


  ];

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

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <a href="/Signin">
                <Button
                  variant="gold"
                  size="sm"
                  className="rounded-sm px-4"
                >
                  Sign In
                </Button>
              </a>
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

                  <div className="flex flex-col gap-3 mt-6">
                    <a href="/Signin">
                      <Button
                        variant="outline"
                        fullWidth
                        className="rounded-full"
                      >
                        Sign In
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

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </header>
  );
}