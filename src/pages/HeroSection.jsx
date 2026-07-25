


import { useState, useEffect, useCallback, useRef } from "react"
import "../theme.css"
import { useNavigate } from "react-router-dom"

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1800&q=80&auto=format&fit=crop",
    alt: "Warm-lit living room with sculptural furniture and brass accents",
  },
  {
    src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&q=80&auto=format&fit=crop",
    alt: "Minimalist bedroom suite with layered natural textures",
  },
  {
    src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1800&q=80&auto=format&fit=crop",
    alt: "Handcrafted dining space styled with ceramic and stone",
  },
  {
    src: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1800&q=80&auto=format&fit=crop",
    alt: "Sunlit reading corner with tailored upholstery",
  },
  {
    src: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1800&q=80&auto=format&fit=crop",
    alt: "Considered kitchen detail in warm stone and walnut",
  },
]

// Faster slide rotation: 5s instead of 6.5s
const SLIDE_DURATION = 5000

const ON_PHOTO = "#F7F3EA"
const ON_PHOTO_MUTED = "rgba(247,243,234,0.74)"
const ON_PHOTO_FAINT = "rgba(247,243,234,0.4)"
const ON_PHOTO_CTA_TEXT = "#241A12"

export default function HeroSection({ panelRef }) {
  const [current, setCurrent] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const rafId = useRef(null)
  const prefersReducedMotion = useRef(
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  ).current

  const navigate = useNavigate()

  const rootStyles = getComputedStyle(document.documentElement)
  const GOLD = rootStyles.getPropertyValue("--gold").trim() || "#D4AF37"

  const goTo = useCallback((i) => setCurrent(((i % heroImages.length) + heroImages.length) % heroImages.length), [])
  const goNext = useCallback(() => setCurrent((prev) => (prev + 1) % heroImages.length), [])

  // Faster entrance: kick off at 40ms instead of 80ms
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 40)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return
    const timer = setInterval(goNext, SLIDE_DURATION)
    return () => clearInterval(timer)
  }, [goNext, prefersReducedMotion])

  useEffect(() => {
    const tick = () => {
      if (panelRef?.current) {
        const top = panelRef.current.getBoundingClientRect().top
        const vh = window.innerHeight
        const raw = Math.min(Math.max(1 - top / vh, 0), 1)
        const eased = raw * raw * (3 - 2 * raw)
        setScrollProgress((prev) => (Math.abs(prev - eased) > 0.001 ? eased : prev))
      }
      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId.current)
  }, [panelRef])

  const blurAmount = scrollProgress * 14
  const dimAmount = 0.3 + scrollProgress * 0.55
  const outerScale = 1 + scrollProgress * 0.06
  const contentOpacity = Math.max(1 - scrollProgress * 1.6, 0)
  const contentShift = -scrollProgress * 36

  return (
    <div className="fixed inset-0 w-screen h-screen z-0 overflow-hidden font-[var(--font-body)]">
      <style>{`
        /* Font optimization: preload heading font with higher priority */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        
        @keyframes nod-kenburns {
          from { transform: scale(1); }
          to { transform: scale(1.09); }
        }
        @keyframes nod-eye-pulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes nod-rule-draw {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes nod-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes nod-chevron {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(5px); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .nod-kenburns, .nod-eye-pulse, .nod-chevron { animation: none !important; }
        }
      `}</style>

      {/* SCROLL-REACTIVE PHOTO LAYER */}
      <div
        className="absolute inset-0 will-change-[filter,transform]"
        style={{ transform: `scale(${outerScale})`, filter: `blur(${blurAmount}px)` }}
      >
        {heroImages.map((img, i) => {
          const active = i === current
          return (
            <div
              key={i}
              className="absolute inset-0 overflow-hidden"
              style={{ opacity: active ? 1 : 0, transition: "opacity 1s ease" }}
              aria-hidden={!active}
            >
              <img
                key={`${i}-${active}`}
                src={img.src}
                alt={img.alt}
                className={prefersReducedMotion ? "" : "nod-kenburns"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  animation: active && !prefersReducedMotion ? "nod-kenburns 5s ease-out forwards" : "none",
                }}
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          )
        })}
      </div>

      {/* Cinematic vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,8,6,0.62) 0%, rgba(10,8,6,0.12) 32%, rgba(10,8,6,0.22) 68%, rgba(10,8,6,0.72) 100%)",
        }}
      />

      {/* Scroll-driven dim layer */}
      <div className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: dimAmount }} />

      {/* CENTERED CONTENT */}
      <div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6"
        style={{ opacity: contentOpacity, transform: `translateY(${contentShift}px)` }}
      >
        {/* Signature mark — eye-lights */}
        <div
          className="flex items-center gap-3 mb-5"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.5s ease 0s, transform 0.5s ease 0s",
          }}
        >
          <span
            className={prefersReducedMotion ? "w-1.5 h-1.5 rounded-full" : "w-1.5 h-1.5 rounded-full nod-eye-pulse"}
            style={{ background: GOLD, animation: prefersReducedMotion ? "none" : "nod-eye-pulse 2.4s ease-in-out infinite" }}
          />
          <span className="font-[var(--font-heading)] text-[13px] tracking-[6px]" style={{ color: ON_PHOTO }}>
            NIGHT&nbsp;OWL&nbsp;DESIGNERS
          </span>
          <span
            className={prefersReducedMotion ? "w-1.5 h-1.5 rounded-full" : "w-1.5 h-1.5 rounded-full nod-eye-pulse"}
            style={{ background: GOLD, animation: prefersReducedMotion ? "none" : "nod-eye-pulse 2.4s ease-in-out infinite 1.2s" }}
          />
        </div>

        {/* Hairline rule — faster draw */}
        <div
          className="h-px mb-6"
          style={{
            width: 48,
            background: GOLD,
            transformOrigin: "center",
            animation: loaded && !prefersReducedMotion ? "nod-rule-draw 0.5s cubic-bezier(0.4,0,0.2,1) 0.15s both" : "none",
            transform: prefersReducedMotion ? "none" : undefined,
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.3s ease 0.15s",
          }}
        />

        {/* Eyebrow — much faster entrance */}
        <p
          className="mb-6 text-[11px] sm:text-xs uppercase"
          style={{
            color: GOLD,
            letterSpacing: "3px",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.5s ease 0.25s, transform 0.5s ease 0.25s",
          }}
        >
          Crafted After Hours · Made in India
        </p>

        {/* Headline — snappier entrance */}
        <h1
          className="font-[var(--font-heading)] text-3xl sm:text-5xl md:text-6xl leading-[1.15] max-w-4xl text-balance"
          style={{
            color: ON_PHOTO,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s",
          }}
        >
          The Poetry of Design{" "}
          <span style={{ color: GOLD, fontStyle: "italic", fontWeight: 400 }}>&amp;</span>
          <br />
          the Engineering of Craft
        </h1>

        {/* Subtext */}
        <p
          className="mt-6 max-w-md text-sm md:text-base leading-relaxed"
          style={{
            color: ON_PHOTO_MUTED,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.6s ease 0.45s, transform 0.6s ease 0.45s",
          }}
        >
          We turn architectural drawings into rooms people live in for
          decades — matched with designers, architects, and craftsmen who
          treat the details like the whole project.
        </p>

        {/* CTA Button — improved hover state */}
        <div
          style={{
            marginTop: 32,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.6s ease 0.55s, transform 0.6s ease 0.55s",
          }}
        >
          <button
            className="px-7 py-3.5 rounded-full text-xs md:text-sm font-medium tracking-[2px] uppercase transition-all duration-200 hover:shadow-lg hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 active:scale-95"
            style={{
              background: ON_PHOTO,
              color: ON_PHOTO_CTA_TEXT,
              outlineColor: GOLD,
            }}
            onClick={() => navigate("/signin")}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = GOLD
              e.currentTarget.style.color = ON_PHOTO
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = ON_PHOTO
              e.currentTarget.style.color = ON_PHOTO_CTA_TEXT
            }}
          >
            Start a Project
          </button>
        </div>
      </div>

      {/* SLIDE INDICATORS — enhanced visibility and interactivity */}
      <div
        className="absolute bottom-9 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2.5"
        style={{ opacity: contentOpacity }}
      >
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Show slide ${i + 1} of ${heroImages.length}`}
            aria-current={i === current}
            className="h-[3px] rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 hover:opacity-100"
            style={{
              width: i === current ? 24 : 12,
              background: i === current ? GOLD : "rgba(247,243,234,0.35)",
              outlineColor: GOLD,
              opacity: i === current ? 1 : 0.7,
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      {/* SCROLL CUE — faster animation */}
      <div
        className="absolute bottom-9 right-8 z-10 hidden sm:flex flex-col items-center gap-2"
        style={{ opacity: contentOpacity * 0.85 }}
      >
        <span className="text-[10px] tracking-[3px] uppercase" style={{ color: ON_PHOTO_FAINT, writingMode: "vertical-rl" }}>
          Scroll
        </span>
        <svg
          width="10"
          height="16"
          viewBox="0 0 10 16"
          fill="none"
          className={prefersReducedMotion ? "" : "nod-chevron"}
          style={{ animation: prefersReducedMotion ? "none" : "nod-chevron 1.2s ease-in-out infinite" }}
        >
          <path d="M1 1L5 6L9 1" stroke={ON_PHOTO_FAINT} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M1 8L5 13L9 8" stroke={ON_PHOTO_FAINT} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}