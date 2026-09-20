import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Search,
  Star,
  Bell,
  Building2,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { useGetAllPortfoliosQuery } from "./supplyproductsapislice";
import { ThemeToggle } from "../context/ThemeContext";

const ROLE_LABELS = {
  1: "Client",
  2: "Designer",
  3: "Architect",
  4: "Contractor",
  5: "Material Supplier",
};

const DESIGNER_SPECIALIZATIONS = [
  { id: "ALL", label: "All Designers", query: "" },
  { id: "interior", label: "Interior Design", query: "interior" },
  { id: "exterior", label: "Exterior Designer", query: "exterior" },
  { id: "autocad", label: "AutoCAD Designer", query: "autocad" },
  { id: "bim_3d", label: "BIM & 3D Visualizer", query: "bim|3d|cad" },
  { id: "landscape", label: "Landscape Designer", query: "landscape" },
  { id: "structural", label: "Structural Designer", query: "structural" },
  { id: "product", label: "Product Designer", query: "product" },
  { id: "vastu", label: "Vastu Consultant", query: "vastu" },
  { id: "residential", label: "Residential Interior", query: "residential" },
  { id: "commercial", label: "Commercial Interior", query: "commercial|office" },
];

const FILTER_ROLES = [
  { id: "ALL", label: "All Roles" },
  { id: 3, label: "Architect" },
  { id: 2, label: "Designers", hasSubmenu: true },
  { id: 4, label: "Contractor" },
  { id: 5, label: "Material Supplier" },
];

const ROLE_CONFIG = {
  2: {
    name: "Designer",
    badgeBg: "bg-purple-100 text-purple-700",
    catBg: "bg-purple-50 text-purple-700 border-purple-100",
    defaultCat: "Design & Planning",
    defaultSpec: "Designer",
    defaultCover:
      "/extracted/img_9.jpg",
  },
  3: {
    name: "Architect",
    badgeBg: "bg-sky-100 text-sky-700",
    catBg: "bg-sky-50 text-sky-700 border-sky-100",
    defaultCat: "Residential Architecture",
    defaultSpec: "Architect",
    defaultCover:
      "/extracted/img_6.jpg",
  },
  4: {
    name: "Contractor",
    badgeBg: "bg-emerald-100 text-emerald-700",
    catBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
    defaultCat: "Civil Construction",
    defaultSpec: "General Contractor",
    defaultCover:
      "/extracted/img_9.jpg",
  },
  5: {
    name: "Material Supplier",
    badgeBg: "bg-amber-100 text-amber-800",
    catBg: "bg-orange-50 text-orange-700 border-orange-100",
    defaultCat: "Building Materials",
    defaultSpec: "Material Supplier",
    defaultCover:
      "/extracted/img_8.jpg",
  },
};

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
  const profile = safeParseProfile(user?.profile);
  const roleNum = Number(user.role);
  const cfg = ROLE_CONFIG[roleNum] || ROLE_CONFIG[2];

  // Dynamic Category Extraction
  const category =
    user.category ||
    profile.category ||
    user.designer?.category ||
    cfg.defaultCat;

  // Dynamic Specialization Extraction
  const rawSpecialization =
    user.specialization ||
    profile.specialization ||
    profile.trade ||
    profile.businessType ||
    user.designer?.specializations?.[0] ||
    cfg.defaultSpec;

  // Dynamic Experience Extraction
  const experience =
    profile.experience !== undefined && profile.experience !== null
      ? Number(profile.experience)
      : user.designer?.yearsOfExperience !== undefined && user.designer?.yearsOfExperience !== null
      ? Number(user.designer.yearsOfExperience)
      : user.architect?.yearsOfExperience !== undefined && user.architect?.yearsOfExperience !== null
      ? Number(user.architect.yearsOfExperience)
      : user.contractor?.yearsOfExperience !== undefined && user.contractor?.yearsOfExperience !== null
      ? Number(user.contractor.yearsOfExperience)
      : 2;

  // Dynamic Rating & Reviews
  const rating = Number(
    user.rating ||
      user.ratingCache ||
      user.designer?.rating ||
      user.architect?.rating ||
      user.contractor?.rating ||
      0
  );
  const totalReviews = Number(
    user.totalReviews ||
      user._count?.reviewsReceived ||
      user.designer?.totalReviews ||
      user.architect?.totalReviews ||
      user.contractor?.totalReviews ||
      0
  );

  // Cover image from real posts, uploaded profile photos, or role-specific showcase
  const cover =
    user.posts?.[0]?.images?.[0] ||
    profile.photos?.[0] ||
    user.designer?.photos?.[0] ||
    cfg.defaultCover;

  // Format Location string (e.g. "Hyderabad, Telangana, India")
  const locationParts = [user.city, user.state, user.country].filter(
    (p) => p && p !== "N/A"
  );
  const location = locationParts.length > 0 ? locationParts.join(", ") : "India";

  // Dynamic Specialization Level
  const specializationLevel =
    user.specializationLevel ||
    profile.specializationLevel ||
    profile.level ||
    profile.experienceLevel ||
    user.designer?.specializationLevel ||
    user.architect?.specializationLevel ||
    (experience >= 6 ? "Professional" : experience >= 3 ? "Intermediate" : "Beginner");

  return {
    ...user,
    profile,
    category,
    specialization: rawSpecialization,
    specializationLevel,
    experience,
    rating,
    totalReviews,
    cover,
    location,
    roleConfig: cfg,
    posts: user?.posts || [],
    _count: user?._count || {},
  };
}

function PortfolioCard({ user, onOpen }) {
  const [imgFailed, setImgFailed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const cfg = user.roleConfig;

  return (
    <div
      onClick={onOpen}
      className="group flex flex-col justify-between text-left rounded-2xl border border-gray-200/90 dark:border-[#222938] bg-white dark:bg-[#141822] p-3 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* ── Image Area ── */}
      <div className="relative w-full aspect-[16/11] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={!imgFailed && user.cover ? user.cover : cfg.defaultCover}
          alt={`${user.name}'s work`}
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Role Badge (Top-Left) */}
        <span
          className={`absolute top-2.5 left-2.5 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xs backdrop-blur-xs ${cfg.badgeBg}`}
        >
          {ROLE_LABELS[user.role] || "Professional"}
        </span>
      </div>

      {/* ── Details Area ── */}
      <div className="pt-3 px-1 pb-1 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Name */}
          <h3 className="text-[16px] font-bold text-gray-900 dark:text-white truncate tracking-tight">
            {user.name}
          </h3>

          {/* Location */}
          <p className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
            <MapPin size={13} className="text-gray-400 shrink-0" />
            <span className="truncate">{user.location}</span>
          </p>
        </div>

        {/* Category Badge & Specialization with Side Headings */}
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 shrink-0">Category:</span>
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${cfg.catBg} truncate max-w-[155px]`}
            >
              {user.category}
            </span>
          </div>
          {user.specialization && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 shrink-0">Specialization:</span>
              <span className="text-xs text-gray-700 dark:text-gray-300 truncate font-medium">
                {user.specialization}
              </span>
            </div>
          )}
          {user.specializationLevel && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 shrink-0">Level:</span>
              <span className="px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-[#fef9ee] dark:bg-[#251e16] text-[#b8823a] border border-[#eed7a1] dark:border-[#523d1d] truncate">
                {user.specializationLevel}
              </span>
            </div>
          )}
        </div>

        {/* Footer: Experience, Rating, Action Arrow */}
        <div className="border-t border-gray-100 dark:border-[#222938] pt-2.5 mt-auto flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {user.experience} Yrs Experience
          </span>

          <span className="flex items-center gap-1 font-medium text-gray-800 dark:text-gray-200">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span>{user.rating.toFixed(1)}</span>
            <span className="text-gray-400">({user.totalReviews} reviews)</span>
          </span>

          <div className="w-7 h-7 rounded-lg border border-gray-200 dark:border-[#2b3345] flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:border-[#b8823a] group-hover:text-[#b8823a] group-hover:bg-[#fbf4e8] dark:group-hover:bg-[#202736] transition-all">
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 dark:border-[#222938] bg-white dark:bg-[#141822] p-3 space-y-3 animate-pulse">
      <div className="w-full aspect-[16/11] rounded-xl bg-gray-100 dark:bg-gray-800" />
      <div className="space-y-2 px-1">
        <div className="h-4 w-2/3 rounded bg-gray-100 dark:bg-gray-800" />
        <div className="h-3 w-1/2 rounded bg-gray-100 dark:bg-gray-800" />
        <div className="h-5 w-3/4 rounded bg-gray-100 dark:bg-gray-800 mt-2" />
        <div className="h-4 w-full rounded bg-gray-100 dark:bg-gray-800 pt-3 border-t border-gray-50 dark:border-gray-800" />
      </div>
    </div>
  );
}

export default function PortfolioDirectory() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [designerSpec, setDesignerSpec] = useState("ALL");
  const [selectedLevel, setSelectedLevel] = useState("ALL");
  const [isDesignerMenuOpen, setIsDesignerMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [page, setPage] = useState(1);
  const designerDropdownRef = useRef(null);

  // Close designer dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        designerDropdownRef.current &&
        !designerDropdownRef.current.contains(event.target)
      ) {
        setIsDesignerMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch real portfolio data from backend API
  const { data, isLoading, isFetching } = useGetAllPortfoliosQuery({
    page: 1,
    limit: 100,
  });

  const apiUsers = Array.isArray(data?.data?.data)
    ? data.data.data
    : Array.isArray(data?.data?.users)
    ? data.data.users
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : [];

  const users = useMemo(() => apiUsers.map(normalisePortfolio), [apiUsers]);

  // Filter & Sort
  const filtered = useMemo(() => {
    let list = users;

    // Role filter
    if (selectedRole !== "ALL") {
      if (Number(selectedRole) === 2) {
        list = list.filter((u) => Number(u.role) === 2);
        if (designerSpec !== "ALL") {
          const specObj = DESIGNER_SPECIALIZATIONS.find((s) => s.id === designerSpec);
          const q = (specObj?.query || designerSpec).toLowerCase();
          const keywords = q.split("|");
          list = list.filter((u) => {
            const spec = (u.specialization || "").toLowerCase();
            const cat = (u.category || "").toLowerCase();
            const rawSpecs = (u.specializationsText || "").toLowerCase();
            return keywords.some((kw) => spec.includes(kw) || cat.includes(kw) || rawSpecs.includes(kw));
          });
        }
      } else {
        list = list.filter((u) => Number(u.role) === Number(selectedRole));
      }
    }

    // Specialization Level filter
    if (selectedLevel !== "ALL") {
      list = list.filter(
        (u) => (u.specializationLevel || "").toLowerCase() === selectedLevel.toLowerCase()
      );
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.category?.toLowerCase().includes(q) ||
          u.specialization?.toLowerCase().includes(q) ||
          u.city?.toLowerCase().includes(q) ||
          u.state?.toLowerCase().includes(q) ||
          u.location?.toLowerCase().includes(q)
      );
    }

    // Sort filter
    if (sortBy === "rating") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "experience") {
      list = [...list].sort((a, b) => b.experience - a.experience);
    } else if (sortBy === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list = [...list].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    return list;
  }, [users, selectedRole, search, sortBy]);

  const totalRecords = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = useMemo(() => {
    const nums = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1)
        nums.push(i);
      else if (nums[nums.length - 1] !== "...") nums.push("...");
    }
    return nums;
  }, [totalPages, currentPage]);

  const startIndex = totalRecords === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, totalRecords);

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[var(--background)] text-[#1c1712] dark:text-[var(--text)] font-sans transition-colors duration-300">
      {/* ── Custom Header matching Reference Image ── */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#141822]/95 backdrop-blur-md border-b border-gray-200/75 dark:border-[#222938] px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-[#b8823a]">
            <Building2 size={24} className="stroke-[2.2]" />
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-base tracking-tight text-[#1c1712] dark:text-white">
                NOD <span className="text-[#b8823a]">PROFESSIONALS</span>
              </span>
            </div>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-[13.5px] font-medium text-gray-600 dark:text-gray-300">
          <Link to="/" className="hover:text-[#b8823a] transition-colors">
            Home
          </Link>
          <Link
            to="/portfolios"
            className="text-[#b8823a] font-semibold relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#b8823a] after:rounded-full"
          >
            Professionals
          </Link>
          <Link
            to="/supplier-products"
            className="hover:text-[#b8823a] transition-colors"
          >
            Products
          </Link>
       
          <Link to="/about" className="hover:text-[#b8823a] transition-colors">
            About Us
          </Link>
        </nav>

        {/* Header Right (Theme Toggle) */}
        <div className="flex items-center gap-3">
          <ThemeToggle size="sm" />
        </div>
      </header>

      {/* ── Main Container ── */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-20">
        {/* ── Section Title & Search Bar Row ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-7">
          <div>
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#b8823a] mb-1.5">
              NOD PROFESSIONALS
            </p>
            <h1 className="font-extrabold text-[28px] sm:text-[34px] lg:text-[38px] leading-tight text-[#111827] dark:text-white tracking-tight">
              Explore portfolios
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Browse completed interiors, architecture, and construction work.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-[380px]">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search portfolios by name, category, city..."
              className="w-full bg-white dark:bg-[#141822] border border-gray-200 dark:border-[#222938] rounded-full pl-10 pr-4 py-2.5 text-[13.5px] text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#b8823a] focus:ring-1 focus:ring-[#b8823a] shadow-xs transition"
            />
          </div>
        </div>

        {/* ── Filter Pills & Sort Bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          {/* Role Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {FILTER_ROLES.map((r) => {
              // Custom interactive dropdown for Designers
              if (r.id === 2) {
                const isSelected = selectedRole === 2;
                const activeSpec = DESIGNER_SPECIALIZATIONS.find((s) => s.id === designerSpec);
                const isCustomSpec = isSelected && designerSpec !== "ALL";

                return (
                  <div key={r.id} className="relative inline-block" ref={designerDropdownRef}>
                    <button
                      type="button"
                      onClick={() => {
                        if (!isSelected) {
                          setSelectedRole(2);
                          setPage(1);
                        }
                        setIsDesignerMenuOpen((prev) => !prev);
                      }}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-[13px] font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#fef9ee] border-[#eed7a1] text-[#9c6c2c] shadow-2xs font-semibold"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      <span>
                        {isCustomSpec ? `Designers: ${activeSpec?.label}` : "Designers"}
                      </span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          isDesignerMenuOpen ? "rotate-180 text-[#b8823a]" : "text-gray-400"
                        }`}
                      />
                      {isCustomSpec && (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDesignerSpec("ALL");
                            setPage(1);
                          }}
                          className="ml-1 p-0.5 rounded-full hover:bg-[#eed7a1]/50 text-gray-500 hover:text-gray-900 transition-colors"
                          title="Clear specialization filter"
                        >
                          <X size={13} />
                        </span>
                      )}
                    </button>

                    {/* Designer Specializations Dropdown Menu */}
                    {isDesignerMenuOpen && (
                      <div className="absolute left-0 top-full mt-2 w-64 sm:w-72 bg-white rounded-2xl shadow-xl border border-gray-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-3.5 py-1.5 border-b border-gray-100 flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            Designer Specializations
                          </span>
                          {designerSpec !== "ALL" && (
                            <button
                              type="button"
                              onClick={() => {
                                setDesignerSpec("ALL");
                                setPage(1);
                              }}
                              className="text-[11px] font-semibold text-[#b8823a] hover:underline cursor-pointer"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                        <div className="max-h-64 overflow-y-auto py-1 divide-y divide-gray-50">
                          {DESIGNER_SPECIALIZATIONS.map((spec) => {
                            const isCurrent = isSelected && designerSpec === spec.id;
                            return (
                              <button
                                key={spec.id}
                                type="button"
                                onClick={() => {
                                  setSelectedRole(2);
                                  setDesignerSpec(spec.id);
                                  setIsDesignerMenuOpen(false);
                                  setPage(1);
                                }}
                                className={`w-full text-left px-3.5 py-2 text-xs sm:text-[13px] flex items-center justify-between transition-colors cursor-pointer ${
                                  isCurrent
                                    ? "bg-[#fef9ee] text-[#b8823a] font-bold"
                                    : "text-gray-700 hover:bg-gray-50 font-medium"
                                }`}
                              >
                                <span>{spec.label}</span>
                                {isCurrent && (
                                  <Check size={14} className="text-[#b8823a] stroke-[2.5]" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setSelectedRole(r.id);
                    setDesignerSpec("ALL");
                    setIsDesignerMenuOpen(false);
                    setPage(1);
                  }}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-[13px] font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#fef9ee] border-[#eed7a1] text-[#9c6c2c] shadow-2xs font-semibold"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* Controls: Level Filter & Sort Dropdown */}
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap shrink-0">
            {/* Specialization Level Dropdown */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 shrink-0">
              <span className="font-medium">Level:</span>
              <div className="relative">
                <select
                  value={selectedLevel}
                  onChange={(e) => {
                    setSelectedLevel(e.target.value);
                    setPage(1);
                  }}
                  className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-[13px] font-medium text-gray-800 focus:outline-none focus:border-[#b8823a] shadow-2xs cursor-pointer"
                >
                  <option value="ALL">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Professional">Professional</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 shrink-0">
              <span className="font-medium">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-[13px] font-medium text-gray-800 focus:outline-none focus:border-[#b8823a] shadow-2xs cursor-pointer"
                >
                  <option value="latest">Latest</option>
                  <option value="rating">Highest Rated</option>
                  <option value="experience">Most Experienced</option>
                  <option value="name">Name (A–Z)</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Portfolio Grid ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : pageItems.length ? (
          <>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 transition-opacity ${
                isFetching ? "opacity-60" : "opacity-100"
              }`}
            >
              {pageItems.map((user) => (
                <PortfolioCard
                  key={user.id}
                  user={user}
                  onOpen={() =>
                    navigate(`/portfolio/${user.id}`, { state: { user } })
                  }
                />
              ))}
            </div>

            {/* ── Bottom Pagination & Counter ── */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-gray-200/80">
              {/* Spacer for centering */}
              <div className="hidden sm:block w-32" />

              {/* Pagination Numbers */}
              {totalPages > 1 && (
                <nav
                  className="flex items-center gap-1.5"
                  aria-label="Pagination"
                >
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-2xs"
                  >
                    <ChevronLeft size={15} />
                  </button>

                  {pageNumbers.map((n, i) =>
                    n === "..." ? (
                      <span key={`dots-${i}`} className="text-gray-400 px-1 text-xs">
                        …
                      </span>
                    ) : (
                      <button
                        key={n}
                        type="button"
                        onClick={() => goToPage(n)}
                        className={`w-8 h-8 rounded-lg border text-xs font-semibold flex items-center justify-center transition shadow-2xs ${
                          n === currentPage
                            ? "bg-[#fef9ee] border-[#eed7a1] text-[#9c6c2c]"
                            : "bg-white border-transparent hover:border-gray-200 text-gray-700 hover:bg-gray-50"
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
                    className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-2xs"
                  >
                    <ChevronRight size={15} />
                  </button>
                </nav>
              )}

              {/* Counter Text */}
              <div className="text-xs text-gray-500 font-medium">
                Showing {startIndex} – {endIndex} of {totalRecords}
              </div>
            </div>
          </>
        ) : (
          <div className="py-20 text-center bg-white rounded-2xl border border-gray-200/80 p-8 shadow-xs">
            <p className="text-base font-semibold text-gray-800">
              No portfolios match your filters
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Try adjusting your search terms or selecting a different role.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedRole("ALL");
                setDesignerSpec("ALL");
                setSelectedLevel("ALL");
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-[#b8823a] bg-[#fef9ee] border border-[#eed7a1] rounded-full hover:bg-[#fbf4e8] transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}


