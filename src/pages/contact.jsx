
import { useState, useRef, useEffect } from "react";
import { ArrowUpRight, Loader2, CheckCircle2 } from "lucide-react";
import "../theme.css";
import { useSubmitContactLeadMutation } from "./supplyproductsapislice";

const root = getComputedStyle(document.documentElement);
const INK = root.getPropertyValue("--heading").trim();
const INK_SOFT = root.getPropertyValue("--text").trim();
const MUTED = root.getPropertyValue("--muted").trim();
const GOLD = root.getPropertyValue("--gold").trim();
const LINE = root.getPropertyValue("--border").trim();
const BG_SECONDARY = root.getPropertyValue("--background").trim();

const countryCodes = [
  { code: "+91", flag: "🇮🇳" },
  { code: "+1", flag: "🇺🇸" },
  { code: "+44", flag: "🇬🇧" },
  { code: "+971", flag: "🇦🇪" },
  { code: "+61", flag: "🇦🇺" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{7,10}$/;

// The materials a project actually gets built from — this is the moodboard
// rail a client would see on a designer's desk, not decorative icons.
const MATERIALS = [
  "WALNUT VENEER", "BRUSHED BRASS", "BOUCLÉ", "CARRARA MARBLE",
  "RAW LINEN", "TERRAZZO", "CANE WEBBING", "LIMEWASH PLASTER",
  "BLACKENED STEEL", "TRAVERTINE",
];

/* ---------- Field: bare underline, no box ---------- */
function Field({ label, name, type = "text", value, onChange, textarea, error, placeholder }) {
  const [focused, setFocused] = useState(false);
  const filled = value && value.length > 0;
  const Comp = textarea ? "textarea" : "input";

  return (
    <div className="relative">
      <div className="flex items-baseline justify-between">
        <label
          htmlFor={name}
          className="text-[11px] tracking-[0.25em] transition-colors duration-300"
          style={{ color: focused ? GOLD : MUTED }}
        >
          {label.toUpperCase()}
        </label>
        {error && (
          <span className="text-[11px]" style={{ color: "#C1443A" }}>{error}</span>
        )}
      </div>

      <Comp
        id={name}
        name={name}
        type={!textarea ? type : undefined}
        rows={textarea ? 2 : undefined}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-transparent outline-none resize-none py-2.5"
        style={{
          color: INK,
          caretColor: GOLD,
          fontFamily: "var(--font-heading)",
          fontSize: textarea ? "16px" : "18px",
          lineHeight: 1.4,
        }}
      />

      <div className="relative h-px w-full" style={{ background: error ? "#C1443A" : LINE }}>
        <div
          className="absolute inset-y-0 left-0 h-px transition-all duration-700 ease-out"
          style={{ width: focused || filled ? "100%" : "0%", background: error ? "#C1443A" : GOLD }}
        />
      </div>
    </div>
  );
}

/* ---------- Signature: hand-drafted floor plan that draws itself in ---------- */
function BlueprintDraw({ inView }) {
  return (
    <svg
      viewBox="0 0 360 420"
      className="w-full h-auto"
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      <style>{`
        .bp-line {
          stroke: ${GOLD};
          stroke-width: 1.4;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: var(--len);
          stroke-dashoffset: var(--len);
          transition: stroke-dashoffset 1.6s cubic-bezier(0.65,0,0.35,1) var(--delay);
        }
        .bp-fade {
          opacity: 0;
          transition: opacity 0.8s ease var(--delay);
        }
        .bp-in .bp-line { stroke-dashoffset: 0; }
        .bp-in .bp-fade { opacity: 1; }
        @media (prefers-reduced-motion: reduce) {
          .bp-line { transition: none; stroke-dashoffset: 0; }
          .bp-fade { transition: none; opacity: 1; }
        }
      `}</style>

      <g className={inView ? "bp-in" : ""}>
        {/* outer walls */}
        <rect x="20" y="20" width="320" height="380" className="bp-line" style={{ "--len": 1400, "--delay": "0s" }} />
        {/* internal partition — living / bedroom */}
        <path d="M20 230 H 200 M200 20 V 230" className="bp-line" style={{ "--len": 400, "--delay": "0.9s" }} />
        {/* second partition — bath */}
        <path d="M270 230 V 400" className="bp-line" style={{ "--len": 170, "--delay": "1.15s" }} />
        {/* door swings */}
        <path d="M200 230 A 40 40 0 0 1 240 270" className="bp-line" style={{ "--len": 65, "--delay": "1.4s" }} />
        <path d="M270 300 A 30 30 0 0 1 240 330" className="bp-line" style={{ "--len": 50, "--delay": "1.5s" }} />
        <path d="M60 230 A 35 35 0 0 0 95 195" className="bp-line" style={{ "--len": 55, "--delay": "1.45s" }} />

        {/* furniture: sofa */}
        <path
          d="M45 60 h100 a8 8 0 0 1 8 8 v40 a8 8 0 0 1 -8 8 h-100 a8 8 0 0 1 -8 -8 v-40 a8 8 0 0 1 8 -8 Z M45 76 h108 M45 108 v8 M153 108 v8"
          className="bp-line" style={{ "--len": 340, "--delay": "1.7s" }}
        />
        {/* furniture: bed */}
        <rect x="45" y="150" width="130" height="60" rx="6" className="bp-line" style={{ "--len": 400, "--delay": "1.85s" }} />
        <rect x="45" y="150" width="130" height="18" rx="4" className="bp-line" style={{ "--len": 300, "--delay": "1.95s" }} />
        {/* furniture: dining table + chairs */}
        <ellipse cx="240" cy="80" rx="34" ry="22" className="bp-line" style={{ "--len": 220, "--delay": "2.05s" }} />
        <circle cx="240" cy="40" r="7" className="bp-line" style={{ "--len": 44, "--delay": "2.15s" }} />
        <circle cx="240" cy="120" r="7" className="bp-line" style={{ "--len": 44, "--delay": "2.2s" }} />
        <circle cx="200" cy="80" r="7" className="bp-line" style={{ "--len": 44, "--delay": "2.25s" }} />
        <circle cx="280" cy="80" r="7" className="bp-line" style={{ "--len": 44, "--delay": "2.3s" }} />

        {/* dimension lines */}
        <path d="M20 410 H340 M20 405 v10 M340 405 v10" className="bp-line" style={{ "--len": 340, "--delay": "2.5s" }} />
        <text x="180" y="422" textAnchor="middle" className="bp-fade" style={{ "--delay": "2.9s", fill: GOLD, fontSize: 10, letterSpacing: "0.15em", fontFamily: "var(--font-body)" }}>
          6.4M
        </text>

        {/* room labels */}
        <text x="110" y="140" className="bp-fade" style={{ "--delay": "2.6s", fill: MUTED, fontSize: 9, letterSpacing: "0.2em", fontFamily: "var(--font-body)" }}>LIVING</text>
        <text x="90" y="330" className="bp-fade" style={{ "--delay": "2.7s", fill: MUTED, fontSize: 9, letterSpacing: "0.2em", fontFamily: "var(--font-body)" }}>BEDROOM</text>
        <text x="285" y="320" className="bp-fade" style={{ "--delay": "2.8s", fill: MUTED, fontSize: 9, letterSpacing: "0.2em", fontFamily: "var(--font-body)", writingMode: "vertical-rl" }}>BATH</text>
      </g>
    </svg>
  );
}

/* ---------- Materials rail: slow drifting swatch strip ---------- */
function MaterialsRail() {
  const loop = [...MATERIALS, ...MATERIALS];
  return (
    <div className="relative overflow-hidden" style={{ borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
      <style>{`
        @keyframes nod-rail-drift {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .nod-rail-track { animation: nod-rail-drift 34s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .nod-rail-track { animation: none; }
        }
      `}</style>
      <div className="flex w-max nod-rail-track py-3">
        {loop.map((m, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className="text-[11px] tracking-[0.3em] px-5" style={{ color: MUTED }}>{m}</span>
            <span className="w-1 h-1 rounded-full" style={{ background: GOLD }} />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", details: "" });
  const [errors, setErrors] = useState({});
  const [country, setCountry] = useState(countryCodes[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  const [submitLead, { isLoading, isSuccess, isError, error }] = useSubmitContactLeadMutation();

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.25 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim() || form.name.trim().length < 2) next.name = "Required";
    if (!EMAIL_RE.test(form.email.trim())) next.email = "Invalid email";
    if (!PHONE_RE.test(form.phone.trim())) next.phone = "Invalid number";
    if (!form.details.trim()) next.details = "Tell us something";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await submitLead({
        name: form.name.trim(),
        email: form.email.trim(),
        countryCode: country.code,
        phone: form.phone.trim(),
        company: form.company.trim(),
        details: form.details.trim(),
        source: "contact_section",
      }).unwrap();
      setForm({ name: "", email: "", phone: "", company: "", details: "" });
    } catch {
      // isError below surfaces this
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="relative" style={{ background: BG_SECONDARY }}>
      <MaterialsRail />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-16 py-16 md:py-24">
        {/* Eyebrow + headline — plain text, no box */}
        <p className="text-[11px] tracking-[0.3em] mb-4" style={{ color: GOLD }}>WRITE US</p>
        <h2
          className="font-[var(--font-heading)] leading-[0.98] max-w-3xl"
          style={{ color: INK, fontSize: "clamp(28px, 4.2vw, 46px)" }}
        >
          Great interiors begin
          <br />
          with a conversation<span style={{ color: GOLD }}>.</span>
        </h2>

        <div className="mt-14 md:mt-20 relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-start">
          {/* Divider between the two halves — desktop only */}
          <div
            className="hidden lg:block absolute top-0 bottom-0"
            style={{ left: "41.6667%", borderLeft: `1px solid ${LINE}` }}
            aria-hidden="true"
          />

          {/* Left — the blueprint, drawn in on scroll */}
          <div className="lg:col-span-5 lg:pr-12 order-2 lg:order-1">
            <div className="max-w-sm mx-auto lg:mx-0">
              <BlueprintDraw inView={inView} />
            </div>
            <p className="mt-6 text-xs tracking-[0.15em] max-w-xs" style={{ color: MUTED }}>
              EVERY BRIEF STARTS AS A LINE DRAWING — YOURS STARTS HERE.
            </p>
          </div>

          {/* Right — plain-text form, underline only */}
          <div className="lg:col-span-7 lg:pl-12 order-1 lg:order-2">
            {isSuccess ? (
              <div className="flex flex-col gap-3 py-8">
                <CheckCircle2 size={32} style={{ color: GOLD }} />
                <p className="font-[var(--font-heading)] text-2xl" style={{ color: INK }}>
                  Message sent.
                </p>
                <p className="text-sm" style={{ color: MUTED }}>
                  A Team Member from our Team will call you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-9" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-9">
                  <Field label="Name" name="name" value={form.name} onChange={handleChange("name")} error={errors.name} placeholder="Your name" />
                  <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange("email")} error={errors.email} placeholder="you@email.com" />
                </div>

                {/* Phone — plain, dropdown as text not chip */}
                <div>
                  <div className="flex items-baseline justify-between">
                    <label className="text-[11px] tracking-[0.25em]" style={{ color: phoneFocused ? GOLD : MUTED }}>
                      PHONE
                    </label>
                    {errors.phone && <span className="text-[11px]" style={{ color: "#C1443A" }}>{errors.phone}</span>}
                  </div>
                  <div className="flex items-end gap-3">
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => setCountryOpen((o) => !o)}
                        className="flex items-center gap-1 py-2.5 font-[var(--font-heading)]"
                        style={{ color: INK, fontSize: 18 }}
                      >
                        {country.flag} {country.code}
                      </button>
                      {countryOpen && (
                        <div
                          className="absolute top-full left-0 mt-1 z-10"
                          style={{ background: BG_SECONDARY, border: `1px solid ${LINE}` }}
                        >
                          {countryCodes.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => { setCountry(c); setCountryOpen(false); }}
                              className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left"
                              style={{ color: INK_SOFT }}
                            >
                              {c.flag} {c.code}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={form.phone}
                      onChange={handleChange("phone")}
                      onFocus={() => setPhoneFocused(true)}
                      onBlur={() => setPhoneFocused(false)}
                      placeholder="98765 43210"
                      className="flex-1 min-w-0 bg-transparent outline-none py-2.5 font-[var(--font-heading)]"
                      style={{ color: INK, caretColor: GOLD, fontSize: 18 }}
                    />
                  </div>
                  <div className="relative h-px w-full" style={{ background: errors.phone ? "#C1443A" : LINE }}>
                    <div
                      className="absolute inset-y-0 left-0 h-px transition-all duration-700 ease-out"
                      style={{ width: phoneFocused || form.phone ? "100%" : "0%", background: errors.phone ? "#C1443A" : GOLD }}
                    />
                  </div>
                </div>

                <Field label="Company (optional)" name="company" value={form.company} onChange={handleChange("company")} placeholder="Studio, firm or your name" />

                <Field
                  label="Tell us about the project"
                  name="details"
                  textarea
                  value={form.details}
                  onChange={handleChange("details")}
                  error={errors.details}
                  placeholder="3BHK in Gachibowli, looking to start in September…"
                />

                {isError && (
                  <p className="text-[12px]" style={{ color: "#C1443A" }}>
                    {error?.data?.message || "Couldn't send that. Try again."}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex items-center gap-3 self-start disabled:opacity-60"
                >
                  <span
                    className="font-[var(--font-heading)] transition-colors duration-300"
                    style={{ color: INK, fontSize: 18 }}
                  >
                    {isLoading ? "Sending" : "Send"}
                  </span>
                  <span
                    className="flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    style={{ borderColor: GOLD, color: GOLD }}
                  >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowUpRight size={16} />}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}