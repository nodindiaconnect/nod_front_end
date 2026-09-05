import { useState } from "react";
import {
  Heart,
  Bookmark,
  Eye,
  MapPin,
  Calendar,
  IndianRupee,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import "../theme.css";

import commercialImg from "../assets/commercial_interior.jpg";
import residentialImg from "../assets/residential_bedroom.jpg";

export default function FeaturedProjects() {
  // Setup state for likes and saves
  const [likes, setLikes] = useState({});
  const [saves, setSaves] = useState({});

  const toggleLike = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setLikes((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleSave = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setSaves((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const projects = [
    {
      image: commercialImg,
      title: "Royal Heritage Reception Lounge",
      designer: "Aria Sterling",
      budget: "₹18.5M",
      location: "Mumbai, India",
      duration: "9 Months",
      className: "md:col-span-1 md:row-span-2 h-[550px] md:h-[700px]",
    },
    {
      image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200",
      title: "Scandinavian Modular Kitchen",
      designer: "Sophia Wilson",
      budget: "₹5.2M",
      location: "Bengaluru, India",
      duration: "4 Months",
      className: "md:col-span-2 md:row-span-1 h-[260px] md:h-[330px]",
    },
    {
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
      title: "Executive Corporate Interior",
      designer: "Oliver Bennett",
      budget: "₹8.8M",
      location: "Delhi NCR, India",
      duration: "6 Months",
      className: "md:col-span-1 md:row-span-1 h-[260px] md:h-[330px]",
    },
    {
      image: residentialImg,
      title: "Minimal Luxury Master Suite",
      designer: "Emma Carter",
      budget: "₹12.0M",
      location: "Pune, India",
      duration: "7 Months",
      className: "md:col-span-1 md:row-span-1 h-[260px] md:h-[330px]",
    },
    {
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
      title: "Contemporary Villa Architecture",
      designer: "Daniel Morgan",
      budget: "₹24.0M",
      location: "Hyderabad, India",
      duration: "11 Months",
      className: "md:col-span-2 md:row-span-1 h-[260px] md:h-[330px]",
    },
  ];

  return (
    <section
      id="projects"
      className="relative py-36 bg-[var(--background)] overflow-hidden px-4 md:px-8"
    >
      {/* BACKGROUND GLOW */}
      {/* <div className="absolute top-[30%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[var(--gold)]/6 via-[var(--primary)]/2 to-transparent blur-[120px] pointer-events-none" /> */}

      <div className="max-w-7xl mx-auto">
        {/* HEADING */}
        <div className="mb-20 text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--gold)] font-bold block mb-4">
              Curated Portfolio
            </span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-[var(--heading)] leading-tight font-[var(--font-heading)]">
            Featured project completed on NOD INDIA
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--text)] font-light opacity-90 font-[var(--font-body)]">
            A showcase of architectural marvels and luxury interior spaces
            crafted by award-winning professionals on NOD INDIA.
          </p>
        </div>

        {/* PINTEREST MASONRY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-min">
          {projects.map((project, index) => {
            const isLiked = !!likes[index];
            const isSaved = !!saves[index];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className={`group relative overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)] flex flex-col justify-end ${project.className}`}
              >
                {/* PROJECT IMAGE */}
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                />

                {/* GRADIENT OVERLAY (Always present, darkens on hover) */}
                {/* This overlay is always dark by design — everything drawn on top of it
                    must use the mode-stable --on-photo* tokens, not --surface, which
                    flips to a dark color in dark mode and would disappear here. */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 transition-opacity duration-500 group-hover:via-black/50 group-hover:from-black/95 z-10" />

                {/* GOLD CORNER ACCENT (top-left frame line, sharp aesthetic) */}
                <div className="absolute top-0 left-0 w-8 h-[2px] bg-[var(--gold)] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 left-0 w-[2px] h-8 bg-[var(--gold)] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* TOP BUTTONS (Like/Save) */}
                <div className="absolute top-5 right-5 z-20 flex gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* LIKE */}
                  <button
                    onClick={(e) => toggleLike(e, index)}
                    className={`h-10 w-10 flex items-center justify-center border transition-all duration-300 backdrop-blur-md cursor-pointer ${
                      isLiked
                        ? "bg-[var(--danger)]/20 border-[var(--danger)]/50 text-[var(--danger)]"
                        : "bg-black/45 border-white/10 text-[var(--on-photo)] hover:bg-black/70 hover:text-[var(--gold)]"
                    }`}
                    aria-label="Like project"
                  >
                    <Heart
                      size={16}
                      fill={isLiked ? "currentColor" : "none"}
                      className={isLiked ? "scale-110" : ""}
                    />
                  </button>

                  {/* SAVE */}
                  <button
                    onClick={(e) => toggleSave(e, index)}
                    className={`h-10 w-10 flex items-center justify-center border transition-all duration-300 backdrop-blur-md cursor-pointer ${
                      isSaved
                        ? "bg-[var(--gold)]/20 border-[var(--gold)]/50 text-[var(--gold)]"
                        : "bg-black/45 border-white/10 text-[var(--on-photo)] hover:bg-black/70 hover:text-[var(--gold)]"
                    }`}
                    aria-label="Save project"
                  >
                    <Bookmark
                      size={16}
                      fill={isSaved ? "currentColor" : "none"}
                      className={isSaved ? "scale-110" : ""}
                    />
                  </button>
                </div>

                {/* HOVER OVERLAY DETAILS */}
                <div className="relative z-20 p-6 md:p-8 flex flex-col items-start translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  {/* Title & Designer */}
                  <h3 className="text-2xl font-bold text-[var(--on-photo)] leading-snug mb-1 group-hover:text-[var(--gold)] transition-colors duration-300 font-[var(--font-heading)]">
                    {project.title}
                  </h3>

                  <div className="flex items-center gap-1.5 mb-4">
                    <User size={12} className="text-[var(--on-photo)]/70" />
                    <span className="text-xs text-[var(--on-photo)]/90 font-light">
                      By {project.designer}
                    </span>
                  </div>

                  {/* Stats Grid - Fades in on Hover */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full border-t border-white/10 pt-4 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 flex items-center justify-center text-[var(--gold)] border border-white/10 bg-white/5">
                        <IndianRupee size={10} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-[var(--on-photo)]/60 uppercase tracking-wider">
                          Est. Budget
                        </span>
                        <span className="text-xs text-[var(--on-photo)] font-medium">
                          {project.budget}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 flex items-center justify-center text-[var(--gold)] border border-white/10 bg-white/5">
                        <MapPin size={10} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-[var(--on-photo)]/60 uppercase tracking-wider">
                          Location
                        </span>
                        <span className="text-xs text-[var(--on-photo)] font-medium">
                          {project.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 col-span-2">
                      <div className="h-6 w-6 flex items-center justify-center text-[var(--gold)] border border-white/10 bg-white/5">
                        <Calendar size={10} />
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-[9px] text-[var(--on-photo)]/60 uppercase tracking-wider">
                          Completion Time
                        </span>
                        <span className="text-xs text-[var(--on-photo)] font-medium">
                          {project.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* View Project Button */}
                  {/* <button className="mt-6 flex items-center gap-1.5 text-xs text-[var(--on-photo)]/95 font-bold border-b border-white/20 pb-0.5 hover:text-[var(--gold)] hover:border-[var(--gold)] transition-colors duration-300">
                    <Eye size={12} />
                    <span>View Project Case Study</span>
                  </button> */}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
