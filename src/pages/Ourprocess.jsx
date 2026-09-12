import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Palette,
  Compass,
  HardHat,
  ClipboardCheck,
  ArrowUpRight,
} from "lucide-react";
import "../theme.css";

export default function OurServices() {
  const services = [
    {
      icon: Palette,
      title: "Designers",
      desc: "Connect with verified  designers who craft personalized layouts, mood boards and material palettes tailored to your space, style and budget.",
      cta: "Find a Designer",
      to: "/explore?role=designer",
    },
    {
      icon: Compass,
      title: "Architects",
      desc: "Work with licensed architects for structural planning, space optimization and technical drawings — from concept sketches to construction-ready plans.",
      cta: "Find an Architect",
      to: "/explore?role=architect",
    },
    {
      icon: HardHat,
      title: "Contractors",
      desc: "Get matched with trusted contractors and builders who bring your design to life, handling procurement, on-site execution and quality control.",
      cta: "Find a Contractor",
      to: "/explore?role=contractor",
    },
    {
      icon: ClipboardCheck,
      title: "Verified Material Suppliers",
      desc: "Browse and connect with trusted material suppliers offering quality construction and interior products. Compare options, request quotations, and source materials with confidence.",
      cta: "Explore Suppliers",
      to: "/Signin",
    },
  ];

  return (
    <section
      id="services"
      className="relative py-24 px-4 md:px-8 overflow-hidden bg-[var(--background-secondary)]"
    >
      {/* BACKGROUND PHOTO */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=80"
          alt="Design studio team working"
          className="w-full h-full object-cover opacity-15"
          loading="lazy"
        />
        {/* WHITE WASH OVERLAY */}
        <div className="absolute inset-0 bg-[var(--background)]/85" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* HEADING */}
        <div className="mb-16 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--gold)] font-bold block mb-3">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--heading)] leading-tight font-[var(--font-heading)]">
            One Platform, Every{" "}
            <span className="text-[var(--gold)]">Expert</span> You Need
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-[var(--text)] font-light leading-relaxed font-[var(--font-body)]">
            Whether you need a single room reimagined or a full build managed
            start to finish, we connect you with verified DESIGNERS,
            architects and contractors — all in one place.
          </p>
          <div className="w-10 h-[2px] bg-[var(--gold)] mx-auto mt-8" />
        </div>

        {/* SERVICE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] p-6 flex flex-col items-start rounded-[var(--radius-lg)]"
                style={{ transition: "var(--transition)" }}
              >
                {/* ICON BADGE */}
                <div
                  className="h-14 w-14 flex items-center justify-center bg-[var(--primary)] group-hover:bg-[var(--gold)] text-[var(--surface)] mb-6 rounded-[var(--radius-md)]"
                  style={{ transition: "var(--transition)" }}
                >
                  <Icon size={24} strokeWidth={2} />
                </div>

                <h3
                  className="text-base font-bold text-[var(--heading)] mb-3 font-[var(--font-heading)] group-hover:text-[var(--gold-hover)]"
                  style={{ transition: "var(--transition)" }}
                >
                  {service.title}
                </h3>

                <p className="text-xs text-[var(--muted)] font-light leading-relaxed font-[var(--font-body)] mb-6">
                  {service.desc}
                </p>

                {/* CTA */}
                {/* <Link
                  to={service.to}
                  className="mt-auto inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-[var(--primary)] group-hover:text-[var(--gold-hover)]"
                  style={{ transition: "var(--transition)" }}
                >
                  {service.cta}
                  <ArrowUpRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ transition: "var(--transition)" }} />
                </Link> */}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
