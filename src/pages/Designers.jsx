import { motion } from "framer-motion";
import "../theme.css";

const root = getComputedStyle(document.documentElement);
const INK = root.getPropertyValue("--heading").trim();
const INK_SOFT = root.getPropertyValue("--text").trim();
const MUTED = root.getPropertyValue("--muted").trim();
const GOLD = root.getPropertyValue("--gold").trim();
const GOLD_HOVER = root.getPropertyValue("--gold-hover").trim();
const LINE = root.getPropertyValue("--border").trim();
const BG = root.getPropertyValue("--background").trim();
const SURFACE = root.getPropertyValue("--surface").trim();
// --heading flips to near-white in dark mode, so it's unsafe as a solid
// fill (white text on white button = invisible). --primary stays a
// consistent warm brown/tan in both themes — use it for solid fills.
const PRIMARY = root.getPropertyValue("--primary").trim();
const PRIMARY_HOVER = root.getPropertyValue("--primary-hover").trim();

/* ────────────────────────────────────────────────────────────────
   SAMPLE DATA
   Swap `seed` for real project photography paths once available —
   Lorem Picsum placeholders, seeded so they stay stable on reload.
   `size: "wide"` breaks a project out to full width for editorial
   rhythm, the way a portfolio page alternates hero shots with pairs.
──────────────────────────────────────────────────────────────── */

const PROJECTS = [
  { id: 1, title: "Banjara Hills Residence", designer: "Meera Sinha", location: "Hyderabad", year: 2025, size: "wide", seed: "nod-p1" },
  { id: 2, title: "The Lakeview Estate", designer: "Arjun Patel", location: "Bengaluru", year: 2025, seed: "nod-p2" },
  { id: 3, title: "Jubilee Hills Bungalow", designer: "Divya Rao", location: "Hyderabad", year: 2024, seed: "nod-p3" },
  { id: 4, title: "Whitefield Retreat", designer: "Kabir Malhotra", location: "Bengaluru", year: 2025, size: "wide", seed: "nod-p4" },
  { id: 5, title: "The Courtyard House", designer: "Meera Sinha", location: "Jaipur", year: 2024, seed: "nod-p5" },
  { id: 6, title: "Alibaug Weekend Home", designer: "Divya Rao", location: "Alibaug", year: 2025, seed: "nod-p6" },
  { id: 7, title: "Film Nagar Residence", designer: "Arjun Patel", location: "Hyderabad", year: 2025, size: "wide", seed: "nod-p7" },
];

const imgUrl = (seed, w = 1200, h = 900) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

/* ────────────────────────────────────────────────────────────────
   MAIN COMPONENT
──────────────────────────────────────────────────────────────── */

export default function ProjectsGallery() {
  return (
    <section id="projects" className="w-full" style={{ background: BG }}>
      {/* ── FULL-BLEED HERO ── */}


      <div className="max-w-2xl mx-auto px-5 sm:px-8 pt-4  pb-4 text-center">
        <div
          className="text-[10px] sm:text-xs font-semibold mb-5 uppercase"
          style={{ color: GOLD, letterSpacing: "3px" }}
        >
          Recent Work
        </div>
        <h1
          className="text-5xl sm:text-6xl md:text-7xl"
          style={{ fontFamily: "Georgia, serif", color: INK, letterSpacing: "0.5px" }}
        >
          Portfolio
        </h1>
      </div>

      {/* ── PROJECT LIST — large editorial tiles, alternating rhythm ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-20 sm:pb-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 lg:gap-x-10 gap-y-14 sm:gap-y-16">
          {PROJECTS.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`group text-left ${project.size === "wide" ? "sm:col-span-2" : ""}`}
            >
              {/* ── IMAGE + HOVER OVERLAY ── */}
              <div
                className={`relative w-full overflow-hidden cursor-pointer ${
                  project.size === "wide" ? "aspect-[16/9]" : "aspect-[4/5]"
                }`}
              >
                <img
                  src={imgUrl(
                    project.seed,
                    project.size === "wide" ? 1600 : 900,
                    project.size === "wide" ? 900 : 1125
                  )}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />

                {/* dim + reveal details on hover */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
                  style={{ background: "rgba(10,26,34,0.55)" }}
                >
                  <div
                    className="text-[10px] sm:text-xs font-semibold mb-3 uppercase translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out"
                    style={{ color: GOLD, letterSpacing: "2.5px" }}
                  >
                    {project.location} · {project.year}
                  </div>
                  <h3
                    className="text-xl sm:text-2xl md:text-3xl leading-snug translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out delay-75"
                    style={{ fontFamily: "Georgia, serif", color: "#ffffff" }}
                  >
                    {project.title}
                  </h3>
                  <div
                    className="text-xs sm:text-sm mt-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out delay-100"
                    style={{ color: "rgba(255,255,255,0.75)" }}
                  >
                    Designed by {project.designer}
                  </div>
                </div>
              </div>

              {/* ── STATIC CAPTION BELOW IMAGE (always visible) ── */}
              <div className="mt-4 sm:mt-5 flex items-baseline justify-between gap-4">
                <h3
                  className="text-lg sm:text-xl"
                  style={{ fontFamily: "Georgia, serif", color: INK }}
                >
                  {project.title}
                </h3>
                <span className="text-xs shrink-0" style={{ color: MUTED }}>
                  {project.location}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── WORK WITH US ── */}
      <div className="border-t" style={{ borderColor: LINE }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="w-full aspect-[4/3] overflow-hidden order-2 lg:order-1">
            <img
              src={imgUrl("nod-cta", 1200, 900)}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2
              className="text-3xl sm:text-4xl mb-5"
              style={{ fontFamily: "Georgia, serif", color: INK }}
            >
              Work With Us
            </h2>
            <p className="text-sm sm:text-base mb-8 max-w-md" style={{ color: INK_SOFT }}>
              Ready to start a project of your own? Tell us about your space and
              we'll match you with the right designer, architect, or contractor
              from our network to bring it to life.
            </p>
            <button
              className="px-7 py-4 text-xs sm:text-sm tracking-widest uppercase text-white transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ background: PRIMARY, outlineColor: GOLD }}
              onMouseEnter={(e) => (e.currentTarget.style.background = PRIMARY_HOVER)}
              onMouseLeave={(e) => (e.currentTarget.style.background = PRIMARY)}
            >
              Inquire Here
            </button>
          </div>
        </div>
      </div>

      {/* ── FOUNDER QUOTE ── */}
      <div className="border-t" style={{ borderColor: LINE, background: SURFACE }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-24 text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mx-auto mb-6">
            <img
              src={imgUrl("nod-founder", 200, 200)}
              alt="Meera Sinha"
              className="w-full h-full object-cover"
            />
          </div>
          <p
            className="text-xl sm:text-2xl md:text-3xl leading-snug mb-6"
            style={{ fontFamily: "Georgia, serif", color: INK, fontStyle: "italic" }}
          >
            "A well-designed room doesn't shout for attention — it simply feels
            right the moment you walk in."
          </p>
          <div className="text-xs sm:text-sm font-semibold uppercase" style={{ color: GOLD, letterSpacing: "1.5px" }}>
            xxxx xxxxx
          </div>
          <div className="text-xs sm:text-sm mt-1" style={{ color: MUTED }}>
            Founder & Creative Director
          </div>
        </div>
      </div>
    </section>
  );
}