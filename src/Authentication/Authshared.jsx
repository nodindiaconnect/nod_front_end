import { useCallback, useEffect, useRef, useState } from "react"
import { Country } from "country-state-city"
import { Check } from "lucide-react"
import "../theme.css"

const root = getComputedStyle(document.documentElement)

export const INK = root.getPropertyValue("--heading").trim()
export const INK_SOFT = root.getPropertyValue("--text").trim()
export const GOLD = root.getPropertyValue("--gold").trim()
export const GOLD_DARK = root.getPropertyValue("--gold-hover").trim()
export const LINE = root.getPropertyValue("--border").trim()
export const BG = root.getPropertyValue("--background").trim()

export const PRIMARY = root.getPropertyValue("--primary").trim()
export const PRIMARY_HOVER = root.getPropertyValue("--primary-hover").trim()
export const SURFACE = root.getPropertyValue("--surface").trim()

export const ERROR_BG = "#fdecea"
export const ERROR_TEXT = root.getPropertyValue("--danger").trim()
export const OK_TEXT = root.getPropertyValue("--success").trim()

export const allCountriesList = Country.getAllCountries()

export const CURRENCY_SYMBOLS = {
    INR: "₹",
    USD: "$",
    CAD: "CA$",
    GBP: "£",
    EUR: "€",
    AED: "AED",
    SAR: "SAR",
    AUD: "A$",
    NZD: "NZ$",
    SGD: "S$",
    CHF: "CHF",
    JPY: "¥",
    CNY: "¥",
    KRW: "₩",
    QAR: "QAR",
    KWD: "KWD",
    OMR: "OMR",
    BHD: "BHD",
    MYR: "RM",
    IDR: "Rp",
    PHP: "₱",
    THB: "฿",
    VND: "₫",
    BDT: "৳",
    LKR: "Rs",
    NPR: "Rs",
    ZAR: "R",
    NGN: "₦",
    KES: "KSh",
    EGP: "E£",
    BRL: "R$",
    MXN: "Mex$",
    SEK: "kr",
    NOK: "kr",
    DKK: "kr",
    PLN: "zł",
    TRY: "₺",
    RUB: "₽",
}

export function getCurrencyForPhoneAndCountry(phoneCode, countryName) {
    const cleanCode = String(phoneCode || "").replace(/[^\d]/g, "").trim()
    const cleanCountry = String(countryName || "").trim().toLowerCase()

    // 1. Try matching by country name if provided
    if (cleanCountry) {
        const countryObj = allCountriesList.find(
            (c) => c.name.toLowerCase() === cleanCountry || c.isoCode.toLowerCase() === cleanCountry
        )
        if (countryObj && countryObj.currency) {
            const code = countryObj.currency
            const symbol = CURRENCY_SYMBOLS[code] || code
            return {
                currency: code,
                symbol,
                name: countryObj.name,
                country: countryObj.name,
                phoneCode: `+${countryObj.phonecode}`,
            }
        }
    }

    // 2. Lookup by phone code
    if (cleanCode) {
        const matchingCountries = allCountriesList.filter((c) => c.phonecode === cleanCode)
        if (matchingCountries.length > 0) {
            let countryObj = matchingCountries[0]
            if (cleanCode === "1" && cleanCountry.includes("canada")) {
                const canada = matchingCountries.find((c) => c.isoCode === "CA")
                if (canada) countryObj = canada
            }
            const code = countryObj.currency || "INR"
            const symbol = CURRENCY_SYMBOLS[code] || code
            return {
                currency: code,
                symbol,
                name: countryObj.name,
                country: countryObj.name,
                phoneCode: `+${countryObj.phonecode}`,
            }
        }
    }

    return { currency: "INR", symbol: "₹", name: "India", country: "India", phoneCode: "+91" }
}

/* ────────────────────────────────────────────────────────────────
   CLOUDFLARE TURNSTILE
   Site key comes from an env var so it's never hardcoded into the
   bundle by hand. Set VITE_TURNSTILE_SITE_KEY in your .env file(s):

     VITE_TURNSTILE_SITE_KEY=0x4AAAAAAAxxxxxxxxxxxxxx

   This is the PUBLIC site key (safe to ship to the browser) — not
   the secret key, which stays server-side only (TURNSTILE_SECRET_KEY
   in authController.js). If you're on CRA instead of Vite, swap this
   line for `process.env.REACT_APP_TURNSTILE_SITE_KEY`.
──────────────────────────────────────────────────────────────── */
export const TURNSTILE_SITE_KEY =
    (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_TURNSTILE_SITE_KEY)

const TURNSTILE_SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
let turnstileLoadPromise = null

function loadTurnstileScript() {
    if (typeof window === "undefined") return Promise.reject(new Error("no window"))
    if (window.turnstile) return Promise.resolve()
    if (turnstileLoadPromise) return turnstileLoadPromise

    turnstileLoadPromise = new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${TURNSTILE_SCRIPT_SRC}"]`)
        if (existing) {
            existing.addEventListener("load", () => resolve())
            existing.addEventListener("error", () => reject(new Error("Turnstile script failed to load")))
            return
        }
        const script = document.createElement("script")
        script.src = TURNSTILE_SCRIPT_SRC
        script.async = true
        script.defer = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error("Turnstile script failed to load"))
        document.head.appendChild(script)
    })

    return turnstileLoadPromise
}

/**
 * Renders a Cloudflare Turnstile widget and reports the token back to
 * the parent via onVerify(token). The parent owns the token in state
 * and sends it as `captchaToken` in the register/login/forgot request.
 *
 * Usage:
 *   const [captchaToken, setCaptchaToken] = useState("")
 *   const [captchaResetKey, setCaptchaResetKey] = useState(0)
 *   <TurnstileWidget
 *     onVerify={setCaptchaToken}
 *     onExpire={() => setCaptchaToken("")}
 *     resetKey={captchaResetKey}
 *   />
 *   // after a failed submit where the server rejected the captcha,
 *   // or after any submit attempt (tokens are single-use):
 *   setCaptchaToken("")
 *   setCaptchaResetKey((k) => k + 1)
 */
export function TurnstileWidget({ onVerify, onExpire, onError, theme = "light", action, resetKey }) {
    const containerRef = useRef(null)
    const widgetIdRef = useRef(null)
    const [scriptReady, setScriptReady] = useState(false)
    const [loadError, setLoadError] = useState(false)

    const handleVerify = useCallback((token) => onVerify && onVerify(token), [onVerify])
    const handleExpire = useCallback(() => onExpire && onExpire(), [onExpire])
    const handleError = useCallback(
        (msg) => {
            setLoadError(true)
            if (onError) onError(msg || "Captcha failed to load. Please refresh and try again.")
        },
        [onError]
    )

    // Load the Turnstile script once.
    useEffect(() => {
        let cancelled = false
        loadTurnstileScript()
            .then(() => {
                if (!cancelled) setScriptReady(true)
            })
            .catch(() => {
                if (!cancelled) handleError("Captcha failed to load. Please refresh and try again.")
            })
        return () => {
            cancelled = true
        }
    }, [handleError])

    // Render (or reset) the widget once the script is ready.
    useEffect(() => {
        if (!scriptReady || !containerRef.current || !window.turnstile) return

        if (!TURNSTILE_SITE_KEY || TURNSTILE_SITE_KEY === "YOUR_TURNSTILE_SITE_KEY_HERE") {
            handleError("Turnstile site key is not configured.")
            return
        }

        // If already rendered, just reset it instead of rendering a second widget.
        if (widgetIdRef.current != null) {
            window.turnstile.reset(widgetIdRef.current)
            return
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: TURNSTILE_SITE_KEY,
            theme,
            action,
            callback: handleVerify,
            "expired-callback": handleExpire,
            "error-callback": () => handleError("Captcha error, please retry."),
        })

        return () => {
            if (widgetIdRef.current != null && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current)
                widgetIdRef.current = null
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scriptReady])

    // Parent-triggered reset (e.g. after a failed submit, since a
    // Turnstile token is single-use and expires ~5 min after issuance).
    useEffect(() => {
        if (resetKey === undefined || resetKey === null) return
        if (widgetIdRef.current != null && window.turnstile) {
            window.turnstile.reset(widgetIdRef.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetKey])

    return (
        <div className="mb-4">
            <div ref={containerRef} />
            {loadError && (
                <p className="mt-1 text-[11px]" style={{ color: ERROR_TEXT }}>
                    Couldn't load the captcha. Check your connection and refresh the page.
                </p>
            )}
        </div>
    )
}

/* ────────────────────────────────────────────────────────────────
   ROLE CONFIG — the keys here (Client, Designer, Architect,
   Contractor, MaterialSupplier) are sent to the backend AS-IS in the
   `role` field of registerStart. Must match ACCOUNT_TYPES keys in
   authController.js exactly (same spelling/casing) — the backend
   validates the string against its own allowlist and rejects
   anything that doesn't match one of these exact keys.
──────────────────────────────────────────────────────────────── */
export const ROLE_LABELS = {
    Client: "Client",
    Designer: "Designer",
    Architect: "Architect",
    Contractor: "Contractor",
    MaterialSupplier: "Material Supplier",
}

export const DEFAULT_DESIGNER_CATEGORIES = [
    {
        name: "Interior Designer",
        specializations: [
            "Residential Interior",
            "Commercial & Office Interior",
            "Modular Kitchen & Wardrobe",
            "Hospitality & Restaurant",
            "Living & Luxury Spaces",
            "Retail & Showroom Design",
        ],
    },
    {
        name: "Exterior Designer",
        specializations: [
            "Residential Elevation",
            "Commercial Facade Design",
            "Modern Villa Elevation",
            "Facade & Cladding Design",
            "Exterior Remodeling & Lighting",
        ],
    },
    {
        name: "AutoCAD Drafter",
        specializations: [
            "2D Architectural Drafting",
            "Working & Detail Drawings",
            "MEP & HVAC Drafting",
            "Approval & Submission Drawings",
            "Structural Layout Drafting",
        ],
    },
    {
        name: "Landscape Designer",
        specializations: [
            "Garden & Lawn Design",
            "Terrace & Balcony Gardens",
            "Urban & Public Landscapes",
            "Farmhouse & Resort Landscapes",
            "Hardscape & Water Features",
        ],
    },
    {
        name: "BIM Engineer",
        specializations: [
            "Revit BIM Modeling",
            "Clash Detection & Coordination",
            "4D / 5D BIM Simulation",
            "MEP BIM Modeling",
            "Structural BIM Engineering",
        ],
    },
    {
        name: "Product Designer",
        specializations: [
            "Custom Furniture Design",
            "Lighting & Luminaire Design",
            "Home Decor & Artifacts",
            "Millwork & Joinery Design",
            "Industrial Product Design",
        ],
    },
    {
        name: "Graphic Designer",
        specializations: [
            "Environmental & Signage Graphics",
            "Architectural Presentation & Pitch Decks",
            "Wall Art & Murals",
            "Brand Identity & Signage",
            "Marketing Collateral & 3D Infographics",
        ],
    },
    {
        name: "3D Modeler",
        specializations: [
            "3D Architectural Modeling",
            "Photorealistic Rendering",
            "3ds Max / Blender / SketchUp Modeling",
            "Furniture & Prop 3D Modeling",
            "Texturing & Lighting Specialist",
        ],
    },
    {
        name: "Walkthrough Specialist",
        specializations: [
            "3D Architectural Animation",
            "Lumion / Unreal Engine Walkthrough",
            "360° Virtual Tours & Panoramas",
            "Real-Time VR Experiences",
            "Cinematic Video Rendering",
        ],
    },
    {
        name: "Estimation Engineer",
        specializations: [
            "BOQ & Cost Estimation",
            "Quantity Surveying & Material Takeoff",
            "Material & Labor Costing",
            "Rate Analysis & Budgeting",
            "Tender & Contract Estimation",
        ],
    },
];

export const ROLE_FIELDS = {
    Client: { heading: "Almost There", subtitle: "Confirm your location and preferences.", fields: [] },
    Designer: {
        heading: "Set Up Your Designer Profile",
        subtitle: "Showcase your style and attract the right clients.",
        fields: [
            { id: "bio", label: "Short Bio", type: "textarea", placeholder: "Tell clients about your design philosophy..." },
            { id: "category", label: "Category", type: "category", placeholder: "Select Category" },
            { id: "specialization", label: "Specialization", type: "specialization", placeholder: "Select Specialization" },
            { id: "specializationLevel", label: "Specialization Level", type: "select", options: ["Beginner", "Intermediate", "Professional"] },
            { id: "style", label: "Signature Style", type: "select", options: ["Modern", "Minimalist", "Luxury", "Scandinavian", "Industrial", "Eclectic"] },
            { id: "experience", label: "Years of Experience", type: "number", placeholder: "e.g. 5" },
            { id: "rate", label: "Hourly Rate (Optional)", type: "rate", placeholder: "e.g. 80" },
        ],
    },
    Architect: {
        heading: "Set Up Your Architect Profile",
        subtitle: "Highlight your expertise and win more projects.",
        fields: [
            { id: "bio", label: "Short Bio", type: "textarea", placeholder: "Describe your architectural approach..." },
            { id: "specialization", label: "Project Type", type: "select", options: ["Residential", "Commercial", "Mixed-Use", "Industrial", "Urban Planning"] },
            { id: "specializationLevel", label: "Specialization Level", type: "select", options: ["Beginner", "Intermediate", "Professional"] },
            { id: "software", label: "Primary Software", type: "select", options: ["AutoCAD", "Revit", "ArchiCAD", "SketchUp", "Rhino"] },
            { id: "experience", label: "Years of Experience", type: "number", placeholder: "e.g. 10" },
            { id: "rate", label: "Hourly Rate (Optional)", type: "rate", placeholder: "e.g. 100" },
        ],
    },
    Contractor: {
        heading: "Set Up Your Contractor Profile",
        subtitle: "Show clients what you can build.",
        fields: [
            { id: "bio", label: "Company / Personal Bio", type: "textarea", placeholder: "Describe your contracting services..." },
            { id: "trade", label: "Primary Trade", type: "select", options: ["General Contractor", "Electrical", "Plumbing", "Carpentry", "Masonry", "Painting", "HVAC"] },
            { id: "experience", label: "Years of Experience", type: "number", placeholder: "e.g. 8" },
        ],
    },
    MaterialSupplier: {
        heading: "Set Up Your Supplier Profile",
        subtitle: "List your materials and reach more builders and designers.",
        fields: [
            { id: "businessName", label: "Business Name", type: "text", placeholder: "e.g. Sharma Building Materials" },
            { id: "ownerName", label: "Owner Name", type: "text", placeholder: "e.g. Ramesh Sharma" },
            { id: "businessType", label: "Business Type", type: "select", options: ["Manufacturer", "Wholesaler", "Retailer", "Distributor", "Importer"] },
        ],
    },
}

export const STEP_META = {
    account: { label: "Account" },
    location: { label: "Location" },
    profile: { label: "Profile" },
    review: { label: "Review" },
}

export function getStepsForRole(role) {
    if (!role) return ["account"]
    const hasProfileFields = (ROLE_FIELDS[role]?.fields || []).length > 0
    return hasProfileFields ? ["account", "location", "profile", "review"] : ["account", "location", "review"]
}

export function getErrMsg(err) {
    return err?.data?.message || err?.error || "Something went wrong. Please try again."
}

/* ────────────────────────────────────────────────────────────────
   SMALL REUSABLE PIECES
──────────────────────────────────────────────────────────────── */

export function FieldLabel({ children }) {
    return (
        <div className="text-[10px] font-semibold mb-2" style={{ color: INK, letterSpacing: "1.5px" }}>
            {children}
        </div>
    )
}

export function TextInput({ label, disabled, className = "", ...props }) {
    return (
        <div className="mb-4">
            {label && <FieldLabel>{label}</FieldLabel>}
            <input
                {...props}
                disabled={disabled}
                className={`w-full px-4 py-3.5 text-sm outline-none transition-colors ${disabled ? "opacity-40 cursor-not-allowed" : ""} ${className}`}
                style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
            />
        </div>
    )
}

export function SelectInput({ label, disabled, children, ...props }) {
    return (
        <div className="mb-4">
            {label && <FieldLabel>{label}</FieldLabel>}
            <select
                {...props}
                disabled={disabled}
                className={`w-full px-4 py-3.5 text-sm outline-none appearance-none ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
            >
                {children}
            </select>
        </div>
    )
}

export function TextAreaInput({ label, disabled, ...props }) {
    return (
        <div className="mb-4">
            {label && <FieldLabel>{label}</FieldLabel>}
            <textarea
                {...props}
                disabled={disabled}
                className={`w-full px-4 py-3.5 text-sm outline-none resize-none ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
            />
        </div>
    )
}

export function RateInput({ label, currencyData, disabled, className = "", ...props }) {
    const symbol = currencyData?.symbol || "₹"
    const code = currencyData?.currency || "INR"

    return (
        <div className="mb-4">
            {label && <FieldLabel>{label}</FieldLabel>}
            <div
                className={`flex items-center transition-colors ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                style={{ border: `1px solid ${LINE}`, background: "transparent" }}
            >
                <div
                    className="px-3.5 py-3.5 text-xs font-bold shrink-0 border-r flex items-center gap-1.5 select-none"
                    style={{
                        borderColor: LINE,
                        background: "rgba(0,0,0,0.02)",
                        color: INK,
                    }}
                    title={`Detected currency: ${code} (${symbol})`}
                >
                    <span className="text-sm font-semibold">{symbol}</span>
                    <span className="text-[11px] opacity-75">{code}</span>
                </div>
                <input
                    {...props}
                    type="number"
                    min="0"
                    disabled={disabled}
                    className={`flex-1 min-w-0 px-3.5 py-3.5 text-sm outline-none bg-transparent ${className}`}
                    style={{ color: INK }}
                />
                <span className="px-3 text-xs text-[var(--text)]/60 font-medium select-none shrink-0">
                    / hr
                </span>
            </div>
            <p className="text-[10px] mt-1.5 text-[#8a8479]">
                Currency automatically set to {code} ({symbol}) from your mobile country code ({currencyData?.phoneCode || "+91"}). Optional.
            </p>
        </div>
    )
}

export function PrimaryButton({ children, className = "", ...props }) {
    return (
        <button
            {...props}
            className={`w-full py-4 text-white text-sm tracking-wide disabled:opacity-50 transition-colors duration-300 ${className}`}
            style={{ background: PRIMARY }}
            onMouseEnter={(e) => !props.disabled && (e.currentTarget.style.background = PRIMARY_HOVER)}
            onMouseLeave={(e) => !props.disabled && (e.currentTarget.style.background = PRIMARY)}
        >
            {children}
        </button>
    )
}

export function GhostButton({ children, className = "", ...props }) {
    return (
        <button
            {...props}
            className={`w-full py-4 text-sm tracking-wide border disabled:opacity-40 ${className}`}
            style={{ borderColor: INK_SOFT, color: INK }}
        >
            {children}
        </button>
    )
}

export function StepProgress({ stepKeys, currentKey }) {
    const currentIndex = stepKeys.indexOf(currentKey)
    return (
        <div className="flex items-center mb-8">
            {stepKeys.map((key, i) => {
                const done = i < currentIndex
                const active = i === currentIndex
                return (
                    <div key={key} className="flex items-center" style={{ flex: i === stepKeys.length - 1 ? "0 0 auto" : 1 }}>
                        <div className="flex flex-col items-center" style={{ minWidth: 64 }}>
                            <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] shrink-0"
                                style={{
                                    border: `1px solid ${done || active ? GOLD : LINE}`,
                                    background: done ? GOLD : "transparent",
                                    color: done ? "#fff" : active ? GOLD : INK_SOFT,
                                    fontWeight: 600,
                                }}
                            >
                                {done ? "✓" : i + 1}
                            </div>
                            <div
                                className="mt-1.5 text-[10px] text-center"
                                style={{ color: active ? GOLD : INK_SOFT, fontWeight: active ? 600 : 400, letterSpacing: "0.5px" }}
                            >
                                {STEP_META[key].label}
                            </div>
                        </div>
                        {i !== stepKeys.length - 1 && (
                            <div className="h-px flex-1 mx-1" style={{ background: done ? GOLD : LINE, marginBottom: 18 }} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export function WelcomeBackCard() {
    const highlights = [
        "Message your designer directly",
        "Track proposals & invoices",
        "See your project timeline",
    ]
    return (
        <div className="w-72 p-8 shrink-0" style={{ background: SURFACE, boxShadow: "0 2px 18px rgba(0,0,0,0.08)" }}>
            <div
                className="w-36 h-36 rounded-full mx-auto mb-6 overflow-hidden flex items-center justify-center"
                style={{ background: "linear-gradient(160deg,#efe6da,#e2d6c4)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)" }}
            >
                <svg viewBox="0 0 170 170" className="w-full h-full">
                    <rect width="170" height="170" fill="#e9dfd0" />
                    <rect x="20" y="20" width="40" height="30" fill="#d7c4a3" stroke={GOLD} strokeWidth="2" />
                    <circle cx="95" cy="35" r="16" fill="#b8cfc4" />
                    <rect x="30" y="80" width="90" height="55" fill="#f6f2ea" />
                    <circle cx="120" cy="70" r="24" fill="#e0c9a6" />
                    <rect x="107" y="94" width="26" height="40" fill={PRIMARY} />
                </svg>
            </div>

            <div className="text-center mb-6">
                <div className="text-xs font-semibold mb-2" style={{ color: INK, letterSpacing: "1.5px" }}>
                    WELCOME BACK
                </div>
                <div className="w-9 h-0.5 mx-auto" style={{ background: GOLD }} />
            </div>

            <div className="flex flex-col gap-5">
                {highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm leading-tight" style={{ color: INK_SOFT }}>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: GOLD }}>
                            <Check size={14} color="white" strokeWidth={3} />
                        </div>
                        {h}
                    </div>
                ))}
            </div>
        </div>
    )
}

