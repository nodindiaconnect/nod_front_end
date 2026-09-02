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
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  useCreateBidMutation,
  useUpdateBidMutation,
} from "../../../ApiSliceComponent/biddingApiSlice";

const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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

  const [submissionResult, setSubmissionResult] = useState(null);

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

        setSubmissionResult({
          type: "success",
          title: "Proposal Updated Successfully!",
          message:
            "Your modified quotation has been saved and sent to the client.",
          price,
        });
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

        setSubmissionResult({
          type: "success",
          title: "Proposal Submitted Successfully!",
          message: `Your quotation of ₹${price.toLocaleString(
            "en-IN"
          )} has been submitted for this project. The client can now review your proposal in their dashboard.`,
          price,
        });
      }
    } catch (err) {
      const errorMsg =
        err?.data?.message ||
        err?.message ||
        "Failed to submit proposal. Please try again.";

      const isAlreadySubmitted =
        errorMsg.toLowerCase().includes("already submitted") ||
        errorMsg.toLowerCase().includes("already exists");

      setSubmissionResult({
        type: "error",
        title: isAlreadySubmitted
          ? "Active Proposal Already Exists"
          : "Proposal Submission Failed",
        message: errorMsg,
        isAlreadySubmitted,
      });
    }
  };

  const handleFinishSuccess = () => {
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 my-auto border border-border shadow-2xl space-y-5 animate-[fadeIn_0.15s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* If submission result exists, show the result modal UI */}
        {submissionResult ? (
          <div className="text-center py-4 space-y-4">
            {submissionResult.type === "success" ? (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h3
                    className="text-xl sm:text-2xl font-bold text-heading"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {submissionResult.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted mt-2 max-w-md mx-auto leading-relaxed">
                    {submissionResult.message}
                  </p>
                </div>

                <div className="p-4 bg-[var(--background-secondary)] rounded-xl border border-border text-left max-w-md mx-auto space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Project:</span>
                    <span className="font-bold text-heading">
                      {project?.title || "Project"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Quoted Price:</span>
                    <span className="font-bold text-heading">
                      ₹{Number(quotedPrice).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Duration:</span>
                    <span className="font-bold text-heading">
                      {proposedDuration}
                    </span>
                  </div>
                </div>

                <div className="pt-3 flex justify-center gap-3">
                  <button
                    onClick={handleFinishSuccess}
                    className="px-8 py-2.5 rounded-xl text-xs font-semibold text-white transition shadow-sm cursor-pointer"
                    style={{ backgroundColor: "var(--primary)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--primary-hover)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--primary)")
                    }
                  >
                    Done
                  </button>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm ${
                    submissionResult.isAlreadySubmitted
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {submissionResult.isAlreadySubmitted ? (
                    <AlertTriangle size={36} />
                  ) : (
                    <AlertCircle size={36} />
                  )}
                </div>

                <div>
                  <h3
                    className="text-xl sm:text-2xl font-bold text-heading"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {submissionResult.title}
                  </h3>
                  <div className="mt-3 p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-left max-w-md mx-auto">
                    <p className="text-xs text-amber-900 font-medium leading-relaxed">
                      {submissionResult.message}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
                  {submissionResult.isAlreadySubmitted
                    ? "You have already placed a quotation for this project. You can review, update, or withdraw it from your 'My Proposals' section."
                    : "Please review the requirements and your quotation details before submitting again."}
                </p>

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSubmissionResult(null);
                    }}
                    className="px-5 py-2 rounded-xl text-xs font-semibold border border-border bg-white text-heading hover:bg-slate-50 transition cursor-pointer"
                  >
                    Review Details
                  </button>

                  <button
                    onClick={() => {
                      if (onSuccess) onSuccess();
                      onClose();
                    }}
                    className="px-6 py-2 rounded-xl text-xs font-semibold text-white transition shadow-sm cursor-pointer"
                    style={{ backgroundColor: "var(--primary)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--primary-hover)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--primary)")
                    }
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
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
                className="p-1 rounded-full text-muted hover:text-heading cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Project Budget Reference Banner */}
            {project && (
              <div className="p-3 bg-[var(--background-secondary)] rounded-md border border-border flex items-center justify-between text-xs">
                <span className="text-muted">Client's Target Budget:</span>
                <span className="font-bold text-heading">
                  ₹{project.budgetMin?.toLocaleString("en-IN")} – ₹
                  {project.budgetMax?.toLocaleString("en-IN")}
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
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-border rounded-lg focus:outline-none focus:border-[var(--primary)] text-heading"
                    />
                  </div>
                </div>

                {/* Proposed Duration */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
                    Estimated Duration *
                  </label>
                  <div className="relative">
                    <Clock
                      size={15}
                      className="absolute left-3 top-3 text-muted"
                    />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 3 Weeks / 45 Days"
                      value={proposedDuration}
                      onChange={(e) => setProposedDuration(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-border rounded-lg focus:outline-none focus:border-[var(--primary)] text-heading"
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
                  className="w-full p-3 text-xs border border-border rounded-lg focus:outline-none focus:border-[var(--primary)] text-heading leading-relaxed"
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
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-border rounded-lg focus:outline-none focus:border-[var(--primary)] text-heading"
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
                      min={getTodayDateString()}
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-border rounded-lg focus:outline-none focus:border-[var(--primary)] text-heading"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium border border-border rounded-lg bg-white text-heading hover:bg-background-secondary transition cursor-pointer"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-xs font-semibold text-white transition shadow-sm cursor-pointer"
                  style={{ backgroundColor: "var(--primary)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--primary-hover)")
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
          </>
        )}
      </div>
    </div>
  );
}
