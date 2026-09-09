import React, { useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Calendar,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertCircle,
  FolderKanban,
  FileText,
  CreditCard,
  Users,
  MessageSquare,
  Activity,
  Layers,
  Globe,
  Lock,
  Tag,
  Home,
  Palette,
  Sofa,
  ChevronRight,
  ExternalLink,
  Play,
  RotateCcw,
  Sparkles,
  Star,
  Pencil,
} from "lucide-react";
import { toast } from "react-toastify";
import BidsTab from "./BidsTab";
import ProjectTeamTab from "./ProjectTeamTab";
import ChatWorkspace from "./ChatWorkspace";
import ReviewCard from "./ReviewCard";
import SubmitReviewModal from "./SubmitReviewModal";
import MilestonesTracker from "./MilestonesTracker";
import EditProjectModal from "../../dashboardPages/client/EditProjectModal";
import ProjectDetailsModal from "../../../global/Projectdetailsmodal";
import {
  useGetProjectByIdQuery,
  useGetProjectTeamQuery,
  useUpdateProjectAvailabilityMutation,
  useTransitionProjectStatusMutation,
} from "../../dashboardPages/client/Dashboard/overpageApiSlice";
import { useGetProjectReviewsQuery } from "../../../ApiSliceComponent/reviewApiSlice";
import {
  useGetProjectBidsQuery,
  useGetProjectPaymentSummaryQuery,
} from "../../../ApiSliceComponent/biddingApiSlice";
import { getCurrentUser } from "../../../utils/auth";

const STATUS_FLOW = [
  { key: "WAITING_FOR_QUOTATIONS", label: "Waiting Quotes" },
  { key: "PROPOSALS_RECEIVED", label: "Proposals Received" },
  { key: "SELECTED", label: "Specialists Selected" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "COMPLETED", label: "Completed" },
];

const STATUS_INDEX_MAP = {
  DRAFT: 0,
  WAITING_FOR_QUOTATIONS: 0,
  PROPOSALS_RECEIVED: 1,
  SELECTED: 2,
  HIRED: 2,
  IN_PROGRESS: 3,
  COMPLETED: 4,
  CANCELLED: -1,
};

const formatEnumLabel = (v) =>
  !v
    ? ""
    : v
        .split("_")
        .map((w) => w[0] + w.slice(1).toLowerCase())
        .join(" ");

export default function ProjectWorkspace({
  projectId,
  initialTab = "overview",
  onBack,
}) {
  const currentUser = getCurrentUser() || {};
  const [activeTab, setActiveTab] = useState(initialTab);
  const [chatDirectRecipient, setChatDirectRecipient] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);

  // Queries
  const {
    data: projectRes,
    isLoading: loadingProject,
    refetch: refetchProject,
  } = useGetProjectByIdQuery(projectId, { skip: !projectId });

  const project = projectRes?.data || null;

  const isClient =
    currentUser.role === 1 ||
    currentUser.role === "1" ||
    currentUser.role === "CLIENT" ||
    currentUser.accountType === "CLIENT" ||
    String(project?.clientId) === String(currentUser?.id) ||
    !currentUser?.role;

  const {
    data: teamRes,
    isLoading: loadingTeam,
    refetch: refetchTeam,
  } = useGetProjectTeamQuery(projectId, { skip: !projectId });

  const {
    data: reviewsRes,
    isLoading: loadingReviews,
    refetch: refetchReviews,
  } = useGetProjectReviewsQuery(projectId, { skip: !projectId });

  const projectReviews = reviewsRes?.data || [];

  const { data: bidsRes, refetch: refetchBids } = useGetProjectBidsQuery(
    { projectId },
    { skip: !projectId || !isClient }
  );
  const totalBidsCount = (bidsRes?.data?.all || []).length;

  const { data: paymentSummaryRes, refetch: refetchPaymentSummary } =
    useGetProjectPaymentSummaryQuery(projectId, { skip: !projectId });
  const paymentSummary = paymentSummaryRes?.data || null;

  // Mutations
  const [updateAvailability, { isLoading: isUpdatingAvailability }] =
    useUpdateProjectAvailabilityMutation();
  const [transitionStatus, { isLoading: isTransitioningStatus }] =
    useTransitionProjectStatusMutation();

  const teamMembers = teamRes?.data || [];

  const handleAvailabilityToggle = async () => {
    if (!project) return;
    const nextStatus =
      project.availabilityStatus === "OPEN" ? "CLOSED" : "OPEN";
    try {
      await updateAvailability({
        projectId: project.id,
        status: nextStatus,
      }).unwrap();
      toast.success(
        nextStatus === "OPEN"
          ? "Project published for bidding"
          : "Project bidding closed",
      );
      refetchProject();
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to update project availability",
      );
    }
  };

  const handleStatusTransition = async (targetStatus) => {
    if (!project) return;
    try {
      await transitionStatus({
        projectId: project.id,
        status: targetStatus,
      }).unwrap();
      toast.success(
        `Project status updated to ${formatEnumLabel(targetStatus)}`,
      );
      refetchProject();
      refetchTeam();
    } catch (err) {
      toast.error(err?.data?.message || "Invalid status transition");
    }
  };

  // Open Direct Chat with user
  const handleOpenDirectChat = (recipientUserId, recipientName, bidId) => {
    setChatDirectRecipient({ id: recipientUserId, name: recipientName, bidId });
    setActiveTab("chat");
  };

  // Switch to bids tab with role filter
  const handleViewBidsForRole = (role) => {
    setActiveTab("bids");
  };

  if (loadingProject) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-muted">Loading project workspace...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-center bg-white rounded-lg border border-border">
        <Briefcase size={44} className="mx-auto text-muted opacity-40 mb-3" />
        <h3 className="text-lg font-bold text-heading">Project Not Found</h3>
        <p className="text-xs text-muted mt-1">
          The requested project workspace could not be located or has been
          archived.
        </p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-[var(--primary)] text-white text-xs rounded font-medium"
        >
          Return to Projects
        </button>
      </div>
    );
  }

  // Current user info
  const currentUserId = currentUser.id || currentUser.userId;

  // Build eligible targets for this specific project
  const projectEligibleTargets = [];
  const reviewedUserIds = new Set(
    projectReviews
      .filter((r) => r.reviewerId === currentUserId)
      .map((r) => r.revieweeId),
  );

  if (isClient) {
    teamMembers.forEach((tm) => {
      if (tm.userId !== currentUserId && !reviewedUserIds.has(tm.userId)) {
        projectEligibleTargets.push({
          projectId: project.id,
          projectTitle: project.title,
          projectCategory: project.category,
          revieweeId: tm.userId,
          revieweeName: tm.user?.name || "Specialist",
          revieweeRole: tm.role,
          revieweeProfile: tm.user?.profile,
        });
      }
    });
  } else {
    // Current user is a specialist: can review client
    if (
      project.clientId &&
      project.clientId !== currentUserId &&
      !reviewedUserIds.has(project.clientId)
    ) {
      projectEligibleTargets.push({
        projectId: project.id,
        projectTitle: project.title,
        projectCategory: project.category,
        revieweeId: project.clientId,
        revieweeName: project.client?.name || "Project Owner",
        revieweeRole: "CLIENT",
        revieweeProfile: project.client?.profile,
      });
    }
    // Also can review fellow specialists on team
    teamMembers.forEach((tm) => {
      if (tm.userId !== currentUserId && !reviewedUserIds.has(tm.userId)) {
        projectEligibleTargets.push({
          projectId: project.id,
          projectTitle: project.title,
          projectCategory: project.category,
          revieweeId: tm.userId,
          revieweeName: tm.user?.name || "Specialist",
          revieweeRole: tm.role,
          revieweeProfile: tm.user?.profile,
        });
      }
    });
  }

  const currentStatusIndex = STATUS_INDEX_MAP[project.status] ?? 0;

  return (
    <div className="w-full space-y-6">
      {/* Workspace Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-heading hover:text-[var(--primary)] transition"
        >
          <ArrowLeft size={16} /> Back to Projects List
        </button>

        <div className="flex items-center gap-2">
          {/* Project Details / Specs Button */}
          <button
            onClick={() => setIsDetailsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold bg-white border border-border text-heading hover:bg-slate-50 transition shadow-xs cursor-pointer"
          >
            <Briefcase size={13} /> Project Details
          </button>

          {/* Edit Project Button for Client */}
          {isClient && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold bg-white border border-border text-heading hover:bg-slate-50 transition shadow-xs cursor-pointer"
            >
              <Pencil size={13} /> Edit Project
            </button>
          )}

          {/* Availability Button for Client */}
          {isClient && (
            <button
              onClick={handleAvailabilityToggle}
              disabled={isUpdatingAvailability}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition ${
                project.availabilityStatus === "OPEN"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100"
                  : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
              }`}
            >
              {project.availabilityStatus === "OPEN" ? (
                <>
                  <Globe size={13} /> Bidding Open
                </>
              ) : (
                <>
                  <Lock size={13} /> Bidding Closed
                </>
              )}
            </button>
          )}

          {/* Quick status transition dropdown/action if client */}
          {isClient && project.status === "SELECTED" && (
            <button
              onClick={() => handleStatusTransition("IN_PROGRESS")}
              disabled={isTransitioningStatus}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm text-xs font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-xs transition"
            >
              <Play size={13} /> Start Project
            </button>
          )}

          {isClient && project.status === "IN_PROGRESS" && (
            <button
              onClick={() => handleStatusTransition("COMPLETED")}
              disabled={isTransitioningStatus}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm text-xs font-semibold bg-[var(--success)] text-white hover:brightness-110 shadow-xs transition"
            >
              <CheckCircle2 size={13} /> Mark Completed
            </button>
          )}
        </div>
      </div>

      {/* Project Header Banner */}
      <div
        className="rounded-lg p-6 border border-border relative overflow-hidden shadow-xs"
        style={{ backgroundColor: "var(--background-secondary)" }}
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--primary)] text-white">
                {formatEnumLabel(project.category)}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--gold)]/20 text-black">
                {formatEnumLabel(project.propertyStatus)}
              </span>
              <span className="text-xs text-muted flex items-center gap-1">
                <MapPin size={13} /> {project.city}, {project.state}
              </span>
            </div>

            <h1
              className="text-2xl sm:text-3xl font-bold text-heading"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {project.title}
            </h1>

            <p className="text-xs sm:text-sm text-text line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Quick Financial Metrics Badge & Pay Now CTA */}
          <div className="flex flex-col lg:items-end gap-2">
            {paymentSummary && paymentSummary.totalProjectValue > 0 ? (
              <div className="space-y-1 lg:text-right">
                <div className="text-[10px] uppercase tracking-wider text-muted font-bold">
                  Awarded Contract Value
                </div>
                <div className="text-base font-extrabold text-heading">
                  ₹{paymentSummary.totalProjectValue.toLocaleString("en-IN")}
                </div>
                <div className="text-[11px] font-semibold text-muted">
                  <span className="text-emerald-700">
                    Paid: ₹{paymentSummary.totalPaid.toLocaleString("en-IN")}
                  </span>{" "}
                  •{" "}
                  <span className="text-amber-800">
                    Due: ₹{paymentSummary.remainingAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted font-medium lg:text-right">
                  Estimated Budget
                </div>

                <div className="text-base font-medium text-heading lg:text-right">
                  ₹{project.budgetMin?.toLocaleString("en-IN")} – ₹
                  {project.budgetMax?.toLocaleString("en-IN")}
                </div>
              </div>
            )}

            {isClient && paymentSummary?.currentDueAmount > 0 && (
              <button
                onClick={() => setActiveTab("milestones")}
                className="mt-1 px-4 py-1.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition cursor-pointer self-start lg:self-auto"
              >
                <CreditCard size={14} /> Pay Due (₹{paymentSummary.currentDueAmount.toLocaleString("en-IN")})
              </button>
            )}
          </div>
        </div>

        {/* Visual Project Status Flow Bar */}
        <div className="mt-6 pt-5 border-t border-border/70">
          <div className="hidden sm:grid grid-cols-5 gap-2">
            {STATUS_FLOW.map((step, idx) => {
              const isPast = idx < currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;

              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-all ${
                      isPast
                        ? "bg-[var(--success)] text-white shadow-xs"
                        : isCurrent
                          ? "bg-[var(--primary)] text-white ring-4 ring-[var(--primary)]/20 shadow-sm"
                          : "bg-black/10 text-muted"
                    }`}
                  >
                    {isPast ? <CheckCircle2 size={15} /> : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wider ${
                      isCurrent
                        ? "text-[var(--primary)] font-bold"
                        : isPast
                          ? "text-heading"
                          : "text-muted"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Proposals Received Alert Banner for Client */}
        {isClient && (project?.status === "PROPOSALS_RECEIVED" || totalBidsCount > 0) && (
          <div className="mt-4 p-3.5 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-400/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-xs text-heading">
              <div className="w-8 h-8 rounded-lg bg-[var(--gold)]/20 text-black flex items-center justify-center flex-shrink-0 font-bold">
                <Sparkles size={16} className="text-amber-800" />
              </div>
              <div>
                <span className="font-bold text-heading text-sm">
                  {totalBidsCount > 0 ? `${totalBidsCount} Quotation${totalBidsCount > 1 ? "s" : ""} Received` : "Quotations Received"}
                </span>
                <span className="text-muted block text-xs mt-0.5">
                  Review specialist proposals, compare quotes, and click 'Accept & Hire' to lock in your team.
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("bids")}
              className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-lg hover:bg-[var(--primary-hover)] transition cursor-pointer shadow-xs whitespace-nowrap self-start sm:self-auto flex items-center gap-1.5"
            >
              Review & Accept Proposals <ChevronRight size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Main Workspace Navigation Tabs */}
      <div className="border-b border-border flex items-center gap-1 overflow-x-auto">
        {[
          { key: "overview", label: "Overview", icon: FileText },
          { key: "milestones", label: "Milestones & Escrow", icon: CreditCard },
          { key: "bids", label: "Proposals / Bids", icon: FolderKanban },
          { key: "team", label: "Project Team", icon: Users },
          { key: "chat", label: "Project Chat", icon: MessageSquare },
          { key: "reviews", label: "Reviews", icon: Star },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                if (tab.key !== "chat") setChatDirectRecipient(null);
              }}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition ${
                isActive
                  ? "border-[var(--primary)] text-[var(--primary)] bg-primary/5"
                  : "border-transparent text-muted hover:text-heading hover:bg-black/5"
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.key === "bids" && totalBidsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[var(--gold)] text-black text-[10px] flex items-center justify-center font-bold">
                  {totalBidsCount}
                </span>
              )}
              {tab.key === "team" && teamMembers.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[var(--primary)] text-white text-[10px] flex items-center justify-center">
                  {teamMembers.length}
                </span>
              )}
              {tab.key === "reviews" && projectReviews.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[var(--gold)] text-black text-[10px] flex items-center justify-center font-bold">
                  {projectReviews.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div>
        {/* MILESTONES & ESCROW TAB */}
        {activeTab === "milestones" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-border">
              <div>
                <h3
                  className="text-base font-bold text-heading"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Milestone Contracts & Escrow Releases
                </h3>
                <p className="text-xs text-muted">
                  Deliverable tracking and milestone payment release per
                  professional role.
                </p>
              </div>
            </div>
            <MilestonesTracker
              projectId={project.id}
              isClient={isClient}
              currentUserId={currentUserId}
              onOpenReviewModal={(award) => {
                setReviewTarget(projectEligibleTargets[0] || null);
                setIsReviewModalOpen(true);
              }}
            />
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Horizontal Multi-Phase Stepper Tracker */}
            <div className="p-5 bg-white border border-border rounded-lg shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-heading flex items-center gap-2 uppercase tracking-wider">
                    <Layers size={16} className="text-[var(--primary)]" />
                    Multi-Phase Execution Pipeline (
                    {project.scope
                      ? project.scope.replace(/_/g, " ")
                      : "Full Project"}
                    )
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    Execution proceeds sequentially across specialist
                    disciplines with independent milestone escrows.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("milestones")}
                  className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1"
                >
                  View Escrow Milestones <ChevronRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                {[
                  {
                    phaseKey: "PLANNING",
                    title: "Phase 1: Architecture & Planning",
                    roleName: "Architect",
                    roleKey: "ARCHITECT",
                    desc: "Blueprint, structural analysis, site approvals",
                  },
                  {
                    phaseKey: "CONSTRUCTION",
                    title: "Phase 2: Construction & Civil Build",
                    roleName: "Contractor",
                    roleKey: "CONTRACTOR",
                    desc: "Masonry, MEP, foundational execution",
                  },
                  {
                    phaseKey: "INTERIORS",
                    title: "Phase 3: Interior Design & Fitout",
                    roleName: "Designer",
                    roleKey: "INTERIOR_DESIGNER",
                    desc: "Joinery, decor, lighting, client handover",
                  },
                ].map((phase, idx) => {
                  const assignedMember = teamMembers.find(
                    (m) => m.role === phase.roleKey,
                  );
                  const isCurrent = project.currentPhase === phase.phaseKey;

                  return (
                    <div
                      key={phase.phaseKey}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col justify-between gap-3 ${
                        isCurrent
                          ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-xs"
                          : assignedMember
                            ? "border-emerald-300 bg-emerald-50/30"
                            : "border-slate-200 bg-slate-50/50"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/5 text-heading">
                            {phase.title.split(":")[0]}
                          </span>
                          {assignedMember ? (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Awarded
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-muted bg-slate-200 px-2 py-0.5 rounded-full">
                              Open for Bids
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-heading pt-1">
                          {phase.title.split(":")[1]}
                        </h4>
                        <p className="text-[11px] text-muted leading-tight">
                          {phase.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                        <span className="text-muted text-[11px]">
                          Specialist:
                        </span>
                        <span className="font-bold text-heading">
                          {assignedMember?.user?.name ||
                            `Hire ${phase.roleName}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Detailed Specs */}
              <div className="lg:col-span-2 space-y-6">
                {/* Project Description */}
                <div className="bg-white rounded-lg p-6 border border-border shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <h3
                      className="text-base font-bold text-heading uppercase tracking-wider"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Project Scope & Description
                    </h3>
                    <button
                      onClick={() => setIsDetailsModalOpen(true)}
                      className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      View Full Specs <ChevronRight size={13} />
                    </button>
                  </div>
                  <p className="text-sm text-text leading-relaxed whitespace-pre-line">
                    {project.description}
                  </p>

                  {project.additionalNotes && (
                    <div className="mt-4 p-3.5 bg-[var(--background-secondary)] rounded-md border border-border text-xs text-muted">
                      <span className="font-semibold text-heading block mb-1">
                        Additional Notes:
                      </span>
                      {project.additionalNotes}
                    </div>
                  )}
                </div>

                {/* Property Details Grid */}
                <div className="bg-white rounded-lg p-6 border border-border shadow-xs space-y-4">
                  <h3
                    className="text-base font-bold text-heading uppercase tracking-wider mb-3"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Property & Requirement Details
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 bg-[var(--background-secondary)]/60 rounded border border-border/50">
                      <span className="text-muted block uppercase text-[10px] font-bold">
                        Property Size
                      </span>
                      <span className="text-sm font-bold text-heading">
                        {project.propertySize} sq.ft
                      </span>
                    </div>

                    <div className="p-3 bg-[var(--background-secondary)]/60 rounded border border-border/50">
                      <span className="text-muted block uppercase text-[10px] font-bold">
                        Floors
                      </span>
                      <span className="text-sm font-bold text-heading">
                        {project.numberOfFloors ?? "—"}
                      </span>
                    </div>

                    <div className="p-3 bg-[var(--background-secondary)]/60 rounded border border-border/50">
                      <span className="text-muted block uppercase text-[10px] font-bold">
                        Bedrooms / Baths
                      </span>
                      <span className="text-sm font-bold text-heading">
                        {project.numberOfBedrooms ?? 0} Beds /{" "}
                        {project.numberOfBathrooms ?? 0} Baths
                      </span>
                    </div>

                    <div className="p-3 bg-[var(--background-secondary)]/60 rounded border border-border/50">
                      <span className="text-muted block uppercase text-[10px] font-bold">
                        Design Style
                      </span>
                      <span className="text-sm font-bold text-heading">
                        {(project.designStyle || [])
                          .map(formatEnumLabel)
                          .join(", ") || "Flexible"}
                      </span>
                    </div>

                    <div className="p-3 bg-[var(--background-secondary)]/60 rounded border border-border/50">
                      <span className="text-muted block uppercase text-[10px] font-bold">
                        Space Requirements
                      </span>
                      <span className="text-sm font-bold text-heading">
                        {(project.spaceRequirements || [])
                          .map(formatEnumLabel)
                          .join(", ") || "Standard"}
                      </span>
                    </div>

                    <div className="p-3 bg-[var(--background-secondary)]/60 rounded border border-border/50">
                      <span className="text-muted block uppercase text-[10px] font-bold">
                        Involvement Mode
                      </span>
                      <span className="text-sm font-bold text-heading">
                        {formatEnumLabel(project.clientInvolvement) ||
                          "Standard Check-ins"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Attachments Gallery */}
                {project.attachments && project.attachments.length > 0 && (
                  <div className="bg-white rounded-lg p-6 border border-border shadow-xs space-y-4">
                    <h3
                      className="text-base font-bold text-heading uppercase tracking-wider mb-2"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Floor Plans & Reference Attachments
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {project.attachments.map((att, idx) => (
                        <a
                          key={att.id || idx}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative rounded-md overflow-hidden border border-border bg-[var(--background-secondary)] aspect-video flex flex-col items-center justify-center p-2 text-center hover:border-[var(--primary)] transition"
                        >
                          <img
                            src={att.url}
                            alt={att.type}
                            className="w-full h-full object-cover rounded"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition">
                            <ExternalLink size={16} />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted mt-1 truncate max-w-full">
                            {formatEnumLabel(att.type)}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Required Services & Quick Actions */}
              <div className="space-y-6">
                {/* Required Professionals Checklist */}
                <div className="bg-white rounded-lg p-6 border border-border shadow-xs space-y-4">
                  <h3
                    className="text-base font-bold text-heading uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Required Specialists
                  </h3>

                  <div className="space-y-2.5">
                    {(project.servicesRequired || []).map((service) => {
                      const isFilled = teamMembers.some(
                        (m) => m.role === service && m.status === "ACTIVE",
                      );

                      return (
                        <div
                          key={service}
                          className={`p-3.5 rounded-md border flex items-center justify-between text-xs transition ${
                            isFilled
                              ? "border-[var(--success)] bg-[var(--success)]/5"
                              : "border-border bg-[var(--background-secondary)]/50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isFilled ? (
                              <CheckCircle2
                                size={16}
                                className="text-[var(--success)]"
                              />
                            ) : (
                              <Clock
                                size={16}
                                className="text-[var(--warning)]"
                              />
                            )}
                            <span className="font-bold text-heading">
                              {formatEnumLabel(service)}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                              isFilled
                                ? "bg-[var(--success)] text-white"
                                : "bg-[var(--warning)]/20 text-amber-800"
                            }`}
                          >
                            {isFilled ? "Hired" : "Seeking"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Client & Communication Details */}
                <div className="bg-white rounded-lg p-6 border border-border shadow-xs space-y-3 text-xs">
                  <h3
                    className="text-base font-bold text-heading uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Timeline & Communication
                  </h3>

                  <div className="space-y-2 text-muted">
                    <div className="flex justify-between py-1 border-b border-border/60">
                      <span>Target Start:</span>
                      <span className="font-semibold text-heading">
                        {new Date(project.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/60">
                      <span>Target Completion:</span>
                      <span className="font-semibold text-heading">
                        {new Date(project.completionDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/60">
                      <span>Working Hours:</span>
                      <span className="font-semibold text-heading">
                        {project.preferredWorkingHours ||
                          "Standard Business Hours"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Site Visit:</span>
                      <span className="font-semibold text-heading">
                        {project.siteVisitRequired
                          ? "Required"
                          : "Not Mandatory"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BIDS TAB */}
        {activeTab === "bids" && (
          <BidsTab
            project={project}
            onOpenChat={(proId, proName, bidId) =>
              handleOpenDirectChat(proId, proName, bidId)
            }
            onBidAccepted={() => {
              refetchProject();
              refetchTeam();
            }}
          />
        )}

        {/* TEAM TAB */}
        {activeTab === "team" && (
          <ProjectTeamTab
            project={project}
            teamMembers={teamMembers}
            isLoading={loadingTeam}
            onOpenChat={(proId, proName, bidId) =>
              handleOpenDirectChat(proId, proName, bidId)
            }
            onOpenTeamChat={() => {
              setChatDirectRecipient(null);
              setActiveTab("chat");
            }}
            onViewBidsForRole={handleViewBidsForRole}
            onOpenReview={(target) => {
              setReviewTarget(target);
              setIsReviewModalOpen(true);
            }}
          />
        )}

        {/* CHAT TAB */}
        {activeTab === "chat" && (
          <ChatWorkspace
            projectId={project.id}
            initialRecipientId={chatDirectRecipient?.id}
            initialRecipientName={chatDirectRecipient?.name}
            initialBidId={chatDirectRecipient?.bidId}
            isEmbedded={true}
          />
        )}

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-border">
              <div>
                <h3
                  className="text-base font-bold text-heading"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Project Feedback & Reviews
                </h3>
                <p className="text-xs text-muted">
                  Verified reviews submitted by clients and team specialists for
                  this project.
                </p>
              </div>

              <button
                onClick={() => {
                  setReviewTarget(projectEligibleTargets[0] || null);
                  setIsReviewModalOpen(true);
                }}
                disabled={projectEligibleTargets.length === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold text-white transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "var(--primary)" }}
              >
                <Star size={13} className="fill-white" />
                {projectEligibleTargets.length > 0
                  ? `Leave Review (${projectEligibleTargets.length} eligible)`
                  : "All Reviewed"}
              </button>
            </div>

            {loadingReviews ? (
              <div className="p-8 text-center text-xs text-muted">
                Loading project reviews...
              </div>
            ) : projectReviews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-border p-6">
                <Star
                  size={36}
                  className="mx-auto text-muted opacity-30 mb-2"
                />
                <h4 className="text-sm font-bold text-heading">
                  No Reviews Submitted Yet
                </h4>
                <p className="text-xs text-muted mt-1 max-w-xs mx-auto">
                  Once milestones are delivered, submit a review to recognize
                  the quality and performance of your collaborators.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {projectReviews.map((rev) => (
                  <ReviewCard
                    key={rev.id}
                    review={rev}
                    isRecipientView={false}
                    onReviewUpdated={() => refetchReviews()}
                    onReviewDeleted={() => refetchReviews()}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submit Review Modal */}
      {isReviewModalOpen && (
        <SubmitReviewModal
          target={reviewTarget}
          eligibleList={projectEligibleTargets}
          onClose={() => {
            setIsReviewModalOpen(false);
            setReviewTarget(null);
          }}
          onSuccess={() => {
            refetchReviews();
          }}
        />
      )}

      {/* Edit Project Modal */}
      {isEditModalOpen && project && (
        <EditProjectModal
          project={project}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdated={() => {
            refetchProject();
            refetchTeam();
          }}
        />
      )}

      {/* Project Details Modal */}
      {isDetailsModalOpen && project && (
        <ProjectDetailsModal
          project={project}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </div>
  );
}
