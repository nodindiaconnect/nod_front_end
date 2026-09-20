import { useEffect, useRef, useState } from "react";
import {
  Home,
  Building2,
  Boxes,
  Trees,
  Palette,
  Hammer,
  Package,
  ArrowRight,
  ArrowUpRight,
  Plus,
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import "../theme.css";
import { ThemeToggle } from "../context/ThemeContext";
import Profile from "../assets/founder_optimized.jpg";
import logo from "../assets/logo.png";
import commercialImg from "../assets/commercial_interior.jpg";
import residentialImg from "../assets/residential_bedroom.jpg";
import structuralImg from "../assets/structural_blueprint.jpg";

const founder = Profile;

const heroImage =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80";
const purposeImage =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80";
const ctaImage =
  "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1600&q=80";

/* ---------- helpers ---------- */

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function CountUp({ value, duration = 1400 }) {
  const ref = useRef(null);
  const started = useRef(false);
  const [display, setDisplay] = useState(() => {
    const m = value.match(/[\d.]+/);
    return m ? "0" + value.replace(m[0], "") : value;
  });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const match = value.match(/[\d.]+/);
    if (!match) return;
    const numeric = parseFloat(match[0]);
    const suffix = value.replace(match[0], "");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * numeric) + suffix);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{display}</span>;
}

function Eyebrow({ children }) {
  return (
    <p
      className="text-[11px] font-semibold uppercase tracking-[0.28em] mb-4"
      style={{ color: "var(--gold)" }}
    >
      {children}
    </p>
  );
}

export default function About() {
  const [purposeRef, purposeVisible] = useReveal();
  const [disciplinesRef, disciplinesVisible] = useReveal();
  const [founderRef, founderVisible] = useReveal();
  const [statsRef, statsVisible] = useReveal();
  const [processRef, processVisible] = useReveal();
  const [galleryRef, galleryVisible] = useReveal();
  const [testimonialsRef, testimonialsVisible] = useReveal();
  const [faqRef, faqVisible] = useReveal();

  const [openFaq, setOpenFaq] = useState(0);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [showAllStories, setShowAllStories] = useState(false);

  const [gallery, setGallery] = useState([
    { label: "Commercial Interiors", img: commercialImg },
    { label: "Residential Master Suites", img: residentialImg },
    { label: "Structural Engineering & Blueprints", img: structuralImg },
  ]);
  const [galleryFading, setGalleryFading] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const galleryHover = useRef(false);

  /* thin gold progress bar tracking scroll position */
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      setScrollPct(max > 0 ? (scrolled / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const rotateGallery = (dir) => {
    setGalleryFading(true);
    setTimeout(() => {
      setGallery((g) =>
        dir === "next" ? [...g.slice(1), g[0]] : [g[g.length - 1], ...g.slice(0, -1)],
      );
      setGalleryFading(false);
    }, 220);
  };

  /* gentle autoplay for the gallery, paused on hover */
  useEffect(() => {
    const id = setInterval(() => {
      if (!galleryHover.current) rotateGallery("next");
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const disciplines = [
    { icon: Home, title: "Designers", copy: "Spaces that feel like home" },
    { icon: Building2, title: "Architects", copy: "Structures that inspire" },
    { icon: Boxes, title: "BIM Engineers", copy: "Accurate, collaborative models" },
    { icon: Trees, title: "Landscape Designers", copy: "Outdoor spaces that breathe" },
    { icon: Palette, title: "Exterior Designers", copy: "Facades that make an impact" },
    { icon: Hammer, title: "Contractors", copy: "Ideas, built with precision" },
    { icon: Package, title: "Material Suppliers", copy: "Quality materials within reach" },
  ];

  const purposePoints = [
    { n: "01", title: "People", copy: "A global community of experts" },
    { n: "02", title: "Projects", copy: "From concept to completion" },
    { n: "03", title: "Possibilities", copy: "Built through collaboration" },
  ];

  const stats = [
    { value: "500+", label: "Professionals onboarded" },
    { value: "100+", label: "Projects enabled" },
    { value: "10+", label: "Cities across India" },
    { value: "Global", label: "Vision for tomorrow" },
  ];

  const steps = [
    { n: "01", title: "Share the brief", copy: "Tell us the space, budget, and what you have in mind." },
    { n: "02", title: "Meet your match", copy: "We shortlist the right professionals for you." },
    { n: "03", title: "Collaborate on NOD", copy: "Chat, share files, review, and iterate in one place." },
    { n: "04", title: "Build, on time", copy: "Get it delivered with clarity, transparency, and trust." },
  ];

  const allTestimonials = [
    {
      quote:
        "NOD made it incredibly easy to find the right designer for our home. The process was smooth, transparent, and actually enjoyable.",
      name: "Ritika Sharma",
      role: "Homeowner, Pune",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    },
    {
      quote:
        "A single platform where architects, contractors, and suppliers come together — this is exactly what the industry needed.",
      name: "Arjun Mehta",
      role: "Designer, NOD Professional",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    },
    {
      quote:
        "The project proposals and client matching on NOD are seamless. We successfully completed 4 commercial fit-outs in record time with verified suppliers.",
      name: "Vikramaditya Patil",
      role: "Principal Architect, Bengaluru",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    },
    {
      quote:
        "Transparent milestone payments and verified contractors gave us complete peace of mind while constructing our villa.",
      name: "Ananya Deshmukh",
      role: "Property Owner, Mumbai",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    },
  ];

  const displayedTestimonials = showAllStories ? allTestimonials : allTestimonials.slice(0, 2);

  const allFaqs = [
    {
      q: "1. What is NOD Marketplace?",
      a: "NOD Marketplace is a technology-driven platform designed to connect clients with professionals and businesses across the design and construction industry — including designers, architects, BIM engineers, landscape designers, contractors, and material suppliers.",
    },
    {
      q: "2. Who can use NOD Marketplace?",
      a: "The platform is designed for homeowners and property owners, businesses and commercial clients, designers and architects, BIM and CAD professionals, landscape and exterior designers, contractors, construction professionals, and building material suppliers.",
    },
    {
      q: "3. How can I post a project?",
      a: "Clients can create a project by providing details such as project type, location, requirements, budget, timeline, and required services. Once published, relevant professionals can review the project and submit their proposals or bids.",
    },
    {
      q: "4. How does the bidding system work?",
      a: "After a project is posted, eligible professionals can review the requirements and submit their proposals. Clients can compare different professionals based on their portfolio, experience, pricing, and proposal before making a decision.",
    },
    {
      q: "5. Can I choose a designer or contractor based on their portfolio?",
      a: "Yes. Professionals can create profiles showcasing their experience, previous projects, services, skills, and portfolio. Clients can review these profiles before selecting a professional.",
    },
    {
      q: "6. What types of services are available?",
      a: "Depending on the professionals available on the platform, services may include: Interior Design, Architectural Design, Exterior & Elevation Design, Landscape Design, BIM Services, AutoCAD & 2D Drawings, 3D Visualization & Rendering, Structural Design, Construction & Contracting, and Building Material Supply.",
    },
    {
      q: "7. Can professionals join the marketplace?",
      a: "Yes. Designers, architects, engineers, contractors, and other construction professionals can create a professional profile and showcase their services and portfolio to potential clients.",
    },
    {
      q: "8. Can material suppliers join the platform?",
      a: "Yes. Material suppliers can create business profiles and showcase their products and services to customers and professionals looking for construction and design materials.",
    },
    {
      q: "9. How do I find professionals in my area?",
      a: "The marketplace is designed to help clients discover professionals based on their service requirements and location, making it easier to find relevant local or remote professionals.",
    },
    {
      q: "10. Can I compare multiple proposals?",
      a: "Yes. Clients can compare proposals from different professionals based on factors such as pricing, experience, portfolio, services offered, and project requirements.",
    },
    {
      q: "11. How are professionals selected?",
      a: "Clients have the freedom to evaluate professionals based on their profiles, portfolios, experience, proposals, pricing, and other available information before making their selection.",
    },
    {
      q: "12. Is NOD Marketplace only for residential projects?",
      a: "No. The platform can support a wide range of projects, including residential, commercial, retail, hospitality, office, renovation, and other construction or design projects.",
    },
    {
      q: "13. Can I hire freelancers for individual projects?",
      a: "Yes. The marketplace is designed to support project-based work, allowing clients to find and hire freelancers and professionals according to their specific requirements.",
    },
    {
      q: "14. Can professionals work remotely?",
      a: "Yes. Many design-related services such as interior design, architectural drawings, BIM, CAD, 3D visualization, and rendering can be delivered remotely.",
    },
    {
      q: "15. How does payment work?",
      a: "Payments can be handled through the marketplace's payment system where available. Payment and transaction features may vary depending on the services and marketplace implementation.",
    },
    {
      q: "16. Does NOD Marketplace charge a commission?",
      a: "The marketplace may charge a platform commission or service fee on eligible transactions. Applicable fees will be communicated to users before completing a transaction.",
    },
    {
      q: "17. How can I contact a professional?",
      a: "Once you find a suitable professional, you can use the communication features provided by the marketplace to discuss your project requirements, scope, pricing, and timeline.",
    },
    {
      q: "18. Can I post a project for free?",
      a: "Project-posting availability and any applicable fees depend on the marketplace's current pricing structure. Check the platform's latest pricing information when posting your project.",
    },
    {
      q: "19. How do I create a professional profile?",
      a: "Professionals can register on the platform and build their profile by adding their services, experience, skills, portfolio, location, and other relevant information.",
    },
    {
      q: "20. What makes NOD Marketplace different?",
      a: "NOD Marketplace aims to bring multiple parts of the design and construction ecosystem together in one platform — helping clients discover professionals, compare proposals, hire talent, and find construction-related services and materials more efficiently.",
    },
  ];

  const displayedFaqs = showAllFaqs ? allFaqs : allFaqs.slice(0, 6);

  const tickerWords = ["Designers", "Architects", "BIM Engineers", "Landscape Designers", "Exterior Designers", "Contractors", "Material Suppliers"];

  return (
    <div style={{ backgroundColor: "var(--background)" }} className="overflow-x-hidden min-h-screen">
      {/* ---------- shared motion styles ---------- */}
      <style>{`
        @keyframes nodFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes nodKenBurns {
          from { transform: scale(1); }
          to { transform: scale(1.09); }
        }
        @keyframes nodFloat {
          0%, 100% { transform: translateY(0) rotate(0.5deg); }
          50% { transform: translateY(-10px) rotate(-0.5deg); }
        }
        @keyframes nodPulseGlow {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.15); }
        }
        @keyframes nodMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .nod-hero-in { animation: nodFadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both; }
        .nod-kenburns { animation: nodKenBurns 16s ease-in-out infinite alternate; }
        .nod-float { animation: nodFloat 6s ease-in-out infinite; }
        .nod-glow { animation: nodPulseGlow 5s ease-in-out infinite; }
        .nod-marquee-track { animation: nodMarquee 26s linear infinite; }
        .nod-marquee-track:hover { animation-play-state: paused; }
        .nod-card-hover { transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease, border-color 0.4s ease; }
        .nod-card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 40px -20px rgba(28,23,18,0.25); border-color: var(--gold); }
        .nod-img-zoom { transition: transform 0.7s cubic-bezier(0.16,1,0.3,1); }
        .nod-img-zoom-wrap:hover .nod-img-zoom { transform: scale(1.08); }
        .nod-icon-hover { transition: transform 0.45s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s ease, background-color 0.3s ease; }
        .nod-discipline:hover .nod-icon-hover { transform: rotate(-8deg) scale(1.08); border-color: var(--gold); }
        .nod-btn { transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease; }
        .nod-btn:hover { transform: translateY(-3px); }
        @media (prefers-reduced-motion: reduce) {
          .nod-hero-in, .nod-kenburns, .nod-float, .nod-glow, .nod-marquee-track { animation: none !important; }
        }
      `}</style>

      {/* Progress line */}
      <div
        className="fixed top-0 left-0 h-[3px] z-50 pointer-events-none"
        style={{ width: `${scrollPct}%`, backgroundColor: "var(--gold)", transition: "width 0.1s linear" }}
      />

      {/* ============ TOP NAVBAR WITH HOME BUTTON ============ */}
      <header className="sticky top-0 z-40 bg-[#1b130f]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="Night Owl Designers" className="w-8 h-8 rounded-full object-cover" />
          <h2 className="font-[var(--font-heading)] text-base sm:text-lg text-white font-bold tracking-tight">
            Night Owl <span className="text-[var(--gold)]">Designers</span>
          </h2>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-white hover:bg-[var(--gold)] hover:text-[#1b130f] transition font-semibold"
          >
            <Home size={14} />
            <span>Home</span>
          </Link>
          <Link to="/portfolios" className="text-gray-300 hover:text-white transition hidden sm:inline-block">
            Portfolios
          </Link>
          <Link to="/supplier-products" className="text-gray-300 hover:text-white transition hidden sm:inline-block">
            Suppliers
          </Link>
          <Link to="/contact" className="text-gray-300 hover:text-white transition hidden sm:inline-block">
            Contact
          </Link>
          <ThemeToggle />
          <Link
            to="/Signup"
            className="px-4 py-1.5 rounded-full bg-[var(--gold)] text-[#1b130f] font-semibold hover:brightness-110 transition"
          >
            Get started
          </Link>
        </nav>
      </header>

      {/* ============ HERO (High-Contrast & Visible Text) ============ */}
      <section className="relative">
        <div className="relative min-h-[580px] md:min-h-[640px] w-full overflow-hidden flex items-center">
          <img
            src={heroImage}
            alt="Warmly lit dining room at night"
            className="absolute inset-0 h-full w-full object-cover nod-kenburns"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(100deg, rgba(15,12,9,0.92) 20%, rgba(15,12,9,0.7) 65%, rgba(15,12,9,0.85) 100%)" }}
          />
          <div
            className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full nod-glow"
            style={{ background: "radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)" }}
          />

          <div className="relative z-10 h-full mx-auto max-w-7xl px-6 md:px-10 py-16 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-5 nod-hero-in">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--gold)" }} />
              <p
                className="text-xs font-bold uppercase tracking-[0.3em]"
                style={{ color: "var(--gold)", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
              >
                About NOD
              </p>
            </div>

            <h1
              className="nod-hero-in font-[var(--font-heading)] leading-[1.12] max-w-2xl font-bold tracking-tight"
              style={{
                color: "#FFFFFF",
                fontSize: "clamp(2.2rem, 5.5vw, 3.6rem)",
                animationDelay: "0.15s",
                textShadow: "0 2px 14px rgba(0,0,0,0.7)",
              }}
            >
              Good design doesn't keep office hours.
              <br />
              <span style={{ color: "var(--gold)", fontStyle: "italic", fontWeight: 600 }}>Neither do we.</span>
            </h1>

            <p
              className="nod-hero-in max-w-xl text-base sm:text-lg leading-relaxed mt-6 font-normal"
              style={{
                color: "#F7F3EA",
                animationDelay: "0.28s",
                textShadow: "0 1px 8px rgba(0,0,0,0.8)",
              }}
            >
              NOD is a technology-driven marketplace for the global design and
              construction industry — bringing designers, architects,
              BIM engineers, landscape and exterior designers, contractors,
              and material suppliers onto one thread, so a project never has
              to live across five different apps.
            </p>

            <div className="nod-hero-in flex items-center gap-2.5 mt-8" style={{ animationDelay: "0.4s" }}>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--gold)" }} />
              <span className="text-sm font-medium tracking-wide" style={{ color: "#F7F3EA", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                Starting in India, built to scale globally.
              </span>
            </div>

            <div className="hidden md:flex flex-col items-end gap-1.5 absolute right-10 top-1/2 -translate-y-1/2">
              {["SPACES", "PEOPLE", "IDEAS", "TOGETHER"].map((w, i) => (
                <span
                  key={w}
                  className="nod-hero-in text-[11px] font-bold tracking-[0.25em]"
                  style={{ color: "rgba(255,255,255,0.5)", animationDelay: `${0.5 + i * 0.1}s` }}
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ticker strip */}
        <div className="overflow-hidden border-t border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
          <div className="flex whitespace-nowrap py-3.5 nod-marquee-track w-max">
            {[...Array(2)].map((_, loop) => (
              <div key={loop} className="flex items-center">
                {tickerWords.map((t) => (
                  <span
                    key={t + loop}
                    className="mx-5 text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{ color: "var(--heading)" }}
                  >
                    {t} <span style={{ color: "var(--gold)" }}>◆</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ OUR PURPOSE ============ */}
      <section
        ref={purposeRef}
        className="px-6 md:px-10 py-20 md:py-28"
        style={{ backgroundColor: "var(--background)" }}
      >
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-center">
          <div
            className="md:col-span-4 transition-all duration-700"
            style={{ opacity: purposeVisible ? 1 : 0, transform: purposeVisible ? "translateY(0)" : "translateY(18px)" }}
          >
            <Eyebrow>Our Purpose</Eyebrow>
            <h2
              className="font-[var(--font-heading)] text-3xl md:text-[2.4rem] leading-tight mb-5"
              style={{ color: "var(--heading)" }}
            >
              A more connected way to build.
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text)" }}>
              We exist to simplify how the design and construction world
              collaborates. By uniting talent, tools, and trust on one
              platform, we help great ideas move from concept to reality —
              faster, smarter, and together.
            </p>
          </div>

          <div
            className="md:col-span-5 nod-img-zoom-wrap transition-all duration-700 delay-150"
            style={{ opacity: purposeVisible ? 1 : 0, transform: purposeVisible ? "scale(1)" : "scale(0.96)" }}
          >
            <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-xl border border-[var(--border)]">
              <img src={purposeImage} alt="Architectural balcony detail" className="nod-img-zoom h-full w-full object-cover" />
            </div>
          </div>

          <div className="md:col-span-3 flex md:flex-col gap-8 md:pl-4 flex-wrap">
            {purposePoints.map(({ n, title, copy }, i) => (
              <div
                key={n}
                className="flex items-start gap-3 transition-all duration-700"
                style={{
                  opacity: purposeVisible ? 1 : 0,
                  transform: purposeVisible ? "translateX(0)" : "translateX(14px)",
                  transitionDelay: `${300 + i * 130}ms`,
                }}
              >
                <Plus size={14} className="mt-1 flex-shrink-0" style={{ color: "var(--gold)" }} />
                <div>
                  <p className="text-[11px] font-semibold tracking-wide mb-1" style={{ color: "var(--gold)" }}>
                    {n}
                  </p>
                  <p className="text-sm font-semibold mb-1" style={{ color: "var(--heading)" }}>
                    {title}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text)" }}>
                    {copy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SEVEN DISCIPLINES (Interior Designers -> Designers) ============ */}
      <section
        ref={disciplinesRef}
        className="px-6 md:px-10 py-20"
        style={{ backgroundColor: "var(--background-secondary)" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-14">
            <div>
              <Eyebrow>Seven disciplines, one marketplace</Eyebrow>
              <h2
                className="font-[var(--font-heading)] text-3xl md:text-[2.2rem] leading-tight"
                style={{ color: "var(--heading)" }}
              >
                Built for every player
                <br />
                in the process.
              </h2>
            </div>
            <Link
              to="/Signup"
              className="nod-btn inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--gold)] hover:underline"
            >
              Explore All Services <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-x-6 gap-y-10">
            {disciplines.map(({ icon: Icon, title, copy }, i) => (
              <div
                key={title}
                className="nod-discipline flex flex-col gap-4 transition-all duration-600"
                style={{
                  opacity: disciplinesVisible ? 1 : 0,
                  transform: disciplinesVisible ? "translateY(0)" : "translateY(16px)",
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                <div
                  className="nod-icon-hover h-11 w-11 rounded-xl border flex items-center justify-center bg-[var(--surface)]"
                  style={{ borderColor: "var(--border)" }}
                >
                  <Icon size={20} style={{ color: "var(--gold)" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: "var(--heading)" }}>
                    {title}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                    {copy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ THE FOUNDER ============ */}
      <section
        ref={founderRef}
        className="px-6 md:px-10 py-20 md:py-28 overflow-hidden"
        style={{ backgroundColor: "var(--background)" }}
      >
        <div className="mx-auto max-w-7xl">
          <div
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center transition-all duration-700"
            style={{
              opacity: founderVisible ? 1 : 0,
              transform: founderVisible ? "translateY(0)" : "translateY(24px)",
            }}
          >
            {/* Left Column: Heading & Story */}
            <div className="lg:col-span-4 flex flex-col justify-center pr-0 lg:pr-4">
              <p
                className="text-[11px] font-bold uppercase tracking-[0.28em] mb-3"
                style={{ color: "var(--gold)" }}
              >
                THE FOUNDER
              </p>
              <h2
                className="font-[var(--font-heading)] text-3xl sm:text-4xl lg:text-[2.65rem] leading-[1.15] mb-6 font-bold tracking-tight"
                style={{ color: "var(--heading)" }}
              >
                Design, for a better tomorrow.
              </h2>
              <p
                className="text-sm sm:text-[15px] leading-relaxed mb-8 font-normal"
                style={{ color: "var(--text)" }}
              >
                NOD started from a simple belief — that great spaces are built
                by great people, and great people deserve a better way to work
                together. What began as a late-night idea has now grown into a
                global vision.
              </p>
              <div className="pt-2 border-t border-[var(--border)]">
                <h3
                  className="font-[var(--font-heading)] text-xl sm:text-2xl font-bold tracking-tight italic"
                  style={{ color: "var(--heading)" }}
                >
                  Govind Shukla
                </h3>
                <p className="text-xs sm:text-sm font-medium mt-0.5" style={{ color: "var(--muted)" }}>
                  Founder, NOD India
                </p>
              </div>
            </div>

            {/* Middle Column: Founder Portrait */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md lg:max-w-none rounded-2xl overflow-hidden shadow-2xl border border-[var(--border)] group">
                <img
                  src={founder}
                  alt="Govind Shukla - Founder of NOD India"
                  loading="lazy"
                  className="w-full h-auto max-h-[580px] object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-black/10"
                />
              </div>
            </div>

            {/* Right Column: Quote Card */}
            <div className="lg:col-span-3 flex justify-start lg:justify-center">
              <div
                className="w-full max-w-sm rounded-2xl p-6 sm:p-8 border shadow-sm transition-all duration-300 hover:shadow-md"
                style={{
                  backgroundColor: "var(--background-secondary)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="text-2xl sm:text-3xl font-serif mb-4 leading-none" style={{ color: "var(--gold)" }}>
                  “
                </div>
                <p
                  className="text-base sm:text-lg italic font-medium leading-snug mb-6"
                  style={{ color: "var(--heading)", fontFamily: "var(--font-heading)" }}
                >
                  Better collaboration builds better spaces.
                </p>
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.24em]"
                  style={{ color: "var(--muted)" }}
                >
                  NOD INDIA
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ GALLERY (PDF Images) ============ */}
      <section ref={galleryRef} className="px-6 md:px-10 py-20 md:py-28" style={{ backgroundColor: "var(--background)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-14">
            <div>
              <Eyebrow>Our Work</Eyebrow>
              <h2 className="font-[var(--font-heading)] text-3xl md:text-[2.2rem] leading-tight" style={{ color: "var(--heading)" }}>
                Built across India and beyond.
              </h2>
            </div>
            <Link to="/Signup" className="nod-btn inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--gold)" }}>
              View All Projects <ArrowUpRight size={15} />
            </Link>
          </div>

          <div
            className="relative"
            onMouseEnter={() => (galleryHover.current = true)}
            onMouseLeave={() => (galleryHover.current = false)}
          >
            <button
              onClick={() => rotateGallery("prev")}
              aria-label="Previous"
              className="nod-btn hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full items-center justify-center border hover:border-[var(--gold)]"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--heading)" }}
            >
              <ChevronLeft size={18} />
            </button>

            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-5 transition-opacity duration-200"
              style={{ opacity: galleryFading ? 0 : galleryVisible ? 1 : 0 }}
            >
              {gallery.map(({ label, img }, i) => (
                <div
                  key={label}
                  className="nod-img-zoom-wrap relative rounded-xl overflow-hidden aspect-[4/3] transition-all duration-700 shadow-md border border-[var(--border)]"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <img src={img} alt={label} className="nod-img-zoom h-full w-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.75) 100%)" }} />
                  <p className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-[0.15em] text-white">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => rotateGallery("next")}
              aria-label="Next"
              className="nod-btn hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full items-center justify-center border hover:border-[var(--gold)]"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--heading)" }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {gallery.map((g, i) => (
              <span
                key={g.label}
                className="nod-dot h-1.5 rounded-full"
                style={{ width: i === 0 ? "20px" : "6px", backgroundColor: i === 0 ? "var(--gold)" : "var(--border)" }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS (With Google Profile Reviews) ============ */}
      <section ref={testimonialsRef} className="px-6 md:px-10 py-20 md:py-28" style={{ backgroundColor: "var(--background-secondary)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-14">
            <div>
              <Eyebrow>In their words</Eyebrow>
              <h2 className="font-[var(--font-heading)] text-3xl md:text-[2.2rem] leading-tight" style={{ color: "var(--heading)" }}>
                From clients and professionals
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowAllStories((prev) => !prev)}
                className="nod-btn inline-flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
                style={{ color: "var(--gold)" }}
              >
                {showAllStories ? "Show Less" : "More Stories"} <ChevronDown size={15} className={`transition-transform ${showAllStories ? "rotate-180" : ""}`} />
              </button>
              <a
                href="https://share.google/sqGUCqQppiC1k9Ysx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--gold)] ml-2"
              >
                Google Reviews <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedTestimonials.map(({ quote, name, role, rating, avatar }, i) => (
              <div
                key={name}
                className="nod-card-hover rounded-2xl p-8 border transition-all duration-700"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  opacity: testimonialsVisible ? 1 : 0,
                  transform: testimonialsVisible ? "translateY(0)" : "translateY(18px)",
                  transitionDelay: `${i * 150}ms`,
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <Quote size={22} style={{ color: "var(--gold)" }} />
                  <div className="flex items-center gap-1">
                    {Array.from({ length: rating }).map((_, r) => (
                      <Star key={r} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm md:text-[15px] leading-relaxed mb-8" style={{ color: "var(--text)" }}>
                  "{quote}"
                </p>
                <div className="flex items-center gap-3">
                  <img src={avatar} alt={name} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--heading)" }}>
                      {name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      {role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ (All 20 FAQs from PDF) ============ */}
      <section ref={faqRef} className="px-6 md:px-10 py-20 md:py-28" style={{ backgroundColor: "var(--background)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-14">
            <div>
              <Eyebrow>Frequently Asked Questions</Eyebrow>
              <h2 className="font-[var(--font-heading)] text-3xl md:text-[2.2rem] leading-tight" style={{ color: "var(--heading)" }}>
                Before you get started
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowAllFaqs((prev) => !prev)}
              className="nod-btn inline-flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
              style={{ color: "var(--gold)" }}
            >
              {showAllFaqs ? "Show Fewer FAQs" : "View All FAQs"} <ChevronDown size={15} className={`transition-transform ${showAllFaqs ? "rotate-180" : ""}`} />
            </button>
          </div>

          <div className="max-w-4xl mx-auto flex flex-col gap-3.5">
            {displayedFaqs.map(({ q, a }, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={q}
                  className="rounded-xl border overflow-hidden transition-all duration-300"
                  style={{
                    borderColor: isOpen ? "var(--gold)" : "var(--border)",
                    backgroundColor: "var(--surface)",
                    opacity: faqVisible ? 1 : 0,
                    transform: faqVisible ? "translateY(0)" : "translateY(14px)",
                    transitionDelay: `${(i % 6) * 40}ms`,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-4.5 text-left cursor-pointer transition-colors"
                  >
                    <span className="text-sm md:text-base font-semibold leading-snug" style={{ color: "var(--heading)" }}>
                      {q}
                    </span>
                    <Plus
                      size={18}
                      className="shrink-0 transition-transform duration-300"
                      style={{ color: "var(--gold)", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                    />
                  </button>
                  <div className="grid transition-all duration-300" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 pt-1 text-sm md:text-[0.925rem] leading-relaxed" style={{ color: "var(--text)" }}>
                        {a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ CTA (Post Your Brief -> Signup & Premium High Contrast) ============ */}
      <section className="relative">
        <div className="relative min-h-[480px] flex items-center overflow-hidden">
          <img src={ctaImage} alt="Warm lounge interior" className="absolute inset-0 h-full w-full object-cover nod-kenburns" />
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(17,13,10,0.88)" }} />

          <div className="relative mx-auto max-w-7xl px-6 md:px-10 py-20 w-full">
            <p className="nod-hero-in text-xs font-bold uppercase tracking-[0.3em] mb-4" style={{ color: "var(--gold)", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
              Let's Build Together
            </p>
            <h2
              className="nod-hero-in font-[var(--font-heading)] font-bold leading-[1.15] max-w-xl mb-6"
              style={{
                color: "#FFFFFF",
                fontSize: "clamp(2rem, 4.5vw, 3rem)",
                animationDelay: "0.12s",
                textShadow: "0 2px 14px rgba(0,0,0,0.8)",
              }}
            >
              Bring your brief.
              <br />
              <span style={{ color: "var(--gold)" }}>We'll bring the right people.</span>
            </h2>
            <p
              className="nod-hero-in max-w-lg text-base leading-relaxed mb-10 font-normal"
              style={{
                color: "#F7F3EA",
                animationDelay: "0.24s",
                textShadow: "0 1px 8px rgba(0,0,0,0.8)",
              }}
            >
              Whether you're planning a single room or a full build across
              every discipline, NOD gets you talking to the right
              professional by the end of the week.
            </p>
            <div className="nod-hero-in flex flex-wrap items-center gap-4" style={{ animationDelay: "0.36s" }}>
              <Link
                to="/Signup"
                className="nod-btn inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold shadow-lg hover:brightness-110"
                style={{ backgroundColor: "var(--gold)", color: "#1b130f" }}
              >
                Post Your Brief <ArrowRight size={16} />
              </Link>
              <Link
                to="/Signup?role=Professional"
                className="nod-btn inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold border hover:bg-white/10"
                style={{ borderColor: "rgba(255,255,255,0.4)", color: "#FFFFFF" }}
              >
                Join as a Professional
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}