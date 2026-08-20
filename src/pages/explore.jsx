import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  ChevronDown,
  MapPin,
  Search,
  Sparkles,
  Heart,
  Star,
  Users,
  Compass,
  HardHat,
  ShieldCheck,
  Award,
  Palette,
  ThumbsUp,
  LayoutGrid,
} from "lucide-react";
import "../theme.css";
import { useGetAllPortfoliosByRoleQuery } from "./supplyproductsapislice";

const ROLE_SLUG_TO_NUM = {
  designer: 2,
  architect: 3,
  contractor: 4,
};

const ROLE_LABELS = {
  2: "Interior Designers",
  3: "Architects",
  4: "Contractors",
};

const ROLE_TABS = [
  { slug: "all", label: "All", icon: LayoutGrid },
  { slug: "designer", label: "Designers", icon: Palette },
  { slug: "architect", label: "Architects", icon: Compass },
  { slug: "contractor", label: "Contractors", icon: HardHat },
];

const BENEFITS = [
  { icon: Users, title: "Top Professionals", desc: "Verified & experienced pros" },
  { icon: Award, title: "Quality Projects", desc: "High-quality work showcased" },
  { icon: Palette, title: "Diverse Styles", desc: "Explore a variety of design styles" },
  { icon: ThumbsUp, title: "Trusted by Clients", desc: "Loved by homeowners worldwide" },
];

function safeParseProfile(profile) {
  if (!profile) return {};
  if (typeof profile === "object") return profile;
  try {
    return JSON.parse(profile) || {};
  } catch {
    return {};
  }
}

function normalisePortfolio(user) {
  return {
    ...user,
    profile: safeParseProfile(user?.profile),
    posts: user?.posts || [],
    _count: user?._count || {},
  };
}

/* ---------------------------------------------------------------------- */
/* Portfolio card — matches the featured-designer card in the reference    */
/* ---------------------------------------------------------------------- */

function PortfolioCard({ user, onOpen, showRoleTag }) {
  const [imgFailed, setImgFailed] = useState(false);
  const [saved, setSaved] = useState(false);
  const cover = user.posts?.[0]?.images?.[0] || user.profile?.photos?.[0];
  const initial = user.name?.trim()?.[0]?.toUpperCase() || "?";
  const roleTag = ROLE_LABELS[user.role];

  const rating = user.rating ?? user.profile?.rating;
  const reviewCount = user._count?.posts ?? user.profile?.projectCount;
  const isVerified = user.verified !== false;

  return (
    <div className="group relative flex flex-col rounded-2xl border border-[#ece5d8] bg-white p-3 shadow-[0_1px_2px_rgba(28,23,18,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_-12px_rgba(28,23,18,0.18)] hover:border-[#e0d3b8]">
      <button
        type="button"
        onClick={onOpen}
        className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8823a] focus-visible:ring-offset-2 rounded-xl"
      >
        <div className="relative w-full aspect-[4/3.2] rounded-xl overflow-hidden bg-[#f7f2ea]">
          {cover && !imgFailed ? (
            <img
              src={cover}
              alt={`${user.name}'s work`}
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f1e9dc] via-[#f7f2ea] to-[#f1e9dc] overflow-hidden">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_20%,rgba(184,130,58,0.15),transparent_55%)]" />
              <span className="font-serif text-5xl text-[#b8823a]/70">{initial}</span>
              <span className="absolute bottom-3 right-3.5 text-[11px] font-medium text-[#b8823a]/60 tracking-wide">
                No photos yet
              </span>
            </div>
          )}

          {isVerified && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-white/95 backdrop-blur text-[#1c1712] text-[11px] font-semibold px-2.5 py-1.5 rounded-full shadow-sm">
              <ShieldCheck size={12} className="text-[#b8823a]" />
              Verified
            </span>
          )}
        </div>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setSaved((s) => !s);
        }}
        aria-label={saved ? "Remove from favorites" : "Save to favorites"}
        className="absolute top-6 right-6 flex items-center justify-center w-8 h-8 rounded-full bg-white/95 backdrop-blur shadow-sm transition-transform hover:scale-105"
      >
        <Heart
          size={15}
          className={saved ? "fill-[#b8823a] text-[#b8823a]" : "text-[#8a8479]"}
        />
      </button>

      <button type="button" onClick={onOpen} className="text-left pt-3 px-1 pb-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[15px] font-semibold text-[#1c1712] truncate">{user.name}</h3>
          <ArrowUpRight
            size={16}
            className="text-[#8a8479] flex-shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#b8823a]"
          />
        </div>

        {rating != null && (
          <p className="flex items-center gap-1.5 mt-1 text-[13px] text-[#1c1712]">
            <Star size={13} className="fill-[#b8823a] text-[#b8823a]" />
            <span className="font-semibold">{Number(rating).toFixed(1)}</span>
            {reviewCount != null && (
              <span className="text-[#8a8479]">({reviewCount} projects)</span>
            )}
          </p>
        )}

        <div className="flex items-center gap-2 mt-1">
          {user.city && (
            <p className="flex items-center gap-1.5 text-[13px] text-[#8a8479]">
              <MapPin size={13} /> {user.city}
            </p>
          )}
          {showRoleTag && roleTag && (
            <span className="text-[10.5px] font-medium uppercase tracking-wide text-[#b8823a] bg-[#f7f2ea] px-2 py-0.5 rounded-full">
              {roleTag}
            </span>
          )}
        </div>
      </button>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-[#ece5d8] bg-white p-3" aria-hidden="true">
      <div className="w-full aspect-[4/3.2] rounded-xl bg-gradient-to-r from-[#f7f2ea] via-[#f1e9dc] to-[#f7f2ea] bg-[length:200%_100%] animate-pulse" />
      <div className="pt-3 px-1 space-y-2">
        <div className="h-3 w-2/3 rounded bg-[#f7f2ea]" />
        <div className="h-3 w-1/3 rounded bg-[#f7f2ea]" />
      </div>
    </div>
  );
}

export default function PortfoliosByRolePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleSlug = searchParams.get("role");
  const isAll = !roleSlug || roleSlug === "all";
  const role = ROLE_SLUG_TO_NUM[roleSlug];

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [accumulated, setAccumulated] = useState([]);

  // Single-role browsing (Designers / Architects / Contractors tab).
  const singleQuery = useGetAllPortfoliosByRoleQuery(
    { role, page, limit: 20 },
    { skip: isAll || !role }
  );

  // "All" view: pull a page from every role so the grid is populated on load.
  const allDesignersQuery = useGetAllPortfoliosByRoleQuery({ role: 2, page: 1, limit: 12 }, { skip: !isAll });
  const allArchitectsQuery = useGetAllPortfoliosByRoleQuery({ role: 3, page: 1, limit: 12 }, { skip: !isAll });
  const allContractorsQuery = useGetAllPortfoliosByRoleQuery({ role: 4, page: 1, limit: 12 }, { skip: !isAll });

  const pagination = singleQuery.data?.data?.pagination;
  const label = isAll ? "Portfolios" : ROLE_LABELS[role] || "Professionals";

  const isLoading = isAll
    ? allDesignersQuery.isLoading || allArchitectsQuery.isLoading || allContractorsQuery.isLoading
    : singleQuery.isLoading;
  const isFetching = isAll
    ? allDesignersQuery.isFetching || allArchitectsQuery.isFetching || allContractorsQuery.isFetching
    : singleQuery.isFetching;
  const isError = isAll
    ? allDesignersQuery.isError || allArchitectsQuery.isError || allContractorsQuery.isError
    : singleQuery.isError;
  const error = isAll
    ? allDesignersQuery.error || allArchitectsQuery.error || allContractorsQuery.error
    : singleQuery.error;

  const users = useMemo(() => {
    if (isAll) {
      const merged = [
        ...(allDesignersQuery.data?.data?.users || []),
        ...(allArchitectsQuery.data?.data?.users || []),
        ...(allContractorsQuery.data?.data?.users || []),
      ];
      return merged.map(normalisePortfolio);
    }
    return (singleQuery.data?.data?.users || []).map(normalisePortfolio);
  }, [
    isAll,
    allDesignersQuery.data,
    allArchitectsQuery.data,
    allContractorsQuery.data,
    singleQuery.data,
  ]);

  // Reset accumulated list whenever the view changes; append on "Load more".
  useEffect(() => {
    setPage(1);
    setAccumulated([]);
  }, [roleSlug]);

  useEffect(() => {
    if (!users.length) return;
    setAccumulated((prev) => {
      if (isAll || page === 1) return users;
      const existingIds = new Set(prev.map((u) => u.id));
      const newOnes = users.filter((u) => !existingIds.has(u.id));
      return [...prev, ...newOnes];
    });
  }, [users, page, isAll]);

  const filtered = useMemo(() => {
    let list = accumulated;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((u) =>
        `${u.name} ${ROLE_LABELS[u.role] || ""} ${u.city || ""}`.toLowerCase().includes(q)
      );
    }
    if (sortBy === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return list;
  }, [accumulated, search, sortBy]);

  const canLoadMore = !isAll && pagination && pagination.currentPage < pagination.totalPages;

  return (
    <main className="min-h-screen bg-white text-[#1c1712] font-sans">
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-20">
        {/* Header */}
        <div className="mb-7">
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#b8823a] mb-2">
            Nod Directory
          </p>
          <h1 className="font-serif font-bold text-[26px] sm:text-[32px] lg:text-[36px] leading-[1.15] mb-2 text-[#1c1712]">
            {isAll ? "Find your professional" : `Explore Top ${label}`}
          </h1>
          <p className="text-sm text-[#55504a] max-w-lg">
            {isAll
              ? "Browse completed interiors, architecture, and construction work from verified professionals."
              : `Discover talented ${label.toLowerCase()} and explore their exceptional projects. Find the perfect match for your dream space.`}
          </p>
        </div>

        {/* Role tabs + search + sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex flex-wrap gap-2">
            {ROLE_TABS.map((tab) => {
              const active = tab.slug === "all" ? isAll : roleSlug === tab.slug;
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.slug}
                  to={tab.slug === "all" ? "/explore" : `/explore?role=${tab.slug}`}
                  className={`inline-flex items-center gap-2 pl-3.5 pr-4 py-2 rounded-full border text-[13px] font-medium transition-colors ${
                    active
                      ? "bg-[#f4e6cd] border-[#b8823a] text-[#9c6c2c]"
                      : "bg-white border-[#e8e2d8] text-[#1c1712] hover:border-[#b8823a]"
                  }`}
                >
                  <Icon size={15} className={active ? "text-[#b8823a]" : "text-[#8a8479]"} />
                  {tab.label}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2.5 bg-white border border-[#e8e2d8] rounded-full px-4 py-2 min-w-[240px] text-[#8a8479] focus-within:border-[#b8823a] transition-colors">
              <Search size={15} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search portfolios, designers, styles..."
                className="border-none outline-none text-[13px] w-full text-[#1c1712] bg-transparent placeholder:text-[#8a8479]"
              />
            </label>

            <label className="flex items-center gap-2 text-[13px] text-[#55504a]">
              <span className="hidden sm:inline">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none border border-[#e8e2d8] rounded-lg pl-2.5 pr-7 py-1.5 text-[13px] bg-white text-[#1c1712]"
                >
                  <option value="latest">Latest</option>
                  <option value="name">Name (A–Z)</option>
                </select>
                <ChevronDown size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#8a8479]" />
              </div>
            </label>
          </div>
        </div>

        {/* Benefits bar */}
        {(isAll || role) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-6 bg-[#faf6ee] border border-[#f0e6d2] rounded-2xl px-6 py-5 mb-8 sm:divide-x sm:divide-[#f0e6d2]">
            {BENEFITS.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className={`flex items-center gap-3 ${i > 0 ? "sm:pl-6" : ""}`}>
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Icon size={16} className="text-[#b8823a]" />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-[#1c1712] leading-tight">{title}</p>
                  <p className="text-[11.5px] text-[#8a8479] leading-tight">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section heading */}
        {filtered.length > 0 && (
          <h2 className="flex items-center gap-2 font-serif font-bold text-[20px] sm:text-[22px] text-[#1c1712] mb-5">
            {isAll ? "Featured Portfolios" : `Featured ${label}`}
            <Sparkles size={17} className="text-[#b8823a]" />
          </h2>
        )}

        {/* States */}
        {roleSlug && !isAll && !role && (
          <p className="text-sm py-10 text-[#b3261e]">
            Unknown category "{roleSlug}". Choose one above.
          </p>
        )}

        {(isAll || role) && isLoading && page === 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {(isAll || role) && isError && (
          <p className="text-sm py-10 text-[#b3261e]">
            {error?.data?.message || "Couldn't load professionals. Try again."}
          </p>
        )}

        {(isAll || role) && !isLoading && !isError && filtered.length === 0 && (
          <div className="text-center py-16 rounded-2xl border border-dashed border-[#e8e2d8]">
            <p className="text-sm text-[#8a8479]">
              {search.trim()
                ? `No ${label.toLowerCase()} match "${search}".`
                : `No ${label.toLowerCase()} listed yet.`}
            </p>
          </div>
        )}

        {(isAll || role) && !isLoading && !isError && filtered.length > 0 && (
          <>
            <div
              className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 transition-opacity ${
                isFetching ? "opacity-60" : "opacity-100"
              }`}
            >
              {filtered.map((user) => (
                <PortfolioCard
                  key={user.id}
                  user={user}
                  showRoleTag={isAll}
                  onOpen={() => navigate(`/portfolio/${user.id}`, { state: { user } })}
                />
              ))}
            </div>

            {canLoadMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={isFetching}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#b8823a] text-[#9c6c2c] text-[13px] font-semibold bg-white hover:bg-[#f4e6cd] transition-colors disabled:opacity-50"
                >
                  {isFetching ? "Loading…" : `Load More ${label}`}
                  <ChevronDown size={15} />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}