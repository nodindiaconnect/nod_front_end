import React, { useState } from "react"

import {
  Palette,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Wallet,
  FileText,
  Hourglass,
  PlayCircle,
  ChevronDown,
  MessageCircle,
  ClipboardList,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useGetUserDetailsQuery, useListProjectsQuery } from "./overpageApiSlice"
import Table from "../../../../global/Table"
import Loader from "../../../../global/Loader"

const C = {
  primary: "var(--primary)",
  primaryHover: "var(--primary-hover)",
  gold: "var(--gold)",
  goldHover: "var(--gold-hover)",
  background: "var(--background)",
  surface: "var(--surface)",
  backgroundSecondary: "var(--background-secondary)",
  heading: "var(--heading)",
  text: "var(--text)",
  muted: "var(--muted)",
  border: "var(--border)",
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
}

const GAP = "gap-4 lg:gap-5"
const PAD = "p-5"

const STATUS_STYLE = {
  WAITING_FOR_QUOTATIONS: { label: "Waiting Quotations", color: C.warning },
  PROPOSALS_RECEIVED: { label: "Proposals Received", color: C.gold },
  IN_PROGRESS: { label: "Active", color: C.primary },
  COMPLETED: { label: "Completed", color: C.success },
  CANCELLED: { label: "Cancelled", color: C.danger },
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-md px-3 py-2 text-xs shadow-lg"
      style={{ background: C.heading, color: C.surface, fontFamily: "var(--font-body)" }}
    >
      <div className="font-semibold mb-0.5">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="tabular-nums">
          {p.name}: {p.value.toLocaleString("en-IN")}
        </div>
      ))}
    </div>
  )
}

export default function ClientDashboard() {
  const [statusFilter, setStatusFilter] = useState("")

  const { data: userRes, isLoading, error, refetch } = useGetUserDetailsQuery()
  const { data: projectsRes, isFetching: projectsLoading } = useListProjectsQuery(
    statusFilter ? { status: statusFilter } : {}
  )

  const u = userRes?.data || {}
  const ps = u.projectStats || {}
  const projects = projectsRes?.data || []

  if (isLoading) {
    return (
      <Loader />
    )
  }

  if (error) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center gap-3 p-8" style={{ background: C.background }}>
        <p style={{ color: C.danger, fontFamily: "var(--font-body)" }}>Failed to load dashboard.</p>
        <button
          onClick={() => refetch()}
          className="text-xs px-3 py-1.5 rounded-md font-semibold uppercase tracking-wide"
          style={{ background: C.primary, color: C.surface, fontFamily: "var(--font-body)" }}
        >
          Retry
        </button>
      </div>
    )
  }

  const totalCount = Number(ps.totalProjects) || 0
  const maxStat = Math.max(totalCount, 1)

  const projectCards = [
    { icon: Palette, label: "Total Projects", value: ps.totalProjects ?? 0, color: C.heading },
    { icon: Hourglass, label: "Pending Projects", value: ps.pendingProjects ?? 0, color: C.warning },
    { icon: PlayCircle, label: "Active Projects", value: ps.activeProjects ?? 0, color: C.success },
    { icon: CheckCircle2, label: "Completed Projects", value: ps.completedProjects ?? 0, color: C.primary },
    { icon: XCircle, label: "Cancelled Projects", value: ps.cancelledProjects ?? 0, color: C.danger },
  ]

  const statusBreakdown = [
    { name: "Pending", value: Number(ps.pendingProjects) || 0, color: C.warning },
    { name: "Active", value: Number(ps.activeProjects) || 0, color: C.primary },
    { name: "Completed", value: Number(ps.completedProjects) || 0, color: C.success },
    { name: "Cancelled", value: Number(ps.cancelledProjects) || 0, color: C.danger },
  ].filter((d) => d.value > 0)

  const topSlice = statusBreakdown.length
    ? statusBreakdown.reduce((a, b) => (b.value > a.value ? b : a))
    : null

  const donutPercent = topSlice && totalCount > 0 ? Math.round((topSlice.value / totalCount) * 100) : 0

  const projectBars = [
    { name: "Total", value: Number(ps.totalProjects) || 0 },
    { name: "Pending", value: Number(ps.pendingProjects) || 0 },
    { name: "Active", value: Number(ps.activeProjects) || 0 },
    { name: "Completed", value: Number(ps.completedProjects) || 0 },
    { name: "Cancelled", value: Number(ps.cancelledProjects) || 0 },
  ]

  const hasActivity = (Number(ps.activeProjects) || 0) + (Number(ps.completedProjects) || 0) > 0

  const projectColumns = [
    {
      key: "title",
      label: "Project",
      width: "24%",
      truncate: true,
      maxLines: 2,
      render: (row) => row.title || "—",
    },
    {
      key: "category",
      label: "Category",
      width: "14%",
      render: (row) => row.category?.replaceAll("_", " ") || "—",
    },
    {
      key: "budget",
      label: "Budget",
      width: "20%",
      render: (row) =>
        `₹${Number(row.budgetMin).toLocaleString("en-IN")} - ₹${Number(row.budgetMax).toLocaleString("en-IN")}`,
    },
    {
      key: "city",
      label: "City",
      width: "12%",
      render: (row) => row.city || "—",
    },
    {
      key: "status",
      label: "Status",
      width: "18%",
      render: (row) => {
        const s = STATUS_STYLE[row.status] || STATUS_STYLE.WAITING_FOR_QUOTATIONS
        return (
          <span
            className="text-[10px] px-2 py-1 rounded-md font-semibold uppercase tracking-wide inline-block"
            style={{ background: `color-mix(in srgb, ${s.color} 12%, transparent)`, color: s.color }}
          >
            {s.label}
          </span>
        )
      },
    },
    {
      key: "createdAt",
      label: "Created",
      width: "12%",
      render: (row) => new Date(row.createdAt).toLocaleDateString("en-IN"),
    },
  ]

  return (
    <div className="min-h-screen p-4 sm:p-6" style={{ background: C.background }}>
      <div
        className="rounded-md w-full overflow-hidden flex flex-col"
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          boxShadow: "0 1px 2px rgba(15, 15, 15, 0.04), 0 1px 8px rgba(15, 15, 15, 0.03)",
        }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 sm:px-6 py-5">
          {/* User Info */}
          <div className="flex items-center gap-3.5">
            <div
              className="w-14 h-14 rounded-md flex items-center justify-center shrink-0"
              style={{ background: C.backgroundSecondary }}
            >
              <span
                className="text-xl"
                style={{ color: C.heading, fontFamily: "var(--font-heading)", fontWeight: 700 }}
              >
                {(u.name?.[0] || "U").toUpperCase()}
              </span>
            </div>
            <div>
              <h1
                className="text-lg sm:text-xl leading-tight flex items-center gap-1.5"
                style={{ color: C.heading, fontFamily: "var(--font-heading)", fontWeight: 600 }}
              >
                Welcome back, {u.name?.split(" ")[0] || "there"}
                <span role="img" aria-label="wave">👋</span>
              </h1>
              <p className="text-xs sm:text-sm mt-1" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
                Track your projects and their progress in one place.
              </p>
            </div>
          </div>

          {/* Wallet */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.1em]"
                style={{ color: C.muted, fontFamily: "var(--font-body)" }}
              >
                Wallet Balance
              </p>
              <p
                className="text-xl leading-none mt-1"
                style={{ color: C.heading, fontFamily: "var(--font-heading)", fontWeight: 700 }}
              >
                ₹{(Number(u.walletBalance) || 0).toLocaleString("en-IN")}
              </p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold"
              style={{ border: `1px solid ${C.border}`, color: C.heading, fontFamily: "var(--font-body)" }}
            >
              <Wallet size={16} style={{ color: C.heading }} strokeWidth={2} />
              Wallet
            </button>
          </div>
        </div>

        {/* Stat strip */}
        <div className="px-5 sm:px-6 pb-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {projectCards.map((c) => {
              const barPct = Math.min(100, (Number(c.value) / maxStat) * 100)
              return (
                <div
                  key={c.label}
                  className="rounded-md p-4 flex flex-col gap-3.5"
                  style={{ border: `1px solid ${C.border}`, background: C.surface }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
                      style={{ background: `color-mix(in srgb, ${c.color} 14%, transparent)` }}
                    >
                      <c.icon size={16} style={{ color: c.color }} strokeWidth={2.25} />
                    </span>
                    <div className="min-w-0">
                      <div
                        className="text-xl tabular-nums leading-none"
                        style={{ color: C.heading, fontFamily: "var(--font-heading)", fontWeight: 700 }}
                      >
                        {c.value}
                      </div>
                      <span
                        className="text-[10px] font-semibold tracking-wide uppercase leading-tight block mt-1 truncate"
                        style={{ color: C.muted, fontFamily: "var(--font-body)" }}
                      >
                        {c.label}
                      </span>
                    </div>
                  </div>
                  <div className="h-1 rounded-md w-full overflow-hidden" style={{ background: C.border }}>
                    <div
                      className="h-full rounded-md"
                      style={{ width: `${barPct}%`, background: c.color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Charts + profile */}
        <div className="px-5 sm:px-6 py-5">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-[11px] font-semibold tracking-[0.14em] uppercase whitespace-nowrap"
              style={{ color: C.muted, fontFamily: "var(--font-body)" }}
            >
              Breakdown
            </span>
            <div className="h-px flex-1" style={{ background: C.border }} />
            <button
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-md shrink-0"
              style={{ border: `1px solid ${C.border}`, color: C.heading, fontFamily: "var(--font-body)" }}
            >
              This Month
              <ChevronDown size={14} style={{ color: C.muted }} />
            </button>
          </div>

          <div className={`grid grid-cols-1 xl:grid-cols-3 ${GAP} items-stretch`}>
            {/* Status split donut */}
            <div
              className={`rounded-md ${PAD} flex flex-col`}
              style={{ background: C.surface, border: `1px solid ${C.border}` }}
            >
              <span
                className="text-[11px] font-semibold tracking-[0.1em] uppercase block mb-4"
                style={{ color: C.muted, fontFamily: "var(--font-body)" }}
              >
                Project Status Split
              </span>
              {statusBreakdown.length > 0 ? (
                <>
                  <div className="relative">
                    <ResponsiveContainer width="100%" height={216}>
                      <PieChart>
                        <Tooltip content={<CustomTooltip />} />
                        <Pie
                          data={statusBreakdown}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={68}
                          outerRadius={95}
                          paddingAngle={3}
                          stroke="none"
                        >
                          {statusBreakdown.map((d) => (
                            <Cell key={d.name} fill={d.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span
                        className="text-2xl"
                        style={{ color: C.heading, fontFamily: "var(--font-heading)", fontWeight: 700 }}
                      >
                        {donutPercent}%
                      </span>
                      <span className="text-xs" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
                        {topSlice?.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    {statusBreakdown.map((d) => (
                      <div key={d.name} className="flex items-center justify-between text-xs" style={{ fontFamily: "var(--font-body)" }}>
                        <span className="flex items-center gap-1.5" style={{ color: C.text }}>
                          <span className="w-2.5 h-2.5 rounded-md inline-block" style={{ background: d.color }} />
                          {d.name}
                        </span>
                        <span className="tabular-nums" style={{ color: C.muted }}>
                          {d.value} ({totalCount > 0 ? Math.round((d.value / totalCount) * 100) : 0}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-sm" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
                  No projects yet
                </div>
              )}
            </div>

            {/* Pipeline bar chart */}
            <div
              className={`rounded-md ${PAD} flex flex-col`}
              style={{ background: C.surface, border: `1px solid ${C.border}` }}
            >
              <span
                className="text-[11px] font-semibold tracking-[0.1em] uppercase block mb-4"
                style={{ color: C.muted, fontFamily: "var(--font-body)" }}
              >
                Project Pipeline
              </span>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={projectBars} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: C.muted, fontSize: 10, fontFamily: "var(--font-body)" }}
                    axisLine={{ stroke: C.border }}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fill: C.muted, fontSize: 11, fontFamily: "var(--font-body)" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    width={32}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: C.backgroundSecondary }} />
                  <Bar dataKey="value" name="Count" fill={C.primary} radius={[6, 6, 0, 0]} maxBarSize={40}>
                    {projectBars.map((b) => (
                      <Cell key={b.name} fill={b.name === "Total" ? C.heading : C.gold} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Encouragement / status card */}
            <div
              className={`rounded-md ${PAD} flex flex-col items-center justify-center text-center gap-3`}
              style={{ background: C.backgroundSecondary, border: `1px solid ${C.border}` }}
            >
              <div className="relative">
                <span
                  className="w-16 h-16 rounded-md flex items-center justify-center"
                  style={{ background: `color-mix(in srgb, ${C.gold} 16%, transparent)` }}
                >
                  <ClipboardList size={26} style={{ color: C.gold }} strokeWidth={1.75} />
                </span>
                <Sparkles size={14} className="absolute -top-1 -left-2" style={{ color: C.gold }} />
                <Sparkles size={10} className="absolute -bottom-1 -right-2" style={{ color: C.gold }} />
              </div>
              <h3
                className="text-base"
                style={{ color: C.heading, fontFamily: "var(--font-heading)", fontWeight: 700 }}
              >
                {hasActivity ? "Nice Progress!" : "Keep Going!"}
              </h3>
              <p className="text-xs leading-relaxed max-w-[220px]" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
                {hasActivity
                  ? "Your projects are moving. Keep track of updates as they progress."
                  : "You have no active or completed projects yet. Start working on projects and track your progress here."}
              </p>
            
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}