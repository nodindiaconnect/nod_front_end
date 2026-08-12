import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import "../theme.css";
import { useSubmitContactSectionLeadMutation } from "./supplyproductsapislice";

const root = getComputedStyle(document.documentElement);
const PRIMARY = root.getPropertyValue("--primary").trim();
const GOLD = root.getPropertyValue("--gold").trim();
const BG = root.getPropertyValue("--background").trim();
const HEADING = root.getPropertyValue("--heading").trim();
const TEXT = root.getPropertyValue("--text").trim();
const MUTED = root.getPropertyValue("--muted").trim();
const BORDER = root.getPropertyValue("--border").trim();
const DANGER = root.getPropertyValue("--danger").trim();

const SERVICES = [
  "INTERIOR DESIGN",
  "INTERIOR ARCHITECTURE",
  "CONSTRUCTION",
  "THE LIVING SYSTEM",
  "PROJECT MANAGEMENT",
  "PORTFOLIO",
];

function Field({ label, name, type = "text", value, onChange, optional, error }) {
  return (
    <div>
      <label htmlFor={name} className="text-[11px]" style={{ color: TEXT }}>
        {label}
        {optional && <span style={{ color: MUTED }}> (optional)</span>}
      </label>
      {error && <span className="text-[10px] ml-2" style={{ color: DANGER }}>{error}</span>}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent outline-none pt-1.5 pb-1.5"
        style={{ color: HEADING, fontSize: 13, borderBottom: `1px solid ${error ? DANGER : BORDER}` }}
      />
    </div>
  );
}

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", service: "", details: "" });
  const [errors, setErrors] = useState({});

  const [submitLead, { isLoading, isSuccess, isError, error }] = useSubmitContactSectionLeadMutation();

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
      setForm({ name: "", email: "", company: "", phone: "", service: "", details: "" });
    } catch (err) {
      if (err?.data?.errors) setErrors(err.data.errors);
    }
  };

  return (
    <section id="contact" className="relative" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-8 py-10">
        {/* Header row */}
        <div className="flex items-start justify-between mb-14">
          <div className="flex items-stretch gap-5">
            <div style={{ borderLeft: `2px solid ${HEADING}` }} />
            <h1
              className="leading-[0.85]"
              style={{ color: HEADING, fontFamily: "var(--font-heading)", fontSize: "clamp(48px, 7vw, 88px)" }}
            >
              Contact Us
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Left — office info */}
          <div className="md:col-span-3 flex flex-col gap-7">
            <div>
              <h3 className="text-[12px] font-bold mb-1" style={{ color: HEADING }}>
                NOD Studio &amp; Head Office
              </h3>
              <p className="text-[12px]" style={{ color: TEXT }}>Interiors With Art Ltd</p>
              <p className="text-[12px]" style={{ color: TEXT }}>84 Drayton Gardens</p>
              <p className="text-[12px]" style={{ color: TEXT }}>India SW10 9SD</p>
            </div>

            <div>
              <h3 className="text-[12px] font-bold mb-1" style={{ color: HEADING }}>
                India Office
              </h3>
              <p className="text-[12px]" style={{ color: TEXT }}>Interiors With Art India</p>
              <p className="text-[12px]" style={{ color: TEXT }}>Prestige Tech Park</p>
              <p className="text-[12px]" style={{ color: TEXT }}>Marathahalli, Bengaluru 560103</p>
            </div>


            <div>
              <h3 className="text-[12px] font-bold mb-  1" style={{ color: HEADING }}>
                Direct
              </h3>
              <p className="text-[12px]" style={{ color: PRIMARY }}>
                client@interiorswithart.com
              </p>
              <p className="text-[12px]" style={{ color: TEXT }}>020 7602 7999</p>
            </div>
          </div>

          {/* Right — form */}
          <div className="md:col-span-9">
            {isSuccess ? (
              <div className="flex flex-col gap-2 py-6">
                <CheckCircle2 size={26} style={{ color: GOLD }} />
                <p className="text-lg" style={{ color: HEADING, fontFamily: "var(--font-heading)" }}>Message sent.</p>
                <p className="text-[12px]" style={{ color: MUTED }}>Someone from our team will be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-14 gap-y-7">
                  <Field label="Your name" name="name" value={form.name} onChange={handleChange("name")} error={errors.name} />
                  <Field label="Email address" name="email" type="email" value={form.email} onChange={handleChange("email")} error={errors.email} />
                  <Field label="Company" name="company" value={form.company} onChange={handleChange("company")} optional />
                  <Field label="Contact number" name="phone" type="tel" value={form.phone} onChange={handleChange("phone")} error={errors.phone} optional />
                </div>

                <div>
                  <p className="text-[11px] mb-3" style={{ color: TEXT }}>What can we help with?</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-lg">
                    {SERVICES.map((s) => {
                      const active = form.service === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, service: s }))}
                          className="text-[10px] tracking-[0.05em] px-3 py-2.5 text-center transition-colors"
                          style={{
                            border: `1px solid ${active ? PRIMARY : BORDER}`,
                            color: active ? BG : PRIMARY,
                            background: active ? PRIMARY : "transparent",
                          }}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label htmlFor="details" className="text-[11px]" style={{ color: TEXT }}>
                    Tell us about your project <span style={{ color: MUTED }}>(optional)</span>
                  </label>
                  <textarea
                    id="details"
                    name="details"
                    rows={3}
                    value={form.details}
                    onChange={handleChange("details")}
                    className="w-full bg-transparent outline-none resize-none pt-1.5 pb-1.5"
                    style={{ color: HEADING, fontSize: 13, borderBottom: `1px solid ${BORDER}` }}
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
                  className="self-start px-8 py-3 text-[11px] tracking-[0.1em] flex items-center gap-2 disabled:opacity-60 transition-colors"
                  style={{ background: PRIMARY, color: BG }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = root.getPropertyValue("--primary-hover").trim())}
                  onMouseLeave={(e) => (e.currentTarget.style.background = PRIMARY)}
                >
                  {isLoading && <Loader2 size={14} className="animate-spin" />}
                  {isLoading ? "SENDING" : "SEND"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}