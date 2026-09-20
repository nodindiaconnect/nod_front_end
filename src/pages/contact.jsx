import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Loader2,
  CheckCircle2,
  Building2,
  MapPin,
  Phone,
  Sofa,
  PencilRuler,
  HardHat,
  Home,
  ClipboardList,
  BookOpen,
  Clock,
  ShieldCheck,
  Pencil,
  Heart,
  ArrowRight,
  Navigation,
} from "lucide-react";
import "../theme.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useSubmitContactSectionLeadMutation } from "./supplyproductsapislice";
import contact from "../assets/contact.png";

const PRIMARY = "var(--primary)";
const PRIMARY_HOVER = "var(--primary-hover)";
const GOLD = "var(--gold)";
const BG = "var(--background)";
const HEADING = "var(--heading)";
const TEXT = "var(--text)";
const MUTED = "var(--muted)";
const BORDER = "var(--border)";
const DANGER = "var(--danger)";

const SERVICES = [
  { label: "INTERIOR DESIGN", icon: Sofa },
  { label: "INTERIOR ARCHITECTURE", icon: PencilRuler },
  { label: "CONSTRUCTION", icon: HardHat },
  { label: "THE LIVING SYSTEM", icon: Home },
  { label: "PROJECT MANAGEMENT", icon: ClipboardList },
  { label: "PORTFOLIO", icon: BookOpen },
];
const OFFICES = [
  {
    icon: Building2,
    title: "NOD Studio",
    lines: [
      "Connect. Collaborate. Build.",
      "Designers, Architects & Contractors",
      "Projects, Bids & Professional Services",
      "Materials & Suppliers in One Place",
    ],
  },
  {
    icon: MapPin,
    title: "India Office",
    lines: [
      "1st Floor, Beside Uday Amrik Homes Main Gate",
      "Itarsi Road, Sadar",
      "Betul, Madhya Pradesh - 460001",
      "Monday to Friday",
      "10:00 AM to 5:00 PM IST",
    ],
  },
  {
    icon: Phone,
    title: "Direct",
    lines: [],
    email: "nightowldesignershelp@gmail.com",
    phone: "+91 89669 69035",
  },
];

const SOCIALS_DATA = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/nodindia.in?igsi=bG1lczVtMHNydHNu",
    svg: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "Twitter / X",
    href: "https://x.com/NODIndia",
    svg: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/nod-india-9131b9400",
    svg: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    ),
  },
  {
    name: "Email",
    href: "mailto:nightowldesignershelp@gmail.com",
    svg: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    ),
  },
];

const BENEFITS = [
  {
    icon: Clock,
    title: "Quick Response",
    desc: "We reply within 24 working hours",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Professionals",
    desc: "Experienced team delivering quality & excellence",
  },
  {
    icon: Pencil,
    title: "Tailored Solutions",
    desc: "Custom designs & solutions for every space",
  },
  { icon: Heart, title: "Client Focused", desc: "Your vision, our priority" },
];

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  optional,
  error,
  placeholder,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-[12px] font-medium"
        style={{ color: HEADING }}
      >
        {label}
        {optional && <span style={{ color: MUTED }}> (optional)</span>}
        {error && (
          <span className="text-[10px] ml-2" style={{ color: DANGER }}>
            {error}
          </span>
        )}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none rounded-lg px-3.5 py-2.5 mt-1.5"
        style={{
          color: HEADING,
          fontSize: 13,
          border: `1px solid ${error ? DANGER : BORDER}`,
        }}
      />
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Hero photo — real live image (swap the src for your own studio photo)  */
/* ---------------------------------------------------------------------- */

const HERO_IMAGE_URL = contact;

function HeroArt() {
  return (
    <img
      src={HERO_IMAGE_URL}
      alt="NOD Studio interior"
      className="w-full h-full object-cover"
      loading="lazy"
    />
  );
}

export default function ContactSection() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    service: "",
    details: "",
  });
  const [errors, setErrors] = useState({});

  const handleConnectNearbySuppliers = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          navigate(`/supplier-products?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}&nearby=true`);
        },
        () => {
          navigate("/supplier-products?nearby=true");
        }
      );
    } else {
      navigate("/supplier-products");
    }
  };

  const [submitLead, { isLoading, isSuccess, isError, error }] =
    useSubmitContactSectionLeadMutation();

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      await submitLead({
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        phone: form.phone.trim(),
        service: form.service,
        details: form.details.trim(),
      }).unwrap();
      setForm({
        name: "",
        email: "",
        company: "",
        phone: "",
        service: "",
        details: "",
      });
    } catch (err) {
      if (err?.data?.errors) setErrors(err.data.errors);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: BG }}>
      <Navbar />
      <main className="flex-1 pt-20 md:pt-24">
        <section id="contact">
          {/* ------------------------------------------------------------ */}
          {/* Hero                                                          */}
          {/* ------------------------------------------------------------ */}
          <div className="relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
              <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-16 md:py-0 min-h-[320px] md:min-h-[460px]">
                <p
                  className="text-[12px] font-bold tracking-[0.2em] uppercase mb-3"
                  style={{ color: GOLD }}
                >
              Let's Connect
            </p>
            <h1
              className="leading-[0.92] mb-4 -ml-0.5"
              style={{
                color: HEADING,
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(42px, 6vw, 76px)",
              }}
            >
              Contact Us
            </h1>
            <p
              className="text-[15px] max-w-sm leading-relaxed"
              style={{ color: TEXT }}
            >
              Have a project in mind or just want to say hello? We'd love to
              hear from you and bring your ideas to life.
            </p>
            <div className="mt-6 w-10 h-[2px]" style={{ background: GOLD }} />
          </div>

          <div className="relative min-h-[300px] md:min-h-[460px]">
            <div className="absolute inset-0 rounded-tl-[100px] md:rounded-tl-[160px] overflow-hidden">
              <HeroArt />
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Get in touch + form card                                     */}
      {/* ------------------------------------------------------------ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div
          className="rounded-3xl p-6 sm:p-10"
          style={{
            background: BG,
            border: `1px solid ${BORDER}`,
            boxShadow: "0 24px 60px -30px rgba(28,23,18,0.25)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Left — office info */}
            <div className="md:col-span-4 flex flex-col">
              <h2
                className="text-[24px] mb-1"
                style={{ color: HEADING, fontFamily: "var(--font-heading)" }}
              >
                Get in Touch
              </h2>
              <div className="w-8 h-[2px] mb-7" style={{ background: GOLD }} />

              <div className="flex flex-col gap-6">
                {OFFICES.map(({ icon: Icon, title, lines, email, phone }) => (
                  <div key={title} className="flex items-start gap-3.5">
                    <span
                      className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(184,130,58,0.12)" }}
                    >
                      <Icon size={17} style={{ color: GOLD }} />
                    </span>
                    <div>
                      <h3
                        className="text-[12.5px] font-bold mb-1"
                        style={{ color: HEADING }}
                      >
                        {title}
                      </h3>
                      {lines.map((line) => (
                        <p
                          key={line}
                          className="text-[12px] leading-snug"
                          style={{ color: TEXT }}
                        >
                          {line}
                        </p>
                      ))}
                      {email && (
                        <p className="text-[12px]" style={{ color: PRIMARY }}>
                          {email}
                        </p>
                      )}
                      {phone && (
                        <p className="text-[12px]" style={{ color: TEXT }}>
                          {phone}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="mt-8 pt-6"
                style={{ borderTop: `1px solid ${BORDER}` }}
              >
                <p
                  className="text-[11px] font-bold mb-3"
                  style={{ color: HEADING }}
                >
                  Follow Us
                </p>
                <div className="flex items-center gap-2.5">
                  {SOCIALS_DATA.map((item, i) => (
                    <a
                      key={i}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      aria-label={item.name}
                      title={item.name}
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all border border-[var(--border)] text-[var(--text)] hover:text-[var(--gold)] hover:border-[var(--gold)] hover:scale-105"
                      style={{ background: "rgba(184,130,58,0.06)" }}
                    >
                      {item.svg}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className="md:col-span-8">
              {isSuccess ? (
                <div className="flex flex-col gap-2 py-10 items-start">
                  <CheckCircle2 size={30} style={{ color: GOLD }} />
                  <p
                    className="text-xl"
                    style={{
                      color: HEADING,
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    Message sent.
                  </p>
                  <p className="text-[12.5px]" style={{ color: MUTED }}>
                    Someone from our team will be in touch shortly.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="flex flex-col gap-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                    <Field
                      label="Your name"
                      name="name"
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={handleChange("name")}
                      error={errors.name}
                    />
                    <Field
                      label="Email address"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange("email")}
                      error={errors.email}
                    />
                    <Field
                      label="Company"
                      name="company"
                      placeholder="Enter company name"
                      value={form.company}
                      onChange={handleChange("company")}
                      optional
                    />
                    <Field
                      label="Contact number"
                      name="phone"
                      type="tel"
                      placeholder="Enter contact number"
                      value={form.phone}
                      onChange={handleChange("phone")}
                      error={errors.phone}
                      optional
                    />
                  </div>

                  <div>
                    <p
                      className="text-[12px] font-medium mb-3"
                      style={{ color: HEADING }}
                    >
                      What can we help with?
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {SERVICES.map(({ label, icon: Icon }) => {
                        const active = form.service === label;
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({ ...prev, service: label }))
                            }
                            className="flex items-center gap-2.5 text-[10.5px] font-medium tracking-[0.03em] px-3 py-3 rounded-lg text-left transition-colors"
                            style={{
                              border: `1px solid ${active ? PRIMARY : BORDER}`,
                              color: active ? BG : TEXT,
                              background: active ? PRIMARY : "transparent",
                            }}
                          >
                            <Icon
                              size={16}
                              style={{ color: active ? BG : GOLD }}
                              className="flex-shrink-0"
                            />
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="details"
                      className="text-[12px] font-medium"
                      style={{ color: HEADING }}
                    >
                      Tell us about your project{" "}
                      <span style={{ color: MUTED }}>(optional)</span>
                    </label>
                    <textarea
                      id="details"
                      name="details"
                      rows={4}
                      value={form.details}
                      onChange={handleChange("details")}
                      placeholder="Share your ideas, requirements, or any details about your project..."
                      className="w-full bg-transparent outline-none resize-none rounded-lg px-3.5 py-2.5 mt-1.5"
                      style={{
                        color: HEADING,
                        fontSize: 13,
                        border: `1px solid ${BORDER}`,
                      }}
                    />
                  </div>

                  {isError && !Object.keys(errors).length && (
                    <p className="text-[12px]" style={{ color: DANGER }}>
                      {error?.data?.message || "Couldn't send that. Try again."}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="self-start px-7 py-3 rounded-lg text-[12px] font-semibold tracking-[0.05em] flex items-center gap-2 disabled:opacity-60 transition-colors"
                    style={{ background: HEADING, color: BG }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        PRIMARY_HOVER || PRIMARY)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = HEADING)
                    }
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        SENDING
                      </>
                    ) : (
                      <>
                        SEND MESSAGE
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Benefits strip                                                */}
      {/* ------------------------------------------------------------ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-6 rounded-2xl px-6 sm:px-8 py-7"
          style={{ border: `1px solid ${BORDER}` }}
        >
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-start gap-2.5">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ border: `1px solid ${GOLD}` }}
              >
                <Icon size={16} style={{ color: GOLD }} />
              </span>
              <div>
                <p
                  className="text-[12.5px] font-bold"
                  style={{ color: HEADING }}
                >
                  {title}
                </p>
                <p
                  className="text-[11.5px] leading-snug"
                  style={{ color: MUTED }}
                >
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Visit our studio / map                                       */}
      {/* ------------------------------------------------------------ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-8 pb-4">
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-8 rounded-2xl p-6 sm:p-8"
          style={{ border: `1px solid ${BORDER}` }}
        >
          <div className="md:col-span-4 flex flex-col justify-center">
            <h2
              className="text-[24px] mb-1"
              style={{
                color: HEADING,
                fontFamily: "var(--font-heading)",
              }}
            >
              Explore Supplier Products
            </h2>

            <div className="w-8 h-[2px] mb-4" style={{ background: GOLD }} />

            <p
              className="text-[13px] leading-relaxed mb-6"
              style={{ color: TEXT }}
            >
              Discover quality products from trusted suppliers for your interior
              and construction projects. Browse materials, compare options, and
              find the right products for your requirements.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/supplier-products")}
                className="px-5 py-3 rounded-lg text-[11.5px] font-semibold tracking-[0.05em] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                style={{
                  border: `1px solid ${HEADING}`,
                  color: HEADING,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = HEADING;
                  e.currentTarget.style.color = BG;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = HEADING;
                }}
              >
                Browse Supplier Products
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={handleConnectNearbySuppliers}
                className="px-5 py-3 rounded-lg text-[11.5px] font-semibold tracking-[0.05em] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                style={{
                  background: GOLD,
                  color: "#1b130f",
                  border: `1px solid ${GOLD}`,
                }}
              >
                <Navigation size={13} />
                Connect Nearby Suppliers
              </button>
            </div>
          </div>

          <div className="md:col-span-8">
            <div
              className="relative w-full min-h-[340px] rounded-2xl overflow-hidden shadow-md"
              style={{ border: `1px solid ${BORDER}` }}
            >
              <iframe
                title="NOD Studio & Head Office location"
                src="https://maps.google.com/maps?q=Beside+Uday+Amrik+Homes+Main+Gate,+Itarsi+Road,+Sadar,+Betul,+Madhya+Pradesh+460001&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />

              <div
                className="absolute bottom-4 right-4 max-w-[260px] rounded-xl p-4 bg-white/95 backdrop-blur-md shadow-xl"
                style={{
                  border: `1px solid ${BORDER}`,
                }}
              >
                <p
                  className="text-[12.5px] font-bold mb-1"
                  style={{ color: HEADING }}
                >
                  NOD Studio &amp; Head Office
                </p>
                <p
                  className="text-[11.5px] leading-snug mb-2"
                  style={{ color: TEXT }}
                >
                  Beside Uday Amrik Homes, Itarsi Road, Sadar, Betul – 460001, MP, India
                </p>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Beside+Uday+Amrik+Homes+Main+Gate,+Itarsi+Road,+Sadar,+Betul,+Madhya+Pradesh+460001"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11.5px] font-semibold flex items-center gap-1 hover:underline"
                  style={{ color: GOLD }}
                >
                  GET DIRECTIONS
                  <ArrowRight size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  <Footer />
</div>
  );
}
