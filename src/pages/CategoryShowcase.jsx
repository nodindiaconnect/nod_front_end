import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import residentialImg from "../assets/residential_bedroom.jpg";
import commercialImg from "../assets/commercial_interior.jpg";
import structuralImg from "../assets/structural_blueprint.jpg";

const categories = [
  {
    key: "residential",
    label: "RESIDENTIAL",
    labelColor: "text-amber-900",
    img: residentialImg,
    width: "w-full md:w-[270px] lg:w-[290px]",
    height: "h-[300px] lg:h-[330px]",
    className: "md:mt-16",
    speed: -70,
  },
  {
    key: "commercial",
    label: "COMMERCIAL",
    labelColor: "text-amber-700",
    img: commercialImg,
    width: "w-full md:w-[280px] lg:w-[300px]",
    height: "h-[320px] lg:h-[350px]",
    className: "z-20",
    speed: -120,
  },
  {
    key: "structural",
    label: "STRUCTURAL",
    labelColor: "text-slate-800",
    img: structuralImg,
    width: "w-full md:w-[270px] lg:w-[290px]",
    height: "h-[300px] lg:h-[330px]",
    className: "md:mt-24",
    speed: -80,
  },
];

export default function CategoryShowcase() {
  const [hovered, setHovered] = useState(null);

  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 lg:py-36 px-5 md:px-10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-6 lg:gap-8">
          {categories.map((cat) => {
            const isHovered = hovered === cat.key;
            const isDimmed = hovered && hovered !== cat.key;

            const y = useTransform(scrollYProgress, [0, 1], [0, cat.speed]);

            return (
              <motion.div
                key={cat.key}
                style={{ y }}
                initial={{
                  opacity: 0,
                  y: 120,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.3,
                }}
                whileHover={{
                  y: -12,
                  scale: 1.04,
                }}
                animate={{
                  opacity: isDimmed ? 0.4 : 1,
                  filter: isDimmed ? "blur(2px)" : "blur(0px)",
                }}
                transition={{
                  duration: 0.7,
                  ease: "easeOut",
                }}
                onMouseEnter={() => setHovered(cat.key)}
                onMouseLeave={() => setHovered(null)}
                className={`relative overflow-hidden  ${cat.width} ${cat.className}`}
              >
                <div className={`relative ${cat.height}`}>
                  <img
                    src={cat.img}
                    alt={cat.label}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  bg
                  <div className="absolute inset-0 -gradient-to-t from-black/40 via-transparent to-transparent" />
                  {/* Center label — solid white badge, expands to "FOR LABEL LIVING" on hover */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{
                        y: isHovered ? -6 : 0,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                      className="flex items-center rounded-sm bg-white px-4 py-1.5 shadow-md"
                    >
                      <AnimatePresence initial={false}>
                        {isHovered && (
                          <motion.span
                            initial={{ opacity: 0, width: 0, marginRight: 0 }}
                            animate={{
                              opacity: 1,
                              width: "auto",
                              marginRight: 8,
                            }}
                            exit={{ opacity: 0, width: 0, marginRight: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="overflow-hidden whitespace-nowrap text-[11px] md:text-xs font-medium tracking-[0.2em] text-gray-500"
                          >
                            FOR
                          </motion.span>
                        )}
                      </AnimatePresence>

                      <span
                        className={`text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap ${cat.labelColor}`}
                      >
                        {cat.label}
                      </span>

                      <AnimatePresence initial={false}>
                        {isHovered && (
                          <motion.span
                            initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                            animate={{
                              opacity: 1,
                              width: "auto",
                              marginLeft: 8,
                            }}
                            exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="overflow-hidden whitespace-nowrap text-[11px] md:text-xs font-medium tracking-[0.2em] text-gray-500"
                          >
                            LIVING
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
