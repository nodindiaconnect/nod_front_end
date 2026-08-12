// Pagination.jsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../theme.css";

const Pagination = ({ pagination, onPageChange, isFetching = false }) => {
  const { total = 0, page = 1, limit = 10, totalPages = 1 } = pagination || {};

  if (total <= 0 || totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const getPages = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (page > 3) pages.push("...");

    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }

    if (page < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        Showing {start}–{end} of {total}
      </p>

      <div className="flex items-center gap-1.5">
        {/* Prev Arrow */}
        <button
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          disabled={page <= 1 || isFetching}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: "var(--background)", color: "var(--text)" }}
          onMouseEnter={(e) => {
            if (!(page <= 1 || isFetching)) {
              e.currentTarget.style.backgroundColor = "var(--primary)";
              e.currentTarget.style.color = "var(--surface)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--background)";
            e.currentTarget.style.color = "var(--text)";
          }}
        >
          <ChevronLeft size={16} />
        </button>

        {/* Pages */}
        {getPages().map((p, i) =>
          p === "..." ? (
            <span
              key={`d${i}`}
              className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center text-xs sm:text-sm"
              style={{ color: "var(--muted)" }}
            >
              ⋯
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              disabled={isFetching}
              className={`w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer disabled:cursor-not-allowed ${
                p === page ? "scale-110 font-bold" : ""
              }`}
              style={
                p === page
                  ? { backgroundColor: "var(--primary)", color: "var(--surface)" }
                  : { color: "var(--text)" }
              }
              onMouseEnter={(e) => {
                if (p !== page && !isFetching) {
                  e.currentTarget.style.backgroundColor = "var(--background)";
                }
              }}
              onMouseLeave={(e) => {
                if (p !== page) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {p}
            </button>
          )
        )}

        {/* Next Arrow */}
        <button
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          disabled={page >= totalPages || isFetching}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: "var(--background)", color: "var(--text)" }}
          onMouseEnter={(e) => {
            if (!(page >= totalPages || isFetching)) {
              e.currentTarget.style.backgroundColor = "var(--primary)";
              e.currentTarget.style.color = "var(--surface)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--background)";
            e.currentTarget.style.color = "var(--text)";
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;