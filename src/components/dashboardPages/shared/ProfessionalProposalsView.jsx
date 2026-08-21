import React, { useState } from "react";
import {
  FolderKanban,
  FileSignature,
  Search,
  Filter,
  Eye,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
  MapPin,
  IndianRupee,
  Calendar,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  MessageSquare,
  Sparkles,
  Layers,
  Edit,
  Trash2,
  Lock,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SubmitProposalModal from "./SubmitProposalModal";
import ProjectDetailsModal from "../../../global/Projectdetailsmodal";
import Pagination from "../../../global/pagination";
import Loader from "../../../global/Loader";
import {
  useGetMyBidsQuery,
  useWithdrawBidMutation,
} from "../../../ApiSliceComponent/biddingApiSlice";

const STATUS_BADGE = {
  PENDING: { label: "Under Review", bg: "bg-amber-100", text: "text-amber-800" },
  SHORTLISTED: { label: "Shortlisted ★", bg: "bg-[var(--gold)]", text: "text-black" },
  ACCEPTED: { label: "Accepted & Hired", bg: "bg-[var(--success)]", text: "text-white" },
  REJECTED: { label: "Declined", bg: "bg-red-100", text: "text-red-700" },
  WITHDRAWN: { label: "Withdrawn", bg: "bg-gray-100", text: "text-gray-600" },
  EXPIRED: { label: "Expired", bg: "bg-gray-100", text: "text-gray-600" },
};

const formatCurrency = (n) => {
  if (n === null || n === undefined) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
};

export default function ProfessionalProposalsView({
  roleTitle = "Designer",
  serviceType = "INTERIOR_DESIGNER",
  useGetProjectsQuery,
}) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("browse"); // "browse" | "my-bids"
  const [bidsStatusFilter, setBidsStatusFilter] = useState("");
  const [bidsPage, setBidsPage] = useState(1);

  const [projectSearch, setProjectSearch] = useState("");
  const [projectsPage, setProjectsPage] = useState(1);

  const [submittingProject, setSubmittingProject] = useState(null);
  const [editingBid, setEditingBid] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [withdrawingBidId, setWithdrawingBidId] = useState(null);

  // Queries
  const {
    data: projectsData,
    isLoading: loadingProjects,
    isFetching: fetchingProjects,
    refetch: refetchProjects,
  } = useGetProjectsQuery({ page: projectsPage, limit: 9 });

  const {
    data: myBidsData,
    isLoading: loadingBids,
    isFetching: fetchingBids,
    refetch: refetchBids,
  } = useGetMyBidsQuery({
    page: bidsPage,
    limit: 10,
    status: bidsStatusFilter || undefined,
  });

  const [withdrawBid, { isLoading: isWithdrawing }] = useWithdrawBidMutation();

  const projects = projectsData?.data || [];
  const myBids = myBidsData?.data?.bids || [];
  const myBidsPagination = myBidsData?.data?.pagination;

  // Filter projects by search
  const filteredProjects = projects.filter((p) => {
    const term = projectSearch.toLowerCase();
    return (
      p.title?.toLowerCase().includes(term) ||
      p.city?.toLowerCase().includes(term) ||
      p.category?.toLowerCase().includes(term)
    );
  });

  // Handle Withdraw Bid
  const handleConfirmWithdraw = async () => {
    if (!withdrawingBidId) return;
    try {
      await withdrawBid(withdrawingBidId).unwrap();
      toast.success("Proposal withdrawn successfully");
      setWithdrawingBidId(null);
      refetchBids();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to withdraw proposal");
    }
  };

  return (
    <div className="w-full py-2 px-3 sm:px-6 lg:px-10 sm:py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-heading"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {roleTitle} Project Opportunities & Quotations
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            Discover verified client projects, submit premium quotations, and manage your active bids.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex gap-1 bg-[var(--background-secondary)] p-1 rounded-md text-xs font-semibold uppercase tracking-wider flex-shrink-0">
          <button
            onClick={() => setActiveTab("browse")}
            className={`px-4 py-2 rounded-sm transition flex items-center gap-1.5 ${
              activeTab === "browse"
                ? "bg-[var(--primary)] text-white shadow-xs"
                : "text-muted hover:text-heading"
            }`}
          >
            <FolderKanban size={15} />
            Available Projects
          </button>

          <button
            onClick={() => setActiveTab("my-bids")}
            className={`px-4 py-2 rounded-sm transition flex items-center gap-1.5 ${
              activeTab === "my-bids"
                ? "bg-[var(--primary)] text-white shadow-xs"
                : "text-muted hover:text-heading"
            }`}
          >
            <FileSignature size={15} />
            My Submitted Bids
            {myBidsPagination?.total > 0 && (
              <span className="w-4 h-4 rounded-full bg-white/20 text-white text-[10px] flex items-center justify-center">
                {myBidsPagination.total}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── BROWSE AVAILABLE PROJECTS TAB ── */}
      {activeTab === "browse" && (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-border">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3 top-2.5 text-muted" />
              <input
                type="text"
                placeholder="Search projects by city, title, category..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded-md focus:outline-none focus:border-[var(--primary)] text-heading"
              />
            </div>

            <div className="text-xs text-muted">
              Showing {filteredProjects.length} available opportunities
            </div>
          </div>

          {loadingProjects ? (
            <Loader />
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border border-border p-8">
              <FolderKanban size={44} className="mx-auto text-muted opacity-30 mb-3" />
              <h3
                className="text-lg font-bold text-heading"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                No Projects Available Right Now
              </h3>
              <p className="text-xs text-muted max-w-sm mx-auto mt-1">
                Clients are continuously posting projects. Check back shortly for new requests requiring {roleTitle.toLowerCase()} services.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((proj) => {
                const photos = (proj.attachments || []).filter(
                  (a) => a.type === "PROPERTY_PHOTO" || a.type === "REFERENCE_IMAGE"
                );
                const hasPhoto = photos.length > 0;

                return (
                  <div
                    key={proj.id}
                    className="rounded-lg border border-border bg-white shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Cover Image */}
                      <div className="h-44 bg-[var(--background-secondary)] relative overflow-hidden flex items-center justify-center">
                        {hasPhoto ? (
                          <img
                            src={photos[0].url}
                            alt={proj.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center text-muted">
                            <Layers size={28} className="mx-auto opacity-30 mb-1" />
                            <span className="text-[11px]">Architectural Project</span>
                          </div>
                        )}

                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--primary)] text-white shadow-xs">
                            {proj.category}
                          </span>
                        </div>

                        <div className="absolute bottom-3 right-3">
                          <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-xs text-white text-xs font-bold shadow-xs">
                            ₹{proj.budgetMin?.toLocaleString("en-IN")} – ₹{proj.budgetMax?.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between text-xs text-muted">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} /> {proj.city}, {proj.state}
                          </span>
                          <span>{proj.propertySize} sq.ft</span>
                        </div>

                        <h3
                          className="font-bold text-heading text-base line-clamp-1"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {proj.title}
                        </h3>

                        <p className="text-xs text-text line-clamp-2 leading-relaxed">
                          {proj.description}
                        </p>

                        <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted">
                          <span>
                            Target: {new Date(proj.startDate).toLocaleDateString()}
                          </span>
                          <span className="font-semibold text-heading">
                            {proj.siteVisitRequired ? "Site Visit Required" : "Remote Ready"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-4 border-t border-border bg-surface/50 flex gap-2">
                      <button
                        onClick={() => setViewingProject(proj)}
                        className="flex-1 py-2 px-3 rounded text-xs font-medium border border-border bg-white text-heading hover:bg-background-secondary transition flex items-center justify-center gap-1"
                      >
                        <Eye size={13} /> View Details
                      </button>

                      <button
                        onClick={() => setSubmittingProject(proj)}
                        className="flex-1 py-2 px-3 rounded text-xs font-semibold text-white transition flex items-center justify-center gap-1 shadow-xs"
                        style={{ backgroundColor: "var(--primary)" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "var(--primary-hover)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "var(--primary)")
                        }
                      >
                        <Send size={13} /> Submit Quotation
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── MY SUBMITTED BIDS TAB ── */}
      {activeTab === "my-bids" && (
        <div className="space-y-6">
          {/* Status Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-border">
            <div className="flex flex-wrap gap-2">
              {["", "PENDING", "SHORTLISTED", "ACCEPTED", "REJECTED", "WITHDRAWN"].map((st) => (
                <button
                  key={st || "ALL"}
                  onClick={() => {
                    setBidsStatusFilter(st);
                    setBidsPage(1);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-sm font-semibold uppercase tracking-wider transition ${
                    bidsStatusFilter === st
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--background-secondary)] text-muted hover:text-heading"
                  }`}
                >
                  {st ? st.replace(/_/g, " ") : "All Submissions"}
                </button>
              ))}
            </div>

            <div className="text-xs text-muted">
              Total {myBidsPagination?.total || myBids.length} submitted bids
            </div>
          </div>

          {loadingBids ? (
            <Loader />
          ) : myBids.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border border-border p-8">
              <FileSignature size={44} className="mx-auto text-muted opacity-30 mb-3" />
              <h3
                className="text-lg font-bold text-heading"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                No Proposals Found
              </h3>
              <p className="text-xs text-muted max-w-sm mx-auto mt-1">
                {bidsStatusFilter
                  ? "No proposals match this status filter."
                  : "You have not submitted any proposals yet. Browse open projects to get started!"}
              </p>
              {!bidsStatusFilter && (
                <button
                  onClick={() => setActiveTab("browse")}
                  className="mt-4 px-5 py-2 bg-[var(--primary)] text-white text-xs rounded font-semibold"
                >
                  Browse Available Projects
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {myBids.map((bid) => {
                const proj = bid.project || {};
                const client = proj.client || {};
                const st = STATUS_BADGE[bid.status] || STATUS_BADGE.PENDING;
                const canEdit = bid.status === "PENDING" || bid.status === "SHORTLISTED";

                return (
                  <div
                    key={bid.id}
                    className={`rounded-lg border bg-white p-5 shadow-xs transition hover:shadow-md ${
                      bid.status === "ACCEPTED"
                        ? "border-[var(--success)] bg-[var(--success)]/5 ring-1 ring-[var(--success)]/30"
                        : bid.status === "SHORTLISTED"
                        ? "border-[var(--gold)] bg-[var(--gold)]/5 ring-1 ring-[var(--gold)]/30"
                        : "border-border"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left Details */}
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] px-2.5 py-0.5 rounded-sm font-bold uppercase tracking-wider ${st.bg} ${st.text}`}
                          >
                            {st.label}
                          </span>

                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--background-secondary)] text-[var(--primary)] font-semibold">
                            {proj.category}
                          </span>

                          <span className="text-xs text-muted flex items-center gap-1">
                            <MapPin size={12} /> {proj.city}, {proj.state}
                          </span>
                        </div>

                        <h3
                          className="font-bold text-heading text-lg"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {proj.title}
                        </h3>

                        <div className="p-3 bg-[var(--background-secondary)]/50 rounded-md border border-border/50 text-xs text-text space-y-1">
                          <div className="text-[10px] uppercase tracking-wider text-muted font-bold">
                            Your Proposal Pitch
                          </div>
                          <p className="line-clamp-2 leading-relaxed">{bid.proposal}</p>
                        </div>
                      </div>

                      {/* Right Details & Actions */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 border-t lg:border-t-0 pt-4 lg:pt-0 border-border flex-shrink-0">
                        <div className="text-left lg:text-right">
                          <span className="text-xs text-muted uppercase tracking-wider font-semibold">
                            Quoted Amount
                          </span>
                          <div
                            className="text-xl font-bold text-heading"
                            style={{ fontFamily: "var(--font-heading)" }}
                          >
                            {formatCurrency(bid.quotedPrice || bid.amount)}
                          </div>
                          <div className="text-xs text-muted flex items-center gap-1 mt-0.5">
                            <Clock size={12} /> Est. Duration: {bid.proposedDuration || "—"}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          {canEdit && (
                            <>
                              <button
                                onClick={() => {
                                  setSubmittingProject(proj);
                                  setEditingBid(bid);
                                }}
                                className="py-1.5 px-3 rounded text-xs font-semibold border border-border bg-white text-heading hover:bg-background-secondary transition flex items-center gap-1"
                              >
                                <Edit size={13} /> Edit
                              </button>

                              <button
                                onClick={() => setWithdrawingBidId(bid.id)}
                                className="py-1.5 px-3 rounded text-xs font-semibold border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition flex items-center gap-1"
                              >
                                <Trash2 size={13} /> Withdraw
                              </button>
                            </>
                          )}

                          {bid.status === "ACCEPTED" && (
                            <button
                              onClick={() => navigate(`/dashboard/projects`)}
                              className="py-1.5 px-4 rounded text-xs font-bold text-white bg-[var(--success)] hover:brightness-110 transition flex items-center gap-1.5 shadow-xs"
                            >
                              <CheckCircle2 size={14} /> Open Project Team
                            </button>
                          )}

                          <button
                            onClick={() => navigate(`/dashboard/messages`)}
                            className="py-1.5 px-3 rounded text-xs font-medium border border-border bg-white hover:bg-background-secondary text-heading transition flex items-center gap-1"
                          >
                            <MessageSquare size={13} /> Chat
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {myBidsPagination?.totalPages > 1 && (
                <Pagination
                  pagination={myBidsPagination}
                  onPageChange={setBidsPage}
                  isFetching={fetchingBids}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Submit / Edit Proposal Modal */}
      {submittingProject && (
        <SubmitProposalModal
          project={submittingProject}
          existingBid={editingBid}
          onClose={() => {
            setSubmittingProject(null);
            setEditingBid(null);
          }}
          onSuccess={() => {
            refetchBids();
            refetchProjects();
          }}
        />
      )}

      {/* Project Details Modal */}
      {viewingProject && (
        <ProjectDetailsModal
          project={viewingProject}
          onClose={() => setViewingProject(null)}
        />
      )}

      {/* Withdraw Bid Confirmation Dialog */}
      {withdrawingBidId && (
        <div
          className="fixed inset-0 z-[160] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setWithdrawingBidId(null)}
        >
          <div
            className="bg-white rounded-md max-w-sm w-full p-6 border border-border shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 size={20} />
              </div>
              <div>
                <h3
                  className="font-bold text-heading text-base"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Withdraw Proposal?
                </h3>
                <p className="text-xs text-muted">Are you sure you want to withdraw?</p>
              </div>
            </div>

            <p className="text-xs text-text leading-relaxed">
              Withdrawing will cancel your active proposal for this project. You can submit a new proposal later if the project is still open.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setWithdrawingBidId(null)}
                className="px-4 py-2 rounded text-xs font-medium border border-border bg-white text-heading"
                disabled={isWithdrawing}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWithdraw}
                disabled={isWithdrawing}
                className="px-4 py-2 rounded text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition"
              >
                {isWithdrawing ? "Withdrawing..." : "Confirm Withdraw"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
