import { useEffect, useRef, useState } from "react"
import { Compass, ShieldCheck, Users, MapPin, ArrowRight } from "lucide-react"
import "../theme.css"

/* Small helper: fades a section in once it enters the viewport */
function useReveal() {
    const ref = useRef(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const node = ref.current
        if (!node) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.15 }
        )
        observer.observe(node)
        return () => observer.disconnect()
    }, [])

    return [ref, visible]
}

export default function About() {
    const [storyRef, storyVisible] = useReveal()
    const [valuesRef, valuesVisible] = useReveal()
    const [processRef, processVisible] = useReveal()

    const values = [
        {
            icon: ShieldCheck,
            title: "Vetted, not just listed",
            copy: "Every architect, designer, and contractor on NOD is reviewed for portfolio quality and past-project conduct before they can bid on a single brief.",
        },
        {
            icon: Compass,
            title: "Milestone-based trust",
            copy: "Payments release against agreed project milestones, not promises — so both sides know exactly where a project stands, always.",
        },
        {
            icon: MapPin,
            title: "Built for India, city by city",
            copy: "From metro high-rises to tier-2 townhouses, our network understands local material, labour, and municipal realities — not a one-size template.",
        },
    ]

    const steps = [
        {
            n: "01",
            title: "Share the brief",
            copy: "Tell us the space, the budget, and the feeling you're after. Two minutes, no jargon required.",
        },
        {
            n: "02",
            title: "Meet your matches",
            copy: "We shortlist professionals whose portfolio and rates actually fit your project — you choose who to talk to.",
        },
        {
            n: "03",
            title: "Collaborate on NOD",
            copy: "Briefs, drawings, and revisions stay in one thread, so nothing gets lost between a call and a WhatsApp message.",
        },
        {
            n: "04",
            title: "Build, on milestones",
            copy: "Funds release as work is delivered and approved — protection for your budget and their time.",
        },
    ]

    return (
        <div style={{ backgroundColor: "var(--background)" }}>

            {/* ============ HERO ============ */}
            <section
                className="relative overflow-hidden px-6 md:px-8 pt-28 pb-24"
                style={{ backgroundColor: "var(--primary)" }}
            >
                {/* Blueprint grid texture */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(212,175,55,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.07) 1px, transparent 1px)",
                        backgroundSize: "42px 42px",
                    }}
                />

                <div className="relative mx-auto max-w-5xl">
                    {/* Corner registration marks — drafting-sheet reference */}
                    <div className="relative pt-10 pb-12 px-2 md:px-6">
                        {[
                            "top-0 left-0 border-t border-l",
                            "top-0 right-0 border-t border-r",
                            "bottom-0 left-0 border-b border-l",
                            "bottom-0 right-0 border-b border-r",
                        ].map((pos) => (
                            <span
                                key={pos}
                                className={`absolute h-4 w-4 md:h-5 md:w-5 ${pos}`}
                                style={{ borderColor: "var(--gold)" }}
                            />
                        ))}

                        <p
                            className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-6"
                            style={{ color: "var(--gold)" }}
                        >
                            About NOD
                        </p>

                        <h1
                            className="font-[var(--font-heading)] leading-[1.05] mb-8"
                            style={{
                                color: "var(--surface)",
                                fontSize: "clamp(2.25rem, 5vw, 4rem)",
                            }}
                        >
                            Good design doesn't
                            <br />
                            keep office hours.
                            <span style={{ color: "var(--gold)" }}>—neither do we.</span>
                        </h1>

                        <p
                            className="max-w-xl text-base leading-relaxed"
                            style={{ color: "rgba(255,255,255,0.75)" }}
                        >
                            NOD is India's marketplace for interior designers, architects, and
                            contractors — built so a homeowner in Betul and a studio in Mumbai
                            can find each other, agree on scope, and build something real
                            without the usual back-and-forth.
                        </p>

                        {/* Spec-sheet style stat row */}
                        <div className="flex flex-wrap gap-x-10 gap-y-4 mt-12">
                            {[
                                ["500+", "Verified professionals"],
                                ["30+", "Cities served"],
                                ["₹0", "Upfront platform fees"],
                            ].map(([stat, label], i) => (
                                <div key={label} className="flex items-center gap-10">
                                    <div>
                                        <p
                                            className="font-[var(--font-heading)] text-3xl"
                                            style={{ color: "var(--surface)" }}
                                        >
                                            {stat}
                                        </p>
                                        <p
                                            className="text-[11px] uppercase tracking-widest mt-1"
                                            style={{ color: "rgba(255,255,255,0.55)" }}
                                        >
                                            {label}
                                        </p>
                                    </div>
                                    {i < 2 && (
                                        <span
                                            className="hidden sm:block h-10 w-px"
                                            style={{ backgroundColor: "var(--gold)", opacity: 0.4 }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ STORY ============ */}
            <section
                ref={storyRef}
                className="px-6 md:px-8 py-24"
                style={{ backgroundColor: "var(--background)" }}
            >
                <div
                    className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-12 items-center transition-all duration-700"
                    style={{
                        opacity: storyVisible ? 1 : 0,
                        transform: storyVisible ? "translateY(0)" : "translateY(16px)",
                    }}
                >
                    <div className="md:col-span-7">
                        <p
                            className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-5"
                            style={{ color: "var(--muted)" }}
                        >
                            Why we started
                        </p>
                        <h2
                            className="font-[var(--font-heading)] text-3xl md:text-4xl mb-6 leading-tight"
                            style={{ color: "var(--heading)" }}
                        >
                            The best conversations about a home happen late,
                            over a half-finished sketch.
                        </h2>
                        <p
                            className="text-sm md:text-base leading-relaxed mb-4"
                            style={{ color: "var(--text)" }}
                        >
                            NOD — Night Owl Designers — takes its name from that habit. Our
                            founders spent years watching good design ideas die in inboxes:
                            a designer's quote lost in an email chain, a contractor's
                            timeline never confirmed in writing, a client left guessing
                            whether a milestone was actually met.
                        </p>
                        <p
                            className="text-sm md:text-base leading-relaxed"
                            style={{ color: "var(--text)" }}
                        >
                            So we built a single place for the whole brief — matching,
                            scoping, and payment — to live. Not a directory. Not another
                            group chat. A workspace built around how design projects
                            actually get finished.
                        </p>
                    </div>

                    <div className="md:col-span-5">
                        <div
                            className="rounded-lg border p-8 aspect-[4/5] flex items-center justify-center"
                            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
                        >
                            {/* Simple line-art elevation, in brand strokes */}
                            <svg viewBox="0 0 200 240" className="w-full h-full">
                                <rect x="20" y="60" width="160" height="150" fill="none" stroke="var(--muted)" strokeWidth="1.5" />
                                <polygon points="20,60 100,15 180,60" fill="none" stroke="var(--gold)" strokeWidth="2" />
                                <line x1="20" y1="60" x2="20" y2="210" stroke="var(--muted)" strokeWidth="1" />
                                <line x1="180" y1="60" x2="180" y2="210" stroke="var(--muted)" strokeWidth="1" />
                                <rect x="45" y="120" width="30" height="90" fill="none" stroke="var(--muted)" strokeWidth="1" />
                                <rect x="90" y="90" width="40" height="40" fill="none" stroke="var(--muted)" strokeWidth="1" />
                                <rect x="145" y="120" width="25" height="55" fill="none" stroke="var(--muted)" strokeWidth="1" />
                                <line x1="0" y1="210" x2="200" y2="210" stroke="var(--gold)" strokeWidth="1.5" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ VALUES ============ */}
            <section
                ref={valuesRef}
                className="px-6 md:px-8 py-24"
                style={{ backgroundColor: "var(--background-secondary)" }}
            >
                <div className="mx-auto max-w-6xl">
                    <p
                        className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-4 text-center"
                        style={{ color: "var(--muted)" }}
                    >
                        What we hold the line on
                    </p>
                    <h2
                        className="font-[var(--font-heading)] text-3xl md:text-4xl text-center mb-16"
                        style={{ color: "var(--heading)" }}
                    >
                        Three things every project runs on
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {values.map(({ icon: Icon, title, copy }, i) => (
                            <div
                                key={title}
                                className="group rounded-lg border p-8 transition-all duration-500"
                                style={{
                                    borderColor: "var(--border)",
                                    backgroundColor: "var(--surface)",
                                    opacity: valuesVisible ? 1 : 0,
                                    transform: valuesVisible ? "translateY(0)" : "translateY(20px)",
                                    transitionDelay: `${i * 120}ms`,
                                }}
                            >
                                <div
                                    className="h-11 w-11 rounded-full flex items-center justify-center mb-6 border transition-colors duration-300"
                                    style={{ borderColor: "var(--gold)" }}
                                >
                                    <Icon size={18} style={{ color: "var(--gold)" }} />
                                </div>
                                <h3
                                    className="font-[var(--font-heading)] text-xl mb-3"
                                    style={{ color: "var(--heading)" }}
                                >
                                    {title}
                                </h3>
                                <p
                                    className="text-sm leading-relaxed"
                                    style={{ color: "var(--text)" }}
                                >
                                    {copy}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ PROCESS ============ */}
            <section
                ref={processRef}
                className="px-6 md:px-8 py-24"
                style={{ backgroundColor: "var(--background)" }}
            >
                <div className="mx-auto max-w-6xl">
                    <p
                        className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-4 text-center"
                        style={{ color: "var(--muted)" }}
                    >
                        How it runs
                    </p>
                    <h2
                        className="font-[var(--font-heading)] text-3xl md:text-4xl text-center mb-20"
                        style={{ color: "var(--heading)" }}
                    >
                        From brief to build, on one thread
                    </h2>

                    <div className="relative grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6">
                        {/* dimension line connecting steps, desktop only */}
                        <div
                            className="hidden md:block absolute left-0 right-0 top-[22px] h-px"
                            style={{ backgroundColor: "var(--gold)", opacity: 0.35 }}
                        />
                        {steps.map((step, i) => (
                            <div
                                key={step.n}
                                className="relative transition-all duration-500"
                                style={{
                                    opacity: processVisible ? 1 : 0,
                                    transform: processVisible ? "translateY(0)" : "translateY(20px)",
                                    transitionDelay: `${i * 130}ms`,
                                }}
                            >
                                {/* tick mark on the dimension line */}
                                <div
                                    className="hidden md:block absolute w-px h-3"
                                    style={{ top: "17px", left: 0, backgroundColor: "var(--gold)" }}
                                />
                                <p
                                    className="font-[var(--font-heading)] text-sm mb-4"
                                    style={{ color: "var(--gold)" }}
                                >
                                    {step.n}
                                </p>
                                <h3
                                    className="text-base font-semibold mb-2"
                                    style={{ color: "var(--heading)" }}
                                >
                                    {step.title}
                                </h3>
                                <p
                                    className="text-sm leading-relaxed"
                                    style={{ color: "var(--text)" }}
                                >
                                    {step.copy}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ CTA ============ */}
            {/* <section
                className="px-6 md:px-8 py-20"
                style={{ backgroundColor: "var(--primary)" }}
            >
                <div className="mx-auto max-w-4xl text-center">
                    <h2
                        className="font-[var(--font-heading)] text-3xl md:text-4xl mb-5"
                        style={{ color: "var(--surface)" }}
                    >
                        Bring your brief. We'll bring the right people.
                    </h2>
                    <p
                        className="text-sm md:text-base mb-10 max-w-xl mx-auto"
                        style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                        Whether you're planning a single room or a full build, NOD gets you
                        talking to the right professional by the end of the week.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        
                         <a   href="/Signin"
                            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold transition-transform duration-300 hover:-translate-y-0.5"
                            style={{ backgroundColor: "var(--gold)", color: "var(--primary)" }}
                        >
                            Post a Project <ArrowRight size={16} />
                        </a>
                        
                        <a    href="/Signin"
                            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold border transition-colors duration-300"
                            style={{ borderColor: "rgba(255,255,255,0.3)", color: "var(--surface)" }}
                        >
                            <Users size={16} /> Join as a Professional
                        </a>
                    </div>
                </div>
            </section> */}
        </div>
    )
}