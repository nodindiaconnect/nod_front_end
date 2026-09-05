import { useState } from "react"
import {
    MapPin,
    Phone,
    Mail,
    ArrowUp,
    Users,
    LayoutGrid,
    Palette,
    UserPlus,
    Wrench,
    Building2,
    Info,
    Award,
} from "lucide-react"
import "../theme.css"
import logo from "../assets/logo.png"

const root = getComputedStyle(document.documentElement)
const GOLD = root.getPropertyValue("--gold").trim()
const LINE = root.getPropertyValue("--border").trim()
const PRIMARY = root.getPropertyValue("--primary").trim()

const FOOTER_TEXT = "#F7F3EA"
const FOOTER_MUTED = "rgba(247,243,234,0.68)"

export default function Footer() {
    const marketplaceLinks = [
        { label: "Browse Designers", href: "/portfolios", icon: Users },
        { label: "Browse Projects", href: "/portfolios", icon: LayoutGrid },
        { label: "Browse Suppliers", href: "/supplier-products", icon: Palette },
    ]

    const professionalsLinks = [
        { label: "Join as Designer", href: "/Signup?role=Designer", icon: UserPlus },
        { label: "Join as Contractor", href: "/Signup?role=Contractor", icon: Wrench },
        { label: "Join as Architect", href: "/Signup?role=Architect", icon: Building2 },
    ]

    const companyLinks = [
        { label: "About Us", href: "/About", icon: Info },
        { label: "Why Choose NOD", href: "/why-choose", icon: Award },
    ]

    const handleNavClick = (e, targetId) => {
        if (targetId.startsWith("#")) {
            e.preventDefault()
            const element = document.getElementById(targetId.substring(1))
            if (element) {
                const offset = 80
                const elementPosition = element.getBoundingClientRect().top
                const offsetPosition = elementPosition + window.pageYOffset - offset
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                })
            }
        }
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const iconLinkStyle = {
        color: FOOTER_MUTED,
    }

    // Reusable column of icon + label links
    const LinkColumn = ({ title, links }) => (
        <div>
            <h4
                className="text-[13px] font-bold uppercase tracking-wide mb-1 font-[var(--font-body)]"
                style={{ color: FOOTER_TEXT }}
            >
                {title}
            </h4>
            <div
                className="h-[3px] w-8 mb-5 rounded-full"
                style={{ backgroundColor: GOLD }}
            />
            <ul className="space-y-4">
                {links.map((link) => {
                    const Icon = link.icon
                    return (
                        <li key={link.label}>
                            <a
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className="flex items-center gap-2.5 text-sm transition-colors duration-300"
                                style={iconLinkStyle}
                                onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                                onMouseLeave={(e) => (e.currentTarget.style.color = FOOTER_MUTED)}
                            >
                                <Icon size={16} strokeWidth={1.75} />
                                <span>{link.label}</span>
                            </a>
                        </li>
                    )
                })}
            </ul>
        </div>
    )

    return (
        <footer
            className="relative border-t pt-20 pb-10 px-6 md:px-8"
            style={{ backgroundColor: PRIMARY, borderColor: LINE }}
        >
            <div className="mx-auto max-w-7xl">

                {/* TOP ROW: BRAND, CONTACT INFO, COMPANY, MARKETPLACE, PROFESSIONALS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

                    {/* Brand column */}
                    <div className="lg:col-span-1 sm:col-span-2 flex flex-col items-start">
                        <div className="flex items-center gap-3 mb-5">
                            <div
                                className="relative h-11 w-11 rounded-full overflow-hidden border"
                                style={{ borderColor: GOLD }}
                            >
                                <img src={logo} alt="NOD Logo" className="h-full w-full object-cover" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span
                                    className="text-xl font-bold tracking-tight font-[var(--font-body)]"
                                    style={{ color: FOOTER_TEXT }}
                                >
                                    N<span style={{ color: GOLD }}>OD</span>
                                </span>
                                <span
                                    className="text-[9px] tracking-[0.25em] font-semibold uppercase mt-0.5"
                                    style={{ color: FOOTER_MUTED }}
                                >
                                    Night Owl Designers
                                </span>
                            </div>
                        </div>

                        <p
                            className="text-sm leading-relaxed max-w-xs mb-6"
                            style={{ color: FOOTER_MUTED }}
                        >
                            India's premium marketplace matching visionary clients with elite architects, designers, and structural contractors.
                        </p>

                        {/* Tag pills */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {["Trusted", "Curated", "Nationwide"].map((tag) => (
                                <span
                                    key={tag}
                                    className="text-[10px] font-semibold uppercase tracking-wide px-3 py-1 rounded-full border"
                                    style={{ borderColor: LINE, color: FOOTER_MUTED }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Social Icons */}
                        <div className="flex gap-3">
                            <a href="https://www.instagram.com/nodindia.in?igsi=bG1lczVtMHNydHNu"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-10 w-10 flex items-center justify-center rounded-full border transition-all duration-300"
                                style={{ borderColor: LINE, backgroundColor: "rgba(255,255,255,0.05)", color: FOOTER_TEXT }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = GOLD
                                    e.currentTarget.style.borderColor = GOLD
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = FOOTER_TEXT
                                    e.currentTarget.style.borderColor = LINE
                                }}
                                aria-label="Instagram"
                            >
                                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                            </a>

                            <a href="https://www.linkedin.com/in/nod-india-9131b9400"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-10 w-10 flex items-center justify-center rounded-full border transition-all duration-300"
                                style={{ borderColor: LINE, backgroundColor: "rgba(255,255,255,0.05)", color: FOOTER_TEXT }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = GOLD
                                    e.currentTarget.style.borderColor = GOLD
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = FOOTER_TEXT
                                    e.currentTarget.style.borderColor = LINE
                                }}
                                aria-label="LinkedIn"
                            >
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                                </svg>
                            </a>
                            <a
                                href="https://x.com/NODIndia"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-10 w-10 flex items-center justify-center rounded-full border transition-all duration-300"
                                style={{ borderColor: LINE, backgroundColor: "rgba(255,255,255,0.05)", color: FOOTER_TEXT }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = GOLD
                                    e.currentTarget.style.borderColor = GOLD
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = FOOTER_TEXT
                                    e.currentTarget.style.borderColor = LINE
                                }}
                                aria-label="Twitter"
                            >
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Contact Info column */}
                    <div>
                        <h4
                            className="text-[13px] font-bold uppercase tracking-wide mb-1 font-[var(--font-body)]"
                            style={{ color: FOOTER_TEXT }}
                        >
                            Contact Info
                        </h4>

                        <div
                            className="h-[3px] w-8 mb-5 rounded-full"
                            style={{ backgroundColor: GOLD }}
                        />

                        <ul className="space-y-5">
                            <li className="flex items-start gap-3">
                                <span
                                    className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full border"
                                    style={{ borderColor: GOLD, color: GOLD }}
                                >
                                    <MapPin size={15} strokeWidth={1.75} />
                                </span>

                                <span
                                    className="text-xs leading-relaxed pt-1.5"
                                    style={{ color: FOOTER_MUTED }}
                                >
                                    NOD Office, 1st Floor, Beside Uday Amrik Homes Main Gate,
                                    Itarsi Road, Sadar, Betul – 460001, Madhya Pradesh, India
                                </span>
                            </li>

                            <li className="flex items-start gap-3">
                                <span
                                    className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full border"
                                    style={{ borderColor: GOLD, color: GOLD }}
                                >
                                    <Phone size={15} strokeWidth={1.75} />
                                </span>

                                <span
                                    className="text-xs leading-relaxed pt-1.5"
                                    style={{ color: FOOTER_MUTED }}
                                >
                                    +91 8966969035
                                </span>
                            </li>

                            <li className="flex items-start gap-3">
                                <span
                                    className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full border"
                                    style={{ borderColor: GOLD, color: GOLD }}
                                >
                                    <Mail size={15} strokeWidth={1.75} />
                                </span>

                                <a
                                    href="mailto:nightowldesignershelp@gmail.com"
                                    className="text-xs leading-relaxed pt-1.5 underline transition-colors duration-300"
                                    style={{ color: FOOTER_MUTED }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.color = GOLD)
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.color = FOOTER_MUTED)
                                    }
                                >
                                    nightowldesignershelp@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Company column */}
                    <LinkColumn title="Company" links={companyLinks} />

                    {/* Marketplace column */}
                    <LinkColumn title="Marketplace" links={marketplaceLinks} />

                    {/* Professionals column */}
                    <LinkColumn title="Professionals" links={professionalsLinks} />

                </div>

                {/* BOTTOM BAR */}
                <div
                    className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
                    style={{ borderColor: LINE }}
                >
                    <p
                        className="text-xs font-light text-center md:text-left"
                        style={{ color: FOOTER_MUTED }}
                    >
                        © {new Date().getFullYear()} NOD - Night Owl Designers. All rights reserved.
                        {"  "}|{"  "}
                        <a
                            href="/privacy-policy"
                            className="underline transition-colors duration-300"
                            style={{ color: FOOTER_MUTED }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                            onMouseLeave={(e) => (e.currentTarget.style.color = FOOTER_MUTED)}
                        >
                            Privacy Policy
                        </a>
                        {"  "}|{"  "}
                        <a
                            href="/terms"
                            className="underline transition-colors duration-300"
                            style={{ color: FOOTER_MUTED }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                            onMouseLeave={(e) => (e.currentTarget.style.color = FOOTER_MUTED)}
                        >
                            Terms of Service
                        </a>
                    </p>

                    <p
                        className="text-[10px] font-light tracking-wide text-center md:text-right"
                        style={{ color: FOOTER_MUTED, opacity: 0.7 }}
                    >
                        Designed in India • Connecting spatial excellence globally.
                    </p>
                </div>
            </div>

            {/* Scroll to top button */}
            <button
                onClick={scrollToTop}
                aria-label="Scroll to top"
                className="absolute right-6 md:right-8 bottom-6 md:bottom-8 h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105"
                style={{ backgroundColor: GOLD, color: PRIMARY }}
            >
                <ArrowUp size={20} strokeWidth={2} />
            </button>
        </footer>
    )
}