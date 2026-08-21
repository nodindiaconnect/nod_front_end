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
} from "lucide-react";
import { toast } from "react-toastify";
import BidsTab from "./BidsTab";
import ProjectTeamTab from "./ProjectTeamTab";
import ChatWorkspace from "./ChatWorkspace";
import ReviewCard from "./ReviewCard";
import SubmitReviewModal from "./SubmitReviewModal";
import {
  useGetProjectByIdQuery,
  useGetProjectTeamQuery,
  useUpdateProjectAvailabilityMutation,
  useTransitionProjectStatusMutation,
} from "../../dashboardPages/client/Dashboard/overpageApiSlice";
import { useGetProjectReviewsQuery } from "../../../ApiSliceComponent/reviewApiSlice";
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
  !v ? "" : v.split("_").map((w) => w[0] + w.slice(1).toLowerCase()).join(" ");

export default function ProjectWorkspace({
  projectId,
  initialTab = "overview",
  onBack,
}) {
  const currentUser = getCurrentUser() || {};
  const isClient = currentUser.role === 1;

  const [activeTab, setActiveTab] = useState(initialTab);
  const [chatDirectRecipient, setChatDirectRecipient] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);

  // Queries
  const {
    data: projectRes,
    isLoading: loadingProject,
    refetch: refetchProject,
  } = useGetProjectByIdQuery(projectId, { skip: !projectId });

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


  // Mutations
  const [updateAvailability, { isLoading: isUpdatingAvailability }] =
    useUpdateProjectAvailabilityMutation();
  const [transitionStatus, { isLoading: isTransitioningStatus }] =
    useTransitionProjectStatusMutation();

  const project = projectRes?.data || null;
  const teamMembers = teamRes?.data || [];

  const handleAvailabilityToggle = async () => {
    if (!project) return;
    const nextStatus = project.availabilityStatus === "OPEN" ? "CLOSED" : "OPEN";
    try {
      await updateAvailability({ projectId: project.id, status: nextStatus }).unwrap();
      toast.success(
        nextStatus === "OPEN"
          ? "Project published for bidding"
          : "Project bidding closed"
      );
      refetchProject();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update project availability");
    }
  };

  const handleStatusTransition = async (targetStatus) => {
    if (!project) return;
    try {
      await transitionStatus({
        projectId: project.id,
        status: targetStatus,
      }).unwrap();
      toast.success(`Project status updated to ${formatEnumLabel(targetStatus)}`);
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
          The requested project workspace could not be located or has been archived.
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

          {/* Quick Metrics Badge */}
          <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-3 flex-shrink-0 bg-white/70 backdrop-blur-sm p-4 rounded-md border border-border/80">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted font-bold lg:text-right">
                Estimated Budget
              </div>
              <div
                className="text-xl font-bold text-heading lg:text-right"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                ₹{project.budgetMin?.toLocaleString("en-IN")} – ₹{project.budgetMax?.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="text-xs text-muted lg:text-right flex items-center gap-1">
              <Calendar size={13} />
              <span>
                {new Date(project.startDate).toLocaleDateString()} to {new Date(project.completionDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Project Status Flow Bar */}
        <div className="mt-6 pt-5 border-t border-border/70">
          <div className="hidden sm:grid grid-cols-5 gap-2">
            {STATUS_FLOW.map((step, idx) => {
              const isPast = idx < currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;

              return (
                <div key={step.key} className="flex flex-col items-center text-center">
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
      </div>

      {/* Main Workspace Navigation Tabs */}
      <div className="border-b border-border flex items-center gap-1 overflow-x-auto">
        {[
          { key: "overview", label: "Overview", icon: FileText },
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
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Detailed Specs */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Description */}
              <div className="bg-white rounded-lg p-6 border border-border shadow-xs">
                <h3
                  className="text-base font-bold text-heading uppercase tracking-wider mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Project Scope & Description
                </h3>
                <p className="text-sm text-text leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>

                {project.additionalNotes && (
                  <div className="mt-4 p-3.5 bg-[var(--background-secondary)] rounded-md border border-border text-xs text-muted">
                    <span className="font-semibold text-heading block mb-1">Additional Notes:</span>
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
                    <span className="text-muted block uppercase text-[10px] font-bold">Property Size</span>
                    <span className="text-sm font-bold text-heading">{project.propertySize} sq.ft</span>
                  </div>

                  <div className="p-3 bg-[var(--background-secondary)]/60 rounded border border-border/50">
                    <span className="text-muted block uppercase text-[10px] font-bold">Floors</span>
                    <span className="text-sm font-bold text-heading">{project.numberOfFloors ?? "—"}</span>
                  </div>

                  <div className="p-3 bg-[var(--background-secondary)]/60 rounded border border-border/50">
                    <span className="text-muted block uppercase text-[10px] font-bold">Bedrooms / Baths</span>
                    <span className="text-sm font-bold text-heading">
                      {project.numberOfBedrooms ?? 0} Beds / {project.numberOfBathrooms ?? 0} Baths
                    </span>
                  </div>

                  <div className="p-3 bg-[var(--background-secondary)]/60 rounded border border-border/50">
                    <span className="text-muted block uppercase text-[10px] font-bold">Design Style</span>
                    <span className="text-sm font-bold text-heading">
                      {(project.designStyle || []).map(formatEnumLabel).join(", ") || "Flexible"}
                    </span>
                  </div>

                  <div className="p-3 bg-[var(--background-secondary)]/60 rounded border border-border/50">
                    <span className="text-muted block uppercase text-[10px] font-bold">Space Requirements</span>
                    <span className="text-sm font-bold text-heading">
                      {(project.spaceRequirements || []).map(formatEnumLabel).join(", ") || "Standard"}
                    </span>
                  </div>

                  <div className="p-3 bg-[var(--background-secondary)]/60 rounded border border-border/50">
                    <span className="text-muted block uppercase text-[10px] font-bold">Involvement Mode</span>
                    <span className="text-sm font-bold text-heading">
                      {formatEnumLabel(project.clientInvolvement) || "Standard Check-ins"}
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
                      (m) => m.role === service && m.status === "ACTIVE"
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
                            <CheckCircle2 size={16} className="text-[var(--success)]" />
                          ) : (
                            <Clock size={16} className="text-[var(--warning)]" />
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
                      {project.preferredWorkingHours || "Standard Business Hours"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Site Visit:</span>
                    <span className="font-semibold text-heading">
                      {project.siteVisitRequired ? "Required" : "Not Mandatory"}
                    </span>
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
                  Verified reviews submitted by clients and team specialists for this project.
                </p>
              </div>

              <button
                onClick={() => {
                  setReviewTarget({
                    projectId: project.id,
                    projectTitle: project.title,
                    revieweeId: isClient ? teamMembers[0]?.userId : project.clientId,
                    revieweeName: isClient ? teamMembers[0]?.user?.name : project.client?.name,
                    revieweeRole: isClient ? teamMembers[0]?.role : "CLIENT",
                  });
                  setIsReviewModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold text-white transition shadow-xs"
                style={{ backgroundColor: "var(--primary)" }}
              >
                <Star size={13} className="fill-white" /> Leave Review
              </button>
            </div>

            {loadingReviews ? (
              <div className="p-8 text-center text-xs text-muted">Loading project reviews...</div>
            ) : projectReviews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-border p-6">
                <Star size={36} className="mx-auto text-muted opacity-30 mb-2" />
                <h4 className="text-sm font-bold text-heading">No Reviews Submitted Yet</h4>
                <p className="text-xs text-muted mt-1 max-w-xs mx-auto">
                  Once milestones are delivered, submit a review to recognize the quality and performance of your collaborators.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {projectReviews.map((rev) => (
                  <ReviewCard key={rev.id} review={rev} isRecipientView={false} />
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
          onClose={() => {
            setIsReviewModalOpen(false);
            setReviewTarget(null);
          }}
          onSuccess={() => {
            refetchReviews();
          }}
        />
      )}
    </div>
  );
}

