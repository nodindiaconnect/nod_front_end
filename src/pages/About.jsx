// // import { useEffect, useRef, useState } from "react";
// // import {
// //   Compass,
// //   ShieldCheck,
// //   Users,
// //   MapPin,
// //   ArrowRight,
// //   ArrowUpRight,
// //   Home,
// //   Building2,
// //   Boxes,
// //   Trees,
// //   Palette,
// //   Hammer,
// //   Package,
// //   Cpu,
// //   Quote,
// //   Plus,
// //   Moon,
// //   Sparkles,
// // } from "lucide-react";
// // import "../theme.css";

// // import founder from "../assets/founder.png";

// // /* Small helper: fades a section in once it enters the viewport */
// // function useReveal() {
// //   const ref = useRef(null);
// //   const [visible, setVisible] = useState(false);

// //   useEffect(() => {
// //     const node = ref.current;
// //     if (!node) return;
// //     const observer = new IntersectionObserver(
// //       ([entry]) => {
// //         if (entry.isIntersecting) {
// //           setVisible(true);
// //           observer.disconnect();
// //         }
// //       },
// //       { threshold: 0.15 },
// //     );
// //     observer.observe(node);
// //     return () => observer.disconnect();
// //   }, []);

// //   return [ref, visible];
// // }

// // export default function About() {
// //   const [storyRef, storyVisible] = useReveal();
// //   const [categoriesRef, categoriesVisible] = useReveal();
// //   const [narrativeRef, narrativeVisible] = useReveal();
// //   const [foundersRef, foundersVisible] = useReveal();
// //   const [valuesRef, valuesVisible] = useReveal();
// //   const [galleryRef, galleryVisible] = useReveal();
// //   const [processRef, processVisible] = useReveal();
// //   const [testimonialsRef, testimonialsVisible] = useReveal();
// //   const [faqRef, faqVisible] = useReveal();

// //   const [openFaq, setOpenFaq] = useState(0);

// //   const categories = [
// //     { icon: Home, title: "Interior Designers", copy: "Spaces that feel like home" },
// //     { icon: Building2, title: "Architects", copy: "Structures built to last" },
// //     { icon: Boxes, title: "BIM Engineers", copy: "Precision before a single brick is laid" },
// //     { icon: Trees, title: "Landscape Designers", copy: "Outdoor spaces that breathe" },
// //     { icon: Palette, title: "Exterior Designers", copy: "First impressions, done right" },
// //     { icon: Hammer, title: "Contractors", copy: "From blueprint to build" },
// //     { icon: Package, title: "Material Suppliers", copy: "Verified sourcing for tile, stone, wood & finishes" },
// //   ];

// //   const values = [
// //     {
// //       icon: ShieldCheck,
// //       title: "Vetted, not just listed",
// //       copy: "Every architect, designer, and contractor on NOD is reviewed for portfolio quality and past-project conduct before they can bid on a single brief.",
// //       big: true,
// //     },
// //     {
// //       icon: Compass,
// //       title: "Milestone-based trust",
// //       copy: "Payments release against agreed milestones, not promises.",
// //     },
// //     {
// //       icon: MapPin,
// //       title: "Built city by city",
// //       copy: "Local material, labour, and municipal realities — not a template.",
// //     },
// //     {
// //       icon: Cpu,
// //       title: "Technology, not templates",
// //       copy: "Structured briefs, BIM-ready files, milestone tracking.",
// //     },
// //   ];

// //   const steps = [
// //     { n: "01", title: "Share the brief", copy: "Tell us the space, the budget, and the feeling you're after. Two minutes, no jargon required." },
// //     { n: "02", title: "Meet your matches", copy: "We shortlist professionals whose portfolio and rates actually fit your project — you choose who to talk to." },
// //     { n: "03", title: "Collaborate on NOD", copy: "Briefs, drawings, and revisions stay in one thread, so nothing gets lost between a call and a WhatsApp message." },
// //     { n: "04", title: "Build, on milestones", copy: "Funds release as work is delivered and approved — protection for your budget and their time." },
// //   ];

// //   const testimonials = [
// //     {
// //       quote: "I posted one brief and had a shortlisted architect and landscape designer talking to each other by the end of the week — no group chat required.",
// //       name: "Ritika Sharma",
// //       role: "Homeowner, Pune",
// //     },
// //     {
// //       quote: "Milestone payments meant I never had to chase a client for a sign-off. The scope was clear before I ever picked up a tool.",
// //       name: "Arjun Mehta",
// //       role: "Interior Designer, NOD Professional",
// //     },
// //   ];

// //   const faqs = [
// //     { q: "What if I'm not happy with a match?", a: "You can request a new shortlist at any point before a brief is confirmed — there's no obligation to proceed with a match that isn't right for your project." },
// //     { q: "How does payment protection work?", a: "Funds are held against agreed milestones and only release once each stage of work is delivered and approved, so neither side is paying — or working — on trust alone." },
// //     { q: "Is there a fee to join as a professional?", a: "Creating a profile and browsing briefs is free. NOD takes a small commission only once a project is confirmed through the platform." },
// //     { q: "What cities and countries are you live in?", a: "We're starting in India, expanding city by city, with the platform built to scale to new countries as our professional network grows." },
// //     { q: "Can one project use more than one category of professional?", a: "Yes — that's the point. A single brief can bring in an architect, a landscape designer, and a material supplier together on one thread." },
// //     { q: "Who owns the drawings and files shared on NOD?", a: "Ownership stays exactly as agreed between you and the professional in your brief; NOD is the workspace, not a party to that agreement." },
// //   ];

// //   const founders = [
// //     { name: "Founder Name", role: "Co-Founder & CEO", line: "10 years in real estate", image: founder, linkedin: "#" },
// //   ];

// //   const loopedCategories = [...categories, ...categories];

// //   return (
// //     <div style={{ backgroundColor: "var(--background)" }} className="overflow-x-hidden">
// //       {/* Local animations */}
// //       <style>{`
// //         @keyframes nod-marquee {
// //           from { transform: translateX(0); }
// //           to { transform: translateX(-50%); }
// //         }
// //         .nod-marquee-track {
// //           animation: nod-marquee 28s linear infinite;
// //         }
// //         .nod-marquee-track:hover {
// //           animation-play-state: paused;
// //         }
// //         @keyframes nod-ticker {
// //           from { transform: translateX(0); }
// //           to { transform: translateX(-50%); }
// //         }
// //         .nod-ticker-track {
// //           animation: nod-ticker 18s linear infinite;
// //         }
// //         .nod-tilt-card:hover {
// //           transform: rotate(0deg) translateY(-6px) scale(1.02);
// //         }
// //         .nod-grain {
// //           background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
// //           opacity: 0.05;
// //         }
// //       `}</style>

// //       {/* ============ HERO ============ */}
// //       <section
// //         className="relative overflow-hidden px-6 md:px-10 pt-24 pb-16 md:pt-28 md:pb-0"
// //         style={{ backgroundColor: "var(--primary)" }}
// //       >
// //         <div className="pointer-events-none absolute inset-0 nod-grain" />
// //         <div
// //           className="pointer-events-none absolute inset-0"
// //           style={{
// //             backgroundImage:
// //               "linear-gradient(rgba(212,175,55,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.06) 1px, transparent 1px)",
// //             backgroundSize: "44px 44px",
// //           }}
// //         />

// //         {/* stray moon glyph, night-owl motif */}
// //         <Moon
// //           size={140}
// //           className="pointer-events-none absolute -top-6 right-6 md:right-16 opacity-[0.08]"
// //           style={{ color: "var(--gold)" }}
// //         />

// //         <div className="relative mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
// //           <div className="md:col-span-8">
// //             <div
// //               className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 border"
// //               style={{ borderColor: "rgba(212,175,55,0.4)" }}
// //             >
// //               <Sparkles size={13} style={{ color: "var(--gold)" }} />
// //               <span
// //                 className="text-[11px] font-semibold uppercase tracking-[0.25em]"
// //                 style={{ color: "var(--gold)" }}
// //               >
// //                 About NOD
// //               </span>
// //             </div>

// //             <h1
// //               className="font-[var(--font-heading)] leading-[0.95] mb-8"
// //               style={{
// //                 color: "var(--surface)",
// //                 fontSize: "clamp(2.75rem, 7vw, 5.5rem)",
// //                 letterSpacing: "-0.01em",
// //               }}
// //             >
// //               Good design
// //               <br />
// //               doesn't keep
// //               <br />
// //               <span style={{ color: "var(--gold)" }}>office hours.</span>
// //             </h1>

// //             <p
// //               className="max-w-md text-base leading-relaxed mb-10"
// //               style={{ color: "rgba(255,255,255,0.7)" }}
// //             >
// //               A technology-driven marketplace for the global design and
// //               construction industry — every discipline, one thread, zero
// //               WhatsApp groups.
// //             </p>

// //             <div className="flex flex-wrap items-center gap-4">
// //               <a
// //                 href="/Signin"
// //                 className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-transform duration-300 hover:-translate-y-0.5"
// //                 style={{ backgroundColor: "var(--gold)", color: "var(--primary)" }}
// //               >
// //                 Post Your Brief <ArrowUpRight size={16} />
// //               </a>
// //               <span
// //                 className="text-xs font-semibold uppercase tracking-[0.2em]"
// //                 style={{ color: "rgba(255,255,255,0.5)" }}
// //               >
// //                 Starting in India · scaling globally
// //               </span>
// //             </div>
// //           </div>

// //           <div className="md:col-span-4 flex justify-center md:justify-end">
// //             <div
// //               className="relative rounded-full border flex items-center justify-center"
// //               style={{
// //                 borderColor: "rgba(212,175,55,0.35)",
// //                 width: "min(70vw, 220px)",
// //                 aspectRatio: "1",
// //               }}
// //             >
// //               <div
// //                 className="rounded-full border flex items-center justify-center"
// //                 style={{
// //                   borderColor: "rgba(212,175,55,0.5)",
// //                   width: "72%",
// //                   aspectRatio: "1",
// //                 }}
// //               >
// //                 <p
// //                   className="font-[var(--font-heading)] text-center leading-tight px-4"
// //                   style={{ color: "var(--gold)", fontSize: "14px" }}
// //                 >
// //                   7 disciplines
// //                   <br />1 thread
// //                 </p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* ticker strip */}
// //         <div
// //           className="relative mt-16 overflow-hidden border-t"
// //           style={{ borderColor: "rgba(255,255,255,0.1)" }}
// //         >
// //           <div className="flex whitespace-nowrap py-4 nod-ticker-track w-max">
// //             {[...Array(2)].map((_, loop) => (
// //               <div key={loop} className="flex items-center">
// //                 {categories.map(({ title }) => (
// //                   <span
// //                     key={title + loop}
// //                     className="mx-5 text-sm font-semibold uppercase tracking-[0.2em]"
// //                     style={{ color: "rgba(255,255,255,0.35)" }}
// //                   >
// //                     {title} <span style={{ color: "var(--gold)" }}>◆</span>
// //                   </span>
// //                 ))}
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* ============ WHO'S ON NOD — marquee cards ============ */}
// //       <section
// //         ref={categoriesRef}
// //         className="py-24"
// //         style={{ backgroundColor: "var(--background)" }}
// //       >
// //         <div className="mx-auto max-w-6xl px-6 md:px-10 mb-12 flex items-end justify-between gap-6 flex-wrap">
// //           <div>
// //             <p
// //               className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-4"
// //               style={{ color: "var(--muted)" }}
// //             >
// //               Who's on NOD
// //             </p>
// //             <h2
// //               className="font-[var(--font-heading)] text-3xl md:text-5xl leading-tight"
// //               style={{ color: "var(--heading)" }}
// //             >
// //               Seven disciplines,
// //               <br />
// //               one marketplace.
// //             </h2>
// //           </div>
// //           <p
// //             className="text-sm max-w-xs"
// //             style={{ color: "var(--text)" }}
// //           >
// //             Drag, scroll, or just watch — every professional your project
// //             needs, already on the platform.
// //           </p>
// //         </div>

// //         <div
// //           className="overflow-hidden"
// //           style={{
// //             opacity: categoriesVisible ? 1 : 0,
// //             transition: "opacity 0.6s ease",
// //           }}
// //         >
// //           <div className="flex w-max nod-marquee-track gap-5 px-6">
// //             {loopedCategories.map(({ icon: Icon, title, copy }, i) => (
// //               <div
// //                 key={title + i}
// //                 className="rounded-2xl border p-6 w-[230px] flex-shrink-0"
// //                 style={{
// //                   borderColor: "var(--border)",
// //                   backgroundColor: "var(--surface)",
// //                   transform: i % 2 === 0 ? "rotate(-1.2deg)" : "rotate(1deg)",
// //                 }}
// //               >
// //                 <div
// //                   className="h-11 w-11 rounded-xl flex items-center justify-center mb-6"
// //                   style={{ backgroundColor: "rgba(212,175,55,0.12)" }}
// //                 >
// //                   <Icon size={19} style={{ color: "var(--gold)" }} />
// //                 </div>
// //                 <h3
// //                   className="text-sm font-semibold mb-2"
// //                   style={{ color: "var(--heading)" }}
// //                 >
// //                   {title}
// //                 </h3>
// //                 <p className="text-xs leading-relaxed" style={{ color: "var(--text)" }}>
// //                   {copy}
// //                 </p>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* ============ ONE PROJECT, EVERY DISCIPLINE ============ */}
// //       <section
// //         ref={narrativeRef}
// //         className="px-6 md:px-10 py-24"
// //         style={{ backgroundColor: "var(--primary)" }}
// //       >
// //         <div
// //           className="mx-auto max-w-4xl text-center transition-all duration-700"
// //           style={{
// //             opacity: narrativeVisible ? 1 : 0,
// //             transform: narrativeVisible ? "translateY(0)" : "translateY(16px)",
// //           }}
// //         >
// //           <h2
// //             className="font-[var(--font-heading)] leading-snug"
// //             style={{ color: "var(--surface)", fontSize: "clamp(1.6rem, 4vw, 2.6rem)" }}
// //           >
// //             A villa needs an architect, a landscape designer, a BIM engineer,
// //             and a material supplier — usually spread across five apps and
// //             WhatsApp groups.
// //           </h2>
// //           <div
// //             className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-full"
// //             style={{ backgroundColor: "var(--gold)" }}
// //           >
// //             <p className="text-sm font-semibold" style={{ color: "var(--primary)" }}>
// //               NOD puts them all on one thread
// //             </p>
// //           </div>
// //         </div>
// //       </section>

// //       {/* ============ STORY ============ */}
// //       <section
// //         ref={storyRef}
// //         className="px-6 md:px-10 py-24"
// //         style={{ backgroundColor: "var(--background)" }}
// //       >
// //         <div
// //           className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-12 items-center transition-all duration-700"
// //           style={{
// //             opacity: storyVisible ? 1 : 0,
// //             transform: storyVisible ? "translateY(0)" : "translateY(16px)",
// //           }}
// //         >
// //           <div className="md:col-span-7">
// //             <p
// //               className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-5"
// //               style={{ color: "var(--muted)" }}
// //             >
// //               Why we started
// //             </p>
// //             <h2
// //               className="font-[var(--font-heading)] text-3xl md:text-4xl mb-6 leading-tight"
// //               style={{ color: "var(--heading)" }}
// //             >
// //               The best conversations about a home happen late, over a
// //               half-finished sketch.
// //             </h2>
// //             <p className="text-sm md:text-base leading-relaxed mb-4" style={{ color: "var(--text)" }}>
// //               NOD — Night Owl Designers — takes its name from that habit. Our
// //               founders spent years watching good design ideas die in inboxes: a
// //               designer's quote lost in an email chain, a contractor's timeline
// //               never confirmed in writing, a client left guessing whether a
// //               milestone was actually met.
// //             </p>
// //             <p className="text-sm md:text-base leading-relaxed mb-6" style={{ color: "var(--text)" }}>
// //               So we built a single place for the whole brief — matching,
// //               scoping, and payment — to live. Not a directory. Not another group
// //               chat. A workspace built around how design projects actually get
// //               finished, for every discipline a build touches.
// //             </p>
// //             <div className="flex items-center gap-2">
// //               <span
// //                 className="text-xs font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full"
// //                 style={{ backgroundColor: "rgba(212,175,55,0.12)", color: "var(--gold)" }}
// //               >
// //                 India first
// //               </span>
// //               <span
// //                 className="text-xs font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full"
// //                 style={{ backgroundColor: "rgba(212,175,55,0.12)", color: "var(--gold)" }}
// //               >
// //                 Built to scale globally
// //               </span>
// //             </div>
// //           </div>

// //           <div className="md:col-span-5">
// //             <div
// //               className="rounded-2xl border p-8 aspect-[4/5] flex items-center justify-center relative"
// //               style={{
// //                 borderColor: "var(--border)",
// //                 backgroundColor: "var(--surface)",
// //                 transform: "rotate(1.5deg)",
// //               }}
// //             >
// //               <svg viewBox="0 0 200 240" className="w-full h-full">
// //                 <rect x="20" y="60" width="160" height="150" fill="none" stroke="var(--muted)" strokeWidth="1.5" />
// //                 <polygon points="20,60 100,15 180,60" fill="none" stroke="var(--gold)" strokeWidth="2" />
// //                 <line x1="20" y1="60" x2="20" y2="210" stroke="var(--muted)" strokeWidth="1" />
// //                 <line x1="180" y1="60" x2="180" y2="210" stroke="var(--muted)" strokeWidth="1" />
// //                 <rect x="45" y="120" width="30" height="90" fill="none" stroke="var(--muted)" strokeWidth="1" />
// //                 <rect x="90" y="90" width="40" height="40" fill="none" stroke="var(--muted)" strokeWidth="1" />
// //                 <rect x="145" y="120" width="25" height="55" fill="none" stroke="var(--muted)" strokeWidth="1" />
// //                 <line x1="0" y1="210" x2="200" y2="210" stroke="var(--gold)" strokeWidth="1.5" />
// //               </svg>
// //               <div
// //                 className="absolute -bottom-4 -left-4 rounded-full px-4 py-2 border"
// //                 style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", transform: "rotate(-4deg)" }}
// //               >
// //                 <p className="text-[11px] font-bold" style={{ color: "var(--heading)" }}>
// //                   Est. Night Owl 🌙
// //                 </p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </section>

// //       {/* ============ FOUNDERS ============ */}
// //       <section
// //         ref={foundersRef}
// //         className="px-6 md:px-10 py-24"
// //         style={{ backgroundColor: "var(--background-secondary)" }}
// //       >
// //         <div className="mx-auto max-w-5xl">
// //           <p className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-4 text-center" style={{ color: "var(--muted)" }}>
// //             Who's building it
// //           </p>
// //           <h2 className="font-[var(--font-heading)] text-3xl md:text-4xl text-center mb-16" style={{ color: "var(--heading)" }}>
// //             The team behind NOD
// //           </h2>

// //           <div className="flex flex-wrap justify-center gap-6">
// //             {founders.map(({ name, role, line, image, linkedin }, i) => (
// //               <div
// //                 key={name}
// //                 className="nod-tilt-card relative rounded-2xl border overflow-hidden w-full sm:w-[320px] transition-all duration-300"
// //                 style={{
// //                   borderColor: "var(--border)",
// //                   backgroundColor: "var(--surface)",
// //                   opacity: foundersVisible ? 1 : 0,
// //                   transform: foundersVisible ? "rotate(-1.5deg)" : "translateY(16px)",
// //                   transitionDelay: `${i * 120}ms`,
// //                 }}
// //               >
// //                 <div className="aspect-[4/5] w-full overflow-hidden">
// //                   <img src={image} alt={`${name} — ${role}`} className="h-full w-full object-cover" />
// //                 </div>
// //                 <div
// //                   className="absolute left-3 right-3 bottom-3 flex items-center justify-between gap-3 rounded-xl px-4 py-3"
// //                   style={{ backgroundColor: "var(--surface)", boxShadow: "0 10px 24px -12px rgba(20,15,10,0.45)" }}
// //                 >
// //                   <div>
// //                     <p className="text-sm font-semibold" style={{ color: "var(--heading)" }}>{name}</p>
// //                     <p className="text-xs" style={{ color: "var(--muted)" }}>{role}</p>
// //                   </div>
// //                   {/* <a
// //                     href={linkedin}
// //                     target="_blank"
// //                     rel="noreferrer"
// //                     aria-label={`${name} on LinkedIn`}
// //                     className="flex-shrink-0 h-8 w-8 rounded-md flex items-center justify-center"
// //                     style={{ backgroundColor: "var(--gold)" }}
// //                   >
// //                     <Linkedin size={15} style={{ color: "var(--surface)" }} />
// //                   </a> */}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //           <p className="text-center text-sm mt-6" style={{ color: "var(--text)" }}>
// //             {founders[0].line}
// //           </p>
// //         </div>
// //       </section>

// //       {/* ============ VALUES — bento grid ============ */}
// //       <section ref={valuesRef} className="px-6 md:px-10 py-24" style={{ backgroundColor: "var(--background)" }}>
// //         <div className="mx-auto max-w-6xl">
// //           <p className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-4 text-center" style={{ color: "var(--muted)" }}>
// //             What we hold the line on
// //           </p>
// //           <h2 className="font-[var(--font-heading)] text-3xl md:text-4xl text-center mb-16" style={{ color: "var(--heading)" }}>
// //             Four things every project runs on
// //           </h2>

// //           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 md:auto-rows-[220px]">
// //             {values.map(({ icon: Icon, title, copy, big }, i) => (
// //               <div
// //                 key={title}
// //                 className={`group rounded-2xl border p-7 flex flex-col justify-between transition-all duration-500 ${big ? "md:col-span-2 md:row-span-1" : ""}`}
// //                 style={{
// //                   borderColor: "var(--border)",
// //                   backgroundColor: i === 0 ? "var(--primary)" : "var(--surface)",
// //                   opacity: valuesVisible ? 1 : 0,
// //                   transform: valuesVisible ? "translateY(0)" : "translateY(20px)",
// //                   transitionDelay: `${i * 120}ms`,
// //                 }}
// //               >
// //                 <div
// //                   className="h-11 w-11 rounded-full flex items-center justify-center mb-4 border"
// //                   style={{ borderColor: "var(--gold)" }}
// //                 >
// //                   <Icon size={18} style={{ color: "var(--gold)" }} />
// //                 </div>
// //                 <div>
// //                   <h3
// //                     className="font-[var(--font-heading)] text-xl mb-2"
// //                     style={{ color: i === 0 ? "var(--surface)" : "var(--heading)" }}
// //                   >
// //                     {title}
// //                   </h3>
// //                   <p
// //                     className="text-sm leading-relaxed"
// //                     style={{ color: i === 0 ? "rgba(255,255,255,0.7)" : "var(--text)" }}
// //                   >
// //                     {copy}
// //                   </p>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* ============ PROJECT GALLERY — scattered polaroid style ============ */}
// //       <section ref={galleryRef} className="px-6 md:px-10 py-28" style={{ backgroundColor: "var(--background-secondary)" }}>
// //         <div className="mx-auto max-w-6xl">
// //           <p className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-4 text-center" style={{ color: "var(--muted)" }}>
// //             One platform, every discipline
// //           </p>
// //           <h2 className="font-[var(--font-heading)] text-3xl md:text-4xl text-center mb-20" style={{ color: "var(--heading)" }}>
// //             Built across the whole project
// //           </h2>

// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10 md:gap-y-0">
// //             {[
// //               { label: "Interior", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80", rotate: -3, lift: "md:mt-8" },
// //               { label: "Landscape", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80", rotate: 2, lift: "md:-mt-4" },
// //               { label: "Architecture", img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80", rotate: -1.5, lift: "md:mt-12" },
// //             ].map(({ label, img, rotate, lift }, i) => (
// //               <div
// //                 key={label}
// //                 className={`relative rounded-lg border p-2.5 pb-10 bg-white transition-all duration-500 ${lift}`}
// //                 style={{
// //                   borderColor: "var(--border)",
// //                   transform: `rotate(${rotate}deg)`,
// //                   opacity: galleryVisible ? 1 : 0,
// //                   transitionDelay: `${i * 130}ms`,
// //                 }}
// //               >
// //                 <div className="overflow-hidden rounded-sm aspect-[4/5]">
// //                   <img src={img} alt={label} className="h-full w-full object-cover" />
// //                 </div>
// //                 <p
// //                   className="absolute bottom-3 left-0 right-0 text-center text-[13px] font-semibold"
// //                   style={{ color: "#2a2a2a", fontFamily: "var(--font-heading)" }}
// //                 >
// //                   {label}
// //                 </p>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* ============ PROCESS ============ */}
// //       <section ref={processRef} className="px-6 md:px-10 py-24 relative overflow-hidden" style={{ backgroundColor: "var(--background)" }}>
// //         <div className="mx-auto max-w-6xl relative">
// //           <p className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-4 text-center" style={{ color: "var(--muted)" }}>
// //             How it runs
// //           </p>
// //           <h2 className="font-[var(--font-heading)] text-3xl md:text-4xl text-center mb-20" style={{ color: "var(--heading)" }}>
// //             From brief to build, on one thread
// //           </h2>

// //           <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6">
// //             {steps.map((step, i) => (
// //               <div
// //                 key={step.n}
// //                 className="relative transition-all duration-500"
// //                 style={{
// //                   opacity: processVisible ? 1 : 0,
// //                   transform: processVisible ? "translateY(0)" : "translateY(20px)",
// //                   transitionDelay: `${i * 130}ms`,
// //                 }}
// //               >
// //                 <p
// //                   aria-hidden="true"
// //                   className="font-[var(--font-heading)] absolute -top-6 -left-1 select-none pointer-events-none"
// //                   style={{ color: "var(--gold)", opacity: 0.12, fontSize: "5rem", lineHeight: 1 }}
// //                 >
// //                   {step.n}
// //                 </p>
// //                 <div className="relative pt-8">
// //                   <h3 className="text-base font-semibold mb-2" style={{ color: "var(--heading)" }}>
// //                     {step.title}
// //                   </h3>
// //                   <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
// //                     {step.copy}
// //                   </p>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* ============ TESTIMONIALS ============ */}
// //       <section ref={testimonialsRef} className="px-6 md:px-10 py-24" style={{ backgroundColor: "var(--primary)" }}>
// //         <div className="mx-auto max-w-5xl">
// //           <p className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-4 text-center" style={{ color: "var(--gold)" }}>
// //             In their words
// //           </p>
// //           <h2 className="font-[var(--font-heading)] text-3xl md:text-4xl text-center mb-16" style={{ color: "var(--surface)" }}>
// //             From clients and professionals
// //           </h2>

// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //             {testimonials.map(({ quote, name, role }, i) => (
// //               <div
// //                 key={name}
// //                 className="rounded-2xl p-8 transition-all duration-500"
// //                 style={{
// //                   backgroundColor: "rgba(255,255,255,0.04)",
// //                   border: "1px solid rgba(255,255,255,0.1)",
// //                   opacity: testimonialsVisible ? 1 : 0,
// //                   transform: testimonialsVisible ? "translateY(0)" : "translateY(16px)",
// //                   transitionDelay: `${i * 130}ms`,
// //                 }}
// //               >
// //                 <Quote size={26} style={{ color: "var(--gold)" }} className="mb-5" />
// //                 <p className="text-sm md:text-base leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.85)" }}>
// //                   {quote}
// //                 </p>
// //                 <p className="text-sm font-semibold" style={{ color: "var(--surface)" }}>{name}</p>
// //                 <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{role}</p>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* ============ FAQ ============ */}
// //       <section ref={faqRef} className="px-6 md:px-10 py-24" style={{ backgroundColor: "var(--background)" }}>
// //         <div
// //           className="mx-auto max-w-3xl transition-all duration-700"
// //           style={{ opacity: faqVisible ? 1 : 0, transform: faqVisible ? "translateY(0)" : "translateY(16px)" }}
// //         >
// //           <p className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-4 text-center" style={{ color: "var(--muted)" }}>
// //             Questions
// //           </p>
// //           <h2 className="font-[var(--font-heading)] text-3xl md:text-4xl text-center mb-14" style={{ color: "var(--heading)" }}>
// //             Before you get started
// //           </h2>

// //           <div className="space-y-3">
// //             {faqs.map(({ q, a }, i) => {
// //               const isOpen = openFaq === i;
// //               return (
// //                 <div
// //                   key={q}
// //                   className="rounded-xl border overflow-hidden"
// //                   style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
// //                 >
// //                   <button
// //                     onClick={() => setOpenFaq(isOpen ? -1 : i)}
// //                     className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
// //                   >
// //                     <span className="text-sm md:text-base font-semibold" style={{ color: "var(--heading)" }}>
// //                       {q}
// //                     </span>
// //                     <Plus
// //                       size={16}
// //                       className="shrink-0 transition-transform duration-300"
// //                       style={{ color: "var(--gold)", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
// //                     />
// //                   </button>
// //                   <div className="grid transition-all duration-300" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
// //                     <div className="overflow-hidden">
// //                       <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
// //                         {a}
// //                       </p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         </div>
// //       </section>

// //       {/* ============ CTA — marquee band ============ */}
// //       <section className="pt-20 pb-0" style={{ backgroundColor: "var(--primary)" }}>
// //         <div className="mx-auto max-w-4xl text-center px-6">
// //           <h2 className="font-[var(--font-heading)] text-3xl md:text-5xl mb-5" style={{ color: "var(--surface)" }}>
// //             Bring your brief.
// //             <br />
// //             We'll bring the right people.
// //           </h2>
// //           <p className="text-sm md:text-base mb-10 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
// //             Whether you're planning a single room or a full build across every
// //             discipline, NOD gets you talking to the right professional by the
// //             end of the week.
// //           </p>
// //           <div className="flex flex-wrap items-center justify-center gap-4 pb-16">
// //             <a
// //               href="/Signin"
// //               className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold transition-transform duration-300 hover:-translate-y-0.5"
// //               style={{ backgroundColor: "var(--gold)", color: "var(--primary)" }}
// //             >
// //               Post Your Brief <ArrowRight size={16} />
// //             </a>
// //             <a
// //               href="/Signin"
// //               className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold border transition-colors duration-300"
// //               style={{ borderColor: "rgba(255,255,255,0.3)", color: "var(--surface)" }}
// //             >
// //               <Users size={16} /> Join as a Professional
// //             </a>
// //           </div>
// //         </div>

// //         <div className="overflow-hidden border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
// //           <div className="flex whitespace-nowrap py-5 nod-ticker-track w-max">
// //             {[...Array(2)].map((_, loop) => (
// //               <div key={loop} className="flex items-center">
// //                 {["POST YOUR BRIEF", "JOIN AS A PROFESSIONAL", "SEVEN DISCIPLINES", "ONE THREAD"].map((t) => (
// //                   <span
// //                     key={t + loop}
// //                     className="mx-6 font-[var(--font-heading)] text-2xl md:text-3xl"
// //                     style={{ color: "rgba(255,255,255,0.12)" }}
// //                   >
// //                     {t} ✦
// //                   </span>
// //                 ))}
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>
// //     </div>
// //   );
// // }



// import { useEffect, useRef, useState } from "react";
// import {
//   Home,
//   Building2,
//   Boxes,
//   Trees,
//   Palette,
//   Hammer,
//   Package,
//   ArrowRight,
//   ArrowUpRight,
//   Plus,
//   ChevronLeft,
//   ChevronRight,
//   Quote,
//   Menu,
//   X,
// } from "lucide-react";
// import "../theme.css";
// import profileImage from "../assets/founder.png";
// /* Replace with your real founder photo import, e.g.:
//    import founder from "../assets/founder.png";
//    Falling back to a stock portrait so the file runs standalone. */
// const founder = profileImage;

// const heroImage =
//   "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80";
// const purposeImage =
//   "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80";
// const ctaImage =
//   "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1600&q=80";

// /* Fades a section in once it scrolls into view */
// function useReveal() {
//   const ref = useRef(null);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const node = ref.current;
//     if (!node) return;
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setVisible(true);
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.15 },
//     );
//     observer.observe(node);
//     return () => observer.disconnect();
//   }, []);

//   return [ref, visible];
// }

// function OwlMark({ size = 34 }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
//       <circle cx="20" cy="20" r="19" stroke="var(--heading)" strokeWidth="1.2" />
//       <path
//         d="M13 17c0-3 2.2-5 4.5-5M27 17c0-3-2.2-5-4.5-5"
//         stroke="var(--heading)"
//         strokeWidth="1.2"
//         strokeLinecap="round"
//       />
//       <circle cx="15.5" cy="19.5" r="2.6" stroke="var(--heading)" strokeWidth="1.1" />
//       <circle cx="24.5" cy="19.5" r="2.6" stroke="var(--heading)" strokeWidth="1.1" />
//       <circle cx="15.5" cy="19.5" r="0.7" fill="var(--heading)" />
//       <circle cx="24.5" cy="19.5" r="0.7" fill="var(--heading)" />
//       <path d="M18.7 22.5l1.3 1.6 1.3-1.6" stroke="var(--heading)" strokeWidth="1.1" strokeLinecap="round" />
//       <path d="M13 27c2.5-2 11.5-2 14 0" stroke="var(--heading)" strokeWidth="1.1" strokeLinecap="round" />
//     </svg>
//   );
// }

// function Navbar() {
//   const [open, setOpen] = useState(false);
//   const links = ["Home", "About", "Services", "Projects", "Contact"];

//   return (
//     <header
//       className="sticky top-0 z-50 border-b"
//       style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
//     >
//       <div className="mx-auto max-w-7xl px-6 md:px-10 h-20 flex items-center justify-between">
//         <a href="/" className="flex items-center gap-3">
//           <OwlMark />
//           <span
//             className="font-[var(--font-heading)] text-sm font-semibold tracking-[0.15em]"
//             style={{ color: "var(--heading)" }}
//           >
//             NOD INDIA
//           </span>
//         </a>

//         <nav className="hidden md:flex items-center gap-10">
//           {links.map((l) => (
//             <a
//               key={l}
//               href={l === "Home" ? "/" : `/${l}`}
//               className="relative text-[13px] font-medium tracking-wide pb-1"
//               style={{
//                 color: l === "About" ? "var(--heading)" : "var(--text)",
//               }}
//             >
//               {l}
//               {l === "About" && (
//                 <span
//                   className="absolute left-0 right-0 -bottom-0.5 h-[1.5px]"
//                   style={{ backgroundColor: "var(--gold)" }}
//                 />
//               )}
//             </a>
//           ))}
//         </nav>

//         <a
//           href="/Signin"
//           className="hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13px] font-semibold"
//           style={{ backgroundColor: "var(--primary)", color: "var(--surface)" }}
//         >
//           Let's Talk
//         </a>

//         <button
//           className="md:hidden"
//           onClick={() => setOpen((o) => !o)}
//           aria-label="Toggle menu"
//           style={{ color: "var(--heading)" }}
//         >
//           {open ? <X size={22} /> : <Menu size={22} />}
//         </button>
//       </div>

//       {open && (
//         <div
//           className="md:hidden border-t px-6 py-5 flex flex-col gap-4"
//           style={{ borderColor: "var(--border)" }}
//         >
//           {links.map((l) => (
//             <a
//               key={l}
//               href={l === "Home" ? "/" : `/${l}`}
//               className="text-sm font-medium"
//               style={{ color: l === "About" ? "var(--heading)" : "var(--text)" }}
//             >
//               {l}
//             </a>
//           ))}
//           <a
//             href="/Signin"
//             className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold mt-2"
//             style={{ backgroundColor: "var(--primary)", color: "var(--surface)" }}
//           >
//             Let's Talk
//           </a>
//         </div>
//       )}
//     </header>
//   );
// }

// function Eyebrow({ children, align = "left" }) {
//   return (
//     <p
//       className="text-[11px] font-semibold uppercase tracking-[0.28em] mb-4"
//       style={{ color: "var(--muted)", textAlign: align }}
//     >
//       {children}
//     </p>
//   );
// }

// export default function About() {
//   const [purposeRef, purposeVisible] = useReveal();
//   const [disciplinesRef, disciplinesVisible] = useReveal();
//   const [founderRef, founderVisible] = useReveal();
//   const [statsRef, statsVisible] = useReveal();
//   const [processRef, processVisible] = useReveal();
//   const [galleryRef, galleryVisible] = useReveal();
//   const [testimonialsRef, testimonialsVisible] = useReveal();
//   const [faqRef, faqVisible] = useReveal();

//   const [openFaq, setOpenFaq] = useState(0);
//   const [galleryIndex, setGalleryIndex] = useState(0);

//   const disciplines = [
//     { icon: Home, title: "Interior Designers", copy: "Spaces that feel like home" },
//     { icon: Building2, title: "Architects", copy: "Structures that inspire" },
//     { icon: Boxes, title: "BIM Engineers", copy: "Accurate, collaborative models" },
//     { icon: Trees, title: "Landscape Designers", copy: "Outdoor spaces that breathe" },
//     { icon: Palette, title: "Exterior Designers", copy: "Facades that make an impact" },
//     { icon: Hammer, title: "Contractors", copy: "Ideas, built with precision" },
//     { icon: Package, title: "Material Suppliers", copy: "Quality materials within reach" },
//   ];

//   const purposePoints = [
//     { n: "01", title: "People", copy: "A global community of experts" },
//     { n: "02", title: "Projects", copy: "From concept to completion" },
//     { n: "03", title: "Possibilities", copy: "Built through collaboration" },
//   ];

//   const stats = [
//     { value: "500+", label: "Professionals onboarded" },
//     { value: "100+", label: "Projects enabled" },
//     { value: "10+", label: "Cities across India" },
//     { value: "Global", label: "Vision for tomorrow" },
//   ];

//   const steps = [
//     { n: "01", title: "Share the brief", copy: "Tell us the space, budget, and what you have in mind." },
//     { n: "02", title: "Meet your match", copy: "We shortlist the right professionals for you." },
//     { n: "03", title: "Collaborate on NOD", copy: "Chat, share files, review, and iterate in one place." },
//     { n: "04", title: "Build, on time", copy: "Get it delivered with clarity, transparency, and trust." },
//   ];

//   const gallery = [
//     { label: "Interiors", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80" },
//     { label: "Landscapes", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80" },
//     { label: "Architecture", img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=80" },
//   ];

//   const testimonials = [
//     {
//       quote:
//         "NOD made it incredibly easy to find the right designer for our home. The process was smooth, transparent, and actually enjoyable.",
//       name: "Ritika Sharma",
//       role: "Homeowner, Pune",
//       avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
//     },
//     {
//       quote:
//         "A single platform where architects, contractors, and suppliers come together — this is exactly what the industry needed.",
//       name: "Arjun Mehta",
//       role: "Interior Designer, NOD Professional",
//       avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
//     },
//   ];

//   const faqs = [
//     { q: "What if I'm not happy with a match?", a: "You can request a new shortlist at any point before a brief is confirmed — there's no obligation to proceed with a match that isn't right for your project." },
//     { q: "How does payment protection work?", a: "Funds are held against agreed milestones and only release once each stage of work is delivered and approved, so neither side is paying — or working — on trust alone." },
//     { q: "Is there a fee to join as a professional?", a: "Creating a profile and browsing briefs is free. NOD takes a small commission only once a project is confirmed through the platform." },
//     { q: "What cities and countries are you live in?", a: "We're starting in India, expanding city by city, with the platform built to scale to new countries as our professional network grows." },
//   ];

//   const nextGallery = () => setGalleryIndex((i) => (i + 1) % gallery.length);
//   const prevGallery = () => setGalleryIndex((i) => (i - 1 + gallery.length) % gallery.length);

//   return (
//     <div style={{ backgroundColor: "var(--background)" }} className="overflow-x-hidden">
//       <Navbar />

//       {/* ============ HERO ============ */}
//       <section className="relative">
//         <div className="relative h-[560px] md:h-[620px] w-full">
//           <img src={heroImage} alt="Warmly lit dining room at night" className="absolute inset-0 h-full w-full object-cover" />
//           <div
//             className="absolute inset-0"
//             style={{ background: "linear-gradient(100deg, rgba(15,12,9,0.86) 30%, rgba(15,12,9,0.35) 75%)" }}
//           />

//           <div className="relative h-full mx-auto max-w-7xl px-6 md:px-10 flex flex-col justify-center">
//             <p
//               className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-6"
//               style={{ color: "var(--gold)" }}
//             >
//               About NOD
//             </p>
//             <h1
//               className="font-[var(--font-heading)] leading-[1.08] max-w-xl"
//               style={{ color: "var(--surface)", fontSize: "clamp(2.1rem, 5vw, 3.4rem)" }}
//             >
//               Good design doesn't keep office hours.
//               <br />
//               <span style={{ color: "var(--gold)" }}>Neither do we.</span>
//             </h1>
//             <p
//               className="max-w-md text-sm md:text-[15px] leading-relaxed mt-6"
//               style={{ color: "rgba(255,255,255,0.68)" }}
//             >
//               NOD is a technology-driven marketplace for the global design and
//               construction industry — bringing interior designers, architects,
//               BIM engineers, landscape and exterior designers, contractors,
//               and material suppliers onto one thread, so a project never has
//               to live across five different apps.
//             </p>
//             <div className="flex items-center gap-2 mt-8">
//               <span className="h-1 w-1 rounded-full" style={{ backgroundColor: "var(--gold)" }} />
//               <span className="text-xs tracking-wide" style={{ color: "rgba(255,255,255,0.55)" }}>
//                 Starting in India, built to scale globally.
//               </span>
//             </div>

//             <div className="hidden md:flex flex-col items-end gap-1.5 absolute right-10 top-1/2 -translate-y-1/2">
//               {["SPACES", "PEOPLE", "IDEAS", "TOGETHER"].map((w) => (
//                 <span
//                   key={w}
//                   className="text-[11px] font-semibold tracking-[0.25em]"
//                   style={{ color: "rgba(255,255,255,0.4)" }}
//                 >
//                   {w}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ============ OUR PURPOSE ============ */}
//       <section
//         ref={purposeRef}
//         className="px-6 md:px-10 py-20 md:py-28"
//         style={{ backgroundColor: "var(--background)" }}
//       >
//         <div
//           className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-center transition-all duration-700"
//           style={{
//             opacity: purposeVisible ? 1 : 0,
//             transform: purposeVisible ? "translateY(0)" : "translateY(16px)",
//           }}
//         >
//           <div className="md:col-span-4">
//             <Eyebrow>Our Purpose</Eyebrow>
//             <h2
//               className="font-[var(--font-heading)] text-3xl md:text-[2.4rem] leading-tight mb-5"
//               style={{ color: "var(--heading)" }}
//             >
//               A more connected way to build.
//             </h2>
//             <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text)" }}>
//               We exist to simplify how the design and construction world
//               collaborates. By uniting talent, tools, and trust on one
//               platform, we help great ideas move from concept to reality —
//               faster, smarter, and together.
//             </p>
//             <a
//               href="#story"
//               className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold"
//               style={{ backgroundColor: "var(--primary)", color: "var(--surface)" }}
//             >
//               Our Story <ArrowRight size={15} />
//             </a>
//           </div>

//           <div className="md:col-span-5">
//             <div className="rounded-2xl overflow-hidden aspect-[4/3]">
//               <img src={purposeImage} alt="Architectural balcony detail" className="h-full w-full object-cover" />
//             </div>
//           </div>

//           <div className="md:col-span-3 flex md:flex-col gap-8 md:pl-4 flex-wrap">
//             {purposePoints.map(({ n, title, copy }) => (
//               <div key={n} className="flex items-start gap-3">
//                 <Plus size={14} className="mt-1 flex-shrink-0" style={{ color: "var(--gold)" }} />
//                 <div>
//                   <p className="text-[11px] font-semibold tracking-wide mb-1" style={{ color: "var(--muted)" }}>
//                     {n}
//                   </p>
//                   <p className="text-sm font-semibold mb-1" style={{ color: "var(--heading)" }}>
//                     {title}
//                   </p>
//                   <p className="text-xs leading-relaxed" style={{ color: "var(--text)" }}>
//                     {copy}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ============ SEVEN DISCIPLINES ============ */}
//       <section
//         ref={disciplinesRef}
//         className="px-6 md:px-10 py-20"
//         style={{ backgroundColor: "var(--background-secondary)" }}
//       >
//         <div className="mx-auto max-w-7xl">
//           <div className="flex items-end justify-between gap-6 flex-wrap mb-14">
//             <div>
//               <Eyebrow>Seven disciplines, one marketplace</Eyebrow>
//               <h2
//                 className="font-[var(--font-heading)] text-3xl md:text-[2.2rem] leading-tight"
//                 style={{ color: "var(--heading)" }}
//               >
//                 Built for every player
//                 <br />
//                 in the process.
//               </h2>
//             </div>
//             <a
//               href="/Services"
//               className="inline-flex items-center gap-1.5 text-sm font-semibold"
//               style={{ color: "var(--gold)" }}
//             >
//               Explore All Services <ArrowUpRight size={15} />
//             </a>
//           </div>

//           <div
//             className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-x-6 gap-y-10 transition-all duration-700"
//             style={{ opacity: disciplinesVisible ? 1 : 0 }}
//           >
//             {disciplines.map(({ icon: Icon, title, copy }, i) => (
//               <div key={title} className="flex flex-col gap-4">
//                 <Icon size={22} style={{ color: "var(--heading)" }} />
//                 <div>
//                   <p className="text-sm font-semibold mb-1.5 leading-snug" style={{ color: "var(--heading)" }}>
//                     {title}
//                   </p>
//                   <p className="text-xs leading-relaxed" style={{ color: "var(--text)" }}>
//                     {copy}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ============ FOUNDER ============ */}
//       <section
//         ref={founderRef}
//         className="px-6 md:px-10 py-20 md:py-28"
//         style={{ backgroundColor: "var(--background)" }}
//       >
//         <div
//           className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-10 items-center transition-all duration-700"
//           style={{
//             opacity: founderVisible ? 1 : 0,
//             transform: founderVisible ? "translateY(0)" : "translateY(16px)",
//           }}
//         >
//           <div className="md:col-span-4 order-2 md:order-1">
//             <Eyebrow>The Founder</Eyebrow>
//             <h2
//               className="font-[var(--font-heading)] text-3xl md:text-[2.3rem] leading-tight mb-5"
//               style={{ color: "var(--heading)" }}
//             >
//               Design, for a better tomorrow.
//             </h2>
//             <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text)" }}>
//               NOD started from a simple belief — that great spaces are built
//               by great people, and great people deserve a better way to work
//               together. What began as a late-night idea has now grown into a
//               global vision.
//             </p>
//             <p
//               className="font-[var(--font-heading)] text-2xl mb-2 italic"
//               style={{ color: "var(--heading)" }}
//             >
//               Anuj
//             </p>
//             <p className="text-xs tracking-wide" style={{ color: "var(--muted)" }}>
//               Founder, NOD India
//             </p>
//           </div>

//           <div className="md:col-span-5 order-1 md:order-2">
//             <div className="rounded-2xl overflow-hidden aspect-[4/5]">
//               <img src={founder} alt="Founder of NOD India" className="h-full w-full object-cover" />
//             </div>
//           </div>

//           <div className="md:col-span-3 order-3">
//             <div
//               className="rounded-2xl p-8"
//               style={{ backgroundColor: "var(--background-secondary)" }}
//             >
//               <Quote size={24} style={{ color: "var(--gold)" }} className="mb-5" />
//               <p
//                 className="font-[var(--font-heading)] italic text-xl leading-snug mb-6"
//                 style={{ color: "var(--heading)" }}
//               >
//                 Better collaboration builds better spaces.
//               </p>
//               <p className="text-[11px] font-semibold tracking-[0.2em]" style={{ color: "var(--muted)" }}>
//                 NOD INDIA
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ============ STATS ============ */}
//       <section ref={statsRef} className="px-6 md:px-10 py-16" style={{ backgroundColor: "var(--primary)" }}>
//         <div
//           className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-10 transition-all duration-700"
//           style={{ opacity: statsVisible ? 1 : 0 }}
//         >
//           {stats.map(({ value, label }) => (
//             <div key={label}>
//               <p
//                 className="font-[var(--font-heading)] text-3xl md:text-4xl mb-2"
//                 style={{ color: "var(--surface)" }}
//               >
//                 {value}
//               </p>
//               <p className="text-xs md:text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
//                 {label}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ============ PROCESS ============ */}
//       <section ref={processRef} className="px-6 md:px-10 py-20 md:py-28" style={{ backgroundColor: "var(--background)" }}>
//         <div className="mx-auto max-w-7xl">
//           <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 items-end">
//             <div className="md:col-span-6">
//               <Eyebrow>How it works</Eyebrow>
//               <h2
//                 className="font-[var(--font-heading)] text-3xl md:text-[2.2rem] leading-tight"
//                 style={{ color: "var(--heading)" }}
//               >
//                 From brief to build,
//                 <br />
//                 on one thread.
//               </h2>
//             </div>
//             <div className="md:col-span-6 flex md:justify-end">
//               <div className="max-w-sm">
//                 <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text)" }}>
//                   Share your brief, get matched with the right professionals,
//                   collaborate seamlessly, and bring your vision to life — all
//                   in one place.
//                 </p>
//                 <a
//                   href="#story"
//                   className="inline-flex items-center gap-1.5 text-sm font-semibold"
//                   style={{ color: "var(--gold)" }}
//                 >
//                   Learn More <ArrowRight size={14} />
//                 </a>
//               </div>
//             </div>
//           </div>

//           <div
//             className="relative transition-all duration-700"
//             style={{ opacity: processVisible ? 1 : 0 }}
//           >
//             <div
//               className="hidden md:block absolute top-[9px] left-0 right-0 h-px"
//               style={{ backgroundColor: "var(--border)" }}
//             />
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
//               {steps.map((step) => (
//                 <div key={step.n} className="relative">
//                   <div className="flex items-center gap-3 mb-5">
//                     <span
//                       className="h-[9px] w-[9px] rounded-full flex-shrink-0 relative z-10"
//                       style={{ backgroundColor: "var(--gold)" }}
//                     />
//                     <span className="text-xs font-semibold tracking-wide" style={{ color: "var(--muted)" }}>
//                       {step.n}
//                     </span>
//                   </div>
//                   <h3 className="text-base font-semibold mb-2" style={{ color: "var(--heading)" }}>
//                     {step.title}
//                   </h3>
//                   <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
//                     {step.copy}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ============ GALLERY ============ */}
//       <section ref={galleryRef} className="px-6 md:px-10 py-20 md:py-28" style={{ backgroundColor: "var(--background-secondary)" }}>
//         <div className="mx-auto max-w-7xl">
//           <div className="flex items-end justify-between gap-6 flex-wrap mb-14">
//             <div>
//               <Eyebrow>Our Work</Eyebrow>
//               <h2
//                 className="font-[var(--font-heading)] text-3xl md:text-[2.2rem] leading-tight"
//                 style={{ color: "var(--heading)" }}
//               >
//                 Built across India and beyond.
//               </h2>
//             </div>
//             <a
//               href="/Projects"
//               className="inline-flex items-center gap-1.5 text-sm font-semibold"
//               style={{ color: "var(--gold)" }}
//             >
//               View All Projects <ArrowUpRight size={15} />
//             </a>
//           </div>

//           <div
//             className="relative transition-all duration-700"
//             style={{ opacity: galleryVisible ? 1 : 0 }}
//           >
//             <button
//               onClick={prevGallery}
//               aria-label="Previous"
//               className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full items-center justify-center border"
//               style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--heading)" }}
//             >
//               <ChevronLeft size={18} />
//             </button>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//               {gallery.map(({ label, img }) => (
//                 <div key={label} className="relative rounded-xl overflow-hidden aspect-[4/3]">
//                   <img src={img} alt={label} className="h-full w-full object-cover" />
//                   <div
//                     className="absolute inset-0"
//                     style={{ background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.55) 100%)" }}
//                   />
//                   <p
//                     className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-[0.15em]"
//                     style={{ color: "var(--surface)" }}
//                   >
//                     {label}
//                   </p>
//                 </div>
//               ))}
//             </div>

//             <button
//               onClick={nextGallery}
//               aria-label="Next"
//               className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full items-center justify-center border"
//               style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--heading)" }}
//             >
//               <ChevronRight size={18} />
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* ============ TESTIMONIALS ============ */}
//       <section ref={testimonialsRef} className="px-6 md:px-10 py-20 md:py-28" style={{ backgroundColor: "var(--background)" }}>
//         <div className="mx-auto max-w-7xl">
//           <div className="flex items-end justify-between gap-6 flex-wrap mb-14">
//             <div>
//               <Eyebrow>In their words</Eyebrow>
//               <h2
//                 className="font-[var(--font-heading)] text-3xl md:text-[2.2rem] leading-tight"
//                 style={{ color: "var(--heading)" }}
//               >
//                 From clients and professionals
//               </h2>
//             </div>
//             <a
//               href="#stories"
//               className="inline-flex items-center gap-1.5 text-sm font-semibold"
//               style={{ color: "var(--gold)" }}
//             >
//               More Stories <ArrowUpRight size={15} />
//             </a>
//           </div>

//           <div
//             className="grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-700"
//             style={{ opacity: testimonialsVisible ? 1 : 0 }}
//           >
//             {testimonials.map(({ quote, name, role, avatar }) => (
//               <div
//                 key={name}
//                 className="rounded-2xl p-8 border"
//                 style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
//               >
//                 <p className="text-sm md:text-[15px] leading-relaxed mb-8" style={{ color: "var(--text)" }}>
//                   "{quote}"
//                 </p>
//                 <div className="flex items-center gap-3">
//                   <img src={avatar} alt={name} className="h-10 w-10 rounded-full object-cover" />
//                   <div>
//                     <p className="text-sm font-semibold" style={{ color: "var(--heading)" }}>
//                       {name}
//                     </p>
//                     <p className="text-xs" style={{ color: "var(--muted)" }}>
//                       {role}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ============ FAQ ============ */}
//       <section ref={faqRef} className="px-6 md:px-10 py-20 md:py-28" style={{ backgroundColor: "var(--background-secondary)" }}>
//         <div className="mx-auto max-w-7xl">
//           <div className="flex items-end justify-between gap-6 flex-wrap mb-14">
//             <div>
//               <Eyebrow>Questions</Eyebrow>
//               <h2
//                 className="font-[var(--font-heading)] text-3xl md:text-[2.2rem] leading-tight"
//                 style={{ color: "var(--heading)" }}
//               >
//                 Before you get started
//               </h2>
//             </div>
//             <a
//               href="#faq"
//               className="inline-flex items-center gap-1.5 text-sm font-semibold"
//               style={{ color: "var(--gold)" }}
//             >
//               View All FAQs <ArrowUpRight size={15} />
//             </a>
//           </div>

//           <div
//             className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-700"
//             style={{ opacity: faqVisible ? 1 : 0 }}
//           >
//             {faqs.map(({ q, a }, i) => {
//               const isOpen = openFaq === i;
//               return (
//                 <div
//                   key={q}
//                   className="rounded-xl border overflow-hidden"
//                   style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
//                 >
//                   <button
//                     onClick={() => setOpenFaq(isOpen ? -1 : i)}
//                     className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
//                   >
//                     <span className="text-sm font-semibold" style={{ color: "var(--heading)" }}>
//                       {q}
//                     </span>
//                     <Plus
//                       size={16}
//                       className="shrink-0 transition-transform duration-300"
//                       style={{ color: "var(--gold)", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
//                     />
//                   </button>
//                   <div className="grid transition-all duration-300" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
//                     <div className="overflow-hidden">
//                       <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
//                         {a}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* ============ CTA ============ */}
//       <section className="relative">
//         <div className="relative min-h-[460px] flex items-center">
//           <img src={ctaImage} alt="Warm lounge interior" className="absolute inset-0 h-full w-full object-cover" />
//           <div className="absolute inset-0" style={{ backgroundColor: "rgba(17,13,10,0.82)" }} />

//           <div className="relative mx-auto max-w-7xl px-6 md:px-10 py-20 w-full">
//             <p className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-6" style={{ color: "var(--gold)" }}>
//               Let's Build Together
//             </p>
//             <h2
//               className="font-[var(--font-heading)] leading-[1.1] max-w-xl mb-6"
//               style={{ color: "var(--surface)", fontSize: "clamp(1.9rem, 4.5vw, 2.9rem)" }}
//             >
//               Bring your brief.
//               <br />
//               We'll bring the right people.
//             </h2>
//             <p className="max-w-md text-sm leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.65)" }}>
//               Whether you're planning a single room or a full build across
//               every discipline, NOD gets you talking to the right
//               professional by the end of the week.
//             </p>
//             <div className="flex flex-wrap items-center gap-4">
//               <a
//                 href="/Signin"
//                 className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold"
//                 style={{ backgroundColor: "var(--gold)", color: "var(--primary)" }}
//               >
//                 Post Your Brief <ArrowRight size={16} />
//               </a>
//               <a
//                 href="/Signin"
//                 className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold border"
//                 style={{ borderColor: "rgba(255,255,255,0.35)", color: "var(--surface)" }}
//               >
//                 Join as a Professional
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }



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
  Menu,
  X,
} from "lucide-react";
import "../theme.css";
import Profile from "../assets/founder.png";
/* Replace with your real founder photo import, e.g.:
   import founder from "../assets/founder.png";
   Falling back to a stock portrait so the file runs standalone. */
const founder = Profile;

const heroImage =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80";
const purposeImage =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80";
const ctaImage =
  "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1600&q=80";

/* ---------- helpers ---------- */

/* Fades a section in once it scrolls into view */
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

/* Animates a stat value ("500+", "10+", "Global") up from zero once visible */
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

function OwlMark({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="19" stroke="var(--heading)" strokeWidth="1.2" />
      <path
        d="M13 17c0-3 2.2-5 4.5-5M27 17c0-3-2.2-5-4.5-5"
        stroke="var(--heading)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="15.5" cy="19.5" r="2.6" stroke="var(--heading)" strokeWidth="1.1" />
      <circle cx="24.5" cy="19.5" r="2.6" stroke="var(--heading)" strokeWidth="1.1" />
      <circle cx="15.5" cy="19.5" r="0.7" fill="var(--heading)" />
      <circle cx="24.5" cy="19.5" r="0.7" fill="var(--heading)" />
      <path d="M18.7 22.5l1.3 1.6 1.3-1.6" stroke="var(--heading)" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M13 27c2.5-2 11.5-2 14 0" stroke="var(--heading)" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}



function Eyebrow({ children }) {
  return (
    <p
      className="text-[11px] font-semibold uppercase tracking-[0.28em] mb-4"
      style={{ color: "var(--muted)" }}
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
  const [gallery, setGallery] = useState([
    { label: "Interiors", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80" },
    { label: "Landscapes", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80" },
    { label: "Architecture", img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=80" },
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
    { icon: Home, title: "Interior Designers", copy: "Spaces that feel like home" },
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

  const testimonials = [
    {
      quote:
        "NOD made it incredibly easy to find the right designer for our home. The process was smooth, transparent, and actually enjoyable.",
      name: "Ritika Sharma",
      role: "Homeowner, Pune",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    },
    {
      quote:
        "A single platform where architects, contractors, and suppliers come together — this is exactly what the industry needed.",
      name: "Arjun Mehta",
      role: "Interior Designer, NOD Professional",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    },
  ];

  const faqs = [
    { q: "What if I'm not happy with a match?", a: "You can request a new shortlist at any point before a brief is confirmed — there's no obligation to proceed with a match that isn't right for your project." },
    { q: "How does payment protection work?", a: "Funds are held against agreed milestones and only release once each stage of work is delivered and approved, so neither side is paying — or working — on trust alone." },
    { q: "Is there a fee to join as a professional?", a: "Creating a profile and browsing briefs is free. NOD takes a small commission only once a project is confirmed through the platform." },
    { q: "What cities and countries are you live in?", a: "We're starting in India, expanding city by city, with the platform built to scale to new countries as our professional network grows." },
  ];

  const tickerWords = ["Interior Designers", "Architects", "BIM Engineers", "Landscape Designers", "Exterior Designers", "Contractors", "Material Suppliers"];

  return (
    <div style={{ backgroundColor: "var(--background)" }} className="overflow-x-hidden">
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
        .nod-nav-link:hover .nod-nav-underline { width: 100%; }
        .nod-nav-underline { transition: width 0.3s ease; }
        .nod-card-hover { transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease, border-color 0.4s ease; }
        .nod-card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 40px -20px rgba(28,23,18,0.25); border-color: var(--gold); }
        .nod-img-zoom { transition: transform 0.7s cubic-bezier(0.16,1,0.3,1); }
        .nod-img-zoom-wrap:hover .nod-img-zoom { transform: scale(1.08); }
        .nod-icon-hover { transition: transform 0.45s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s ease, background-color 0.3s ease; }
        .nod-discipline:hover .nod-icon-hover { transform: rotate(-8deg) scale(1.08); border-color: var(--gold); }
        .nod-btn { transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease; }
        .nod-btn:hover { transform: translateY(-3px); }
        .nod-dot { transition: all 0.3s ease; }
        @media (prefers-reduced-motion: reduce) {
          .nod-hero-in, .nod-kenburns, .nod-float, .nod-glow, .nod-marquee-track { animation: none !important; }
        }
      `}</style>

      {/* scroll progress */}
      <div
        className="fixed top-0 left-0 h-[3px] z-[60]"
        style={{ width: `${scrollPct}%`, backgroundColor: "var(--gold)", transition: "width 0.1s linear" }}
      />

    

      {/* ============ HERO ============ */}
      <section className="relative">
        <div className="relative h-[560px] md:h-[620px] w-full overflow-hidden">
          <img
            src={heroImage}
            alt="Warmly lit dining room at night"
            className="absolute inset-0 h-full w-full object-cover nod-kenburns"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(100deg, rgba(15,12,9,0.88) 30%, rgba(15,12,9,0.4) 75%)" }}
          />
          <div
            className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full nod-glow"
            style={{ background: "radial-gradient(circle, rgba(184,135,63,0.5) 0%, transparent 70%)" }}
          />

          <div className="relative h-full mx-auto max-w-7xl px-6 md:px-10 flex flex-col justify-center">
            <p
              className="nod-hero-in text-[11px] font-semibold uppercase tracking-[0.3em] mb-6"
              style={{ color: "var(--gold)", animationDelay: "0.05s" }}
            >
              About NOD
            </p>
            <h1
              className="nod-hero-in font-[var(--font-heading)] leading-[1.08] max-w-xl"
              style={{ color: "var(--surface)", fontSize: "clamp(2.1rem, 5vw, 3.4rem)", animationDelay: "0.18s" }}
            >
              Good design doesn't keep office hours.
              <br />
              <span style={{ color: "var(--gold)" }}>Neither do we.</span>
            </h1>
            <p
              className="nod-hero-in max-w-md text-sm md:text-[15px] leading-relaxed mt-6"
              style={{ color: "rgba(255,255,255,0.68)", animationDelay: "0.32s" }}
            >
              NOD is a technology-driven marketplace for the global design and
              construction industry — bringing interior designers, architects,
              BIM engineers, landscape and exterior designers, contractors,
              and material suppliers onto one thread, so a project never has
              to live across five different apps.
            </p>
            <div className="nod-hero-in flex items-center gap-2 mt-8" style={{ animationDelay: "0.46s" }}>
              <span className="h-1 w-1 rounded-full" style={{ backgroundColor: "var(--gold)" }} />
              <span className="text-xs tracking-wide" style={{ color: "rgba(255,255,255,0.55)" }}>
                Starting in India, built to scale globally.
              </span>
            </div>

            <div className="hidden md:flex flex-col items-end gap-1.5 absolute right-10 top-1/2 -translate-y-1/2">
              {["SPACES", "PEOPLE", "IDEAS", "TOGETHER"].map((w, i) => (
                <span
                  key={w}
                  className="nod-hero-in text-[11px] font-semibold tracking-[0.25em]"
                  style={{ color: "rgba(255,255,255,0.4)", animationDelay: `${0.5 + i * 0.1}s` }}
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
                    style={{ color: "var(--muted)" }}
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
            <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text)" }}>
              We exist to simplify how the design and construction world
              collaborates. By uniting talent, tools, and trust on one
              platform, we help great ideas move from concept to reality —
              faster, smarter, and together.
            </p>
            <a
              href="#story"
              className="nod-btn inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold hover:shadow-[0_14px_28px_-14px_rgba(28,23,18,0.5)]"
              style={{ backgroundColor: "var(--primary)", color: "var(--surface)" }}
            >
              Our Story <ArrowRight size={15} />
            </a>
          </div>

          <div
            className="md:col-span-5 nod-img-zoom-wrap transition-all duration-700 delay-150"
            style={{ opacity: purposeVisible ? 1 : 0, transform: purposeVisible ? "scale(1)" : "scale(0.96)" }}
          >
            <div className="rounded-2xl overflow-hidden aspect-[4/3]">
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
                  <p className="text-[11px] font-semibold tracking-wide mb-1" style={{ color: "var(--muted)" }}>
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

      {/* ============ SEVEN DISCIPLINES ============ */}
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
            <a
              href="/Services"
              className="nod-btn inline-flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: "var(--gold)" }}
            >
              Explore All Services <ArrowUpRight size={15} />
            </a>
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
                  className="nod-icon-hover h-11 w-11 rounded-xl border flex items-center justify-center"
                  style={{ borderColor: "var(--border)" }}
                >
                  <Icon size={20} style={{ color: "var(--heading)" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1.5 leading-snug" style={{ color: "var(--heading)" }}>
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

      {/* ============ FOUNDER ============ */}
      <section
        ref={founderRef}
        className="px-6 md:px-10 py-20 md:py-28"
        style={{ backgroundColor: "var(--background)" }}
      >
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div
            className="md:col-span-4 order-2 md:order-1 transition-all duration-700"
            style={{ opacity: founderVisible ? 1 : 0, transform: founderVisible ? "translateX(0)" : "translateX(-16px)" }}
          >
            <Eyebrow>The Founder</Eyebrow>
            <h2
              className="font-[var(--font-heading)] text-3xl md:text-[2.3rem] leading-tight mb-5"
              style={{ color: "var(--heading)" }}
            >
              Design, for a better tomorrow.
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text)" }}>
              NOD started from a simple belief — that great spaces are built
              by great people, and great people deserve a better way to work
              together. What began as a late-night idea has now grown into a
              global vision.
            </p>
            <p className="font-[var(--font-heading)] text-2xl mb-2 italic" style={{ color: "var(--heading)" }}>
              Govind Shukla 
            </p>
            <p className="text-xs tracking-wide" style={{ color: "var(--muted)" }}>
              Founder, NOD India
            </p>
          </div>

          <div
            className="md:col-span-5 order-1 md:order-2 nod-img-zoom-wrap transition-all duration-700 delay-150"
            style={{ opacity: founderVisible ? 1 : 0, transform: founderVisible ? "scale(1)" : "scale(0.96)" }}
          >
            <div className="rounded-2xl overflow-hidden aspect-[4/5]">
              <img src={founder} alt="Founder of NOD India" className="nod-img-zoom h-full w-full object-cover" />
            </div>
          </div>

          <div
            className="md:col-span-3 order-3 transition-all duration-700 delay-300"
            style={{ opacity: founderVisible ? 1 : 0, transform: founderVisible ? "translateX(0)" : "translateX(16px)" }}
          >
            <div className="nod-float rounded-2xl p-8" style={{ backgroundColor: "var(--background-secondary)" }}>
              <Quote size={24} style={{ color: "var(--gold)" }} className="mb-5" />
              <p className="font-[var(--font-heading)] italic text-xl leading-snug mb-6" style={{ color: "var(--heading)" }}>
                Better collaboration builds better spaces.
              </p>
              <p className="text-[11px] font-semibold tracking-[0.2em]" style={{ color: "var(--muted)" }}>
                NOD INDIA
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section ref={statsRef} className="px-6 md:px-10 py-16" style={{ backgroundColor: "var(--primary)" }}>
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map(({ value, label }, i) => (
            <div
              key={label}
              className="transition-all duration-700"
              style={{
                opacity: statsVisible ? 1 : 0,
                transform: statsVisible ? "translateY(0)" : "translateY(16px)",
                transitionDelay: `${i * 110}ms`,
              }}
            >
              <p className="font-[var(--font-heading)] text-3xl md:text-4xl mb-2" style={{ color: "var(--surface)" }}>
                <CountUp value={value} />
              </p>
              <p className="text-xs md:text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section ref={processRef} className="px-6 md:px-10 py-20 md:py-28" style={{ backgroundColor: "var(--background)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 items-end">
            <div className="md:col-span-6">
              <Eyebrow>How it works</Eyebrow>
              <h2
                className="font-[var(--font-heading)] text-3xl md:text-[2.2rem] leading-tight"
                style={{ color: "var(--heading)" }}
              >
                From brief to build,
                <br />
                on one thread.
              </h2>
            </div>
            <div className="md:col-span-6 flex md:justify-end">
              <div className="max-w-sm">
                <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text)" }}>
                  Share your brief, get matched with the right professionals,
                  collaborate seamlessly, and bring your vision to life — all
                  in one place.
                </p>
                <a href="#story" className="nod-btn inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--gold)" }}>
                  Learn More <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-[9px] left-0 right-0 h-px overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
              <div
                className="h-full origin-left"
                style={{
                  backgroundColor: "var(--gold)",
                  transform: processVisible ? "scaleX(1)" : "scaleX(0)",
                  transition: "transform 1.4s cubic-bezier(0.16,1,0.3,1)",
                  opacity: 0.5,
                }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
              {steps.map((step, i) => (
                <div
                  key={step.n}
                  className="relative transition-all duration-700"
                  style={{
                    opacity: processVisible ? 1 : 0,
                    transform: processVisible ? "translateY(0)" : "translateY(18px)",
                    transitionDelay: `${i * 160}ms`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span
                      className="nod-dot h-[9px] w-[9px] rounded-full flex-shrink-0 relative z-10"
                      style={{
                        backgroundColor: "var(--gold)",
                        transform: processVisible ? "scale(1)" : "scale(0)",
                        transitionDelay: `${i * 160 + 200}ms`,
                      }}
                    />
                    <span className="text-xs font-semibold tracking-wide" style={{ color: "var(--muted)" }}>
                      {step.n}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: "var(--heading)" }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
                    {step.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ GALLERY ============ */}
      <section ref={galleryRef} className="px-6 md:px-10 py-20 md:py-28" style={{ backgroundColor: "var(--background-secondary)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-14">
            <div>
              <Eyebrow>Our Work</Eyebrow>
              <h2 className="font-[var(--font-heading)] text-3xl md:text-[2.2rem] leading-tight" style={{ color: "var(--heading)" }}>
                Built across India and beyond.
              </h2>
            </div>
            <a href="/Projects" className="nod-btn inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--gold)" }}>
              View All Projects <ArrowUpRight size={15} />
            </a>
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
                  className="nod-img-zoom-wrap relative rounded-xl overflow-hidden aspect-[4/3] transition-all duration-700"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <img src={img} alt={label} className="nod-img-zoom h-full w-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
                  <p className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--surface)" }}>
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

      {/* ============ TESTIMONIALS ============ */}
      <section ref={testimonialsRef} className="px-6 md:px-10 py-20 md:py-28" style={{ backgroundColor: "var(--background)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-14">
            <div>
              <Eyebrow>In their words</Eyebrow>
              <h2 className="font-[var(--font-heading)] text-3xl md:text-[2.2rem] leading-tight" style={{ color: "var(--heading)" }}>
                From clients and professionals
              </h2>
            </div>
            <a href="#stories" className="nod-btn inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--gold)" }}>
              More Stories <ArrowUpRight size={15} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map(({ quote, name, role, avatar }, i) => (
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
                <Quote size={22} style={{ color: "var(--gold)" }} className="mb-5" />
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

      {/* ============ FAQ ============ */}
      <section ref={faqRef} className="px-6 md:px-10 py-20 md:py-28" style={{ backgroundColor: "var(--background-secondary)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-14">
            <div>
              <Eyebrow>Questions</Eyebrow>
              <h2 className="font-[var(--font-heading)] text-3xl md:text-[2.2rem] leading-tight" style={{ color: "var(--heading)" }}>
                Before you get started
              </h2>
            </div>
            <a href="#faq" className="nod-btn inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--gold)" }}>
              View All FAQs <ArrowUpRight size={15} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map(({ q, a }, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={q}
                  className="rounded-xl border overflow-hidden transition-all duration-500"
                  style={{
                    borderColor: isOpen ? "var(--gold)" : "var(--border)",
                    backgroundColor: "var(--surface)",
                    opacity: faqVisible ? 1 : 0,
                    transform: faqVisible ? "translateY(0)" : "translateY(14px)",
                    transitionDelay: `${i * 90}ms`,
                  }}
                >
                  <button onClick={() => setOpenFaq(isOpen ? -1 : i)} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
                    <span className="text-sm font-semibold" style={{ color: "var(--heading)" }}>
                      {q}
                    </span>
                    <Plus
                      size={16}
                      className="shrink-0 transition-transform duration-300"
                      style={{ color: "var(--gold)", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                    />
                  </button>
                  <div className="grid transition-all duration-300" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
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

      {/* ============ CTA ============ */}
      <section className="relative">
        <div className="relative min-h-[460px] flex items-center overflow-hidden">
          <img src={ctaImage} alt="Warm lounge interior" className="absolute inset-0 h-full w-full object-cover nod-kenburns" />
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(17,13,10,0.82)" }} />

          <div className="relative mx-auto max-w-7xl px-6 md:px-10 py-20 w-full">
            <p className="nod-hero-in text-[11px] font-semibold uppercase tracking-[0.3em] mb-6" style={{ color: "var(--gold)" }}>
              Let's Build Together
            </p>
            <h2
              className="nod-hero-in font-[var(--font-heading)] leading-[1.1] max-w-xl mb-6"
              style={{ color: "var(--surface)", fontSize: "clamp(1.9rem, 4.5vw, 2.9rem)", animationDelay: "0.12s" }}
            >
              Bring your brief.
              <br />
              We'll bring the right people.
            </h2>
            <p className="nod-hero-in max-w-md text-sm leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.65)", animationDelay: "0.24s" }}>
              Whether you're planning a single room or a full build across
              every discipline, NOD gets you talking to the right
              professional by the end of the week.
            </p>
            <div className="nod-hero-in flex flex-wrap items-center gap-4" style={{ animationDelay: "0.36s" }}>
              <a
                href="/Signin"
                className="nod-btn inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold hover:shadow-[0_14px_30px_-10px_rgba(184,135,63,0.6)]"
                style={{ backgroundColor: "var(--gold)", color: "var(--primary)" }}
              >
                Post Your Brief <ArrowRight size={16} />
              </a>
              <a
                href="/Signin"
                className="nod-btn inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold border hover:bg-white/10"
                style={{ borderColor: "rgba(255,255,255,0.35)", color: "var(--surface)" }}
              >
                Join as a Professional
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}