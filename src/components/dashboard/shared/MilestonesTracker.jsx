import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  CreditCard,
  Shield,
  Layers,
  Upload,
  Info,
  Sparkles,
  Lock,
  ArrowUpRight,
  Wallet,
  Building,
  RotateCcw,
  AlertCircle,
  FileText,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  ShieldCheck,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetProjectMilestonesQuery,
  useGetProjectEscrowQuery,
  useGetPlatformFeeConfigQuery,
  useGetProjectPaymentSummaryQuery,
  usePayProjectMilestoneMutation,
  useGetProjectInvoicesQuery,
  useStartMilestoneMutation,
  useSubmitMilestoneMutation,
  useApproveMilestoneMutation,
  useRejectMilestoneMutation,
  useRaiseDisputeMutation,
} from "../../../ApiSliceComponent/biddingApiSlice";
import InvoiceModal from "./InvoiceModal";
import { getCurrentUser } from "../../../utils/auth";

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-300",
    icon: Clock,
  },
  IN_PROGRESS: {
    label: "In Progress",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: Clock,
  },
  SUBMITTED_FOR_REVIEW: {
    label: "Submitted (Awaiting Approval)",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-300",
    icon: FileCheck,
    pulse: true,
  },
  REVISION_REQUIRED: {
    label: "Revision Requested",
    bg: "bg-orange-50",
    text: "text-orange-800",
    border: "border-orange-200",
    icon: RotateCcw,
  },
  APPROVED: {
    label: "Approved & Escrow Released",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: CheckCircle2,
  },
  PAID: {
    label: "Paid & Escrow Released",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: CheckCircle2,
  },
  DISPUTED: {
    label: "Disputed (Locked in Escrow)",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    icon: AlertTriangle,
  },
};

export default function MilestonesTracker({
  projectId,
  isClient = true,
  currentUserId = null,
  onOpenReviewModal = null,
}) {
  // Queries
  const {
    data: paymentSummaryData,
    isLoading: isLoadingSummary,
    refetch: refetchSummary,
  } = useGetProjectPaymentSummaryQuery(projectId, { skip: !projectId });

  const {
    data: projectMilestonesData,
    isLoading: isLoadingMilestones,
    refetch: refetchMilestones,
  } = useGetProjectMilestonesQuery(projectId, { skip: !projectId });

  const {
    data: platformFeeConfigData,
  } = useGetPlatformFeeConfigQuery();

  const {
    data: invoicesData,
    refetch: refetchInvoices,
  } = useGetProjectInvoicesQuery(projectId, { skip: !projectId });

  // Mutations
  const [payProjectMilestone, { isLoading: isProcessingPayment }] =
    usePayProjectMilestoneMutation();
  const [startMilestone, { isLoading: isStarting }] = useStartMilestoneMutation();
  const [submitMilestone, { isLoading: isSubmitting }] = useSubmitMilestoneMutation();
  const [approveMilestone, { isLoading: isApproving }] = useApproveMilestoneMutation();
  const [rejectMilestone, { isLoading: isRejecting }] = useRejectMilestoneMutation();
  const [raiseDispute, { isLoading: isDisputing }] = useRaiseDisputeMutation();

  // Modals state
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [proofUrlsInput, setProofUrlsInput] = useState("");
  const [proofNotesInput, setProofNotesInput] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeDescription, setDisputeDescription] = useState("");
  const [showPayModal, setShowPayModal] = useState(false);
  const [activePayingMilestone, setActivePayingMilestone] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [isProcessingDummyGateway, setIsProcessingDummyGateway] = useState(false);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const summary = paymentSummaryData?.data || {};
  const dynamicFeeRate =
    summary.platformFeeRate ?? platformFeeConfigData?.data?.platformFeePercentage ?? 5.0;

  const totalProjectValue = summary.totalProjectValue || 0;
  const platformFeeAmount = summary.platformFeeAmount || Math.round(totalProjectValue * (dynamicFeeRate / 100));
  const totalClientPayable = summary.totalClientPayable || totalProjectValue + platformFeeAmount;
  const totalPaid = summary.totalPaid || 0;
  const remainingAmount = summary.remainingAmount || Math.max(0, totalClientPayable - totalPaid);

  const milestonesList = summary.milestones || [];
  const projectDetails = projectMilestonesData?.data || {};
  const awards = projectDetails.awards || [];
  const invoices = invoicesData?.data || [];

  const currentUser = getCurrentUser() || {};
  const isClientUser =
    Boolean(isClient) ||
    currentUser.role === 1 ||
    currentUser.role === "1" ||
    currentUser.role === "CLIENT" ||
    currentUser.accountType === "CLIENT" ||
    String(projectDetails?.clientId) === String(currentUser?.id) ||
    !currentUser?.role;

  const handleRefetchAll = () => {
    refetchSummary();
    refetchMilestones();
    refetchInvoices();
  };

  // Open Payment Confirmation Modal for a Milestone
  const handleOpenPayModal = (milestone) => {
    setActivePayingMilestone(milestone);
    setShowPayModal(true);
  };

  // Execute Dummy Payment Simulation & Backend Capture
  const handleExecutePayment = async () => {
    if (!activePayingMilestone) return;
    setIsProcessingDummyGateway(true);

    try {
      // Simulate gateway processing delay
      setTimeout(async () => {
        try {
          const res = await payProjectMilestone({
            projectId,
            milestoneSequence: activePayingMilestone.sequence,
            gatewayPaymentId: `dummy_pay_${Date.now()}`,
            idempotencyKey: `idemp_${projectId}_ms${activePayingMilestone.sequence}_${Date.now()}`,
          }).unwrap();

          setIsProcessingDummyGateway(false);
          setShowPayModal(false);
          toast.success(
            `Payment of ${formatCurrency(activePayingMilestone.totalPayable)} processed successfully!`
          );
          handleRefetchAll();

          if (res?.data?.invoice) {
            setViewingInvoice(res.data.invoice);
          }
        } catch (err) {
          setIsProcessingDummyGateway(false);
          toast.error(err?.data?.message || "Payment execution failed");
        }
      }, 1200);
    } catch (err) {
      setIsProcessingDummyGateway(false);
      toast.error(err?.data?.message || "Failed to initiate payment");
    }
  };

  // Handle Pro Starting Milestone
  const handleStartMilestone = async (milestoneId) => {
    try {
      await startMilestone(milestoneId).unwrap();
      toast.success("Milestone started! Work is now in progress.");
      handleRefetchAll();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to start milestone");
    }
  };

  // Handle Pro Submitting Proof
  const handleSubmitProof = async () => {
    if (!selectedMilestone) return;
    try {
      const urls = proofUrlsInput
        .split("\n")
        .map((u) => u.trim())
        .filter(Boolean);
      await submitMilestone({
        milestoneId: selectedMilestone.id,
        proofUrls: urls,
        notes: proofNotesInput,
      }).unwrap();
      toast.success("Milestone deliverables submitted for client approval!");
      setShowSubmitModal(false);
      setSelectedMilestone(null);
      setProofUrlsInput("");
      setProofNotesInput("");
      handleRefetchAll();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit milestone proof");
    }
  };

  // Handle Client Approving Milestone & Escrow Release
  const handleApproveMilestone = async (milestoneId, milestoneAmount) => {
    try {
      await approveMilestone(milestoneId).unwrap();
      toast.success(
        `Milestone approved! ${formatCurrency(milestoneAmount)} released from Project Escrow directly to specialist's wallet.`
      );
      handleRefetchAll();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to approve milestone");
    }
  };

  // Handle Client Rejecting Milestone
  const handleRejectMilestone = async () => {
    if (!selectedMilestone) return;
    try {
      await rejectMilestone({
        milestoneId: selectedMilestone.id,
        reason: rejectReason,
      }).unwrap();
      toast.info("Revision requested. Specialist notified to update deliverables.");
      setShowRejectModal(false);
      setSelectedMilestone(null);
      setRejectReason("");
      handleRefetchAll();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to request revision");
    }
  };

  // Handle Raising Dispute
  const handleRaiseDispute = async () => {
    if (!disputeReason.trim()) {
      toast.error("Please enter a reason for the dispute");
      return;
    }
    try {
      await raiseDispute({
        projectId,
        milestoneId: selectedMilestone?.id || null,
        reason: disputeReason,
        description: disputeDescription,
      }).unwrap();
      toast.warn("Dispute raised. Funds locked in Escrow pending admin review.");
      setShowDisputeModal(false);
      setSelectedMilestone(null);
      setDisputeReason("");
      setDisputeDescription("");
      handleRefetchAll();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to raise dispute");
    }
  };

  if (isLoadingSummary || isLoadingMilestones) {
    return (
      <div className="py-16 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[var(--muted)]">Loading Project Payment & Milestone Ledger...</p>
      </div>
    );
  }

  if (awards.length === 0 && totalProjectValue === 0) {
    return (
      <div className="p-10 bg-white border border-dashed border-[var(--border)] rounded-xl text-center space-y-3">
        <Shield size={40} className="mx-auto text-[var(--muted)] opacity-50" />
        <h4 className="text-base font-bold text-[var(--heading)]">No Contracts Awarded Yet</h4>
        <p className="text-xs text-[var(--muted)] max-w-md mx-auto">
          Once you accept a bid from an Architect, Contractor, or Interior Designer, the project payment roadmap (50% Advance, 25% Second Milestone, 25% Final Payment) will be initialized automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-xs text-[var(--text)]">
      {/* ── 1. Financial KPI Summary Header Card ── */}
      <div className="bg-white border border-[var(--border)] rounded-xl shadow-xs overflow-hidden">
        {/* Card Header */}
        <div className="p-4 sm:p-5 bg-[var(--background-secondary)]/60 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center shadow-xs">
              <Shield size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  className="text-base font-bold text-[var(--heading)]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Project Payment & Milestone Ledger
                </h3>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    summary.isFullyPaid
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : summary.isAdvancePaid
                        ? "bg-blue-100 text-blue-800 border border-blue-300"
                        : "bg-amber-100 text-amber-900 border border-amber-300"
                  }`}
                >
                  {summary.isFullyPaid
                    ? "FULLY PAID"
                    : summary.isAdvancePaid
                      ? "IN PROGRESS"
                      : "ADVANCE REQUIRED"}
                </span>
              </div>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Centralized financial source of truth with 100% escrow protection and dynamic {dynamicFeeRate}% platform fee.
              </p>
            </div>
          </div>

          {/* Quick Pay Current Actionable Due */}
          {summary.currentDueAmount > 0 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => {
                  const targetM =
                    milestonesList.find((m) => m.sequence === summary.currentMilestone && !m.isPaid) ||
                    milestonesList.find((m) => !m.isPaid);
                  if (targetM) handleOpenPayModal(targetM);
                }}
                className="px-5 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg font-bold text-xs shadow-md flex items-center gap-2 transition cursor-pointer"
              >
                <CreditCard size={15} /> Pay Now — {formatCurrency(summary.currentDueAmount)}
              </button>
            </div>
          )}
        </div>

        {/* Financial KPI Ledger Cards */}
        <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 border-b border-[var(--border)]">
          {/* Total Project Value */}
          <div className="p-3 rounded-lg bg-[var(--background-secondary)]/40 border border-[var(--border)]">
            <span className="text-[10px] uppercase font-bold text-[var(--muted)] block">
              Total Project Value
            </span>
            <span className="text-sm font-extrabold text-[var(--heading)] mt-0.5 block">
              {formatCurrency(totalProjectValue)}
            </span>
          </div>

          {/* Dynamic Platform Fee */}
          <div className="p-3 rounded-lg bg-[var(--background-secondary)]/40 border border-[var(--border)]">
            <span className="text-[10px] uppercase font-bold text-[var(--muted)] block">
              Platform Fee ({dynamicFeeRate}%)
            </span>
            <span className="text-sm font-extrabold text-[var(--heading)] mt-0.5 block">
              {formatCurrency(platformFeeAmount)}
            </span>
          </div>

          {/* Total Client Payable */}
          <div className="p-3 rounded-lg bg-[var(--background-secondary)]/40 border border-[var(--border)]">
            <span className="text-[10px] uppercase font-bold text-[var(--muted)] block">
              Total Client Payable
            </span>
            <span className="text-sm font-extrabold text-[var(--heading)] mt-0.5 block">
              {formatCurrency(totalClientPayable)}
            </span>
          </div>

          {/* Total Paid */}
          <div className="p-3 rounded-lg bg-[var(--background-secondary)]/40 border border-[var(--border)]">
            <span className="text-[10px] uppercase font-bold text-[var(--muted)] block">
              Total Paid
            </span>
            <span className="text-sm font-extrabold text-emerald-700 mt-0.5 block">
              {formatCurrency(totalPaid)}
            </span>
          </div>

          {/* Remaining Balance */}
          <div className="p-3 rounded-lg bg-[var(--background-secondary)]/40 border border-[var(--border)]">
            <span className="text-[10px] uppercase font-bold text-[var(--muted)] block">
              Remaining Due
            </span>
            <span className="text-sm font-extrabold text-amber-800 mt-0.5 block">
              {formatCurrency(remainingAmount)}
            </span>
          </div>

          {/* Escrow Held Balance */}
          <div className="p-3 rounded-lg bg-[var(--background-secondary)]/40 border border-[var(--border)]">
            <span className="text-[10px] uppercase font-bold text-[var(--muted)] block">
              Escrow Held Balance
            </span>
            <span className="text-sm font-extrabold text-[var(--primary)] mt-0.5 block">
              {formatCurrency(summary.escrowBalance || 0)}
            </span>
          </div>
        </div>

        {/* Payment Progress Bar */}
        <div className="p-4 sm:p-5 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-2/3 space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold">
              <span>Payment Progress</span>
              <span>
                {totalClientPayable > 0
                  ? Math.round((totalPaid / totalClientPayable) * 100)
                  : 0}
                % Completed
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--gold)] to-emerald-600 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    totalClientPayable > 0
                      ? Math.min(100, (totalPaid / totalClientPayable) * 100)
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Invoices Shortcut */}
          {invoices.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted font-medium">Invoices Generated:</span>
              <div className="flex gap-1.5">
                {invoices.map((inv) => (
                  <button
                    key={inv.id}
                    onClick={() => setViewingInvoice(inv)}
                    className="px-2.5 py-1 rounded bg-white border border-border hover:border-heading font-semibold text-[11px] flex items-center gap-1 shadow-2xs cursor-pointer transition"
                    title={`View ${inv.milestoneTitle}`}
                  >
                    <FileText size={12} className="text-primary" /> M{inv.milestoneSequence} Invoice
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 2. Standard 3-Step Milestone Payment Roadmap ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3
            className="text-base font-bold text-[var(--heading)] flex items-center gap-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <Layers size={18} className="text-[var(--primary)]" />
            Project Milestone Roadmap (50% / 25% / 25%)
          </h3>
          <span className="text-xs text-muted">
            Platform fee is accounted separately and never deducted from service provider payouts.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {milestonesList.map((m) => {
            const milestoneInvoice = invoices.find((inv) => inv.milestoneSequence === m.sequence);

            return (
              <div
                key={m.sequence}
                className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                  m.isPaid
                    ? "border-emerald-300 ring-1 ring-emerald-200 bg-emerald-50/10"
                    : m.isLocked
                      ? "border-slate-200 bg-slate-50/40 opacity-90"
                      : "border-[var(--gold)]/80 ring-2 ring-[var(--gold)]/20 shadow-md"
                }`}
              >
                <div>
                  {/* Step Sequence Badge + Status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/5 text-heading">
                      Step {m.sequence} • {m.percentage}% Share
                    </span>

                    {m.isPaid ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={13} /> Paid
                      </span>
                    ) : m.isLocked ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                        <Lock size={12} /> Locked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                        <Clock size={12} /> Ready to Pay
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <h4 className="text-base font-bold text-heading mb-1">{m.title}</h4>
                  <p className="text-xs text-muted mb-4 leading-relaxed">{m.subtitle}</p>

                  {/* Amount Breakdown Box */}
                  <div className="p-3.5 rounded-lg bg-[var(--background-secondary)]/50 border border-border space-y-2 mb-4">
                    <div className="flex justify-between text-xs text-muted">
                      <span>Milestone Base Value:</span>
                      <span className="font-semibold text-heading">
                        {formatCurrency(m.baseAmount)}
                      </span>
                    </div>

                    {m.platformFeeAmount > 0 && (
                      <div className="flex justify-between text-xs text-amber-800 font-medium">
                        <span>Platform Fee ({m.platformFeeRate}%):</span>
                        <span>+{formatCurrency(m.platformFeeAmount)}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-border/70 flex justify-between text-sm font-extrabold text-heading">
                      <span>Total Payable:</span>
                      <span className="text-[var(--primary)]">
                        {formatCurrency(m.totalPayable)}
                      </span>
                    </div>
                  </div>

                  {/* Prerequisites / Lock Details */}
                  {m.isLocked && m.lockReasons?.length > 0 && (
                    <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1 mb-4">
                      <div className="font-bold flex items-center gap-1">
                        <AlertCircle size={13} /> Required Before Unlocking:
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                        {m.lockReasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Milestone Bottom Actions */}
                <div className="pt-3 border-t border-border flex flex-col gap-2">
                  {/* Pay Now Button (Active / Locked) */}
                  {!m.isPaid ? (
                    <button
                      onClick={() => handleOpenPayModal(m)}
                      disabled={m.isLocked}
                      className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs ${
                        m.isLocked
                          ? "bg-slate-200 text-slate-500 border border-slate-300 cursor-not-allowed"
                          : "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-md active:scale-[0.99]"
                      }`}
                    >
                      {m.isLocked ? (
                        <>
                          <Lock size={14} /> Locked — Complete Prerequisites ({formatCurrency(m.totalPayable)})
                        </>
                      ) : (
                        <>
                          <CreditCard size={15} /> Pay Now — {formatCurrency(m.totalPayable)}
                        </>
                      )}
                    </button>
                  ) : (
                    /* View Invoice Button when Paid */
                    <button
                      onClick={() => {
                        if (milestoneInvoice) {
                          setViewingInvoice(milestoneInvoice);
                        } else {
                          setViewingInvoice({
                            invoiceNumber: `INV-NOD-2026-0000${m.sequence}`,
                            projectId,
                            clientName: currentUser.name || "Verified Project Owner",
                            clientEmail: currentUser.email || "",
                            milestoneTitle: m.title,
                            milestoneSequence: m.sequence,
                            milestonePercentage: m.percentage,
                            totalProjectValue: summary.totalProjectValue,
                            milestoneAmount: m.baseAmount,
                            platformFeeRate: m.platformFeeRate,
                            platformFeeAmount: m.platformFeeAmount,
                            totalAmountPaid: m.totalPayable,
                            remainingAmount: Math.max(0, summary.remainingAmount),
                            paidAt: m.paidAt || new Date(),
                            status: "PAID",
                          });
                        }
                      }}
                      className="w-full py-2 px-3 rounded-lg border border-border bg-white hover:bg-slate-50 text-heading font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                    >
                      <FileText size={14} className="text-[var(--primary)]" /> View & Download Invoice
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3. Awarded Specialist Milestone Execution & Verification Section ── */}
      {awards.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <h3
              className="text-base font-bold text-[var(--heading)] flex items-center gap-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <FileCheck size={18} className="text-emerald-700" />
              Specialist Contract Deliverables & Escrow Verification
            </h3>
          </div>

          <div className="space-y-4">
            {awards.map((award) => {
              const contract = award.contract;
              const milestones = contract?.milestones || [];
              const proName =
                award.bid?.architect?.user?.name ||
                award.bid?.designer?.user?.name ||
                award.bid?.contractor?.user?.name ||
                award.bid?.professional?.name ||
                "Specialist";

              return (
                <div
                  key={award.id}
                  className="bg-white rounded-xl border border-border overflow-hidden shadow-xs"
                >
                  <div className="p-4 bg-slate-50 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--primary)] text-white">
                        {award.role?.replace(/_/g, " ")}
                      </span>
                      <h4 className="font-bold text-heading text-sm">
                        {proName} • Contract: {formatCurrency(contract?.totalAmount || 0)}
                      </h4>
                    </div>
                  </div>

                  <div className="divide-y divide-border">
                    {milestones.map((ms) => {
                      const cfg = STATUS_CONFIG[ms.status] || STATUS_CONFIG.PENDING;
                      const IconComp = cfg.icon;

                      return (
                        <div
                          key={ms.id}
                          className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5 max-w-2xl">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold uppercase text-muted">
                                Phase {ms.sequence}:
                              </span>
                              <h5 className="font-bold text-heading text-sm">{ms.title}</h5>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 ${cfg.bg} ${cfg.text} border ${cfg.border}`}
                              >
                                <IconComp size={11} /> {cfg.label}
                              </span>
                            </div>
                            <p className="text-xs text-muted leading-relaxed">
                              {ms.description}
                            </p>

                            {ms.proofUrls?.length > 0 && (
                              <div className="pt-2 flex items-center gap-2 flex-wrap">
                                <span className="text-[11px] font-semibold text-heading">
                                  Submitted Proofs:
                                </span>
                                {ms.proofUrls.map((url, i) => (
                                  <a
                                    key={i}
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[11px] text-heading font-medium flex items-center gap-1 border border-border"
                                  >
                                    <ExternalLink size={11} /> Deliverable {i + 1}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                            <div className="text-right pr-2">
                              <span className="text-[10px] text-muted uppercase font-bold block">
                                Payout Amount
                              </span>
                              <span className="text-sm font-extrabold text-heading">
                                {formatCurrency(ms.amount)}
                              </span>
                            </div>

                            {/* Specialist Action: Start / Submit Deliverables */}
                            {!isClient && (
                              <div className="flex gap-2">
                                {ms.status === "PENDING" && (
                                  <button
                                    onClick={() => handleStartMilestone(ms.id)}
                                    disabled={isStarting}
                                    className="px-3.5 py-1.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold text-xs shadow-xs transition"
                                  >
                                    Start Phase
                                  </button>
                                )}
                                {["IN_PROGRESS", "REVISION_REQUIRED"].includes(ms.status) && (
                                  <button
                                    onClick={() => {
                                      setSelectedMilestone(ms);
                                      setShowSubmitModal(true);
                                    }}
                                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1"
                                  >
                                    <Upload size={13} /> Submit Deliverables
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Client Action: Approve / Reject Deliverables */}
                            {isClient && ms.status === "SUBMITTED_FOR_REVIEW" && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleApproveMilestone(ms.id, ms.amount)}
                                  disabled={isApproving}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1"
                                >
                                  <Check size={13} /> Approve & Release
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedMilestone(ms);
                                    setShowRejectModal(true);
                                  }}
                                  disabled={isRejecting}
                                  className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold text-xs shadow-2xs transition"
                                >
                                  Request Revision
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 4. Payment Execution Confirmation Modal ── */}
      {showPayModal && activePayingMilestone && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => !isProcessingDummyGateway && setShowPayModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-5 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center shadow-xs">
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-heading">
                  Confirm Milestone Payment
                </h3>
                <p className="text-xs text-muted">
                  Step {activePayingMilestone.sequence} • {activePayingMilestone.percentage}% Project Share
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between text-muted">
                <span>Milestone Description:</span>
                <span className="font-semibold text-heading text-right max-w-[200px] truncate">
                  {activePayingMilestone.title}
                </span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Milestone Amount:</span>
                <span className="font-bold text-heading">
                  {formatCurrency(activePayingMilestone.baseAmount)}
                </span>
              </div>

              {activePayingMilestone.platformFeeAmount > 0 && (
                <div className="flex justify-between text-amber-800 font-semibold">
                  <span>Platform Service Fee ({activePayingMilestone.platformFeeRate}%):</span>
                  <span>+{formatCurrency(activePayingMilestone.platformFeeAmount)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-300 flex justify-between text-sm font-extrabold text-heading">
                <span>Total Amount Due:</span>
                <span className="text-[var(--primary)] text-base">
                  {formatCurrency(activePayingMilestone.totalPayable)}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-start gap-2">
              <ShieldCheck size={16} className="shrink-0 mt-0.5" />
              <span>
                100% Escrow Protected. Funds are securely locked and released to specialists only upon verified deliverable milestones.
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowPayModal(false)}
                disabled={isProcessingDummyGateway}
                className="flex-1 py-2.5 rounded-lg border border-border bg-white text-heading font-semibold hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecutePayment}
                disabled={isProcessingDummyGateway}
                className="flex-1 py-2.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessingDummyGateway ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay {formatCurrency(activePayingMilestone.totalPayable)}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. Submit Deliverables Proof Modal ── */}
      {showSubmitModal && selectedMilestone && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setShowSubmitModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-heading">
              Submit Deliverables for {selectedMilestone.title}
            </h3>
            <p className="text-xs text-muted">
              Add links to architectural drawings, 3D renders, site inspection photos, or compliance certificates.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-heading mb-1">
                  Deliverable URLs (one per line)
                </label>
                <textarea
                  rows={3}
                  value={proofUrlsInput}
                  onChange={(e) => setProofUrlsInput(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 text-xs rounded-lg border border-border focus:border-[var(--primary)] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-heading mb-1">
                  Notes / Explanation for Client
                </label>
                <textarea
                  rows={2}
                  value={proofNotesInput}
                  onChange={(e) => setProofNotesInput(e.target.value)}
                  placeholder="Summarize the completed deliverables..."
                  className="w-full p-2.5 text-xs rounded-lg border border-border focus:border-[var(--primary)] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 justify-end">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-lg border border-border text-heading font-semibold text-xs hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitProof}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white font-bold text-xs hover:bg-[var(--primary-hover)] transition"
              >
                {isSubmitting ? "Submitting..." : "Submit to Client"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. Request Revision Modal ── */}
      {showRejectModal && selectedMilestone && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setShowRejectModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-heading">Request Milestone Revision</h3>
            <p className="text-xs text-muted">
              Explain clearly what needs to be changed or added before you can approve this phase.
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Provide constructive feedback..."
              className="w-full p-2.5 text-xs rounded-lg border border-border focus:border-[var(--primary)] focus:outline-hidden"
            />

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-lg border border-border text-heading font-semibold text-xs hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectMilestone}
                disabled={isRejecting || !rejectReason.trim()}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition"
              >
                {isRejecting ? "Submitting..." : "Send Revision Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. Official Invoice Modal View ── */}
      {viewingInvoice && (
        <InvoiceModal
          invoice={viewingInvoice}
          onClose={() => setViewingInvoice(null)}
        />
      )}
    </div>
  );
}
