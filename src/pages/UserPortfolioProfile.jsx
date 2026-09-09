import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Briefcase,
  ChevronRight,
  Cpu,
  Flag,
  Folder,
  Globe2,
  Home,
  Layers,
  MapPin,
  MessageCircle,
  Package,
  Send,
  Share2,
  UserPlus,
  Star,
  Award,
  MessageSquare,
  Clock,
} from "lucide-react";
import { CURRENCY_SYMBOLS } from "../Authentication/Authshared";
import {
  useGetUserPortfolioQuery,
  useGetUserPerformanceQuery,
} from "./supplyproductsapislice";
import { useGetUserReviewsQuery } from "../ApiSliceComponent/reviewApiSlice";
import ReviewsBreakdown from "../components/dashboard/shared/ReviewsBreakdown";
import ReviewCard from "../components/dashboard/shared/ReviewCard";
import ProfessionalPerformanceSection from "../components/profile/ProfessionalPerformanceSection";

const ROLE_LABELS = {
  1: "Client",
  2: "Designer",
  3: "Architect",
  4: "Contractor",
  5: "Material Supplier",
};

// Shown on the hero's right side when the professional hasn't uploaded any
// project photos yet, so the header never looks empty.
const DEFAULT_COVER_IMAGE =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80&auto=format&fit=crop";

const TABS = ["Performance", "Projects", "About", "Experience", "Reviews"];
const BIO_PREVIEW_LENGTH = 160;

function safeParseProfile(profile) {
  if (!profile) return {};
  if (typeof profile === "object") return profile;
  try {
    return JSON.parse(profile) || {};
  } catch {
    return {};
  }
}

function normaliseUser(rawUser) {
  if (!rawUser) return null;
  return {
    ...rawUser,
    profile: safeParseProfile(rawUser.profile),
    posts: rawUser.posts || [],
    followers: rawUser.followers || [],
    _count: rawUser._count || {},
  };
}

export default function UserPortfolioProfile() {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Performance");
  const [bioExpanded, setBioExpanded] = useState(false);
  const [failedImages, setFailedImages] = useState({});

  // The card the person clicked already has the full user object — use it
  // immediately, and only hit the API if we landed here directly (refresh / shared link).
  const passedUser = location.state?.user;
  const { data, isLoading } = useGetUserPortfolioQuery(userId, {
    skip: !!passedUser,
  });

  const { data: performanceRes, isLoading: loadingPerformance } = useGetUserPerformanceQuery(userId, {
    skip: !userId,
  });

  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsStarFilter, setReviewsStarFilter] = useState(null);

  const {
    data: reviewsRes,
    isLoading: loadingReviews,
    refetch: refetchReviews,
  } = useGetUserReviewsQuery(
    { userId, page: reviewsPage, limit: 10 },
    { skip: !userId }
  );

  const userReviews = reviewsRes?.data?.reviews || [];
  const reviewSummary = reviewsRes?.data?.summary || {};
  const reviewPagination = reviewsRes?.data?.pagination;

  const apiProjects = data?.data || [];
  const apiUser = data?.user;
  const rawUser = passedUser || apiUser;
  const user = useMemo(() => normaliseUser(rawUser), [rawUser]);
  const projects = apiProjects.length ? apiProjects : user?.posts || [];
  const performanceData = performanceRes?.data || null;


  if (isLoading && !user) {
    return (
      <main className="min-h-screen bg-white text-[#1c1712] font-sans">
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-52 bg-[#f1e9dc] rounded" />
            <div className="h-[320px] bg-[#f7f2ea] rounded-[20px]" />
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
              <div className="h-64 bg-[#f7f2ea] rounded-2xl" />
              <div className="h-64 bg-[#f7f2ea] rounded-2xl" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-white text-[#1c1712] font-sans">
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
          <h1 className="text-xl font-semibold mb-2">Profile not found</h1>
          <p className="text-[#8a8479] text-sm mb-6">
            This portfolio doesn't exist or may have been removed.
          </p>
          <button
            type="button"
            onClick={() => navigate("/explore")}
            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-[10px] bg-[#b8823a] text-white hover:bg-[#9c6c2c]"
          >
            Back to Explore portfolios
          </button>
        </section>
      </main>
    );
  }

  const { profile } = user;
  const roleLabel = ROLE_LABELS[user.role] || "Professional";
  const initials = user.name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  const cover = projects[0]?.images?.[0] || profile.photos?.[0];
  const projectCount = user._count?.posts ?? projects.length;
  const followerCount = user._count?.followers ?? user.followers?.length ?? 0;
  const followingCount = user._count?.following ?? 0;

  const skills = [profile.software, ...(profile.skills || [])].filter(Boolean);
  const bio = profile.bio || "";
  const bioIsLong = bio.length > BIO_PREVIEW_LENGTH;
  const bioText =
    bioExpanded || !bioIsLong ? bio : `${bio.slice(0, BIO_PREVIEW_LENGTH)}…`;

  const specLevel =
    profile.specializationLevel ||
    user.specializationLevel ||
    user.designer?.specializationLevel ||
    (profile.experience >= 6 ? "Professional" : profile.experience >= 3 ? "Intermediate" : profile.experience != null ? "Beginner" : null);

  const currencyCode = profile.currency || user.currency || "INR";
  const currencySymbol = CURRENCY_SYMBOLS[currencyCode] || currencyCode || "₹";
  const rateVal = profile.rate || user.rate;

  const aboutRows = [
    profile.specialization && {
      icon: Layers,
      label: "Specialization",
      value: profile.specialization,
    },
    specLevel && {
      icon: Award,
      label: "Specialization Level",
      value: specLevel,
    },
    rateVal && {
      icon: Clock,
      label: "Hourly Rate",
      value: `${currencySymbol}${rateVal} / hr`,
    },
    profile.software && {
      icon: Cpu,
      label: "Software",
      value: profile.software,
    },
    profile.experience != null && {
      icon: Briefcase,
      label: "Experience",
      value: `${profile.experience} Years`,
    },
    user.country && { icon: Globe2, label: "Country", value: user.country },
    user.state && { icon: Flag, label: "State", value: user.state },
    user.city && { icon: Home, label: "City", value: user.city },
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-white text-[#1c1712] font-sans">
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-20">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-[13.5px] text-[#8a8479] mb-5"
          aria-label="Breadcrumb"
        >
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center"
          >
            <Home size={16} />
          </button>
          <ChevronRight size={14} />
          <button type="button" onClick={() => navigate("/explore")}>
            Explore portfolios
          </button>
          <ChevronRight size={14} />
          <span className="text-[#1c1712] font-medium">{user.name}</span>
        </nav>

        {/* Hero */}
        <section className="relative rounded-[16px] overflow-hidden min-h-[200px] md:min-h-[220px] bg-[#f7f2ea]">
          {/* Background photo, bleeding in from the right and fading into the cream tone */}
          <img
            src={cover || DEFAULT_COVER_IMAGE}
            alt={cover ? `${user.name}'s work` : "Interior design inspiration"}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              if (e.currentTarget.src !== DEFAULT_COVER_IMAGE)
                e.currentTarget.src = DEFAULT_COVER_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f7f2ea] via-[#f7f2ea]/90 sm:via-[#f7f2ea]/80 to-[#f7f2ea]/0" />

          {/* Content */}
          <div className="relative flex flex-col sm:flex-row gap-4 p-4 sm:p-6 items-start">
            <div className="flex-shrink-0 w-[62px] h-[62px] rounded-full border-2 border-white bg-white flex items-center justify-center font-serif text-lg font-bold shadow-md overflow-hidden">
              {profile.avatar && !failedImages.avatar ? (
                <img
                  src={profile.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={() =>
                    setFailedImages((c) => ({ ...c, avatar: true }))
                  }
                />
              ) : (
                initials || "?"
              )}
            </div>
            <div className="flex-1 min-w-0 max-w-[520px]">
              <h1 className="font-serif text-lg mb-0.5">{user.name}</h1>
              {user.username && (
                <p className="text-[#8a8479] text-xs mb-2">@{user.username}</p>
              )}
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#55504a] mb-2">
                {user.city && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={12} />{" "}
                    {[user.city, user.state, user.country]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                )}
                <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full font-medium">
                  <Layers size={11} /> {roleLabel}
                </span>
                {specLevel && (
                  <span className="flex items-center gap-1 bg-[#fef9ee] border border-[#eed7a1] text-[#9c6c2c] px-2.5 py-1 rounded-full font-medium text-xs shadow-2xs">
                    <Award size={11} className="text-[#b8823a]" /> {specLevel}
                  </span>
                )}
                {rateVal && (
                  <span className="flex items-center gap-1 bg-[#edf7ee] border border-[#c4e3c7] text-[#2d6a36] px-2.5 py-1 rounded-full font-medium text-xs shadow-2xs">
                    <Clock size={11} className="text-[#2d6a36]" /> {currencySymbol}{rateVal}/hr
                  </span>
                )}
                {reviewSummary.totalReviews > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("Reviews")}
                    className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200/80 px-2.5 py-0.5 rounded-full font-bold cursor-pointer hover:bg-amber-100 transition shadow-xs text-xs"
                  >
                    <Star size={11} className="fill-amber-400 text-amber-500" />
                    <span>{reviewSummary.averageRating?.toFixed(1) || "5.0"}</span>
                    <span className="text-[10px] font-normal text-amber-700">
                      ({reviewSummary.totalReviews})
                    </span>
                  </button>
                )}
              </div>
              {bio && (
                <div className="grid grid-cols-[72px_1fr] gap-6 items-start mb-5">
                  {/* BIO Heading */}
                  <div>
                    <span className="text-[13px] font-bold tracking-wide text-[var(--gold-hover)]">
                      BIO
                    </span>
                  </div>

                  {/* Bio Content */}
                  <p className="text-[13px] text-[var(--text)] leading-6 m-0">
                    {bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 mt-7 items-start">
          {/* Sidebar */}
          <aside className="flex flex-col sm:flex-row lg:flex-col gap-5 lg:sticky lg:top-6">
            {aboutRows.length > 0 && (
              <div className="flex-1 min-w-[260px] bg-white border border-[var(--border)] rounded-2xl p-5.5 shadow-xs">
                <h2 className="text-base font-bold pb-3 mb-1 border-b-2 border-[var(--gold)]/30 text-[var(--heading)]" style={{ fontFamily: "var(--font-heading)" }}>
                  About
                </h2>
                {aboutRows.map((row, i) => {
                  const Icon = row.icon;
                  const isLast = i === aboutRows.length - 1;
                  return (
                    <div
                      key={row.label}
                      className={`flex gap-3 py-3.5 ${isLast ? "" : "border-b border-[var(--border)]"}`}
                    >
                      <Icon
                        size={16}
                        className="text-[var(--primary)] flex-shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-[12.5px] text-[var(--muted)] mb-0.5">
                          {row.label}
                        </p>
                        <strong className="text-[14.5px] font-semibold text-[var(--heading)]">
                          {row.value}
                        </strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {skills.length > 0 && (
              <div className="flex-1 min-w-[260px] bg-white border border-[var(--border)] rounded-2xl p-5.5 shadow-xs">
                <h2 className="text-base font-bold pb-3 mb-3 border-b-2 border-[var(--gold)]/30 text-[var(--heading)]" style={{ fontFamily: "var(--font-heading)" }}>
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="bg-[var(--background-secondary)] text-[var(--heading)] text-[13px] font-medium px-3.5 py-1.5 rounded-full border border-[var(--border)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Main */}
          <div className="flex flex-col gap-5">
            <div className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden shadow-xs">
              <div
                className="flex gap-7 px-6 border-b border-[var(--border)] overflow-x-auto"
                role="tablist"
              >
                {TABS.map((tab) => {
                  const isSupplier = Number(user.role) === 5;
                  const tabLabel =
                    tab === "Projects"
                      ? isSupplier
                        ? `Materials & Products (${projectCount})`
                        : `Projects (${projectCount})`
                      : tab === "Reviews"
                      ? `Reviews (${reviewSummary.totalReviews ?? userReviews.length})`
                      : tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-[14.5px] font-semibold py-4.5 whitespace-nowrap border-b-2 -mb-px transition cursor-pointer ${
                        activeTab === tab
                          ? "text-[var(--heading)] border-[var(--primary)]"
                          : "text-[var(--muted)] border-transparent hover:text-[var(--heading)]"
                      }`}
                    >
                      {tabLabel}
                    </button>
                  );
                })}
              </div>

              <div className="p-6 sm:p-8">
                {activeTab === "Performance" && (
                  <ProfessionalPerformanceSection
                    performanceData={performanceData}
                    role={user.role}
                    user={user}
                    portfolioPosts={projects}
                    reviews={userReviews}
                  />
                )}

                {activeTab === "Projects" &&
                  (projects.length === 0 ? (
                    <div className="flex flex-col items-center text-center py-10 px-5">
                      <div className="w-14 h-14 rounded-full bg-[var(--background-secondary)] flex items-center justify-center text-[var(--primary)] mb-4.5">
                        <Folder size={28} />
                      </div>
                      <h3 className="text-[17px] font-bold text-[var(--heading)] mb-1.5" style={{ fontFamily: "var(--font-heading)" }}>
                        {Number(user.role) === 5
                          ? "No materials or products listed yet"
                          : "No projects added yet"}
                      </h3>
                      <p className="text-sm text-[var(--muted)] mb-5">
                        {Number(user.role) === 5
                          ? "This supplier has not added any catalog items to their showcase."
                          : "This professional has not added any portfolio projects."}
                      </p>
                      <button
                        type="button"
                        className="text-sm font-semibold px-5 py-2.5 rounded-[10px] bg-white border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--background-secondary)] transition cursor-pointer"
                      >
                        Be the first to connect
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {projects.map((project) => {
                        const image = project.images?.[0];
                        return (
                          <button
                            key={project.id}
                            type="button"
                            onClick={() => {
                              if (project.isProduct) {
                                navigate(`/products/${project.id}`);
                              } else {
                                navigate(
                                  `/portfolio/${userId}/project/${project.id}`,
                                  {
                                    state: { user, project, projects },
                                  },
                                );
                              }
                            }}
                            className="group text-left flex flex-col"
                          >
                            <div className="relative aspect-square rounded-[10px] overflow-hidden bg-[var(--background-secondary)] border border-[var(--border)]">
                              {image && !failedImages[project.id] ? (
                                <img
                                  src={image}
                                  alt={project.title || "Project"}
                                  onError={() =>
                                    setFailedImages((c) => ({
                                      ...c,
                                      [project.id]: true,
                                    }))
                                  }
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[var(--primary)] font-serif text-2xl">
                                  {project.title?.[0] || "P"}
                                </div>
                              )}
                              {project.price != null && (
                                <span className="absolute bottom-1.5 left-1.5 bg-black/75 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                                  ₹{project.price}{project.unit ? ` / ${project.unit}` : ""}
                                </span>
                              )}
                            </div>
                            <p className="text-[13px] font-medium mt-1.5 truncate text-[var(--heading)]">
                              {project.title || "Untitled"}
                            </p>
                            {project.category && (
                              <p className="text-[11px] text-[var(--muted)] truncate">
                                {project.category} {project.brand ? `• ${project.brand}` : ""}
                              </p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}

                {activeTab === "About" && (
                  <p className="text-[14.5px] leading-relaxed text-[#55504a]">
                    {bio || "No details added yet."}
                  </p>
                )}

                {activeTab === "Experience" && (
                  <p className="text-[14.5px] leading-relaxed text-[#55504a]">
                    {profile.experience != null
                      ? `${profile.experience} year${profile.experience === 1 ? "" : "s"} of experience.`
                      : "No experience details added yet."}
                  </p>
                )}

                {activeTab === "Reviews" && (
                  <div className="space-y-6">
                    {loadingReviews ? (
                      <div className="py-12 text-center text-xs text-[#8a8479]">
                        Loading client reviews...
                      </div>
                    ) : userReviews.length === 0 ? (
                      <div className="flex flex-col items-center text-center py-12 px-5 bg-[#faf6ee] rounded-xl border border-[#f0e6d2]">
                        <Award size={36} className="text-[#b8823a] opacity-50 mb-3" />
                        <h3 className="text-base font-bold text-[#1c1712] mb-1">
                          No Client Reviews Yet
                        </h3>
                        <p className="text-xs text-[#8a8479] max-w-sm">
                          This professional hasn't received public client reviews yet. Reviews are verified and published once projects and milestones are delivered.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <ReviewsBreakdown
                          summary={reviewSummary}
                          activeFilter={reviewsStarFilter}
                          onSelectFilter={setReviewsStarFilter}
                        />

                        {reviewsStarFilter && (
                          <div className="flex items-center gap-2 text-xs bg-[#f4e6cd]/40 px-3 py-1.5 rounded-md text-[#1c1712] border border-[#b8823a]/30">
                            <span>Showing {reviewsStarFilter}-Star Reviews</span>
                            <button
                              onClick={() => setReviewsStarFilter(null)}
                              className="text-[11px] font-bold text-[#b8823a] underline ml-2"
                            >
                              Clear Filter
                            </button>
                          </div>
                        )}

                        <div className="space-y-4">
                          {userReviews
                            .filter((r) => {
                              if (
                                reviewsStarFilter &&
                                Math.round(r.rating) !== Number(reviewsStarFilter)
                              )
                                return false;
                              return true;
                            })
                            .map((rev) => (
                              <ReviewCard
                                key={rev.id}
                                review={rev}
                                isRecipientView={false}
                                onReviewUpdated={() => refetchReviews()}
                                onReviewDeleted={() => refetchReviews()}
                              />
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {bio && (
              <div className="bg-white border border-[#e8e2d8] rounded-2xl p-6">
                <h2 className="text-base mb-3 font-bold">About Me</h2>
                <p className="text-sm leading-relaxed text-[#55504a] break-words">
                  {bioText}
                </p>
                {bioIsLong && (
                  <button
                    type="button"
                    onClick={() => setBioExpanded((v) => !v)}
                    className="text-[13.5px] font-semibold text-[#9c6c2c] pt-2.5"
                  >
                    {bioExpanded ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            )}

   
          </div>
        </div>
      </section>
    </main>
  );
}
