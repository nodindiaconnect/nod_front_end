import { useState, useMemo } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Share2,
  Check,
  User,
  Building2,
  Folder,
  Maximize2,
  X,
  ChevronLeft,
} from "lucide-react";
import { useGetUserPortfolioQuery } from "./supplyproductsapislice";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../theme.css";

const ROLE_LABELS = {
  1: "Client",
  2: "Interior Designer",
  3: "Architect",
  4: "General Contractor",
  5: "Material Supplier",
};

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

export default function PortfolioProjectDetails() {
  const { userId, projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch live portfolio data from API
  const passedUser = location.state?.user;
  const { data, isLoading, isError } = useGetUserPortfolioQuery(userId, {
    skip: !userId,
  });

  const user = useMemo(() => {
    if (data?.user) return normaliseUser(data.user);
    if (passedUser) return normaliseUser(passedUser);
    return null;
  }, [data, passedUser]);

  const allProjects = useMemo(() => {
    if (Array.isArray(data?.data) && data.data.length > 0) return data.data;
    if (Array.isArray(user?.posts) && user.posts.length > 0) return user.posts;
    if (Array.isArray(location.state?.projects)) return location.state.projects;
    return [];
  }, [data, user, location.state]);

  const project = useMemo(() => {
    if (location.state?.project && String(location.state.project.id) === String(projectId)) {
      return location.state.project;
    }
    return allProjects.find((item) => String(item.id) === String(projectId));
  }, [location.state, projectId, allProjects]);

  const otherProjects = useMemo(() => {
    return allProjects.filter((item) => String(item.id) !== String(projectId)).slice(0, 3);
  }, [allProjects, projectId]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project?.title || "NOD Portfolio Project",
          url: window.location.href,
        });
      } catch {
        // Ignored or cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  // Loading State
  if (isLoading && !project) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text)]">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16 animate-pulse">
          <div className="h-4 w-48 bg-[var(--border)] rounded mb-6" />
          <div className="h-10 w-3/4 max-w-lg bg-[var(--border)] rounded mb-4" />
          <div className="h-5 w-64 bg-[var(--border)] rounded mb-8" />
          <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-[var(--surface)] border border-[var(--border)] rounded-2xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              <div className="h-6 w-40 bg-[var(--border)] rounded" />
              <div className="h-4 w-full bg-[var(--border)] rounded" />
              <div className="h-4 w-5/6 bg-[var(--border)] rounded" />
              <div className="h-4 w-4/6 bg-[var(--border)] rounded" />
            </div>
            <div className="lg:col-span-4">
              <div className="h-64 bg-[var(--surface)] border border-[var(--border)] rounded-2xl" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not Found State
  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text)]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-28 text-center">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xl">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[var(--background-secondary)] flex items-center justify-center text-[var(--gold)]">
              <Folder size={30} />
            </div>
            <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--heading)] mb-2">
              Project Not Found
            </h1>
            <p className="text-sm text-[var(--muted)] mb-6">
              The project you are looking for may have been moved, updated, or removed by its creator.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {userId ? (
                <button
                  type="button"
                  onClick={() => navigate(`/portfolio/${userId}`)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold bg-[var(--gold)] text-[#1b130f] hover:opacity-90 transition cursor-pointer"
                >
                  View Creator's Profile
                </button>
              ) : null}
              <Link
                to="/portfolios"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold border border-[var(--border)] text-[var(--heading)] hover:bg-[var(--surface)] transition text-center"
              >
                Browse All Portfolios
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = Array.isArray(project.images) ? project.images.filter(Boolean) : [];
  const activeImg = images[activeImageIndex] || images[0];
  const roleName = user?.role ? (ROLE_LABELS[user.role] || "Design Professional") : "Creator";
  const userProfile = user?.profile || {};
  const locationStr = userProfile.city
    ? `${userProfile.city}${userProfile.state ? `, ${userProfile.state}` : ""}`
    : userProfile.location || null;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text)]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-20">
        {/* Breadcrumb Bar */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs md:text-sm text-[var(--muted)] mb-6 flex-wrap">
          <Link to="/" className="hover:text-[var(--gold)] transition-colors">
            Home
          </Link>
          <ChevronRight size={14} className="opacity-60" />
          <Link to="/portfolios" className="hover:text-[var(--gold)] transition-colors">
            Portfolios
          </Link>
          {user && (
            <>
              <ChevronRight size={14} className="opacity-60" />
              <Link
                to={`/portfolio/${userId}`}
                state={{ user }}
                className="hover:text-[var(--gold)] transition-colors font-medium text-[var(--heading)] truncate max-w-[150px] sm:max-w-[200px]"
              >
                {user.name || "Creator Profile"}
              </Link>
            </>
          )}
          <ChevronRight size={14} className="opacity-60" />
          <span className="text-[var(--gold)] font-medium truncate max-w-[180px] sm:max-w-[260px]">
            {project.title || "Project Details"}
          </span>
        </nav>

        {/* Back Link & Action Bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            type="button"
            onClick={() => navigate(user ? `/portfolio/${userId}` : "/portfolios", { state: { user } })}
            className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-[var(--heading)] hover:text-[var(--gold)] transition-colors group cursor-pointer"
          >
            <span className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--gold)] transition-colors">
              <ArrowLeft size={15} />
            </span>
            <span>Back to {user ? `${user.name}'s Portfolio` : "Portfolios"}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[var(--border)] text-xs font-semibold text-[var(--heading)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
            <span>{copied ? "Link Copied!" : "Share Project"}</span>
          </button>
        </div>

        {/* Project Header Title & Meta */}
        <header className="mb-8">
          <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20">
              <Sparkles size={13} />
              {roleName} Project
            </span>
            {locationStr && (
              <span className="inline-flex items-center gap-1 text-xs text-[var(--muted)]">
                <MapPin size={13} className="text-[var(--gold)]" />
                {locationStr}
              </span>
            )}
            {project.createdAt && (
              <span className="inline-flex items-center gap-1 text-xs text-[var(--muted)]">
                <Calendar size={13} />
                {new Date(project.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </div>

          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--heading)] tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {project.title || "Untitled Project"}
          </h1>
        </header>

        {/* Media / Gallery Showcase */}
        <div className="mb-12">
          {images.length > 0 ? (
            <div className="space-y-3.5">
              {/* Active Hero Image */}
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-lg group">
                <img
                  src={activeImg}
                  alt={`${project.title || "Project"} - view ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  aria-label="View full screen"
                  className="absolute bottom-4 right-4 p-2.5 rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition-all cursor-pointer shadow-md"
                >
                  <Maximize2 size={18} />
                </button>
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/60 text-white text-xs backdrop-blur-md font-medium">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip (if multiple photos) */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        idx === activeImageIndex
                          ? "border-[var(--gold)] ring-2 ring-[var(--gold)]/30 scale-100"
                          : "border-[var(--border)] opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl md:rounded-3xl border border-[var(--border)] bg-[var(--surface)] flex flex-col items-center justify-center text-center p-8">
              <Folder size={48} className="text-[var(--gold)] mb-3 opacity-60" />
              <p className="text-base font-semibold text-[var(--heading)]">No project photos uploaded</p>
              <p className="text-xs text-[var(--muted)] max-w-sm mt-1">
                Visual assets for this project are currently being updated by the creator.
              </p>
            </div>
          )}
        </div>

        {/* Content Layout: 2 Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left / Main Column: Narrative & Details */}
          <div className="lg:col-span-8 space-y-8">
            <section className="p-6 sm:p-8 rounded-2xl md:rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
              <h2
                className="text-lg sm:text-xl font-bold text-[var(--heading)] mb-4 pb-3 border-b border-[var(--border)]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                About This Project
              </h2>
              <div className="prose prose-sm md:prose-base max-w-none text-[var(--text)] leading-relaxed whitespace-pre-line">
                {project.description ? (
                  project.description
                ) : (
                  <p className="text-[var(--muted)] italic">
                    The creator has not provided a written description for this project yet.
                  </p>
                )}
              </div>
            </section>

            {/* Dynamic Metadata Attributes */}
            {(project.category || project.scope || project.tags || project.client || project.duration || project.budget) && (
              <section className="p-6 sm:p-8 rounded-2xl md:rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
                <h2
                  className="text-lg sm:text-xl font-bold text-[var(--heading)] mb-4 pb-3 border-b border-[var(--border)]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Project Specifications
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.category && (
                    <div className="p-3.5 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)]">
                      <span className="text-xs text-[var(--muted)] uppercase tracking-wider block mb-1">
                        Category
                      </span>
                      <strong className="text-sm font-semibold text-[var(--heading)]">
                        {project.category}
                      </strong>
                    </div>
                  )}
                  {project.scope && (
                    <div className="p-3.5 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)]">
                      <span className="text-xs text-[var(--muted)] uppercase tracking-wider block mb-1">
                        Scope
                      </span>
                      <strong className="text-sm font-semibold text-[var(--heading)]">
                        {project.scope}
                      </strong>
                    </div>
                  )}
                  {project.duration && (
                    <div className="p-3.5 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)]">
                      <span className="text-xs text-[var(--muted)] uppercase tracking-wider block mb-1">
                        Timeline / Duration
                      </span>
                      <strong className="text-sm font-semibold text-[var(--heading)]">
                        {project.duration}
                      </strong>
                    </div>
                  )}
                  {project.budget && (
                    <div className="p-3.5 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)]">
                      <span className="text-xs text-[var(--muted)] uppercase tracking-wider block mb-1">
                        Project Budget
                      </span>
                      <strong className="text-sm font-semibold text-[var(--heading)]">
                        {project.budget}
                      </strong>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* More Projects by Same Creator */}
            {otherProjects.length > 0 && (
              <section className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className="text-lg font-bold text-[var(--heading)]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    More by {user?.name || "this Professional"}
                  </h3>
                  <Link
                    to={`/portfolio/${userId}`}
                    state={{ user }}
                    className="text-xs font-semibold text-[var(--gold)] hover:underline inline-flex items-center gap-1"
                  >
                    View All <ChevronRight size={13} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {otherProjects.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveImageIndex(0);
                        navigate(`/portfolio/${userId}/project/${item.id}`, {
                          state: { user, project: item, projects: allProjects },
                        });
                      }}
                      className="group text-left rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--gold)] transition-all flex flex-col cursor-pointer"
                    >
                      <div className="aspect-[4/3] w-full bg-[var(--background-secondary)] overflow-hidden">
                        {item.images?.[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.title || "Project"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--muted)]">
                            <Folder size={24} />
                          </div>
                        )}
                      </div>
                      <div className="p-3.5 flex-1 flex flex-col justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-[var(--heading)] line-clamp-1 group-hover:text-[var(--gold)] transition-colors">
                          {item.title || "Untitled Project"}
                        </h4>
                        <span className="text-[11px] text-[var(--muted)] mt-1">
                          View details →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Professional Creator Card (Sticky) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="p-6 rounded-2xl md:rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-md">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold)] block mb-4">
                Designed &amp; Crafted By
              </span>

              <div className="flex items-center gap-4 mb-4">
                {user?.profilePhoto || user?.avatar ? (
                  <img
                    src={user.profilePhoto || user.avatar}
                    alt={user.name || "Creator"}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[var(--gold)]"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[var(--background-secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--gold)] font-bold text-lg">
                    {user?.name?.[0] || <User size={24} />}
                  </div>
                )}
                <div>
                  <h3
                    className="text-base font-bold text-[var(--heading)] leading-tight"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {user?.name || "Professional"}
                  </h3>
                  <p className="text-xs text-[var(--gold)] font-medium mt-0.5">
                    {roleName}
                  </p>
                  {locationStr && (
                    <p className="text-xs text-[var(--muted)] flex items-center gap-1 mt-1">
                      <MapPin size={12} />
                      {locationStr}
                    </p>
                  )}
                </div>
              </div>

              {userProfile.bio && (
                <p className="text-xs text-[var(--text)] line-clamp-3 mb-5 leading-relaxed">
                  {userProfile.bio}
                </p>
              )}

              <div className="space-y-2.5 pt-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => navigate(`/portfolio/${userId}`, { state: { user } })}
                  className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-[var(--gold)] text-[#1b130f] hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <User size={15} />
                  View Full Profile &amp; Portfolio
                </button>

                <Link
                  to="/contact"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold border border-[var(--border)] text-[var(--heading)] hover:bg-[var(--background-secondary)] transition flex items-center justify-center gap-1.5"
                >
                  Connect with NOD Concierge
                </Link>
              </div>
            </div>

            {/* NOD Verification Strip */}
            <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[var(--heading)]">
                  Verified NOD Professional
                </h4>
                <p className="text-[11px] text-[var(--muted)] leading-relaxed mt-0.5">
                  Portfolio and credentials verified through Night Owl Designers network.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Lightbox Modal */}
      {lightboxOpen && images.length > 0 && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close modal"
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer z-50"
          >
            <X size={24} />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
                }
                aria-label="Previous image"
                className="absolute left-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer z-50"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
                }
                aria-label="Next image"
                className="absolute right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer z-50"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center">
            <img
              src={images[activeImageIndex]}
              alt={`${project.title || "Project"} - full view`}
              className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
            />
            <p className="text-white/80 text-xs mt-3">
              {project.title || "Project"} ({activeImageIndex + 1} of {images.length})
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
