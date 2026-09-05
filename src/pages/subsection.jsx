import "../theme.css"
import commercialImg from "../assets/commercial_interior.jpg"
import residentialImg from "../assets/residential_bedroom.jpg"

export default function NewHeritage() {
    return (
        <section className="relative py-24 px-4 md:px-8 bg-[var(--background)] overflow-hidden">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

                {/* IMAGE COLLAGE LEFT */}
                <div className="lg:col-span-6 relative h-[420px] md:h-[500px] w-full max-w-md mx-auto lg:mx-0">

                    {/* Back image */}
                    <div className="absolute left-0 top-[35%] h-[55%] w-[55%] overflow-hidden rounded-sm shadow-2xl z-0 border border-[var(--border)]">
                        <img
                            src={residentialImg}
                            alt="Luxury residential master suite"
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    </div>

                    {/* Front image */}
                    <div className="absolute right-0 top-0 h-[85%] w-[65%] overflow-hidden rounded-sm shadow-2xl z-10 border border-[var(--border)]">
                        <img
                            src={commercialImg}
                            alt="Royal heritage reception lounge"
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    </div>

                </div>

                {/* TEXT RIGHT */}
                <div className="lg:col-span-6 flex flex-col items-start">

                    <span className="text-xs uppercase tracking-[0.3em] text-[var(--gold)] font-bold block mb-3">
                        About Night Owl Designers
                    </span>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[var(--heading)] leading-tight mb-2">
                        Timeless Craftsmanship
                    </h2>

                    <p className="text-xl sm:text-2xl md:text-3xl font-serif italic text-[var(--heading)] leading-snug mb-6">
                        Bridging design vision with precision execution.
                    </p>

                    <p className="text-sm md:text-base text-[var(--text)] font-light leading-relaxed mb-10 opacity-90 max-w-lg">
                        At NOD (Night Owl Designers), we believe architectural and interior excellence demands seamless synergy between designers, structural engineers, contractors, and material suppliers. We bring every stakeholder together onto a unified, transparent marketplace to transform conceptual blueprints into iconic spaces built to endure for decades.
                    </p>

                    <a href="/About">
                        <button className="cursor-pointer rounded-none border border-[var(--gold)]/70 hover:border-[var(--gold)] px-8 py-3.5 text-[11px] tracking-[0.2em] font-semibold text-[var(--heading)] hover:bg-[var(--gold)]/10 transition-all duration-300">
                            ABOUT US
                        </button>
                    </a>

                </div>

            </div>
        </section>
    )
}