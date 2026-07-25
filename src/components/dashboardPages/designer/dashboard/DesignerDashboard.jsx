

import React, { useState } from "react"
import {
  Palette,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Wallet,
  FileText,
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
import { useGetDesignerUserDetailsQuery, useGetDesignerQuotationsQuery } from "./DesignerDashboardApiSlice"
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
  PENDING: { label: "Waiting Response", color: C.warning },
  ACCEPTED: { label: "Accepted", color: C.success },
  REJECTED: { label: "Rejected", color: C.danger },
  WITHDRAWN: { label: "Withdrawn", color: C.muted },
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

export default function DesignerDashboard() {
  const [quotationFilter, setQuotationFilter] = useState("")

  const { data: userRes, isLoading, error, refetch } = useGetDesignerUserDetailsQuery()
  const { data: quotationsRes, isFetching: quotationsLoading } = useGetDesignerQuotationsQuery(
    quotationFilter || undefined
  )

  const u = userRes?.data || {}
  const ps = u.projectStats || {}
  const qs = u.quotationStats || {}
  const quotations = quotationsRes?.data || []

  if (isLoading) {
    return (
      <Loader />
    )
  }

  if (error) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center gap-3 p-8" style={{ background: C.background }}>
        <p style={{ color: C.danger, fontFamily: "var(--font-body)" }}>Failed to load designer dashboard.</p>
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

  const quotationCards = [
    { icon: Send, label: "Quotations Sent", value: qs.totalQuotationsSent ?? 0, accent: "primary" },
    { icon: Clock, label: "Waiting Response", value: qs.quotationsPending ?? 0, accent: "gold" },
    { icon: CheckCircle2, label: "Accepted", value: qs.quotationsAccepted ?? 0, accent: "primary" },
    { icon: XCircle, label: "Rejected", value: qs.quotationsRejected ?? 0, accent: "gold" },
  ]

  const projectCards = [
    { icon: Palette, label: "Projects Handled", value: ps.totalProjects ?? 0 },
    { icon: FileText, label: "active Projects", value: ps.activeProjects ?? 0 },
    { icon: CheckCircle2, label: "completed Projects", value: ps.completedProjects ?? 0 },
  ]

  const quotationBreakdown = [
    { name: "Accepted", value: Number(qs.quotationsAccepted) || 0, color: C.success },
    { name: "Pending", value: Number(qs.quotationsPending) || 0, color: C.warning },
    { name: "Rejected", value: Number(qs.quotationsRejected) || 0, color: C.danger },
  ].filter((d) => d.value > 0)

  const projectBars = [
    { name: "Handled", value: Number(ps.totalProjects) || 0 },
    { name: "In Progress", value: Number(ps.activeProjects) || 0 },
    { name: "Completed", value: Number(ps.completedProjects) || 0 },
  ]

  const profileRows = [
    { icon: Mail, label: "Email", value: u.email },
    { icon: Phone, label: "Phone", value: u.phone ? `${u.countryCode} ${u.phone}` : "" },
    { icon: MapPin, label: "City", value: u.city },
    { icon: MapPin, label: "State", value: u.state },
    { icon: ShieldCheck, label: "Country", value: u.country },
  ]

  // Column definitions for the shared Table component
  const quotationColumns = [
    {
      key: "project",
      label: "Project",
      width: "26%",
      truncate: true,
      maxLines: 2,
      render: (row) => row.project?.title || "—",
    },
    {
      key: "quotedPrice",
      label: "Quoted Price",
      width: "16%",
      render: (row) => `₹${Number(row.quotedPrice).toLocaleString("en-IN")}`,
    },
    {
      key: "proposedDuration",
      label: "Duration",
      width: "16%",
      render: (row) => row.proposedDuration,
    },
    {
      key: "status",
      label: "Status",
      width: "22%",
      render: (row) => {
        const s = STATUS_STYLE[row.status] || STATUS_STYLE.PENDING
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
      label: "Sent",
      width: "20%",
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
        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div>
            <h1 className="text-[15px] sm:text-base leading-tight" style={{ color: C.heading, fontFamily: "var(--font-heading)", fontWeight: 600 }}>
              User  - {u.name?.split(" ")[0] || "there"}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
              Track quotations sent and project completion status.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="flex items-center justify-center w-7 h-7 rounded-full shrink-0" style={{ background: `color-mix(in srgb, ${C.gold} 12%, transparent)` }}>
              <Wallet size={13} style={{ color: C.gold }} strokeWidth={2} />
            </span>
            <div className="leading-tight text-right hidden sm:block">
              <div className="text-[10px] uppercase tracking-wide" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>Wallet balance</div>
              <div className="text-sm tabular-nums" style={{ color: C.heading, fontFamily: "var(--font-heading)", fontWeight: 600 }}>
                ₹{(Number(u.walletBalance) || 0).toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </div>

        {/* Combined stat strip */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2"
          style={{ borderBottom: `1px solid ${C.border}` }}
        >
          {/* Quotations */}
          <div
            className="px-5 py-4 flex flex-col sm:flex-row gap-4 sm:gap-5"
            style={{
              background: C.surface,
              borderRight: `1px solid ${C.border}`,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <span
              className="text-[11px] font-semibold tracking-[0.12em] uppercase text-center sm:text-left shrink-0"
              style={{ color: C.muted, fontFamily: "var(--font-body)" }}
            >
              Quotations
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 flex-1 gap-4">
              {quotationCards.map((c) => (
                <div key={c.label} className="flex flex-col items-center text-center">
                  <div
                    className="text-base tabular-nums leading-none"
                    style={{
                      color: C.heading,
                      fontFamily: "var(--font-heading)",
                      fontWeight: 600,
                    }}
                  >
                    {c.value}
                  </div>

                  <span
                    className="text-[9px] font-semibold tracking-[0.05em] uppercase mt-1.5"
                    style={{ color: C.muted, fontFamily: "var(--font-body)" }}
                  >
                    {c.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div
            className="px-5 py-4 flex flex-col sm:flex-row gap-4 sm:gap-5"
            style={{ background: C.surface }}
          >
            <span
              className="text-[11px] font-semibold tracking-[0.12em] uppercase text-center sm:text-left shrink-0"
              style={{ color: C.muted, fontFamily: "var(--font-body)" }}
            >
              Projects
            </span>

            <div className="grid grid-cols-3 flex-1 gap-4">
              {projectCards.map((c) => (
                <div key={c.label} className="flex flex-col items-center text-center">
                  <div
                    className="text-base tabular-nums leading-none"
                    style={{
                      color: C.heading,
                      fontFamily: "var(--font-heading)",
                      fontWeight: 600,
                    }}
                  >
                    {c.value}
                  </div>

                  <span
                    className="text-[9px] font-semibold tracking-[0.05em] uppercase mt-1.5"
                    style={{ color: C.muted, fontFamily: "var(--font-body)" }}
                  >
                    {c.label}
                  </span>
                </div>
              ))}
            </div>
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
                <span className="text-[11px] font-semibold tracking-[0.1em] uppercase block mb-4" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>Quotation Status Split</span>
                {quotationBreakdown.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={176}>
                      <PieChart>
                        <Tooltip content={<CustomTooltip />} />
                        <Pie data={quotationBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={3} stroke="none">
                          {quotationBreakdown.map((d) => <Cell key={d.name} fill={d.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex items-center justify-center gap-5 mt-2 flex-wrap">
                      {quotationBreakdown.map((d) => (
                        <div key={d.name} className="flex items-center gap-1.5 text-xs" style={{ color: C.text, fontFamily: "var(--font-body)" }}>
                          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: d.color }} />
                          {d.name}
                          <span className="tabular-nums" style={{ color: C.muted }}>{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-[216px] flex items-center justify-center text-sm" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>No quotations yet</div>
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

          {/* Quotations table */}
          <div className="mt-6">
            <div className="flex items-center justify-between gap-3 mb-3.5">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-[11px] font-semibold tracking-[0.14em] uppercase whitespace-nowrap" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
                  Quotations
                </span>
                <div className="h-px flex-1" style={{ background: C.border }} />
              </div>
              <div className="flex gap-1.5">
                {["", "PENDING", "ACCEPTED", "REJECTED"].map((s) => (
                  <button
                    key={s || "ALL"}
                    onClick={() => setQuotationFilter(s)}
                    className="text-[10px] px-2.5 py-1.5 rounded-sm font-semibold uppercase tracking-wide"
                    style={{
                      background: quotationFilter === s ? C.primary : C.backgroundSecondary,
                      color: quotationFilter === s ? C.surface : C.muted,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {s || "All"}
                  </button>
                ))}
              </div>
            </div>

            {quotationsLoading ? (
              <div className="text-center py-12 text-sm border rounded-sm" style={{ color: C.muted, borderColor: C.border, fontFamily: "var(--font-body)" }}>
                Loading…
              </div>
            ) : (
              <Table
                columns={quotationColumns}
                data={quotations}
                rowKey="id"
                emptyMessage="No quotations found"
                minWidth="640px"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

