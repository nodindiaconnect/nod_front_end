


import { apiSlice } from "../../../../ApiSliceComponent/jaiMaxApi"

export const designerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDesignerUserDetails: builder.query({
      query: () => "/Designer/me/userDetails",
      providesTags: ["DesignerUserDetails"],
    }),
    getDesignerQuotations: builder.query({
      query: (status) => ({
        url: "/Designer/me/quotations",
        params: status ? { status } : undefined,
      }),
      providesTags: ["DesignerQuotations"],
    }),


    getDesignerProjects: builder.query({
      query: ({ status, page = 1, limit = 10 } = {}) => ({
        url: "/Designer/me/projects",
        params: {
          ...(status && { status }),
          page,
          limit,
        },
      }),
      providesTags: ["DesignerProjects"],
    }),


    getDesignerProfile: builder.query({
      query: () => "/Designer/me/profile",
      providesTags: ["DesignerProfile"],
    }),

    updateDesignerProfile: builder.mutation({
      query: (body) => ({
        url: "/Designer/me/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["DesignerProfile", "DesignerUserDetails"],
    }),

    sendDesignerQuotation: builder.mutation({
      query: (body) => ({
        url: "/Designer/quotations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["DesignerUserDetails", "DesignerQuotations"],
    }),
    withdrawDesignerQuotation: builder.mutation({
      query: (bidId) => ({
        url: `/Designer/quotations/${bidId}/withdraw`,
        method: "PATCH",
      }),
      invalidatesTags: ["DesignerUserDetails", "DesignerQuotations"],
    }),


    getUserPortfolioWithPagination: builder.query({
      query: ({ userId, page = 1, limit = 10 }) => ({
        url: `/portfolio/${userId}/posts-paginated`,
        params: { page, limit },
      }),
      providesTags: (result, error, { userId }) => [
        { type: "UserPortfolioPaginated", id: userId },
      ],
    }),
    createPost: builder.mutation({
      query: (body) => ({
        url: "/portfolio/post/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["UserPortfolioPaginated", "Portfolios", "Feed"],
    }),
    updatePost: builder.mutation({
      query: ({ postId, ...body }) => ({
        url: `/portfolio/post/${postId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["UserPortfolioPaginated", "Portfolios", "Feed"],
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/portfolio/post/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserPortfolioPaginated", "Portfolios", "Feed"],
    }),
  }),



})

export const {
  useGetDesignerUserDetailsQuery,
  useGetDesignerQuotationsQuery,
  useGetDesignerProfileQuery,
  useUpdateDesignerProfileMutation,
  useGetDesignerProjectsQuery,
  useSendDesignerQuotationMutation,
  useWithdrawDesignerQuotationMutation,
  useGetUserPortfolioWithPaginationQuery,
  useCreatePostMutation,
  useGetPostByIdQuery,
  useUpdatePostMutation,
  useDeletePostMutation,

} = designerApiSlice


