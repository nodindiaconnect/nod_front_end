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
} from "lucide-react";
import { useGetUserPortfolioQuery } from "./supplyproductsapislice";

const ROLE_LABELS = {
  1: "Client",
  2: "Interior Designer",
  3: "Architect",
  4: "Contractor",
  5: "Material Supplier",
};

// Shown on the hero's right side when the professional hasn't uploaded any
// project photos yet, so the header never looks empty.
const DEFAULT_COVER_IMAGE =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80&auto=format&fit=crop";

const TABS = ["Projects", "About", "Experience", "Reviews"];
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
  const [activeTab, setActiveTab] = useState("Projects");
  const [bioExpanded, setBioExpanded] = useState(false);
  const [failedImages, setFailedImages] = useState({});

  // The card the person clicked already has the full user object — use it
  // immediately, and only hit the API if we landed here directly (refresh / shared link).
  const passedUser = location.state?.user;
  const { data, isLoading } = useGetUserPortfolioQuery(userId, {
    skip: !!passedUser,
  });

  const apiProjects = data?.data || [];
  const apiUser = data?.user;
  const rawUser = passedUser || apiUser;
  const user = useMemo(() => normaliseUser(rawUser), [rawUser]);
  const projects = apiProjects.length ? apiProjects : user?.posts || [];

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

  const aboutRows = [
    profile.specialization && {
      icon: Layers,
      label: "Specialization",
      value: profile.specialization,
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
              </div>
              {bio && (
                <div className="grid grid-cols-[72px_1fr] gap-6 items-start mb-5">
                  {/* BIO Heading */}
                  <div>
                    <span className="text-[13px] font-medium tracking-wide text-[#a87332]">
                      BIO
                    </span>
                  </div>

                  {/* Bio Content */}
                  <p className="text-[13px] text-[#55504a] leading-6 m-0">
                    {bio}
                  </p>
                </div>
              )}{" "}
              {/* <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-[#b8823a] text-white hover:bg-[#9c6c2c]"
                >
                  <UserPlus size={13} /> Follow
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-white border border-[#e8e2d8] text-[#1c1712]"
                >
                  <MessageCircle size={13} /> Message
                </button>
                <button
                  type="button"
                  aria-label="Share profile"
                  className="inline-flex items-center justify-center p-1.5 rounded-lg bg-white border border-[#e8e2d8] text-[#1c1712]"
                >
                  <Share2 size={13} />
                </button>
              </div> */}
            </div>
          </div>

          {/* Stats — floats over the photo side of the blend */}
          {/* <div className="static sm:absolute sm:right-5 sm:bottom-4 mx-4 mb-4 sm:m-0 flex justify-between sm:justify-start gap-3 bg-white rounded-xl shadow-lg px-3.5 py-2.5">
            <div className="flex flex-col items-center gap-0.5">
              <Briefcase size={14} className="text-[#b8823a]" />
              <strong className="text-[13px]">{projectCount}</strong>
              <span className="text-[10px] text-[#8a8479]">Projects</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <UserPlus size={14} className="text-[#b8823a]" />
              <strong className="text-[13px]">{followerCount}</strong>
              <span className="text-[10px] text-[#8a8479]">Followers</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <UserPlus size={14} className="text-[#b8823a]" />
              <strong className="text-[13px]">{followingCount}</strong>
              <span className="text-[10px] text-[#8a8479]">Following</span>
            </div>
          </div> */}
        </section>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 mt-7 items-start">
          {/* Sidebar */}
          <aside className="flex flex-col sm:flex-row lg:flex-col gap-5 lg:sticky lg:top-6">
            {aboutRows.length > 0 && (
              <div className="flex-1 min-w-[260px] bg-white border border-[#e8e2d8] rounded-2xl p-5.5">
                <h2 className="text-base font-bold pb-3 mb-1 border-b-2 border-[#f4e6cd]">
                  About
                </h2>
                {aboutRows.map((row, i) => {
                  const Icon = row.icon;
                  const isLast = i === aboutRows.length - 1;
                  return (
                    <div
                      key={row.label}
                      className={`flex gap-3 py-3.5 ${isLast ? "" : "border-b border-[#e8e2d8]"}`}
                    >
                      <Icon
                        size={16}
                        className="text-[#b8823a] flex-shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-[12.5px] text-[#8a8479] mb-0.5">
                          {row.label}
                        </p>
                        <strong className="text-[14.5px] font-semibold">
                          {row.value}
                        </strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {skills.length > 0 && (
              <div className="flex-1 min-w-[260px] bg-white border border-[#e8e2d8] rounded-2xl p-5.5">
                <h2 className="text-base font-bold pb-3 mb-3 border-b-2 border-[#f4e6cd]">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="bg-[#f7f2ea] text-[#55504a] text-[13px] font-medium px-3.5 py-1.5 rounded-full"
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
            <div className="bg-white border border-[#e8e2d8] rounded-2xl overflow-hidden">
              <div
                className="flex gap-7 px-6 border-b border-[#e8e2d8] overflow-x-auto"
                role="tablist"
              >
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-[14.5px] font-semibold py-4.5 whitespace-nowrap border-b-2 -mb-px ${
                      activeTab === tab
                        ? "text-[#1c1712] border-[#b8823a]"
                        : "text-[#8a8479] border-transparent"
                    }`}
                  >
                    {tab === "Projects" ? `Projects (${projectCount})` : tab}
                  </button>
                ))}
              </div>

              <div className="p-6 sm:p-8">
                {activeTab === "Projects" &&
                  (projects.length === 0 ? (
                    <div className="flex flex-col items-center text-center py-10 px-5">
                      <div className="w-14 h-14 rounded-full bg-[#f7f2ea] flex items-center justify-center text-[#b8823a] mb-4.5">
                        <Folder size={28} />
                      </div>
                      <h3 className="text-[17px] mb-1.5">
                        No projects added yet
                      </h3>
                      <p className="text-sm text-[#8a8479] mb-5">
                        This professional has not added any portfolio projects.
                      </p>
                      <button
                        type="button"
                        className="text-sm font-semibold px-5 py-2.5 rounded-[10px] bg-white border border-[#b8823a] text-[#9c6c2c]"
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
                            onClick={() =>
                              navigate(
                                `/portfolio/${userId}/project/${project.id}`,
                                {
                                  state: { user, project, projects },
                                },
                              )
                            }
                            className="group text-left"
                          >
                            <div className="aspect-square rounded-[10px] overflow-hidden bg-[#f7f2ea]">
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
                                <div className="w-full h-full flex items-center justify-center text-[#b8823a] font-serif text-2xl">
                                  {project.title?.[0] || "P"}
                                </div>
                              )}
                            </div>
                            <p className="text-[13px] font-medium mt-1.5 truncate">
                              {project.title || "Untitled project"}
                            </p>
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
                  <p className="text-[14.5px] leading-relaxed text-[#55504a]">
                    No reviews yet.
                  </p>
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

            <div className="flex flex-wrap items-center gap-4.5 bg-[#f7f2ea] rounded-2xl p-5.5 sm:p-6">
              <div className="w-[46px] h-[46px] rounded-full bg-white flex items-center justify-center text-[#b8823a] flex-shrink-0">
                <Package size={20} />
              </div>

              <div className="flex-1 min-w-[200px]">
                <h3 className="text-[15.5px] mb-1 font-semibold">
                  Looking for the right materials?
                </h3>
                <p className="text-[13.5px] text-[#55504a]">
                  Connect with {user.name} to discuss products, pricing,
                  availability, and bulk orders.
                </p>
              </div>

              <button
                type="button"
                className="w-full sm:w-auto sm:ml-auto inline-flex items-center justify-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-[10px] bg-[#b8823a] text-white hover:bg-[#9c6c2c]"
              >
                <MessageCircle size={16} />
                Contact Supplier
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
