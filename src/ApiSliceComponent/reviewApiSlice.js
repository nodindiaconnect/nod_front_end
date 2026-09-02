import { apiSlice } from "./jaiMaxApi";

export const reviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: (body) => ({
        url: "/reviews",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        "Reviews",
        "MyReviews",
        "UserReviews",
        "ProjectReviews",
        "EligibleReviews",
        "Project",
        "DesignerUserDetails",
        "ArchitectUserDetails",
        "ContractorUserDetails",
      ],
    }),

    getMyReviews: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/reviews/me",
        params: { page, limit },
      }),
      providesTags: ["MyReviews", "Reviews"],
    }),

    getEligibleToReview: builder.query({
      query: () => "/reviews/eligible",
      providesTags: ["EligibleReviews"],
    }),

    getUserReviews: builder.query({
      query: ({ userId, page = 1, limit = 10, rating, role } = {}) => ({
        url: `/reviews/user/${userId}`,
        params: {
          page,
          limit,
          ...(rating && { rating }),
          ...(role && { role }),
        },
      }),
      providesTags: (result, error, { userId }) => [
        { type: "UserReviews", id: userId },
        "Reviews",
      ],
    }),

    getProjectReviews: builder.query({
      query: (projectId) => `/reviews/project/${projectId}`,
      providesTags: (result, error, projectId) => [
        { type: "ProjectReviews", id: projectId },
        "Reviews",
      ],
    }),

    getReviewById: builder.query({
      query: (reviewId) => `/reviews/${reviewId}`,
      providesTags: (result, error, reviewId) => [{ type: "Reviews", id: reviewId }],
    }),

    updateReview: builder.mutation({
      query: ({ reviewId, ...body }) => ({
        url: `/reviews/${reviewId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [
        "Reviews",
        "MyReviews",
        "UserReviews",
        "ProjectReviews",
        "EligibleReviews",
        "Project",
        "DesignerUserDetails",
        "ArchitectUserDetails",
        "ContractorUserDetails",
      ],
    }),

    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        "Reviews",
        "MyReviews",
        "UserReviews",
        "ProjectReviews",
        "EligibleReviews",
        "Project",
        "DesignerUserDetails",
        "ArchitectUserDetails",
        "ContractorUserDetails",
      ],
    }),

    replyToReview: builder.mutation({
      query: ({ reviewId, reply }) => ({
        url: `/reviews/${reviewId}/reply`,
        method: "POST",
        body: { reply },
      }),
      invalidatesTags: ["Reviews", "MyReviews", "UserReviews", "ProjectReviews"],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetMyReviewsQuery,
  useGetEligibleToReviewQuery,
  useGetUserReviewsQuery,
  useGetProjectReviewsQuery,
  useGetReviewByIdQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useReplyToReviewMutation,
} = reviewApiSlice;
