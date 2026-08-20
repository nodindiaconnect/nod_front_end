import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Loader2,
  Search,
  X,
  Tag,
  Package,
  Heart,
  Star,
  ShieldCheck,
  Award,
  Truck,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Users,
  Building2,
  Quote,
  Navigation,
  RotateCcw,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  useGetPublicProductsQuery,
  useLazySearchLocationsQuery,
} from "./supplyproductsapislice";
import "../theme.css";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 350;

// Single source of truth for the page's horizontal rhythm — every section
// (hero, badges, toolbar/grid, stats) uses this exact container so their
// left/right edges always line up, regardless of section background.
const CONTAINER = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

// Hard safety cap for any text field. Some records can contain accidental
// junk (e.g. pasted code/log dumps) far longer than a real name would ever
// be — this keeps the layout from ever breaking.
const HARD_CAP = { title: 80, tag: 40 };

const clamp = (value, max) => {
  if (!value) return "";
  const str = String(value).trim();
  return str.length > max ? `${str.slice(0, max).trim()}…` : str;
};

const initialsOf = (name) => {
  if (!name) return "?";
  const words = String(name).trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

// Static taxonomy for the sidebar — the API groups by free-text category, so
// this is the canonical list the filter checkboxes are built from.
const CATEGORY_OPTIONS = [
  "Cement & Concrete",
  "Steel & Metal",
  "Bricks & Blocks",
  "Tiles & Stone",
  "Wood & Plywood",
  "Paints & Coatings",
  "Plumbing & Sanitary",
  "Electricals",
];
const CATEGORY_OPTIONS_MORE = ["Hardware & Tools", "Glass & Glazing"];

const SUPPLIER_TYPES = [
  "Manufacturer",
  "Distributor",
  "Wholesaler",
  "Retailer",
];

const TRUST_BADGES = [
  {
    icon: ShieldCheck,
    title: "Verified Suppliers",
    desc: "Background checked & verified",
  },
  {
    icon: Award,
    title: "Quality Assured",
    desc: "Premium materials guarantee",
  },
  {
    icon: Tag,
    title: "Best Prices",
    desc: "Competitive & transparent pricing",
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    desc: "On-time delivery assurance",
  },
];

const STATS = [
  { icon: Users, value: "2,500+", label: "Verified Suppliers" },
  { icon: Building2, value: "75+", label: "Cities Covered" },
  { icon: Package, value: "10,000+", label: "Projects Served" },
  { icon: Star, value: "4.7/5", label: "Average Rating" },
];

// Fallback tags when the record doesn't carry real ones — three per card,
// keeps every card visually complete instead of showing an empty row.
const FALLBACK_TAGS_BY_CATEGORY = {
  "Cement & Concrete": ["Cement", "Concrete", "Building Materials"],
  "Steel & Metal": ["Steel", "Metal", "Construction"],
  "Bricks & Blocks": ["Bricks", "Blocks", "Construction"],
  "Tiles & Stone": ["Tiles", "Stone", "Granite"],
  "Wood & Plywood": ["Plywood", "Wood", "Lumber"],
  "Paints & Coatings": ["Paints", "Coatings", "Wall Care"],
  "Plumbing & Sanitary": ["Plumbing", "Sanitary", "PAN India Delivery"],
  Electricals: ["Electricals", "ISI Certified", "Bulk Discounts"],
  "Hardware & Tools": ["Hardware", "Tools", "Bulk Orders"],
  "Glass & Glazing": ["Glass", "Glazing", "Custom Sizes"],
};
const DEFAULT_TAGS = ["Trusted Supplier", "Quality Assured", "Verified"];

function getTags(product) {
  const category = clamp(product.category, HARD_CAP.tag);
  return FALLBACK_TAGS_BY_CATEGORY[category] || DEFAULT_TAGS;
}

// Deterministic "years in business" fallback when the record doesn't carry
// a real value — keeps it stable per-supplier instead of re-randomizing.
function getYears(supplier, product) {
  const explicit =
    supplier?.experienceYears ??
    supplier?.yearsInBusiness ??
    product.yearsInBusiness;
  if (explicit) return explicit;
  const seed = String(supplier?.name || product.productName || "").length;
  return 3 + (seed % 10);
}

/* ---------------------------------------------------------------------- */
/* Supplier / listing card                                                */
/* ---------------------------------------------------------------------- */

function SupplierCard({ product, supplier, onOpen, listView }) {
  const [saved, setSaved] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const title =
    clamp(supplier?.name || product.productName, HARD_CAP.title) ||
    "Untitled supplier";
  const rating = supplier?.rating ?? product.rating;
  const reviewCount = supplier?._count?.reviews ?? supplier?.reviewCount;
  const isVerified = supplier?.verified !== false;
  const tags = getTags(product).slice(0, 3);
  const cover = (product.images?.[0] || product.thumbnail) ?? null;
  const logo = supplier?.logo || supplier?.avatar || supplier?.image || null;
  const years = getYears(supplier, product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45 }}
      onClick={onOpen}
      className={`group cursor-pointer border border-[var(--border)] bg-[var(--surface)] rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        listView ? "flex flex-col sm:flex-row" : "flex flex-col"
      }`}
    >
      {/* Image */}
      <div
        className={`relative shrink-0 overflow-hidden bg-[var(--background-secondary)] ${
          listView
            ? "w-full h-44 sm:w-52 sm:h-auto md:w-64"
            : "w-full h-40 sm:h-44"
        }`}
      >
        {cover && !imgFailed ? (
          <img
            src={cover}
            alt={title}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={28} className="text-[var(--muted)]" />
          </div>
        )}

        {isVerified && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-white/95 backdrop-blur text-[var(--heading)] text-[10.5px] font-semibold px-2.5 py-1.5 rounded-md shadow-sm">
            <ShieldCheck size={11} className="text-[var(--gold)]" />
            Verified
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSaved((s) => !s);
          }}
          aria-label={saved ? "Remove from favorites" : "Save supplier"}
          className="absolute top-3 right-3 w-8 h-8 rounded-md bg-white/95 backdrop-blur shadow-sm flex items-center justify-center"
        >
          <Heart
            size={13}
            className={
              saved
                ? "fill-[var(--gold)] text-[var(--gold)]"
                : "text-[var(--muted)]"
            }
          />
        </button>
      </div>

      {/* Body */}
      <div className="relative flex flex-col flex-1 px-5 pb-5 min-w-0">
        {/* Avatar — overlaps the image/body seam, like the reference */}
        <div className="-mt-6 mb-2.5">
          <span className="w-12 h-12 rounded-md ring-4 ring-[var(--surface)] bg-[var(--background-secondary)] border border-[var(--border)] flex items-center justify-center text-[12px] font-bold text-[var(--heading)] overflow-hidden shrink-0">
            {logo && !logoFailed ? (
              <img
                src={logo}
                alt={title}
                onError={() => setLogoFailed(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              initialsOf(supplier?.name)
            )}
          </span>
        </div>

        <h3 className="text-[14px] font-bold text-[var(--heading)] leading-snug truncate">
          {title}
        </h3>

        {supplier?.city && (
          <p className="flex items-center gap-1.5 text-[11.5px] text-[var(--muted)] mt-1 mb-2.5">
            <MapPin size={11} className="shrink-0" />
            <span className="truncate">
              {supplier.city}
              {supplier.state ? `, ${supplier.state}` : ""}
            </span>
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-3.5">
          {tags.map((t) => (
            <span
              key={t}
              className="text-[10px] font-medium px-2.5 py-1.5 rounded-md border border-[var(--border)] text-[var(--text)]"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-[12px] mb-3.5">
          {rating != null ? (
            <span className="flex items-center gap-1.5">
              <Star
                size={12}
                className="fill-[var(--gold)] text-[var(--gold)]"
              />
              <span className="font-semibold text-[var(--heading)]">
                {Number(rating).toFixed(1)}
              </span>
              {reviewCount != null && (
                <span className="text-[var(--muted)]">({reviewCount})</span>
              )}
            </span>
          ) : (
            <span />
          )}
          <span className="flex items-center gap-1.5 text-[var(--muted)]">
            <Clock size={11} />
            {years}+ Years
          </span>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="mt-auto w-full h-10 flex items-center justify-center gap-1.5 text-[11.5px] font-semibold tracking-wide rounded-md bg-[var(--heading)] text-[var(--background)] transition-colors group-hover:bg-[var(--gold)]"
        >
          View Details
          <ArrowRight size={13} />
        </button>
      </div>
    </motion.div>
  );
}

function CardSkeleton() {
  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] rounded-xl overflow-hidden animate-pulse">
      <div className="w-full h-40 sm:h-44 bg-[var(--background-secondary)]" />
      <div className="p-5 space-y-2.5">
        <div className="w-12 h-12 rounded-md bg-[var(--background-secondary)] -mt-11 mb-3" />
        <div className="h-3 w-2/3 rounded-md bg-[var(--background-secondary)]" />
        <div className="h-3 w-1/3 rounded-md bg-[var(--background-secondary)]" />
        <div className="h-10 w-full rounded-md bg-[var(--background-secondary)] mt-4" />
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [sortBy, setSortBy] = useState("recommended");
  const [viewMode, setViewMode] = useState("grid");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [showMoreCategories, setShowMoreCategories] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedTypes, setSelectedTypes] = useState(new Set());

  // ---- LOCATION STATE ----
  const [locationQuery, setLocationQuery] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [locationStatus, setLocationStatus] = useState("idle"); // idle | locating | granted | denied
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [searchedNoResults, setSearchedNoResults] = useState(false);
  const [nearMeError, setNearMeError] = useState("");

  const debounceRef = useRef(null);
  const searchBoxRef = useRef(null);
  const requestSeqRef = useRef(0);

  const [triggerSearch, { isFetching: isSearchingLocations }] =
    useLazySearchLocationsQuery();

  const locationResolved =
    locationStatus === "granted" ||
    locationStatus === "denied" ||
    locationStatus === "locating";

  useEffect(() => {
    setLocationStatus("denied");
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleSearchInput = useCallback(
    (value) => {
      setSearchInput(value);
      setActiveSuggestionIndex(-1);
      if (debounceRef.current) clearTimeout(debounceRef.current);

      const trimmed = value.trim();
      if (trimmed.length < MIN_QUERY_LENGTH) {
        setSuggestions([]);
        setShowSuggestions(false);
        setSearchedNoResults(false);
        return;
      }

      const thisRequestId = ++requestSeqRef.current;
      debounceRef.current = setTimeout(async () => {
        const res = await triggerSearch(trimmed);
        if (thisRequestId !== requestSeqRef.current) return;
        const results = res?.data?.data || [];
        setSuggestions(results);
        setShowSuggestions(true);
        setSearchedNoResults(results.length === 0);
      }, DEBOUNCE_MS);
    },
    [triggerSearch],
  );

  const selectSuggestion = (s) => {
    setLocationLabel(s.displayName);
    setSearchInput(s.displayName);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    setLocationStatus("granted");
    setLocationQuery(s.displayName);
    setPage(1);
  };

  const clearLocation = () => {
    setLocationQuery("");
    setLocationLabel("");
    setSearchInput("");
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    setSearchedNoResults(false);
    setNearMeError("");
    setLocationStatus("denied");
    setPage(1);
  };

  // ---- "Near me" — browser geolocation + free reverse-geocode lookup ----
  const useNearMe = () => {
    if (!navigator.geolocation) {
      setNearMeError("Location isn't supported on this device.");
      return;
    }
    setNearMeError("");
    setLocationStatus("locating");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );
          const data = await res.json();
          const label = [data.city || data.locality, data.principalSubdivision]
            .filter(Boolean)
            .join(", ");
          if (label) {
            setLocationLabel(label);
            setSearchInput(label);
            setLocationQuery(label);
            setLocationStatus("granted");
            setPage(1);
          } else {
            setNearMeError("Couldn't detect your area. Try searching instead.");
            setLocationStatus("denied");
          }
        } catch {
          setNearMeError("Couldn't detect your area. Try searching instead.");
          setLocationStatus("denied");
        }
      },
      () => {
        setNearMeError("Location access was denied.");
        setLocationStatus("denied");
      },
    );
  };

  const handleSearchKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex(
        (prev) => (prev - 1 + suggestions.length) % suggestions.length,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (
        activeSuggestionIndex >= 0 &&
        activeSuggestionIndex < suggestions.length
      ) {
        selectSuggestion(suggestions[activeSuggestionIndex]);
      } else if (searchInput.trim().length >= MIN_QUERY_LENGTH) {
        setLocationLabel(searchInput.trim());
        setLocationQuery(searchInput.trim());
        setLocationStatus("granted");
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        setPage(1);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    }
  };

  // ---- PRODUCTS QUERY (single page at a time — powers numbered pagination) ----
  const queryBody = {
    page,
    limit: perPage,
    ...(locationQuery && { locationQuery }),
  };

  const {
    data: res,
    isLoading,
    isFetching,
    error,
  } = useGetPublicProductsQuery(queryBody, {
    skip: !locationResolved || locationStatus === "locating",
  });

  const products = res?.data?.products || [];
  const suppliers = res?.data?.suppliers || [];
  const totalPages = res?.data?.totalPages || 1;
  const totalCount = res?.data?.total ?? totalPages * perPage;

  const getSupplier = (supplierId) =>
    suppliers.find((s) => s.id === supplierId);

  // Reset to page 1 whenever perPage or location changes.
  useEffect(() => {
    setPage(1);
  }, [perPage, locationQuery]);

  // ---- Client-side category / type filter + sort (applied to current page) ----
  const visibleProducts = useMemo(() => {
    let list = products.filter((p) => {
      const category = clamp(p.category, HARD_CAP.tag);
      if (selectedCategories.size > 0 && !selectedCategories.has(category))
        return false;
      if (selectedTypes.size > 0) {
        const supplier = getSupplier(p.supplierId);
        const type = clamp(supplier?.type || p.supplierType, HARD_CAP.tag);
        if (!selectedTypes.has(type)) return false;
      }
      return true;
    });

    if (sortBy === "name") {
      list = [...list].sort((a, b) => {
        const an = getSupplier(a.supplierId)?.name || a.productName || "";
        const bn = getSupplier(b.supplierId)?.name || b.productName || "";
        return an.localeCompare(bn);
      });
    } else if (sortBy === "rating") {
      list = [...list].sort((a, b) => {
        const ar = getSupplier(a.supplierId)?.rating ?? 0;
        const br = getSupplier(b.supplierId)?.rating ?? 0;
        return br - ar;
      });
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, suppliers, selectedCategories, selectedTypes, sortBy]);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const toggleType = (type) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });
  };

  const clearAllFilters = () => {
    setSelectedCategories(new Set());
    setSelectedTypes(new Set());
  };

  const hasActiveFilters =
    selectedCategories.size > 0 || selectedTypes.size > 0;

  const openProduct = (productId) => navigate(`/products/${productId}`);

  // Pagination page numbers (compact with ellipsis for large totalPages)
  const pageNumbers = useMemo(() => {
    const span = 2;
    const pages = new Set([1, totalPages, page]);
    for (let i = page - span; i <= page + span; i++) {
      if (i > 0 && i <= totalPages) pages.add(i);
    }
    return [...pages].sort((a, b) => a - b);
  }, [page, totalPages]);

  const rangeStart = totalCount === 0 ? 0 : (page - 1) * perPage + 1;
  const rangeEnd = Math.min(page * perPage, totalCount);

  if ((isLoading || locationStatus === "locating") && page === 1) {
    return (
      <section className="py-24 md:py-36 text-center">
        <Loader2
          className="mx-auto mb-3 animate-spin text-[var(--gold)]"
          size={28}
        />
        <p className="text-[var(--muted)] font-[var(--font-body)]">
          Loading suppliers...
        </p>
      </section>
    );
  }

  if (error && page === 1) {
    return (
      <section className="py-24 md:py-36 text-center">
        <p className="text-[var(--danger)] font-[var(--font-body)]">
          Failed to load suppliers.
        </p>
      </section>
    );
  }

  return (
    <section
      id="products"
      className="relative bg-[var(--background-secondary)] overflow-x-hidden"
    >
      {/* ------------------------------------------------------------ */}
      {/* Hero — contained within the same page grid as every other    */}
      {/* section below, so its left/right edges always line up.       */}
      {/* Kept compact (no big top/bottom air) to match the reference. */}
      {/* ------------------------------------------------------------ */}
      <div className="relative bg-[var(--background-secondary)] overflow-hidden">
        {/* Background photo — blended into the header itself (not a separate
                    boxed column). A gradient wash keeps the left-side text readable
                    and fades the image into the section's own background color so
                    there's no visible seam or "card" edge. */}
        <div className="absolute inset-0">
          <img
            src="https://www.greenply.com:5001/originalfile1769165379328-6117.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[var(--background-secondary)]/5" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--background-secondary)] via-[var(--background-secondary)]/90 to-transparent lg:via-[var(--background-secondary)]/60" />
        </div>

        <div className={`${CONTAINER} relative py-6 sm:py-8 lg:py-10`}>
          <div className="max-w-xl">
            <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--gold)] font-semibold mb-3 block">
              Trusted Marketplace
            </span>
            <h2 className="text-[28px] sm:text-[34px] lg:text-[40px] font-extrabold text-[var(--heading)] leading-[1.1] font-[var(--font-heading)] mb-3 max-w-lg">
              Find Trusted Material Suppliers
            </h2>
            <p className="max-w-md text-[13.5px] md:text-sm text-[var(--muted)] font-[var(--font-body)] leading-relaxed mb-6">
              Connect with verified suppliers for premium construction and
              interior materials for your dream projects.
            </p>

            {/* ---- Search bar ---- */}
            <div ref={searchBoxRef} className="relative w-full max-w-lg">
              <div className="bg-[var(--background-secondary)] p-2.5 shadow-sm">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="flex-1 h-11 flex items-center gap-2 bg-[var(--surface)] px-3.5 min-w-0 focus-within:ring-1 focus-within:ring-[var(--gold)] transition-colors">
                    <Search
                      size={16}
                      className="text-[var(--muted)] shrink-0"
                    />

                    <input
                      value={searchInput}
                      onChange={(e) => handleSearchInput(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      onFocus={() =>
                        suggestions.length > 0 && setShowSuggestions(true)
                      }
                      placeholder="Search state, city, area, or pincode..."
                      className="flex-1 outline-none bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--muted)] font-[var(--font-body)] min-w-0"
                      aria-autocomplete="list"
                      aria-expanded={showSuggestions}
                    />

                    {isSearchingLocations && (
                      <Loader2
                        size={14}
                        className="animate-spin text-[var(--muted)] shrink-0"
                      />
                    )}

                    {(searchInput || locationQuery) &&
                      !isSearchingLocations && (
                        <button
                          onClick={clearLocation}
                          aria-label="Clear location"
                          className="shrink-0"
                        >
                          <X
                            size={14}
                            className="text-[var(--muted)] hover:text-[var(--danger)] transition-colors"
                          />
                        </button>
                      )}
                  </div>

                  <button
                    type="button"
                    onClick={useNearMe}
                    disabled={locationStatus === "locating"}
                    className="h-11 flex items-center justify-center gap-1.5 shrink-0 bg-[var(--surface)] px-4 text-[12.5px] font-semibold text-[var(--heading)] hover:text-[var(--gold)] transition-colors disabled:opacity-60"
                  >
                    {locationStatus === "locating" ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Navigation size={14} />
                    )}
                    Near me
                  </button>
                </div>

                <div className="mt-2.5 min-h-[16px] text-xs text-left font-[var(--font-body)]">
                  {nearMeError && (
                    <span className="text-[var(--danger)]">{nearMeError}</span>
                  )}

                  {!nearMeError && (
                    <span className="text-[var(--muted)]">
                      Showing{" "}
                      <span className="font-semibold text-[var(--gold)]">
                        {totalCount.toLocaleString("en-IN")}
                      </span>{" "}
                      suppliers in{" "}
                      <span className="font-semibold text-[var(--gold)]">
                        {locationLabel || "All India"}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-30 top-full left-0 right-0 bg-[var(--surface)] mt-1.5 max-h-60 overflow-y-auto shadow-lg">
                  {suggestions.map((s, i) => (
                    <li
                      key={`${s.displayName}-${i}`}
                      onClick={() => selectSuggestion(s)}
                      onMouseEnter={() => setActiveSuggestionIndex(i)}
                      className={`flex items-start gap-2 px-3.5 py-3 text-sm cursor-pointer transition-colors ${
                        i === activeSuggestionIndex
                          ? "bg-[var(--background-secondary)]"
                          : "hover:bg-[var(--background-secondary)]"
                      }`}
                    >
                      <MapPin
                        size={14}
                        className="text-[var(--gold)] shrink-0 mt-0.5"
                      />

                      <span className="text-[var(--text)] font-[var(--font-body)] leading-snug">
                        {s.displayName}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {showSuggestions &&
                suggestions.length === 0 &&
                searchedNoResults &&
                !isSearchingLocations && (
                  <ul className="absolute z-30 top-full left-0 right-0 bg-[var(--surface)] mt-1.5 shadow-lg">
                    <li className="px-3.5 py-3 text-sm text-[var(--muted)] font-[var(--font-body)]">
                      No locations found for "{searchInput}"
                    </li>
                  </ul>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Trust badges                                                  */}
      {/* ------------------------------------------------------------ */}
      <div className="border-y border-[var(--border)]">
        <div className={`${CONTAINER} py-5`}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-4 sm:divide-x sm:divide-[var(--border)]">
            {TRUST_BADGES.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className={`flex items-center gap-3.5 ${i > 0 ? "sm:pl-5" : ""}`}
              >
                <span className="shrink-0 w-11 h-11 rounded-md flex items-center justify-center bg-[var(--gold)]/12">
                  <Icon size={18} className="text-[var(--gold)]" />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-[var(--heading)] leading-snug">
                    {title}
                  </p>
                  <p className="text-[11.5px] text-[var(--muted)] leading-snug truncate">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`${CONTAINER} py-8 sm:py-10`}>
        {/* ---- Toolbar ---- */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsFiltersOpen((o) => !o)}
              className="lg:hidden h-10 flex items-center gap-2 border border-[var(--border)] bg-[var(--surface)] rounded-md px-4 text-[12.5px] font-semibold text-[var(--heading)]"
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>
            <p className="text-[12.5px] text-[var(--muted)]">
              Showing{" "}
              <span className="font-semibold text-[var(--heading)]">
                {rangeStart}–{rangeEnd}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[var(--heading)]">
                {totalCount.toLocaleString("en-IN")}
              </span>{" "}
              suppliers
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* <label className="flex items-center gap-2.5 text-[12.5px] text-[var(--muted)]">
              <span className="hidden sm:inline">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 appearance-none border border-[var(--border)] bg-[var(--surface)] rounded-md pl-3 pr-8 text-[12.5px] text-[var(--text)]"
                >
                  <option value="recommended">Recommended</option>
                  <option value="rating">Rating: High to Low</option>
                  <option value="name">Name: A–Z</option>
                </select>
                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                />
              </div>
            </label> */}

            <div className="h-10 flex items-center border border-[var(--border)] rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className={`h-full w-10 flex items-center justify-center ${viewMode === "grid" ? "bg-[var(--gold)]/15 text-[var(--gold)]" : "text-[var(--muted)]"}`}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className={`h-full w-10 flex items-center justify-center border-l border-[var(--border)] ${viewMode === "list" ? "bg-[var(--gold)]/15 text-[var(--gold)]" : "text-[var(--muted)]"}`}
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* ---- Filters sidebar ---- */}
          <aside className={`${isFiltersOpen ? "block" : "hidden"} lg:block`}>
            <div className="border border-[var(--border)] bg-[var(--surface)] rounded-xl p-6 space-y-7 lg:sticky lg:top-6">
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-bold text-[var(--heading)]">
                  Filters
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="flex items-center gap-1 text-[11.5px] font-semibold text-[var(--muted)] hover:text-[var(--gold)] transition-colors"
                  >
                    <RotateCcw size={11} />
                    Reset
                  </button>
                )}
              </div>

              <div>
                <p className="text-[13px] font-bold text-[var(--heading)] mb-3.5">
                  Categories
                </p>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2.5 text-[12.5px] text-[var(--text)]">
                    <input
                      type="checkbox"
                      checked={selectedCategories.size === 0}
                      onChange={clearAllFilters}
                      className="accent-[var(--gold)] rounded-sm"
                    />
                    All Categories
                  </label>
                  {[
                    ...CATEGORY_OPTIONS,
                    ...(showMoreCategories ? CATEGORY_OPTIONS_MORE : []),
                  ].map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-2.5 text-[12.5px] text-[var(--text)]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.has(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="accent-[var(--gold)] rounded-sm"
                      />
                      {cat}
                    </label>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowMoreCategories((s) => !s)}
                    className="flex items-center gap-1 text-[12px] font-semibold text-[var(--gold)] pt-1"
                  >
                    {showMoreCategories ? "View less" : "View more"}
                    <ChevronDown
                      size={12}
                      className={showMoreCategories ? "rotate-180" : ""}
                    />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[13px] font-bold text-[var(--heading)] mb-3.5">
                  Location
                </p>
                <div className="relative">
                  <select
                    value={locationLabel || "All India"}
                    onChange={(e) => {
                      if (e.target.value === "All India") {
                        clearLocation();
                      } else {
                        setLocationLabel(e.target.value);
                        setSearchInput(e.target.value);
                        setLocationQuery(e.target.value);
                        setLocationStatus("granted");
                        setPage(1);
                      }
                    }}
                    className="w-full h-10 appearance-none border border-[var(--border)] rounded-md pl-3.5 pr-8 text-[12.5px] text-[var(--text)] bg-[var(--background)]"
                  >
                    <option>All India</option>
                    <option>Maharashtra</option>
                    <option>Karnataka</option>
                    <option>Telangana</option>
                    <option>Delhi</option>
                    <option>West Bengal</option>
                    <option>Tamil Nadu</option>
                    <option>Gujarat</option>
                  </select>
                  <ChevronDown
                    size={13}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />
                </div>
              </div>

              <div>
                <p className="text-[13px] font-bold text-[var(--heading)] mb-3.5">
                  Supplier Type
                </p>
                <div className="space-y-2.5">
                  {SUPPLIER_TYPES.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2.5 text-[12.5px] text-[var(--text)]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.has(type)}
                        onChange={() => toggleType(type)}
                        className="accent-[var(--gold)] rounded-sm"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFiltersOpen(false)}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-md text-[12px] font-semibold tracking-wide bg-[var(--heading)] text-[var(--background)]"
              >
                Apply Filters
                <SlidersHorizontal size={13} />
              </button>
            </div>
          </aside>

          {/* ---- Results ---- */}
          <div>
            {!visibleProducts.length && !isFetching ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 border border-dashed border-[var(--border)] rounded-xl">
                <Package size={28} className="text-[var(--muted)]" />
                <p className="text-center text-sm text-[var(--muted)] font-[var(--font-body)]">
                  No suppliers match your filters.
                </p>
              </div>
            ) : (
              <>
                <div
                  className={`grid gap-5 sm:gap-6 transition-opacity ${isFetching ? "opacity-60" : "opacity-100"} ${
                    viewMode === "list"
                      ? "grid-cols-1"
                      : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                  }`}
                >
                  {isFetching && page === 1
                    ? Array.from({ length: perPage }).map((_, i) => (
                        <CardSkeleton key={i} />
                      ))
                    : visibleProducts.map((product) => (
                        <SupplierCard
                          key={product.id}
                          product={product}
                          supplier={getSupplier(product.supplierId)}
                          onOpen={() => openProduct(product.id)}
                          listView={viewMode === "list"}
                        />
                      ))}
                </div>

                {/* ---- Pagination ---- */}
                <div className="flex flex-wrap items-center justify-between gap-4 mt-12 pt-6 border-t border-[var(--border)]">
                  <p className="text-[12.5px] text-[var(--muted)]">
                    Showing {rangeStart} to {rangeEnd} of{" "}
                    {totalCount.toLocaleString("en-IN")} suppliers
                  </p>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1 || isFetching}
                      className="w-9 h-9 flex items-center justify-center rounded-md border border-[var(--border)] text-[var(--text)] disabled:opacity-40"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    {pageNumbers.map((n, i) => {
                      const prev = pageNumbers[i - 1];
                      const showEllipsis = prev != null && n - prev > 1;
                      return (
                        <span key={n} className="flex items-center gap-1.5">
                          {showEllipsis && (
                            <span className="text-[var(--muted)] text-[12.5px] px-1">
                              …
                            </span>
                          )}
                          <button
                            onClick={() => setPage(n)}
                            className={`w-9 h-9 rounded-md text-[12.5px] font-medium transition-colors ${
                              n === page
                                ? "bg-[var(--gold)] text-[var(--background)]"
                                : "border border-[var(--border)] text-[var(--text)] hover:border-[var(--gold)]"
                            }`}
                          >
                            {n}
                          </button>
                        </span>
                      );
                    })}
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page >= totalPages || isFetching}
                      className="w-9 h-9 flex items-center justify-center rounded-md border border-[var(--border)] text-[var(--text)] disabled:opacity-40"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>

                  <label className="flex items-center gap-2.5 text-[12.5px] text-[var(--muted)]">
                    Show
                    <div className="relative">
                      <select
                        value={perPage}
                        onChange={(e) => setPerPage(Number(e.target.value))}
                        className="h-9 appearance-none border border-[var(--border)] rounded-md pl-3 pr-8 text-[12.5px] text-[var(--text)] bg-[var(--surface)]"
                      >
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                        <option value={48}>48</option>
                      </select>
                      <ChevronDown
                        size={13}
                        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                      />
                    </div>
                    per page
                  </label>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Stats bar                                                     */}
      {/* ------------------------------------------------------------ */}
      <div className={`${CONTAINER} pb-12 sm:pb-14`}>
        <div className="rounded-xl border border-[var(--gold)]/25 bg-[var(--gold)]/8 px-6 sm:px-8 py-7 flex flex-wrap items-center gap-8">
          <div className="flex items-start gap-3.5 max-w-xs">
            <span className="shrink-0 w-11 h-11 rounded-md flex items-center justify-center bg-[var(--gold)] text-[var(--background)]">
              <Quote size={16} />
            </span>
            <p className="text-[13px] leading-relaxed text-[var(--text)]">
              We connect you with verified suppliers so you get{" "}
              <span className="font-semibold text-[var(--gold)]">
                quality materials
              </span>
              , on time, every time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-10 gap-y-5 flex-1">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon size={18} className="text-[var(--gold)]" />
                <div>
                  <p className="text-[15px] font-bold text-[var(--heading)] leading-none">
                    {value}
                  </p>
                  <p className="text-[11px] text-[var(--muted)] mt-1">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start gap-2.5 lg:ml-auto">
            <p className="text-[12.5px] text-[var(--text)] leading-snug">
              Are you a supplier? <br /> Join our network and grow your
              business.
            </p>
            <button
              type="button"
              className="h-9 flex items-center gap-1.5 border border-[var(--gold)] text-[var(--gold)] text-[11.5px] font-semibold px-4 rounded-md hover:bg-[var(--gold)] hover:text-[var(--background)] transition-colors"
            >
              Become a Supplier
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
