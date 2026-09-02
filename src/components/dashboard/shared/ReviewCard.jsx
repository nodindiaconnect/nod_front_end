import React, { useState } from "react";
import {
  Star,
  User,
  MapPin,
  CheckCircle2,
  Calendar,
  MessageSquare,
  CornerDownRight,
  Send,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Edit2,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  useReplyToReviewMutation,
  useDeleteReviewMutation,
} from "../../../ApiSliceComponent/reviewApiSlice";
import { getCurrentUser } from "../../../utils/auth";
import SubmitReviewModal from "./SubmitReviewModal";

export default function ReviewCard({
  review,
  isRecipientView = false,
  onReviewUpdated,
  onReviewDeleted,
}) {
  const currentUser = getCurrentUser() || {};
  const currentUserId = currentUser.id || currentUser.userId;

  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [replyToReview, { isLoading: isPostingReply }] = useReplyToReviewMutation();
  const [deleteReview, { isLoading: isDeletingReview }] = useDeleteReviewMutation();

  const reviewer = review.reviewer || {};
  const reviewee = review.reviewee || {};
  const project = review.project || {};

  const isMyReceivedReview = review.revieweeId === currentUserId;
  const isMyGivenReview = review.reviewerId === currentUserId;

  const handleDeleteReview = async () => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(review.id).unwrap();
      toast.success("Review deleted successfully");
      if (onReviewDeleted) onReviewDeleted(review.id);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete review");
    }
  };

  const handlePostReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      await replyToReview({
        reviewId: review.id,
        reply: replyText.trim(),
      }).unwrap();
      toast.success("Reply posted successfully");
      setIsReplying(false);
      setReplyText("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to post reply");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-border p-5 shadow-xs space-y-4 transition hover:shadow-sm">
      {/* Top Header: Reviewer Info + Rating */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {(() => {
            const reviewerAvatar =
              reviewer.profileImageUrl ||
              (typeof reviewer.profile === "string" &&
              (reviewer.profile.startsWith("http") ||
                reviewer.profile.startsWith("/uploads") ||
                reviewer.profile.startsWith("data:"))
                ? reviewer.profile
                : null);

            return (
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center overflow-hidden border border-border flex-shrink-0">
                {reviewerAvatar ? (
                  <img
                    src={reviewerAvatar}
                    alt={reviewer.name || "Reviewer"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : null}
                <span className={reviewerAvatar ? "hidden" : "flex items-center justify-center"}>
                  {reviewer.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            );
          })()}

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-heading text-sm">{reviewer.name || "Client"}</h4>
              <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                <ShieldCheck size={11} /> Verified
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted">
              {project.title && (
                <span className="font-medium text-heading/80">
                  Project: {project.title}
                </span>
              )}
              <span>•</span>
              <span>
                {new Date(review.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Overall Star Rating */}
        <div className="flex items-center gap-1.5 bg-[var(--background-secondary)] px-3 py-1.5 rounded-md border border-border/60 self-start sm:self-auto">
          <div className="flex items-center text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className={
                  star <= Math.round(review.rating)
                    ? "fill-amber-400 text-amber-500"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-xs font-bold text-heading ml-1">
            {Number(review.rating).toFixed(1)}
          </span>
        </div>
      </div>

      {/* Review Content */}
      <div className="space-y-2">
        {review.title && (
          <h5
            className="font-bold text-heading text-sm"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {review.title}
          </h5>
        )}
        <p className="text-xs sm:text-sm text-text leading-relaxed whitespace-pre-line">
          {review.comment}
        </p>
      </div>

      {/* Multi-criteria Sub-ratings */}
      {(review.qualityRating ||
        review.communicationRating ||
        review.timelinessRating ||
        review.budgetRating) && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60">
          {review.qualityRating && (
            <div className="text-[11px] px-2.5 py-1 rounded bg-[var(--background-secondary)] border border-border/60 text-muted flex items-center gap-1">
              <span>Quality:</span>
              <span className="font-bold text-heading">★ {review.qualityRating.toFixed(1)}</span>
            </div>
          )}
          {review.communicationRating && (
            <div className="text-[11px] px-2.5 py-1 rounded bg-[var(--background-secondary)] border border-border/60 text-muted flex items-center gap-1">
              <span>Communication:</span>
              <span className="font-bold text-heading">★ {review.communicationRating.toFixed(1)}</span>
            </div>
          )}
          {review.timelinessRating && (
            <div className="text-[11px] px-2.5 py-1 rounded bg-[var(--background-secondary)] border border-border/60 text-muted flex items-center gap-1">
              <span>Deadlines:</span>
              <span className="font-bold text-heading">★ {review.timelinessRating.toFixed(1)}</span>
            </div>
          )}
          {review.budgetRating && (
            <div className="text-[11px] px-2.5 py-1 rounded bg-[var(--background-secondary)] border border-border/60 text-muted flex items-center gap-1">
              <span>Budget Adherence:</span>
              <span className="font-bold text-heading">★ {review.budgetRating.toFixed(1)}</span>
            </div>
          )}
        </div>
      )}

      {/* Existing Reply */}
      {review.reply ? (
        <div className="ml-4 sm:ml-6 mt-3 p-3.5 bg-[var(--background-secondary)]/80 rounded-md border-l-4 border-l-[var(--primary)] text-xs space-y-1">
          <div className="flex items-center justify-between text-muted">
            <span className="font-bold text-heading flex items-center gap-1">
              <CornerDownRight size={13} /> Response from {reviewee.name || "Specialist"}
            </span>
            {review.repliedAt && (
              <span className="text-[10px]">
                {new Date(review.repliedAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <p className="text-text leading-relaxed pl-4">{review.reply}</p>
        </div>
      ) : (
        /* Reply Button for the Reviewee */
        isMyReceivedReview && !isReplying && (
          <div className="pt-2">
            <button
              onClick={() => setIsReplying(true)}
              className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
            >
              <MessageSquare size={13} /> Reply to this review
            </button>
          </div>
        )
      )}

      {/* Reply Input Form */}
      {isReplying && (
        <form
          onSubmit={handlePostReply}
          className="mt-3 p-3 bg-[var(--background-secondary)] rounded-md border border-border space-y-2"
        >
          <div className="text-xs font-bold text-heading">Your Official Response:</div>
          <textarea
            rows={3}
            required
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a polite, professional reply thanking the client or addressing their feedback..."
            className="w-full p-2.5 text-xs bg-white border border-border rounded focus:outline-none focus:border-[var(--primary)] text-heading"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsReplying(false)}
              className="px-3 py-1.5 rounded text-xs font-medium border border-border bg-white text-muted hover:text-heading"
              disabled={isPostingReply}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPostingReply || !replyText.trim()}
              className="px-4 py-1.5 rounded text-xs font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] flex items-center gap-1 transition"
            >
              <Send size={12} /> {isPostingReply ? "Posting..." : "Post Reply"}
            </button>
          </div>
        </form>
      )}

      {/* Author Edit & Delete Actions */}
      {isMyGivenReview && (
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-xs font-semibold text-[var(--gold)] hover:underline flex items-center gap-1 py-1 px-2 rounded hover:bg-[var(--gold)]/10 transition"
          >
            <Edit2 size={12} /> Edit Review
          </button>
          <button
            onClick={handleDeleteReview}
            disabled={isDeletingReview}
            className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1 py-1 px-2 rounded hover:bg-red-50 transition"
          >
            <Trash2 size={12} /> {isDeletingReview ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}

      {/* Edit Review Modal */}
      {isEditModalOpen && (
        <SubmitReviewModal
          existingReview={review}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            if (onReviewUpdated) onReviewUpdated();
          }}
        />
      )}
    </div>
  );
}
