import React from "react";
import {
  X,
  CheckCircle,
  Clock,
  ExternalLink,
  MessageSquare,
  Award,
  Shield,
  Star,
  IndianRupee,
  Calendar,
  Briefcase,
  User,
} from "lucide-react";

export default function CompareBidsModal({
  bids = [],
  project = null,
  onClose,
  onAccept,
  onShortlist,
  onChat,
}) {
  if (!bids || bids.length === 0) return null;

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
    return {
      name: user.name || "Professional",
      profileImg: user.profile || null,
      city: user.city || user.state ? `${user.city || ""}, ${user.state || ""}` : "Location not specified",
      role: bid.role ? bid.role.replace(/_/g, " ") : "Specialist",
      experience: pro?.experience || pro?.yearsOfExperience || "Verified Pro",
      rating: pro?.rating || 4.9,
    };
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md shadow-2xl w-full max-w-5xl my-auto overflow-hidden flex flex-col border border-border"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-border"
          style={{ backgroundColor: "var(--background-secondary)" }}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--primary)] text-white">
                Proposal Comparison
              </span>
              <span className="text-xs text-muted">
                Comparing {bids.length} proposals
              </span>
            </div>
            <h2
              className="text-lg sm:text-xl font-bold text-heading mt-1"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {project?.title || "Project Proposals"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 transition text-muted hover:text-heading"
          >
            <X size={20} />
          </button>
        </div>

        {/* Comparison Matrix Table */}
        <div className="overflow-x-auto p-6 flex-1">
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${bids.length}, minmax(260px, 1fr))`,
            }}
          >
            {bids.map((bid) => {
              const pro = getProDetails(bid);
              const isAccepted = bid.status === "ACCEPTED";
              const isShortlisted = bid.isShortlisted || bid.status === "SHORTLISTED";

              return (
                <div
                  key={bid.id}
                  className={`rounded-lg border p-5 flex flex-col justify-between transition-all ${
                    isAccepted
                      ? "border-[var(--success)] bg-[var(--success)]/5 ring-2 ring-[var(--success)]"
                      : isShortlisted
                      ? "border-[var(--gold)] bg-[var(--gold)]/5"
                      : "border-border bg-white shadow-sm"
                  }`}
                >
                  {/* Pro Top Header */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center flex-shrink-0 border border-border">
                        {pro.profileImg ? (
                          <img
                            src={pro.profileImg}
                            alt={pro.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={22} className="text-primary" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-heading text-base truncate">
                          {pro.name}
                        </h4>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-[var(--background-secondary)] text-[var(--primary)] inline-block">
                          {pro.role}
                        </span>
                        <div className="text-[11px] text-muted truncate mt-0.5">
                          {pro.city}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-sm font-semibold uppercase tracking-wider inline-flex items-center gap-1 ${
                          bid.status === "ACCEPTED"
                            ? "bg-[var(--success)] text-white"
                            : bid.status === "SHORTLISTED"
                            ? "bg-[var(--gold)] text-black"
                            : bid.status === "REJECTED"
                            ? "bg-[var(--danger)] text-white"
                            : "bg-[var(--background-secondary)] text-muted"
                        }`}
                      >
                        {bid.status === "ACCEPTED" && <CheckCircle size={12} />}
                        {bid.status === "SHORTLISTED" && <Star size={12} />}
                        {bid.status}
                      </span>
                    </div>

                    {/* Price & Duration Feature Block */}
                    <div className="rounded-md p-3.5 mb-4 bg-[var(--background-secondary)] border border-border/70 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted text-xs flex items-center gap-1">
                          <IndianRupee size={13} /> Quoted Price
                        </span>
                        <span className="font-bold text-heading text-base">
                          {formatCurrency(bid.quotedPrice || bid.amount)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted text-xs flex items-center gap-1">
                          <Clock size={13} /> Est. Duration
                        </span>
                        <span className="font-medium text-heading">
                          {bid.proposedDuration || "Not specified"}
                        </span>
                      </div>

                      {bid.validUntil && (
                        <div className="flex justify-between items-center text-xs text-muted">
                          <span>Valid Until</span>
                          <span>{new Date(bid.validUntil).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Proposal Summary */}
                    <div className="mb-4">
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                        Proposal Note
                      </div>
                      <p className="text-xs text-text line-clamp-4 leading-relaxed bg-surface/50 p-2.5 rounded border border-border/40">
                        {bid.proposal || "No proposal cover note provided."}
                      </p>
                    </div>

                    {/* Portfolio link */}
                    {bid.portfolioLink && (
                      <div className="mb-4">
                        <a
                          href={bid.portfolioLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-[var(--gold)] hover:underline"
                        >
                          <ExternalLink size={13} /> View Portfolio Link
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-4 border-t border-border mt-auto">
                    {bid.status !== "ACCEPTED" && bid.status !== "REJECTED" && (
                      <button
                        onClick={() => onAccept(bid)}
                        className="w-full py-2 px-3 rounded text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 transition-colors"
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
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => onShortlist(bid, !isShortlisted)}
                        className={`flex-1 py-1.5 px-2 rounded text-xs font-medium border flex items-center justify-center gap-1 transition-colors ${
                          isShortlisted
                            ? "border-[var(--gold)] bg-[var(--gold)] text-black"
                            : "border-border bg-white text-heading hover:bg-background-secondary"
                        }`}
                      >
                        <Star size={13} />
                        {isShortlisted ? "Shortlisted" : "Shortlist"}
                      </button>

                      <button
                        onClick={() => onChat(bid)}
                        className="flex-1 py-1.5 px-2 rounded text-xs font-medium border border-border bg-white text-heading hover:bg-background-secondary flex items-center justify-center gap-1 transition-colors"
                      >
                        <MessageSquare size={13} />
                        Chat
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-border bg-surface">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded text-xs font-medium border border-border bg-white hover:bg-background-secondary text-heading transition"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
