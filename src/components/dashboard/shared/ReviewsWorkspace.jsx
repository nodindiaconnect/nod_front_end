import React, { useState } from "react";
import {
  Star,
  MessageSquare,
  FileCheck,
  Send,
  Search,
  Filter,
  CheckCircle2,
  Award,
  Sparkles,
  Plus,
  Briefcase,
  Users,
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
    <div className="w-full py-2 px-3 sm:px-6 lg:px-10 sm:py-6 space-y-6">
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
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm text-xs font-semibold text-white transition shadow-sm self-start sm:self-auto"
          style={{ backgroundColor: "var(--primary)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--primary-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--primary)")
          }
        >
          <Plus size={16} /> Leave a Review
        </button>
      </div>

      {/* Aggregate Rating Breakdown Header Card (for received reviews) */}
      <ReviewsBreakdown
        summary={summary}
        activeFilter={starFilter}
        onSelectFilter={setStarFilter}
      />

      {/* Tabs Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-1">
        <div className="flex gap-1">
          {[
            { key: "received", label: "Reviews Received", count: summary.totalReviews || receivedReviews.length },
            { key: "given", label: "Reviews Given", count: givenReviews.length },
            { key: "pending", label: "Pending Reviews", count: eligibleList.length },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition ${
                  isActive
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "bg-[var(--background-secondary)] text-muted hover:text-heading"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                      isActive ? "bg-white/25 text-white" : "bg-black/10 text-heading"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Bar for Reviews */}
        {activeTab === "received" && (
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-muted" />
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-border rounded focus:outline-none focus:border-[var(--primary)] text-heading"
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
            <div className="text-center py-16 bg-white rounded-lg border border-border p-8">
              <Award size={44} className="mx-auto text-muted opacity-30 mb-3" />
              <h3
                className="text-lg font-bold text-heading"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                No Reviews Found
              </h3>
              <p className="text-xs text-muted max-w-sm mx-auto mt-1">
                {starFilter
                  ? `No ${starFilter}-star reviews found.`
                  : "You haven't received any reviews yet. Complete projects with clients to build your verified reputation!"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReceived.map((rev) => (
                <ReviewCard
                  key={rev.id}
                  review={rev}
                  isRecipientView={true}
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
            <div className="text-center py-16 bg-white rounded-lg border border-border p-8">
              <MessageSquare size={44} className="mx-auto text-muted opacity-30 mb-3" />
              <h3
                className="text-lg font-bold text-heading"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                No Reviews Given Yet
              </h3>
              <p className="text-xs text-muted max-w-sm mx-auto mt-1">
                You have not submitted reviews for any project members yet.
              </p>
              {eligibleList.length > 0 && (
                <button
                  onClick={() => setActiveTab("pending")}
                  className="mt-4 px-5 py-2 bg-[var(--primary)] text-white text-xs rounded font-semibold"
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
            <div className="text-center py-16 bg-white rounded-lg border border-border p-8">
              <CheckCircle2 size={44} className="mx-auto text-emerald-500 opacity-40 mb-3" />
              <h3
                className="text-lg font-bold text-heading"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                All Caught Up!
              </h3>
              <p className="text-xs text-muted max-w-sm mx-auto mt-1">
                You have reviewed all eligible project collaborators. As new projects progress, eligible reviews will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eligibleList.map((item, idx) => (
                <div
                  key={`${item.projectId}-${item.revieweeId}-${idx}`}
                  className="bg-white rounded-lg border border-border p-5 shadow-xs flex flex-col justify-between space-y-4"
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
                    className="w-full py-2 px-3 rounded text-xs font-semibold text-white transition flex items-center justify-center gap-1.5 shadow-xs"
                    style={{ backgroundColor: "var(--primary)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "var(--primary-hover)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "var(--primary)")
                    }
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
