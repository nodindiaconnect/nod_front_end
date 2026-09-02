import React, { useState } from "react";
import {
  X,
  Star,
  Send,
  Award,
  MessageCircle,
  Clock,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  User,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  useCreateReviewMutation,
  useUpdateReviewMutation,
} from "../../../ApiSliceComponent/reviewApiSlice";

function StarRatingInput({
  label,
  value,
  onChange,
  size = 20,
  required = false,
}) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs font-semibold text-heading">
        {label} {required && <span className="text-red-500">*</span>}
      </span>

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            className="p-0.5 focus:outline-none transition transform hover:scale-110"
          >
            <Star
              size={size}
              className={
                star <= (hoverValue || value)
                  ? "fill-amber-400 text-amber-500"
                  : "text-gray-300 hover:text-amber-300"
              }
            />
          </button>
        ))}
        <span className="text-xs font-bold text-heading ml-1.5 w-5 text-right">
          {value > 0 ? value : "—"}
        </span>
      </div>
    </div>
  );
}

export default function SubmitReviewModal({
  target = null,
  eligibleList = [],
  existingReview = null,
  onClose,
  onSuccess,
}) {
  const isEditMode = Boolean(existingReview);

  const [selectedTargetIndex, setSelectedTargetIndex] = useState(0);
  const activeTarget = isEditMode
    ? {
        projectId: existingReview.projectId,
        projectTitle: existingReview.project?.title || "Project",
        revieweeId: existingReview.revieweeId,
        revieweeName: existingReview.reviewee?.name || "Participant",
        revieweeRole: existingReview.role || "SPECIALIST",
      }
    : target || eligibleList[selectedTargetIndex] || null;

  const [overallRating, setOverallRating] = useState(
    existingReview?.rating ? Math.round(existingReview.rating) : 5
  );
  const [qualityRating, setQualityRating] = useState(
    existingReview?.qualityRating ? Math.round(existingReview.qualityRating) : 5
  );
  const [communicationRating, setCommunicationRating] = useState(
    existingReview?.communicationRating
      ? Math.round(existingReview.communicationRating)
      : 5
  );
  const [timelinessRating, setTimelinessRating] = useState(
    existingReview?.timelinessRating
      ? Math.round(existingReview.timelinessRating)
      : 5
  );
  const [budgetRating, setBudgetRating] = useState(
    existingReview?.budgetRating
      ? Math.round(existingReview.budgetRating)
      : 5
  );
  const [title, setTitle] = useState(existingReview?.title || "");
  const [comment, setComment] = useState(existingReview?.comment || "");

  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();

  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!activeTarget) {
      toast.error("Please select a project and specialist to review");
      return;
    }

    if (!overallRating || overallRating < 1) {
      toast.error("Please provide an overall star rating");
      return;
    }

    if (!comment.trim() || comment.trim().length < 5) {
      toast.error("Review comment must be at least 5 characters long");
      return;
    }

    try {
      if (isEditMode) {
        await updateReview({
          reviewId: existingReview.id,
          rating: overallRating,
          qualityRating,
          communicationRating,
          timelinessRating,
          budgetRating,
          title: title.trim() || null,
          comment: comment.trim(),
        }).unwrap();
        toast.success("Review updated successfully!");
      } else {
        await createReview({
          projectId: activeTarget.projectId,
          revieweeId: activeTarget.revieweeId,
          rating: overallRating,
          qualityRating,
          communicationRating,
          timelinessRating,
          budgetRating,
          title: title.trim() || null,
          comment: comment.trim(),
          role: activeTarget.revieweeRole || undefined,
        }).unwrap();
        toast.success("Review submitted successfully!");
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[160] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md max-w-lg w-full p-6 my-auto border border-border shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <span className="text-xs uppercase tracking-wider text-muted font-bold">
              Feedback & Ratings
            </span>
            <h3
              className="text-lg sm:text-xl font-bold text-heading"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {isEditMode ? "Edit Review" : "Leave a Review"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-muted hover:text-heading"
          >
            <X size={20} />
          </button>
        </div>

        {/* Target Selection Dropdown (if not pre-set and not edit mode) */}
        {!isEditMode && !target && eligibleList.length > 1 && (
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
              Select Project & Participant
            </label>
            <select
              value={selectedTargetIndex}
              onChange={(e) => setSelectedTargetIndex(Number(e.target.value))}
              className="w-full p-2.5 text-xs bg-white border border-border rounded focus:outline-none focus:border-[var(--primary)] text-heading"
            >
              {eligibleList.map((item, idx) => (
                <option key={`${item.projectId}-${item.revieweeId}`} value={idx}>
                  {item.projectTitle} — {item.revieweeName} (
                  {item.revieweeRole?.replace(/_/g, " ")})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Selected Target Banner */}
        {activeTarget ? (
          <div className="p-3 bg-[var(--background-secondary)] rounded-md border border-border flex items-center justify-between text-xs">
            <div>
              <span className="text-muted block text-[10px] uppercase font-bold">
                Reviewing
              </span>
              <span className="font-bold text-heading">
                {activeTarget.revieweeName}
              </span>
              <span className="text-muted ml-1.5">
                ({activeTarget.revieweeRole?.replace(/_/g, " ")})
              </span>
            </div>
            <div className="text-right">
              <span className="text-muted block text-[10px] uppercase font-bold">
                Project
              </span>
              <span className="font-semibold text-heading truncate max-w-[160px] inline-block">
                {activeTarget.projectTitle}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 rounded-md border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>No eligible collaborators available for review.</span>
          </div>
        )}

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Overall Rating */}
          <div className="p-3 bg-[var(--background-secondary)]/50 rounded-md border border-border/70">
            <StarRatingInput
              label="Overall Rating"
              value={overallRating}
              onChange={setOverallRating}
              size={24}
              required
            />
          </div>

          {/* Sub-Criteria Ratings */}
          <div className="p-3.5 bg-white rounded-md border border-border space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
              Detailed Criteria Ratings
            </div>
            <StarRatingInput
              label="Quality of Work"
              value={qualityRating}
              onChange={setQualityRating}
              size={18}
            />
            <StarRatingInput
              label="Communication & Responsiveness"
              value={communicationRating}
              onChange={setCommunicationRating}
              size={18}
            />
            <StarRatingInput
              label="Timeliness & Meeting Deadlines"
              value={timelinessRating}
              onChange={setTimelinessRating}
              size={18}
            />
            <StarRatingInput
              label="Cost & Budget Adherence"
              value={budgetRating}
              onChange={setBudgetRating}
              size={18}
            />
          </div>

          {/* Review Title */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
              Review Headline (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Exceptional architectural designs and timely delivery!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 text-xs border border-border rounded focus:outline-none focus:border-[var(--primary)] text-heading"
            />
          </div>

          {/* Review Comment */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
              Detailed Feedback *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Share your experience working together. What went well? How was the communication and delivery?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2.5 text-xs border border-border rounded focus:outline-none focus:border-[var(--primary)] text-heading leading-relaxed"
            />
          </div>

          {/* Submit Actions */}
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
              disabled={isSubmitting || !activeTarget}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded text-xs font-semibold text-white transition shadow-sm"
              style={{ backgroundColor: "var(--primary)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--primary-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--primary)")
              }
            >
              <Send size={13} />
              {isSubmitting
                ? isEditMode
                  ? "Updating Review..."
                  : "Submitting Review..."
                : isEditMode
                ? "Update Review"
                : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
