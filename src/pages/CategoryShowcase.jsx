
// import { useState, useRef } from "react";
// import {
//   motion,
//   AnimatePresence,
//   useScroll,
//   useTransform,
// } from "framer-motion";

// const categories = [
//   {
//     key: "residential",
//     label: "RESIDENTIAL",
//     labelColor: "text-black",
//     img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900&q=80&auto=format&fit=crop",
//     width: "w-full md:w-[270px] lg:w-[290px]",
//     height: "h-[300px] lg:h-[330px]",
//     className: "md:mt-16",
//     speed: -70,
//   },
//   {
//     key: "commercial",
//     label: "COMMERCIAL",
//     labelColor: "text-blue-600",
//     img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=900&q=80&auto=format&fit=crop",
//     width: "w-full md:w-[280px] lg:w-[300px]",
//     height: "h-[320px] lg:h-[350px]",
//     className: "z-20",
//     speed: -120,
//   },
//   {
//     key: "marine",
//     label: "MARINE",
//     labelColor: "text-slate-800",
//     img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&q=80&auto=format&fit=crop",
//     width: "w-full md:w-[270px] lg:w-[290px]",
//     height: "h-[300px] lg:h-[330px]",
//     className: "md:mt-24",
//     speed: -80,
//   },
// ];

// export default function CategoryShowcase() {
//   const [hovered, setHovered] = useState(null);

//   const sectionRef = useRef(null);

//   const { scrollYProgress } = useScroll({
//     target: sectionRef,
//     offset: ["start end", "end start"],
//   });

//   return (
//     <section
//       ref={sectionRef}
//       className="relative overflow-hidden py-24 lg:py-36 px-5 md:px-10"
//     >
//       <div className="max-w-7xl mx-auto">

//         <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-6 lg:gap-8">

//           {categories.map((cat) => {

//             const isHovered = hovered === cat.key;
//             const isDimmed = hovered && hovered !== cat.key;

//             const y = useTransform(
//               scrollYProgress,
//               [0, 1],
//               [0, cat.speed]
//             );

//             return (
//               <motion.div
//                 key={cat.key}
//                 style={{ y }}
//                 initial={{
//                   opacity: 0,
//                   y: 120,
//                 }}
//                 whileInView={{
//                   opacity: 1,
//                   y: 0,
//                 }}
//                 viewport={{
//                   once: true,
//                   amount: 0.3,
//                 }}
//                 whileHover={{
//                   y: -12,
//                   scale: 1.04,
//                 }}
//                 animate={{
//                   opacity: isDimmed ? 0.4 : 1,
//                   filter: isDimmed ? "blur(2px)" : "blur(0px)",
//                 }}
//                 transition={{
//                   duration: 0.7,
//                   ease: "easeOut",
//                 }}
//                 onMouseEnter={() => setHovered(cat.key)}
//                 onMouseLeave={() => setHovered(null)}
//                 className={`relative overflow-hidden  ${cat.width} ${cat.className}`}
//               >
//                 <div className={`relative ${cat.height}`}>
//                   <img
//                     src={cat.img}
//                     alt={cat.label}
//                     className="absolute inset-0 w-full h-full object-cover"
//                   />

//                   <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

//                   {/* Center label — solid white badge, expands to "FOR LABEL LIVING" on hover */}
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <motion.div
//                       animate={{
//                         y: isHovered ? -6 : 0,
//                       }}
//                       transition={{
//                         duration: 0.3,
//                         ease: "easeOut",
//                       }}
//                       className="flex items-center rounded-sm bg-white px-4 py-1.5 shadow-md"
//                     >
//                       <AnimatePresence initial={false}>
//                         {isHovered && (
//                           <motion.span
//                             initial={{ opacity: 0, width: 0, marginRight: 0 }}
//                             animate={{ opacity: 1, width: "auto", marginRight: 8 }}
//                             exit={{ opacity: 0, width: 0, marginRight: 0 }}
//                             transition={{ duration: 0.25, ease: "easeOut" }}
//                             className="overflow-hidden whitespace-nowrap text-[11px] md:text-xs font-medium tracking-[0.2em] text-gray-500"
//                           >
//                             FOR
//                           </motion.span>
//                         )}
//                       </AnimatePresence>

//                       <span
//                         className={`text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap ${cat.labelColor}`}
//                       >
//                         {cat.label}
//                       </span>

//                       <AnimatePresence initial={false}>
//                         {isHovered && (
//                           <motion.span
//                             initial={{ opacity: 0, width: 0, marginLeft: 0 }}
//                             animate={{ opacity: 1, width: "auto", marginLeft: 8 }}
//                             exit={{ opacity: 0, width: 0, marginLeft: 0 }}
//                             transition={{ duration: 0.25, ease: "easeOut" }}
//                             className="overflow-hidden whitespace-nowrap text-[11px] md:text-xs font-medium tracking-[0.2em] text-gray-500"
//                           >
//                             LIVING
//                           </motion.span>
//                         )}
//                       </AnimatePresence>
//                     </motion.div>
//                   </div>
//                 </div>
//               </motion.div>
//             );

//           })}
//         </div>
//       </div>
//     </section>
//   );
// }


import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";

const categories = [
  {
    key: "residential",
    label: "RESIDENTIAL",
    labelColor: "text-black",
    img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900&q=80&auto=format&fit=crop",
    width: "w-full md:w-[270px] lg:w-[290px]",
    height: "h-[300px] lg:h-[330px]",
    className: "md:mt-16",
    speed: -70,
  },
  {
    key: "commercial",
    label: "COMMERCIAL",
    labelColor: "text-blue-600",
    img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=900&q=80&auto=format&fit=crop",
    width: "w-full md:w-[280px] lg:w-[300px]",
    height: "h-[320px] lg:h-[350px]",
    className: "z-20",
    speed: -120,
  },
  {
    key: "marine",
    label: "MARINE",
    labelColor: "text-slate-800",
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&q=80&auto=format&fit=crop",
    width: "w-full md:w-[270px] lg:w-[290px]",
    height: "h-[300px] lg:h-[330px]",
    className: "md:mt-24",
    speed: -80,
  },
];

export default function CategoryShowcase() {
  const [hovered, setHovered] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-5 py-24 md:px-10 lg:py-36"
    >
      <div className="mx-auto max-w-7xl">

        {/* NOD INDIA INTRO */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto mb-16 max-w-4xl text-center lg:mb-20"
        >
          <p className="mb-3 text-xs font-medium tracking-[0.3em] text-blue-600">
            NOD INDIA
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-5xl">
            NOD — Night Owl Designers
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-500 md:text-base">
            We would love to work with you on your projects. Explore our
            portfolio and discover our design services.
          </p>

          {/* SERVICES */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {[
              "Interior",
              "Exterior",
              "AutoCAD Plans",
              "Vastu",
              "Structural Design",
            ].map((service) => (
              <span
                key={service}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium tracking-wide text-gray-700 shadow-sm"
              >
                {service}
              </span>
            ))}
          </div>

          {/* PORTFOLIO + GOOGLE PROFILE */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="https://structura-delicate-design-lab.base44.app"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gray-900 px-6 py-3 text-xs font-semibold tracking-wide text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600"
            >
              View Portfolio
            </a>

            <a
              href="https://share.google/sqGUCqQppiC1k9Ysx"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-gray-200 bg-white px-6 py-3 text-xs font-semibold tracking-wide text-gray-700 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:text-blue-600"
            >
              Google Profile
            </a>
          </div>

          {/* CONTACT */}
          <div className="mt-7 text-xs tracking-wide text-gray-400">
            NOD INDIA &nbsp;·&nbsp; +91 99263 78062
          </div>
        </motion.div>

        {/* CATEGORY CARDS */}
        <div className="flex flex-col items-center justify-center gap-6 md:flex-row lg:gap-8">
          {categories.map((cat) => {
            const isHovered = hovered === cat.key;
            const isDimmed = hovered && hovered !== cat.key;

            const y = useTransform(
              scrollYProgress,
              [0, 1],
              [0, cat.speed]
            );

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
                className={`relative overflow-hidden ${cat.width} ${cat.className}`}
              >
                <div className={`relative ${cat.height}`}>
                  <img
                    src={cat.img}
                    alt={cat.label}
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* CENTER LABEL */}
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
                            initial={{
                              opacity: 0,
                              width: 0,
                              marginRight: 0,
                            }}
                            animate={{
                              opacity: 1,
                              width: "auto",
                              marginRight: 8,
                            }}
                            exit={{
                              opacity: 0,
                              width: 0,
                              marginRight: 0,
                            }}
                            transition={{
                              duration: 0.25,
                              ease: "easeOut",
                            }}
                            className="overflow-hidden whitespace-nowrap text-[11px] font-medium tracking-[0.2em] text-gray-500 md:text-xs"
                          >
                            FOR
                          </motion.span>
                        )}
                      </AnimatePresence>

                      <span
                        className={`whitespace-nowrap text-xs font-semibold tracking-wide md:text-sm ${cat.labelColor}`}
                      >
                        {cat.label}
                      </span>

                      <AnimatePresence initial={false}>
                        {isHovered && (
                          <motion.span
                            initial={{
                              opacity: 0,
                              width: 0,
                              marginLeft: 0,
                            }}
                            animate={{
                              opacity: 1,
                              width: "auto",
                              marginLeft: 8,
                            }}
                            exit={{
                              opacity: 0,
                              width: 0,
                              marginLeft: 0,
                            }}
                            transition={{
                              duration: 0.25,
                              ease: "easeOut",
                            }}
                            className="overflow-hidden whitespace-nowrap text-[11px] font-medium tracking-[0.2em] text-gray-500 md:text-xs"
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
