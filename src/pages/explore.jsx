import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Loader2, MapPin, ArrowUpRight } from "lucide-react";
import "../theme.css";
import { useGetAllPortfoliosByRoleQuery } from "./supplyproductsapislice";

const ROLE_SLUG_TO_NUM = {
  designer: 2,
  architect: 3,
  contractor: 4,
};

const ROLE_LABELS = {
  2: "Designers",
  3: "Architects",
  4: "Contractors",
};

const ROLE_TABS = [
  { slug: "designer", label: "Designers", swatch: "#B08D57" },
  { slug: "architect", label: "Architects", swatch: "#6B5B4E" },
  { slug: "contractor", label: "Contractors", swatch: "#00466a" },
];

function StatRow({ posts, followers, following }) {
  return (
    <div className="flex items-center gap-2.5 pt-3.5 mt-3.5" style={{ borderTop: "1px solid var(--border)" }}>
      <span className="text-[10px] font-bold tracking-[0.12em]" style={{ color: "var(--heading)" }}>{posts}</span>
      <span className="text-[9px] tracking-[0.1em] uppercase" style={{ color: "var(--muted)" }}>Works</span>
      <span style={{ width: 1, height: 10, background: "var(--border)" }} />
      <span className="text-[10px] font-bold tracking-[0.12em]" style={{ color: "var(--heading)" }}>{followers}</span>
      <span className="text-[9px] tracking-[0.1em] uppercase" style={{ color: "var(--muted)" }}>Followers</span>
      <span style={{ width: 1, height: 10, background: "var(--border)" }} />
      <span className="text-[10px] font-bold tracking-[0.12em]" style={{ color: "var(--heading)" }}>{following}</span>
      <span className="text-[9px] tracking-[0.1em] uppercase" style={{ color: "var(--muted)" }}>Following</span>
    </div>
  );
}

function ProfessionalCard({ user, accent }) {
  const [hovered, setHovered] = useState(false);
  const initials = user.name?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const location = [user.city, user.state].filter(Boolean).join(", ");
  const coverImage = user.posts?.[0]?.images?.[0];

  return (
    <div
      className="group relative rounded-sm overflow-hidden transition-all duration-500 ease-out"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: hovered
          ? "0 24px 48px -12px rgba(20,16,12,0.28), 0 8px 16px -4px rgba(20,16,12,0.12)"
          : "0 2px 8px rgba(20,16,12,0.06)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cover */}
      <div className="relative h-52 overflow-hidden" style={{ background: "#ECE7DE" }}>
        {coverImage ? (
          <img
            src={coverImage}
            alt=""
            className="w-full h-full object-cover transition-transform duration-700 ease-out"
            style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "repeating-linear-gradient(135deg, #ECE7DE, #ECE7DE 10px, #E4DED2 10px, #E4DED2 11px)" }}
          >
            <span className="text-[10px] tracking-[0.18em] uppercase" style={{ color: "var(--muted)" }}>No works yet</span>
          </div>
        )}

        {/* gradient wash for legibility + mood */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: "linear-gradient(180deg, rgba(10,8,6,0) 45%, rgba(10,8,6,0.55) 100%)",
            opacity: hovered ? 1 : 0.7,
          }}
        />

        <div className="absolute left-0 top-0 h-full" style={{ width: 4, background: accent }} />

        {/* Corner arrow — the "signature" micro-interaction */}
        <div
          className="absolute top-3.5 right-3.5 flex items-center justify-center rounded-sm transition-all duration-400"
          style={{
            width: 30,
            height: 30,
            background: hovered ? accent : "rgba(255,255,255,0.9)",
            transform: hovered ? "rotate(45deg) scale(1.05)" : "rotate(0deg) scale(1)",
          }}
        >
          <ArrowUpRight size={15} color={hovered ? "#fff" : "var(--heading)"} strokeWidth={2.25} />
        </div>

        {/* Name overlaid on image, bottom */}
        <div className="absolute left-4 right-4 bottom-3.5 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h2
              className="text-[19px] leading-tight truncate"
              style={{ color: "#F7F3EA", fontFamily: "var(--font-heading)" }}
            >
              {user.name}
            </h2>
            {user.username && (
              <p className="text-[11px] mt-0.5" style={{ color: "rgba(247,243,234,0.75)" }}>
                @{user.username}
              </p>
            )}
          </div>
          <div
            className="flex items-center justify-center rounded-sm flex-shrink-0"
            style={{ width: 34, height: 34, background: accent, color: "#fff", fontSize: 12, fontWeight: 700 }}
          >
            {initials || "—"}
          </div>
        </div>
      </div>

      <div className="p-4">
        {location && (
          <div className="flex items-center gap-1">
            <MapPin size={11} style={{ color: "var(--muted)" }} />
            <span className="text-[11px]" style={{ color: "var(--text)" }}>{location}</span>
          </div>
        )}

        <StatRow
          posts={user._count?.posts ?? 0}
          followers={user._count?.followers ?? 0}
          following={user._count?.following ?? 0}
        />

        {user.posts?.length > 1 && (
          <div className="grid grid-cols-3 gap-1.5 mt-3.5">
            {user.posts.slice(1, 4).map((p) => (
              <div key={p.id} className="aspect-square rounded-sm overflow-hidden" style={{ background: "#ECE7DE" }}>
                {p.images?.[0] && <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-sm overflow-hidden animate-pulse" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="h-52" style={{ background: "#ECE7DE" }} />
      <div className="p-4 space-y-2.5">
        <div className="h-2.5 rounded-sm w-1/2" style={{ background: "#ECE7DE" }} />
        <div className="h-2.5 rounded-sm w-1/3 mt-4" style={{ background: "#ECE7DE" }} />
      </div>
    </div>
  );
}

export default function PortfoliosByRolePage() {
  const [searchParams] = useSearchParams();
  const roleSlug = searchParams.get("role");
  const role = ROLE_SLUG_TO_NUM[roleSlug];
  const [page, setPage] = useState(1);

  const activeTab = ROLE_TABS.find((t) => t.slug === roleSlug);

  const { data, isLoading, isFetching, isError, error } = useGetAllPortfoliosByRoleQuery(
    { role, page, limit: 20 },
    { skip: !role }
  );

  const users = data?.data?.users || [];
  const pagination = data?.data?.pagination;
  const label = ROLE_LABELS[role] || "Professionals";

  return (
    <div style={{ background: "#F3F0EA", minHeight: "100vh" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <p className="text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--muted)" }}>
            NOD Directory
          </p>
          <h1
            className="text-[32px] sm:text-[44px] leading-[1.02]"
            style={{ color: "var(--heading)", fontFamily: "var(--font-heading)" }}
          >
            {roleSlug ? label : "Find your professional"}
          </h1>
        </div>

        {/* Swatch tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-8 sm:mb-10">
          {ROLE_TABS.map((tab) => {
            const active = roleSlug === tab.slug;
            return (
              <Link
                key={tab.slug}
                to={`/explore?role=${tab.slug}`}
                className="flex items-center gap-2 pl-2.5 pr-4 py-2.5 rounded-sm text-[12px] sm:text-[13px] font-medium transition-all duration-300"
                style={{
                  border: `1px solid ${active ? "var(--heading)" : "var(--border)"}`,
                  color: active ? "var(--heading)" : "var(--text)",
                  background: active ? "var(--surface)" : "transparent",
                  boxShadow: active ? "0 4px 12px rgba(20,16,12,0.10)" : "none",
                }}
              >
                <span
                  className="rounded-sm flex-shrink-0"
                  style={{
                    width: 13,
                    height: 13,
                    background: tab.swatch,
                    boxShadow: active ? `0 0 0 3px ${tab.swatch}26` : "none",
                  }}
                />
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* States */}
        {!roleSlug && (
          <p className="text-sm py-10" style={{ color: "var(--muted)" }}>
            Choose a category above to browse verified professionals.
          </p>
        )}

        {roleSlug && !role && (
          <p className="text-sm py-10" style={{ color: "var(--danger)" }}>
            Unknown category "{roleSlug}". Choose one above.
          </p>
        )}

        {role && isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        )}

        {role && isError && (
          <p className="text-sm py-10" style={{ color: "var(--danger)" }}>
            {error?.data?.message || "Couldn't load professionals. Try again."}
          </p>
        )}

        {role && !isLoading && !isError && users.length === 0 && (
          <div className="text-center py-16 rounded-sm" style={{ border: "1px dashed var(--border)" }}>
            <p className="text-sm" style={{ color: "var(--muted)" }}>No {label.toLowerCase()} listed yet.</p>
          </div>
        )}

        {role && !isLoading && !isError && users.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((u) => (
                <ProfessionalCard key={u.id} user={u} accent={activeTab?.swatch || "var(--primary)"} />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-14">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || isFetching}
                  className="px-4 py-2 text-[12px] tracking-[0.05em] rounded-sm disabled:opacity-35 transition-colors"
                  style={{ border: "1px solid var(--border)", color: "var(--heading)", background: "var(--surface)" }}
                >
                  Prev
                </button>
                <span className="text-[11px] tracking-[0.08em] uppercase" style={{ color: "var(--muted)" }}>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page >= pagination.totalPages || isFetching}
                  className="px-4 py-2 text-[12px] tracking-[0.05em] rounded-sm disabled:opacity-35 transition-colors"
                  style={{ border: "1px solid var(--border)", color: "var(--heading)", background: "var(--surface)" }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}