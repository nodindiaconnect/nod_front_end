import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Building,
  Hammer,
  Palette,
  Package,
  Layers,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  FileText,
  Award,
  Check,
  ArrowRight,
} from "lucide-react";
import { useGetAllPortfoliosQuery } from "../../../pages/supplyproductsapislice";

const ROLES = [
  { id: "ALL", label: "All Specialists", sublabel: "All Specialties", icon: Layers },
  { id: 3, label: "Architects", sublabel: "Browse pros", icon: Building },
  { id: 2, label: "Designers", sublabel: "Interior, 3D, BIM...", icon: Palette },
  { id: 4, label: "Contractors", sublabel: "Browse pros", icon: Hammer },
  { id: 5, label: "Material Suppliers", sublabel: "Browse pros", icon: Package },
];

const ROLE_LABELS = {
  1: "Client",
  2: "Designer",
  3: "Architect",
  4: "Contractor",
  5: "Material Supplier",
};

const DESIGNER_SPECIALIZATIONS = [
  { id: "ALL", label: "All Categories", query: "" },
  { id: "interior", label: "Interior Designer", query: "interior" },
  { id: "exterior", label: "Exterior Designer", query: "exterior" },
  { id: "autocad", label: "AutoCAD Drafter", query: "autocad|draft" },
  { id: "landscape", label: "Landscape Designer", query: "landscape" },
  { id: "bim", label: "BIM Engineer", query: "bim|revit" },
  { id: "product", label: "Product Designer", query: "product|furniture" },
  { id: "graphic", label: "Graphic Designer", query: "graphic|signage" },
  { id: "3d_modeler", label: "3D Modeler", query: "3d|model|render" },
  { id: "walkthrough", label: "Walkthrough Specialist", query: "walkthrough|animation|vr" },
  { id: "estimation", label: "Estimation Engineer", query: "estimation|boq|quantity" },
];

const ROLE_CONFIG = {
  2: {
    defaultCat: "Design & Planning",
    defaultSpec: "Designer",
    defaultSpecs: "Interior Design, 3D Visualizer",
    defaultCover:
      "/extracted/img_9.jpg",
  },
  3: {
    defaultCat: "Residential Architecture",
    defaultSpec: "3D Architect",
    defaultSpecs: "Residential Architecture, Commercial Planning",
    defaultCover:
      "/extracted/img_6.jpg",
  },
  4: {
    defaultCat: "Civil Construction",
    defaultSpec: "Turnkey Contractor",
    defaultSpecs: "Turnkey Construction, Structural Framing",
    defaultCover:
      "/extracted/img_9.jpg",
  },
  5: {
    defaultCat: "Building Materials",
    defaultSpec: "Tiles & Sanitary",
    defaultSpecs: "Tiles & Sanitary, Hardware & Fittings",
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

function normaliseSpecialist(user) {
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

  // Multiple specializations string for the card footer
  let specializationsList = [];
  if (Array.isArray(profile.specializations) && profile.specializations.length > 0) {
    specializationsList = profile.specializations;
  } else if (Array.isArray(user.designer?.specializations) && user.designer.specializations.length > 0) {
    specializationsList = user.designer.specializations;
  } else if (user.specialization) {
    specializationsList = [user.specialization];
  } else {
    specializationsList = [cfg.defaultSpecs];
  }
  const specializationsText = specializationsList.join(", ");

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

  // Cover image
  const cover =
    user.profileImageUrl ||
    (typeof user.profile === "string" &&
    (user.profile.startsWith("http") || user.profile.startsWith("/uploads") || user.profile.startsWith("data:"))
      ? user.profile
      : null) ||
    user.posts?.[0]?.images?.[0] ||
    (Array.isArray(profile.photos) && profile.photos[0]) ||
    (Array.isArray(user.designer?.photos) && user.designer.photos[0]) ||
    (Array.isArray(user.architect?.photos) && user.architect.photos[0]) ||
    (Array.isArray(user.contractor?.photos) && user.contractor.photos[0]) ||
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
    specializationsText,
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

function SpecialistCard({ user, onOpen }) {
  const [imgFailed, setImgFailed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const roleName = ROLE_LABELS[user.role] || "Specialist";
  const projectCount = user.posts?.length || user._count?.posts || 0;

  return (
    <div
      onClick={onOpen}
      className="group bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* ── Upper Section: Left Image & Right Details ── */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
        {/* Left Image Column */}
        <div className="relative w-full sm:w-56 h-48 sm:h-52 rounded-xl overflow-hidden bg-gray-100 shrink-0">
          <img
            src={!imgFailed && user.cover ? user.cover : user.roleConfig.defaultCover}
            alt={user.name}
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
          />

       

        </div>

        {/* Right Details Column */}
        <div className="flex-1 flex flex-col justify-between min-w-0 space-y-3">
          {/* Header Info */}
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-[17px] font-bold text-gray-900 truncate tracking-tight font-serif">
                {user.name}
              </h3>
              <ShieldCheck
                size={16}
                className="text-[#b8823a] fill-[#b8823a]/15 shrink-0"
              />
            </div>

            <p className="text-[11px] font-bold text-[#b8823a] tracking-wider uppercase mt-0.5">
              {roleName}
            </p>

            <p className="flex items-center gap-1 text-xs text-gray-500 truncate mt-1">
              <MapPin size={13} className="text-gray-400 shrink-0" />
              <span className="truncate">{user.location}</span>
            </p>
          </div>

          {/* Category & Specialization with Side Headings */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-gray-600 text-[11px] shrink-0">Category:</span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#f7f4ed] text-gray-800 border border-gray-200/80 truncate max-w-[200px]">
                {user.category}
              </span>
            </div>
            {user.specialization && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-gray-600 text-[11px] shrink-0">Specialization:</span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#f7f4ed] text-gray-800 border border-gray-200/80 truncate max-w-[200px]">
                  {user.specialization}
                </span>
              </div>
            )}
            {user.specializationLevel && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-gray-600 text-[11px] shrink-0">Level:</span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#fef9ee] text-[#b8823a] border border-[#eed7a1] truncate max-w-[200px]">
                  {user.specializationLevel}
                </span>
              </div>
            )}
          </div>

          {/* 3 Metrics Row */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
            {/* Experience */}
            <div className="flex items-center gap-1.5">
              <Briefcase size={15} className="text-gray-400 shrink-0" />
              <div className="min-w-0">
                <span className="block text-xs font-bold text-gray-900 leading-tight">
                  {user.experience}
                </span>
                <span className="block text-[10px] text-gray-500 leading-none truncate">
                  Years Experience
                </span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <Star size={15} className="text-gray-400 shrink-0" />
              <div className="min-w-0">
                <span className="block text-xs font-bold text-gray-900 leading-tight">
                  {user.rating.toFixed(1)}
                </span>
                <span className="block text-[10px] text-gray-500 leading-none truncate">
                  ({user.totalReviews} reviews)
                </span>
              </div>
            </div>

            {/* Projects Showcased */}
            <div className="flex items-center gap-1.5">
              <FileText size={15} className="text-gray-400 shrink-0" />
              <div className="min-w-0">
                <span className="block text-xs font-bold text-gray-900 leading-tight">
                  {projectCount}
                </span>
                <span className="block text-[10px] text-gray-500 leading-none truncate">
                  Projects Showcased
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Footer Section ── */}
      <div className="border-t border-gray-100 pt-3 mt-4 flex items-center justify-between text-xs">
        <span className="text-gray-600 font-medium truncate max-w-[70%] text-xs">
          <strong className="text-gray-900 font-semibold">Specializations:</strong>{" "}
          {user.specializationsText}
        </span>

        <span className="font-bold text-[#b8823a] flex items-center gap-1 hover:translate-x-0.5 transition shrink-0">
          View Profile <ArrowRight size={13} />
        </span>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 space-y-4 animate-pulse">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-56 h-48 sm:h-52 rounded-xl bg-gray-100 shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-5 w-3/4 bg-gray-100 rounded" />
          <div className="h-3 w-1/3 bg-gray-100 rounded" />
          <div className="h-3 w-1/2 bg-gray-100 rounded" />
          <div className="flex gap-2">
            <div className="h-6 w-24 bg-gray-100 rounded-md" />
            <div className="h-6 w-24 bg-gray-100 rounded-md" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="h-8 bg-gray-100 rounded" />
            <div className="h-8 bg-gray-100 rounded" />
            <div className="h-8 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
      <div className="h-4 w-full bg-gray-100 rounded pt-3 border-t border-gray-50" />
    </div>
  );
}

export default function FindProsPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [designerSpec, setDesignerSpec] = useState("ALL");
  const [specLevelFilter, setSpecLevelFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("latest");
  const [page, setPage] = useState(1);

  const { data: portfoliosData, isLoading, isFetching } = useGetAllPortfoliosQuery({
    page: 1,
    limit: 100,
  });

  const apiUsers = Array.isArray(portfoliosData?.data?.data)
    ? portfoliosData.data.data
    : Array.isArray(portfoliosData?.data?.users)
    ? portfoliosData.data.users
    : Array.isArray(portfoliosData?.data)
    ? portfoliosData.data
    : Array.isArray(portfoliosData)
    ? portfoliosData
    : [];

  const users = useMemo(() => apiUsers.map(normaliseSpecialist), [apiUsers]);

  // Unique cities list
  const uniqueCities = useMemo(() => {
    const set = new Set();
    users.forEach((u) => {
      if (u.city && u.city !== "N/A") set.add(u.city);
    });
    return Array.from(set);
  }, [users]);

  // Filter & Sort
  const filteredUsers = useMemo(() => {
    let list = users;

    // Role filter
    if (selectedRole !== "ALL") {
      list = list.filter((u) => Number(u.role) === Number(selectedRole));
    }

    // Designer Specialization filter
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

    // Specialization Level filter
    if (specLevelFilter !== "ALL") {
      list = list.filter(
        (u) => (u.specializationLevel || "").toLowerCase() === specLevelFilter.toLowerCase()
      );
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.category?.toLowerCase().includes(q) ||
          u.specialization?.toLowerCase().includes(q) ||
          u.specializationsText?.toLowerCase().includes(q) ||
          u.city?.toLowerCase().includes(q) ||
          u.state?.toLowerCase().includes(q) ||
          u.location?.toLowerCase().includes(q)
      );
    }

    // City filter
    if (cityFilter !== "ALL") {
      list = list.filter(
        (u) => u.city?.toLowerCase() === cityFilter.toLowerCase()
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
  }, [users, selectedRole, searchQuery, cityFilter, sortBy]);

  const totalRecords = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredUsers.slice(
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

  return (
    <div className="min-h-screen w-full bg-[#faf8f5] py-7 px-4 sm:px-6 lg:px-10 space-y-6">
      {/* ── Header Row with Verified Marketplace Tag ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-serif">
              Find Verified Professionals
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef8ee] text-[#b8823a] text-xs font-semibold border border-[#eed7a1]">
              <Check size={13} className="stroke-[3]" /> Verified Marketplace
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
            Browse top-rated Architects,  Designers, Contractors, and Suppliers with verified reviews and performance track records.
          </p>
        </div>
      </div>

      {/* ── 5 Role Category Cards / Tabs (Row of 5) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {ROLES.map((r) => {
          const Icon = r.icon;
          const isSelected = selectedRole === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setSelectedRole(r.id);
                if (r.id !== 2) setDesignerSpec("ALL");
                setPage(1);
              }}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                isSelected
                  ? "bg-[#2d241e] border-[#2d241e] text-white shadow-sm"
                  : "bg-white text-gray-800 border-gray-200/90 hover:border-gray-300 hover:shadow-xs"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected
                    ? "bg-white/10 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <Icon size={18} />
              </div>
              <div className="truncate">
                <span
                  className={`text-xs sm:text-[13px] font-bold block truncate ${
                    isSelected ? "text-white" : "text-gray-900"
                  }`}
                >
                  {r.label}
                </span>
                <span
                  className={`text-[11px] truncate block ${
                    isSelected ? "text-[#d4a359] font-medium" : "text-gray-400"
                  }`}
                >
                  {r.sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Search & Filter Bar (White Pill Container) ── */}
      <div className="p-3 bg-white border border-gray-200/90 rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:flex-1">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name, specialization, keywords, or city..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full bg-transparent pl-10 pr-4 py-2 text-xs sm:text-[13.5px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
        </div>

        {/* Dropdowns: Specialization, All Cities & Sort by */}
        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 flex-wrap justify-end">
          {/* Designer Specialization Selector */}
          <div className="relative">
            <div
              className={`flex items-center gap-1.5 border rounded-xl px-3 py-2 bg-white text-xs font-medium shadow-2xs transition-colors ${
                designerSpec !== "ALL"
                  ? "border-[#eed7a1] text-[#9c6c2c] bg-[#fef9ee]"
                  : "border-gray-200 text-gray-800"
              }`}
            >
              <Palette size={14} className={designerSpec !== "ALL" ? "text-[#b8823a]" : "text-gray-400"} />
              <select
                value={designerSpec}
                onChange={(e) => {
                  setDesignerSpec(e.target.value);
                  if (e.target.value !== "ALL" && selectedRole !== 2) {
                    setSelectedRole(2);
                  }
                  setPage(1);
                }}
                className="appearance-none bg-transparent pr-6 text-xs text-inherit outline-none cursor-pointer font-medium"
              >
                <option value="ALL">All Specializations</option>
                {DESIGNER_SPECIALIZATIONS.filter((s) => s.id !== "ALL").map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>
          </div>

          {/* All Cities Selector */}
          <div className="relative">
            <div className="flex items-center gap-1.5 border border-gray-200 rounded-xl px-3 py-2 bg-white text-xs font-medium text-gray-800 shadow-2xs">
              <MapPin size={14} className="text-gray-400 shrink-0" />
              <select
                value={cityFilter}
                onChange={(e) => {
                  setCityFilter(e.target.value);
                  setPage(1);
                }}
                className="appearance-none bg-transparent pr-6 text-xs text-gray-800 outline-none cursor-pointer"
              >
                <option value="ALL">All Cities</option>
                {uniqueCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>
          </div>

          {/* Specialization Level Selector */}
          <div className="relative">
            <div
              className={`flex items-center gap-1.5 border rounded-xl px-3 py-2 bg-white text-xs font-medium shadow-2xs transition-colors ${
                specLevelFilter !== "ALL"
                  ? "border-[#eed7a1] text-[#9c6c2c] bg-[#fef9ee]"
                  : "border-gray-200 text-gray-800"
              }`}
            >
              <Award size={14} className={specLevelFilter !== "ALL" ? "text-[#b8823a]" : "text-gray-400"} />
              <select
                value={specLevelFilter}
                onChange={(e) => {
                  setSpecLevelFilter(e.target.value);
                  setPage(1);
                }}
                className="appearance-none bg-transparent pr-6 text-xs text-inherit outline-none cursor-pointer font-medium"
              >
                <option value="ALL">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Professional">Professional</option>
              </select>
              <ChevronDown
                size={13}
                className="text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span>Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none border border-gray-200 rounded-xl pl-3 pr-7 py-2 bg-white text-xs font-medium text-gray-800 outline-none cursor-pointer shadow-2xs"
              >
                <option value="latest">Latest</option>
                <option value="rating">Highest Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="name">Name (A–Z)</option>
              </select>
              <ChevronDown
                size={13}
                className="text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Designer Category Quick Pills ── */}
      {selectedRole === 2 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 shrink-0 mr-1">
            Category:
          </span>
          {DESIGNER_SPECIALIZATIONS.map((s) => {
            const isActive = designerSpec === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setDesignerSpec(s.id);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#2d241e] text-white shadow-xs font-semibold"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Results Counter ── */}
      <div className="text-xs sm:text-sm font-bold text-gray-800">
        {filteredUsers.length} Professional{filteredUsers.length === 1 ? "" : "s"} found
      </div>

      {/* ── 2 Cards per Row Grid ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : pageItems.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-gray-200/90 text-xs text-gray-500 flex flex-col items-center gap-3 shadow-xs">
          <ShieldCheck className="text-gray-300" size={44} />
          <h4 className="text-base font-bold text-gray-900 font-serif">
            No professionals found
          </h4>
          <p className="text-gray-500 max-w-sm text-xs">
            Try adjusting your search keywords, role selection, or city filter to discover verified specialists.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedRole("ALL");
              setDesignerSpec("ALL");
              setSpecLevelFilter("ALL");
              setCityFilter("ALL");
            }}
            className="mt-3 px-4 py-2 text-xs font-semibold text-[#b8823a] bg-[#fef9ee] border border-[#eed7a1] rounded-full hover:bg-[#fbf4e8] transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-opacity ${
              isFetching ? "opacity-60" : "opacity-100"
            }`}
          >
            {pageItems.map((user) => (
              <SpecialistCard
                key={user.id}
                user={user}
                onOpen={() =>
                  navigate(`/portfolio/${user.id}`, { state: { user } })
                }
              />
            ))}
          </div>

          {/* ── Bottom Pagination ── */}
          <div className="flex flex-col items-center justify-center gap-2 pt-6">
            {totalPages > 1 && (
              <nav className="flex items-center gap-1.5" aria-label="Pagination">
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
                      className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition shadow-2xs ${
                        n === currentPage
                          ? "bg-[#2d241e] text-white"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
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

            <div className="text-xs text-gray-500 font-medium">
              Showing {totalRecords === 0 ? 0 : pageItems.length} of {totalRecords} professional{totalRecords === 1 ? "" : "s"}
            </div>
          </div>
        </>
      )}
    </div>
  );
}