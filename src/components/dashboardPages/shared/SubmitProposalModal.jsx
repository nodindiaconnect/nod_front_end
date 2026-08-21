import React, { useState } from "react";
import {
  X,
  Send,
  IndianRupee,
  Clock,
  FileText,
  ExternalLink,
  Calendar,
  Sparkles,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  useCreateBidMutation,
  useUpdateBidMutation,
} from "../../../ApiSliceComponent/biddingApiSlice";

export default function SubmitProposalModal({
  project = null,
  existingBid = null,
  onClose,
  onSuccess,
}) {
  const isEditing = !!existingBid;

  const [quotedPrice, setQuotedPrice] = useState(
    existingBid?.quotedPrice || existingBid?.amount || ""
  );
  const [proposedDuration, setProposedDuration] = useState(
    existingBid?.proposedDuration || ""
  );
  const [proposal, setProposal] = useState(existingBid?.proposal || "");
  const [portfolioLink, setPortfolioLink] = useState(
    existingBid?.portfolioLink || ""
  );
  const [validUntil, setValidUntil] = useState(
    existingBid?.validUntil
      ? new Date(existingBid.validUntil).toISOString().split("T")[0]
      : ""
  );

  const [createBid, { isLoading: isCreating }] = useCreateBidMutation();
  const [updateBid, { isLoading: isUpdating }] = useUpdateBidMutation();

  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const price = Number(quotedPrice);
    if (!price || isNaN(price) || price <= 0) {
      toast.error("Please enter a valid quoted price");
      return;
    }

    if (!proposedDuration.trim()) {
      toast.error("Please enter your estimated completion duration");
      return;
    }

    if (!proposal.trim() || proposal.trim().length < 10) {
      toast.error("Proposal description must be at least 10 characters");
      return;
    }

    try {
      if (isEditing) {
        await updateBid({
          bidId: existingBid.id,
          quotedPrice: price,
          amount: price,
          proposedDuration: proposedDuration.trim(),
          proposal: proposal.trim(),
          portfolioLink: portfolioLink.trim() || null,
          validUntil: validUntil || null,
        }).unwrap();
        toast.success("Proposal updated successfully!");
      } else {
        await createBid({
          projectId: project.id,
          quotedPrice: price,
          amount: price,
          proposedDuration: proposedDuration.trim(),
          proposal: proposal.trim(),
          portfolioLink: portfolioLink.trim() || null,
          validUntil: validUntil || null,
        }).unwrap();
        toast.success("Proposal submitted successfully!");
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Failed to submit proposal");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md max-w-xl w-full p-6 my-auto border border-border shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <span className="text-xs uppercase tracking-wider text-muted font-bold">
              {isEditing ? "Modify Your Bid" : "Submit Quotation"}
            </span>
            <h3
              className="text-lg sm:text-xl font-bold text-heading"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {project?.title || "Project Proposal"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-muted hover:text-heading"
          >
            <X size={20} />
          </button>
        </div>

        {/* Project Budget Reference Banner */}
        {project && (
          <div className="p-3 bg-[var(--background-secondary)] rounded-md border border-border flex items-center justify-between text-xs">
            <span className="text-muted">Client's Target Budget:</span>
            <span className="font-bold text-heading">
              ₹{project.budgetMin?.toLocaleString("en-IN")} – ₹{project.budgetMax?.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        {/* Proposal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Quoted Price */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
                Your Quoted Price (₹) *
              </label>
              <div className="relative">
                <IndianRupee
                  size={15}
                  className="absolute left-3 top-3 text-muted"
                />
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 75000"
                  value={quotedPrice}
                  onChange={(e) => setQuotedPrice(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-border rounded focus:outline-none focus:border-[var(--primary)] text-heading"
                />
              </div>
            </div>

            {/* Proposed Duration */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
                Estimated Duration *
              </label>
              <div className="relative">
                <Clock size={15} className="absolute left-3 top-3 text-muted" />
                <input
                  type="text"
                  required
                  placeholder="e.g. 3 Weeks / 45 Days"
                  value={proposedDuration}
                  onChange={(e) => setProposedDuration(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-border rounded focus:outline-none focus:border-[var(--primary)] text-heading"
                />
              </div>
            </div>
          </div>

          {/* Proposal Description */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
              Proposal Cover Letter & Deliverables *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe your design vision, relevant past experience, materials/tools to be used, and milestone breakdown..."
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              className="w-full p-3 text-xs border border-border rounded focus:outline-none focus:border-[var(--primary)] text-heading leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Portfolio Link */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
                Portfolio / Reference Link
              </label>
              <div className="relative">
                <ExternalLink
                  size={15}
                  className="absolute left-3 top-3 text-muted"
                />
                <input
                  type="url"
                  placeholder="https://yourportfolio.com"
                  value={portfolioLink}
                  onChange={(e) => setPortfolioLink(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-border rounded focus:outline-none focus:border-[var(--primary)] text-heading"
                />
              </div>
            </div>

            {/* Valid Until */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
                Quote Valid Until
              </label>
              <div className="relative">
                <Calendar
                  size={15}
                  className="absolute left-3 top-3 text-muted"
                />
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-border rounded focus:outline-none focus:border-[var(--primary)] text-heading"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium border border-border rounded bg-white text-heading hover:bg-background-secondary transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded text-xs font-semibold text-white transition shadow-sm"
              style={{ backgroundColor: "var(--primary)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--primary-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--primary)")
              }
            >
              <Send size={14} />
              {isSubmitting
                ? "Submitting..."
                : isEditing
                ? "Update Proposal"
                : "Submit Quotation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
