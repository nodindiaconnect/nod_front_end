import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, MapPin, Search } from "lucide-react";
import { useGetAllPortfoliosQuery } from "./supplyproductsapislice";

const ROLE_LABELS = {
  1: "Client",
  2: "Interior Designer",
  3: "Architect",
  4: "Contractor",
  5: "Material Supplier",
};

const FILTER_ROLES = [
  { id: 3, label: "Architect" },
  { id: 2, label: "Interior Designer" },
  { id: 4, label: "Contractor" },
  { id: 6, label: "Landscape Designer" }, // update this id to match your real role number
];

const PAGE_SIZE = 8;

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

function PortfolioCard({ user, onOpen }) {
  const [imgFailed, setImgFailed] = useState(false);
  const cover = user.posts?.[0]?.images?.[0] || user.profile?.photos?.[0];
  const roleLabel = ROLE_LABELS[user.role] || "Professional";
  const initial = user.name?.trim()?.[0]?.toUpperCase() || "?";

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col text-left rounded-2xl border border-[#ece5d8] bg-white p-3 shadow-[0_1px_2px_rgba(28,23,18,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_-12px_rgba(28,23,18,0.18)] hover:border-[#e0d3b8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8823a] focus-visible:ring-offset-2"
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
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur text-[#1c1712] text-[11px] font-semibold px-2.5 py-1.5 rounded-full shadow-sm">
          {roleLabel}
        </span>
      </div>
      <div className="pt-3 px-1 pb-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[15px] font-semibold text-[#1c1712] truncate">{user.name}</h3>
          <ArrowUpRight
            size={16}
            className="text-[#8a8479] flex-shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#b8823a]"
          />
        </div>
        {user.city && (
          <p className="flex items-center gap-1.5 mt-1 text-[13px] text-[#8a8479]">
            <MapPin size={13} /> {user.city}
          </p>
        )}
      </div>
    </button>
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

export default function PortfolioDirectory() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(null);
  const [sortBy, setSortBy] = useState("latest");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetAllPortfoliosQuery({ page: 1, limit: 100 });
  const apiUsers = data?.data?.data || [];
  const users = useMemo(() => apiUsers.map(normalisePortfolio), [apiUsers]);

  const filtered = useMemo(() => {
    let list = users;
    if (roleFilter) list = list.filter((u) => u.role === roleFilter);
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
  }, [users, roleFilter, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = useMemo(() => {
    const nums = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) nums.push(i);
      else if (nums[nums.length - 1] !== "...") nums.push("...");
    }
    return nums;
  }, [totalPages, currentPage]);

  return (
    <main className="min-h-screen bg-white text-[#1c1712] font-sans">
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-20">
        <div className="flex flex-wrap items-end justify-between gap-5 mb-6">
          <div>
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#b8823a] mb-2">
              Nod Professionals
            </p>
            <h1 className="font-serif font-bold text-[26px] sm:text-[32px] lg:text-[36px] leading-[1.15] mb-2 text-[#1c1712]">
              Explore portfolios
            </h1>
            <p className="text-sm text-[#55504a]">
              Browse completed interiors, architecture, and construction work.
            </p>
          </div>
          <label className="flex items-center gap-2.5 bg-white border border-[#e8e2d8] rounded-full px-4 py-2.5 min-w-[260px] w-full sm:w-auto text-[#8a8479] focus-within:border-[#b8823a] transition-colors">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search portfolios"
              className="border-none outline-none text-[13.5px] w-full text-[#1c1712] bg-transparent placeholder:text-[#8a8479]"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setRoleFilter(null);
                setPage(1);
              }}
              className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-full border text-[13px] font-medium transition-colors ${
                roleFilter === null
                  ? "bg-[#f4e6cd] border-[#b8823a] text-[#9c6c2c]"
                  : "bg-[#f1e9dc] border-[#f1e9dc] text-[#1c1712] hover:border-[#b8823a]"
              }`}
            >
              All Roles <ChevronDown size={13} />
            </button>
            {FILTER_ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setRoleFilter(r.id);
                  setPage(1);
                }}
                className={`px-3.5 py-2 rounded-full border text-[13px] font-medium transition-colors ${
                  roleFilter === r.id
                    ? "bg-[#f4e6cd] border-[#b8823a] text-[#9c6c2c]"
                    : "bg-white border-[#e8e2d8] text-[#1c1712] hover:border-[#b8823a]"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-[13px] text-[#55504a]">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-[#e8e2d8] rounded-lg px-2.5 py-1.5 text-[13px] bg-white text-[#1c1712]"
            >
              <option value="latest">Latest</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </label>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : pageItems.length ? (
          <>
            <div
              className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 transition-opacity ${
                isFetching ? "opacity-60" : "opacity-100"
              }`}
            >
              {pageItems.map((user) => (
                <PortfolioCard
                  key={user.id}
                  user={user}
                  onOpen={() => navigate(`/portfolio/${user.id}`, { state: { user } })}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="flex justify-center items-center flex-wrap gap-2 mt-11" aria-label="Pagination">
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-lg border border-[#e8e2d8] bg-white flex items-center justify-center text-[#1c1712] disabled:opacity-35 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                {pageNumbers.map((n, i) =>
                  n === "..." ? (
                    <span key={`dots-${i}`} className="text-[#8a8479] px-1">
                      …
                    </span>
                  ) : (
                    <button
                      key={n}
                      type="button"
                      onClick={() => goToPage(n)}
                      className={`w-9 h-9 rounded-lg border text-sm font-medium flex items-center justify-center ${
                        n === currentPage
                          ? "bg-[#f4e6cd] border-[#b8823a] text-[#9c6c2c] font-bold"
                          : "bg-white border-[#e8e2d8] text-[#1c1712]"
                      }`}
                    >
                      {n}
                    </button>
                  )
                )}
                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 rounded-lg border border-[#e8e2d8] bg-white flex items-center justify-center text-[#1c1712] disabled:opacity-35 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </nav>
            )}
          </>
        ) : (
          <div className="py-16 text-center text-[#8a8479]">No portfolios match "{search}".</div>
        )}
      </section>
    </main>
  );
}

