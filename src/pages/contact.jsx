import { useState } from "react";
import {
  Loader2,
  CheckCircle2,
  Building2,
  MapPin,
  Phone,
  Globe,
  Mail,
  Link2,
  Rss,
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
} from "lucide-react";
import "../theme.css";
import { useSubmitContactSectionLeadMutation } from "./supplyproductsapislice";
import contact from "../assets/contact.png";

const root = getComputedStyle(document.documentElement);
const PRIMARY = root.getPropertyValue("--primary").trim();
const PRIMARY_HOVER = root.getPropertyValue("--primary-hover").trim();
const GOLD = root.getPropertyValue("--gold").trim();
const BG = root.getPropertyValue("--background").trim();
const HEADING = root.getPropertyValue("--heading").trim();
const TEXT = root.getPropertyValue("--text").trim();
const MUTED = root.getPropertyValue("--muted").trim();
const BORDER = root.getPropertyValue("--border").trim();
const DANGER = root.getPropertyValue("--danger").trim();

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
    email: "Nightowldesignershelp@gmail.com",
    phone: "+91 89669 69035",
  },
];

const SOCIALS = [Globe, Mail, Link2, Rss];

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
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    service: "",
    details: "",
  });
  const [errors, setErrors] = useState({});

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
    <section id="contact" style={{ background: BG }}>
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
                  {SOCIALS.map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      aria-label="Social link"
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                      style={{ border: `1px solid ${BORDER}`, color: TEXT }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = GOLD;
                        e.currentTarget.style.color = GOLD;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = BORDER;
                        e.currentTarget.style.color = TEXT;
                      }}
                    >
                      <Icon size={14} />
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

            <button
              type="button"
              className="self-start px-6 py-3 rounded-lg text-[11.5px] font-semibold tracking-[0.05em] flex items-center gap-2 transition-colors"
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
          </div>

          <div className="md:col-span-8">
            <div
              className="relative w-full min-h-[320px] rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${BORDER}` }}
            >
              <iframe
                title="NOD Studio & Head Office location"
                src="https://www.google.com/maps?q=84+Drayton+Gardens,+London+SW10+9SD&output=embed"
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />

              <div
                className="absolute bottom-4 right-4 max-w-[230px] rounded-xl p-4"
                style={{
                  background: BG,
                  boxShadow: "0 12px 30px -10px rgba(28,23,18,0.3)",
                }}
              >
                <p
                  className="text-[12.5px] font-bold mb-1"
                  style={{ color: HEADING }}
                >
                  NOD Studio &amp; Head Office
                </p>
                <p
                  className="text-[12px] leading-snug mb-2"
                  style={{ color: TEXT }}
                >
                  84 Drayton Gardens, India SW10 9SD
                </p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=84+Drayton+Gardens,+London+SW10+9SD"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11.5px] font-semibold flex items-center gap-1"
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
  );
}
