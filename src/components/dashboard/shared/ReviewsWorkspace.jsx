import React, { useState } from "react";
import {
  Star,
  MessageSquareText,
  UserPlus,
  Search,
  CheckCircle2,
  Award,
} from "lucide-react";
import ReviewCard from "./ReviewCard";
import ReviewsBreakdown from "./ReviewsBreakdown";
import SubmitReviewModal from "./SubmitReviewModal";
import Loader from "../../../global/Loader";
import Pagination from "../../../global/pagination";
import {
  useGetMyReviewsQuery,
  useGetEligibleToReviewQuery,
} from "../../../ApiSliceComponent/reviewApiSlice";

export default function ReviewsWorkspace({ roleTitle = "Client" }) {
  const [activeTab, setActiveTab] = useState("received"); // "received" | "given" | "pending"
  const [starFilter, setStarFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(null);

  // Queries
  const {
    data: reviewsRes,
    isLoading: loadingReviews,
    isFetching: fetchingReviews,
    refetch: refetchReviews,
  } = useGetMyReviewsQuery({
    page: currentPage,
    limit: 10,
  });

  const {
    data: eligibleRes,
    isLoading: loadingEligible,
    refetch: refetchEligible,
  } = useGetEligibleToReviewQuery();

  const receivedReviews = reviewsRes?.data?.received || [];
  const givenReviews = reviewsRes?.data?.given || [];
  const summary = reviewsRes?.data?.summary || {};
  const pagination = reviewsRes?.data?.pagination;
  const eligibleList = eligibleRes?.data || reviewsRes?.data?.eligible || [];

  // Filter received reviews by star & search
  const filteredReceived = receivedReviews.filter((r) => {
    if (starFilter && Math.round(r.rating) !== Number(starFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchComment = r.comment?.toLowerCase().includes(q);
      const matchTitle = r.title?.toLowerCase().includes(q);
      const matchReviewer = r.reviewer?.name?.toLowerCase().includes(q);
      const matchProject = r.project?.title?.toLowerCase().includes(q);
      if (!matchComment && !matchTitle && !matchReviewer && !matchProject) return false;
    }
    return true;
  });

  const handleOpenSubmitReview = (target = null) => {
    setSelectedTarget(target);
    setIsSubmitModalOpen(true);
  };

  return (
    <div className="w-full py-2 px-3 sm:px-6 lg:px-10 sm:py-6 space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-heading"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Reviews & Ratings
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            Client feedback, verified performance ratings, and project reviews.
          </p>
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => handleOpenSubmitReview(null)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-white transition self-start sm:self-auto"
          style={{ backgroundColor: "var(--heading)", boxShadow: "0 2px 6px rgba(0,0,0,0.18)" }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <span className="text-base leading-none">+</span> Leave a Review
        </button>
      </div>

      {/* Aggregate Rating Breakdown Header Card (for received reviews) */}
      <ReviewsBreakdown
        summary={summary}
        activeFilter={starFilter}
        onSelectFilter={setStarFilter}
      />

      {/* Tabs Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "received", label: "Reviews Received" },
            { key: "given", label: "Reviews Given" },
            { key: "pending", label: "Pending Reviews" },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors"
                style={{
                  backgroundColor: isActive ? "var(--heading)" : "var(--background-secondary)",
                  color: isActive ? "#fff" : "var(--muted)",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Bar for Reviews */}
        {activeTab === "received" && (
          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-border rounded-md focus:outline-none focus:border-[var(--primary)] text-heading"
            />
          </div>
        )}
      </div>

      {/* TAB 1: REVIEWS RECEIVED */}
      {activeTab === "received" && (
        <div className="space-y-4">
          {/* Active Star Filter Pill */}
          {starFilter && (
            <div className="flex items-center gap-2 text-xs bg-[var(--gold)]/10 px-3 py-1.5 rounded-md text-heading border border-[var(--gold)]/30">
              <span>Showing {starFilter}-Star Reviews</span>
              <button
                onClick={() => setStarFilter(null)}
                className="text-[11px] font-bold text-[var(--primary)] underline ml-2"
              >
                Clear Filter
              </button>
            </div>
          )}

          {loadingReviews ? (
            <Loader />
          ) : filteredReceived.length === 0 ? (
            <div
              className="text-center py-20 bg-white rounded-md border border-border"
              style={{ boxShadow: "0 1px 2px rgba(16,24,40,0.04)" }}
            >
              <div
                className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
                style={{ backgroundColor: "var(--background-secondary)" }}
              >
                <MessageSquareText size={30} style={{ color: "var(--heading)" }} strokeWidth={1.75} />
              </div>
              <h3
                className="text-xl font-bold text-heading"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                No Reviews Found
              </h3>
              <p className="text-sm text-muted max-w-sm mx-auto mt-2 leading-relaxed">
                {starFilter ? (
                  `No ${starFilter}-star reviews found.`
                ) : (
                  <>
                    You haven't received any reviews yet.
                    <br />
                    Complete projects with clients to build your verified reputation!
                  </>
                )}
              </p>
              <button
                onClick={() => handleOpenSubmitReview(null)}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-md border text-sm font-semibold text-heading transition-colors"
                style={{ borderColor: "var(--heading)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--background-secondary)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <UserPlus size={16} /> Leave a Review
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReceived.map((rev) => (
                <ReviewCard
                  key={rev.id}
                  review={rev}
                  isRecipientView={true}
                  onReviewUpdated={() => {
                    refetchReviews();
                    refetchEligible();
                  }}
                  onReviewDeleted={() => {
                    refetchReviews();
                    refetchEligible();
                  }}
                />
              ))}

              {pagination?.totalPages > 1 && (
                <Pagination
                  pagination={pagination}
                  onPageChange={setCurrentPage}
                  isFetching={fetchingReviews}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REVIEWS GIVEN */}
      {activeTab === "given" && (
        <div className="space-y-4">
          {loadingReviews ? (
            <Loader />
          ) : givenReviews.length === 0 ? (
            <div
              className="text-center py-20 bg-white rounded-md border border-border"
              style={{ boxShadow: "0 1px 2px rgba(16,24,40,0.04)" }}
            >
              <div
                className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
                style={{ backgroundColor: "var(--background-secondary)" }}
              >
                <MessageSquareText size={30} style={{ color: "var(--heading)" }} strokeWidth={1.75} />
              </div>
              <h3
                className="text-xl font-bold text-heading"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                No Reviews Given Yet
              </h3>
              <p className="text-sm text-muted max-w-sm mx-auto mt-2">
                You have not submitted reviews for any project members yet.
              </p>
              {eligibleList.length > 0 && (
                <button
                  onClick={() => setActiveTab("pending")}
                  className="mt-6 px-5 py-2.5 text-white text-sm rounded-md font-semibold"
                  style={{ backgroundColor: "var(--heading)" }}
                >
                  Review Pending Projects ({eligibleList.length})
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {givenReviews.map((rev) => (
                <ReviewCard
                  key={rev.id}
                  review={rev}
                  isRecipientView={false}
                  onReviewUpdated={() => {
                    refetchReviews();
                    refetchEligible();
                  }}
                  onReviewDeleted={() => {
                    refetchReviews();
                    refetchEligible();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PENDING / ELIGIBLE REVIEWS */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          {loadingEligible ? (
            <Loader />
          ) : eligibleList.length === 0 ? (
            <div
              className="text-center py-20 bg-white rounded-md border border-border"
              style={{ boxShadow: "0 1px 2px rgba(16,24,40,0.04)" }}
            >
              <div
                className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
                style={{ backgroundColor: "#eafaf0" }}
              >
                <CheckCircle2 size={30} className="text-emerald-500" strokeWidth={1.75} />
              </div>
              <h3
                className="text-xl font-bold text-heading"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                All Caught Up!
              </h3>
              <p className="text-sm text-muted max-w-sm mx-auto mt-2 leading-relaxed">
                You have reviewed all eligible project collaborators. As new projects progress, eligible reviews will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eligibleList.map((item, idx) => (
                <div
                  key={`${item.projectId}-${item.revieweeId}-${idx}`}
                  className="bg-white rounded-md border border-border p-5 flex flex-col justify-between space-y-4"
                  style={{ boxShadow: "0 1px 2px rgba(16,24,40,0.04)" }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-[var(--gold)]/20 text-black">
                        {item.revieweeRole?.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs text-muted truncate max-w-[120px]">
                        {item.projectCategory}
                      </span>
                    </div>

                    <h4
                      className="font-bold text-heading text-base line-clamp-1"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {item.revieweeName}
                    </h4>

                    <p className="text-xs text-muted line-clamp-1">
                      Project: <span className="font-semibold text-heading">{item.projectTitle}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenSubmitReview(item)}
                    className="w-full py-2.5 px-3 rounded-md text-xs font-semibold text-white transition flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: "var(--heading)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    <Star size={13} className="fill-white" /> Write Review
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Submit Review Modal */}
      {isSubmitModalOpen && (
        <SubmitReviewModal
          target={selectedTarget}
          eligibleList={eligibleList}
          onClose={() => {
            setIsSubmitModalOpen(false);
            setSelectedTarget(null);
          }}
          onSuccess={() => {
            refetchReviews();
            refetchEligible();
          }}
        />
      )}
    </div>
  );
}