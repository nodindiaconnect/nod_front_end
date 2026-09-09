import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Star,
  Clock,
  TrendingUp,
  Award,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Sparkles,
  ChevronRight,
  FolderKanban,
  Building,
  Hammer,
  Palette,
  Inbox,
} from "lucide-react";

// Theme color palette matching DesignConnect luxury aesthetic
const COLORS = {
  primary: "#0F766E", // Deep Teal
  primaryLight: "#14B8A6",
  gold: "#D97706", // Amber Gold
  goldLight: "#FBBF24",
  navy: "#1E293B",
  slate: "#64748B",
  emerald: "#059669",
  indigo: "#4F46E5",
  rose: "#E11D48",
  background: "#F8FAFC",
};

const PIE_COLORS = ["#0F766E", "#D97706", "#4F46E5", "#059669", "#E11D48"];

const ROLE_THEMES = {
  ARCHITECT: {
    badge: "Architecture & Structural Planning",
    icon: Building,
    accent: "#0F766E",
    bgAccent: "bg-teal-50 text-teal-800 border-teal-200",
  },
  CONTRACTOR: {
    badge: "Construction & Civil Execution",
    icon: Hammer,
    accent: "#D97706",
    bgAccent: "bg-amber-50 text-amber-800 border-amber-200",
  },
  DESIGNER: {
    badge: "Design & Spatial Planning",
    icon: Palette,
    accent: "#4F46E5",
    bgAccent: "bg-indigo-50 text-indigo-800 border-indigo-200",
  },
  INTERIOR_DESIGNER: {
    badge: "Design & Spatial Planning",
    icon: Palette,
    accent: "#4F46E5",
    bgAccent: "bg-indigo-50 text-indigo-800 border-indigo-200",
  },
};

// Small reusable empty-state block — used whenever the API hasn't returned
// real data for a section, instead of inventing placeholder numbers.
function EmptyState({ label = "No data yet" }) {
  return (
    <div className="h-full min-h-[160px] w-full flex flex-col items-center justify-center gap-2 text-slate-400">
      <Inbox size={22} />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}

export default function ProfessionalPerformanceSection({
  performanceData = null,
  role = "DESIGNER",
  user = null,
  portfolioPosts = [],
  reviews = [],
}) {
  const [selectedPost, setSelectedPost] = useState(null);

  const roleKey =
    role === 3 || role === "ARCHITECT"
      ? "ARCHITECT"
      : role === 4 || role === "CONTRACTOR"
      ? "CONTRACTOR"
      : "DESIGNER";

  const theme = ROLE_THEMES[roleKey] || ROLE_THEMES.DESIGNER;
  const RoleIcon = theme.icon;

  // ── Pull straight from the API response — no synthesized fallbacks ──
  const posts = portfolioPosts.length > 0 ? portfolioPosts : user?.posts || [];
  const verifiedReviewsList = reviews.length > 0 ? reviews : performanceData?.verifiedReviews || [];

  const overview = performanceData?.overview || null;
  const ratings = performanceData?.ratings || null;
  const charts = performanceData?.charts || null;
  const roleSpecificMetrics = performanceData?.roleSpecificMetrics || null;

  const monthlyPerformance = charts?.monthlyPerformance || [];
  const projectsBarData = charts?.projectsBar || [];
  const projectTypeDistribution = charts?.projectTypeDistribution || [];

  const radarRatingData = ratings
    ? [
        { metric: "Quality", score: ratings.quality, fullMark: 5.0 },
        { metric: "Communication", score: ratings.communication, fullMark: 5.0 },
        { metric: "Timeliness", score: ratings.timeliness, fullMark: 5.0 },
        { metric: "Budget Fidelity", score: ratings.budget, fullMark: 5.0 },
        { metric: "Overall", score: ratings.overall, fullMark: 5.0 },
      ]
    : [];

  return (
    <div className="space-y-12">
      {/* ── Section Header ── */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`text-xs px-3 py-0.5 rounded-full font-bold uppercase tracking-wider border flex items-center gap-1.5 ${theme.bgAccent}`}
            >
              <RoleIcon size={14} />
              {theme.badge}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 flex items-center gap-1">
              <ShieldCheck size={13} /> Verified Marketplace Pro
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Performance & Track Record
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time verified execution metrics, milestones delivered, client satisfaction ratings, and project portfolio.
          </p>
        </div>

        {/* Global Rating Hero Badge — only rendered if the API actually gave us an overview */}
        {overview && (
          <div className="flex items-center gap-4 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-sm shrink-0">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Overall Score</span>
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-2xl font-black text-amber-400">
                  {overview.overallRating != null ? overview.overallRating : "—"}
                </span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Verified Deliveries</span>
              <span className="text-sm font-bold text-white">
                {overview.completedProjects != null ? overview.completedProjects : 0} Projects
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── 1. Top KPI Summary Cards (4 Metrics) ── */}
      {overview ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Project Success Rate */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Success Rate</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Award size={18} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {overview.successRate != null ? `${overview.successRate}%` : "—"}
              </span>
              {overview.successRate != null && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp size={13} /> High Reliability
                </span>
              )}
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${overview.successRate || 0}%` }}
              />
            </div>
          </div>

          {/* On-Time Completion */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">On-Time Delivery</span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                <Clock size={18} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {overview.onTimeCompletionRate != null ? `${overview.onTimeCompletionRate}%` : "—"}
              </span>
              {overview.onTimeCompletionRate != null && (
                <span className="text-xs font-semibold text-teal-700">Strict Milestones</span>
              )}
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-teal-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${overview.onTimeCompletionRate || 0}%` }}
              />
            </div>
          </div>

          {/* Response Rate */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Response Rate</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Zap size={18} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {overview.responseRate != null ? `${overview.responseRate}%` : "—"}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${overview.responseRate || 0}%` }}
              />
            </div>
          </div>

          {/* Client Rating */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Client Satisfaction</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Star size={18} className="fill-indigo-600" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {ratings?.overall != null ? `${ratings.overall} / 5.0` : "—"}
              </span>
              <span className="text-xs font-semibold text-indigo-600">
                ({overview.totalReviews != null ? overview.totalReviews : 0} Reviews)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${ratings?.overall ? (ratings.overall / 5) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
          <EmptyState label="No performance metrics yet — these populate once projects and reviews come in." />
        </div>
      )}

      {/* ── 2. Primary Charts Grid (Row 1: Projects Completed & Monthly Performance) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Projects Status Breakdown (Bar Chart) */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderKanban size={18} className="text-teal-700" />
                Projects Handled & Delivery Status
              </h3>
              <p className="text-xs text-slate-500">Volume of delivered vs active projects on DesignConnect.</p>
            </div>
            {overview?.totalProjects != null && (
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                Total: {overview.totalProjects}
              </span>
            )}
          </div>

          <div className="h-64 w-full pt-2">
            {projectsBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectsBarData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="category" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0F172A", borderRadius: "8px", border: "none", color: "#FFF", fontSize: "12px" }}
                    formatter={(val) => [`${val} Projects`, "Count"]}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {projectsBarData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill || COLORS.primary} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>

        {/* Chart 2: Monthly Performance Trend (Line Chart) */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity size={18} className="text-amber-600" />
                Monthly Execution & Rating Trend
              </h3>
              <p className="text-xs text-slate-500">Milestone deliverables and consistency over recent months.</p>
            </div>
            {monthlyPerformance.length > 0 && (
              <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                Trend
              </span>
            )}
          </div>

          <div className="h-64 w-full pt-2">
            {monthlyPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyPerformance} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 5.0]} tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0F172A", borderRadius: "8px", border: "none", color: "#FFF", fontSize: "12px" }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="deliverables" stroke={COLORS.primary} strokeWidth={3} dot={{ r: 4 }} name="Milestone Deliverables" />
                  <Line yAxisId="right" type="monotone" dataKey="rating" stroke={COLORS.gold} strokeWidth={2} strokeDasharray="4 4" dot={{ r: 4 }} name="Client Rating" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>

      {/* ── 3. Secondary Charts Grid (Row 2: Project Type Donut + Rating Breakdown & Radar) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 3: Project Type Distribution (Donut / Pie Chart) */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers size={18} className="text-indigo-600" />
            Project Specialization Distribution
          </h3>
          <p className="text-xs text-slate-500">Breakdown of delivered projects across domain sectors.</p>

          <div className="h-56 w-full">
            {projectTypeDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectTypeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {projectTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0F172A", borderRadius: "8px", border: "none", color: "#FFF", fontSize: "12px" }}
                    formatter={(val, name) => [`${val} Projects`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState />
            )}
          </div>

          {projectTypeDistribution.length > 0 && (
            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
              {projectTypeDistribution.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color || PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-slate-600 truncate font-medium">{item.name}</span>
                  <span className="font-bold text-slate-900 ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chart 4: Client Rating Radar / Competency Metrics */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500" />
            Client Review Dimensions
          </h3>
          <p className="text-xs text-slate-500">Multi-dimensional rating across quality, timing, and communication.</p>

          <div className="h-56 w-full">
            {ratings ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius={70} data={radarRatingData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#475569", fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} />
                  <Radar name="Score" dataKey="score" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.4} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0F172A", borderRadius: "8px", border: "none", color: "#FFF", fontSize: "12px" }}
                    formatter={(val) => [`${val} / 5.0`, "Score"]}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState />
            )}
          </div>

          {ratings && (
            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 text-center">
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="text-[10px] text-slate-500 block">Quality Score</span>
                <span className="font-bold text-slate-900">
                  {ratings.quality != null ? `${ratings.quality} / 5.0` : "—"}
                </span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="text-[10px] text-slate-500 block">Timeliness Score</span>
                <span className="font-bold text-slate-900">
                  {ratings.timeliness != null ? `${ratings.timeliness} / 5.0` : "—"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Chart 5: Rating Star Distribution (Bar Breakdown) */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Star size={18} className="text-emerald-600" />
              Rating Distribution
            </h3>
          </div>
          <p className="text-xs text-slate-500">Distribution of client star ratings across all projects.</p>

          {ratings?.distribution?.length > 0 ? (
            <>
              <div className="space-y-3 pt-2">
                {ratings.distribution.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <span className="font-bold text-slate-700 w-12 text-right shrink-0">{item.star}</span>
                    <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all"
                        style={{ width: `${item.percentage || 0}%` }}
                      />
                    </div>
                    <span className="text-slate-500 font-semibold w-8 text-right shrink-0">{item.count}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center gap-2 mt-4">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                <span>Ratings are verified post-handover through milestone escrow confirmation.</span>
              </div>
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* ── 4. Role-Specific Benchmarks & Professional Standards ── */}
      {roleSpecificMetrics?.metrics?.length > 0 && (
        <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold flex items-center gap-2 text-white">
              <RoleIcon size={18} className="text-amber-400" />
              {roleSpecificMetrics.title || `${theme.badge} Performance Overview`}
            </h3>
            <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
              Verified Standards
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            {roleSpecificMetrics.metrics.map((m, i) => (
              <div key={i} className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1">
                <span className="text-xs text-slate-400 block font-medium">{m.label}</span>
                <span className="text-xl font-black text-amber-400 block">{m.value}</span>
                <span className="text-[11px] text-slate-400 block leading-tight">{m.subtitle}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 5. Portfolio Projects Grid (Below the Charts) ── */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
              <FolderKanban size={20} className="text-teal-700" />
              Featured Portfolio Works ({posts.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              High-resolution showcases of executed site blueprints, construction milestones, and interior fitouts.
            </p>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500">
            No portfolio projects published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const images = Array.isArray(post.images) ? post.images : [];
              const coverImg = images[0];

              return (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    {coverImg ? (
                      <img
                        src={coverImg}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <FolderKanban size={28} />
                      </div>
                    )}
                    <span className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {images.length} Image{images.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition line-clamp-1">
                        {post.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {post.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}</span>
                      <span className="font-semibold text-teal-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                        View Project <ChevronRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 6. Verified Client Reviews (Below the Portfolio) ── */}
      <div className="space-y-6 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
              <Star size={20} className="text-amber-500 fill-amber-500" />
              Verified Client Reviews ({verifiedReviewsList.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Authentic feedback and ratings from clients on DesignConnect projects.
            </p>
          </div>
        </div>

        {verifiedReviewsList.length === 0 ? (
          <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500">
            No client reviews posted yet. Reviews appear automatically upon milestone release and project completion.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {verifiedReviewsList.map((rev) => (
              <div key={rev.id} className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                      {rev.reviewer?.name ? rev.reviewer.name.charAt(0) : "C"}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{rev.reviewer?.name || "Verified Client"}</span>
                      <span className="text-[11px] text-slate-500">
                        {rev.project?.title || ""}
                      </span>
                    </div>
                  </div>

                  {rev.rating != null && (
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200 text-xs font-bold shrink-0">
                      <Star size={12} className="fill-amber-500 text-amber-500" />
                      <span>{rev.rating} / 5.0</span>
                    </div>
                  )}
                </div>

                {rev.title && <h5 className="text-xs font-bold text-slate-800">{rev.title}</h5>}
                {rev.comment && <p className="text-xs text-slate-600 leading-relaxed italic">"{rev.comment}"</p>}

                {/* Sub-ratings — only shown when the API actually provides them */}
                {(rev.qualityRating != null ||
                  rev.timelinessRating != null ||
                  rev.communicationRating != null ||
                  rev.budgetRating != null) && (
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                    <div>
                      <span className="block text-slate-400">Quality</span>
                      <span className="font-bold text-slate-800">{rev.qualityRating ?? "—"}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Timing</span>
                      <span className="font-bold text-slate-800">{rev.timelinessRating ?? "—"}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Comms</span>
                      <span className="font-bold text-slate-800">{rev.communicationRating ?? "—"}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Budget</span>
                      <span className="font-bold text-slate-800">{rev.budgetRating ?? "—"}</span>
                    </div>
                  </div>
                )}

                {rev.reply && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs mt-2 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">Specialist Response:</span>
                    <p className="text-slate-600 italic text-[11px]">"{rev.reply}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Portfolio Project Preview Modal ── */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{selectedPost.title}</h3>
              <button
                onClick={() => setSelectedPost(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {selectedPost.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {(selectedPost.images || []).map((img, idx) => (
                <div key={idx} className="aspect-video rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                  <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
              >
                Close Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}