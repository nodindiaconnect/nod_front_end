import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";

/**
 * Toast notification system for React.
 *
 * Usage:
 *   1. Wrap your app once:
 *        <ToastProvider>
 *          <App />
 *        </ToastProvider>
 *
 *   2. Call it from anywhere inside the tree:
 *        const toast = useToast();
 *        toast.success("Saved changes");
 *        toast.error("Something went wrong");
 *        toast.info("Heads up, this is new");
 *
 *   3. Or feed it a result object directly (e.g. from an API call):
 *        toast.result({ success: true, message: "Profile updated" });
 *        toast.result({ success: false, message: "Could not save profile" });
 */

// ---------- Config ----------
const DEFAULT_DURATION = 4000; // ms before a toast auto-dismisses
const EXIT_DURATION = 250; // ms for the exit animation, keep in sync with CSS below

const VARIANTS = {
  success: {
    bg: "#2e7d47",
    icon: CheckCircle2,
  },
  error: {
    bg: "#c0392b",
    icon: XCircle,
  },
  info: {
    bg: "#2f6fed",
    icon: Info,
  },
  warning: {
    bg: "#b8860b",
    icon: AlertTriangle,
  },
};

// ---------- Context ----------
const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx;
}

export function ToastProvider({ children, duration = DEFAULT_DURATION }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    // mark as leaving first so the exit animation can play, then remove
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, EXIT_DURATION);
  }, []);

  const show = useCallback(
    (message, variant = "info", opts = {}) => {
      const id = ++idRef.current;
      const toastDuration = opts.duration ?? duration;
      setToasts((prev) => [
        ...prev,
        { id, message, variant, duration: toastDuration, leaving: false },
      ]);
      return id;
    },
    [duration]
  );

  // Convenience helpers
  const success = useCallback((msg, opts) => show(msg, "success", opts), [show]);
  const error = useCallback((msg, opts) => show(msg, "error", opts), [show]);
  const info = useCallback((msg, opts) => show(msg, "info", opts), [show]);
  const warning = useCallback((msg, opts) => show(msg, "warning", opts), [show]);

  // Handle a generic "result" object, e.g. the response of an API call:
  // { success: boolean, message?: string }
  const result = useCallback(
    (res, opts) => {
      const ok = !!res?.success;
      const fallback = ok ? "Done" : "Something went wrong";
      const message = res?.message || fallback;
      return show(message, ok ? "success" : "error", opts);
    },
    [show]
  );

  const dismiss = useCallback((id) => remove(id), [remove]);

  return (
    <ToastContext.Provider
      value={{ show, success, error, info, warning, result, dismiss }}
    >
      {children}
      <ToastViewport toasts={toasts} onDismiss={remove} />
    </ToastContext.Provider>
  );
}

// ---------- Rendering ----------
function ToastViewport({ toasts, onDismiss }) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <div style={styles.viewport} aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
      <style>{keyframes}</style>
    </div>,
    document.body
  );
}

function ToastItem({ toast, onDismiss }) {
  const { id, message, variant, duration, leaving } = toast;
  const config = VARIANTS[variant] || VARIANTS.info;
  const Icon = config.icon;
  const timerRef = useRef(null);

  useEffect(() => {
    if (duration > 0) {
      timerRef.current = setTimeout(() => onDismiss(id), duration);
    }
    return () => clearTimeout(timerRef.current);
  }, [id, duration, onDismiss]);

  return (
    <div
      role="status"
      style={{
        ...styles.toast,
        background: config.bg,
        animation: leaving
          ? `toast-out ${EXIT_DURATION}ms ease forwards`
          : "toast-in 220ms ease",
      }}
    >
      <Icon size={18} style={{ flexShrink: 0 }} />
      <span style={styles.message}>{message}</span>
      <button
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        style={styles.closeBtn}
      >
        <X size={16} />
      </button>
      {duration > 0 && (
        <div
          style={{
            ...styles.progress,
            animation: `toast-progress ${duration}ms linear forwards`,
          }}
        />
      )}
    </div>
  );
}

// ---------- Styles ----------
const styles = {
  viewport: {
    position: "fixed",
    top: 16,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    zIndex: 999999,
    pointerEvents: "none",
  },
  toast: {
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 16px",
    borderRadius: 999,
    color: "#fff",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,
    fontWeight: 500,
    boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
    minWidth: 260,
    maxWidth: 420,
    pointerEvents: "auto",
  },
  message: {
    flex: 1,
    lineHeight: 1.3,
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "rgba(255,255,255,0.9)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
    borderRadius: 6,
    flexShrink: 0,
  },
  progress: {
    position: "absolute",
    left: 0,
    bottom: 0,
    height: 3,
    width: "100%",
    background: "rgba(255,255,255,0.5)",
    transformOrigin: "left",
  },
};

const keyframes = `
@keyframes toast-in {
  from { opacity: 0; transform: translateY(-12px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes toast-out {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to   { opacity: 0; transform: translateY(-12px) scale(0.96); }
}
@keyframes toast-progress {
  from { transform: scaleX(1); }
  to   { transform: scaleX(0); }
}
`;

// ---------- Demo ----------
export default function ToastDemo() {
  return (
    <ToastProvider duration={4000}>
      <DemoButtons />
    </ToastProvider>
  );
}

function DemoButtons() {
  const toast = useToast();

  const fakeApiCall = (shouldSucceed) => {
    // simulate an async request and feed the response straight into toast.result
    setTimeout(() => {
      toast.result(
        shouldSucceed
          ? { success: true, message: "Profile updated" }
          : { success: false, message: "Could not update profile" }
      );
    }, 400);
  };

  return (
    <div style={{ padding: 40, display: "flex", gap: 12, flexWrap: "wrap" }}>
      <button onClick={() => toast.success("Saved changes")}>Success</button>
      <button onClick={() => toast.error("Something went wrong")}>Error</button>
      <button onClick={() => toast.info("Heads up, this is new")}>Info</button>
      <button onClick={() => toast.warning("Check your input")}>Warning</button>
      <button onClick={() => fakeApiCall(true)}>Simulate API success</button>
      <button onClick={() => fakeApiCall(false)}>Simulate API failure</button>
    </div>
  );
}