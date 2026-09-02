import { apiSlice } from "../../../../ApiSliceComponent/jaiMaxApi";

export const architectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Pulled from /Architech/userDetails (ArchitechController.getUserDetails),
    // not /architect/me/overview
    getDesignerUserDetails: builder.query({
      query: () => "/Architech/userDetails",
      providesTags: ["ArchitectOverview"],
    }),
    getDesignerQuotations: builder.query({
      query: (status) => ({
        url: "/Architech/me/quotations",
        params: status ? { status } : undefined,
      }),
      providesTags: ["ArchitectQuotations"],
    }),

    getArchitectProfile: builder.query({
      query: () => "/Architech/me/profile",
      providesTags: ["ArchitectProfile"],
    }),

    updateArchitectProfile: builder.mutation({
      query: (body) => ({
        url: "/Architech/me/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ArchitectProfile", "ArchitectOverview"],
    }),

    // Aliases for compatibility
    getDesignerProfile: builder.query({
      query: () => "/Architech/me/profile",
      providesTags: ["ArchitectProfile"],
    }),

    updateDesignerProfile: builder.mutation({
      query: (body) => ({
        url: "/Architech/me/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ArchitectProfile", "ArchitectOverview"],
    }),

    getArchitechProjects: builder.query({
      query: ({ status, page = 1, limit = 10 } = {}) => ({
        url: "/Architech/me/projects",
        params: {
          ...(status && { status }),
          page,
          limit,
        },
      }),
      providesTags: ["DesignerProjects"],
    }),
    sendArchitectQuotation: builder.mutation({
      query: (body) => ({
        url: "/Architech/quotations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ArchitectOverview", "ArchitectQuotations"],
    }),
    withdrawArchitectQuotation: builder.mutation({
      query: (bidId) => ({
        url: `/Architech/quotations/${bidId}/withdraw`,
        method: "PATCH",
      }),
      invalidatesTags: ["ArchitectOverview", "ArchitectQuotations"],
    }),
  }),
});

export const {
  useGetDesignerUserDetailsQuery,
  useGetDesignerQuotationsQuery,
  useGetArchitectProfileQuery,
  useUpdateArchitectProfileMutation,
  useGetDesignerProfileQuery,
  useUpdateDesignerProfileMutation,
  useGetArchitechProjectsQuery,
  useSendArchitectQuotationMutation,
  useWithdrawArchitectQuotationMutation,
} = architectApiSlice;
