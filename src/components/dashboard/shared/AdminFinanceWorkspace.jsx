import React, { useState } from "react";
import {
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  RotateCcw,
  Scale,
  FileText,
  Building,
  User,
  Filter,
  Search,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetAdminFinancialOverviewQuery,
  useGetAdminProjectEscrowsQuery,
  useGetAdminDisputesQuery,
  useResolveDisputeMutation,
  useGetPlatformRevenueQuery,
  useGetPlatformFeeConfigQuery,
  useUpdatePlatformFeeConfigMutation,
} from "../../../ApiSliceComponent/biddingApiSlice";

export default function AdminFinanceWorkspace() {
  const [activeTab, setActiveTab] = useState("overview"); // overview | escrows | disputes | platformFee
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolutionDecision, setResolutionDecision] = useState("RELEASE_TO_PRO");
  const [releaseAmountPro, setReleaseAmountPro] = useState("");
  const [refundAmountClient, setRefundAmountClient] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [editingFeePercentage, setEditingFeePercentage] = useState("");

  const { data: overviewData, isLoading: isLoadingOverview, refetch: refetchOverview } =
    useGetAdminFinancialOverviewQuery();
  const { data: escrowsData, isLoading: isLoadingEscrows, refetch: refetchEscrows } =
    useGetAdminProjectEscrowsQuery({ page: 1, limit: 50 });
  const { data: disputesData, isLoading: isLoadingDisputes, refetch: refetchDisputes } =
    useGetAdminDisputesQuery({ page: 1, limit: 50 });
  const { data: platformRevData, isLoading: isLoadingRev, refetch: refetchRev } =
    useGetPlatformRevenueQuery({ page: 1, limit: 50 });
  const { data: platformFeeData, refetch: refetchPlatformFee } =
    useGetPlatformFeeConfigQuery();

  const [resolveDispute, { isLoading: isResolving }] = useResolveDisputeMutation();
  const [updatePlatformFee, { isLoading: isUpdatingFee }] = useUpdatePlatformFeeConfigMutation();

  const overview = overviewData?.data || {};
  const escrows = escrowsData?.data?.escrows || [];
  const disputes = disputesData?.data?.disputes || [];
  const revenues = platformRevData?.data?.revenues || [];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handleOpenResolveModal = (dispute) => {
    setSelectedDispute(dispute);
    setResolutionDecision("RELEASE_TO_PRO");
    setReleaseAmountPro(dispute.disputedAmount || 0);
    setRefundAmountClient(0);
    setAdminNotes("");
    setShowResolveModal(true);
  };

  const handleExecuteResolution = async () => {
    if (!selectedDispute) return;
    try {
      await resolveDispute({
        disputeId: selectedDispute.id,
        decision: resolutionDecision,
        releaseAmountPro: Number(releaseAmountPro) || 0,
        refundAmountClient: Number(refundAmountClient) || 0,
        adminNotes,
      }).unwrap();

      toast.success("Dispute resolved successfully!");
      setShowResolveModal(false);
      setSelectedDispute(null);
      refetchOverview();
      refetchDisputes();
      refetchEscrows();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to resolve dispute");
    }
  };

  return (
    <div className="space-y-6 text-xs text-[var(--text)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-[var(--heading)]" style={{ fontFamily: "var(--font-heading)" }}>
              Platform Escrow & Financial Management
            </h2>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[var(--gold)]/15 text-[var(--heading)] font-bold border border-[var(--gold)]/30">
              Admin Master Ledger
            </span>
          </div>
          <p className="text-xs text-[var(--muted)] mt-1">
            Real-time oversight of dedicated project escrow accounts, 5% platform fees, milestone payouts, and dispute mediation.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)] self-start sm:self-auto">
          {[
            { id: "overview", label: "Overview & KPIs" },
            { id: "escrows", label: `Project Escrows (${escrows.length})` },
            { id: "disputes", label: `Disputes (${disputes.length})` },
            { id: "platformFee", label: "5% Platform Revenue" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white text-[var(--primary)] shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--heading)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Overview KPIs Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Project Volume */}
            <div className="p-5 bg-white border border-[var(--border)] rounded-xl shadow-xs space-y-2">
              <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Total Gross Project Volume</span>
              <div className="text-2xl font-black text-[var(--heading)]">
                {formatCurrency(overview.totalProjectVolume || 0)}
              </div>
              <span className="text-[11px] text-[var(--muted)] block">Across {overview.totalEscrowAccounts || 0} project escrow accounts</span>
            </div>

            {/* 5% Platform Revenue */}
            <div className="p-5 bg-white border border-[var(--border)] rounded-xl shadow-xs space-y-2">
              <span className="text-[10px] uppercase font-bold text-[var(--muted)]">5% Platform Fee Revenue</span>
              <div className="text-2xl font-black text-emerald-700">
                {formatCurrency(overview.totalPlatformRevenue5Percent || 0)}
              </div>
              <span className="text-[11px] text-emerald-700/80 font-medium block">
                Recorded into Platform Account ({overview.platformFeeTransactionsCount || 0} deposits)
              </span>
            </div>

            {/* Total Escrow Held */}
            <div className="p-5 bg-white border border-[var(--border)] rounded-xl shadow-xs space-y-2">
              <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Active Escrow Balance Held</span>
              <div className="text-2xl font-black text-[var(--primary)]">
                {formatCurrency(overview.totalEscrowBalanceHeld || 0)}
              </div>
              <span className="text-[11px] text-[var(--muted)] block">Secured for pending milestone deliverables</span>
            </div>

            {/* Released to Pros */}
            <div className="p-5 bg-white border border-[var(--border)] rounded-xl shadow-xs space-y-2">
              <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Released to Specialists</span>
              <div className="text-2xl font-black text-indigo-700">
                {formatCurrency(overview.totalReleasedToPros || 0)}
              </div>
              <span className="text-[11px] text-[var(--muted)] block">Transferred directly to pros' personal wallets</span>
            </div>
          </div>

          {/* Recent Ledger Transactions */}
          <div className="bg-white border border-[var(--border)] rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 bg-[var(--background-secondary)]/50 border-b border-[var(--border)]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--heading)]">
                Recent Escrow & Platform Transactions
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)] font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Project</th>
                    <th className="py-2.5 px-4">Type</th>
                    <th className="py-2.5 px-4">Amount</th>
                    <th className="py-2.5 px-4">User</th>
                    <th className="py-2.5 px-4">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {(overview.recentTransactions || []).map((tx) => (
                    <tr key={tx.id} className="hover:bg-[var(--background-secondary)]/20">
                      <td className="py-2.5 px-4 text-[var(--muted)]">{new Date(tx.createdAt).toLocaleDateString()}</td>
                      <td className="py-2.5 px-4 font-bold text-[var(--heading)]">{tx.escrow?.project?.title || "—"}</td>
                      <td className="py-2.5 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--background-secondary)] text-[var(--heading)] border border-[var(--border)]">
                          {tx.type.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-extrabold text-[var(--heading)]">{formatCurrency(tx.amount)}</td>
                      <td className="py-2.5 px-4 text-[var(--text)]">{tx.user?.name || "System"}</td>
                      <td className="py-2.5 px-4 text-[var(--muted)] truncate max-w-xs">{tx.description || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. Project Escrows Tab */}
      {activeTab === "escrows" && (
        <div className="bg-white border border-[var(--border)] rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 bg-[var(--background-secondary)]/50 border-b border-[var(--border)] flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--heading)]">
              All Dedicated Project Escrows
            </h4>
            <span className="text-xs text-[var(--muted)]">{escrows.length} Total Projects</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[850px]">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)] font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Project Title</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Project Value</th>
                  <th className="py-3 px-4">Initial 50%</th>
                  <th className="py-3 px-4">5% Platform Fee</th>
                  <th className="py-3 px-4">Escrow Balance</th>
                  <th className="py-3 px-4">Released</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {escrows.map((e) => (
                  <tr key={e.id} className="hover:bg-[var(--background-secondary)]/20">
                    <td className="py-3 px-4 font-bold text-[var(--heading)]">{e.project?.title}</td>
                    <td className="py-3 px-4 text-[var(--text)]">{e.project?.client?.name}</td>
                    <td className="py-3 px-4 font-extrabold text-[var(--heading)]">{formatCurrency(e.totalProjectValue)}</td>
                    <td className="py-3 px-4 text-[var(--text)]">{formatCurrency(e.initialDepositPaid)}</td>
                    <td className="py-3 px-4 text-emerald-700 font-bold">{formatCurrency(e.platformFeeAmount)}</td>
                    <td className="py-3 px-4 text-[var(--primary)] font-extrabold">{formatCurrency(e.escrowBalance)}</td>
                    <td className="py-3 px-4 text-indigo-700 font-bold">{formatCurrency(e.totalReleasedAmount)}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Disputes Tab */}
      {activeTab === "disputes" && (
        <div className="bg-white border border-[var(--border)] rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 bg-[var(--background-secondary)]/50 border-b border-[var(--border)] flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--heading)]">
              Project Disputes & Mediation
            </h4>
            <span className="text-xs text-[var(--muted)]">{disputes.length} Recorded Disputes</span>
          </div>

          {disputes.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--muted)]">No active disputes on record.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[850px]">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)] font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Project</th>
                    <th className="py-3 px-4">Raised By</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Disputed Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {disputes.map((d) => (
                    <tr key={d.id} className="hover:bg-[var(--background-secondary)]/20">
                      <td className="py-3 px-4 text-[var(--muted)]">{new Date(d.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-bold text-[var(--heading)]">{d.escrow?.project?.title}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-[var(--heading)]">{d.raisedBy?.name}</span>
                        <span className="text-[10px] text-[var(--muted)] block uppercase">({d.raisedByRole})</span>
                      </td>
                      <td className="py-3 px-4 text-[var(--text)]">{d.reason}</td>
                      <td className="py-3 px-4 font-extrabold text-rose-700">{formatCurrency(d.disputedAmount)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            d.status === "OPEN"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {d.status === "OPEN" && (
                          <button
                            onClick={() => handleOpenResolveModal(d)}
                            className="px-3 py-1 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold rounded-md text-[11px] shadow-xs cursor-pointer"
                          >
                            Resolve Dispute
                          </button>
                        )}
                        {d.status !== "OPEN" && (
                          <span className="text-[11px] text-[var(--muted)] font-medium">
                            Decision: {d.adminDecision}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 4. Platform Revenue & Dynamic Fee Configuration Tab */}
      {activeTab === "platformFee" && (
        <div className="space-y-5">
          {/* Dynamic Platform Fee Configuration Card */}
          <div className="bg-white border border-[var(--border)] rounded-xl shadow-xs p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-heading flex items-center gap-2">
                  <ShieldCheck size={16} className="text-primary" />
                  Dynamic Platform Fee Configuration
                </h4>
                <p className="text-xs text-muted mt-0.5">
                  Applied dynamically to all client project contracts and payments across the platform.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-heading">Active Rate:</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="50"
                    placeholder={String(platformFeeData?.data?.platformFeePercentage ?? 5.0)}
                    value={
                      editingFeePercentage !== ""
                        ? editingFeePercentage
                        : platformFeeData?.data?.platformFeePercentage ?? 5.0
                    }
                    onChange={(e) => setEditingFeePercentage(e.target.value)}
                    className="w-24 px-3 py-1.5 border border-border rounded-lg text-xs font-bold text-heading focus:border-primary focus:outline-hidden"
                  />
                  <span className="font-bold text-xs">%</span>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    const feeVal = parseFloat(
                      editingFeePercentage !== ""
                        ? editingFeePercentage
                        : platformFeeData?.data?.platformFeePercentage ?? 5.0
                    );
                    if (isNaN(feeVal) || feeVal < 0 || feeVal > 50) {
                      toast.error("Please enter a valid platform fee percentage (0% to 50%)");
                      return;
                    }
                    try {
                      await updatePlatformFee({ platformFeePercentage: feeVal }).unwrap();
                      toast.success(`Platform fee updated to ${feeVal}% successfully!`);
                      refetchPlatformFee();
                      refetchOverview();
                    } catch (err) {
                      toast.error(err?.data?.message || "Failed to update platform fee");
                    }
                  }}
                  disabled={isUpdatingFee}
                  className="px-4 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  {isUpdatingFee ? "Saving..." : "Save Rate"}
                </button>
              </div>
            </div>
          </div>

          {/* Platform Revenue Ledger */}
          <div className="bg-white border border-[var(--border)] rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 bg-[var(--background-secondary)]/50 border-b border-[var(--border)] flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--heading)]">
                Platform Revenue Ledger (Platform Fee Account)
              </h4>
              <span className="text-xs font-bold text-emerald-700">
                Total Collected: {formatCurrency(overview.totalPlatformRevenue5Percent || 0)}
              </span>
            </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)] font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Fee Amount (5%)</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Reference ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {revenues.map((r) => (
                  <tr key={r.id} className="hover:bg-[var(--background-secondary)]/20">
                    <td className="py-3 px-4 text-[var(--muted)]">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 font-extrabold text-emerald-700">{formatCurrency(r.amount)}</td>
                    <td className="py-3 px-4 text-[var(--text)] font-semibold">{r.source}</td>
                    <td className="py-3 px-4 text-[var(--muted)]">{r.description || "5% Platform Fee"}</td>
                    <td className="py-3 px-4 font-mono text-[10px] text-[var(--muted)]">{r.referenceId || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Admin Resolve Dispute */}
      {showResolveModal && selectedDispute && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[var(--border)] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <Scale size={18} className="text-[var(--primary)]" />
                <h4 className="text-sm font-bold text-[var(--heading)]">Mediate & Resolve Dispute</h4>
              </div>
              <button
                onClick={() => setShowResolveModal(false)}
                className="w-7 h-7 rounded-full bg-[var(--background-secondary)] text-[var(--muted)] flex items-center justify-center hover:bg-[var(--border)] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[var(--background-secondary)]/40 rounded-xl border border-[var(--border)] space-y-1 text-xs">
              <div><strong>Project:</strong> {selectedDispute.escrow?.project?.title}</div>
              <div><strong>Disputed Amount:</strong> {formatCurrency(selectedDispute.disputedAmount)}</div>
              <div><strong>Reason:</strong> {selectedDispute.reason}</div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-[var(--text)] mb-1">Resolution Decision</label>
                <select
                  value={resolutionDecision}
                  onChange={(e) => {
                    setResolutionDecision(e.target.value);
                    if (e.target.value === "RELEASE_TO_PRO") {
                      setReleaseAmountPro(selectedDispute.disputedAmount);
                      setRefundAmountClient(0);
                    } else if (e.target.value === "REFUND_TO_CLIENT") {
                      setReleaseAmountPro(0);
                      setRefundAmountClient(selectedDispute.disputedAmount);
                    }
                  }}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)]"
                >
                  <option value="RELEASE_TO_PRO">Release 100% to Professional's Wallet</option>
                  <option value="REFUND_TO_CLIENT">Refund 100% to Client</option>
                  <option value="SPLIT">Custom Split (Pro & Client)</option>
                  <option value="REJECT">Reject Dispute (No Transfer)</option>
                </select>
              </div>

              {resolutionDecision === "SPLIT" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[var(--text)] mb-1">Release to Pro (₹)</label>
                    <input
                      type="number"
                      value={releaseAmountPro}
                      onChange={(e) => setReleaseAmountPro(e.target.value)}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[var(--text)] mb-1">Refund to Client (₹)</label>
                    <input
                      type="number"
                      value={refundAmountClient}
                      onChange={(e) => setRefundAmountClient(e.target.value)}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-xs outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-[var(--text)] mb-1">Admin Resolution Notes / Justification</label>
                <textarea
                  rows={3}
                  placeholder="Explain mediation findings and rationale..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] resize-none"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setShowResolveModal(false)}
                className="px-4 py-2 border border-[var(--border)] rounded-lg text-[var(--heading)] font-semibold hover:bg-[var(--background-secondary)] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteResolution}
                disabled={isResolving}
                className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                {isResolving ? "Executing Resolution..." : "Confirm & Execute Resolution"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
