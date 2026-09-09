import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Award,
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
  Send,
  Share2,
  UserPlus,
  Clock,
} from "lucide-react";
import { CURRENCY_SYMBOLS } from "../Authentication/Authshared";
import { useGetAllPortfoliosQuery } from "./supplyproductsapislice";

const ROLE_LABELS = {
  1: "Client",
  2: "Designer",
  3: "Architect",
  4: "Contractor",
  5: "Material Supplier",
};

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

export default function PortfolioDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Projects");
  const [bioExpanded, setBioExpanded] = useState(false);

  const passedUser = location.state?.user;
  const { data } = useGetAllPortfoliosQuery({ page: 1, limit: 100 }, { skip: !!passedUser });
  const fetchedUser = data?.data?.data?.find((u) => u.id === id);
  const rawUser = passedUser || fetchedUser;

  const user = useMemo(() => {
    if (!rawUser) return null;
    return { ...rawUser, profile: safeParseProfile(rawUser.profile) };
  }, [rawUser]);

  if (!user) {
    return (
      <main className="min-h-screen bg-white text-[#1c1712] font-sans">
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center text-[#8a8479]">
          Loading profile…
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
  const cover = user.posts?.[0]?.images?.[0] || profile.photos?.[0];
  const projectCount = user._count?.posts ?? user.posts?.length ?? 0;
  const followerCount = user._count?.followers ?? user.followers?.length ?? 0;
  const followingCount = user._count?.following ?? 0;

  const skills = [profile.software, ...(profile.skills || [])].filter(Boolean);
  const bio = profile.bio || "";
  const bioIsLong = bio.length > BIO_PREVIEW_LENGTH;
  const bioText = bioExpanded || !bioIsLong ? bio : `${bio.slice(0, BIO_PREVIEW_LENGTH)}…`;

  const specLevel =
    profile.specializationLevel ||
    user.specializationLevel ||
    user.designer?.specializationLevel ||
    (profile.experience >= 6 ? "Professional" : profile.experience >= 3 ? "Intermediate" : profile.experience != null ? "Beginner" : null);

  const currencyCode = profile.currency || user.currency || "INR";
  const currencySymbol = CURRENCY_SYMBOLS[currencyCode] || currencyCode || "₹";
  const rateVal = profile.rate || user.rate;

  const aboutRows = [
    profile.specialization && { icon: Layers, label: "Specialization", value: profile.specialization },
    specLevel && { icon: Award, label: "Specialization Level", value: specLevel },
    rateVal && { icon: Clock, label: "Hourly Rate", value: `${currencySymbol}${rateVal} / hr` },
    profile.software && { icon: Cpu, label: "Software", value: profile.software },
    profile.experience != null && { icon: Briefcase, label: "Experience", value: `${profile.experience} Years` },
    user.country && { icon: Globe2, label: "Country", value: user.country },
    user.state && { icon: Flag, label: "State", value: user.state },
    user.city && { icon: Home, label: "City", value: user.city },
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-white text-[#1c1712] font-sans">
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13.5px] text-[#8a8479] mb-5" aria-label="Breadcrumb">
          <button type="button" onClick={() => navigate("/")} className="flex items-center">
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
        <section className="grid grid-cols-1 md:grid-cols-2 bg-[#f7f2ea] rounded-[20px] overflow-hidden min-h-[320px]">
          <div className="flex flex-col sm:flex-row gap-6 p-7 sm:p-10 items-start">
            <div className="flex-shrink-0 w-[92px] h-[92px] rounded-full border-2 border-white bg-white flex items-center justify-center font-serif text-3xl font-bold shadow-md">
              {initials || "?"}
            </div>
            <div>
              <h1 className="font-serif text-3xl mb-1">{user.name}</h1>
              <p className="text-[#8a8479] text-sm mb-3.5">@{user.username}</p>
              <div className="flex flex-wrap items-center gap-3.5 text-sm text-[#55504a] mb-3.5">
                {user.city && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} /> {[user.city, user.state, user.country].filter(Boolean).join(", ")}
                  </span>
                )}
                <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full font-medium">
                  <Layers size={13} /> {roleLabel}
                </span>
                {specLevel && (
                  <span className="flex items-center gap-1 bg-[#fef9ee] border border-[#eed7a1] text-[#9c6c2c] px-3 py-1 rounded-full font-medium text-xs shadow-2xs">
                    <Award size={13} className="text-[#b8823a]" /> {specLevel}
                  </span>
                )}
                {rateVal && (
                  <span className="flex items-center gap-1 bg-[#edf7ee] border border-[#c4e3c7] text-[#2d6a36] px-3 py-1 rounded-full font-medium text-xs shadow-2xs">
                    <Clock size={13} className="text-[#2d6a36]" /> {currencySymbol}{rateVal}/hr
                  </span>
                )}
              </div>
              {bio && <p className="text-[14.5px] text-[#55504a] leading-relaxed max-w-[46ch] mb-5">{bio}</p>}
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-[10px] bg-[#b8823a] text-white hover:bg-[#9c6c2c]"
                >
                  <UserPlus size={16} /> Follow
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-[10px] bg-white border border-[#e8e2d8] text-[#1c1712]"
                >
                  <MessageCircle size={16} /> Message
                </button>
                <button
                  type="button"
                  aria-label="Share profile"
                  className="inline-flex items-center justify-center p-2.5 rounded-[10px] bg-white border border-[#e8e2d8] text-[#1c1712]"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="relative">
            {cover ? (
              <img src={cover} alt={`${user.name}'s work`} className="w-full h-full min-h-[220px] md:min-h-[320px] object-cover" />
            ) : (
              <div className="w-full h-full min-h-[220px] md:min-h-[320px] bg-gradient-to-br from-[#f1e9dc] to-[#f7f2ea]" />
            )}
            <div className="static md:absolute md:right-6 md:bottom-6 mx-6 mb-6 md:m-0 flex justify-between md:justify-start gap-6 bg-white rounded-2xl shadow-lg px-6 py-4.5">
              <div className="flex flex-col items-center gap-1">
                <Briefcase size={18} className="text-[#b8823a]" />
                <strong className="text-lg">{projectCount}</strong>
                <span className="text-xs text-[#8a8479]">Projects</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <UserPlus size={18} className="text-[#b8823a]" />
                <strong className="text-lg">{followerCount}</strong>
                <span className="text-xs text-[#8a8479]">Followers</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <UserPlus size={18} className="text-[#b8823a]" />
                <strong className="text-lg">{followingCount}</strong>
                <span className="text-xs text-[#8a8479]">Following</span>
              </div>
            </div>
          </div>
        </section>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 mt-7 items-start">
          {/* Sidebar */}
          <aside className="flex flex-col sm:flex-row lg:flex-col gap-5 lg:sticky lg:top-6">
            <div className="flex-1 min-w-[260px] bg-white border border-[#e8e2d8] rounded-2xl p-5.5">
              <h2 className="text-base font-bold pb-3 mb-1 border-b-2 border-[#f4e6cd]">About</h2>
              {aboutRows.map((row, i) => {
                const Icon = row.icon;
                const isLast = i === aboutRows.length - 1;
                return (
                  <div
                    key={row.label}
                    className={`flex gap-3 py-3.5 ${isLast ? "" : "border-b border-[#e8e2d8]"}`}
                  >
                    <Icon size={16} className="text-[#b8823a] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[12.5px] text-[#8a8479] mb-0.5">{row.label}</p>
                      <strong className="text-[14.5px] font-semibold">{row.value}</strong>
                    </div>
                  </div>
                );
              })}
            </div>

            {skills.length > 0 && (
              <div className="flex-1 min-w-[260px] bg-white border border-[#e8e2d8] rounded-2xl p-5.5">
                <h2 className="text-base font-bold pb-3 mb-3 border-b-2 border-[#f4e6cd]">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span key={s} className="bg-[#f7f2ea] text-[#55504a] text-[13px] font-medium px-3.5 py-1.5 rounded-full">
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
              <div className="flex gap-7 px-6 border-b border-[#e8e2d8] overflow-x-auto" role="tablist">
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
                  (projectCount === 0 ? (
                    <div className="flex flex-col items-center text-center py-10 px-5">
                      <div className="w-14 h-14 rounded-full bg-[#f7f2ea] flex items-center justify-center text-[#b8823a] mb-4.5">
                        <Folder size={28} />
                      </div>
                      <h3 className="text-[17px] mb-1.5">No projects added yet</h3>
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
                      {user.posts.map((post) => (
                        <div key={post.id} className="aspect-square rounded-[10px] overflow-hidden bg-[#f7f2ea]">
                          {post.images?.[0] && (
                            <img src={post.images[0]} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}

                {activeTab === "About" && (
                  <p className="text-[14.5px] leading-relaxed text-[#55504a]">{bio || "No details added yet."}</p>
                )}

                {activeTab === "Experience" && (
                  <p className="text-[14.5px] leading-relaxed text-[#55504a]">
                    {profile.experience != null
                      ? `${profile.experience} year${profile.experience === 1 ? "" : "s"} of experience.`
                      : "No experience details added yet."}
                  </p>
                )}

                {activeTab === "Reviews" && (
                  <p className="text-[14.5px] leading-relaxed text-[#55504a]">No reviews yet.</p>
                )}
              </div>
            </div>

            {bio && (
              <div className="bg-white border border-[#e8e2d8] rounded-2xl p-6">
                <h2 className="text-base mb-3 font-bold">About Me</h2>
                <p className="text-sm leading-relaxed text-[#55504a] break-words">{bioText}</p>
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
                <Send size={20} />
              </div>
              <div className="flex-1 min-w-[200px]">
                <h3 className="text-[15.5px] mb-1 font-semibold">Interested in working together?</h3>
                <p className="text-[13.5px] text-[#55504a]">
                  Connect with {user.name} to discuss your next project.
                </p>
              </div>
              <button
                type="button"
                className="w-full sm:w-auto sm:ml-auto inline-flex items-center justify-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-[10px] bg-[#b8823a] text-white hover:bg-[#9c6c2c]"
              >
                <MessageCircle size={16} /> Send Message
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}