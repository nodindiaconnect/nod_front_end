import React from "react";
import { Star, ShieldCheck, MessageCircle, Clock, Wallet } from "lucide-react";

const STAT_CARDS = [
  {
    key: "quality",
    label: "Quality",
    Icon: ShieldCheck,
    color: "#16a34a",
    bg: "#eafaf0",
  },
  {
    key: "communication",
    label: "Communication",
    Icon: MessageCircle,
    color: "#2563eb",
    bg: "#eaf1ff",
  },
  {
    key: "timeliness",
    label: "Timeliness",
    Icon: Clock,
    color: "#f97316",
    bg: "#fff3e8",
  },
  {
    key: "budget",
    label: "Budget",
    Icon: Wallet,
    color: "#7c3aed",
    bg: "#f2eafe",
  },
];

const ratingWord = (value) => {
  if (value >= 4.5) return "Excellent";
  if (value >= 4) return "Great";
  if (value >= 3) return "Good";
  if (value >= 2) return "Fair";
  return "Needs Work";
};

function StarRow({ overall }) {
  const full = Math.floor(overall);
  const hasHalf = overall - full >= 0.25 && overall - full < 0.75;
  const roundedUp = overall - full >= 0.75;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const idx = i + 1;
        const isFull = idx <= full || (roundedUp && idx === full + 1);
        const isHalf = !isFull && hasHalf && idx === full + 1;
        return (
          <div key={i} className="relative">
            <Star size={22} className="text-[color:var(--border)]" fill="none" strokeWidth={1.5} style={{ color: "#e5e0d8" }} />
            {(isFull || isHalf) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: isHalf ? "50%" : "100%" }}
              >
                <Star size={22} className="text-[#f59e0b]" fill="#f59e0b" strokeWidth={1.5} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DistributionBar({ star, count, maxCount }) {
  const pct = maxCount > 0 ? Math.max((count / maxCount) * 100, count > 0 ? 4 : 0) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 w-7 flex-shrink-0 text-sm font-medium text-heading">
        <span>{star}</span>
        <Star size={13} className="text-[#f59e0b]" fill="#f59e0b" />
      </div>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#eeebe4" }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: "#f59e0b" }}
        />
      </div>
      <span className="w-6 text-right text-sm text-muted flex-shrink-0">{count}</span>
    </div>
  );
}

export default function ReviewsBreakdown({ summary = {}, activeFilter, onSelectFilter }) {
  const overall = Number(summary.averageRating || summary.overallRating || 0);
  const totalReviews = summary.totalReviews || 0;
  const distribution = summary.distribution || summary.ratingDistribution || {};
  const maxCount = Math.max(1, ...[5, 4, 3, 2, 1].map((s) => Number(distribution[s] || 0)));

  const categories = {
    quality: summary.qualityRating ?? summary.quality ?? null,
    communication: summary.communicationRating ?? summary.communication ?? null,
    timeliness: summary.timelinessRating ?? summary.timeliness ?? null,
    budget: summary.budgetRating ?? summary.budget ?? null,
  };

  return (
    <div
      className="bg-white rounded-2xl border border-border p-5 sm:p-6"
      style={{ boxShadow: "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.03)" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1px_1fr_1px_auto] gap-6 items-center">
        {/* Overall score */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div
            className="text-5xl font-bold text-heading leading-none"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {overall.toFixed(1)}
          </div>
          <div className="mt-2">
            <StarRow overall={overall} />
          </div>
          <p className="text-sm text-muted mt-2">Based on {totalReviews} verified reviews</p>
          <span
            className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: "#eafaf0", color: "#16a34a" }}
          >
            <ShieldCheck size={12} /> Verified
          </span>
        </div>

        <div className="hidden lg:block w-px h-full bg-border" />

        {/* Distribution bars */}
        <div className="space-y-2.5 w-full">
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onSelectFilter?.(activeFilter === star ? null : star)}
              className={`w-full rounded-lg transition-colors ${
                activeFilter === star ? "bg-[var(--gold)]/10" : "hover:bg-black/[0.02]"
              }`}
            >
              <DistributionBar
                star={star}
                count={Number(distribution[star] || 0)}
                maxCount={maxCount}
              />
            </button>
          ))}
        </div>

        <div className="hidden lg:block w-px h-full bg-border" />

        {/* Category stat cards */}
        <div className="grid grid-cols-2 gap-3 w-full lg:w-auto">
          {STAT_CARDS.map(({ key, label, Icon, color, bg }) => {
            const value = categories[key];
            return (
              <div
                key={key}
                className="rounded-xl border border-border p-3.5 min-w-[150px]"
                style={{ backgroundColor: "var(--background-secondary)" }}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: bg }}
                  >
                    <Icon size={12} style={{ color }} />
                  </div>
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted">
                    {label}
                  </span>
                </div>
                {value ? (
                  <>
                    <div className="text-lg font-bold" style={{ color, fontFamily: "var(--font-heading)" }}>
                      {Number(value).toFixed(1)}/5
                    </div>
                    <div className="text-xs text-muted mt-0.5">{ratingWord(Number(value))}</div>
                  </>
                ) : (
                  <>
                    <div className="text-lg font-bold text-muted" style={{ fontFamily: "var(--font-heading)" }}>
                      —
                    </div>
                    <div className="text-xs text-muted mt-0.5">No data</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}