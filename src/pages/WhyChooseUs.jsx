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
import Navbar from "./Navbar"
import Footer from "./Footer"

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
        <div className="min-h-screen flex flex-col bg-[var(--background)]">
            <Navbar />
            <section
                className="pt-28 pb-24 px-6 md:px-8 bg-[var(--primary)] text-[var(--on-photo)] transition-colors duration-300 flex-1"
            >
                <div className="mx-auto max-w-7xl">

                    {/* Header */}
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <span
                            className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--gold)]"
                        >
                            Why Choose NOD
                        </span>
                        <h2
                            className="text-3xl md:text-5xl font-bold mt-4 mb-6 font-[var(--font-heading)] text-white"
                        >
                            One Platform. Every Piece of the Build.
                        </h2>
                        <p className="text-sm md:text-base leading-relaxed text-gray-300">
                            From the first sketch to the final material delivered on-site, NOD brings
                            together India's finest designers, architects, contractors, and material
                            suppliers — so you never have to build alone.
                        </p>
                    </div>

                    {/* Pillars grid — clear white-bordered boxes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                        {pillars.map(({ icon: Icon, title, desc }) => (
                            <div
                                key={title}
                                className="p-8 rounded-2xl border border-white/20 bg-white/[0.04] backdrop-blur-xs transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold)] hover:bg-white/[0.07]"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div
                                        className="h-12 w-12 flex items-center justify-center rounded-full border border-white/20 text-[var(--gold)] bg-white/[0.03]"
                                    >
                                        <Icon size={20} strokeWidth={1.75} />
                                    </div>
                                </div>
                                <h3
                                    className="text-lg font-bold mb-3 font-[var(--font-heading)] text-white"
                                >
                                    {title}
                                </h3>
                                <p className="text-sm leading-relaxed text-gray-300">
                                    {desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Material suppliers callout — clear white-bordered box */}
                    <div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center rounded-3xl border border-white/20 bg-white/[0.04] p-10 md:p-14 backdrop-blur-xs"
                    >
                        <div>
                            <span
                                className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--gold)]"
                            >
                                Sourcing, Simplified
                            </span>
                            <h3
                                className="text-2xl md:text-3xl font-bold mt-4 mb-5 font-[var(--font-heading)] text-white"
                            >
                                Find Every Material Supplier You Need — In One Place
                            </h3>
                            <p className="text-sm leading-relaxed mb-6 text-gray-300">
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
                                    <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                                        <Sparkles size={16} strokeWidth={1.75} className="text-[var(--gold)] mt-0.5 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div
                            className="h-64 md:h-80 rounded-2xl border border-white/20 bg-white/[0.02] flex items-center justify-center"
                        >
                            <Handshake size={64} strokeWidth={1.25} className="text-[var(--gold)] opacity-75" />
                        </div>
                    </div>

                </div>
            </section>
            <Footer />
        </div>
    )
}