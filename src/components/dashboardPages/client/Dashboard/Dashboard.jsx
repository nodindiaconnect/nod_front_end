


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
      className="rounded-sm px-3 py-2 text-xs shadow-lg"
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
          className="text-xs px-3 py-1.5 rounded-sm font-semibold uppercase tracking-wide"
          style={{ background: C.primary, color: C.surface, fontFamily: "var(--font-body)" }}
        >
          Retry
        </button>
      </div>
    )
  }

  const projectCards = [
    { icon: Palette, label: "Total Projects", value: ps.totalProjects ?? 0 },
    { icon: Hourglass, label: "Pending Projects", value: ps.pendingProjects ?? 0 },
    { icon: FileText, label: "Active Projects", value: ps.activeProjects ?? 0 },
    { icon: CheckCircle2, label: "Completed Projects", value: ps.completedProjects ?? 0 },
    { icon: XCircle, label: "Cancelled Projects", value: ps.cancelledProjects ?? 0 },
  ]

  const statusBreakdown = [
    { name: "Pending", value: Number(ps.pendingProjects) || 0, color: C.warning },
    { name: "Active", value: Number(ps.activeProjects) || 0, color: C.primary },
    { name: "Completed", value: Number(ps.completedProjects) || 0, color: C.success },
    { name: "Cancelled", value: Number(ps.cancelledProjects) || 0, color: C.danger },
  ].filter((d) => d.value > 0)

  const projectBars = [
    { name: "Total", value: Number(ps.totalProjects) || 0 },
    { name: "Pending", value: Number(ps.pendingProjects) || 0 },
    { name: "Active", value: Number(ps.activeProjects) || 0 },
    { name: "Completed", value: Number(ps.completedProjects) || 0 },
  ]



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
            className="text-[10px] px-2 py-1 rounded-sm font-semibold uppercase tracking-wide inline-block"
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
    <div className="min-h-screen" style={{ background: C.background }}>
      <div
        className="rounded-sm w-full overflow-hidden flex flex-col"
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          boxShadow: "0 1px 2px rgba(15, 15, 15, 0.04), 0 1px 8px rgba(15, 15, 15, 0.03)",
        }}
      >
        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-5 py-3.5"
          style={{ borderBottom: `1px solid ${C.border}` }}
        >
          {/* User Info */}
          <div className="text-center sm:text-left">
            <h1
              className="text-[15px] sm:text-base leading-tight"
              style={{
                color: C.heading,
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
              }}
            >
              User :- {u.name?.split(" ")[0] || "there"}
            </h1>

            <p
              className="text-xs mt-0.5"
              style={{
                color: C.muted,
                fontFamily: "var(--font-body)",
              }}
            >
              Track your projects and their progress.
            </p>
          </div>

          {/* Wallet */}
          <div className="relative rounded-full  px-5 py-3 w-full sm:w-auto sm:min-w-[190px]">
            <div className="pr-10 text-center">
              <p
                className="text-[10px] uppercase tracking-wide"
                style={{
                  color: C.muted,
                  fontFamily: "var(--font-body)",
                }}
              >
                Wallet Balance
              </p>

              <p
                className="text-lg font-semibold leading-none mt-1"
                style={{
                  color: C.heading,
                  fontFamily: "var(--font-heading)",
                }}
              >
                ₹{(Number(u.walletBalance) || 0).toLocaleString("en-IN")}
              </p>
            </div>

            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full"
              style={{
                background: `color-mix(in srgb, ${C.gold} 12%, transparent)`,
              }}
            >
              <Wallet size={16} style={{ color: C.gold }} strokeWidth={2} />
            </span>
          </div>
        </div>
        {/* Stat strip */}
        <div
          className="px-5 py-4 flex flex-col sm:flex-row gap-4 sm:gap-5"
          style={{
            borderBottom: `1px solid ${C.border}`,
            background: C.surface,
          }}
        >
          <span
            className="text-[11px] font-semibold tracking-[0.12em] uppercase text-center sm:text-left shrink-0"
            style={{ color: C.muted, fontFamily: "var(--font-body)" }}
          >
            Projects
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 flex-1 gap-4">
            {projectCards.map((c) => (
              <div key={c.label} className="flex flex-col items-center text-center">
                <div
                  className="text-base md:text-lg tabular-nums leading-none"
                  style={{
                    color: C.heading,
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                  }}
                >
                  {c.value}
                </div>

                <span
                  className="text-[9px] sm:text-[10px] font-semibold tracking-[0.05em] uppercase leading-[1.3] mt-1.5"
                  style={{ color: C.muted, fontFamily: "var(--font-body)" }}
                >
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Charts + profile */}
        <div className="px-4 sm:px-5 py-5">
          <div className="flex items-center gap-3 mb-3.5">
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase whitespace-nowrap" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
              Breakdown
            </span>
            <div className="h-px flex-1" style={{ background: C.border }} />
          </div>

          <div className={`grid grid-cols-1 xl:grid-cols-4 ${GAP} items-start`}>


            {/* Charts */}
            <div className={`xl:col-span-3 grid grid-cols-1 lg:grid-cols-2 ${GAP}`}>
              <div className={`rounded-sm ${PAD} flex flex-col`} style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 1px 2px rgba(15, 15, 15, 0.04), 0 1px 8px rgba(15, 15, 15, 0.03)" }}>
                <span className="text-[11px] font-semibold tracking-[0.1em] uppercase block mb-4" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>Project Status Split</span>
                {statusBreakdown.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={176}>
                      <PieChart>
                        <Tooltip content={<CustomTooltip />} />
                        <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={3} stroke="none">
                          {statusBreakdown.map((d) => <Cell key={d.name} fill={d.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex items-center justify-center gap-5 mt-2 flex-wrap">
                      {statusBreakdown.map((d) => (
                        <div key={d.name} className="flex items-center gap-1.5 text-xs" style={{ color: C.text, fontFamily: "var(--font-body)" }}>
                          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: d.color }} />
                          {d.name}
                          <span className="tabular-nums" style={{ color: C.muted }}>{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-[216px] flex items-center justify-center text-sm" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>No projects yet</div>
                )}
              </div>

              <div className={`rounded-sm ${PAD} flex flex-col`} style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 1px 2px rgba(15, 15, 15, 0.04), 0 1px 8px rgba(15, 15, 15, 0.03)" }}>
                <span className="text-[11px] font-semibold tracking-[0.1em] uppercase block mb-4" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>Project Pipeline</span>
                <ResponsiveContainer width="100%" height={216}>
                  <BarChart data={projectBars} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 10, fontFamily: "var(--font-body)" }} axisLine={{ stroke: C.border }} tickLine={false} interval={0} />
                    <YAxis tick={{ fill: C.muted, fontSize: 11, fontFamily: "var(--font-body)" }} axisLine={false} tickLine={false} allowDecimals={false} width={48} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: C.backgroundSecondary }} />
                    <Bar dataKey="value" name="Count" fill={C.primary} radius={[6, 6, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


