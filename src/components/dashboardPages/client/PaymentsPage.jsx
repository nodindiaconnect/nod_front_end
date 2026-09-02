import React, { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Download,
  Filter,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Sparkles,
  FileText,
} from "lucide-react";
import { toast } from "react-toastify";
import { useListProjectsQuery } from "./Dashboard/overpageApiSlice";
import {
  useGetMyPaymentsQuery,
  useGetProjectInvoicesQuery,
} from "../../../ApiSliceComponent/biddingApiSlice";
import MilestonesTracker from "../../dashboard/shared/MilestonesTracker";
import InvoiceModal from "../../dashboard/shared/InvoiceModal";

export default function PaymentsPage() {
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewingInvoice, setViewingInvoice] = useState(null);

  const { data: projectsData, isLoading: isLoadingProjects } = useListProjectsQuery({ page: 1, limit: 50 });

  const { data: paymentsData, isLoading: isLoadingPayments, refetch: refetchPayments } = useGetMyPaymentsQuery();

  const projects = Array.isArray(projectsData?.data) ? projectsData.data : projectsData?.data?.projects || [];
  const activeProjectId = selectedProjectId || (projects.length > 0 ? projects[0].id : null);
  const activeProject = projects.find((p) => p.id === activeProjectId);

  const { data: projectInvoicesData } = useGetProjectInvoicesQuery(activeProjectId, {
    skip: !activeProjectId,
  });
  const projectInvoices = projectInvoicesData?.data || [];

  const payments = paymentsData?.data?.payments || [];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  // Compute summary metrics
  const totalVolume = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalCaptured = payments
    .filter((p) => p.status === "CAPTURED")
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalPending = payments
    .filter((p) => p.status === "CREATED" || p.status === "AUTHORIZED")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-8 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-heading tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Payments & Milestone Escrow
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Manage contract milestones, approve completed deliverables, and release secure Razorpay payments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 bg-[var(--gold)]/15 border border-[var(--gold)]/30 rounded-full text-xs font-bold text-[var(--heading)] flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-[var(--primary)]" /> 100% Milestone-Protected Escrow
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-border rounded-lg shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Total Disbursed</span>
            <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <p className="text-2xl font-black text-heading">{formatCurrency(totalCaptured)}</p>
          <span className="text-[11px] text-muted block">Released upon verified client sign-off</span>
        </div>

        <div className="p-5 bg-white border border-border rounded-lg shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Pending In Escrow</span>
            <div className="w-8 h-8 rounded-full bg-[var(--gold)]/15 text-[var(--heading)] flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <p className="text-2xl font-black text-heading">{formatCurrency(totalPending)}</p>
          <span className="text-[11px] text-muted block">Held securely until milestone approval</span>
        </div>

        <div className="p-5 bg-white border border-border rounded-lg shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Active Projects</span>
            <div className="w-8 h-8 rounded-full bg-[var(--background-secondary)] text-[var(--heading)] flex items-center justify-center">
              <Building2 size={18} />
            </div>
          </div>
          <p className="text-2xl font-black text-heading">{projects.length}</p>
          <span className="text-[11px] text-muted block">Tracked across 3-phase pipelines</span>
        </div>

        <div className="p-5 bg-white border border-border rounded-lg shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Completed Invoices</span>
            <div className="w-8 h-8 rounded-full bg-[var(--background-secondary)] text-[var(--heading)] flex items-center justify-center">
              <FileText size={18} />
            </div>
          </div>
          <p className="text-2xl font-black text-heading">{payments.length}</p>
          <span className="text-[11px] text-muted block">Full GST-compliant transaction log</span>
        </div>
      </div>

      {/* Project Selector & Milestone Schedule */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-heading" style={{ fontFamily: "var(--font-heading)" }}>
              Project Milestone Deliverables & Releases
            </h2>
            <p className="text-xs text-muted">
              Select a project to review and release funds for Architect, Contractor, and Designer deliverables.
            </p>
          </div>

          {/* Project Dropdown */}
          {projects.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted">Project:</span>
              <select
                value={activeProjectId || ""}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="text-xs font-semibold p-2 border border-border rounded-md bg-white text-heading focus:outline-none focus:border-[var(--primary)]"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.scope ? p.scope.replace(/_/g, " ") : "Project"})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Milestone Tracker Container */}
        {activeProjectId ? (
          <MilestonesTracker projectId={activeProjectId} isClient={true} />
        ) : (
          <div className="p-8 bg-slate-50 border border-dashed border-border rounded-lg text-center">
            <Building2 size={36} className="mx-auto text-muted/60 mb-2" />
            <p className="text-xs text-muted">No projects found. Create a project to start managing milestones.</p>
          </div>
        )}
      </div>

      {/* Transaction & Invoices History Table */}
      <div className="space-y-4 pt-6 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-heading" style={{ fontFamily: "var(--font-heading)" }}>
            Payment Invoices & Transaction History
          </h2>
          <span className="text-xs text-muted font-medium">Auto-updated via secure Webhook Engine</span>
        </div>

        {projectInvoices.length > 0 ? (
          <div className="bg-white border border-border rounded-lg overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--background-secondary)] text-muted uppercase font-bold text-[10px] tracking-wider border-b border-border">
                  <tr>
                    <th className="p-3.5">Invoice #</th>
                    <th className="p-3.5">Milestone Description</th>
                    <th className="p-3.5">Milestone Share</th>
                    <th className="p-3.5">Amount (INR)</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Date Paid</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-heading">
                  {projectInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-3.5 font-mono text-[11px] font-bold text-[var(--primary)]">
                        {inv.invoiceNumber}
                      </td>
                      <td className="p-3.5 font-bold text-heading">
                        {inv.milestoneTitle}
                      </td>
                      <td className="p-3.5 font-medium text-muted">
                        {inv.milestonePercentage}%
                      </td>
                      <td className="p-3.5 font-extrabold text-heading">
                        {formatCurrency(inv.totalAmountPaid)}
                      </td>
                      <td className="p-3.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                          PAID
                        </span>
                      </td>
                      <td className="p-3.5 text-muted">
                        {new Date(inv.paidAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setViewingInvoice(inv)}
                          className="px-3 py-1 bg-white border border-border hover:border-heading rounded-md font-semibold text-xs text-heading flex items-center gap-1 shadow-2xs cursor-pointer ml-auto transition"
                        >
                          <FileText size={12} className="text-primary" /> View Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : payments.length > 0 ? (
          <div className="bg-white border border-border rounded-lg overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--background-secondary)] text-muted uppercase font-bold text-[10px] tracking-wider border-b border-border">
                  <tr>
                    <th className="p-3.5">Transaction ID</th>
                    <th className="p-3.5">Milestone Description</th>
                    <th className="p-3.5">Amount (INR)</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-heading">
                  {payments.map((p) => {
                    const isCaptured = p.status === "CAPTURED";
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-3.5 font-mono text-[11px] font-bold text-[var(--primary)]">
                          {p.gatewayOrderId || p.id.slice(0, 12)}
                        </td>
                        <td className="p-3.5 font-medium">
                          {p.milestone?.title || "Project Milestone"}
                        </td>
                        <td className="p-3.5 font-extrabold text-heading">
                          {formatCurrency(p.amount)}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              isCaptured
                                ? "bg-emerald-100 text-emerald-800"
                                : p.status === "FAILED"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-muted">
                          {new Date(p.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-8 bg-white border border-border rounded-lg text-center text-xs text-muted">
            No payments or invoices recorded for this project yet.
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {viewingInvoice && (
        <InvoiceModal
          invoice={viewingInvoice}
          onClose={() => setViewingInvoice(null)}
        />
      )}
    </div>
  );
}