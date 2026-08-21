import React from "react";
import { Star, Award, MessageCircle, Clock, Wallet } from "lucide-react";

export default function ReviewsBreakdown({
  summary,
  activeFilter = null,
  onSelectFilter = () => {},
}) {
  const {
    averageRating = 0,
    totalReviews = 0,
    distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    distributionPercentages = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    categories = { quality: 0, communication: 0, timeliness: 0, budget: 0 },
  } = summary || {};

  return (
    <div className="bg-white rounded-lg border border-border p-6 shadow-xs grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
      {/* Col 1: Big Rating Score */}
      <div className="flex flex-col items-center justify-center text-center lg:border-r border-border lg:pr-6">
        <div
          className="text-5xl sm:text-6xl font-extrabold text-heading"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {averageRating > 0 ? averageRating.toFixed(1) : "—"}
        </div>

        <div className="flex items-center gap-1 my-2 text-amber-500">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={18}
              className={
                star <= Math.round(averageRating)
                  ? "fill-amber-400 text-amber-500"
                  : "text-gray-300"
              }
            />
          ))}
        </div>

        <p className="text-xs text-muted font-medium">
          Based on <span className="font-bold text-heading">{totalReviews}</span> verified reviews
        </p>
      </div>

      {/* Col 2: Star Distribution Progress Bars */}
      <div className="space-y-2 lg:border-r border-border lg:pr-6">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribution[star] || 0;
          const pct = distributionPercentages[star] || 0;
          const isSelected = String(activeFilter) === String(star);

          return (
            <button
              key={star}
              onClick={() => onSelectFilter(isSelected ? null : String(star))}
              className={`w-full flex items-center gap-2 text-xs transition p-1 rounded-sm ${
                isSelected ? "bg-[var(--gold)]/15 font-bold" : "hover:bg-[var(--background-secondary)]"
              }`}
            >
              <span className="w-12 text-right text-muted font-semibold flex items-center justify-end gap-1">
                {star} <Star size={11} className="fill-amber-400 text-amber-500" />
              </span>

              {/* Progress Track */}
              <div className="flex-1 h-2.5 bg-[var(--background-secondary)] rounded-full overflow-hidden border border-border/40">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <span className="w-9 text-left text-[11px] text-muted tabular-nums">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Col 3: Sub-category Rating Metrics */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-md bg-[var(--background-secondary)]/60 border border-border/60 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-muted mb-1">
            <Award size={14} className="text-primary" />
            <span className="font-semibold text-[11px] uppercase tracking-wider">Quality</span>
          </div>
          <div className="text-base font-bold text-heading">
            {categories.quality > 0 ? `★ ${categories.quality.toFixed(1)}` : "—"}
          </div>
        </div>

        <div className="p-3 rounded-md bg-[var(--background-secondary)]/60 border border-border/60 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-muted mb-1">
            <MessageCircle size={14} className="text-emerald-600" />
            <span className="font-semibold text-[11px] uppercase tracking-wider">Communication</span>
          </div>
          <div className="text-base font-bold text-heading">
            {categories.communication > 0 ? `★ ${categories.communication.toFixed(1)}` : "—"}
          </div>
        </div>

        <div className="p-3 rounded-md bg-[var(--background-secondary)]/60 border border-border/60 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-muted mb-1">
            <Clock size={14} className="text-amber-600" />
            <span className="font-semibold text-[11px] uppercase tracking-wider">Timeliness</span>
          </div>
          <div className="text-base font-bold text-heading">
            {categories.timeliness > 0 ? `★ ${categories.timeliness.toFixed(1)}` : "—"}
          </div>
        </div>

        <div className="p-3 rounded-md bg-[var(--background-secondary)]/60 border border-border/60 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-muted mb-1">
            <Wallet size={14} className="text-purple-600" />
            <span className="font-semibold text-[11px] uppercase tracking-wider">Budget</span>
          </div>
          <div className="text-base font-bold text-heading">
            {categories.budget > 0 ? `★ ${categories.budget.toFixed(1)}` : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
