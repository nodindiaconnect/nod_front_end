
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  Award,
  Compass,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import commercialImg from "../assets/commercial_interior.jpg"
import residentialImg from "../assets/residential_bedroom.jpg"

const METRICS = [
  { value: "12+", label: "Years of Practice" },
  { value: "500+", label: "Projects Delivered" },
  { value: "6", label: "Core Disciplines" },
  { value: "98%", label: "Client Retention" },
]

const PILLARS = [
  {
    icon: Compass,
    title: "Artistic Vision & Vastu",
    desc: "Harmonizing spatial energy, natural illumination, and bespoke aesthetics into functional living art.",
  },
  {
    icon: ShieldCheck,
    title: "Structural Integrity",
    desc: "Rigorous civil engineering and precision calculations ensuring enduring safety and longevity.",
  },
  {
    icon: Award,
    title: "End-to-End Execution",
    desc: "Unified coordination between architects, contractors, and suppliers with zero translation loss.",
  },
]

export default function FrozenMusicSection() {
  const navigate = useNavigate()

  return (
    <section
      id="philosophy"
      className="py-24 md:py-36 px-6 bg-[#0e0f13] relative overflow-hidden border-t border-b border-[#2B2623]/50"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main Primary Image */}
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#2B2623] shadow-2xl relative">
              <img
                src={commercialImg}
                alt="Luxury Grand Reception Interior"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block">
                    Heritage Project
                  </span>

                  <span className="text-white font-serif text-sm font-semibold">
                    Luxury Royal Reception Hall
                  </span>
                </div>

                <span className="px-3 py-1 rounded-full bg-[#18191d]/80 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono">
                  NOD Curated
                </span>
              </div>
            </div>

            {/* Secondary Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="absolute -bottom-8 -right-4 sm:-right-8 w-56 sm:w-64 aspect-[4/3] rounded-xl overflow-hidden border-4 border-[#0e0f13] shadow-2xl hidden sm:block"
            >
              <img
                src={residentialImg}
                alt="Contemporary Master Bedroom Suite"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-3 right-3 text-left">
                <span className="text-[9px] font-mono uppercase tracking-wider text-[#D4AF37] block">
                  Residential Suite
                </span>

                <span className="text-white font-serif text-xs font-medium truncate block">
                  Master Suite Sanctuary
                </span>
              </div>
            </motion.div>

            {/* Quality Badge */}
            <div className="absolute -top-4 -left-4 sm:left-6 px-4 py-2 rounded-xl bg-[#18191d]/90 backdrop-blur-md border border-[#D4AF37]/40 shadow-xl flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />

              <span className="text-xs font-serif font-medium text-white tracking-wide">
                Art & Engineering Harmony
              </span>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-left"
          >
            <p className="font-mono text-xs tracking-[0.3em] text-[#D4AF37] uppercase mb-4 font-semibold flex items-center gap-2">
              <span className="w-6 h-[1px] bg-[#D4AF37]" />
              Philosophy & Vision
            </p>

            <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-[#FFFFFF] tracking-tight leading-[1.15] mb-8">
              ARCHITECTURE IS <br />
              <span className="text-[#D4AF37] italic font-serif">
                FROZEN MUSIC
              </span>
            </h2>

            <div className="space-y-4 mb-10 text-[#D7D2CD] font-sans text-sm sm:text-base leading-relaxed">
              <p>
                We believe great architecture and interior environments emerge
                at the intersection of artistic intuition and disciplined
                engineering. Every project begins with understanding — the land,
                the light, the spatial flow, and the people who will inhabit the
                space.
              </p>

              <p>
                Our integrated ecosystem brings interior designers, structural
                architects, 3D visualizers, Vastu consultants, and construction
                professionals under one unified vision. No translation errors.
                No compromised quality. Just seamless realization from sketch to
                turnkey delivery.
              </p>

              <p>
                We don't just shape spaces — we engineer experiences. Every
                material choice, every structural calculation, and every lighting
                angle serves the singular purpose of creating environments that
                inspire, protect, and endure.
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-[#2B2623] mb-10">
              {METRICS.map((item, idx) => (
                <div key={idx} className="text-left">
                  <div className="font-serif font-bold text-2xl sm:text-3xl text-[#D4AF37] mb-1">
                    {item.value}
                  </div>

                  <div className="font-mono text-[11px] tracking-widest uppercase text-[#A79D94]">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

        
          </motion.div>

        </div>
      </div>
    </section>
  )
}
