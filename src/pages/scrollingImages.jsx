import { useState } from "react";
import commercialImg from "../assets/commercial_interior.jpg";
import residentialImg from "../assets/residential_bedroom.jpg";
import structuralImg from "../assets/structural_blueprint.jpg";

const projects = [
  {
    key: "royal-heritage",
    label: "ROYAL HERITAGE RECEPTION",
    img: commercialImg,
  },
  {
    key: "master-suite",
    label: "CONTEMPORARY MASTER SUITE",
    img: residentialImg,
  },
  {
    key: "structural-plan",
    label: "STRUCTURAL LAYOUT MASTERPLAN",
    img: structuralImg,
  },
  {
    key: "luxury-villa",
    label: "MODERN ARCHITECTURAL VILLA",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80&auto=format&fit=crop",
  },
  {
    key: "minimal-living",
    label: "LUXURY LIVING & DINING LOUNGE",
    img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&q=80&auto=format&fit=crop",
  },
  {
    key: "executive-office",
    label: "EXECUTIVE INTERIOR ARCHITECTURE",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80&auto=format&fit=crop",
  },
];

export default function WorkShowcase() {
  const [hovered, setHovered] = useState(null);
  const [paused, setPaused] = useState(false);

  // duplicate the set so the strip can loop seamlessly
  const loopItems = [...projects, ...projects];

  return (
    <section className="relative bg-[#ffffff] overflow-hidden py-16 md:py-20">
      {/* Heading */}
      <div className="px-6 md:px-16 mb-10 md:mb-14">
        <h2 className="font-[var(--font-heading)] text-gray-900 text-3xl md:text-5xl leading-tight">
          WORK THAT
          <br />
          SPEAKS FOR US
        </h2>
      </div>

      {/* Ruler tick line above the strip */}
      <div className="flex px-6 md:px-16 mb-2">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="flex-1 border-t border-gray-300 relative">
            <span className="absolute -top-2 left-0 w-px h-2 bg-gray-400" />
          </div>
        ))}
      </div>

      {/* Marquee strip */}
      <div
        className="relative w-full overflow-hidden px-6 md:px-16"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          setPaused(false);
          setHovered(null);
        }}
      >
        <div
          className="flex gap-3 md:gap-4 w-max"
          style={{
            animation: "work-marquee 32s linear infinite",
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {loopItems.map((p, i) => {
            const id = `${p.key}-${i}`;
            const isHovered = hovered === id;

            return (
              <div
                key={id}
                onMouseEnter={() => setHovered(id)}
                className="group relative flex-shrink-0 rounded-md overflow-hidden cursor-pointer transition-[width] duration-500 ease-out h-[300px] md:h-[430px]"
                style={{ width: isHovered ? 400 : 230 }}
              >
                <img
                  src={p.img}
                  alt={p.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] tracking-[0.25em] text-white/90 font-medium">
                  {p.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>



      <style>{`
        @keyframes work-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}