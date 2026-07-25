import "../theme.css"

export default function NewHeritage() {
    return (
        <section className="relative py-24 px-4 md:px-8 bg-[var(--background)] overflow-hidden">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

                {/* IMAGE COLLAGE LEFT */}
                <div className="lg:col-span-6 relative h-[420px] md:h-[500px] w-full max-w-md mx-auto lg:mx-0">

                    {/* Back image */}
                    <div className="absolute left-0 top-[35%] h-[55%] w-[55%] overflow-hidden rounded-sm shadow-2xl z-0">
                        <img
                            src="https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200"
                            alt="Modern interior mood board"
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    </div>

                    {/* Front image */}
                    <div className="absolute right-0 top-0 h-[85%] w-[65%] overflow-hidden rounded-sm shadow-2xl z-10">
                        <img
                            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200"
                            alt="Luxury living room"
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    </div>

                </div>

                {/* TEXT RIGHT */}
                {/* This block sits on the plain card/section background (not a photo),
                    so it uses the tokens that flip with light/dark mode
                    (--heading, --text) rather than the fixed --on-photo* tokens. */}
                <div className="lg:col-span-6 flex flex-col items-start">

                    <h2 className="text-4xl md:text-5xl font-serif text-[var(--heading)] leading-tight mb-2">
                        New Heritage
                    </h2>

                    <p className="text-2xl md:text-3xl font-serif italic text-[var(--heading)] leading-snug mb-6">
                        A design house rooted in tradition.
                    </p>

                    <p className="text-sm md:text-base text-[var(--text)] font-light leading-relaxed mb-10 opacity-90 max-w-lg">
                        For interior designer Shea McGee, design has always been about how a space makes you feel—not just how it looks. Since 2014, that philosophy has shaped Studio McGee and continues to guide every project today. Our New Heritage aesthetic is rooted in classic design principles and traditional craftsmanship, adapted through a modern lens—creating homes that feel collected, comfortable, and effortlessly timeless.
                    </p>

                    <a href="/about">
                        <button className="cursor-pointer rounded-none border border-[var(--gold)]/70 hover:border-[var(--gold)] px-8 py-3.5 text-[11px] tracking-[0.2em] font-semibold text-[var(--heading)] hover:bg-[var(--gold)]/10 transition-all duration-300">
                            ABOUT
                        </button>
                    </a>

                </div>

            </div>
        </section>
    )
}