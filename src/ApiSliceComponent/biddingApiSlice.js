import { apiSlice } from "./jaiMaxApi";

export const biddingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new bid on a project (by professional)
    createBid: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/bids/projects/${projectId}/bids`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ProjectBids", "MyBids", "Project", "DesignerProjects", "ArchitectProjects"],
    }),

    // Get all bids for a project (Client view, grouped by role)
    getProjectBids: builder.query({
      query: ({ projectId, status }) => ({
        url: `/bids/projects/${projectId}/bids`,
        method: "GET",
        params: status ? { status } : undefined,
      }),
      providesTags: (result, error, { projectId }) => [
        { type: "ProjectBids", id: projectId },
        "ProjectBids",
      ],
    }),

    // Get single bid by ID
    getBidById: builder.query({
      query: (bidId) => ({
        url: `/bids/bids/${bidId}`,
        method: "GET",
      }),
      providesTags: (result, error, bidId) => [{ type: "Bids", id: bidId }],
    }),

    // Get bids submitted by logged-in professional
    getMyBids: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page);
        if (params.limit) queryParams.append("limit", params.limit);
        if (params.status) queryParams.append("status", params.status);

        const queryString = queryParams.toString();
        return {
          url: `/bids/me${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["MyBids"],
    }),

    // Update existing bid
    updateBid: builder.mutation({
      query: ({ bidId, ...body }) => ({
        url: `/bids/bids/${bidId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { bidId }) => [
        { type: "Bids", id: bidId },
        "ProjectBids",
        "MyBids",
      ],
    }),

    // Withdraw bid
    withdrawBid: builder.mutation({
      query: (bidId) => ({
        url: `/bids/bids/${bidId}/withdraw`,
        method: "POST",
      }),
      invalidatesTags: (result, error, bidId) => [
        { type: "Bids", id: bidId },
        "ProjectBids",
        "MyBids",
        "Project",
      ],
    }),

    // Shortlist / Unshortlist bid (Client only)
    shortlistBid: builder.mutation({
      query: ({ bidId, isShortlisted = true }) => ({
        url: `/bids/bids/${bidId}/shortlist`,
        method: "PATCH",
        body: { isShortlisted },
      }),
      invalidatesTags: (result, error, { bidId }) => [
        { type: "Bids", id: bidId },
        "ProjectBids",
        "MyBids",
      ],
    }),

    // Award / Accept bid (Client only)
    acceptBid: builder.mutation({
      query: (bidId) => ({
        url: `/bids/bids/${bidId}/accept`,
        method: "POST",
      }),
      invalidatesTags: (result, error, bidId) => [
        { type: "Bids", id: bidId },
        "ProjectBids",
        "MyBids",
        "Project",
        "ProjectsList",
        "ProjectTeam",
      ],
    }),

    // Reject bid (Client only)
    rejectBid: builder.mutation({
      query: ({ bidId, reason }) => ({
        url: `/bids/bids/${bidId}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, { bidId }) => [
        { type: "Bids", id: bidId },
        "ProjectBids",
        "MyBids",
      ],
    }),
  }),
});

export const {
  useCreateBidMutation,
  useGetProjectBidsQuery,
  useGetBidByIdQuery,
  useGetMyBidsQuery,
  useUpdateBidMutation,
  useWithdrawBidMutation,
  useShortlistBidMutation,
  useAcceptBidMutation,
  useRejectBidMutation,
} = biddingApiSlice;
