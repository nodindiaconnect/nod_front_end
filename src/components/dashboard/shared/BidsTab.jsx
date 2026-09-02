import React, { useState } from "react";
import {
  Star,
  MessageSquare,
  Award,
  XCircle,
  Eye,
  CheckCircle2,
  Clock,
  ExternalLink,
  IndianRupee,
  User,
  Filter,
  Layers,
  ChevronRight,
  AlertTriangle,
  Info,
  CheckSquare,
  Square,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";
import CompareBidsModal from "./CompareBidsModal";
import {
  useGetProjectBidsQuery,
  useShortlistBidMutation,
  useAcceptBidMutation,
  useRejectBidMutation,
} from "../../../ApiSliceComponent/biddingApiSlice";

const ROLE_TABS = [
  { key: "ALL", label: "All Proposals" },
  { key: "ARCHITECT", label: "Architects" },
  { key: "INTERIOR_DESIGNER", label: "Interior Designers" },
  { key: "CONTRACTOR", label: "Contractors" },
];

function ProAvatar({ src, name = "", size = 48, className = "" }) {
  const [error, setError] = useState(false);

  const getInitials = (n) => {
    if (!n || typeof n !== "string") return "P";
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const isInvalidSrc =
    !src ||
    typeof src !== "string" ||
    src.trim().length === 0 ||
    !src.startsWith("http");

  if (error || isInvalidSrc) {
    return (
      <div
        className={`rounded-full flex items-center justify-center font-bold text-xs uppercase flex-shrink-0 select-none shadow-xs ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: "var(--background-secondary)",
          color: "var(--primary)",
          border: "1px solid var(--border)",
        }}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div
      className={`rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center relative ${className}`}
      style={{
        width: size,
        height: size,
        border: "1px solid var(--border)",
        backgroundColor: "var(--background-secondary)",
      }}
    >
      <img
        src={src}
        alt=""
        onError={() => setError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default function BidsTab({
  project = null,
  onOpenChat,
  onBidAccepted,
}) {
  const projectId = project?.id;

  const [activeRoleTab, setActiveRoleTab] = useState("ALL");
  const [selectedBidIds, setSelectedBidIds] = useState(new Set());
  const [viewingBid, setViewingBid] = useState(null);
  const [acceptingBid, setAcceptingBid] = useState(null);
  const [rejectingBid, setRejectingBid] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showCompareModal, setShowCompareModal] = useState(false);

  const { data: bidsData, isLoading, isFetching, refetch } = useGetProjectBidsQuery(
    { projectId },
    { skip: !projectId }
  );

  const [shortlistBid, { isLoading: isShortlisting }] = useShortlistBidMutation();
  const [acceptBidMutation, { isLoading: isAccepting }] = useAcceptBidMutation();
  const [rejectBidMutation, { isLoading: isRejecting }] = useRejectBidMutation();

  const bidsGroup = bidsData?.data || { all: [], architects: [], designers: [], contractors: [] };
  const allBids = bidsGroup.all || [];

  // Filter bids based on role tab
  const displayedBids = allBids.filter((bid) => {
    if (activeRoleTab === "ALL") return true;
    if (activeRoleTab === "ARCHITECT") return bid.role === "ARCHITECT" || bid.architectId;
    if (activeRoleTab === "INTERIOR_DESIGNER") return bid.role === "INTERIOR_DESIGNER" || bid.designerId;
    if (activeRoleTab === "CONTRACTOR") return bid.role === "CONTRACTOR" || bid.contractorId;
    return true;
  });

  const formatCurrency = (n) => {
    if (n === null || n === undefined) return "—";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);
  };

  const getProDetails = (bid) => {
    const pro = bid.architect || bid.designer || bid.contractor;
    const user = pro?.user || {};
    const img =
      user.profileImageUrl ||
      pro?.profileImageUrl ||
      (typeof user.profile === "string" && (user.profile.startsWith("http") || user.profile.startsWith("/uploads") || user.profile.startsWith("data:"))
        ? user.profile
        : null) ||
      (Array.isArray(pro?.photos) && pro.photos.length > 0 ? (typeof pro.photos[0] === "string" ? pro.photos[0] : pro.photos[0]?.url) : null) ||
      null;

    return {
      userId: user.id || null,
      name: user.name || "Professional",
      profileImg: img,
      city: user.city || user.state ? `${user.city || ""}, ${user.state || ""}` : "Verified Location",
      role: bid.role ? bid.role.replace(/_/g, " ") : "Specialist",
      experience: pro?.experience || pro?.yearsOfExperience || "Verified Pro",
      rating: pro?.rating || 4.9,
    };
  };

  // Toggle selection for comparison
  const toggleSelectBid = (bidId) => {
    setSelectedBidIds((prev) => {
      const next = new Set(prev);
      if (next.has(bidId)) next.delete(bidId);
      else {
        if (next.size >= 4) {
          toast.info("You can compare up to 4 proposals at once");
          return prev;
        }
        next.add(bidId);
      }
      return next;
    });
  };

  // Handle Shortlist toggle
  const handleToggleShortlist = async (bid, isShortlisted) => {
    try {
      await shortlistBid({ bidId: bid.id, isShortlisted }).unwrap();
      toast.success(isShortlisted ? "Proposal shortlisted" : "Removed from shortlist");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update shortlist status");
    }
  };

  // Handle Accept / Award
  const handleConfirmAccept = async () => {
    if (!acceptingBid) return;
    try {
      await acceptBidMutation(acceptingBid.id).unwrap();
      toast.success(`Proposal awarded! Contract and 3-phase milestones generated.`);
      setAcceptingBid(null);
      if (onBidAccepted) onBidAccepted();
      refetch();
    } catch (err) {
      if (err?.status === 409 || err?.data?.message?.includes("already")) {
        toast.warning(err?.data?.message || "This role has already been awarded by another session. Refreshing list...");
        setAcceptingBid(null);
        refetch();
      } else {
        toast.error(err?.data?.message || "Failed to award proposal");
      }
    }
  };


  // Handle Reject
  const handleConfirmReject = async () => {
    if (!rejectingBid) return;
    try {
      await rejectBidMutation({
        bidId: rejectingBid.id,
        reason: rejectReason || "Proposal not selected",
      }).unwrap();
      toast.success("Proposal rejected");
      setRejectingBid(null);
      setRejectReason("");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to reject proposal");
    }
  };

  const selectedBidsForComparison = allBids.filter((b) => selectedBidIds.has(b.id));

  return (
    <div className="space-y-6">
      {/* Category Tabs & Compare Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex flex-wrap gap-2">
          {ROLE_TABS.map((tab) => {
            const count =
              tab.key === "ALL"
                ? allBids.length
                : tab.key === "ARCHITECT"
                ? (bidsGroup.architects || []).length
                : tab.key === "INTERIOR_DESIGNER"
                ? (bidsGroup.designers || []).length
                : (bidsGroup.contractors || []).length;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveRoleTab(tab.key)}
                className={`text-xs px-3.5 py-2 rounded-sm font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 ${
                  activeRoleTab === tab.key
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "bg-[var(--background-secondary)] text-muted hover:text-heading"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeRoleTab === tab.key ? "bg-white/20 text-white" : "bg-black/10 text-heading"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {selectedBidIds.size > 0 && (
          <div className="flex items-center gap-3 bg-[var(--gold)]/10 border border-[var(--gold)] px-4 py-2 rounded-md">
            <span className="text-xs font-semibold text-heading">
              {selectedBidIds.size} proposal{selectedBidIds.size > 1 ? "s" : ""} selected
            </span>
            <button
              onClick={() => setShowCompareModal(true)}
              className="px-3 py-1 bg-[var(--gold)] text-black rounded text-xs font-bold uppercase tracking-wider hover:brightness-105 shadow-sm transition"
            >
              Compare Side-by-Side
            </button>
            <button
              onClick={() => setSelectedBidIds(new Set())}
              className="text-xs text-muted hover:text-heading underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-muted">Loading project proposals...</p>
        </div>
      ) : displayedBids.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 bg-[var(--background-secondary)]/40 rounded-lg border border-dashed border-border p-8">
          <Layers size={44} className="mx-auto text-muted opacity-40 mb-3" />
          <h3
            className="text-lg font-bold text-heading"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            No Proposals in this Category
          </h3>
          <p className="text-xs text-muted max-w-sm mx-auto mt-1">
            Professionals will submit quotations matching your required services. Check back soon or ensure your project status is open.
          </p>
        </div>
      ) : (
        /* Bids List Grid */
        <div className="grid grid-cols-1 gap-4">
          {displayedBids.map((bid) => {
            const pro = getProDetails(bid);
            const isSelected = selectedBidIds.has(bid.id);
            const isAccepted = bid.status === "ACCEPTED";
            const isShortlisted = bid.isShortlisted || bid.status === "SHORTLISTED";
            const isRejected = bid.status === "REJECTED";
            const isWithdrawn = bid.status === "WITHDRAWN";

            return (
              <div
                key={bid.id}
                className={`rounded-lg border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
                  isAccepted
                    ? "border-[var(--success)] ring-1 ring-[var(--success)]/30 bg-[var(--success)]/5"
                    : isShortlisted
                    ? "border-[var(--gold)] bg-[var(--gold)]/5"
                    : isRejected || isWithdrawn
                    ? "border-border opacity-70"
                    : "border-border"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Professional Details & Proposal Summary */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Compare Selection Checkbox */}
                    {!isRejected && !isWithdrawn && (
                      <button
                        onClick={() => toggleSelectBid(bid.id)}
                        className="mt-1 text-muted hover:text-primary transition"
                        title="Select to compare"
                      >
                        {isSelected ? (
                          <CheckSquare size={18} className="text-[var(--gold)]" />
                        ) : (
                          <Square size={18} />
                        )}
                      </button>
                    )}

                    {/* Pro Avatar */}
                    <ProAvatar
                      src={pro.profileImg}
                      name={pro.name}
                      size={52}
                    />

                    {/* Pro Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-bold text-heading text-base">{pro.name}</h4>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-[var(--background-secondary)] text-[var(--primary)]">
                          {pro.role}
                        </span>

                        {/* Status Badges */}
                        {isAccepted && (
                          <span className="text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider bg-[var(--success)] text-white flex items-center gap-1">
                            <CheckCircle2 size={11} /> Accepted & Hired
                          </span>
                        )}
                        {isShortlisted && !isAccepted && (
                          <span className="text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider bg-[var(--gold)] text-black flex items-center gap-1">
                            <Star size={11} /> Shortlisted
                          </span>
                        )}
                        {isRejected && (
                          <span className="text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider bg-[var(--danger)] text-white">
                            Rejected
                          </span>
                        )}
                        {isWithdrawn && (
                          <span className="text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider bg-gray-400 text-white">
                            Withdrawn
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-muted flex items-center gap-3 mb-2.5">
                        <span>{pro.city}</span>
                        <span>•</span>
                        <span>{pro.experience}</span>
                        <span>•</span>
                        <span>
                          Submitted {new Date(bid.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Proposal Text */}
                      <p className="text-xs text-text line-clamp-2 leading-relaxed bg-[var(--background-secondary)]/50 p-2.5 rounded border border-border/40 mb-2">
                        {bid.proposal || "No proposal summary provided."}
                      </p>

                      {/* Portfolio link */}
                      {bid.portfolioLink && (
                        <a
                          href={bid.portfolioLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-[var(--gold)] hover:underline"
                        >
                          <ExternalLink size={12} /> Portfolio: {bid.portfolioLink}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right: Quote, Duration, and Action Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-border flex-shrink-0">
                    <div className="text-left lg:text-right">
                      <div className="text-xs text-muted uppercase tracking-wider font-semibold">
                        Quoted Price
                      </div>
                      <div className="text-xl font-bold text-heading" style={{ fontFamily: "var(--font-heading)" }}>
                        {formatCurrency(bid.quotedPrice || bid.amount)}
                      </div>
                      <div className="text-xs text-muted flex items-center gap-1 mt-0.5">
                        <Clock size={12} /> Est. Duration: {bid.proposedDuration || "—"}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setViewingBid(bid)}
                        className="p-2 rounded text-xs font-medium border border-border bg-white hover:bg-background-secondary text-heading transition flex items-center gap-1"
                        title="View Full Proposal"
                      >
                        <Eye size={14} /> View
                      </button>

                      {!isAccepted && !isRejected && !isWithdrawn && (
                        <>
                          <button
                            onClick={() => handleToggleShortlist(bid, !isShortlisted)}
                            className={`p-2 rounded text-xs font-medium border transition flex items-center gap-1 ${
                              isShortlisted
                                ? "border-[var(--gold)] bg-[var(--gold)] text-black"
                                : "border-border bg-white text-heading hover:bg-background-secondary"
                            }`}
                            title={isShortlisted ? "Remove from shortlist" : "Shortlist"}
                          >
                            <Star size={14} />
                          </button>

                          <button
                            onClick={() => onOpenChat(pro.userId, pro.name, bid.id)}
                            className="py-1.5 px-3 rounded text-xs font-medium border border-border bg-white hover:bg-background-secondary text-heading transition flex items-center gap-1"
                          >
                            <MessageSquare size={14} /> Chat
                          </button>

                          <button
                            onClick={() => setAcceptingBid(bid)}
                            className="py-1.5 px-3 rounded text-xs font-semibold text-white transition flex items-center gap-1"
                            style={{ backgroundColor: "var(--primary)" }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor = "var(--primary-hover)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor = "var(--primary)")
                            }
                          >
                            <Award size={14} /> Accept & Hire
                          </button>

                          <button
                            onClick={() => setRejectingBid(bid)}
                            className="p-2 rounded text-xs font-medium border border-border bg-white hover:bg-red-50 text-red-600 transition"
                            title="Reject Proposal"
                          >
                            <XCircle size={14} />
                          </button>
                        </>
                      )}

                      {isAccepted && (
                        <button
                          onClick={() => onOpenChat(pro.userId, pro.name, bid.id)}
                          className="py-1.5 px-3 rounded text-xs font-semibold text-white transition flex items-center gap-1"
                          style={{ backgroundColor: "var(--primary)" }}
                        >
                          <MessageSquare size={14} /> Team Chat
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compare Bids Modal */}
      {showCompareModal && (
        <CompareBidsModal
          bids={selectedBidsForComparison}
          project={project}
          onClose={() => setShowCompareModal(false)}
          onAccept={(bid) => {
            setShowCompareModal(false);
            setAcceptingBid(bid);
          }}
          onShortlist={(bid, val) => handleToggleShortlist(bid, val)}
          onChat={(bid) => {
            const pro = getProDetails(bid);
            setShowCompareModal(false);
            onOpenChat(pro.userId, pro.name, bid.id);
          }}
        />
      )}

      {/* Proposal Details Modal / Drawer */}
      {viewingBid && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setViewingBid(null)}
        >
          <div
            className="bg-white rounded-md max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto border border-border shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-muted font-bold">
                  Proposal Details
                </span>
                <h3
                  className="text-xl font-bold text-heading"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {getProDetails(viewingBid).name}
                </h3>
              </div>
              <button
                onClick={() => setViewingBid(null)}
                className="p-1 rounded-full text-muted hover:text-heading"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[var(--background-secondary)] p-4 rounded-md">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted font-semibold">
                  Role
                </div>
                <div className="text-sm font-bold text-heading">
                  {getProDetails(viewingBid).role}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted font-semibold">
                  Quoted Price
                </div>
                <div className="text-sm font-bold text-heading">
                  {formatCurrency(viewingBid.quotedPrice || viewingBid.amount)}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted font-semibold">
                  Duration
                </div>
                <div className="text-sm font-bold text-heading">
                  {viewingBid.proposedDuration || "—"}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider text-muted font-bold mb-2">
                Cover Note / Proposal
              </h4>
              <div className="text-sm text-text whitespace-pre-line leading-relaxed p-4 bg-surface rounded border border-border">
                {viewingBid.proposal || "No proposal text provided."}
              </div>
            </div>

            {viewingBid.portfolioLink && (
              <div>
                <h4 className="text-xs uppercase tracking-wider text-muted font-bold mb-1">
                  Portfolio Link
                </h4>
                <a
                  href={viewingBid.portfolioLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[var(--gold)] flex items-center gap-1 hover:underline"
                >
                  <ExternalLink size={13} /> {viewingBid.portfolioLink}
                </a>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                onClick={() => setViewingBid(null)}
                className="px-4 py-2 rounded text-xs font-medium border border-border bg-white text-heading"
              >
                Close
              </button>
              {viewingBid.status !== "ACCEPTED" && viewingBid.status !== "REJECTED" && (
                <button
                  onClick={() => {
                    const b = viewingBid;
                    setViewingBid(null);
                    setAcceptingBid(b);
                  }}
                  className="px-4 py-2 rounded text-xs font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition"
                >
                  Accept & Hire
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Accept Confirmation Modal */}
      {acceptingBid && (
        <div
          className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setAcceptingBid(null)}
        >
          <div
            className="bg-white rounded-md max-w-md w-full p-6 border border-border shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-[var(--primary)]">
              <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] flex items-center justify-center">
                <Award size={22} />
              </div>
              <div>
                <h3
                  className="text-lg font-bold text-heading"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Accept Proposal & Hire?
                </h3>
                <p className="text-xs text-muted">Confirm professional selection</p>
              </div>
            </div>

            <div className="bg-[var(--background-secondary)] p-4 rounded-md space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted">Professional:</span>
                <span className="font-bold text-heading">{getProDetails(acceptingBid).name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Specialization:</span>
                <span className="font-bold text-heading">{getProDetails(acceptingBid).role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Agreed Price:</span>
                <span className="font-bold text-heading">
                  {formatCurrency(acceptingBid.quotedPrice || acceptingBid.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Est. Duration:</span>
                <span className="font-bold text-heading">{acceptingBid.proposedDuration || "—"}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 flex items-start gap-2">
              <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
              <span>
                Accepting this proposal will officially add {getProDetails(acceptingBid).name} to your Project Team and politely decline any competing bids in this category.
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setAcceptingBid(null)}
                className="px-4 py-2 rounded text-xs font-medium border border-border bg-white text-heading"
                disabled={isAccepting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAccept}
                disabled={isAccepting}
                className="px-5 py-2 rounded text-xs font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition flex items-center gap-1.5"
              >
                {isAccepting ? "Accepting..." : "Confirm & Hire"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {rejectingBid && (
        <div
          className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setRejectingBid(null)}
        >
          <div
            className="bg-white rounded-md max-w-md w-full p-6 border border-border shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <XCircle size={22} />
              </div>
              <div>
                <h3
                  className="text-lg font-bold text-heading"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Decline Proposal
                </h3>
                <p className="text-xs text-muted">
                  Decline quotation from {getProDetails(rejectingBid).name}
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-muted font-bold block mb-1.5">
                Reason / Feedback (Optional)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Budget outside project scope, timeline does not match requirements..."
                rows={3}
                className="w-full text-xs p-3 border border-border rounded focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectingBid(null)}
                className="px-4 py-2 rounded text-xs font-medium border border-border bg-white text-heading"
                disabled={isRejecting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={isRejecting}
                className="px-4 py-2 rounded text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition"
              >
                {isRejecting ? "Declining..." : "Decline Proposal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
