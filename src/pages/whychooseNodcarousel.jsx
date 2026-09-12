import { useState, useEffect, useRef } from "react";
import { ShieldCheck, Users, Layers, Truck, Clock, Award } from "lucide-react";
import "../theme.css";

import architectImg from "../assets/why_choose/architect_project.webp";
import interiorImg from "../assets/why_choose/interior_project.webp";
import contractorImg from "../assets/why_choose/contractor_project.webp";
import materialsImg from "../assets/why_choose/materials_project.webp";
import kitchenImg from "../assets/why_choose/kitchen_project.webp";
import bedroomImg from "../assets/why_choose/bedroom_project.webp";

const features = [
  {
    id: 0,
    number: "01",
    title: "Verified Professionals",
    description:
      "Every architect, designer, and contractor on NOD is background-checked and portfolio-reviewed before they ever meet a client.",
    icon: Users,
    image: architectImg,
    alt: "Architectural luxury villa finished project",
  },
  {
    id: 1,
    number: "02",
    title: "End-to-End Ecosystem",
    description:
      "Design, build, and source — all under one roof. No juggling five vendors across three cities.",
    icon: Layers,
    image: interiorImg,
    alt: "Luxury modern living room interior design finished project",
  },
  {
    id: 2,
    number: "03",
    title: "Material Suppliers Network",
    description:
      "Direct access to vetted material suppliers for tiles, fittings, furniture, and finishes — at trade pricing, delivered on schedule.",
    icon: Truck,
    image: materialsImg,
    alt: "Luxury Italian marble bathroom and materials finished project",
  },
  {
    id: 3,
    number: "04",
    title: "Secure & Transparent",
    description:
      "Milestone-based payments, contract protection, and full project visibility from day one to handover.",
    icon: ShieldCheck,
    image: contractorImg,
    alt: "Contractor civil construction and residential handover finished project",
  },
  {
    id: 4,
    number: "05",
    title: "On-Time Delivery",
    description:
      "Our project managers track every timeline so your build stays on schedule, not just on paper.",
    icon: Clock,
    image: kitchenImg,
    alt: "Turnkey luxury modern kitchen and dining finished project",
  },
  {
    id: 5,
    number: "06",
    title: "Elite Curation",
    description:
      "We onboard the top tier of talent — not every applicant, only the ones who meet our design and craftsmanship bar.",
    icon: Award,
    image: bedroomImg,
    alt: "Elite architectural penthouse master bedroom finished project",
  },
];

export default function WhyChooseNOD() {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  // Auto rotate
  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaY) > 35 || Math.abs(deltaX) > 35) {
      if (deltaY < -35 || deltaX < -35) {
        setActiveIndex((prev) => (prev + 1) % features.length);
      } else {
        setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
      }
    }
  };

  // Determine position relative to active item
  const getPosition = (index) => {
    const len = features.length;
    const diff = (index - activeIndex + len) % len;

    if (diff === 0) return "active";
    if (diff === 1) return "bottom";
    if (diff === len - 1) return "top";

    return "hidden";
  };

  return (
    <section
      className="overflow-hidden py-16 md:py-24"
      style={{ background: "var(--primary)" }}
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        {/* HEADER */}
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-16">
          <span
            className="text-xs font-bold uppercase tracking-[0.25em]"
            style={{ color: "var(--gold)" }}
          >
            Why Choose NOD
          </span>

          <h2 className="mt-4 mb-5 text-3xl font-bold md:text-5xl text-[#F7F3EA]">
            One Platform. Every Piece of the Build.
          </h2>

          <p className="mx-auto max-w-2xl text-sm leading-relaxed md:text-base text-[#E5DDD3]">
            From the first sketch to the final material delivered on-site, NOD
            brings together India&apos;s finest designers, architects,
            contractors, and material suppliers — so you never have to build
            alone.
          </p>
        </div>

        {/* MAIN CONTENT */}
        <div className="relative flex flex-col items-center gap-8 md:grid md:grid-cols-12 md:gap-0">
          {/* PHONE / VISUAL */}
          <div className="relative z-20 col-span-5 flex justify-center md:justify-end md:pr-6">
            <div
              className="relative h-[520px] w-[260px] sm:h-[560px] sm:w-[275px] md:h-[620px] md:w-[290px] shrink-0"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* REALISTIC PHONE HARDWARE FRAME */}
              <div className="relative h-full w-full rounded-[44px] md:rounded-[48px] bg-[#101725] p-[7px] md:p-[8px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.12),0_0_25px_rgba(200,169,107,0.15)]">
                {/* External side buttons */}
                <div className="pointer-events-none absolute -left-[7px] top-[100px] h-8 w-[4px] rounded-l bg-slate-700 opacity-60" />
                <div className="pointer-events-none absolute -left-[7px] top-[145px] h-10 w-[4px] rounded-l bg-slate-700 opacity-60" />
                <div className="pointer-events-none absolute -left-[7px] top-[195px] h-10 w-[4px] rounded-l bg-slate-700 opacity-60" />
                <div className="pointer-events-none absolute -right-[7px] top-[135px] h-14 w-[4px] rounded-r bg-slate-700 opacity-60" />

                {/* SCREEN CONTAINER */}
                <div className="relative h-full w-full overflow-hidden rounded-[38px] md:rounded-[40px] bg-black">
                  {/* DYNAMIC ISLAND / NOTCH */}
                  <div className="pointer-events-none absolute left-1/2 top-2.5 z-30 flex h-4 w-20 md:h-5 md:w-24 -translate-x-1/2 items-center justify-between rounded-full bg-black/90 px-2.5 backdrop-blur-md">
                    <div className="h-2 w-2 rounded-full border border-white/10 bg-[#1c2430]" />
                    <div className="h-1.5 w-1.5 rounded-full bg-[#0e1626]" />
                  </div>

                  {/* IMAGES VERTICAL CAROUSEL */}
                  <div
                    className="h-full w-full transition-transform duration-700 ease-in-out"
                    style={{
                      transform: `translateY(-${activeIndex * 100}%)`,
                    }}
                  >
                    {features.map((feature, idx) => (
                      <div
                        key={feature.id}
                        className="relative h-full w-full shrink-0 select-none overflow-hidden"
                      >
                        <img
                          src={feature.image}
                          alt={feature.alt}
                          className="h-full w-full object-cover select-none"
                          loading={idx === 0 ? "eager" : "lazy"}
                          draggable={false}
                        />
                      </div>
                    ))}
                  </div>

                  {/* HOME BAR INDICATOR */}
                  <div className="pointer-events-none absolute bottom-2 left-1/2 z-30 h-1 w-24 -translate-x-1/2 rounded-full bg-white/40" />
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP CAROUSEL CONTENT */}
          <div className="relative hidden md:flex col-span-7 h-[380px] w-full items-center justify-start md:h-[420px]">
            {/* BACKGROUND SHAPE (Gold active banner) */}
            <div className="pointer-events-none absolute left-0 right-0 top-1/2 z-0 flex -translate-y-1/2 items-center">
              <div
                className="h-[125px] w-full rounded-r-full opacity-95 md:h-[155px] shadow-lg"
                style={{ background: "var(--gold)" }}
              />
            </div>

            {/* ROTATING ITEMS */}
            <div className="relative z-20 mx-auto h-full w-full max-w-[420px] md:mx-0 md:max-w-full">
              {features.map((feature, index) => {
                const position = getPosition(index);
                const isActive = position === "active";

                let wrapperClasses =
                  "absolute w-full px-6 md:px-0 transition-all duration-700 ease-in-out cursor-pointer";

                if (isActive) {
                  wrapperClasses +=
                    " top-1/2 -translate-y-1/2 opacity-100 z-30 md:pl-[44px] md:pr-14";
                } else if (position === "top") {
                  wrapperClasses +=
                    " top-2 scale-95 opacity-80 z-10 md:pl-[120px] hover:opacity-100";
                } else if (position === "bottom") {
                  wrapperClasses +=
                    " bottom-2 scale-95 opacity-80 z-10 md:pl-[120px] hover:opacity-100";
                } else {
                  wrapperClasses +=
                    " top-1/2 -translate-y-1/2 opacity-0 pointer-events-none md:pl-[120px]";
                }

                return (
                  <div
                    key={feature.id}
                    className={wrapperClasses}
                    onClick={() => setActiveIndex(index)}
                  >
                    <div
                      className={`flex ${
                        isActive
                          ? "flex-row items-center gap-4 md:gap-6"
                          : "flex-row items-center gap-3.5"
                      }`}
                    >
                      {/* IMAGE ICON THUMBNAIL */}
                      {isActive ? (
                        <div className="hidden shrink-0 md:flex">
                          <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-[#20140D]/30 shadow-md ring-2 ring-white/50">
                            <img
                              src={feature.image}
                              alt={feature.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="hidden shrink-0 md:flex">
                          <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white/30 shadow-sm opacity-85">
                            <img
                              src={feature.image}
                              alt={feature.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      )}

                      {/* NUMBER */}
                      <span
                        className={`leading-none font-extrabold transition-colors duration-300 ${
                          isActive
                            ? "text-xl md:text-[32px] text-[#20140D]"
                            : "text-sm md:text-base text-[#D4AF37]"
                        }`}
                      >
                        {feature.number}
                      </span>

                      {/* TEXT */}
                      <div className="flex-1">
                        <h3
                          className={`leading-tight font-bold transition-colors duration-300 ${
                            isActive
                              ? "text-base md:text-xl text-[#20140D] mb-1.5"
                              : "text-sm md:text-base text-[#F7F3EA] mb-1"
                          }`}
                        >
                          {feature.title}
                        </h3>

                        <p
                          className={`leading-relaxed transition-all duration-500 ${
                            isActive
                              ? "max-h-[200px] text-xs md:text-sm font-medium text-[#362316]"
                              : "text-[11px] md:text-xs text-[#DDD5CA]"
                          }`}
                        >
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* MOBILE CONTROLS & INDICATORS */}
        <div className="mt-8 flex flex-col items-center gap-3 md:hidden">
          <div className="flex justify-center gap-2">
            {features.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => setActiveIndex(index)}
                aria-label={`Show ${feature.title}`}
                className="h-2 rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  width: activeIndex === index ? "2rem" : "0.5rem",
                  background:
                    activeIndex === index
                      ? "var(--gold)"
                      : "rgba(255, 255, 255, 0.35)",
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-6 w-6 rounded-full overflow-hidden border border-white/40 shrink-0">
              <img
                src={features[activeIndex].image}
                alt={features[activeIndex].title}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-xs font-semibold tracking-wider uppercase text-[#F7F3EA]">
              {features[activeIndex].title}
            </p>
          </div>
        </div>

        {/* BOTTOM MESSAGE */}
        <div className="mx-auto mt-14 max-w-3xl border-t border-white/20 pt-8 text-center md:mt-20">
          <p className="text-sm leading-relaxed md:text-base text-[#E0D8CE]">
            Design, build, source, and manage your entire project through one
            trusted ecosystem.
          </p>
        </div>
      </div>
    </section>
  );
}
