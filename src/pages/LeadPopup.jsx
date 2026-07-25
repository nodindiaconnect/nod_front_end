import { useState, useEffect, useRef } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import "../theme.css";
import { useSubmitContactLeadMutation } from "./supplyproductsapislice";

const PHONE_RE = /^[6-9]\d{9}$/;
const AUTO_DISMISS_MS = 10000;

export default function LeadPopup() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", query: "" });
  const [errors, setErrors] = useState({});
  const [submitLead, { isLoading, isSuccess, isError, error }] =
    useSubmitContactLeadMutation();

  const autoCloseTimer = useRef(null);
  const hasInteracted = useRef(false);

  const close = () => setOpen(false);

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (hasInteracted.current) return;
    autoCloseTimer.current = setTimeout(() => close(), AUTO_DISMISS_MS);
    return () => clearTimeout(autoCloseTimer.current);
  }, [open]);

  const handleChange = (key) => (e) => {
    hasInteracted.current = true;
    if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim() || form.name.trim().length < 2) next.name = "Enter your full name";
    if (!PHONE_RE.test(form.phone.trim())) next.phone = "Enter a valid 10-digit mobile number";
    if (!form.query.trim() || form.query.trim().length < 3) next.query = "Tell us what you need";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await submitLead({
        name: form.name.trim(),
        countryCode: "+91",
        phone: form.phone.trim(),
        query: form.query.trim(),
        source: "monsoon_makeover_popup",
      }).unwrap();
      setTimeout(close, 1600);
    } catch {
      // isError below surfaces this
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-popup-title"
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(10,8,6,0.6)", backdropFilter: "blur(2px)" }}
        onClick={close}
      />

      <div
        className="relative w-full max-w-[320px] xs:max-w-[360px] sm:max-w-[400px] rounded-sm overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-2.5 right-2.5 z-10 flex items-center justify-center w-7 h-7 rounded-sm transition-transform hover:scale-105"
          style={{ background: "var(--surface)", color: "var(--heading)", border: "1px solid var(--border)" }}
        >
          <X size={14} />
        </button>

        <div className="relative h-28 sm:h-32">
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80&auto=format&fit=crop"
            alt="Modular kitchen interior"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(10,8,6,0.55), rgba(10,8,6,0))" }}
          />
          <div className="absolute left-3 bottom-3">
            <span
              className="inline-block px-2 py-0.5 rounded-sm text-[10px] font-semibold tracking-wide"
              style={{ background: "var(--danger)", color: "#fff" }}
            >
              MONSOON MAKEOVER SALE
            </span>
            <p className="mt-1 text-base sm:text-lg font-semibold" style={{ color: "#F7F3EA" }}>
              Flat 20% off <span className="font-normal text-xs sm:text-sm">on modular interiors</span>
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <h2
            id="lead-popup-title"
            className="font-[var(--font-heading)] text-base sm:text-lg mb-1"
            style={{ color: "var(--heading)" }}
          >
            Talk to our  team
          </h2>
          <p className="text-[11px] sm:text-xs mb-3.5" style={{ color: "var(--muted)" }}>
            Share a few details and we'll call you back with a free quote.
          </p>

          {isSuccess ? (
            <div className="flex flex-col items-center text-center gap-2 py-5">
              <CheckCircle2 size={32} style={{ color: "var(--gold)" }} />
              <p className="text-sm" style={{ color: "var(--heading)" }}>
                Thanks! Our team will reach out shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
              <div>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange("name")}
                  className="w-full text-sm px-3 py-2 rounded-sm outline-none transition-colors"
                  style={{
                    background: "transparent",
                    color: "var(--heading)",
                    border: `1px solid ${errors.name ? "var(--danger)" : "var(--border)"}`,
                  }}
                />
                {errors.name && (
                  <p className="text-[10px] mt-1" style={{ color: "var(--danger)" }}>{errors.name}</p>
                )}
              </div>

              <div>
                <div
                  className="flex items-stretch rounded-sm overflow-hidden"
                  style={{ border: `1px solid ${errors.phone ? "var(--danger)" : "var(--border)"}` }}
                >
                  <span
                    className="flex items-center gap-1 px-2.5 text-sm shrink-0"
                    style={{ color: "var(--text)", borderRight: "1px solid var(--border)" }}
                  >
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="Mobile number"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    maxLength={10}
                    className="flex-1 min-w-0 text-sm px-2.5 py-2 outline-none bg-transparent"
                    style={{ color: "var(--heading)" }}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[10px] mt-1" style={{ color: "var(--danger)" }}>{errors.phone}</p>
                )}
              </div>

              <div>
                <textarea
                  placeholder="What is your query?"
                  value={form.query}
                  onChange={handleChange("query")}
                  rows={3}
                  className="w-full text-sm px-3 py-2 rounded-sm outline-none transition-colors resize-none"
                  style={{
                    background: "transparent",
                    color: "var(--heading)",
                    border: `1px solid ${errors.query ? "var(--danger)" : "var(--border)"}`,
                  }}
                />
                {errors.query && (
                  <p className="text-[10px] mt-1" style={{ color: "var(--danger)" }}>{errors.query}</p>
                )}
              </div>

              {isError && (
                <p className="text-[11px]" style={{ color: "var(--danger)" }}>
                  {error?.data?.message || "Something went wrong. Please try again."}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-sm text-sm font-semibold tracking-wide transition-transform disabled:opacity-70 hover:scale-[1.01]"
                style={{ background: "var(--primary)", color: "#fff" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--gold-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Submitting
                  </>
                ) : (
                  "Submit"
                )}
              </button>

              <p className="text-[10px] leading-snug text-center" style={{ color: "var(--muted)" }}>
                By continuing, I agree to the Night Owl Designers{" "}
                <a href="/terms" className="underline" style={{ color: "var(--gold)" }}>Terms of Use</a> &{" "}
                <a href="/privacy" className="underline" style={{ color: "var(--gold)" }}>Privacy Policy</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}