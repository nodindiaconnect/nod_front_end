import {
    ShieldCheck,
    Users,
    Layers,
    Truck,
    Clock,
    Award,
    Handshake,
    Sparkles,
} from "lucide-react"
import "../theme.css"

const root = getComputedStyle(document.documentElement)
const GOLD = root.getPropertyValue("--gold").trim()
const PRIMARY = root.getPropertyValue("--primary").trim()

const TEXT = "#F7F3EA"
const MUTED = "rgba(247,243,234,0.68)"
const WHITE_BORDER = "rgba(255,255,255,0.35)"

export default function WhyChoose() {
    const pillars = [
        {
            icon: Users,
            title: "Verified Professionals",
            desc: "Every architect, designer, and contractor on NOD is background-checked and portfolio-reviewed before they ever meet a client.",
        },
        {
            icon: Layers,
            title: "End-to-End Ecosystem",
            desc: "Design, build, and source — all under one roof. No juggling five vendors across three cities.",
        },
        {
            icon: Truck,
            title: "Material Suppliers Network",
            desc: "Direct access to vetted material suppliers for tiles, fittings, furniture, and finishes — at trade pricing, delivered on schedule.",
        },
        {
            icon: ShieldCheck,
            title: "Secure & Transparent",
            desc: "Milestone-based payments, contract protection, and full project visibility from day one to handover.",
        },
        {
            icon: Clock,
            title: "On-Time Delivery",
            desc: "Our project managers track every timeline so your build stays on schedule, not just on paper.",
        },
        {
            icon: Award,
            title: "Elite Curation",
            desc: "We onboard the top tier of talent — not every applicant, only the ones who meet our design and craftsmanship bar.",
        },
    ]

    return (
        <section
            className="pt-24 pb-24 px-6 md:px-8"
            style={{ backgroundColor: PRIMARY }}
        >
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <span
                        className="text-[11px] font-bold uppercase tracking-[0.25em]"
                        style={{ color: GOLD }}
                    >
                        Why Choose NOD
                    </span>
                    <h2
                        className="text-3xl md:text-5xl font-bold mt-4 mb-6 font-[var(--font-body)]"
                        style={{ color: TEXT }}
                    >
                        One Platform. Every Piece of the Build.
                    </h2>
                    <p className="text-sm md:text-base leading-relaxed" style={{ color: MUTED }}>
                        From the first sketch to the final material delivered on-site, NOD brings
                        together India's finest designers, architects, contractors, and material
                        suppliers — so you never have to build alone.
                    </p>
                </div>

                {/* Pillars grid — clear white-bordered boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                    {pillars.map(({ icon: Icon, title, desc }, i) => (
                        <div
                            key={title}
                            className="p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1"
                            style={{ borderColor: WHITE_BORDER, backgroundColor: "rgba(255,255,255,0.03)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = GOLD)}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = WHITE_BORDER)}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div
                                    className="h-12 w-12 flex items-center justify-center rounded-full border"
                                    style={{ borderColor: WHITE_BORDER, color: GOLD }}
                                >
                                    <Icon size={20} strokeWidth={1.75} />
                                </div>
                              
                            </div>
                            <h3
                                className="text-lg font-bold mb-3 font-[var(--font-body)]"
                                style={{ color: TEXT }}
                            >
                                {title}
                            </h3>
                            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                                {desc}
                            </p>
                        </div>
                    ))}
                </div>


                {/* Material suppliers callout — clear white-bordered box */}
                <div
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center rounded-3xl border p-10 md:p-14"
                    style={{ borderColor: WHITE_BORDER, backgroundColor: "rgba(255,255,255,0.03)" }}
                >
                    <div>
                        <span
                            className="text-[11px] font-bold uppercase tracking-[0.25em]"
                            style={{ color: GOLD }}
                        >
                            Sourcing, Simplified
                        </span>
                        <h3
                            className="text-2xl md:text-3xl font-bold mt-4 mb-5 font-[var(--font-body)]"
                            style={{ color: TEXT }}
                        >
                            Find Every Material Supplier You Need — In One Place
                        </h3>
                        <p className="text-sm leading-relaxed mb-6" style={{ color: MUTED }}>
                            Stop chasing quotations across a dozen shops. NOD connects you directly
                            with trusted material suppliers for tiles, sanitaryware, furniture,
                            electricals, and finishes — pre-vetted for quality, priced fairly, and
                            ready to deliver to your site on time.
                        </p>
                        <ul className="space-y-3">
                            {[
                                "Trade-rate pricing on verified suppliers",
                                "Direct site delivery, tracked end-to-end",
                                "Quality checked before it reaches your project",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-3 text-sm" style={{ color: MUTED }}>
                                    <Sparkles size={16} strokeWidth={1.75} style={{ color: GOLD, marginTop: 2 }} />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div
                        className="h-64 md:h-80 rounded-2xl border flex items-center justify-center"
                        style={{ borderColor: WHITE_BORDER, backgroundColor: "rgba(255,255,255,0.04)" }}
                    >
                        <Handshake size={64} strokeWidth={1.25} style={{ color: GOLD, opacity: 0.6 }} />
                    </div>
                </div>

            </div>
        </section>
    )
}