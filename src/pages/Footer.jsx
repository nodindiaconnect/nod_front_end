import { useState } from "react"
import { ArrowRight } from "lucide-react"
import "../theme.css"
import logo from "../assets/logo.png"

const root = getComputedStyle(document.documentElement)
const GOLD = root.getPropertyValue("--gold").trim()
const LINE = root.getPropertyValue("--border").trim()
const PRIMARY = root.getPropertyValue("--primary").trim()
// The footer's background is --primary — a dark brown in BOTH light and dark
// mode (that's the point: it's meant to always read as a dark band). The
// old code styled its text with var(--on-photo)/var(--on-photo-muted),
// tokens that don't exist in theme.css, so the browser fell back to default
// (near-black) text on that dark brown background — invisible in light mode.
// Since this bar is intentionally dark regardless of theme, its text is a
// fixed warm cream rather than a theme-following token.
const FOOTER_TEXT = "#F7F3EA"
const FOOTER_MUTED = "rgba(247,243,234,0.68)"

export default function Footer() {
    const marketplaceLinks = [
        { label: "Browse Designers", href: "#designers" },
        { label: "Browse Projects", href: "#projects" },
        { label: "Government Tenders", href: "/tenders" },
        { label: "Design Categories", href: "#services" },
    ]

    const professionalsLinks = [
        { label: "Join as Designer", href: "/Signin" },
        { label: "Join as Contracter", href: "/Signin" },
        { label: "Join as Architect", href: "/Signin" },
    ]

    const companyLinks = [
        { label: "About Us", href: "/about" },
        { label: "Why Choose NOD", href: "/why-choose" },
        { label: "Careers", href: "/careers" },
    ]

    const legalLinks = [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Milestone Security", href: "#" },
        { label: "Trust & Safety", href: "/trust-safety" },
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

    return (
        <footer
            className="border-t pt-24 pb-12 px-6 md:px-8"
            style={{ backgroundColor: PRIMARY, borderColor: LINE }}
        >
            <div className="mx-auto max-w-7xl">

                {/* TOP ROW: LOGO, DIRECTORY, NEWSLETTER */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">

                    {/* Logo & Pitch */}
                    <div className="lg:col-span-4 flex flex-col items-start">
                        <div className="flex items-center gap-3 mb-6">
                            <div
                                className="relative h-12 w-12 rounded-full overflow-hidden border"
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
                            className="text-sm leading-relaxed max-w-xs mb-8"
                            style={{ color: FOOTER_MUTED }}
                        >
                            India's premium marketplace matching visionary clients with elite architects, designers, and structural contractors.
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-3">

                            <a href="https://www.instagram.com/nod._india/"
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

                            <a href="https://www.linkedin.com/in/nod-india-9131b9400/"
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

                    {/* Directory Links columns */}
                    <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-5 gap-8">

                        {/* Column 1 */}
                        <div>
                            <h4
                                className="text-[10px] font-bold uppercase tracking-widest mb-4 font-[var(--font-body)]"
                                style={{ color: FOOTER_TEXT }}
                            >
                                Marketplace
                            </h4>
                            <ul className="space-y-3">
                                {marketplaceLinks.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            onClick={(e) => handleNavClick(e, link.href)}
                                            className="text-xs transition-colors duration-300"
                                            style={{ color: FOOTER_MUTED }}
                                            onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                                            onMouseLeave={(e) => (e.currentTarget.style.color = FOOTER_MUTED)}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 2 */}
                        <div>
                            <h4
                                className="text-[10px] font-bold uppercase tracking-widest mb-4 font-[var(--font-body)]"
                                style={{ color: FOOTER_TEXT }}
                            >
                                Professionals
                            </h4>
                            <ul className="space-y-3">
                                {professionalsLinks.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            onClick={(e) => handleNavClick(e, link.href)}
                                            className="text-xs transition-colors duration-300"
                                            style={{ color: FOOTER_MUTED }}
                                            onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                                            onMouseLeave={(e) => (e.currentTarget.style.color = FOOTER_MUTED)}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3 */}
                        <div>
                            <h4
                                className="text-[10px] font-bold uppercase tracking-widest mb-4 font-[var(--font-body)]"
                                style={{ color: FOOTER_TEXT }}
                            >
                                Company
                            </h4>
                            <ul className="space-y-3">
                                {companyLinks.map((link) => (
                                    <li key={link.label}>

                                        <a href={link.href}
                                            onClick={(e) => handleNavClick(e, link.href)}
                                            className="text-xs transition-colors duration-300"
                                            style={{ color: FOOTER_MUTED }}
                                            onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                                            onMouseLeave={(e) => (e.currentTarget.style.color = FOOTER_MUTED)}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 4 */}
                        <div>
                            <h4
                                className="text-[10px] font-bold uppercase tracking-widest mb-4 font-[var(--font-body)]"
                                style={{ color: FOOTER_TEXT }}
                            >
                                Legal
                            </h4>
                            <ul className="space-y-3">
                                {legalLinks.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-xs transition-colors duration-300"
                                            style={{ color: FOOTER_MUTED }}
                                            onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                                            onMouseLeave={(e) => (e.currentTarget.style.color = FOOTER_MUTED)}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>

                </div>

                {/* BOTTOM CONTACT & COPYRIGHT */}
                <div
                    className="border-t pt-12 flex flex-col md:flex-row items-center justify-between gap-8"
                    style={{ borderColor: LINE }}
                >

                    {/* Contact Information */}
                    <div className="w-full md:w-auto flex flex-col items-start gap-3">
                        <p className="text-xs mt-1 font-light tracking-wide" style={{ color: FOOTER_MUTED }}>
                            <strong>Contact us :</strong> +91 8966969035, +91 9926378062
                        </p>
                        <p className="text-xs mt-1 font-light tracking-wide" style={{ color: FOOTER_MUTED }}>
                            <strong>Business Hours :</strong> Monday to Saturday: 10 AM to 6 PM IST
                        </p>
                        <p className="text-xs mt-1 font-light tracking-wide" style={{ color: FOOTER_MUTED }}>
                            <strong>Email :</strong> nightowldesignershelp@gmail.com
                        </p>
                        <p className="text-xs mt-1 font-light tracking-wide" style={{ color: FOOTER_MUTED }}>
                            <strong>Postal Address :</strong> 1st Floor, Beside Uday Amrik Homes Main <br /> Gate Itarsi Road Sadar Betul 460001 Madhya Pradesh India
                        </p>
                    </div>

                    {/* Copyright */}
                    <div className="text-center md:text-right">
                        <p className="text-xs font-light" style={{ color: FOOTER_MUTED }}>
                            © {new Date().getFullYear()} NOD-Night Owl Designers. All rights reserved.
                        </p>
                        <p className="text-[10px] mt-1 font-light tracking-wide" style={{ color: FOOTER_MUTED, opacity: 0.7 }}>
                            Designed in India • Connecting spatial excellence globally.
                        </p>
                    </div>

                </div>

            </div >
        </footer >
    )
}